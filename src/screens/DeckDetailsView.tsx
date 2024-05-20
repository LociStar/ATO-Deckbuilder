import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    List,
    Select,
    SelectChangeEvent,
    Stack,
    Theme,
    useMediaQuery
} from "@mui/material";
import {useEffect, useState} from "preact/hooks";
import {Card, Deck} from "../types/types";
import Typography from "@mui/material/Typography";
import {calculate_deck_cost} from "../utils/utils.ts";
import {MuiMarkdown} from 'mui-markdown';

import MenuItem from "@mui/material/MenuItem";
import {EnergyCostGraph} from "../components/graphs/EnergyCostGraph.tsx";
import {RarityGraph} from "../components/graphs/RarityGraph.tsx";
import CharacterImage from "../components/CharacterImage.tsx";
import {alpha} from "@mui/material/styles";
import {AppConfig} from "../config.ts";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {useAuth} from "react-oidc-context";
import {useSnackbar} from "notistack";
import RenderOnAuthenticated from "../components/conditionals/RenderOnAuthenticated.tsx";
import {useNavigate} from "react-router-dom";
import SmallCardComponent from "../components/SmallCardComponent.tsx";
import Grid from "@mui/material/Unstable_Grid2";

export default function DeckDetailsView() {
    const [deck, setDeck] = useState<Deck>();
    const [deckCost, setDeckCost] = useState(0);
    const [cardCraftingModifier, setCardCraftingModifier] = useState(1);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(1);
    const [filter, setFilter] = useState('energy');
    const [isFav, setIsFav] = useState(false);
    const auth = useAuth();
    const isMdScreenOrSmaller = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [cardCount, setCardCount] = useState(0);
    const [selectedChapter, setSelectedChapter] = useState(1);

    useEffect(() => {
        if (!deck || !auth.user) return;
        fetch(AppConfig.API_URL + '/deck/' + deck.id + '/isliked', {
            headers: {
                'Authorization': 'Bearer ' + auth.user.access_token,
            },
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => setIsFav(data));
    }, [auth, deck?.id]);

    useEffect(() => {
        if (!deck?.cardList) return;
        setDeckCost(calculate_deck_cost(deck!.cardList.filter(value => value.chapter == selectedChapter), cardCraftingModifier, cardUpgradingModifier));
    }, [deck?.cardList, cardCraftingModifier, cardUpgradingModifier, selectedChapter]);

    function sortCardsByRarity(data: Deck) {
        // sort cards by rarity 'Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'
        const sortedCardList = [...data.cardList].sort((a: Card, b: Card) => {
            const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'];
            return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
        });
        setDeck({...data, cardList: sortedCardList});
    }

    function sortCardsByEnergy(data: Deck) {
        // sort cards by energy cost
        const sortedCardList = [...data.cardList].sort((a: Card, b: Card) => {
            return a.energyCost - b.energyCost;
        });
        setDeck({...data, cardList: sortedCardList});
    }

    useEffect(() => {
        if (!deck) return;
        switch (filter) {
            case 'rarity':
                sortCardsByRarity(deck!);
                break;
            case 'energy':
                sortCardsByEnergy(deck!);
                break;
            default:
                sortCardsByEnergy(deck!);
        }
    }, [filter]);

    useEffect(() => {
        // get id from url
        const url = window.location.href;
        const deckId = Number(url.split('/').pop());
        fetch(AppConfig.API_URL + '/deck/' + deckId
            , {
                method: 'GET',
            })
            .then(response => response.json())
            .then(data => {
                setDeck(data);
                // get count of chapters
                setCardCount(Math.max(...data.cardList.map((card: Card) => card.chapter)));

                // Sort the cards by filter
                switch (filter) {
                    case 'rarity':
                        sortCardsByRarity(data);
                        break;
                    case 'energy':
                        sortCardsByEnergy(data);
                        break;
                    default:
                        sortCardsByEnergy(data);
                }
            });
    }, []);
    function handleFilterChange(event: SelectChangeEvent<string>) {
        const target = event.target as HTMLSelectElement;
        setFilter(target.value);
    }

    function handleFavClick() {
        if (!auth.user) {
            enqueueSnackbar('You need to be logged in to favorite decks', {
                variant: 'error',
                autoHideDuration: 5000
            });
            return;
        }
        if (isFav) {
            // Remove from favorites
            fetch(AppConfig.API_URL + '/deck/' + deck?.id + '/unlike', {
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                },
                method: 'POST'
            }).then(response => {
                if (!response.ok) {
                    console.log('Error unfavouring deck');
                }
            });
        } else {
            // Add to favorites
            fetch(AppConfig.API_URL + '/deck/' + deck?.id + '/like', {
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                },
                method: 'POST'
            }).then(response => {
                if (!response.ok) {
                    console.log('Error favouring deck');
                }
            });

        }
        setIsFav(!isFav);
    }

    return (
        <Stack marginBottom={5} marginX={{md: 5, xs: 2}}>
            <Stack display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                <Typography variant="h2" color='white'
                            style={{
                                textShadow: '-1px 0 black, 0 2px black, 1px 0 black, 0 -1px black'
                            }}>
                    {deck?.title}
                </Typography>
                <Typography variant="h5" color='black'>
                    Made by {deck?.username}
                </Typography>
                <RenderOnAuthenticated>
                    {auth.user?.profile.preferred_username == deck?.username ?
                        <Button color="primary"
                                style={{
                                    position: isMdScreenOrSmaller ? '' : 'absolute',
                                    right: isMdScreenOrSmaller ? '' : '1%',
                                    marginTop: isMdScreenOrSmaller ? 15 : 0,
                                    borderRadius: 5,
                                    backdropFilter: 'blur(50px)',
                                    backgroundColor: alpha('#000000', 0.5)
                                }}
                                onClick={() => navigate("/deckeditor/" + deck!.id)}>
                            <Typography color={"white"}>Edit</Typography>
                        </Button> : <div/>}
                </RenderOnAuthenticated>
                <Stack direction={{xs: 'column', sm: 'column', md: 'row'}} marginTop={3} display="flex"
                       alignItems="center" spacing={1}>
                    {deck &&
                        <Stack flex={1} justifyContent="center" alignItems="center">
                            <CharacterImage characterId={deck?.characterId!}/>
                            <Button color="primary"
                                    size="large"
                                    aria-label="add to favorites"
                                    style={{
                                        maxWidth: 140,
                                        borderRadius: 5,
                                        backdropFilter: 'blur(50px)',
                                        backgroundColor: alpha('#000000', 0.5)
                                    }}
                                    onClick={handleFavClick}>
                                <Typography mr={1} color={"white"}>Favorite</Typography>
                                <FavoriteIcon color={isFav ? "error" : "inherit"}/>
                            </Button>
                        </Stack>}
                    {deck?.description == "" ? <Box/> :
                        <Stack padding={3} sx={{
                            borderRadius: 3,
                            marginX: {xs: 1, sm: 2, md: 2},
                            backdropFilter: 'blur(80px)',
                            backgroundColor: alpha('#000000', 0.5)
                        }}>
                            <Typography variant="h4">
                                Description:
                            </Typography>
                            <MuiMarkdown overrides={{}}>{deck?.description}</MuiMarkdown>
                        </Stack>}
                </Stack>
            </Stack>
            <Divider variant="middle"/>
            <Stack
                direction={{xs: 'column', sm: 'column', md: 'row'}}
                marginTop={3}
                display="flex"
                sx={{
                    width: "100%",
                    backdropFilter: 'blur(50px)',
                    backgroundColor: alpha('#000000', 0.5),
                    borderRadius: 3,
                    padding: 4
                }}>
                <List style={{flex: 1}}>
                    <Stack direction={{md: "row"}}>
                        <FormControl sx={{m: 1, minWidth: 120}} size="small">
                            <InputLabel id="sort-select-label">Sort by</InputLabel>
                            <Select
                                labelId="sort-select-label"
                                id="sort-select-small"
                                value={filter}
                                label="Sort by"
                                onChange={handleFilterChange}>
                                <MenuItem value="energy">Energy Cost</MenuItem>
                                <MenuItem value='rarity'>Rarity</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}} size="small">
                            <InputLabel id="crafting-modifier-label">Craft Reduction</InputLabel>
                            <Select
                                labelId="crafting-modifier-label"
                                id="crafting-modifier-small"
                                value={cardCraftingModifier}
                                label="Craft Reduction"
                                onChange={event => setCardCraftingModifier(Number((event.target as HTMLSelectElement).value))}>
                                <MenuItem value={1}>No Reduction</MenuItem>
                                <MenuItem value={0.15}>15%</MenuItem>
                                <MenuItem value={0.3}>30%</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}} size="small">
                            <InputLabel id="upgrading-modifier-label">Upgrade Reduction</InputLabel>
                            <Select
                                labelId="upgrading-modifier-label"
                                id="upgrading-modifier-small"
                                value={cardUpgradingModifier}
                                label="Upgrade Reduction"
                                onChange={event => setCardUpgradingModifier(Number((event.target as HTMLSelectElement).value))}>
                                <MenuItem value={1}>No Reduction</MenuItem>
                                <MenuItem value={0.15}>15%</MenuItem>
                                <MenuItem value={0.3}>30%</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <Typography variant="h5" marginTop={5} marginBottom={1}>
                        Blue Shards: {deckCost}
                    </Typography>
                    <EnergyCostGraph cardList={deck?.cardList.filter(value => value.chapter == selectedChapter) || []}/>
                    <RarityGraph cardList={deck?.cardList.filter(value => value.chapter == selectedChapter) || []}/>
                </List>
                <Grid container columnSpacing={{xs: 1, sm: 2, md: 5}} rowSpacing={{xs: 2, sm: 2, md: 5}}
                      style={{flex: 4}} width="100%" justifyContent="center">
                    {Array.from({length: cardCount}, (_, i) => i + 1).map((chapter) => (
                        <Grid xs={12} sm={6} xl={3} border={selectedChapter === chapter ? 1 : 0} borderRadius={3}
                              key={"chapter_" + chapter} onClick={() => setSelectedChapter(chapter)}
                              style={{cursor: 'pointer'}}
                              sx={{
                                  '&:hover': {
                                      boxShadow: '0 0 10px rgba(0,0,0,0.5)', // Add this line
                                  },
                              }}>
                            <Typography variant="h4" marginBottom={2} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>Chapter {chapter}</Typography>
                            <Stack direction="column" spacing={1}>
                                {deck && deck.cardList.filter(value => value.chapter == chapter).map((card, index) => (
                                    <SmallCardComponent card={card} key={chapter + "_" + card.id + "_" + index}/>
                                ))}
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Stack>
    );
}