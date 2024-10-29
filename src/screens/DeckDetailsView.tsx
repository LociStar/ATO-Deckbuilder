import {
    Box,
    Button,
    FormControl,
    InputLabel,
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
    const [cardCraftingModifier, setCardCraftingModifier] = useState(0.7);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(0.5);
    const [filter, setFilter] = useState('energy');
    const [isFav, setIsFav] = useState(false);
    const auth = useAuth();
    const isMdScreenOrSmaller = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [selectedChapter, setSelectedChapter] = useState(1);
    const [chapterCardCount, setChapterCardCount] = useState<{ [chapter: number]: number; } | undefined>();
    const [baseCardList, setBaseCardList] = useState<Card[]>([]);

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
        if (!deck?.cardList || !baseCardList) return;
        setDeckCost(calculate_deck_cost(deck!.cardList.filter(value => value.chapter == selectedChapter), baseCardList, cardCraftingModifier, cardUpgradingModifier));
    }, [deck?.cardList, cardCraftingModifier, cardUpgradingModifier, selectedChapter, baseCardList]);

    useEffect(() => {
        if (!deck) {
            return;
        }

        fetch(AppConfig.API_URL + '/character/default/' + deck.characterId, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setBaseCardList(data);
            })
    }, [deck]);

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
                // get amount of cards for each chapter
                const chapterCardCount = data.cardList.reduce((acc: { [chapter: number]: number }, card: Card) => {
                    acc[card.chapter] = (acc[card.chapter] || 0) + 1;
                    return acc;
                }, {} as { [chapter: number]: number });
                setChapterCardCount(chapterCardCount);
                setSelectedChapter(Number(Object.keys(chapterCardCount)[0]) || 1);

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
                <Typography variant="h2" color='black'
                            style={{
                                textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'
                            }}>
                    {deck?.title}
                </Typography>
                <Typography variant="h5" color='black'>
                    Made by {deck?.username}
                </Typography>
                <RenderOnAuthenticated>
                    {auth.user?.profile.preferred_username == deck?.username ?
                        <Button color="error"
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
            <Stack
                direction={{xs: 'column', sm: 'column', md: 'row'}}
                marginTop={3}
                display="flex"
                alignSelf="center"
                width="fit-content"
                sx={{
                    backdropFilter: 'blur(50px)',
                    backgroundColor: alpha('#000000', 0.5),
                    borderRadius: 3,
                    padding: 4
                }}>
                <Stack marginRight={5} minWidth={300} maxWidth={500} marginBottom={{sm: 5, md: 0}}>
                    <Stack>
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
                                <MenuItem value={0.85}>15% Reduction</MenuItem>
                                <MenuItem value={0.7}>30% Reduction</MenuItem>
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
                                <MenuItem value={0.85}>15% Reduction</MenuItem>
                                <MenuItem value={0.7}>30% Reduction</MenuItem>
                                <MenuItem value={0.5}>50% Reduction</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                    <Typography variant="h5" marginTop={5} marginBottom={1}>
                        Blue Shards: {deckCost}
                    </Typography>
                    <EnergyCostGraph cardList={deck?.cardList.filter(value => value.chapter == selectedChapter) || []}/>
                    <RarityGraph cardList={deck?.cardList.filter(value => value.chapter == selectedChapter) || []}/>
                </Stack>
                <Grid container columnSpacing={{xs: 1, sm: 2, md: 5}} rowSpacing={{xs: 2, sm: 2, md: 2}}
                      justifyContent="center">
                    {chapterCardCount && Object.keys(chapterCardCount).map((chapter) => (
                        <Grid xs={12} sm={6} xl={3} border={selectedChapter === Number(chapter) ? 1 : 0}
                              borderRadius={3}
                              key={"chapter_" + chapter} onClick={() => setSelectedChapter(Number(chapter))}
                              style={{cursor: 'pointer'}}
                              minWidth={400}
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
                            <Stack direction="column" spacing={1} minWidth={350}>
                                {deck && deck.cardList.filter(value => value.chapter == Number(chapter)).map((card, index) => (
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