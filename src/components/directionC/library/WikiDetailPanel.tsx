import {useEffect, useState} from 'preact/hooks';
import {C} from '../tokens';
import {AppConfig} from '../../../config';
import {LibraryEntry} from '../../../types/types';
import {formatType, RARITY, RARITY_ORDER} from './rarity';
import {StainedFrame} from '../primitives';

function MetaCell({label, value}: { label: string; value: string }) {
    return (
        <div>
            <div style={{
                fontFamily: C.display, fontSize: 9, color: C.inkDim,
                letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
            }}>{label}</div>
            <div style={{fontFamily: C.serif, fontSize: 13, color: C.ink, fontWeight: 600}}>{value}</div>
        </div>
    );
}

export default function WikiDetailPanel({entry}: { entry: LibraryEntry | null }) {
    const sortedTiers = entry
        ? [...entry.tiers].sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity))
        : [];
    const [activeIdx, setActiveIdx] = useState(sortedTiers.length ? sortedTiers.length - 1 : 0);

    useEffect(() => {
        setActiveIdx(sortedTiers.length ? sortedTiers.length - 1 : 0);
    }, [entry?.name]);

    if (!entry) {
        return (
            <div style={{
                background: C.creamHi,
                border: `1.5px solid ${C.ink}`,
                borderRadius: 4,
                boxShadow: `0 2px 0 ${C.ink}, 0 4px 12px rgba(31,20,8,.18)`,
                padding: 24,
                fontFamily: C.serif, fontStyle: 'italic', fontSize: 13, color: C.inkDim,
                textAlign: 'center',
                position: 'sticky', top: 14,
            }}>
                Select a card to examine it.
            </div>
        );
    }

    const t = sortedTiers[activeIdx] ?? sortedTiers[0];

    return (
        <div style={{
            background: C.creamHi,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 4,
            boxShadow: `0 2px 0 ${C.ink}, 0 4px 12px rgba(31,20,8,.18)`,
            overflow: 'hidden',
            position: 'sticky', top: 14,
        }}>
            {/* header label */}
            <div style={{
                padding: '8px 14px', background: C.parchment, borderBottom: `1.5px solid ${C.ink}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                <div style={{
                    fontFamily: C.display, fontSize: 10, color: C.inkDim,
                    letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                }}>Now Examining
                </div>
                <div style={{
                    fontFamily: C.serif,
                    fontStyle: 'italic',
                    fontSize: 12,
                    color: C.ink,
                    fontWeight: 600
                }}>{entry.name}</div>
            </div>

            {/* big card image */}
            <div style={{
                padding: 16,
                background: `linear-gradient(${C.cream}, ${C.parchment})`,
                display: 'flex', justifyContent: 'center',
            }}>
                <div style={{
                    width: 240,
                    aspectRatio: '297 / 450',
                    overflow: 'hidden',
                }}>
                    <img
                        src={`${AppConfig.API_URL}/card/image/${t.cardId}`}
                        alt={`${entry.name} (${t.rarity})`}
                        style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                    />
                </div>
            </div>

            {/* tier tabs */}
            <div style={{padding: '10px 14px 4px', background: C.creamHi}}>
                <div style={{
                    fontFamily: C.display, fontSize: 10, color: C.inkDim,
                    letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                    marginBottom: 6,
                }}>Rarity Tiers
                </div>
                <div style={{display: 'flex', gap: 4}}>
                    {sortedTiers.map((tier, i) => {
                        const tr = RARITY[tier.rarity];
                        const active = i === activeIdx;
                        return (
                            <div
                                key={tier.cardId}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                    flex: 1,
                                    padding: '6px 4px',
                                    background: active ? tr.color : C.cream,
                                    color: active ? C.ink : C.inkSoft,
                                    border: `1.5px solid ${active ? C.ink : C.inkMute}`,
                                    borderRadius: 2,
                                    fontFamily: C.display, fontSize: 9.5, fontWeight: 700,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    boxShadow: active ? `0 1.5px 0 ${C.ink}` : 'none',
                                    userSelect: 'none',
                                }}
                            >{tr.label}</div>
                        );
                    })}
                </div>
                <div style={{
                    marginTop: 8,
                    fontFamily: C.mono, fontSize: 10, color: C.amberDeep, fontWeight: 700,
                    textAlign: 'center',
                }}>{t.cost} ⚡ energy
                </div>
            </div>

            {/* metadata */}
            <div style={{
                padding: '12px 14px',
                background: C.parchment,
                borderTop: `1.5px solid ${C.ink}`,
                marginTop: 10
            }}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
                    <MetaCell label="Type" value={formatType(entry.type)}/>
                    <MetaCell label="Target" value={entry.target || '—'}/>
                    <MetaCell label="Class" value={entry.class || '—'}/>
                    <MetaCell label="Category" value={entry.category}/>
                </div>
            </div>

            {entry.sources.length > 0 && (
                <div style={{
                    padding: '12px 14px',
                    background: C.creamHi,
                    borderTop: `1.5px solid ${C.ink}`,
                }}>
                    <div style={{
                        fontFamily: C.display, fontSize: 9, color: C.inkDim,
                        letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700,
                        marginBottom: 8,
                    }}>Found in starting Decks of</div>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 10,
                    }}>
                        {entry.sources.map((characterId) => (
                            <div
                                key={characterId}
                                title={characterId}
                                style={{
                                    display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', gap: 4,
                                    width: 56,
                                }}>
                                <StainedFrame characterId={characterId} size={40} rounded={3}/>
                                <div style={{
                                    fontFamily: C.serif, fontSize: 10.5, color: C.ink,
                                    fontWeight: 600, textAlign: 'center',
                                    whiteSpace: 'nowrap', overflow: 'hidden',
                                    textOverflow: 'ellipsis', maxWidth: '100%',
                                }}>{characterId}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* actions (placeholders) */}
            <div hidden style={{
                padding: '10px 14px', display: 'flex', gap: 6,
                background: C.creamHi, borderTop: `1px dashed ${C.inkMute}`,
            }}>
                <div hidden title="Coming soon" style={{
                    flex: 1, padding: '7px 12px',
                    fontFamily: C.display, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    background: C.cream, color: C.inkMute,
                    border: `1.5px solid ${C.inkMute}`, borderRadius: 2,
                    cursor: 'not-allowed', textAlign: 'center',
                    opacity: 0.7,
                }}>+ To Folio
                </div>
                <div hidden title="Coming soon" style={{
                    flex: 1, padding: '7px 12px',
                    fontFamily: C.display, fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    background: C.cream, color: C.inkMute,
                    border: `1.5px solid ${C.inkMute}`, borderRadius: 2,
                    cursor: 'not-allowed', textAlign: 'center',
                    opacity: 0.7,
                }}>Open Folio
                </div>
            </div>
        </div>
    );
}
