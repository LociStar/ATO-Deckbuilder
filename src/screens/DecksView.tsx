import {Fab, FormControl, InputLabel, MenuItem, Pagination, Select, Stack} from "@mui/material";
import CharCard from "../components/CharCard";
import {useEffect, useState} from "preact/hooks";
import {Character, Deck, PagedDeck} from "../types/types";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import {AppConfig} from "../config.ts";
import {useNavigate} from "react-router-dom";
import {alpha} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import {useAuth} from "react-oidc-context";
import RenderOnAuthenticated from "../components/conditionals/RenderOnAuthenticated.tsx";
import {useContext} from "preact/hooks";
import {AppState} from "./ViewController.tsx";

export default function DecksView() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const defaultCharacter: Character = {characterId: 'All', characterClass: '', secondaryCharacterClass: ''};
    const [characters, setCharacters] = useState<Character[]>([defaultCharacter]);
    const [filter, setFilter] = useState('likes');
    const [characterFilter, setCharacterFilter] = useState<String>('All');
    const [ownedFilter, setOwnedFilter] = useState<String>('All');
    const [pages, setPages] = useState(0);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    const auth = useAuth();
    const {searchText} = useContext(AppState);

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
        fetch(AppConfig.API_URL + `/deck?searchQuery=${searchText.value}&size=10&page=${page}&charId=${charId}&sortByLikesFirst=${sortByLikesFirst}&ownedFilter=${ownedFilter}&userName=${auth.user ? auth.user.profile.preferred_username : ""}`)
            .then(response => response.json())
            .then((data: PagedDeck) => {
                setPages(data.pages)
                setDecks(data.decks);
            });
    }, [filter, characterFilter, page, ownedFilter, searchText.value]);

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
                        <InputLabel id="character-filter-label">Character</InputLabel>
                        <Select
                            labelId="character-filter-label"
                            id="character-filter-select"
                            value={characterFilter}
                            label="Character"
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
                    <RenderOnAuthenticated>
                        <FormControl sx={{minWidth: 120}}>
                            <InputLabel id="ownership-filter-label">Ownership</InputLabel>
                            <Select
                                labelId="ownership-filter-label"
                                id="ownership-filter-select"
                                value={ownedFilter}
                                label="Ownership"
                                onChange={(e) => {
                                    const target = e.target as HTMLInputElement;
                                    setOwnedFilter(target.value);
                                }}
                            >
                                <MenuItem value={'All'}>All</MenuItem>
                                <MenuItem value={'Owned'}>Owned</MenuItem>
                                <MenuItem value={'Unowned'}>Unowned</MenuItem>
                            </Select>
                        </FormControl>
                    </RenderOnAuthenticated>
                </Stack>
                {decks.map((deck) => (
                    <CharCard key={deck.id} deck={deck}/>
                ))}
                <Fab aria-label="add"
                     onClick={onCardActionClick}>
                    <AddIcon/>
                </Fab>
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
        </Box>
    );
}