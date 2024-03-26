import {Fab, Stack, Select, MenuItem, FormControl, InputLabel} from "@mui/material";
import CharCard from "../components/CharCard";
import {useState, useEffect} from "preact/hooks";
import {Deck, Character} from "../types/types";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import {AppConfig} from "../config.tsx";
import {useNavigate} from "react-router-dom";
import {alpha} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import {useAuth} from "react-oidc-context";

export default function DecksView() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [filter, setFilter] = useState('likes');
    const [characterFilter, setCharacterFilter] = useState('All');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const auth = useAuth();

    useEffect(() => {
        fetch(AppConfig.API_URL + '/character')
            .then(response => response.json())
            .then(data => setCharacters(data));
    }, []);

    useEffect(() => {
        fetch(AppConfig.API_URL + '/deck')
            .then(response => response.json())
            .then(data => {
                let sortedData;
                switch (filter) {
                    case 'likes':
                        sortedData = data.sort((a: Deck, b: Deck) => b.likes - a.likes);
                        break;
                    case 'name':
                        sortedData = data.sort((a: Deck, b: Deck) => a.title.localeCompare(b.title));
                        break;
                    default:
                        sortedData = data;
                }
                if (characterFilter !== 'All') {
                    sortedData = sortedData.filter((deck: Deck) => deck.characterId === characterFilter);
                }
                setDecks(sortedData);
            });
    }, [filter, characterFilter]);

    function onCardActionClick() {
        if (!auth.user) {
            enqueueSnackbar('You need to be logged in to create decks', {
                variant: 'error',
                autoHideDuration: 5000
            });
            return;
        }
        return navigate('/deckbuilder/');
    }

    return (
        <Box>
            <Stack alignItems="center" justifyContent={'center'} spacing={2} ml={1} mr={1}>
                <Stack direction="row" spacing={5} sx={{
                    padding: 2,
                    borderRadius: 1,
                    backdropFilter: 'blur(50px)',
                    backgroundColor: alpha('#000000', 0.5),
                }}>
                    <FormControl sx={{minWidth: 100 }}>
                        <InputLabel id="filter-label">Sort By</InputLabel>
                        <Select
                            labelId="filter-label"
                            id="filter-select"
                            value={filter}
                            label="Sort By"
                            onChange={(e) => setFilter((e.target as HTMLSelectElement).value)}
                        >
                            <MenuItem value={'likes'}>Likes</MenuItem>
                            <MenuItem value={'name'}>Name</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{minWidth: 120 }}>
                        <InputLabel id="character-filter-label">Character Filter</InputLabel>
                        <Select
                            labelId="character-filter-label"
                            id="character-filter-select"
                            value={characterFilter}
                            label="Character Filter"
                            onChange={(e) => setCharacterFilter((e.target as HTMLSelectElement).value)}
                        >
                            <MenuItem value={'All'}>All</MenuItem>
                            {characters.map((character) => (
                                <MenuItem key={character.characterId} value={character.characterId}>
                                    {character.characterId}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
                {decks.map((deck) => (
                    <CharCard key={deck.id} deck={deck}/>
                ))}
            </Stack>
            <Fab aria-label="add" style={{position: 'fixed', right: '10px', bottom: '10px'}}
                 onClick={onCardActionClick}>
                <AddIcon/>
            </Fab>
        </Box>
    );
}