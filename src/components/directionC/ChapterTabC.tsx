import {C} from './tokens';

const NUMERALS = ['I', 'II', 'III', 'IV'];

// Chapter tab — Roman numeral + label + count badge in class-accent color,
// active state lifts to a creamHi panel.
export default function ChapterTabC({
    chapter,
    count,
    active,
    color,
    onClick,
}: {
    chapter: number;
    count: number;
    active?: boolean;
    color: string;
    onClick?: () => void;
}) {
    const numeral = NUMERALS[chapter - 1] ?? String(chapter);
    return (
        <div onClick={onClick} style={{position: 'relative', cursor: onClick ? 'pointer' : 'default'}}>
            <div style={{
                padding: '8px 18px 10px',
                background: active ? C.creamHi : 'transparent',
                border: active ? `1.5px solid ${C.ink}` : '1.5px solid transparent',
                borderBottom: active ? `1.5px solid ${C.creamHi}` : `1.5px solid ${C.ink}`,
                borderRadius: '4px 4px 0 0',
                position: 'relative',
                marginBottom: -1.5,
            }}>
                <div style={{
                    fontFamily: C.display,
                    fontSize: 12,
                    fontWeight: 700,
                    color: active ? C.ink : C.inkDim,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}>
                    <span style={{
                        color: active ? color : C.inkMute,
                        fontFamily: C.display,
                        fontSize: 14,
                    }}>{numeral}</span>
                    <span>Chapter</span>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 18,
                        height: 18,
                        padding: '0 5px',
                        background: active ? color : C.cream,
                        color: active ? C.creamHi : C.inkDim,
                        border: `1.2px solid ${active ? C.ink : C.inkMute}`,
                        borderRadius: 2,
                        fontFamily: C.mono,
                        fontSize: 10,
                        letterSpacing: 0,
                        textShadow: active ? '0 1px 0 rgba(0,0,0,.4)' : 'none',
                    }}>{count}</span>
                </div>
            </div>
        </div>
    );
}
