import {Box, Button, Divider, List, ListItem, ListItemText, Stack, TextField} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from "@mui/material/MenuItem";
import CardsView from "./CardsView.tsx";
import {useEffect, useState} from "preact/hooks";
import {Card, Character} from "../types/types.tsx";
import {memo} from 'preact/compat';
import Typography from "@mui/material/Typography";
import CustomSearch from "../components/CustomSearch.tsx";
import {useAuth} from "react-oidc-context";

export default function DeckBuilder() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<string>('');
    const [cardList, setCardList] = useState<Card[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [chars, setChars] = useState<Character[]>([]);
    const auth = useAuth();

    useEffect(() => {
        if (auth.user?.access_token) {
            fetch('http://localhost:8080/character', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                }
            })
                .then(response => response.json())
                .then(data => setChars(data));
        }
    }, [auth.user?.access_token]);

    const addCardToList = (card: Card) => {
        setCardList(oldList => [...oldList, card]);
    };

    const MemoizedListItem = memo(({cardName}: { cardName: string }) => (
        <div>
            <ListItem>
                <ListItemText primary={cardName}/>
            </ListItem>
            <Divider/>
        </div>
    ));

    async function uploadDeck(title: string, description: string, cardList: Card[]) {
        setIsSaving(true);
        const deck = {
            title,
            description,
            cardList,
            characterId: selectedCharacter // Include the selected character in the deck object
        };
        console.log(JSON.stringify(deck))

        try {
            const response = await fetch('http://localhost:8080/deck/upload', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deck)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log('Deck uploaded successfully');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <Stack flex="auto" marginLeft={10} marginRight={10} marginBottom={2} spacing={2}>
            <TextField
                id="standard-basic"
                label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setTitle(target?.value || '');
                }}
            />
            <TextField
                label="Description"
                placeholder="test"
                multiline
                rows={5}
                value={description}
                onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    setDescription(target?.value || '');
                }}
            />
            <TextField
                id="character-field"
                label="Character"
                variant="outlined"
                select
                value={selectedCharacter} // Set the value to the selected character
                onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    const selectedChar = chars.find(char => char.characterId === target.value);
                    setSelectedCharacter(selectedChar ? selectedChar.characterId : '');
                }}
            >
                {chars.map((char) => (
                    <MenuItem key={char.characterId} value={char.characterId}>
                        {char.characterId}
                    </MenuItem>
                ))}
            </TextField>
            <Divider/>
            <Typography variant="h5">Cards</Typography>
            <Grid container
                  spacing={2}>
                <Grid xs={3} md={4}>
                    <Box style={{maxHeight: 'calc(100vh - 100px)', overflow: 'auto'}}>
                        <List>
                            {cardList.map((cardName, index) => (
                                <MemoizedListItem key={index} cardName={cardName.name}/>
                            ))}
                        </List>
                    </Box>
                </Grid>
                <Grid xs={9} md={8}>
                    <Box marginBottom={2}>
                        <CustomSearch setSearchQuery={setSearchQuery}/>
                    </Box>
                    <CardsView component={true} searchQuery={searchQuery}
                               charClass={chars.find(char => char.characterId === selectedCharacter)?.characterClass || ''}
                               secondaryCharClass={chars.find(char => char.characterId === selectedCharacter)?.secondaryCharacterClass || ''}
                               onCardClick={addCardToList}/>
                </Grid>
            </Grid>
            <Divider/>
            <Button variant="contained" onClick={() => uploadDeck(title, description, cardList)}
                    disabled={isSaving}>Save</Button>
        </Stack>
    );
}