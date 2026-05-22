import {C} from '../tokens';

function pageWindow(current: number, total: number): Array<number | '…'> {
    if (total <= 7) return Array.from({length: total}, (_, i) => i);
    const around = [0, total - 1, current, current - 1, current + 1];
    const sorted = Array.from(new Set(around))
        .filter((n) => n >= 0 && n < total)
        .sort((a, b) => a - b);
    const out: Array<number | '…'> = [];
    sorted.forEach((n, i) => {
        if (i > 0 && n - (sorted[i - 1] as number) > 1) out.push('…');
        out.push(n);
    });
    return out;
}

const btnStyle = {
    padding: '7px 14px',
    fontFamily: C.display,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.16em',
    textTransform: 'uppercase' as const,
    background: C.cream,
    color: C.inkSoft,
    border: `1.5px solid ${C.ink}`,
    borderRadius: 2,
    boxShadow: `0 1.5px 0 ${C.ink}`,
    cursor: 'pointer',
    userSelect: 'none' as const,
};

export default function LibraryPagination({
    page,
    pages,
    onChange,
}: {
    page: number;
    pages: number;
    onChange: (p: number) => void;
}) {
    if (pages <= 1) return null;
    const items = pageWindow(page, pages);

    const prev = () => page > 0 && onChange(page - 1);
    const next = () => page < pages - 1 && onChange(page + 1);

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div onClick={prev} style={{...btnStyle, opacity: page === 0 ? 0.4 : 1, cursor: page === 0 ? 'default' : 'pointer'}}>← Previous</div>
            <div style={{display: 'flex', gap: 5, alignItems: 'center', fontFamily: C.mono, fontSize: 11, color: C.inkDim}}>
                {items.map((p, i) => p === '…' ? (
                    <div key={`e${i}`} style={{minWidth: 24, padding: '4px 9px', textAlign: 'center'}}>…</div>
                ) : (
                    <div
                        key={p}
                        onClick={() => onChange(p as number)}
                        style={{
                            minWidth: 24,
                            padding: '4px 9px',
                            background: p === page ? C.amber : 'transparent',
                            color: p === page ? C.creamHi : C.inkSoft,
                            border: p === page ? `1.5px solid ${C.ink}` : 'none',
                            borderRadius: 2,
                            fontWeight: 700,
                            textAlign: 'center',
                            cursor: 'pointer',
                        }}
                    >{(p as number) + 1}</div>
                ))}
            </div>
            <div onClick={next} style={{...btnStyle, opacity: page >= pages - 1 ? 0.4 : 1, cursor: page >= pages - 1 ? 'default' : 'pointer'}}>Next →</div>
        </div>
    );
}
