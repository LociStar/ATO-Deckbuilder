import {useContext, useEffect, useMemo, useRef, useState} from 'preact/hooks';
import {AppConfig} from '../../../config';
import {AppState} from '../../../screens/ViewController';
import {LibraryEntry, LibraryFacetCounts, LibraryStats, PagedLibrary} from '../../../types/types';
import townImage from '../../../assets/extended-town_.webp';
import {C} from '../tokens';
import {Banner} from '../primitives';
import AlphaJump from './AlphaJump';
import LibraryStatPlaques from './LibraryStatPlaques';
import LibraryFacets from './LibraryFacets';
import LibrarySortBar from './LibrarySortBar';
import WikiCardTile from './WikiCardTile';
import WikiDetailPanel from './WikiDetailPanel';
import LibraryPagination from './LibraryPagination';
import {
    DEFAULT_FILTERS,
    Filters,
    SortKey,
    buildLibraryQuery,
    toggleArrayValue,
} from './filters';

const PAGE_SIZE = 40;

type FacetDim = 'rarity' | 'class' | 'type' | 'category';

export default function LibraryView() {
    const state = useContext(AppState);
    const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
    const [page, setPage] = useState(0);
    const [data, setData] = useState<PagedLibrary | null>(null);
    const [stats, setStats] = useState<LibraryStats | null>(null);
    const [selected, setSelected] = useState<LibraryEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sectionRef = useRef<HTMLDivElement>(null);

    // Stats: one-shot on mount.
    useEffect(() => {
        const ctrl = new AbortController();
        fetch(`${AppConfig.API_URL}/card/library/stats`, {signal: ctrl.signal})
            .then((r) => r.ok ? r.json() : Promise.reject(new Error(`stats ${r.status}`)))
            .then((s: LibraryStats) => setStats(s))
            .catch((e) => {
                if (e.name !== 'AbortError') console.error('[library] stats failed', e);
            });
        return () => ctrl.abort();
    }, []);

    // Reset page whenever any filter or the search query changes.
    useEffect(() => {
        setPage(0);
    }, [filters, state.searchText.value]);

    // Entries: refetch when filters / page / search change.
    useEffect(() => {
        const ctrl = new AbortController();
        setLoading(true);
        setError(null);
        const qs = buildLibraryQuery(filters, state.searchText.value, page, PAGE_SIZE);
        fetch(`${AppConfig.API_URL}/card/library?${qs}`, {signal: ctrl.signal})
            .then((r) => r.ok ? r.json() : Promise.reject(new Error(`library ${r.status}`)))
            .then((d: PagedLibrary) => {
                setData(d);
                setLoading(false);
                // Auto-select the first entry on the page if nothing is selected,
                // or if the current selection isn't in the new page.
                setSelected((curr) => {
                    if (!d.entries.length) return null;
                    if (curr && d.entries.some((e) => e.name === curr.name)) return curr;
                    return d.entries[0];
                });
            })
            .catch((e) => {
                if (e.name === 'AbortError') return;
                console.error('[library] entries failed', e);
                setError(e.message ?? 'Failed to load library');
                setLoading(false);
            });
        return () => ctrl.abort();
    }, [filters, page, state.searchText.value]);

    const toggleFacet = (dim: FacetDim, value: string) => {
        setFilters((f) => ({...f, [dim]: toggleArrayValue(f[dim], value)}));
    };

    const setCostRange = (lo: number, hi: number) => {
        setFilters((f) => ({...f, costMin: lo, costMax: hi}));
    };

    const setLetter = (letter: string | null) => {
        setFilters((f) => ({...f, letter}));
        // Scroll the section header into view after the next render.
        setTimeout(() => sectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'}), 50);
    };

    const setSort = (sort: SortKey) => setFilters((f) => ({...f, sort}));

    const resetAll = () => setFilters(DEFAULT_FILTERS);

    const clearFiltersButKeepLetter = () => setFilters((f) => ({...DEFAULT_FILTERS, letter: f.letter}));

    const facetCounts: LibraryFacetCounts | null = data?.facetCounts ?? null;
    const entries = data?.entries ?? [];

    const headerHint = useMemo(() => {
        if (!filters.letter) return null;
        const count = data?.total ?? 0;
        const first = entries[0]?.name;
        const last = entries[entries.length - 1]?.name;
        return {
            letter: filters.letter,
            count,
            range: first && last ? `${first}${first === last ? '' : ` through ${last}`}` : '',
        };
    }, [filters.letter, data?.total, entries]);

    return (
        <div style={{background: C.cream, color: C.ink, fontFamily: C.serif, minHeight: '100vh'}}>
            {/* slim painted strip */}
            <div style={{position: 'relative', height: 110, overflow: 'hidden'}}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${townImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 30%',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to bottom, rgba(168,200,218,0) 0%, ${C.cream}99 70%, ${C.cream} 100%)`,
                }} />
                <div style={{
                    position: 'absolute', top: 14, left: 28,
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: C.serif, fontStyle: 'italic', fontSize: 13,
                    color: C.creamHi, textShadow: '0 1px 2px rgba(0,0,0,.6)',
                }}>
                    <span style={{opacity: 0.85}}>Guild Hall</span>
                    <span style={{opacity: 0.6}}>›</span>
                    <span>The Great Library</span>
                </div>
                <div style={{
                    position: 'absolute', top: 40, left: 28,
                    display: 'flex', alignItems: 'flex-end', gap: 14,
                }}>
                    <Banner color={C.teal} dark={C.tealDeep}>The Great Library</Banner>
                    <span style={{
                        fontFamily: C.serif, fontStyle: 'italic', fontSize: 14,
                        color: C.ink, opacity: 0.7, paddingBottom: 10,
                    }}>every card, every tier, scribed and indexed</span>
                </div>
                <div style={{position: 'absolute', right: 28, top: 30}}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: C.creamHi,
                        border: `1.5px solid ${C.ink}`,
                        borderRadius: 3,
                        padding: '8px 12px',
                        boxShadow: `0 2px 0 ${C.ink}`,
                        width: 280,
                    }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={C.inkDim} strokeWidth="1.8">
                            <circle cx="6" cy="6" r="4.5" />
                            <path d="M9 9 L13 13" />
                        </svg>
                        <input
                            placeholder="Seek a card by name…"
                            value={state.searchText.value}
                            onInput={(e) => { state.searchText.value = (e.currentTarget as HTMLInputElement).value; }}
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                fontFamily: C.serif, fontStyle: 'italic', fontSize: 13, color: C.ink,
                                minWidth: 0, padding: 0,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div style={{padding: '0 28px 28px', maxWidth: 1320, margin: '0 auto'}}>
                <LibraryStatPlaques stats={stats} />

                <div style={{marginBottom: 14}}>
                    <AlphaJump
                        counts={data?.letterCounts ?? {}}
                        active={filters.letter}
                        onPick={setLetter}
                    />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '260px 1fr 340px', gap: 16, alignItems: 'flex-start'}}>
                    <LibraryFacets
                        filters={filters}
                        facetCounts={facetCounts}
                        stats={stats}
                        onToggle={toggleFacet}
                        onCostRange={setCostRange}
                        onReset={resetAll}
                    />

                    <div>
                        <LibrarySortBar
                            filters={filters}
                            total={data?.total ?? 0}
                            grandTotal={stats?.total ?? data?.total ?? 0}
                            onRemoveFacet={toggleFacet}
                            onSortChange={setSort}
                            onClear={clearFiltersButKeepLetter}
                        />

                        {/* Section header (letter group) */}
                        <div ref={sectionRef} style={{display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10}}>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 48, height: 48,
                                background: C.amber, border: `1.5px solid ${C.ink}`,
                                borderRadius: 4, boxShadow: `0 2px 0 ${C.ink}`,
                                fontFamily: C.display, fontSize: 28, fontWeight: 700,
                                color: C.creamHi, textShadow: '0 1px 0 rgba(0,0,0,.4)',
                            }}>{filters.letter ?? '✦'}</div>
                            <div style={{flex: 1}}>
                                <div style={{
                                    fontFamily: C.display, fontSize: 18, fontWeight: 700,
                                    color: C.ink, letterSpacing: '0.01em',
                                }}>
                                    {filters.letter
                                        ? `Cards beginning with ${filters.letter}`
                                        : state.searchText.value
                                            ? `Search results for “${state.searchText.value}”`
                                            : 'All catalogued cards'}
                                </div>
                                <div style={{
                                    fontFamily: C.serif, fontStyle: 'italic', fontSize: 13,
                                    color: C.inkDim, marginTop: 1,
                                }}>
                                    {headerHint?.range || `${data?.total ?? 0} entries`}
                                </div>
                            </div>
                            <div style={{fontFamily: C.mono, fontSize: 11, color: C.inkDim, paddingBottom: 4}}>
                                {data ? `Page ${data.page + 1} of ${Math.max(1, data.pages)}` : ''}
                            </div>
                        </div>
                        <div style={{borderBottom: `1.5px solid ${C.ink}`, marginBottom: 14}} />

                        {/* Card grid */}
                        {loading && !data ? (
                            <div style={{
                                padding: 36, textAlign: 'center',
                                fontFamily: C.serif, fontStyle: 'italic', color: C.inkDim,
                            }}>Loading the library…</div>
                        ) : error ? (
                            <div style={{
                                padding: 36, textAlign: 'center',
                                fontFamily: C.serif, fontStyle: 'italic', color: C.red,
                            }}>{error}</div>
                        ) : entries.length === 0 ? (
                            <div style={{
                                padding: 36, textAlign: 'center',
                                fontFamily: C.serif, fontStyle: 'italic', color: C.inkDim,
                            }}>No cards match these filters.</div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                gap: 10,
                                marginBottom: 18,
                                opacity: loading ? 0.6 : 1,
                                transition: 'opacity 120ms',
                            }}>
                                {entries.map((entry) => (
                                    <WikiCardTile
                                        key={entry.name}
                                        entry={entry}
                                        selected={selected?.name === entry.name}
                                        onClick={() => setSelected(entry)}
                                    />
                                ))}
                            </div>
                        )}

                        <LibraryPagination
                            page={data?.page ?? 0}
                            pages={data?.pages ?? 0}
                            onChange={setPage}
                        />
                    </div>

                    <WikiDetailPanel entry={selected} />
                </div>
            </div>
        </div>
    );
}
