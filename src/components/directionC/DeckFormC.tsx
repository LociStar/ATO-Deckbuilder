import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Chip,
    Snackbar,
    TextField,
} from '@mui/material';
import {useEffect, useState, useContext, useRef} from 'preact/hooks';
import {useNavigate} from 'react-router-dom';
import {MuiMarkdown} from 'mui-markdown';

import {Card, Character} from '../../types/types';
import {AppConfig} from '../../config';
import {AppState} from '../../screens/ViewController';
import {calculate_deck_cost} from '../../utils/utils';
import CardsLoader from '../CardsLoader';
import {EnergyCostGraph} from '../graphs/EnergyCostGraph';
import {RarityGraph} from '../graphs/RarityGraph';
import townImage from '../../assets/extended-town_.webp';

import {C, classAccent} from './tokens';
import {Banner, InkPanel, StainedFrame, WaxSeal} from './primitives';
import ChapterTabC from './ChapterTabC';
import PickedCardRow from './PickedCardRow';
import LibraryCardTile from './LibraryCardTile';
import CharacterDropdown from './CharacterDropdown';

const DIFFICULTY_OPTIONS = ['Adventurer', 'Madness 1', 'Madness 2', 'Madness 3', 'Madness 4', 'Madness 5'];
const MAX_TAGS = 3;
const MAX_TAG_LENGTH = 12;
const TAG_SUGGESTIONS = ['CRIT', 'BLEED', 'FROST', 'BURN', 'POISON', 'STUN', 'HEAL', 'SHIELD'];
const TITLE_MAX = 80;
const CHAPTER_COLORS = [C.amber, C.teal, C.purple, C.green];

export interface DeckFormInitial {
    title: string;
    description: string;
    characterId: string;
    cardList: Card[];
    difficulty?: string;
    tags?: string[];
}

export interface DeckFormPayload {
    title: string;
    description: string;
    cardList: Card[];
    characterId: string;
    difficulty: string | null;
    tags: string[] | null;
}

export interface DeckFormCProps {
    mode: 'create' | 'edit';
    initialDeck?: DeckFormInitial;
    readOnly?: boolean;
    subtitle: string;
    breadcrumbTail: string;
    primaryActionLabel: string;
    onSave: (payload: DeckFormPayload) => Promise<void>;
    onDelete?: () => Promise<void>;
}

export default function DeckFormC({
    mode,
    initialDeck,
    readOnly = false,
    subtitle,
    breadcrumbTail,
    primaryActionLabel,
    onSave,
    onDelete,
}: DeckFormCProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<string>('');
    const [cardList, setCardList] = useState<Card[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [chars, setChars] = useState<Character[]>([]);
    const [cardCost, setCardCost] = useState(0);
    const [cardCraftingModifier] = useState(0.7);
    const [cardUpgradingModifier] = useState(0.5);
    const [tabValue, setTabValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState(0);
    const [baseCardList, setBaseCardList] = useState<Card[]>([]);
    const [difficulty, setDifficulty] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [charDropdownOpen, setCharDropdownOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const {searchText} = useContext(AppState);
    const navigate = useNavigate();
    const charPickerRef = useRef<HTMLDivElement>(null);
    const difficultyRef = useRef<HTMLSelectElement>(null);
    const hydrated = useRef(false);

    useEffect(() => {
        if (!initialDeck || hydrated.current) return;
        setTitle(initialDeck.title);
        setDescription(initialDeck.description);
        setSelectedCharacter(initialDeck.characterId);
        setCardList(initialDeck.cardList);
        setDifficulty(initialDeck.difficulty ?? '');
        setTags(initialDeck.tags ?? []);
        hydrated.current = true;
    }, [initialDeck]);

    // Preact's controlled <select> can fail to sync `value` when the option
    // list and the value land on the same render. Imperatively reapply.
    useEffect(() => {
        if (difficultyRef.current && difficultyRef.current.value !== difficulty) {
            difficultyRef.current.value = difficulty;
        }
    }, [difficulty]);

    const removeCard = (cardToRemove: Card) => {
        if (readOnly) return;
        setCardList((oldList) => {
            const i = oldList.findIndex((c) => c === cardToRemove);
            return i === -1 ? oldList : [...oldList.slice(0, i), ...oldList.slice(i + 1)];
        });
    };

    useEffect(() => {
        setCardCost(calculate_deck_cost(cardList, baseCardList, cardCraftingModifier, cardUpgradingModifier));
    }, [cardList, cardCraftingModifier, cardUpgradingModifier, baseCardList]);

    useEffect(() => {
        fetch(AppConfig.API_URL + '/character', {method: 'GET'})
            .then((response) => response.json())
            .then((data) => setChars(data));
    }, []);

    useEffect(() => {
        if (!selectedCharacter) return;
        fetch(AppConfig.API_URL + '/character/default/' + selectedCharacter, {method: 'GET'})
            .then((response) => response.json())
            .then((data) => {
                setBaseCardList(data);
                if (cardList.length === 0 || sameCardIds(cardList, baseCardList)) {
                    setCardList([]);
                    data.forEach((card: Card) => addCardToList(card));
                }
            });
    }, [selectedCharacter]);

    function sameCardIds(a: Card[], b: Card[]): boolean {
        if (a.length !== b.length) return false;
        return a.every((card, i) => card.id === b[i].id);
    }

    const addCardToList = (card: Card) => {
        if (readOnly) return;
        const copy = {...card, chapter: selectedChapter + 1};
        setCardList((oldList) => [...oldList, copy]);
    };

    const handleClose = (_e: Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
        if (openError) setIsSaving(false);
        setOpenError(false);
    };

    async function handleSave() {
        if (readOnly) return;
        setIsSaving(true);
        const payload: DeckFormPayload = {
            title,
            description,
            cardList,
            characterId: selectedCharacter,
            difficulty: difficulty || null,
            tags: tags.length ? tags : null,
        };
        try {
            await onSave(payload);
            setOpen(true);
        } catch (error) {
            console.log(error);
            setOpenError(true);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!onDelete || readOnly) return;
        setDeleteConfirmOpen(false);
        setIsSaving(true);
        try {
            await onDelete();
        } catch (error) {
            console.log(error);
            setOpenError(true);
            setIsSaving(false);
        }
    }

    function clearCurrentChapter() {
        if (readOnly) return;
        setCardList((old) => old.filter((c) => c.chapter !== selectedChapter + 1));
    }

    const selectedChar = chars.find((c) => c.characterId === selectedCharacter);
    const accent = classAccent(selectedCharacter);
    const currentChapterCards = cardList.filter((c) => c.chapter === selectedChapter + 1);
    const chapterCounts = [1, 2, 3, 4].map((n) => cardList.filter((c) => c.chapter === n).length);

    const groupedPicks = (() => {
        const map = new Map<string, {card: Card; count: number}>();
        for (const c of currentChapterCards) {
            const key = `${c.id}`;
            const entry = map.get(key);
            if (entry) entry.count += 1;
            else map.set(key, {card: c, count: 1});
        }
        return Array.from(map.values());
    })();

    const avgEnergy = cardList.length
        ? (cardList.reduce((s, c) => s + (c.energyCost | 0), 0) / cardList.length).toFixed(2)
        : '0.00';

    const charCount = title.length;
    const titleColor = charCount > TITLE_MAX ? C.red : C.inkMute;
    const readyToSave = !readOnly && !!title.trim() && !!selectedCharacter && cardList.length > 0 && !isSaving;

    return (
        <Box sx={{background: C.cream, minHeight: '100%'}}>
            {/* Town strip + breadcrumb + banner */}
            <Box sx={{position: 'relative', height: 88, overflow: 'hidden'}}>
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${townImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%',
                }} />
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(168,200,218,0) 0%, rgba(245,234,208,.6) 70%, rgba(245,234,208,1) 100%)',
                }} />
                <Box sx={{
                    position: 'absolute',
                    top: 14,
                    left: {xs: 16, md: 28},
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: C.serif,
                    fontStyle: 'italic',
                    fontSize: 13,
                    color: C.creamHi,
                    textShadow: '0 1px 2px rgba(0,0,0,.6)',
                }}>
                    <span style={{cursor: 'pointer', opacity: 0.85}} onClick={() => navigate('/')}>Guild Hall</span>
                    <span style={{opacity: 0.6}}>›</span>
                    <span style={{cursor: 'pointer', opacity: 0.85}}>The Forge</span>
                    <span style={{opacity: 0.6}}>›</span>
                    <span>{breadcrumbTail}</span>
                </Box>
                <Box sx={{
                    position: 'absolute',
                    top: 38,
                    left: {xs: 16, md: 28},
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <Banner color={C.amber} dark={C.amberDeep}>The Scribe's Desk</Banner>
                    <span style={{
                        marginLeft: 8,
                        fontFamily: C.serif,
                        fontStyle: 'italic',
                        fontSize: 14,
                        color: C.ink,
                        opacity: 0.7,
                        alignSelf: 'flex-end',
                        paddingBottom: 10,
                    }}>{subtitle}</span>
                </Box>
            </Box>

            <Box sx={{padding: {xs: '0 16px 28px', md: '0 28px 28px'}, position: 'relative'}}>

                {readOnly && (
                    <Box sx={{
                        margin: '14px 0',
                        padding: '10px 14px',
                        background: C.creamHi,
                        border: `1.5px solid ${C.red}`,
                        borderRadius: '3px',
                        boxShadow: `0 2px 0 ${C.red}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}>
                        <WaxSeal size={22} label="!" color={C.red} />
                        <div>
                            <div style={{
                                fontFamily: C.display,
                                fontSize: 11,
                                color: C.red,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                fontWeight: 700,
                            }}>View only</div>
                            <div style={{
                                fontFamily: C.serif,
                                fontStyle: 'italic',
                                fontSize: 13,
                                color: C.inkSoft,
                            }}>You are not the owner of this folio — changes cannot be saved.</div>
                        </div>
                    </Box>
                )}

                {/* Title + Edit/Preview tabs */}
                <InkPanel padding={0} tone={C.creamHi} style={{marginBottom: 14, overflow: 'visible'}}>
                    <Box sx={{padding: '16px 20px'}}>
                        <div style={{
                            fontFamily: C.display,
                            fontSize: 9,
                            color: C.inkDim,
                            letterSpacing: '0.24em',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                            marginBottom: 3,
                        }}>Folio Title</div>
                        <Box sx={{display: 'flex', alignItems: 'baseline', gap: '8px'}}>
                            <input
                                value={title}
                                disabled={readOnly}
                                onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
                                placeholder="Name this folio"
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    fontFamily: C.display,
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: C.ink,
                                    letterSpacing: '-0.005em',
                                    padding: 0,
                                }}
                            />
                            <span style={{
                                fontFamily: C.mono,
                                fontSize: 10,
                                color: titleColor,
                                letterSpacing: '0.04em',
                            }}>{charCount}/{TITLE_MAX}</span>
                        </Box>
                        <div style={{
                            marginTop: 4,
                            fontFamily: C.serif,
                            fontStyle: 'italic',
                            fontSize: 12,
                            color: C.inkDim,
                        }}>
                            <span style={{color: C.amberDeep, fontWeight: 700, fontStyle: 'normal', marginRight: 4}}>!</span>
                            give it a name future-you can find again
                        </div>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        borderTop: `1.5px solid ${C.ink}`,
                        background: C.cream,
                        paddingLeft: '14px',
                    }}>
                        {(['Edit', 'Preview'] as const).map((label, i) => {
                            const active = tabValue === i;
                            return (
                                <div
                                    key={label}
                                    onClick={() => setTabValue(i)}
                                    style={{
                                        padding: '10px 18px',
                                        fontFamily: C.display,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        letterSpacing: '0.2em',
                                        textTransform: 'uppercase',
                                        color: active ? C.amberDeep : C.inkDim,
                                        borderBottom: active ? `3px solid ${C.amberDeep}` : '3px solid transparent',
                                        marginBottom: -1.5,
                                        cursor: 'pointer',
                                    }}>{label}</div>
                            );
                        })}
                    </Box>
                </InkPanel>

                {/* Description + Character */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: '1fr 360px'},
                    gap: '14px',
                    marginBottom: '14px',
                }}>
                    <InkPanel padding={0} tone={C.creamHi}>
                        <Box sx={{
                            padding: '12px 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}>
                            <div style={{
                                fontFamily: C.display,
                                fontSize: 10,
                                color: C.inkDim,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                            }}>Description</div>
                            <span style={{
                                fontFamily: C.serif,
                                fontStyle: 'italic',
                                fontSize: 11,
                                color: C.inkMute,
                            }}>markdown welcome</span>
                        </Box>
                        {tabValue === 0 ? (
                            <Box sx={{padding: '8px 16px 14px'}}>
                                <textarea
                                    value={description}
                                    disabled={readOnly}
                                    onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
                                    placeholder="# Strategy.&#10;Tips will render in Preview ▸"
                                    rows={6}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: `1px dashed ${C.inkMute}`,
                                        borderRadius: 3,
                                        outline: 'none',
                                        padding: '10px 12px',
                                        fontFamily: C.serif,
                                        fontSize: 14,
                                        color: C.inkSoft,
                                        lineHeight: 1.55,
                                        resize: 'vertical',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box sx={{
                                padding: '8px 16px 14px',
                                fontFamily: C.serif,
                                fontSize: '14px',
                                color: C.inkSoft,
                                lineHeight: 1.55,
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
                                {description.trim()
                                    ? <MuiMarkdown overrides={{}}>{description}</MuiMarkdown>
                                    : <span style={{fontStyle: 'italic', color: C.inkDim}}>nothing scribed yet…</span>}
                            </Box>
                        )}
                    </InkPanel>

                    {/* Character */}
                    <Box ref={charPickerRef} sx={{position: 'relative'}}>
                        <InkPanel padding={0} tone={C.creamHi} style={{cursor: readOnly ? 'default' : 'pointer'}}>
                            <Box
                                onClick={() => !readOnly && setCharDropdownOpen((v) => !v)}
                                sx={{
                                    padding: '12px 14px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                {selectedCharacter ? (
                                    <StainedFrame characterId={selectedCharacter} size={48} rounded={4} accent={accent} />
                                ) : (
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 4,
                                        background: C.parchment,
                                        border: `2px solid ${C.ink}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontFamily: C.display,
                                        fontSize: 22,
                                        color: C.inkMute,
                                    }}>?</div>
                                )}
                                <div style={{flex: 1, minWidth: 0}}>
                                    <div style={{
                                        fontFamily: C.display,
                                        fontSize: 10,
                                        color: C.inkDim,
                                        letterSpacing: '0.22em',
                                        textTransform: 'uppercase',
                                        fontWeight: 600,
                                    }}>Character</div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        gap: 8,
                                        marginTop: 1,
                                    }}>
                                        <span style={{
                                            fontFamily: C.display,
                                            fontSize: 22,
                                            fontWeight: 700,
                                            color: selectedChar ? C.ink : C.inkMute,
                                        }}>{selectedChar?.characterId ?? 'Pick a hero'}</span>
                                        {selectedChar?.characterClass && (
                                            <span style={{
                                                fontFamily: C.serif,
                                                fontStyle: 'italic',
                                                fontSize: 13,
                                                color: C.inkDim,
                                            }}>· {selectedChar.characterClass}</span>
                                        )}
                                    </div>
                                </div>
                                <svg
                                    width="14"
                                    height="9"
                                    viewBox="0 0 14 9"
                                    fill="none"
                                    stroke={C.ink}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{transform: charDropdownOpen ? 'rotate(180deg)' : undefined}}
                                >
                                    <path d="M1 1 L7 7 L13 1" />
                                </svg>
                            </Box>
                        </InkPanel>
                        {charDropdownOpen && !readOnly && (
                            <CharacterDropdown
                                chars={chars}
                                selected={selectedCharacter}
                                onSelect={(id) => {
                                    setSelectedCharacter(id);
                                    setCharDropdownOpen(false);
                                }}
                                onClose={() => setCharDropdownOpen(false)}
                            />
                        )}
                    </Box>
                </Box>

                {/* Difficulty + Tags */}
                <InkPanel tone={C.creamHi} style={{marginBottom: 14}}>
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {xs: '1fr', md: '200px 1fr'},
                        gap: '12px',
                        alignItems: 'center',
                    }}>
                        <Box>
                            <div style={{
                                fontFamily: C.display,
                                fontSize: 9,
                                color: C.inkDim,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                marginBottom: 4,
                            }}>Difficulty</div>
                            <select
                                ref={difficultyRef}
                                value={difficulty}
                                disabled={readOnly}
                                onChange={(e) => setDifficulty((e.target as HTMLSelectElement).value)}
                                style={{
                                    width: '100%',
                                    background: C.creamHi,
                                    border: `1.5px solid ${C.ink}`,
                                    borderRadius: 3,
                                    boxShadow: `0 2px 0 ${C.ink}`,
                                    padding: '8px 10px',
                                    fontFamily: C.serif,
                                    fontSize: 13.5,
                                    color: C.ink,
                                    fontWeight: 600,
                                }}
                            >
                                <option value="">None</option>
                                {DIFFICULTY_OPTIONS.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </Box>
                        <Box>
                            <div style={{
                                fontFamily: C.display,
                                fontSize: 9,
                                color: C.inkDim,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                fontWeight: 600,
                                marginBottom: 4,
                            }}>Tags (up to {MAX_TAGS})</div>
                            <Autocomplete
                                multiple
                                freeSolo
                                size="small"
                                disabled={readOnly}
                                options={TAG_SUGGESTIONS}
                                value={tags}
                                onChange={(_e, value) => {
                                    const cleaned = (value as string[])
                                        .map((t) => t.trim().toUpperCase().slice(0, MAX_TAG_LENGTH))
                                        .filter((t, i, a) => t && a.indexOf(t) === i)
                                        .slice(0, MAX_TAGS);
                                    setTags(cleaned);
                                }}
                                renderTags={(value: string[], getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option}
                                            {...getTagProps({index})}
                                            sx={{
                                                background: C.amber,
                                                color: C.creamHi,
                                                border: `1px solid ${C.ink}`,
                                                fontFamily: C.display,
                                                fontSize: 10,
                                                letterSpacing: '0.14em',
                                                fontWeight: 700,
                                                '& .MuiChip-deleteIcon': {color: C.creamHi, opacity: 0.85},
                                            }}
                                        />
                                    ))
                                }
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        placeholder="e.g. CRIT, BLEED"
                                        sx={{
                                            background: C.creamHi,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '3px',
                                                boxShadow: `0 2px 0 ${C.ink}`,
                                                fontFamily: C.serif,
                                                color: C.ink,
                                                '& fieldset': {border: `1.5px solid ${C.ink}`},
                                                '&:hover fieldset': {border: `1.5px solid ${C.ink}`},
                                                '&.Mui-focused fieldset': {border: `1.5px solid ${C.ink}`},
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Box>
                    </Box>
                </InkPanel>

                {/* Charts row */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'},
                    gap: '14px',
                    marginBottom: '18px',
                }}>
                    <InkPanel tone={C.creamHi}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            gap: '12px',
                            flexWrap: 'wrap',
                        }}>
                            <Box>
                                <div style={{
                                    fontFamily: C.display,
                                    fontSize: 10,
                                    color: C.inkDim,
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}>Energy Curve</div>
                                <Box sx={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px'}}>
                                    <span style={{
                                        fontFamily: C.display,
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: C.ink,
                                    }}>{avgEnergy}</span>
                                    <span style={{
                                        fontFamily: C.serif,
                                        fontStyle: 'italic',
                                        fontSize: 12,
                                        color: C.inkDim,
                                    }}>avg cost · {cardList.length} cards</span>
                                </Box>
                            </Box>
                        </Box>
                        <EnergyCostGraph cardList={cardList} height={200} />
                    </InkPanel>

                    <InkPanel tone={C.creamHi}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            gap: '12px',
                            flexWrap: 'wrap',
                        }}>
                            <Box>
                                <div style={{
                                    fontFamily: C.display,
                                    fontSize: 10,
                                    color: C.inkDim,
                                    letterSpacing: '0.22em',
                                    textTransform: 'uppercase',
                                    fontWeight: 600,
                                }}>Rarity</div>
                                <Box sx={{display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px'}}>
                                    <span style={{
                                        fontFamily: C.display,
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: C.ink,
                                    }}>{cardList.length}</span>
                                    <span style={{
                                        fontFamily: C.serif,
                                        fontStyle: 'italic',
                                        fontSize: 12,
                                        color: C.inkDim,
                                    }}>cards picked</span>
                                </Box>
                            </Box>
                        </Box>
                        <RarityGraph cardList={cardList} height={200} />
                    </InkPanel>
                </Box>

                {/* Chapter tabs */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    borderBottom: `1.5px solid ${C.ink}`,
                    marginBottom: '16px',
                    gap: '4px',
                    flexWrap: 'wrap',
                }}>
                    {[1, 2, 3, 4].map((n) => (
                        <ChapterTabC
                            key={n}
                            chapter={n}
                            count={chapterCounts[n - 1]}
                            active={selectedChapter === n - 1}
                            color={CHAPTER_COLORS[n - 1]}
                            onClick={() => setSelectedChapter(n - 1)}
                        />
                    ))}
                    <Box sx={{flex: 1}} />
                    <Box sx={{
                        paddingBottom: '9px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        flexWrap: 'wrap',
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'baseline', gap: '5px'}}>
                            <span style={{
                                fontFamily: C.mono,
                                fontSize: 13,
                                color: C.ink,
                                fontWeight: 700,
                            }}>{cardCost}</span>
                            <span style={{
                                fontFamily: C.serif,
                                fontStyle: 'italic',
                                fontSize: 12,
                                color: C.inkDim,
                            }}>blue shards spent</span>
                        </Box>
                        <Button
                            onClick={clearCurrentChapter}
                            disabled={readOnly || currentChapterCards.length === 0}
                            sx={{
                                padding: '5px 12px',
                                fontFamily: C.display,
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.16em',
                                textTransform: 'uppercase',
                                background: C.cream,
                                color: C.inkSoft,
                                border: `1.5px solid ${C.ink}`,
                                borderRadius: '2px',
                                boxShadow: `0 1.5px 0 ${C.ink}`,
                                minWidth: 0,
                                '&:hover': {background: C.creamHi},
                                '&.Mui-disabled': {opacity: 0.5},
                            }}
                        >↺ Clear</Button>
                    </Box>
                </Box>

                {/* Workbench */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {xs: '1fr', lg: '380px 1fr'},
                    gap: '16px',
                    marginBottom: '16px',
                }}>
                    {/* Left: picked cards */}
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'baseline',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            gap: '8px',
                        }}>
                            <div style={{
                                fontFamily: C.display,
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.ink,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                            }}>Cards of Chapter {selectedChapter + 1}</div>
                            <div style={{
                                fontFamily: C.serif,
                                fontStyle: 'italic',
                                fontSize: 13,
                                color: C.inkDim,
                            }}>{currentChapterCards.length} picked · {cardCost} shards</div>
                        </Box>
                        {groupedPicks.length === 0 ? (
                            <InkPanel tone={C.cream} style={{textAlign: 'center'}}>
                                <span style={{
                                    fontFamily: C.serif,
                                    fontStyle: 'italic',
                                    color: C.inkDim,
                                    fontSize: 13,
                                }}>No cards yet — pick from the library on the right.</span>
                            </InkPanel>
                        ) : (
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
                                {groupedPicks.map(({card, count}) => (
                                    <Box key={card.id + '_' + count} sx={{position: 'relative'}}>
                                        <PickedCardRow card={card} onClick={removeCard} />
                                        {count > 1 && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 6,
                                                right: 50,
                                                fontFamily: C.mono,
                                                fontSize: 11,
                                                color: C.inkDim,
                                                fontWeight: 700,
                                                background: C.cream,
                                                padding: '1px 6px',
                                                borderRadius: 2,
                                                border: `1px solid ${C.inkMute}`,
                                                pointerEvents: 'none',
                                            }}>×{count}</div>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>

                    {/* Right: library */}
                    <Box>
                        <Box sx={{marginBottom: '10px'}}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: C.creamHi,
                                border: `1.5px solid ${C.ink}`,
                                borderRadius: '3px',
                                padding: '9px 12px',
                                boxShadow: `0 2px 0 ${C.ink}`,
                            }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.inkDim} strokeWidth="1.8">
                                    <circle cx="6" cy="6" r="4.5" />
                                    <path d="M9 9 L13 13" />
                                </svg>
                                <input
                                    placeholder="Seek a card by name…"
                                    value={searchText.value}
                                    onInput={(e) => (searchText.value = (e.target as HTMLInputElement).value)}
                                    style={{
                                        flex: 1,
                                        background: 'transparent',
                                        border: 'none',
                                        outline: 'none',
                                        fontFamily: C.serif,
                                        fontStyle: 'italic',
                                        fontSize: 13.5,
                                        color: C.ink,
                                    }}
                                />
                            </Box>
                        </Box>

                        {selectedCharacter ? (
                            <Box sx={{
                                padding: '14px',
                                background: C.parchment,
                                border: `1.5px solid ${C.ink}`,
                                borderRadius: '3px',
                                boxShadow: `0 2px 0 ${C.ink}`,
                            }}>
                                <CardsLoader
                                    fixed_buttons
                                    parchmentButtons
                                    charClass={selectedChar?.characterClass ?? ''}
                                    secondaryCharClass={selectedChar?.secondaryCharacterClass ?? ''}
                                    onCardClick={addCardToList}
                                    gridStyle={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                                        gap: '10px',
                                    }}
                                    renderCard={(card, click) => (
                                        <LibraryCardTile key={card.id} card={card} onClick={click} />
                                    )}
                                />
                            </Box>
                        ) : (
                            <InkPanel tone={C.cream} style={{textAlign: 'center', padding: '36px 16px'}}>
                                <span style={{
                                    fontFamily: C.serif,
                                    fontStyle: 'italic',
                                    color: C.inkDim,
                                    fontSize: 13,
                                }}>Pick a character to unlock the library.</span>
                            </InkPanel>
                        )}
                    </Box>
                </Box>

                {/* Wood save bar */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 18px',
                    background: `linear-gradient(${C.wood}, ${C.woodDark})`,
                    border: `1.5px solid ${C.ink}`,
                    borderRadius: '3px',
                    boxShadow: `0 3px 0 ${C.ink}, 0 6px 14px rgba(0,0,0,.18)`,
                    flexWrap: 'wrap',
                }}>
                    <WaxSeal size={26} label={readyToSave ? '✓' : '…'} color={readyToSave ? C.green : C.amberDeep} />
                    <Box sx={{flex: 1, minWidth: 160}}>
                        <div style={{
                            fontFamily: C.display,
                            fontSize: 14,
                            color: C.creamHi,
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                        }}>{readOnly ? 'Folio sealed' : readyToSave ? 'Ready to seal the folio' : 'Folio in progress'}</div>
                        <div style={{
                            fontFamily: C.serif,
                            fontStyle: 'italic',
                            fontSize: 12,
                            color: C.creamShade,
                            marginTop: 1,
                        }}>
                            {cardList.length === 0
                                ? 'Pick a character and add cards to begin'
                                : `Chapter ${selectedChapter + 1} · ${currentChapterCards.length} card${currentChapterCards.length === 1 ? '' : 's'} drafted`}
                        </div>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontFamily: C.mono,
                        fontSize: 11,
                        color: C.creamShade,
                        letterSpacing: '0.06em',
                    }}>
                        <span>{cardList.length} CARDS</span>
                        <span style={{opacity: 0.4}}>·</span>
                        <span>{avgEnergy} AVG</span>
                        <span style={{opacity: 0.4}}>·</span>
                        <span>{cardCost} SHARDS</span>
                    </Box>
                    {mode === 'edit' && onDelete && (
                        <Button
                            onClick={() => setDeleteConfirmOpen(true)}
                            disabled={readOnly || isSaving}
                            sx={{
                                padding: '8px 14px',
                                fontFamily: C.display,
                                fontSize: '11px',
                                fontWeight: 700,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                background: 'transparent',
                                color: C.creamHi,
                                border: `1.5px solid ${C.creamShade}`,
                                borderRadius: '2px',
                                minWidth: 0,
                                '&:hover': {background: 'rgba(176,56,38,.25)', borderColor: C.red},
                                '&.Mui-disabled': {opacity: 0.45, color: C.creamShade},
                            }}
                        >Discard Folio</Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={readOnly || isSaving || cardList.length === 0 || !title.trim() || !selectedCharacter}
                        sx={{
                            padding: '8px 18px',
                            fontFamily: C.display,
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.18em',
                            textTransform: 'uppercase',
                            background: C.amber,
                            color: C.creamHi,
                            border: `1.5px solid ${C.ink}`,
                            borderRadius: '2px',
                            boxShadow: `0 2px 0 ${C.ink}`,
                            minWidth: 0,
                            '&:hover': {background: C.amberDeep},
                            '&.Mui-disabled': {opacity: 0.55, color: C.creamHi, background: C.amber},
                        }}
                    >{primaryActionLabel}</Button>
                </Box>
            </Box>

            {/* Delete confirmation modal */}
            {deleteConfirmOpen && (
                <Box
                    onClick={() => setDeleteConfirmOpen(false)}
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(31,20,8,0.55)',
                        zIndex: 1300,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                    }}>
                    <Box
                        onClick={(e: MouseEvent) => e.stopPropagation()}
                        sx={{maxWidth: 420, width: '100%'}}>
                        <InkPanel tone={C.creamHi} padding={0} style={{overflow: 'hidden'}}>
                            <Box sx={{padding: '14px 18px 4px'}}>
                                <Banner color={C.red} dark={C.woodDark}>Discard Folio?</Banner>
                            </Box>
                            <Box sx={{padding: '8px 20px 18px'}}>
                                <div style={{
                                    fontFamily: C.serif,
                                    fontStyle: 'italic',
                                    fontSize: 14,
                                    color: C.inkSoft,
                                    lineHeight: 1.55,
                                }}>This will erase the folio from the Guild Hall. It cannot be recovered.</div>
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '10px',
                                padding: '12px 18px',
                                background: C.cream,
                                borderTop: `1.5px solid ${C.ink}`,
                            }}>
                                <Button
                                    onClick={() => setDeleteConfirmOpen(false)}
                                    sx={{
                                        padding: '7px 14px',
                                        fontFamily: C.display,
                                        fontSize: '10.5px',
                                        fontWeight: 700,
                                        letterSpacing: '0.16em',
                                        textTransform: 'uppercase',
                                        background: C.creamHi,
                                        color: C.inkSoft,
                                        border: `1.5px solid ${C.ink}`,
                                        borderRadius: '2px',
                                        boxShadow: `0 1.5px 0 ${C.ink}`,
                                        minWidth: 0,
                                        '&:hover': {background: C.cream},
                                    }}
                                >Keep editing</Button>
                                <Button
                                    onClick={handleDelete}
                                    sx={{
                                        padding: '7px 16px',
                                        fontFamily: C.display,
                                        fontSize: '10.5px',
                                        fontWeight: 700,
                                        letterSpacing: '0.16em',
                                        textTransform: 'uppercase',
                                        background: C.red,
                                        color: C.creamHi,
                                        border: `1.5px solid ${C.ink}`,
                                        borderRadius: '2px',
                                        boxShadow: `0 1.5px 0 ${C.ink}`,
                                        minWidth: 0,
                                        '&:hover': {background: C.woodDark},
                                    }}
                                >Discard</Button>
                            </Box>
                        </InkPanel>
                    </Box>
                </Box>
            )}

            <Snackbar
                open={open}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="success" variant="filled">
                    {mode === 'edit' ? 'Deck updated.' : 'Deck uploaded.'}
                </Alert>
            </Snackbar>
            <Snackbar
                open={openError}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity="error" variant="filled">Unexpected error occurred, please try again later.</Alert>
            </Snackbar>
        </Box>
    );
}
