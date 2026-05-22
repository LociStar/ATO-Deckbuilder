import {DropdownC} from '../primitives';
import {C} from '../tokens';
import {Filters, SortKey, hasAnyFilter} from './filters';
import {formatType} from './rarity';

const SORT_OPTIONS: Array<{value: SortKey; label: string}> = [
    {value: 'name_asc',  label: 'A → Z'},
    {value: 'name_desc', label: 'Z → A'},
    {value: 'cost_asc',  label: 'Cost ↑'},
    {value: 'cost_desc', label: 'Cost ↓'},
];

function ActiveChip({label, color, onRemove}: {label: string; color: string; onRemove: () => void}) {
    return (
        <span
            onClick={onRemove}
            title="Click to remove"
            style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '3px 8px',
                fontFamily: C.serif, fontSize: 11, fontWeight: 600,
                color: C.creamHi, background: color,
                border: `1.2px solid ${C.ink}`,
                borderRadius: 2,
                cursor: 'pointer',
                userSelect: 'none',
                whiteSpace: 'nowrap',
            }}
        >
            <span>{label}</span>
            <span style={{opacity: 0.85, fontWeight: 700}}>×</span>
        </span>
    );
}

export default function LibrarySortBar({
    filters,
    total,
    grandTotal,
    onRemoveFacet,
    onSortChange,
    onClear,
}: {
    filters: Filters;
    total: number;
    grandTotal: number;
    onRemoveFacet: (dim: 'rarity' | 'class' | 'type' | 'category', value: string) => void;
    onSortChange: (s: SortKey) => void;
    onClear: () => void;
}) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8,
            padding: '10px 14px',
            background: C.parchment,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 3,
            boxShadow: `0 2px 0 ${C.ink}`,
            marginBottom: 14,
        }}>
            <span style={{
                fontFamily: C.display, fontSize: 10, color: C.inkDim,
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
            }}>Showing</span>
            <span style={{fontFamily: C.display, fontSize: 14, color: C.ink, fontWeight: 700}}>{total.toLocaleString()}</span>
            <span style={{fontFamily: C.serif, fontStyle: 'italic', fontSize: 12, color: C.inkDim}}>
                of {grandTotal.toLocaleString()} cards{filters.letter ? ` · "${filters.letter}"` : ''}
            </span>

            <div style={{flex: 1}} />

            {filters.rarity.map((v) => (
                <ActiveChip key={`r-${v}`} label={v} color={C.amber} onRemove={() => onRemoveFacet('rarity', v)} />
            ))}
            {filters.category.map((v) => (
                <ActiveChip key={`g-${v}`} label={v} color={C.teal} onRemove={() => onRemoveFacet('category', v)} />
            ))}
            {filters.class.map((v) => (
                <ActiveChip key={`c-${v}`} label={v} color={C.green} onRemove={() => onRemoveFacet('class', v)} />
            ))}
            {filters.type.map((v) => (
                <ActiveChip key={`t-${v}`} label={formatType(v)} color={C.purple} onRemove={() => onRemoveFacet('type', v)} />
            ))}

            {hasAnyFilter(filters) && (
                <span
                    onClick={onClear}
                    style={{
                        fontFamily: C.serif, fontSize: 11, fontStyle: 'italic',
                        color: C.amberDeep, fontWeight: 600, cursor: 'pointer', marginLeft: 4,
                    }}
                >clear filters</span>
            )}

            <div style={{width: 1, height: 18, background: C.inkMute, opacity: 0.4, margin: '0 6px'}} />

            <span style={{
                fontFamily: C.display, fontSize: 10, color: C.inkDim,
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
            }}>Sort</span>
            <DropdownC
                label="By"
                value={filters.sort}
                options={SORT_OPTIONS}
                onChange={(v) => onSortChange(v as SortKey)}
                width={120}
                surface={C.parchment}
            />

            {/* GRID / LIST toggle (LIST disabled in v1) */}
            <div style={{
                display: 'flex', border: `1.5px solid ${C.ink}`, borderRadius: 2,
                overflow: 'hidden', boxShadow: `0 1.5px 0 ${C.ink}`,
            }}>
                <div style={{
                    padding: '5px 10px', background: C.amber, color: C.creamHi,
                    fontFamily: C.display, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                    cursor: 'default',
                }}>▦ GRID</div>
                <div title="List view coming soon" style={{
                    padding: '5px 10px', background: C.cream, color: C.inkMute,
                    borderLeft: `1.5px solid ${C.ink}`,
                    fontFamily: C.display, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
                    cursor: 'not-allowed', opacity: 0.6,
                }}>≡ LIST</div>
            </div>
        </div>
    );
}
