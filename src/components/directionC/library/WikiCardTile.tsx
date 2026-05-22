import {C} from '../tokens';
import {AppConfig} from '../../../config';
import {LibraryEntry} from '../../../types/types';
import {formatType, RARITY, RARITY_ORDER, topTier} from './rarity';

export default function WikiCardTile({
                                         entry,
                                         selected,
                                         onClick,
                                     }: {
    entry: LibraryEntry;
    selected?: boolean;
    onClick?: () => void;
}) {
    const top = topTier(entry.tiers);
    const sortedTiers = [...entry.tiers].sort(
        (a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity),
    );

    return (
        <div
            onClick={onClick}
            style={{
                background: C.creamHi,
                border: `1.5px solid ${selected ? C.amberDeep : C.ink}`,
                borderRadius: 4,
                boxShadow: selected
                    ? `0 2px 0 ${C.amberDeep}, 0 3px 10px rgba(154,86,12,.25)`
                    : `0 2px 0 ${C.ink}, 0 3px 8px rgba(31,20,8,.15)`,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* tier-dot rhombi */}
            <div style={{position: 'absolute', top: 8, right: 8, zIndex: 2, display: 'flex', gap: 2}}>
                {sortedTiers.map((t, i) => (
                    <div key={i} style={{
                        width: 8, height: 8, transform: 'rotate(45deg)',
                        background: RARITY[t.rarity].color,
                        border: `1px solid ${C.ink}`,
                    }}/>
                ))}
            </div>

            {/* card art */}
            <div style={{
                //aspectRatio: '4 / 5',
                borderBottom: `1.5px solid ${C.ink}`,
                background: C.parchment,
                overflow: 'hidden',
                position: 'relative',
            }}>
                <img
                    src={`${AppConfig.API_URL}/card/image/${top.cardId}`}
                    alt={entry.name}
                    loading="lazy"
                    style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center top',
                        display: 'block',
                    }}
                />
            </div>

            {/* name plate */}
            <div style={{padding: '6px 7px 5px', background: C.parchment, borderBottom: `1px dashed ${C.inkMute}`}}>
                <div style={{
                    fontFamily: C.display, fontSize: 12.5, fontWeight: 700, color: C.ink,
                    letterSpacing: '0.01em',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{entry.name}</div>
                <div style={{
                    fontFamily: C.serif, fontStyle: 'italic', fontSize: 10, color: C.inkDim,
                    marginTop: 1,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{entry.target}</div>
            </div>

            {/* meta footer */}
            <div style={{
                display: 'flex', alignItems: 'center', padding: '5px 7px',
                fontFamily: C.mono, fontSize: 9, color: C.inkDim, letterSpacing: '0.04em',
            }}>
                <span style={{
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%',
                }}>{formatType(entry.type).toUpperCase()}</span>
                <div style={{flex: 1}}/>
                <span>{entry.tiers.length} TIER{entry.tiers.length > 1 ? 'S' : ''}</span>
            </div>
        </div>
    );
}
