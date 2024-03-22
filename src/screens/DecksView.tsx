import {Fab, Stack} from "@mui/material";
import CharCard from "../components/CharCard";
import {useState, useEffect} from "preact/hooks";
import {Deck} from "../types/types";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

export default function DecksView() {
    const [decks, setDecks] = useState<Deck[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/deck')
            .then(response => response.json())
            .then(data => setDecks(data));
    }, []);

    return (
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Stack alignItems="center" justifyContent={'center'} spacing={2}>
                {decks.map((deck) => (
                    <CharCard key={deck.id} deck={deck}/>
                ))}
            </Stack>
            <Fab color="secondary" aria-label="add" style={{position: 'fixed', right: '10px', bottom: '10px'}}>
                <AddIcon />
            </Fab>
        </Box>
    );
}