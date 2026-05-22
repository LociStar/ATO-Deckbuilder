import {useState, useMemo, useEffect, useRef} from 'preact/hooks';
import {Character} from '../../types/types';
import {C} from './tokens';
import {StainedFrame, ChipC} from './primitives';

// Open character picker — a parchment-styled panel listing all characters
// in a 3-col grid with stained-glass-framed avatars. Top row filters by
// primary class. Wired to the existing `chars` state in the builder.
export default function CharacterDropdown({
    chars,
    selected,
    onSelect,
    onClose,
}: {
    chars: Character[];
    selected: string;
    onSelect: (characterId: string) => void;
    onClose?: () => void;
}) {
    const [filter, setFilter] = useState<string>('Any');

    const classes = useMemo(() => {
        const set = new Set<string>();
        for (const c of chars) {
            if (c.characterClass) set.add(c.characterClass);
        }
        return ['Any', ...Array.from(set).sort()];
    }, [chars]);

    const visible = useMemo(
        () => filter === 'Any'
            ? chars
            : chars.filter((c) => c.characterClass === filter),
        [chars, filter],
    );

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!onClose) return;
        function handle(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) onClose?.();
        }
        document.addEventListener('mousedown', handle);
        return () => document.removeEventListener('mousedown', handle);
    }, [onClose]);

    return (
        <div ref={ref} style={{
            position: 'absolute',
            top: '40%',
            left: -70,
            right: 0,
            marginTop: 0,
            background: C.creamHi,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 3,
            boxShadow: `0 4px 0 ${C.ink}, 0 8px 24px rgba(31,20,8,.35)`,
            zIndex: 30,
            maxHeight: 460,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <div style={{
                padding: '8px 10px',
                background: C.parchment,
                borderBottom: `1.5px solid ${C.ink}`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
            }}>
                <span style={{
                    fontFamily: C.display,
                    fontSize: 10,
                    color: C.inkDim,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                }}>Filter</span>
                {classes.map((cls) => (
                    <ChipC
                        key={cls}
                        label={cls}
                        active={filter === cls}
                        color={C.amber}
                        onClick={() => setFilter(cls)}
                    />
                ))}
                <div style={{flex: 1}} />
                <span style={{fontFamily: C.mono, fontSize: 10, color: C.inkDim}}>
                    {visible.length} of {chars.length}
                </span>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                overflowY: 'auto',
                flex: 1,
            }}>
                {visible.map((char) => {
                    const isSelected = char.characterId === selected;
                    return (
                        <div
                            key={char.characterId}
                            onClick={() => onSelect(char.characterId)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 9,
                                padding: '7px 12px',
                                background: isSelected ? `${C.amber}22` : 'transparent',
                                borderRight: `1px dashed ${C.inkMute}55`,
                                borderBottom: `1px dashed ${C.inkMute}55`,
                                cursor: 'pointer',
                                position: 'relative',
                            }}>
                            <StainedFrame characterId={char.characterId} size={32} rounded={3} />
                            <div style={{flex: 1, minWidth: 0}}>
                                <div style={{
                                    fontFamily: C.display,
                                    fontSize: 13,
                                    color: C.ink,
                                    fontWeight: isSelected ? 700 : 600,
                                    letterSpacing: '0.01em',
                                }}>{char.characterId}</div>
                                <div style={{
                                    fontFamily: C.serif,
                                    fontStyle: 'italic',
                                    fontSize: 10,
                                    color: C.inkDim,
                                    lineHeight: 1,
                                }}>{char.characterClass}</div>
                            </div>
                            {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={C.amberDeep} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 6 L5 9 L10 3" />
                                </svg>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
