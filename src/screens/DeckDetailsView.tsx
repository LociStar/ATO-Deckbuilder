import {Box, Button, useMediaQuery, useTheme} from '@mui/material';
import {useEffect, useState} from 'preact/hooks';
import {useNavigate} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {useSnackbar} from 'notistack';
import {MuiMarkdown} from 'mui-markdown';
import townImage from '../assets/extended-town_.webp';

import {Card, Deck} from '../types/types';
import {AppConfig} from '../config';
import {calculate_deck_cost} from '../utils/utils';
import SmallCardComponent from '../components/SmallCardComponent';
import {C, classAccent} from '../components/directionC/tokens';
import {Banner, ChipC, DropdownC, InkPanel, Plaque, StainedFrame,} from '../components/directionC/primitives';
import {RarityGraph} from "../components/graphs/RarityGraph.tsx";
import {EnergyCostGraph} from "../components/graphs/EnergyCostGraph.tsx";

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'] as const;

const CHAPTER_NUMERALS = ['I', 'II', 'III', 'IV'];
const CHAPTER_BANNER = [C.amber, C.teal, C.purple, C.green];

function avgEnergy(cards: Card[]): number {
    if (!cards.length) return 0;
    return cards.reduce((s, c) => s + (c.energyCost | 0), 0) / cards.length;
}

function formatShards(n: number): string {
    return n.toLocaleString('de-DE');
}

export default function DeckDetailsView() {
    const [deck, setDeck] = useState<Deck>();
    const [deckCost, setDeckCost] = useState(0);
    const [cardCraftingModifier, setCardCraftingModifier] = useState(0.7);
    const [cardUpgradingModifier, setCardUpgradingModifier] = useState(0.5);
    const [filter, setFilter] = useState('energy');
    const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');
    const [isFav, setIsFav] = useState(false);
    const [baseCardList, setBaseCardList] = useState<Card[]>([]);

    const auth = useAuth();
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const theme = useTheme();
    const isCompact = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const deckId = Number(window.location.href.split('/').pop());
        fetch(AppConfig.API_URL + '/deck/' + deckId, {method: 'GET'})
            .then((response) => response.json())
            .then((data: Deck) => setDeck(data));
    }, []);

    useEffect(() => {
        if (!deck || !auth.user) return;
        fetch(AppConfig.API_URL + '/deck/' + deck.id + '/isliked', {
            headers: {Authorization: 'Bearer ' + auth.user.access_token},
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => setIsFav(data));
    }, [auth, deck?.id]);

    useEffect(() => {
        if (!deck) return;
        fetch(AppConfig.API_URL + '/character/default/' + deck.characterId, {method: 'GET'})
            .then((response) => response.json())
            .then((data) => setBaseCardList(data));
    }, [deck?.characterId]);

    useEffect(() => {
        if (!deck?.cardList) return;
        const scoped = selectedChapter === 'all'
            ? deck.cardList
            : deck.cardList.filter((c) => c.chapter === selectedChapter);
        setDeckCost(calculate_deck_cost(scoped, baseCardList, cardCraftingModifier, cardUpgradingModifier));
    }, [deck?.cardList, baseCardList, cardCraftingModifier, cardUpgradingModifier, selectedChapter]);

    function handleFavClick() {
        if (!auth.user) {
            enqueueSnackbar('You need to be logged in to favorite decks', {
                variant: 'error',
                autoHideDuration: 5000,
            });
            return;
        }
        const endpoint = isFav ? 'unlike' : 'like';
        fetch(AppConfig.API_URL + '/deck/' + deck?.id + '/' + endpoint, {
            headers: {Authorization: 'Bearer ' + auth.user.access_token},
            method: 'POST',
        }).then((response) => {
            if (!response.ok) console.log('Error toggling favorite');
        });
        setIsFav(!isFav);
    }

    const allCards = deck?.cardList ?? [];
    const cards = selectedChapter === 'all'
        ? allCards
        : allCards.filter((c) => c.chapter === selectedChapter);
    const accent = classAccent(deck?.characterId);
    const sortedCards = [...cards].sort((a, b) => {
        if (filter === 'rarity') {
            return RARITIES.indexOf(a.rarity) - RARITIES.indexOf(b.rarity);
        }
        return a.energyCost - b.energyCost;
    });
    const avg = avgEnergy(cards);

    const allChapterCounts = [1, 2, 3, 4].map((n) => allCards.filter((c) => c.chapter === n).length);
    const chaptersUsed = allChapterCounts.filter((n) => n > 0).length;
    const chapterBreakdown = allChapterCounts.join(' / ');
    const chaptersToRender = selectedChapter === 'all' ? [1, 2, 3, 4] : [selectedChapter];

    const likesValue = deck?.likes ?? 0;
    const tagList = deck?.tags ?? [];
    const isOwner = !!auth.user && deck?.username === auth.user.profile.preferred_username;

    const heroHeight = isCompact ? 150 : 200;

    return (
        <Box sx={{background: C.cream, minHeight: '100%'}}>
            {/* Narrow town strip with breadcrumb */}
            <Box sx={{position: 'relative', height: heroHeight, overflow: 'hidden'}}>
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${townImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 28%',
                }}/>
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(168,200,218,0) 0%, rgba(168,200,218,0) 45%, rgba(245,234,208,.85) 90%, rgba(245,234,208,1) 100%)',
                }}/>
                <Box sx={{
                    position: 'absolute',
                    top: 14,
                    left: {xs: 16, md: 28},
                    right: {xs: 16, md: 28},
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: C.serif,
                    fontStyle: 'italic',
                    fontSize: 13,
                    color: C.creamHi,
                    textShadow: '0 1px 2px rgba(0,0,0,.5)',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }}>
                    <span style={{cursor: 'pointer', opacity: 0.85}} onClick={() => navigate('/')}>Guild Hall</span>
                    {deck?.characterId && (
                        <>
                            <span style={{opacity: 0.6}}>›</span>
                            <span style={{opacity: 0.85}}>{deck.characterId}</span>
                        </>
                    )}
                    {deck?.title && (
                        <>
                            <span style={{opacity: 0.6}}>›</span>
                            <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{deck.title}</span>
                        </>
                    )}
                </Box>
            </Box>

            <Box sx={{
                padding: {xs: '0 16px 24px', md: '0 28px 32px'},
                marginTop: {xs: '-72px', md: '-120px'},
                position: 'relative',
                zIndex: 2,
            }}>
                {/* Header card */}
                <InkPanel padding={0} tone={C.creamHi} style={{marginBottom: 16, overflow: 'hidden'}}>
                    {/* Stained-glass rainbow band */}
                    <div style={{
                        height: 8,
                        background: `linear-gradient(90deg, ${C.amber} 0%, ${C.teal} 35%, ${C.purple} 60%, ${C.green} 85%, ${C.red} 100%)`,
                        borderBottom: `1px solid ${C.ink}`,
                        position: 'relative',
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'repeating-linear-gradient(90deg, rgba(0,0,0,.25) 0 1px, transparent 1px 60px)',
                        }}/>
                    </div>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: {xs: 'column', md: 'row'},
                        alignItems: {xs: 'stretch', md: 'center'},
                        gap: {xs: '14px', md: '18px'},
                        padding: {xs: '16px', md: '18px 20px'},
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1}}>
                            {deck?.characterId && (
                                <StainedFrame characterId={deck.characterId} size={isCompact ? 64 : 88}
                                              accent={accent}/>
                            )}
                            <Box sx={{minWidth: 0, flex: 1}}>
                                {deck?.characterId && (
                                    <div style={{
                                        fontFamily: C.display,
                                        fontSize: 11,
                                        color: accent,
                                        letterSpacing: '0.28em',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                    }}>{deck.characterId}</div>
                                )}
                                <h1 style={{
                                    margin: '4px 0 0',
                                    fontFamily: C.display,
                                    fontSize: isCompact ? 22 : 30,
                                    fontWeight: 700,
                                    color: C.ink,
                                    letterSpacing: '-0.005em',
                                    lineHeight: 1.1,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}>{deck?.title ?? '…'}</h1>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flexWrap: 'wrap',
                                    marginTop: 8,
                                    fontFamily: C.serif,
                                    fontSize: 14,
                                    color: C.inkSoft,
                                }}>
                                    <span style={{fontStyle: 'italic'}}>scribed by</span>
                                    <span style={{fontWeight: 700, color: C.ink}}>{deck?.username ?? '—'}</span>
                                    <span style={{color: C.inkMute}}>·</span>
                                    <span style={{
                                        fontFamily: C.mono,
                                        fontSize: 11,
                                        color: C.inkMute
                                    }}>folio №{String(deck?.id ?? '----').padStart(4, '0')}</span>
                                </div>
                            </Box>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: {xs: 'flex-start', md: 'flex-end'},
                        }}>
                            <Box sx={{display: 'flex', gap: '6px', flexWrap: 'wrap'}}>
                                {isOwner && (
                                    <Button
                                        onClick={() => navigate('/deckeditor/' + deck!.id)}
                                        sx={{
                                            padding: '7px 12px',
                                            background: C.cream,
                                            color: C.ink,
                                            border: `1.5px solid ${C.ink}`,
                                            borderRadius: '3px',
                                            fontFamily: C.display,
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            letterSpacing: '0.14em',
                                            textTransform: 'uppercase',
                                            boxShadow: `0 2px 0 ${C.ink}`,
                                            minWidth: 0,
                                            '&:hover': {background: C.creamHi},
                                        }}
                                    >✎ Edit</Button>
                                )}
                                <Button
                                    onClick={() => {
                                        navigator.clipboard?.writeText(window.location.href).then(
                                            () => enqueueSnackbar('Link copied to clipboard', {
                                                variant: 'success',
                                                autoHideDuration: 4000
                                            }),
                                            () => enqueueSnackbar('Could not copy link', {
                                                variant: 'error',
                                                autoHideDuration: 4000
                                            }),
                                        );
                                    }}
                                    sx={{
                                        padding: '7px 12px',
                                        background: C.cream,
                                        color: C.ink,
                                        border: `1.5px solid ${C.ink}`,
                                        borderRadius: '3px',
                                        fontFamily: C.display,
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        boxShadow: `0 2px 0 ${C.ink}`,
                                        minWidth: 0,
                                        '&:hover': {background: C.creamHi},
                                    }}
                                >↗ Share</Button>
                                <Button
                                    onClick={handleFavClick}
                                    sx={{
                                        padding: '7px 14px',
                                        background: isFav ? C.red : C.cream,
                                        color: isFav ? C.creamHi : C.ink,
                                        border: `1.5px solid ${C.ink}`,
                                        borderRadius: '3px',
                                        fontFamily: C.display,
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        boxShadow: `0 2px 0 ${C.ink}`,
                                        minWidth: 0,
                                        gap: '5px',
                                        '&:hover': {background: isFav ? C.red : C.creamHi, opacity: isFav ? 0.92 : 1},
                                    }}
                                >♥ Endorse · {likesValue}</Button>
                            </Box>
                            {(tagList.length > 0 || deck?.difficulty) && (
                                <Box sx={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                                    {tagList.map((tag) => (
                                        <span key={tag} style={{
                                            padding: '3px 9px',
                                            fontFamily: C.display,
                                            fontSize: 10,
                                            letterSpacing: '0.14em',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            borderRadius: 2,
                                            background: accent,
                                            color: C.creamHi,
                                            border: `1px solid ${C.ink}`,
                                            boxShadow: `0 1px 0 ${C.ink}`,
                                        }}>{tag}</span>
                                    ))}
                                    {deck?.difficulty && (
                                        <span style={{
                                            padding: '3px 9px',
                                            fontFamily: C.display,
                                            fontSize: 10,
                                            letterSpacing: '0.14em',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            borderRadius: 2,
                                            background: C.amber,
                                            color: C.creamHi,
                                            border: `1px solid ${C.ink}`,
                                            boxShadow: `0 1px 0 ${C.ink}`,
                                        }}>{deck.difficulty}</span>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </InkPanel>

                {/* Chapter filter — controls all card-derived stats below */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    marginBottom: '12px',
                }}>
                    <span style={{
                        fontFamily: C.display,
                        fontSize: 10,
                        color: C.inkDim,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        marginRight: 4,
                    }}>Showing</span>
                    <ChipC
                        label="All"
                        active={selectedChapter === 'all'}
                        color={accent}
                        onClick={() => setSelectedChapter('all')}
                    />
                    {[1, 2, 3, 4].map((n, i) => (
                        <ChipC
                            key={n}
                            label={`Chapter ${CHAPTER_NUMERALS[i]}`}
                            active={selectedChapter === n}
                            color={CHAPTER_BANNER[i]}
                            onClick={() => setSelectedChapter(n)}
                        />
                    ))}
                </Box>

                {/* Stat plaques */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(5, 1fr)',
                    },
                    gap: '10px',
                    marginBottom: '16px',
                }}>
                    <Plaque
                        label="Shard Cost"
                        value={formatShards(deckCost)}
                        sub={`craft ${Math.round((1 - cardCraftingModifier) * 100)}% · upgrade ${Math.round((1 - cardUpgradingModifier) * 100)}%`}
                        color={C.tealDeep}
                    />
                    <Plaque
                        label="Avg Energy"
                        value={cards.length ? avg.toFixed(2) : '—'}
                        sub="the lower, the swifter"
                        color={C.greenDeep}
                    />
                    <Plaque
                        label="Card Count"
                        value={cards.length}
                        sub={
                            !allCards.length
                                ? undefined
                                : selectedChapter === 'all'
                                    ? `${chaptersUsed} chapters · ${chapterBreakdown}`
                                    : `chapter ${CHAPTER_NUMERALS[selectedChapter - 1]} of ${allCards.length}`
                        }
                    />
                    <Plaque
                        label="Class"
                        value={deck?.characterId ?? '—'}
                        sub={deck?.difficulty ?? undefined}
                        color={C.amberDeep}
                    />
                    <Plaque
                        label="Endorsements"
                        value={likesValue}
                        sub={isFav ? 'endorsed by you' : undefined}
                        color={C.purpleDeep}
                    />
                </Box>

                {/* Scribe's Notes — full width above the charts */}
                {deck?.description && deck.description.trim() !== '' && (
                    <InkPanel tone={C.creamHi} style={{marginBottom: 14}}>
                        <div style={{
                            fontFamily: C.display,
                            fontSize: 11,
                            color: C.inkDim,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            marginBottom: 8,
                        }}>Scribe's Notes
                        </div>
                        <Box sx={{
                            fontFamily: C.serif,
                            fontSize: '14px',
                            color: C.inkSoft,
                            lineHeight: 1.5,
                            '& p': {margin: '0 0 8px'},
                            '& a': {color: C.amberDeep},
                            '& code': {
                                fontFamily: C.mono,
                                fontSize: 12,
                                background: C.cream,
                                padding: '1px 4px',
                                borderRadius: 2,
                            },
                        }}>
                            <MuiMarkdown overrides={{}}>{deck.description}</MuiMarkdown>
                        </Box>
                    </InkPanel>
                )}

                {/* Energy + Rarity panels — 2-col row, mirrors the builder's charts row */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'},
                    gap: '14px',
                    marginBottom: '14px',
                }}>
                    <InkPanel tone={C.creamHi}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            gap: '12px',
                            flexWrap: 'wrap',
                        }}>
                            <Box>
                                <div style={{
                                    fontFamily: C.display,
                                    fontSize: 11,
                                    color: C.inkDim,
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}>Energy Curve
                                </div>
                                <Box sx={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px'}}>
                                    <span style={{
                                        fontFamily: C.display,
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: C.ink,
                                    }}>{cards.length ? avg.toFixed(2) : '—'}</span>
                                    <span style={{
                                        fontFamily: C.serif,
                                        fontStyle: 'italic',
                                        fontSize: 12,
                                        color: C.inkDim,
                                    }}>avg cost · {cards.length} cards</span>
                                </Box>
                            </Box>
                        </Box>
                        <EnergyCostGraph cardList={cards}/>
                    </InkPanel>

                    <InkPanel tone={C.creamHi}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            gap: '12px',
                            flexWrap: 'wrap',
                        }}>
                            <Box>
                                <div style={{
                                    fontFamily: C.display,
                                    fontSize: 11,
                                    color: C.inkDim,
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}>Rarity
                                </div>
                                <Box sx={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px'}}>
                                    <span style={{
                                        fontFamily: C.display,
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: C.ink,
                                    }}>{cards.length}</span>
                                    <span style={{
                                        fontFamily: C.serif,
                                        fontStyle: 'italic',
                                        fontSize: 12,
                                        color: C.inkDim,
                                    }}>cards scribed</span>
                                </Box>
                            </Box>
                        </Box>
                        <RarityGraph cardList={cards}/>
                    </InkPanel>
                </Box>

                {/* Deck Composition — full width below the charts */}
                <Box>
                    <InkPanel padding={0} tone={C.creamHi}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: {xs: 'column', sm: 'row'},
                            alignItems: {xs: 'stretch', sm: 'center'},
                            justifyContent: 'space-between',
                            padding: '14px 14px 12px',
                            borderBottom: `1.5px solid ${C.ink}`,
                            background: C.parchment,
                            gap: '12px',
                        }}>
                            <div style={{
                                fontFamily: C.display,
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                color: C.ink,
                            }}>Deck Composition
                            </div>
                            <Box sx={{
                                display: 'flex',
                                gap: '10px',
                                flexWrap: 'wrap',
                            }}>
                                <DropdownC<string>
                                    label="Sort by"
                                    value={filter}
                                    width={150}
                                    surface={C.parchment}
                                    options={[
                                        {value: 'energy', label: 'Energy Cost'},
                                        {value: 'rarity', label: 'Rarity'},
                                    ]}
                                    onChange={setFilter}
                                />
                                <DropdownC<number>
                                    label="Craft Reduction"
                                    value={cardCraftingModifier}
                                    width={168}
                                    surface={C.parchment}
                                    options={[
                                        {value: 1, label: 'No Reduction'},
                                        {value: 0.85, label: '15% Reduction'},
                                        {value: 0.7, label: '30% Reduction'},
                                    ]}
                                    onChange={setCardCraftingModifier}
                                />
                                <DropdownC<number>
                                    label="Upgrade Reduction"
                                    value={cardUpgradingModifier}
                                    width={184}
                                    surface={C.parchment}
                                    options={[
                                        {value: 1, label: 'No Reduction'},
                                        {value: 0.85, label: '15% Reduction'},
                                        {value: 0.7, label: '30% Reduction'},
                                        {value: 0.5, label: '50% Reduction'},
                                    ]}
                                    onChange={setCardUpgradingModifier}
                                />
                            </Box>
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: selectedChapter === 'all'
                                ? {xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)'}
                                : '1fr',
                        }}>
                            {chaptersToRender.map((n, idx) => {
                                const chapterIdx = n - 1;
                                const chapterCards = sortedCards.filter((c) => c.chapter === n);
                                const lastIdx = chaptersToRender.length - 1;
                                return (
                                    <Box key={n} sx={{
                                        padding: '14px 12px',
                                        borderRight: selectedChapter === 'all' ? {
                                            xs: 'none',
                                            sm: idx % 2 === 0 ? `1px dashed ${C.inkMute}` : 'none',
                                            lg: idx < lastIdx ? `1px dashed ${C.inkMute}` : 'none',
                                        } : 'none',
                                        borderBottom: selectedChapter === 'all' ? {
                                            xs: idx < lastIdx ? `1px dashed ${C.inkMute}` : 'none',
                                            sm: idx < lastIdx - 1 ? `1px dashed ${C.inkMute}` : 'none',
                                            lg: 'none',
                                        } : 'none',
                                        position: 'relative',
                                    }}>
                                        <Box sx={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                                            <Banner color={CHAPTER_BANNER[chapterIdx]}
                                                    dark={C.ink}>Chapter {CHAPTER_NUMERALS[chapterIdx]}</Banner>
                                        </Box>
                                        <Box sx={{
                                            textAlign: 'center',
                                            fontFamily: C.serif,
                                            fontStyle: 'italic',
                                            fontSize: 11,
                                            color: C.inkDim,
                                            marginBottom: '8px',
                                        }}>{chapterCards.length} cards</Box>
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: selectedChapter === 'all'
                                                ? '1fr'
                                                : {xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)'},
                                            gap: '6px',
                                        }}>
                                            {chapterCards.map((card, cardIdx) => (
                                                <SmallCardComponent
                                                    card={card}
                                                    key={`ch${n}_${card.id}_${cardIdx}`}
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </InkPanel>

                </Box>
            </Box>
        </Box>
    );
}
