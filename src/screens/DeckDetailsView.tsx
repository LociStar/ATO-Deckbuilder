import {FormControl, InputLabel, List, Select, SelectChangeEvent, Stack} from "@mui/material";
import {useState, useEffect} from "preact/hooks";
import {Card, Deck} from "../types/types";
import CardComponent from "../components/CardComponent.tsx";
import {useAuth} from "react-oidc-context";
import Typography from "@mui/material/Typography";
import {calculate_deck_cost} from "../utils/utils.ts";

import MenuItem from "@mui/material/MenuItem";
import {EnergyCostGraph} from "../components/graphs/EnergyCostGraph.tsx";
import {RarityGraph} from "../components/graphs/RarityGraph.tsx";

export default function DeckDetailsView() {
    const [deck, setDeck] = useState<Deck>();
    const [deckCost, setDeckCost] = useState(0);
    const [cardCraftingModifier, setCardCraftingModifier] = useState(1);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(1);
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
            // .then(data => {
            //     console.log(data);
            //     return data;
            // })
            .then(data => {
                setDeck(data);

                // Sort the cards by filter
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
                            onChange={handleFilterChange}>
                            <MenuItem value="energy">Energy Cost</MenuItem>
                            <MenuItem value='rarity'>Rarity</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{m: 1, minWidth: 120}} size="small">
                        <InputLabel id="crafting-modifier-label">Craft Reduction</InputLabel>
                        <Select
                            labelId="crafting-modifier-label"
                            id="crafting-modifier-small"
                            value={cardCraftingModifier}
                            label="Craft Reduction"
                            onChange={event => setCardCraftingModifier(Number((event.target as HTMLSelectElement).value))}>
                            <MenuItem value={1}>No Reduction</MenuItem>
                            <MenuItem value={0.25}>25%</MenuItem>
                            <MenuItem value={0.5}>50%</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{m: 1, minWidth: 120}} size="small">
                        <InputLabel id="upgrading-modifier-label">Upgrade Reduction</InputLabel>
                        <Select
                            labelId="upgrading-modifier-label"
                            id="upgrading-modifier-small"
                            value={cardUpgradingModifier}
                            label="Upgrade Reduction"
                            onChange={event => setCardUpgradingModifier(Number((event.target as HTMLSelectElement).value))}>
                            <MenuItem value={1}>No Reduction</MenuItem>
                            <MenuItem value={0.25}>25%</MenuItem>
                            <MenuItem value={0.5}>50%</MenuItem>
                        </Select>
                    </FormControl>
                    <EnergyCostGraph cardList={deck?.cardList || []}/>
                    <RarityGraph cardList={deck?.cardList || []}/>
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