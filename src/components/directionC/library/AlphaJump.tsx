import {C} from '../tokens';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function AlphaJump({
    counts,
    active,
    onPick,
}: {
    counts: Record<string, number>;
    active: string | null;
    onPick: (letter: string | null) => void;
}) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: C.creamHi,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 3,
            padding: 3,
            boxShadow: `0 2px 0 ${C.ink}`,
            overflow: 'hidden',
        }}>
            {LETTERS.map((letter) => {
                const count = counts[letter] ?? 0;
                const a = letter === active;
                const empty = count === 0;
                return (
                    <div
                        key={letter}
                        onClick={empty ? undefined : () => onPick(a ? null : letter)}
                        style={{
                            flex: 1,
                            padding: '6px 2px 4px',
                            fontFamily: C.display,
                            fontSize: 12,
                            fontWeight: 700,
                            color: a ? C.creamHi : empty ? C.inkMute : C.ink,
                            background: a ? C.amber : 'transparent',
                            border: a ? `1px solid ${C.ink}` : '1px solid transparent',
                            borderRadius: 2,
                            textAlign: 'center',
                            cursor: empty ? 'default' : 'pointer',
                            opacity: empty ? 0.4 : 1,
                            position: 'relative',
                            userSelect: 'none',
                        }}
                    >
                        {letter}
                        <div style={{
                            fontFamily: C.mono,
                            fontSize: 8,
                            fontWeight: 500,
                            color: a ? 'rgba(245,234,208,.8)' : C.inkDim,
                            marginTop: -1,
                        }}>{count}</div>
                    </div>
                );
            })}
        </div>
    );
}
