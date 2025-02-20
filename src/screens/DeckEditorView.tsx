import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContentText,
    Divider,
    FormControl,
    InputLabel, Select,
    Snackbar,
    Stack,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from "@mui/material/MenuItem";
import CardsLoader from "../components/CardsLoader.tsx";
import {useEffect, useState} from "preact/hooks";
import {Card, Character, Deck} from "../types/types.tsx";
import Typography from "@mui/material/Typography";
import CustomSearch from "../components/CustomSearch.tsx";
import {useAuth} from "react-oidc-context";
import {calculate_deck_cost} from "../utils/utils.ts";
import {alpha} from "@mui/material/styles";
import {EnergyCostGraph} from "../components/graphs/EnergyCostGraph.tsx";
import {RarityGraph} from "../components/graphs/RarityGraph.tsx";
import {AppConfig} from "../config.ts";
import {MuiMarkdown} from "mui-markdown";
import {useNavigate} from "react-router-dom";
import {enqueueSnackbar} from "notistack";
import SmallCardComponent from "../components/SmallCardComponent.tsx";

export default function DeckEditor() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<string>('');
    const [cardList, setCardList] = useState<Card[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [chars, setChars] = useState<Character[]>([]);
    const [cardCost, setCardCost] = useState(0);
    // @ts-ignore
    const [cardCraftingModifier, setCardCraftingModifier] = useState(0.7);
    // @ts-ignore
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(0.5);
    const [tabValue, setTabValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [baseCardList, setBaseCardList] = useState<Card[]>([]);

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
        setCardCost(calculate_deck_cost(cardList, baseCardList, cardCraftingModifier, cardUpgradingModifier));
    }, [cardList, cardCraftingModifier, cardUpgradingModifier, baseCardList]);

    useEffect(() => {
        fetch(AppConfig.API_URL + '/character', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => setChars(data));
    }, []);

    // load data
    useEffect(() => {
        // get id from url
        const url = window.location.href;
        const deckId = Number(url.split('/').pop());
        fetch(AppConfig.API_URL + '/deck/' + deckId
            , {
                method: 'GET',
            })
            .then(response => response.json())
            .then((data: Deck) => {
                if (data.username !== auth.user?.profile.preferred_username) {
                    setIsSaving(true);
                    enqueueSnackbar('You are not the owner of this deck.', {variant: 'error', autoHideDuration: 12000});
                }
                setTitle(data.title);
                setCardList(data.cardList);
                setDescription(data.description);
                setSelectedCharacter(data.characterId);
            });
    }, []);

    useEffect(() => {
        if (!selectedCharacter) {
            return;
        }

        fetch(AppConfig.API_URL + '/character/default/' + selectedCharacter, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setBaseCardList(data);
                if (cardList.length === 0 || sameCardIds(cardList, baseCardList)) {
                    setCardList([]);
                    data.forEach((card: Card) => addCardToList(card));
                }
            })
    }, [selectedCharacter]);

    function sameCardIds(cardList1: Card[], cardList2: Card[]): boolean {
        if (cardList1.length !== cardList2.length) {
            return false;
        }
        return cardList1.every((card, index) => card.id === cardList2[index].id);
    }

    const handleTabChange = (_ignored: Event, newValue: number) => {
        setTabValue(newValue);
    };

    const addCardToList = (card: Card) => {
        const cardCopy = {...card};
        cardCopy.chapter = selectedChapter + 1;
        setCardList(oldList => [...oldList, cardCopy]);
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

    async function updateDeck(title: string, description: string, cardList: Card[]) {
        const deckId = Number(window.location.href.split('/').pop());
        setIsSaving(true);
        const deck = {
            title,
            description,
            cardList,
            characterId: selectedCharacter // Include the selected character in the deck object
        };

        try {
            await fetch(AppConfig.API_URL + '/deck/' + deckId + '/update', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deck)
            }).then(() => {
                setOpen(true);
                enqueueSnackbar('Deck updated.', {variant: 'success', autoHideDuration: 6000})
                navigate('/deck/' + deckId);
            });
        } catch (error) {
            setOpenError(true);
        }
    }

    function deleteDeck() {
        const deckId = Number(window.location.href.split('/').pop());
        setIsSaving(true);
        fetch(AppConfig.API_URL + '/deck/' + deckId + '/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + auth.user?.access_token,
            }
        }).then(() => {
            enqueueSnackbar('Deck deleted.', {variant: 'success', autoHideDuration: 6000});
            navigate('/');
        });
    }

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    function handleChapterChange(_event: Event, newValue: number) {
        setSelectedChapter(newValue);
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
                <Stack direction="row">
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={selectedChapter} onChange={handleChapterChange} aria-label="basic tabs example">
                            {Array.from({length: 4}, (_, i) => i + 1).map((chapter) => (
                                <Tab label={"Chapter " + chapter}/>
                            ))}
                        </Tabs>
                    </Box>
                    {/*<IconButton onClick={onAddChapterClicked} disabled={chapterCount == 4}><AddIcon/></IconButton>*/}
                </Stack>
                <Typography variant="h5">Cards</Typography>
                <Typography>Cost: {cardCost}</Typography>
                <Grid container
                      spacing={2}>
                    <Grid xs={3} md={4}>
                        <Box>
                            <Stack direction="column" spacing={1}>
                                {cardList && cardList.filter(value => value.chapter == selectedChapter + 1).map((card, index) => (
                                    <div onClick={() => removeCard(card)}>
                                        <SmallCardComponent card={card}
                                                            key={selectedChapter + "_" + card.id + "_" + index}/>
                                    </div>
                                ))}
                            </Stack>
                        </Box>
                    </Grid>
                    <Grid xs={9} md={8}>
                        <Box marginBottom={2}>
                            <CustomSearch/>
                        </Box>
                        {selectedCharacter &&
                            <CardsLoader fixed_buttons={true}
                                         charClass={chars.find(char => char.characterId === selectedCharacter)?.characterClass || ''}
                                         secondaryCharClass={chars.find(char => char.characterId === selectedCharacter)?.secondaryCharacterClass || ''}
                                         onCardClick={addCardToList}/>
                        }
                    </Grid>
                </Grid>
                <Divider/>
                <Button variant="contained" onClick={() => updateDeck(title, description, cardList)}
                        disabled={isSaving}>Update</Button>
                <Button variant="contained" color="error" onClick={handleOpenDeleteDialog}
                        disabled={isSaving}>Delete</Button>
                <Dialog
                    open={openDeleteDialog}
                    onClose={handleCloseDeleteDialog}
                >
                    <DialogContentText sx={{padding: 2}}>
                        Are you sure you want to delete this deck?
                    </DialogContentText>
                    <DialogActions>
                        <Button color="warning" onClick={handleCloseDeleteDialog}>
                            Cancel
                        </Button>
                        <Button onClick={deleteDeck} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
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
                    Deck updated.
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