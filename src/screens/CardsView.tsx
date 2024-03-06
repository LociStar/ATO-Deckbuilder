import {useState, useEffect} from 'preact/hooks';
import {Button, Stack} from "@mui/material";
import {Card} from "../types/types.tsx";
import {useAuth} from "react-oidc-context";
import CardComponent from "../components/CardComponent.tsx";

export default function CardsView({searchQuery, charClass, secondaryCharClass, component, onCardClick}: {
    searchQuery: string,
    charClass: string,
    secondaryCharClass: string,
    component: boolean,
    onCardClick: (card: Card) => void
}) {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(0);
    const auth = useAuth();

    // Reset page to 0 when searchQuery changes
    useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    const fetchCards = async ({page, searchQuery, charClass, secondaryCharClass, token}: { page: any, searchQuery: any, charClass: any, secondaryCharClass: any, token: any }) => {
        fetch(`http://localhost:8080/card?page=${page}&size=24&searchQuery=${searchQuery}&charClass=${charClass}&secondaryCharClass=${secondaryCharClass}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                }
            }).then(response => response.json())
            .then(data => setCards(data));
    }

    useEffect(() => {
        if (!auth.user?.access_token) return;
        try {
            fetchCards({page: page, searchQuery: searchQuery, charClass: charClass, secondaryCharClass: secondaryCharClass, token: auth.user?.access_token}).then(r => r);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [page, searchQuery, charClass, secondaryCharClass, auth.user?.access_token]);

    return (
        <Stack direction="column">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: '10px'}}>
                {cards.map((card) => (
                    <CardComponent card={card} token={auth.user?.access_token} onCardClick={onCardClick}/>
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