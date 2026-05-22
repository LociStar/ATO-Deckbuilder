import {useNavigate} from 'react-router-dom';
import {useContext} from 'preact/hooks';
import {Deck} from '../../types/types';
import {AppConfig} from '../../config';
import {AppState} from '../../screens/ViewController';
import {C, classAccent} from './tokens';
import {WaxSeal} from './primitives';
import EnergyCurve, {buildCurve} from './EnergyCurve';

function avgEnergy(deck: Deck): number {
    const cards = deck.cardList ?? [];
    if (!cards.length) return 0;
    const total = cards.reduce((s, c) => s + (c.energyCost | 0), 0);
    return total / cards.length;
}

function chaptersCovered(deck: Deck): number {
    const cards = deck.cardList ?? [];
    const set = new Set<number>();
    for (const c of cards) {
        if (c.chapter != null) set.add(c.chapter);
    }
    return set.size;
}

// Rough shard estimate from rarity sum — used as a fallback when the
// backend does not send `deck.shards`. Excludes base-card discount and
// per-user crafting modifiers, so this is a ballpark, not exact.
const SHARD_COST: Record<string, number> = {
    Common: 60, Uncommon: 180, Rare: 420, Epic: 1260, Mythic: 1940,
};
function estimateShards(deck: Deck): number {
    const cards = deck.cardList ?? [];
    return cards.reduce((s, c) => s + (SHARD_COST[c.rarity] ?? 0), 0);
}
function formatShards(n: number): string {
    // European-style "1.820" thousands separator to match the in-game UI.
    return n.toLocaleString('de-DE');
}

// Deck card in Direction C Guild Hall style. Replaces CharCard on the
// main page. Click navigates to the deck detail route, same as before.
export default function GuildPosting({deck, rank}: {deck: Deck; rank?: number}) {
    const state = useContext(AppState);
    const navigate = useNavigate();
    const accent = classAccent(deck.characterId);
    const cards = deck.cardList ?? [];
    const curve = buildCurve(cards);
    const avg = avgEnergy(deck);
    const chapters = chaptersCovered(deck);
    const shards: number | undefined =
        deck.shards ?? (cards.length > 0 ? estimateShards(deck) : undefined);

    function onClick() {
        state.deckId = deck.id;
        navigate('/deck/' + deck.id);
    }

    return (
        <div
            onClick={onClick}
            style={{
                position: 'relative',
                background: C.creamHi,
                border: `1.5px solid ${C.ink}`,
                borderRadius: 4,
                boxShadow: `0 2px 0 ${C.ink}, 0 4px 10px rgba(31,20,8,.2)`,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
                textAlign: 'left',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 0 ${C.ink}, 0 8px 18px rgba(31,20,8,.28)`;
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = '';
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 0 ${C.ink}, 0 4px 10px rgba(31,20,8,.2)`;
            }}
        >
            {/* Top stained-glass strip */}
            <div style={{
                position: 'relative',
                height: 6,
                background: accent,
                borderBottom: `1px solid ${C.ink}`,
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'repeating-linear-gradient(45deg, transparent 0 8px, rgba(0,0,0,.18) 8px 9px)',
                }} />
            </div>

            <div style={{display: 'flex', gap: 12, padding: 14}}>
                <div style={{position: 'relative', flexShrink: 0}}>
                    <div style={{
                        width: 56,
                        height: 80,
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: `2px solid ${C.ink}`,
                        boxShadow: `inset 0 0 0 2px ${C.amberDeep}`,
                        background: C.cream,
                    }}>
                        <img
                            src={AppConfig.API_URL + `/character/image/${deck.characterId}`}
                            alt={`Character ${deck.characterId}`}
                            width={56}
                            height={80}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                        />
                    </div>
                    {typeof rank === 'number' && rank <= 3 && (
                        <div style={{position: 'absolute', top: -8, left: -8}}>
                            <WaxSeal
                                size={22}
                                label={rank}
                                color={rank === 1 ? C.amber : rank === 2 ? C.stone : C.amberDeep}
                            />
                        </div>
                    )}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                    <div style={{
                        fontFamily: C.display,
                        fontSize: 10,
                        color: accent,
                        letterSpacing: '0.2em',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        marginBottom: 2,
                    }}>{[deck.characterId, ...(deck.tags ?? [])].filter(Boolean).join(' • ')}</div>
                    <div style={{
                        fontFamily: C.display,
                        fontWeight: 700,
                        fontSize: 17,
                        color: C.ink,
                        lineHeight: 1.15,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        textOverflow: 'ellipsis',
                    }}>{deck.title}</div>
                    <div style={{
                        fontFamily: C.serif,
                        fontStyle: 'italic',
                        fontSize: 13,
                        color: C.inkDim,
                        marginTop: 3,
                    }}>
                        scribed by <span style={{color: C.inkSoft, fontStyle: 'normal', fontWeight: 600}}>{deck.username}</span>
                    </div>
                </div>
            </div>

            {/* Meta row — each stat gated independently so we degrade gracefully
                when the list endpoint omits cardList. */}
            <div style={{padding: '0 14px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap'}}>
                {shards != null && (
                    <div style={{display: 'flex', alignItems: 'baseline', gap: 4}}>
                        <span style={{fontFamily: C.mono, fontSize: 13, color: C.ink, fontWeight: 700}}>{formatShards(shards)}</span>
                        <span style={{fontFamily: C.serif, fontSize: 11, color: C.inkDim, fontStyle: 'italic'}}>shards</span>
                    </div>
                )}
                {cards.length > 0 && (
                    <>
                        {shards != null && <div style={{width: 1, height: 14, background: C.inkMute, opacity: 0.4}} />}
                        <div style={{display: 'flex', alignItems: 'baseline', gap: 4}}>
                            <span style={{fontFamily: C.mono, fontSize: 13, color: C.ink, fontWeight: 700}}>{avg.toFixed(1)}</span>
                            <span style={{fontFamily: C.serif, fontSize: 11, color: C.inkDim, fontStyle: 'italic'}}>avg energy</span>
                        </div>
                    </>
                )}
                {deck.difficulty && (
                    <span style={{
                        fontFamily: C.display,
                        fontSize: 10,
                        color: C.amberDeep,
                        letterSpacing: '0.18em',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                    }}>{deck.difficulty}</span>
                )}
                <div style={{flex: 1}} />
                {cards.length > 0 && (
                    <EnergyCurve buckets={curve} height={20} color={accent} width={84} />
                )}
            </div>

            {/* Foot: likes + chapter dots */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                borderTop: `1px solid ${C.creamShade}`,
                padding: '7px 14px',
                background: C.cream,
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontFamily: C.serif,
                    fontSize: 13,
                    color: C.red,
                    fontWeight: 700,
                }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill={C.red} stroke={C.woodDark} strokeWidth="1">
                        <path d="M7 12 Q1 8 1 4.5 a3 3 0 0 1 6 0 a3 3 0 0 1 6 0 Q13 8 7 12 Z" />
                    </svg>
                    <span>{deck.likes}</span>
                    <span style={{fontFamily: C.serif, fontSize: 11, color: C.inkDim, fontStyle: 'italic', fontWeight: 400}}>endorsements</span>
                </div>
                <div style={{flex: 1}} />
                <div style={{display: 'flex', gap: 3}}>
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} style={{
                            width: 14,
                            height: 4,
                            borderRadius: 1,
                            background: C.inkMute,
                            opacity: n <= chapters ? 0.6 : 0.2,
                        }} />
                    ))}
                </div>
                <span style={{
                    fontFamily: C.mono,
                    fontSize: 10,
                    color: C.inkDim,
                    marginLeft: 6,
                    letterSpacing: '0.08em',
                }}>{chapters || 0} CHAPTERS</span>
            </div>
        </div>
    );
}
