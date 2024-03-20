import {FormControl, InputLabel, List, Select, SelectChangeEvent, Stack} from "@mui/material";
import {useState, useEffect} from "preact/hooks";
import {Card, Deck} from "../types/types";
import CardComponent from "../components/CardComponent.tsx";
import {useAuth} from "react-oidc-context";
import Typography from "@mui/material/Typography";
import {calculate_deck_cost} from "../utils/utils.ts";

import {BarChart} from '@mui/x-charts/BarChart';
import MenuItem from "@mui/material/MenuItem";

export default function DeckDetailsView() {
    const [deck, setDeck] = useState<Deck>();
    const [deckCost, setDeckCost] = useState(0);
    const [cardCraftingModifier, setCardCraftingModifier] = useState(1);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(1);
    const [energyCostDataset, setEnergyCostDataset] = useState<{ energy: string, amount: number }[]>([{
        energy: '1',
        amount: 0
    }, {energy: '2', amount: 0}, {energy: '3', amount: 0}, {energy: '4', amount: 0}, {energy: '5+', amount: 0}]);
    const [averageEnergyCost, setAverageEnergyCost] = useState<number>(0);
    const [filter, setFilter] = useState('energy');
    const auth = useAuth();

    useEffect(() => {
        if (!deck?.cardList) return;
        setDeckCost(calculate_deck_cost(deck!.cardList, cardCraftingModifier, cardUpgradingModifier));
    }, [deck?.cardList, cardCraftingModifier, cardUpgradingModifier]);

    function sortCardsByRarity(data: Deck) {
        // sort cards by rarity 'Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'
        const sortedCardList = [...data.cardList].sort((a: Card, b: Card) => {
            const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'];
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        });
        setDeck({...data, cardList: sortedCardList});
    }

    function sortCardsByEnergy(data: Deck) {
        // sort cards by energy cost
        const sortedCardList = [...data.cardList].sort((a: Card, b: Card) => {
            return a.energyCost - b.energyCost;
        });
        setDeck({...data, cardList: sortedCardList});
    }

    useEffect(() => {
        if (!deck) return;
        console.log(filter)
        switch (filter) {
            case 'rarity':
                sortCardsByRarity(deck!);
                break;
            case 'energy':
                sortCardsByEnergy(deck!);
                break;
            default:
                sortCardsByEnergy(deck!);
        }
    }, [filter]);

    useEffect(() => {
        if (!auth.user?.access_token) return;
        fetch('http://localhost:8080/deck/16'
            , {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })
            .then(data => {
                setDeck(data);

                switch (filter) {
                    case 'rarity':
                        sortCardsByRarity(data);
                        break;
                    case 'energy':
                        sortCardsByEnergy(data);
                        break;
                    default:
                        sortCardsByEnergy(data);
                }

                // Calculate the count of cards with energy cost of 1, 2, 3, 4, 5+
                let totalEnergyCost = 0;
                const costs = data.cardList.reduce((acc: number[], card: Card) => {
                    if (card.energyCost >= 1 && card.energyCost <= 5) {
                        acc[card.energyCost - 1]++;
                    } else if (card.energyCost > 5) {
                        acc[4]++;
                    }
                    totalEnergyCost += card.energyCost;
                    return acc;
                }, [0, 0, 0, 0, 0]);

                const averageCost = totalEnergyCost / data.cardList.length;

                const newEnergyCostDataset = costs.map((cost: number, index: number) => ({
                    energy: (index + 1).toString(),
                    amount: cost,
                }));

                // Update the energyCostDataset state and the averageEnergyCost state
                setEnergyCostDataset(newEnergyCostDataset);
                setAverageEnergyCost(averageCost);
            });
    }, [auth]);

    function onCardClick() {
    }

    function handleFilterChange(event: SelectChangeEvent<string>) {
        const target = event.target as HTMLSelectElement;
        setFilter(target.value);
    }

    return (
        <Stack>
            <Stack display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h2">
                    {deck?.title}
                </Typography>
                <Typography variant="h4">
                    Made by {deck?.username}
                </Typography>
                <Typography variant="body2">
                    Deck cost: {deckCost}
                </Typography>
                <Typography variant="h4">
                    Cards
                </Typography>
            </Stack>

            <Stack direction="row" marginRight={10} marginLeft={10}>
                <List>
                    <FormControl sx={{m: 1, minWidth: 120}} size="small">
                        <InputLabel id="sort-select-label">Sort by</InputLabel>
                        <Select
                            labelId="sort-select-label"
                            id="sort-select-small"
                            value={filter}
                            label="Sort by"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value="energy">Energy Cost</MenuItem>
                            <MenuItem value='rarity'>Rarity</MenuItem>
                        </Select>
                    </FormControl>
                    <BarChart width={500} height={300}
                              dataset={energyCostDataset}
                              series={[
                                  {
                                      label: 'Amount',
                                      dataKey: 'amount',
                                      color: '#ff9f13',
                                  },
                              ]}
                              xAxis={[{scaleType: 'band', dataKey: 'energy', label: 'Energy'}]}
                    />
                    <Typography variant="body2">
                        Average energy cost: {averageEnergyCost}
                    </Typography>
                </List>
                <Stack direction="column" marginLeft={10} marginRight={20} marginBottom={10}
                       flexBasis="50%"> {/* Adjust this value to control the width of the card list */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: '10px'}}>
                        {deck && deck.cardList.map((card) => (
                            <CardComponent card={card} token={auth.user?.access_token} onCardClick={onCardClick}/>
                        ))}
                    </div>
                </Stack>
            </Stack>
            <Stack display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h4">
                    Description:
                </Typography>
                <Typography variant="body1">
                    {deck?.description}
                </Typography>
            </Stack>
        </Stack>

    );
}