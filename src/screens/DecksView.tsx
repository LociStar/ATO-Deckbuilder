import {Box, Fab, Menu, MenuItem, Pagination} from "@mui/material";
import {useEffect, useState, useContext} from "preact/hooks";
import {JSX} from "preact";
import {useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {useSnackbar} from "notistack";
import AddIcon from '@mui/icons-material/Add';

import {Character, Deck, PagedDeck} from "../types/types";
import {AppConfig} from "../config.ts";
import {AppState} from "./ViewController.tsx";
import RenderOnAuthenticated from "../components/conditionals/RenderOnAuthenticated.tsx";
import {C} from "../components/directionC/tokens.ts";
import {Banner, ChipC, Plaque} from "../components/directionC/primitives.tsx";
import TownHero from "../components/directionC/TownHero.tsx";
import GuildPosting from "../components/directionC/GuildPosting.tsx";

type ChipMenuProps = {
    label: string;
    value: string;
    options: Array<{value: string; label: string}>;
    onChange: (v: string) => void;
    active?: boolean;
    color?: string;
};

function ChipMenu({label, value, options, onChange, active, color}: ChipMenuProps) {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const display = options.find((o) => o.value === value)?.label ?? value;
    return (
        <>
            <div onClick={(e: JSX.TargetedMouseEvent<HTMLDivElement>) => setAnchor(e.currentTarget)}>
                <ChipC
                    label={<span>{label} · <b style={{fontWeight: 700}}>{display}</b></span>}
                    active={active}
                    color={color}
                />
            </div>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
                {options.map((o) => (
                    <MenuItem
                        key={o.value}
                        selected={o.value === value}
                        onClick={() => { onChange(o.value); setAnchor(null); }}
                    >{o.label}</MenuItem>
                ))}
            </Menu>
        </>
    );
}

export default function DecksView() {
    const [decks, setDecks] = useState<Deck[]>([]);
    const defaultCharacter: Character = {characterId: 'All', characterClass: '', secondaryCharacterClass: ''};
    const [characters, setCharacters] = useState<Character[]>([defaultCharacter]);
    const [filter, setFilter] = useState<string>('likes');
    const [characterFilter, setCharacterFilter] = useState<string>('All');
    const [ownedFilter, setOwnedFilter] = useState<string>('All');
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
                setPages(data.pages);
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

    // Plaque stats derived from what's available on the current page.
    const approxTotal = pages > 0 ? pages * 10 : null;
    const uniqueScribes = new Set(decks.map((d) => d.username)).size;
    const topEndorsements = decks.length ? Math.max(...decks.map((d) => d.likes)) : 0;
    const classCounts = decks.reduce<Record<string, number>>((acc, d) => {
        acc[d.characterId] = (acc[d.characterId] ?? 0) + 1;
        return acc;
    }, {});
    const topClassEntry = Object.entries(classCounts).sort((a, b) => b[1] - a[1])[0];

    return (
        <Box sx={{background: C.cream, minHeight: '100%', position: 'relative'}}>
            <TownHero
                height={340}
                eyebrow="THE GUILD HALL"
                title="Community Deck Codex"
                sub={approxTotal
                    ? `Roughly ${approxTotal} builds, scribed by adventurers across the realm.`
                    : 'Builds scribed by adventurers across the realm.'}
            />

            <Box sx={{
                padding: {xs: '0 16px 24px', md: '0 28px 32px'},
                marginTop: '-36px',
                position: 'relative',
                zIndex: 2,
            }}>
                {/* Stat plaques */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(5, 1fr)',
                    },
                    gap: '10px',
                    marginBottom: '18px',
                }}>
                    <Plaque
                        label="Decks Catalogued"
                        value={approxTotal ? `≈${approxTotal}` : '—'}
                        sub="across the codex"
                    />
                    <Plaque
                        label="Scribes Here"
                        value={uniqueScribes || '—'}
                        sub="on this page"
                        color={C.tealDeep}
                    />
                    <Plaque
                        label="Top Endorsement"
                        value={topEndorsements || '—'}
                        sub="on this page"
                        color={C.red}
                    />
                    <Plaque
                        label="Page"
                        value={pages ? `${page} / ${pages}` : '—'}
                        color={C.amberDeep}
                    />
                    <Plaque
                        label="Class Focus"
                        value={characterFilter !== 'All' ? characterFilter : (topClassEntry?.[0] ?? '—')}
                        sub={characterFilter !== 'All' ? 'filtered' : (topClassEntry ? `${topClassEntry[1]} on this page` : undefined)}
                        color={C.purpleDeep}
                    />
                </Box>

                {/* Filter row */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    padding: '10px 14px',
                    background: C.parchment,
                    border: `1.5px solid ${C.ink}`,
                    borderRadius: '3px',
                    boxShadow: `0 2px 0 ${C.ink}`,
                    marginBottom: '22px',
                }}>
                    <span style={{
                        fontFamily: C.display,
                        fontSize: 10,
                        color: C.inkDim,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        marginRight: 6,
                        fontWeight: 600,
                    }}>Filter</span>

                    <ChipMenu
                        label="Class"
                        value={characterFilter}
                        active={characterFilter !== 'All'}
                        color={C.amber}
                        options={characters.map((c) => ({value: c.characterId, label: c.characterId}))}
                        onChange={(v) => { setCharacterFilter(v); setPage(1); }}
                    />

                    <RenderOnAuthenticated>
                        <ChipMenu
                            label="Ownership"
                            value={ownedFilter}
                            active={ownedFilter !== 'All'}
                            color={C.green}
                            options={[
                                {value: 'All', label: 'All'},
                                {value: 'Owned', label: 'Owned'},
                                {value: 'Unowned', label: 'Unowned'},
                            ]}
                            onChange={(v) => { setOwnedFilter(v); setPage(1); }}
                        />
                    </RenderOnAuthenticated>

                    <Box sx={{flex: 1}} />

                    <span style={{
                        fontFamily: C.display,
                        fontSize: 10,
                        color: C.inkDim,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                    }}>Sort</span>
                    <ChipMenu
                        label=""
                        value={filter}
                        active
                        color={C.red}
                        options={[
                            {value: 'likes', label: 'Endorsements ↓'},
                            {value: 'name', label: 'Name (A–Z)'},
                        ]}
                        onChange={(v) => { setFilter(v); setPage(1); }}
                    />
                </Box>

                {/* Section banner */}
                <Box sx={{display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '14px'}}>
                    <Banner color={C.green} dark={C.greenDeep}>Featured Postings</Banner>
                    <Box sx={{
                        flex: 1,
                        borderBottom: `1.5px dashed ${C.inkMute}`,
                        paddingBottom: '10px',
                        display: {xs: 'none', sm: 'block'},
                    }}>
                        <span style={{
                            fontFamily: C.serif,
                            fontStyle: 'italic',
                            color: C.inkDim,
                            fontSize: 13,
                        }}>Posted to the Hall — sorted by {filter === 'likes' ? 'endorsement' : 'name'}</span>
                    </Box>
                </Box>

                {/* Deck grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                    },
                    gap: '14px',
                    marginBottom: '24px',
                }}>
                    {decks.map((deck, i) => (
                        <GuildPosting key={deck.id} deck={deck} rank={page === 1 ? i + 1 : undefined} />
                    ))}
                </Box>

                {/* Pagination */}
                {pages > 1 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '12px',
                    }}>
                        <Box sx={{
                            background: C.creamHi,
                            border: `1.5px solid ${C.ink}`,
                            borderRadius: '3px',
                            boxShadow: `0 2px 0 ${C.ink}`,
                            padding: '4px 8px',
                        }}>
                            <Pagination
                                count={pages}
                                page={page}
                                onChange={(_event, value) => setPage(value)}
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                        color: C.ink,
                                        fontFamily: C.display,
                                        fontWeight: 600,
                                        borderColor: C.inkMute,
                                    },
                                    '& .Mui-selected': {
                                        background: `${C.amber} !important`,
                                        color: `${C.creamHi} !important`,
                                        borderColor: C.ink,
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Floating "scribe a new build" button */}
            <Fab
                aria-label="add"
                onClick={onCardActionClick}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    background: C.amber,
                    color: C.creamHi,
                    border: `2px solid ${C.ink}`,
                    boxShadow: `0 3px 0 ${C.ink}, 0 6px 14px rgba(31,20,8,.3)`,
                    '&:hover': {
                        background: C.amberDeep,
                    },
                }}
            >
                <AddIcon/>
            </Fab>
        </Box>
    );
}
