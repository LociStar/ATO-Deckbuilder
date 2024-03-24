import {Fab, Stack} from "@mui/material";
import CharCard from "../components/CharCard";
import {useState, useEffect} from "preact/hooks";
import {Deck} from "../types/types";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import {AppConfig} from "../config.tsx";
import {useNavigate} from "react-router-dom";

export default function DecksView() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(AppConfig.API_URL + '/deck')
            .then(response => response.json())
            .then(data => setDecks(data));
    }, []);

    function onCardActionClick() {
        return navigate('/deckbuilder/');
    }

    return (
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Stack alignItems="center" justifyContent={'center'} spacing={2}>
                {decks.map((deck) => (
                    <CharCard key={deck.id} deck={deck}/>
                ))}
            </Stack>
            <Fab aria-label="add" style={{position: 'fixed', right: '10px', bottom: '10px'}} onClick={onCardActionClick}>
                <AddIcon />
            </Fab>
        </Box>
    );
}