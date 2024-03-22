import {useState, useEffect, useContext} from 'preact/hooks';
import {Button, Stack} from "@mui/material";
import {Card} from "../types/types.tsx";
import {useAuth} from "react-oidc-context";
import CardComponent from "../components/CardComponent.tsx";
import {AppState} from "../app.tsx";

export default function CardsView({charClass, secondaryCharClass, component, onCardClick}: {
    charClass: string,
    secondaryCharClass: string,
    component: boolean,
    onCardClick: (card: Card) => void
}) {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(0);
    const auth = useAuth();
    const {searchText} = useContext(AppState);

    // Reset page to 0 when searchQuery changes
    useEffect(() => {
        setPage(0);
    }, [searchText.value]);

    const fetchCards = async ({page, charClass, secondaryCharClass}: {
        page: any,
        charClass: any,
        secondaryCharClass: any
    }) => {
        fetch(`http://localhost:8080/card?page=${page}&size=24&searchQuery=${searchText.value}&charClass=${charClass}&secondaryCharClass=${secondaryCharClass}`,
            {
                method: 'GET'
            }).then(response => response.json())
            .then(data => setCards(data));
    }
    // effect(() => {
    //     if (!auth.user?.access_token) return;
    //     try {
    //         fetchCards({
    //             page: page,
    //             searchQuery: searchQuery,
    //             charClass: charClass,
    //             secondaryCharClass: secondaryCharClass
    //         }).then(r => r);
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // });
    useEffect(() => {
        if (!auth.user?.access_token) return;
        try {
            fetchCards({
                page: page,
                charClass: charClass,
                secondaryCharClass: secondaryCharClass
            }).then(r => r);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [page, charClass, secondaryCharClass, searchText.value]);

    return (
        <Stack direction="column">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: '10px'}}>
                {cards.map((card) => (
                    <CardComponent card={card} onCardClick={onCardClick}/>
                ))}
            </div>
            {component ? (
                <Stack spacing={{xs: 1, sm: 2}} sx={{marginTop: 2}} direction="row" justifyContent={"center"}
                       useFlexGap>
                    <Button variant="contained" onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))}>Previous
                        page</Button>
                    <Button variant="contained" onClick={() => setPage(oldPage => oldPage + 1)}>Next page</Button>
                </Stack>
            ) : (
                <Stack spacing={{xs: 1, sm: 2}} position="fixed" bottom="0" left="0" right="0" direction="row"
                       justifyContent={"center"} marginBottom="10px" useFlexGap flexWrap="wrap">
                    <Button variant="contained" onClick={() => setPage(oldPage => Math.max(oldPage - 1, 0))}>Previous
                        page</Button>
                    <Button variant="contained" onClick={() => setPage(oldPage => oldPage + 1)}>Next page</Button>
                </Stack>
            )}
        </Stack>
    );
}