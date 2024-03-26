import {
    Alert,
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    ListItem, ListItemButton,
    ListItemText, Select, Snackbar,
    Stack, Tab, Tabs,
    TextField
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from "@mui/material/MenuItem";
import CardsView from "./CardsView.tsx";
import {useEffect, useState} from "preact/hooks";
import {Card, Character} from "../types/types.tsx";
import Typography from "@mui/material/Typography";
import CustomSearch from "../components/CustomSearch.tsx";
import {useAuth} from "react-oidc-context";
import {calculate_deck_cost} from "../utils/utils.ts";
import {alpha} from "@mui/material/styles";
import {EnergyCostGraph} from "../components/graphs/EnergyCostGraph.tsx";
import {RarityGraph} from "../components/graphs/RarityGraph.tsx";
import {FixedSizeList} from 'react-window';
import {AppConfig} from "../config.tsx";
import {MuiMarkdown} from "mui-markdown";
import {useNavigate} from "react-router-dom";
import {Api} from "@mui/icons-material";

export default function DeckBuilder() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<string>('');
    const [cardList, setCardList] = useState<Card[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [chars, setChars] = useState<Character[]>([]);
    const [cardCost, setCardCost] = useState(0);
    const [cardCraftingModifier, setCardCraftingModifier] = useState(1);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const removeCard = (cardToRemove: Card) => {
        setCardList(oldList => {
            const index = oldList.findIndex(card => card === cardToRemove);
            if (index !== -1) {
                return [...oldList.slice(0, index), ...oldList.slice(index + 1)];
            }
            return oldList;
        });
    };

    useEffect(() => {
        setCardCost(calculate_deck_cost(cardList, cardCraftingModifier, cardUpgradingModifier));
    }, [cardList, cardCraftingModifier, cardUpgradingModifier]);

    useEffect(() => {
        fetch(AppConfig.API_URL + '/character', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => setChars(data));
    }, []);

    const handleTabChange = (_ignored: Event, newValue: number) => {
        setTabValue(newValue);
    };

    const addCardToList = (card: Card) => {
        setCardList(oldList => [...oldList, card]);
    };

    const handleClose = (_ignored: Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        if (openError)
            setIsSaving(false);
        setOpenError(false);
    };

    async function uploadDeck(title: string, description: string, cardList: Card[]) {
        setIsSaving(true);
        const deck = {
            title,
            description,
            cardList,
            characterId: selectedCharacter // Include the selected character in the deck object
        };

        try {
            await fetch(AppConfig.API_URL + '/deck/upload', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deck)
            }).then(response => {
                return response.json();
            }).then(data => {
                setOpen(true);
                navigate('/deck/' + data);
            });
        } catch (error) {
            setOpenError(true);
        }
    }

    return (
        <div>
            <Stack flex="auto" marginLeft={10} marginRight={10} marginBottom={2} spacing={2} padding={2}
                   sx={{
                       backdropFilter: 'blur(50px)',
                       backgroundColor: alpha('#000000', 0.5),
                       borderRadius: 2,
                       fontStyle: {color: 'white'}
                   }}>
                <TextField
                    sx={{fontStyle: {color: 'white'}}}
                    color="warning"
                    label="Title"
                    value={title}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setTitle(target?.value || '');
                    }}
                />
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="secondary" textColor="secondary">
                    <Tab label="Edit"/>
                    <Tab label="Preview"/>
                </Tabs>
                {tabValue === 0 && (
                    <TextField
                        placeholder="Description (you can use markdown)"
                        color="warning"
                        multiline
                        rows={5}
                        value={description}
                        onChange={(e) => {
                            const target = e.target as HTMLInputElement;
                            setDescription(target?.value || '');
                        }}
                    />
                )}
                {tabValue === 1 && (
                    <Box border={1} padding={2} borderRadius={1} borderColor={"#6A6A68"}>
                        <MuiMarkdown
                            overrides={{}}>
                            {description}
                        </MuiMarkdown>
                    </Box>
                )}
                <FormControl>
                    <InputLabel id="char-select-label">Character</InputLabel>
                    <Select
                        color="warning"
                        labelId="char-select-label"
                        id="char-select"
                        value={selectedCharacter}
                        label="Character"
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
                    </Select>
                </FormControl>
                <Divider/>
                <Stack direction={"row"}>
                    <EnergyCostGraph cardList={cardList || []}/>
                    <RarityGraph cardList={cardList || []}/>
                </Stack>
                <Typography variant="h5">Cards</Typography>
                <Typography>Cost: {cardCost}</Typography>
                <Grid container
                      spacing={2}>
                    <Grid xs={3} md={4}>
                        <Box>
                            <FixedSizeList
                                height={700}
                                width='100%'
                                itemSize={46}
                                itemCount={cardList.length}
                            >
                                {({index, style}) => (
                                    <ListItem style={style}>
                                        <ListItemButton onClick={() => removeCard(cardList[index])}>
                                            <ListItemText primary={cardList[index].name}/>
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </FixedSizeList>
                        </Box>
                    </Grid>
                    <Grid xs={9} md={8}>
                        <Box marginBottom={2}>
                            <CustomSearch/>
                        </Box>
                        {selectedCharacter &&
                            <CardsView component={true}
                                       charClass={chars.find(char => char.characterId === selectedCharacter)?.characterClass || ''}
                                       secondaryCharClass={chars.find(char => char.characterId === selectedCharacter)?.secondaryCharacterClass || ''}
                                       onCardClick={addCardToList}/>
                        }
                    </Grid>
                </Grid>
                <Divider/>
                <Button variant="contained" onClick={() => uploadDeck(title, description, cardList)}
                        disabled={isSaving}>Save</Button>
            </Stack>
            <Snackbar
                open={open}
                sx={{position: 'sticky', marginLeft: 4}}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="success"
                    variant="filled"
                >
                    Deck uploaded.
                </Alert>
            </Snackbar>
            <Snackbar
                open={openError}
                sx={{position: 'sticky', marginLeft: 4}}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                >
                    Unexpected error occurred, please try again later.
                </Alert>
            </Snackbar>
        </div>
    );
}