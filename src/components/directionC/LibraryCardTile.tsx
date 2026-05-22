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

// Library card tile — parchment-bordered, with the real card image as the
// art well, cost orb top-left, rarity gem top-right, name plate + version
// caption below. Click to add to the deck.
export default function LibraryCardTile({
    card,
    onClick,
}: {
    card: Card;
    onClick?: (card: Card) => void;
}) {
    const rarityColor = RARITY_COLOR[card.rarity] ?? RARITY_COLOR.Common;
    const versionColor = card.version.trim() === 'A' ? C.teal
        : card.version.trim() === 'B' ? C.amberDeep
            : card.version.trim() === 'Rare' ? C.purple
                : C.inkDim;
    return (
        <div
            onClick={() => onClick?.(card)}
            style={{
                width: '100%',
                background: C.creamHi,
                border: `1.5px solid ${C.ink}`,
                borderRadius: 4,
                boxShadow: `0 2px 0 ${C.ink}, 0 3px 8px rgba(31,20,8,.15)`,
                cursor: onClick ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
            }}>
            {/* cost orb */}
            <div style={{
                position: 'absolute',
                top: 6,
                left: 6,
                zIndex: 2,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <img
                    src={`${AppConfig.API_URL}/character/image/card_base_energy_${card.rarity.toLowerCase()}`}
                    alt="energy"
                    style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
                />
                <span style={{
                    position: 'relative',
                    fontFamily: C.display,
                    fontWeight: 700,
                    fontSize: 13,
                    color: C.creamHi,
                    textShadow: '0 1px 0 rgba(0,0,0,.5)',
                }}>{card.energyCost}</span>
            </div>
            {/* rarity gem */}
            <div style={{
                position: 'absolute',
                top: 9,
                right: 9,
                zIndex: 2,
                width: 12,
                height: 12,
                transform: 'rotate(45deg)',
                background: rarityColor,
                border: `1.2px solid ${C.ink}`,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.35)',
            }} />
            {/* art well — real card image */}
            <div style={{
                aspectRatio: '297 / 450',
                background: C.parchment,
                borderBottom: `1.5px solid ${C.ink}`,
                position: 'relative',
                overflow: 'hidden',
            }}>
                <img
                    src={`${AppConfig.API_URL}/card/image/${card.id}`}
                    alt={card.name}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>
            {/* name plate */}
            <div style={{
                padding: '6px 6px 4px',
                textAlign: 'center',
                background: C.parchment,
                borderBottom: `1px dashed ${C.inkMute}`,
            }}>
                <div style={{
                    fontFamily: C.display,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.ink,
                    letterSpacing: '0.01em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>{card.name}</div>
            </div>
            {/* version footer */}
            <div style={{
                padding: '5px 6px',
                fontFamily: C.mono,
                fontSize: 9,
                color: versionColor,
                textAlign: 'center',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
            }}>
                {card.version?.trim() || 'Standard'}
            </div>
        </div>
    );
}
