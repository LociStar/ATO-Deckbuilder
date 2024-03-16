import {Stack} from "@mui/material";
import {useState, useEffect} from "preact/hooks";
import {Deck} from "../types/types";
import CardComponent from "../components/CardComponent.tsx";
import {useAuth} from "react-oidc-context";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {calculate_deck_cost} from "../utils/utils.ts";

export default function DeckDetailsView() {
    const [deck, setDeck] = useState<Deck>();
    const [deckCost, setDeckCost] = useState(0);
    const [cardCraftingModifier, setCardCraftingModifier] = useState(1);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(1);
    const auth = useAuth();

    useEffect(() => {
        if (!deck?.cardList) return;
        setDeckCost(calculate_deck_cost(deck!.cardList, cardCraftingModifier, cardUpgradingModifier));
    }, [deck?.cardList, cardCraftingModifier, cardUpgradingModifier]);

    useEffect(() => {
        // sort cards by rarity 'Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'
        if (!deck?.cardList) return;
        deck.cardList.sort((a, b) => {
            const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'];
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        });
    }, [deck]);

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
            .then(data => setDeck(data));
    }, [auth]);

    function onCardClick() {
    }

    return (
        <Stack>
            <Stack display="flex" justifyContent="center" alignItems="center">
                <Typography variant="h2">
                    {deck?.title}
                </Typography>
                <Typography variant="h4">
                    Description:
                </Typography>
                <Typography variant="body1">
                    {deck?.description}
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
            <Stack direction="column" marginLeft={30} marginRight={30} marginBottom={10}>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: '10px'}}>
                    {deck && deck.cardList.map((card) => (
                        <CardComponent card={card} token={auth.user?.access_token} onCardClick={onCardClick}/>
                    ))}
                </div>
            </Stack>
        </Stack>

    );
}