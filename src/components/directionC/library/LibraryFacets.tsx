import {ComponentChildren} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import {InkPanel} from '../primitives';
import {C} from '../tokens';
import {LibraryFacetCounts, LibraryStats} from '../../../types/types';
import {RARITY, RARITY_ORDER, formatType} from './rarity';
import {Filters, COST_MIN, COST_MAX} from './filters';

const HERO_CLASSES = ['Warrior', 'Mage', 'Healer', 'Scout', 'MagicKnight'];

const CATEGORY_LABELS: Array<[string, string]> = [
    ['hero', 'Heroes'],
    ['monster', 'Monsters'],
    ['item', 'Items'],
    ['boon', 'Boons'],
    ['injury', 'Injuries'],
    ['special', 'Special'],
];

function FacetSection({title, count, children}: {title: string; count?: number; children: ComponentChildren}) {
    return (
        <div style={{borderTop: `1px dashed ${C.inkMute}`, padding: '12px 14px'}}>
            <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8}}>
                <div style={{
                    fontFamily: C.display, fontSize: 11, color: C.ink,
                    letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                }}>{title}</div>
                {count != null && (
                    <div style={{fontFamily: C.mono, fontSize: 10, color: C.inkMute}}>{count}</div>
                )}
            </div>
            {children}
        </div>
    );
}

function FacetRow({
    label, count, swatch, checked, onClick,
}: {
    label: ComponentChildren;
    count?: number;
    swatch?: string;
    checked: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            style={{display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0', cursor: 'pointer', userSelect: 'none'}}
        >
            <div style={{
                width: 14, height: 14, borderRadius: 2,
                background: checked ? C.amber : C.cream,
                border: `1.5px solid ${C.ink}`,
                boxShadow: checked ? `inset 0 0 0 2px ${C.creamHi}` : 'none',
                flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {checked && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 4 L3 6 L7 1" />
                    </svg>
                )}
            </div>
            {swatch && (
                <div style={{
                    width: 10, height: 10, background: swatch,
                    border: `1.2px solid ${C.ink}`, flexShrink: 0,
                }} />
            )}
            <div style={{
                flex: 1,
                fontFamily: C.serif, fontSize: 13,
                color: checked ? C.ink : C.inkSoft,
                fontWeight: checked ? 700 : 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{label}</div>
            {count != null && (
                <div style={{fontFamily: C.mono, fontSize: 10, color: C.inkDim}}>{count}</div>
            )}
        </div>
    );
}

function RangeSlider({
    lo, hi, onChange,
}: {
    lo: number;
    hi: number;
    onChange: (lo: number, hi: number) => void;
}) {
    const trackRef = useRef<HTMLDivElement>(null);
    const total = COST_MAX - COST_MIN;
    const loPct = ((lo - COST_MIN) / total) * 100;
    const hiPct = ((hi - COST_MIN) / total) * 100;

    const startDrag = (which: 'lo' | 'hi') => (e: MouseEvent) => {
        e.preventDefault();
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();

        const move = (ev: MouseEvent) => {
            const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
            const v = Math.round(COST_MIN + ratio * total);
            if (which === 'lo') onChange(Math.min(v, hi), hi);
            else onChange(lo, Math.max(v, lo));
        };
        const up = () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
    };

    return (
        <div>
            <div ref={trackRef} style={{position: 'relative', height: 22}}>
                <div style={{
                    position: 'absolute', top: 9, left: 0, right: 0, height: 4,
                    background: C.cream, border: `1.2px solid ${C.ink}`, borderRadius: 2,
                }} />
                <div style={{
                    position: 'absolute', top: 9,
                    left: `${loPct}%`, width: `${Math.max(0, hiPct - loPct)}%`,
                    height: 4, background: C.amber, borderRadius: 2,
                }} />
                {[
                    {pct: loPct, drag: startDrag('lo')},
                    {pct: hiPct, drag: startDrag('hi')},
                ].map(({pct, drag}, i) => (
                    <div
                        key={i}
                        onMouseDown={drag}
                        style={{
                            position: 'absolute', top: 4,
                            left: `calc(${pct}% - 7px)`,
                            width: 14, height: 14, borderRadius: '50%',
                            background: `radial-gradient(circle at 35% 30%, #ffcd82 0%, ${C.amber} 60%, ${C.amberDeep} 105%)`,
                            border: `1.5px solid ${C.ink}`,
                            boxShadow: 'inset 0 -2px 2px rgba(0,0,0,.35)',
                            cursor: 'grab',
                        }}
                    />
                ))}
            </div>
            <div style={{
                display: 'flex', justifyContent: 'space-between', marginTop: 2,
                fontFamily: C.mono, fontSize: 10, color: C.inkDim,
            }}>
                <span>{lo} ⚡</span>
                <span>{lo === COST_MIN && hi === COST_MAX ? 'any' : `${lo}–${hi}`}</span>
                <span>{hi}{hi === COST_MAX ? '+' : ''} ⚡</span>
            </div>
        </div>
    );
}

export default function LibraryFacets({
    filters,
    facetCounts,
    stats,
    onToggle,
    onCostRange,
    onReset,
}: {
    filters: Filters;
    facetCounts: LibraryFacetCounts | null;
    stats: LibraryStats | null;
    onToggle: (dim: 'rarity' | 'class' | 'type' | 'category', value: string) => void;
    onCostRange: (lo: number, hi: number) => void;
    onReset: () => void;
}) {
    // Debounce the cost-range slider so we don't refetch on every mousemove.
    const [localCost, setLocalCost] = useState<[number, number]>([filters.costMin, filters.costMax]);
    useEffect(() => {
        setLocalCost([filters.costMin, filters.costMax]);
    }, [filters.costMin, filters.costMax]);
    useEffect(() => {
        const [lo, hi] = localCost;
        if (lo === filters.costMin && hi === filters.costMax) return;
        const t = setTimeout(() => onCostRange(lo, hi), 150);
        return () => clearTimeout(t);
    }, [localCost]);

    // Class facet — for category=hero-only, show only hero classes; otherwise full knownClasses list.
    const onlyHero = filters.category.length === 1 && filters.category[0] === 'hero';
    const classList = onlyHero
        ? HERO_CLASSES
        : (stats?.knownClasses ?? HERO_CLASSES);

    return (
        <InkPanel padding={0} tone={C.creamHi}>
            <div style={{
                padding: '12px 14px', background: C.parchment, borderBottom: `1.5px solid ${C.ink}`,
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
            }}>
                <div style={{
                    fontFamily: C.display, fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: C.ink,
                }}>Filters</div>
                <div
                    onClick={onReset}
                    style={{
                        fontFamily: C.serif, fontStyle: 'italic', fontSize: 11,
                        color: C.amberDeep, fontWeight: 600, cursor: 'pointer',
                    }}
                >Reset all</div>
            </div>

            <FacetSection title="Rarity">
                {RARITY_ORDER.map((r) => (
                    <FacetRow
                        key={r}
                        label={RARITY[r].label}
                        swatch={RARITY[r].color}
                        count={facetCounts?.rarity?.[r]}
                        checked={filters.rarity.includes(r)}
                        onClick={() => onToggle('rarity', r)}
                    />
                ))}
            </FacetSection>

            <FacetSection title="Energy Cost">
                <RangeSlider
                    lo={localCost[0]}
                    hi={localCost[1]}
                    onChange={(lo, hi) => setLocalCost([lo, hi])}
                />
            </FacetSection>

            <FacetSection title="Category">
                {CATEGORY_LABELS.map(([key, label]) => (
                    <FacetRow
                        key={key}
                        label={label}
                        count={facetCounts?.category?.[key]}
                        checked={filters.category.includes(key)}
                        onClick={() => onToggle('category', key)}
                    />
                ))}
            </FacetSection>

            <FacetSection title="Class">
                {classList.map((cls) => (
                    <FacetRow
                        key={cls}
                        label={cls}
                        count={facetCounts?.class?.[cls]}
                        checked={filters.class.includes(cls)}
                        onClick={() => onToggle('class', cls)}
                    />
                ))}
            </FacetSection>

            <FacetSection title="Type">
                {(stats?.knownTypes ?? []).map((t) => (
                    <FacetRow
                        key={t}
                        label={formatType(t)}
                        count={facetCounts?.type?.[t]}
                        checked={filters.type.includes(t)}
                        onClick={() => onToggle('type', t)}
                    />
                ))}
            </FacetSection>
        </InkPanel>
    );
}
