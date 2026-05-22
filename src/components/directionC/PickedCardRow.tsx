import {Card} from '../../types/types';
import {AppConfig} from '../../config';
import {C} from './tokens';

const RARITY_COLOR: Record<string, string> = {
    Common: '#b8bdc7',
    Uncommon: '#5ec07e',
    Rare: '#4aa8e8',
    Epic: '#b985e4',
    Mythic: '#e8a04a',
};

// Selected-card row used in the builder's left column. Cost orb (real
// `card_base_energy_{rarity}` backend sprite framed in an amber radial),
// card name in display font, rarity left-border, real card sprite at the
// right edge. Click to remove.
export default function PickedCardRow({
    card,
    onClick,
}: {
    card: Card;
    onClick?: (card: Card) => void;
}) {
    const accent = RARITY_COLOR[card.rarity] ?? RARITY_COLOR.Common;
    return (
        <div
            onClick={() => onClick?.(card)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: C.creamHi,
                border: `1.5px solid ${C.ink}`,
                borderLeft: `5px solid ${accent}`,
                borderRadius: 3,
                padding: '6px 8px 6px 10px',
                boxShadow: `0 2px 0 ${C.ink}`,
                cursor: onClick ? 'pointer' : 'default',
            }}>
            <div style={{
                position: 'relative',
                width: 32,
                height: 32,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img
                    src={`${AppConfig.API_URL}/character/image/card_base_energy_${card.rarity.toLowerCase()}`}
                    alt="energy"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                    }}
                />
                <span style={{
                    position: 'relative',
                    fontFamily: C.display,
                    fontWeight: 700,
                    fontSize: 14,
                    color: C.creamHi,
                    textShadow: '0 1px 0 rgba(0,0,0,.5)',
                }}>{card.energyCost}</span>
            </div>
            <div style={{
                flex: 1,
                minWidth: 0,
                fontFamily: C.display,
                fontSize: 14,
                color: C.ink,
                fontWeight: 600,
                letterSpacing: '0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
            }}>{card.name}</div>
            <img
                src={`${AppConfig.API_URL}/card/sprite/${card.id}`}
                alt={card.name}
                style={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    objectFit: 'contain',
                }}
            />
        </div>
    );
}
