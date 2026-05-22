import {C} from './tokens';
import {Card} from '../../types/types';

// Bin a card list into 6 buckets by energy cost: 0, 1, 2, 3, 4, 5+.
export function buildCurve(cards: Card[] | undefined): number[] {
    const buckets = [0, 0, 0, 0, 0, 0];
    if (!cards) return buckets;
    for (const c of cards) {
        const i = Math.min(5, Math.max(0, c.energyCost | 0));
        buckets[i]++;
    }
    return buckets;
}

// Inline mini bar chart used inside GuildPosting card meta rows.
export default function EnergyCurve({
    buckets,
    height = 22,
    color = C.amber,
    bgColor = 'rgba(31,20,8,.08)',
    width = 90,
}: {
    buckets: number[];
    height?: number;
    color?: string;
    bgColor?: string;
    width?: number;
}) {
    const max = Math.max(1, ...buckets);
    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 3,
            height,
            width,
        }}>
            {buckets.map((v, i) => (
                <div key={i} style={{
                    flex: 1,
                    height: '100%',
                    borderRadius: 1,
                    background: bgColor,
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${(v / max) * 100}%`,
                        background: color,
                    }} />
                </div>
            ))}
        </div>
    );
}
