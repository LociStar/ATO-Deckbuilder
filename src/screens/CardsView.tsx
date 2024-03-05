import {useState, useEffect} from 'preact/hooks';
import {Button, Stack} from "@mui/material";
import {Card} from "../types/types.tsx";

export default function CardsView({searchQuery, charClass, secondaryCharClass, component, onCardClick}: {
    searchQuery: string,
    charClass: string,
    secondaryCharClass: string,
    component: boolean,
    onCardClick: (card: Card) => void
}) {
    const [cards, setCards] = useState<Card[]>([]);
    const [page, setPage] = useState(0);

    // Reset page to 0 when searchQuery changes
    useEffect(() => {
        setPage(0);
    }, [searchQuery]);

    useEffect(() => {
        fetch(`http://localhost:8080/card?page=${page}&size=24&searchQuery=${searchQuery}&charClass=${charClass}&secondaryCharClass=${secondaryCharClass}`, {method: 'GET'})
            .then(response => response.json())
            .then(data => setCards(data));
    }, [page, searchQuery]);

    return (
        <Stack direction="column">
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gridGap: '10px'}}>
                {cards.map((card) => (
                    <div style={{width: '100%', paddingBottom: '151.52%', position: 'relative'}}>
                        <img className="zoomEffect"
                             src={`http://localhost:8080/image/${card.id}`}
                             alt={`Card ${card.id}`}
                             style={{position: 'absolute', width: '100%', height: '100%',}}
                             onClick={() => onCardClick(card)}
                        />
                    </div>
                ))}
            </div>
            {component ? (
                <Stack spacing={{xs: 1, sm: 2}} direction="row" justifyContent={"center"} useFlexGap>
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