import {Fab, FormControl, InputLabel, MenuItem, Pagination, Select, Stack} from "@mui/material";
import CharCard from "../components/CharCard";
import {useEffect, useState} from "preact/hooks";
import {Character, Deck, PagedDeck} from "../types/types";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import {AppConfig} from "../config.tsx";
import {useNavigate} from "react-router-dom";
import {alpha} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import {useAuth} from "react-oidc-context";

export default function DecksView() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const defaultCharacter: Character = {characterId: 'All', characterClass: '', secondaryCharacterClass: ''};
    const [characters, setCharacters] = useState<Character[]>([defaultCharacter]);
    const [filter, setFilter] = useState('likes');
    const [characterFilter, setCharacterFilter] = useState<String>('All');
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    const auth = useAuth();

    useEffect(() => {
        fetch(AppConfig.API_URL + '/character')
            .then(response => response.json())
            .then(data => {
                data = [defaultCharacter, ...data]
                setCharacters(data);
            });
    }, []);

    useEffect(() => {
        let charId = characterFilter === 'All' ? '' : characterFilter;
        let sortByLikesFirst = filter === 'likes';
        fetch(AppConfig.API_URL + `/deck?size=10&page=${page}&charId=${charId}&sortByLikesFirst=${sortByLikesFirst}`)
            .then(response => response.json())
            .then((data: PagedDeck) => {
                setPages(data.pages)
                setDecks(data.decks);
            });
    }, [filter, characterFilter, page]);

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
                    <FormControl sx={{minWidth: 100}}>
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
                    <FormControl sx={{minWidth: 120}}>
                        <InputLabel id="character-filter-label">Character Filter</InputLabel>
                        <Select
                            labelId="character-filter-label"
                            id="character-filter-select"
                            value={characterFilter}
                            label="Character Filter"
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                setCharacterFilter(target.value);
                            }}
                        >
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
                <Pagination count={pages} page={page} onChange={(_event, value) => {
                    setPage(value);
                }} color="primary"
                            sx={{
                                marginTop: 2,
                                backdropFilter: 'blur(50px)',
                                backgroundColor: alpha('#000000', 0.5),
                                borderRadius: 1
                            }}/>
            </Stack>
            <Fab aria-label="add" style={{position: 'fixed', right: '10px', bottom: '10px'}}
                 onClick={onCardActionClick}>
                <AddIcon/>
            </Fab>
        </Box>
    );
}