import {useState, useEffect, useContext} from 'preact/hooks';
import {Button, Stack, Theme, useMediaQuery} from "@mui/material";
import {Card} from "../types/types.tsx";
import CardComponent from "../components/CardComponent.tsx";
import {AppState} from "../screens/ViewController.tsx";
import {AppConfig} from "../config.tsx";

export default function CardsLoader({charClass, secondaryCharClass, fixed_buttons, onCardClick}: {
    charClass: string,
    secondaryCharClass: string,
    fixed_buttons: boolean,
    onCardClick: (card: Card) => void
}) {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(0);
    const {searchText} = useContext(AppState);
    const isMdScreenOrSmaller = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    // Define card size
    const CARD_WIDTH = isMdScreenOrSmaller ? 100 : 200; // Adjust this value based on your card size
    // const CARD_HEIGHT = 352; // Adjust this value based on your card size

    // Calculate the number of cards that can fit on the screen
    const cardsPerRow = Math.floor(window.innerWidth / CARD_WIDTH);
    // const cardsPerColumn = Math.floor(window.innerHeight / CARD_HEIGHT);
    const totalCardsOnScreen = cardsPerRow * 3;

    // Reset page to 0 when searchQuery changes
    useEffect(() => {
        setPage(0);
    }, [searchText.value]);

    const fetchCards = async ({page, charClass, secondaryCharClass, size}: {
        page: any,
        charClass: any,
        secondaryCharClass: any,
        size: any
    }) => {
        fetch(AppConfig.API_URL + `/card?page=${page}&size=${size}&searchQuery=${searchText.value}&charClass=${charClass}&secondaryCharClass=${secondaryCharClass}`,
            {
                method: 'GET'
            }).then(response => response.json())
            .then(data => setCards(data));
    }
    useEffect(() => {
        try {
            fetchCards({
                page: page,
                charClass: charClass,
                secondaryCharClass: secondaryCharClass,
                size: fixed_buttons ? 25 : totalCardsOnScreen
            }).then(r => r);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [page, charClass, secondaryCharClass, searchText.value, fixed_buttons]);

    return (
        <Stack direction="column">
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMdScreenOrSmaller ? 'repeat(auto-fit, minmax(100px, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gridGap: '10px'
            }}>
                {cards.map((card) => (
                    <CardComponent card={card} onCardClick={onCardClick}/>
                ))}
            </div>
            {fixed_buttons ? (
                <Stack spacing={{xs: 1, sm: 2}} sx={{marginTop: 2}} direction="row" justifyContent={"center"}
                       useFlexGap>
                    <Button variant="contained" onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))}>Previous
                        page</Button>
                    <Button variant="contained" onClick={() => setPage(oldPage => oldPage + 1)}>Next page</Button>
                </Stack>
            ) : (
                <Stack spacing={{xs: 1, sm: 2}} sx={{marginTop: 2}} direction="row"
                       justifyContent={"center"} marginBottom="10px" useFlexGap flexWrap="wrap">
                    <Button variant="contained" onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))}>Previous
                        page</Button>
                    <Button variant="contained" onClick={() => setPage(oldPage => oldPage + 1)}>Next page</Button>
                </Stack>
            )}
        </Stack>
    );
}