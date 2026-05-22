import {C} from './tokens';

export type MiniBar = {v: number; color: string};

// Vertical bar chart with painted-ink axes, parchment background, and
// stained-glass-colored bars with a diagonal hatch. Drop into an InkPanel.
export default function MiniChart({
    data,
    axisLabels,
    height = 130,
    max,
    label,
}: {
    data: MiniBar[];
    axisLabels: string[];
    height?: number;
    max?: number;
    label?: string;
}) {
    const m = max || Math.max(1, ...data.map((d) => d.v));
    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 10,
                height,
                padding: '0 6px',
                borderLeft: `1.5px solid ${C.ink}`,
                borderBottom: `1.5px solid ${C.ink}`,
                position: 'relative',
            }}>
                {[0.25, 0.5, 0.75, 1].map((g) => (
                    <div key={g} style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: `${g * 100}%`,
                        height: 1,
                        background: C.inkMute,
                        opacity: 0.18,
                    }} />
                ))}
                {data.map((d, i) => (
                    <div key={i} style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        height: '100%',
                        justifyContent: 'flex-end',
                    }}>
                        {d.v > 0 && (
                            <div style={{
                                fontFamily: C.mono,
                                fontSize: 10,
                                color: C.ink,
                                fontWeight: 700,
                                marginBottom: 3,
                            }}>{d.v}</div>
                        )}
                        <div style={{
                            width: '100%',
                            height: `${(d.v / m) * 100}%`,
                            background: d.color,
                            border: d.v > 0 ? `1.5px solid ${C.ink}` : 'none',
                            boxShadow: d.v > 0
                                ? 'inset 0 -3px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.18)'
                                : 'none',
                            position: 'relative',
                        }}>
                            {d.v > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'repeating-linear-gradient(45deg, transparent 0 4px, rgba(0,0,0,.08) 4px 5px)',
                                }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{display: 'flex', gap: 10, padding: '6px 6px 0'}}>
                {axisLabels.map((l, i) => (
                    <div key={i} style={{
                        flex: 1,
                        textAlign: 'center',
                        fontFamily: C.mono,
                        fontSize: 10,
                        color: C.inkDim,
                        fontWeight: 600,
                    }}>{l}</div>
                ))}
            </div>
            {label && (
                <div style={{
                    marginTop: 6,
                    textAlign: 'center',
                    fontFamily: C.serif,
                    fontStyle: 'italic',
                    fontSize: 11,
                    color: C.inkDim,
                }}>{label}</div>
            )}
        </div>
    );
}
