import {ComponentChildren, JSX} from 'preact';
import {FormControl, Select, SelectChangeEvent} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import {C} from './tokens';
import {AppConfig} from '../../config';

// Cream parchment surface with a painted dark-ink border. The page's
// UI "comic-ink" feel.
export function InkPanel({
    children,
    padding = 16,
    style = {},
    tone = C.cream,
}: {
    children?: ComponentChildren;
    padding?: number | string;
    style?: JSX.CSSProperties;
    tone?: string;
}) {
    return (
        <div style={{
            background: tone,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 4,
            boxShadow: `0 2px 0 ${C.ink}, 0 4px 12px rgba(31,20,8,.18)`,
            padding,
            ...style,
        }}>{children}</div>
    );
}

// Banner with V-cut bottom — like the green banners hanging on the
// church tower in the painting. Used for section labels.
export function Banner({
    children,
    color = C.green,
    dark = C.greenDeep,
}: {
    children?: ComponentChildren;
    color?: string;
    dark?: string;
}) {
    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            background: color,
            color: C.creamHi,
            padding: '7px 18px 14px',
            fontFamily: C.display,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)',
            boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.18)',
            filter: `drop-shadow(0 2px 0 ${dark}) drop-shadow(0 3px 4px rgba(0,0,0,.25))`,
        }}>{children}</div>
    );
}

// Small wax-seal style icon — used for the logo & rank markers.
export function WaxSeal({
    size = 28,
    label = '⚜',
    color = C.red,
}: {
    size?: number;
    label?: ComponentChildren;
    color?: string;
}) {
    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 35% 30%, ${color} 0%, ${C.woodDark} 110%)`,
            color: C.creamHi,
            fontFamily: C.display,
            fontWeight: 700,
            fontSize: size * 0.55,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1.5px solid ${C.ink}`,
            boxShadow: `inset 0 -2px 0 rgba(0,0,0,.35), 0 1px 0 ${C.ink}`,
            textShadow: '0 1px 0 rgba(0,0,0,.4)',
            flexShrink: 0,
        }}>{label}</div>
    );
}

// Parchment chip — used in filter rows and inline switches.
export function ChipC({
    label,
    active,
    color = C.amber,
    onClick,
}: {
    label: ComponentChildren;
    active?: boolean;
    color?: string;
    onClick?: (e: MouseEvent) => void;
}) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: '5px 11px',
                borderRadius: 3,
                fontSize: 12,
                fontFamily: C.serif,
                fontWeight: 600,
                background: active ? color : C.cream,
                color: active ? C.creamHi : C.inkSoft,
                border: `1.5px solid ${active ? C.ink : C.inkMute}`,
                boxShadow: active ? `0 1.5px 0 ${C.ink}` : 'none',
                cursor: onClick ? 'pointer' : 'default',
                letterSpacing: '0.02em',
                userSelect: 'none',
                whiteSpace: 'nowrap',
            }}
        >{label}</div>
    );
}

// Stat tile — cream surface with a small caps label and a big number.
export function Plaque({
    label,
    value,
    sub,
    color = C.ink,
}: {
    label: ComponentChildren;
    value: ComponentChildren;
    sub?: ComponentChildren;
    color?: string;
}) {
    return (
        <div style={{
            flex: 1,
            minWidth: 0,
            position: 'relative',
            background: C.creamHi,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 3,
            boxShadow: `0 2px 0 ${C.ink}`,
            padding: '10px 14px',
        }}>
            <div style={{
                fontFamily: C.display,
                fontSize: 9.5,
                color: C.inkDim,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 600,
            }}>{label}</div>
            <div style={{
                fontFamily: C.display,
                fontSize: 24,
                fontWeight: 700,
                color,
                marginTop: 2,
                lineHeight: 1.1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>{value}</div>
            {sub && (
                <div style={{
                    fontFamily: C.serif,
                    fontStyle: 'italic',
                    fontSize: 11,
                    color: C.inkDim,
                    marginTop: 1,
                }}>{sub}</div>
            )}
        </div>
    );
}

// Parchment cartouche scroll — title plate. Has a slightly torn / ink-edged feel.
export function Cartouche({
    eyebrow,
    title,
    sub,
}: {
    eyebrow?: ComponentChildren;
    title: ComponentChildren;
    sub?: ComponentChildren;
}) {
    return (
        <div style={{
            position: 'relative',
            display: 'inline-block',
            padding: '18px 44px 20px',
            minWidth: 480,
            maxWidth: '90vw',
        }}>
            <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none" style={{
                position: 'absolute',
                inset: 0,
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,.35))',
            }}>
                <path
                    d="M14 8 L586 6 L596 22 L592 142 L584 154 L20 152 L4 138 L8 22 Z"
                    fill={C.creamHi}
                    stroke={C.ink}
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M22 18 L578 16 L584 28 L580 134 L574 144 L26 142 L16 130 L20 28 Z"
                    fill="none"
                    stroke={C.amberDeep}
                    strokeWidth="0.8"
                    opacity="0.6"
                />
            </svg>
            <CornerFlourish x={14} y={14} />
            <CornerFlourish x="right" y={14} flip />
            <CornerFlourish x={14} y="bottom" flipY />
            <CornerFlourish x="right" y="bottom" flip flipY />
            <div style={{position: 'relative'}}>
                {eyebrow && (
                    <div style={{
                        fontFamily: C.display,
                        fontSize: 11,
                        color: C.amberDeep,
                        letterSpacing: '0.34em',
                        marginBottom: 6,
                        fontWeight: 600,
                    }}>{eyebrow}</div>
                )}
                <h1 style={{
                    margin: 0,
                    fontFamily: C.display,
                    fontSize: 36,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: '0.01em',
                    lineHeight: 1.05,
                }}>{title}</h1>
                {sub && (
                    <div style={{
                        fontFamily: C.serif,
                        fontStyle: 'italic',
                        fontSize: 15,
                        color: C.inkSoft,
                        marginTop: 8,
                    }}>{sub}</div>
                )}
            </div>
        </div>
    );
}

// Parchment-styled dropdown — floating ALL-CAPS label tucked into the
// top-left border of a cream box. Wraps an MUI Select so existing change
// handlers continue to work.
export function DropdownC<T extends string | number>({
    label,
    value,
    options,
    onChange,
    width = 168,
    surface = C.parchment,
}: {
    label: ComponentChildren;
    value: T;
    options: Array<{value: T; label: ComponentChildren}>;
    onChange: (v: T) => void;
    width?: number | string;
    surface?: string;
}) {
    return (
        <div style={{position: 'relative', width, flexShrink: 0}}>
            <span style={{
                position: 'absolute',
                top: -7,
                left: 9,
                background: surface,
                padding: '0 6px',
                fontFamily: C.display,
                fontSize: 9,
                color: C.inkDim,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
                lineHeight: 1,
                pointerEvents: 'none',
                zIndex: 1,
            }}>{label}</span>
            <FormControl fullWidth size="small">
                <Select
                    value={value as any}
                    onChange={(e: SelectChangeEvent<unknown>) => {
                        // MUI Select preserves the original primitive value of the
                        // selected MenuItem, so it's safe to assert the type T here.
                        const v = (e.target as {value: unknown}).value;
                        onChange(v as T);
                    }}
                    variant="outlined"
                    sx={{
                        background: C.creamHi,
                        borderRadius: '3px',
                        boxShadow: `0 2px 0 ${C.ink}`,
                        fontFamily: C.serif,
                        fontSize: '13.5px',
                        fontWeight: 600,
                        color: C.ink,
                        letterSpacing: '0.01em',
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: `1.5px solid ${C.ink}`,
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            border: `1.5px solid ${C.ink}`,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            border: `1.5px solid ${C.ink}`,
                        },
                        '& .MuiSelect-select': {
                            padding: '9px 28px 7px 11px',
                            color: C.ink,
                        },
                        '& .MuiSelect-icon': {
                            color: C.ink,
                            right: 7,
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                background: C.creamHi,
                                border: `1.5px solid ${C.ink}`,
                                borderRadius: '3px',
                                boxShadow: `0 2px 0 ${C.ink}, 0 4px 12px rgba(31,20,8,.2)`,
                                marginTop: '4px',
                                '& .MuiMenuItem-root': {
                                    fontFamily: C.serif,
                                    fontSize: '13px',
                                    color: C.ink,
                                },
                                '& .MuiMenuItem-root.Mui-selected': {
                                    background: `${C.parchment} !important`,
                                },
                                '& .MuiMenuItem-root:hover': {
                                    background: C.cream,
                                },
                            },
                        },
                    }}
                >
                    {options.map((o) => (
                        <MenuItem key={String(o.value)} value={o.value as any}>{o.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

// Character portrait inside a leaded-stained-glass frame. Uses the real
// backend character sprite, then overlays the same diagonal/lead lines
// from the design so it picks up the painted-window feel.
export function StainedFrame({
    characterId,
    size = 88,
    rounded = 6,
    accent = C.amberDeep,
}: {
    characterId: string;
    size?: number;
    rounded?: number;
    accent?: string;
}) {
    return (
        <div style={{
            position: 'relative',
            width: size,
            height: size,
            flexShrink: 0,
            borderRadius: rounded,
            overflow: 'hidden',
            border: `2px solid ${C.ink}`,
            boxShadow: `inset 0 0 0 2px ${accent}, 0 2px 0 ${C.ink}`,
            background: C.cream,
        }}>
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 64 64"
                preserveAspectRatio="none"
                style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}
            >
                <path
                    d="M0 32 L64 32 M32 0 L32 64 M0 0 L64 64 M64 0 L0 64"
                    stroke="rgba(20,10,4,.45)"
                    strokeWidth="1.1"
                    fill="none"
                />
                <circle
                    cx="32"
                    cy="32"
                    r="14"
                    stroke="rgba(20,10,4,.55)"
                    strokeWidth="1.2"
                    fill="none"
                />
            </svg>
            <img
                src={AppConfig.API_URL + `/character/image/${characterId}`}
                alt={`Character ${characterId}`}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                }}
            />
        </div>
    );
}

function CornerFlourish({
    x,
    y,
    flip,
    flipY,
}: {
    x: number | 'right';
    y: number | 'bottom';
    flip?: boolean;
    flipY?: boolean;
}) {
    const style: JSX.CSSProperties = {
        position: 'absolute',
        width: 26,
        height: 26,
        color: C.amberDeep,
    };
    if (x === 'right') style.right = 14; else style.left = x;
    if (y === 'bottom') style.bottom = 14; else style.top = y;
    const tx = `${flip ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`;
    return (
        <svg
            style={{...style, transform: tx, transformOrigin: 'center'}}
            viewBox="0 0 26 26"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
        >
            <path d="M2 2 L2 14 M2 2 L14 2" />
            <path d="M2 8 Q8 8 8 2" />
            <circle cx="5" cy="5" r="1.3" fill="currentColor" stroke="none" />
        </svg>
    );
}
