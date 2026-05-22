import {C} from '../tokens';
import {Rarity} from '../../../types/types';

export const RARITY_ORDER: Rarity[] = ['Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'];

export const RARITY: Record<Rarity, {label: string; color: string}> = {
    Common:   {label: 'Common',   color: '#b8b0a0'},
    Uncommon: {label: 'Uncommon', color: C.green},
    Rare:     {label: 'Rare',     color: C.teal},
    Epic:     {label: 'Epic',     color: C.purple},
    Mythic:   {label: 'Mythic',   color: C.amber},
};

export function rarityKey(r: string | undefined | null): Rarity {
    if (!r) return 'Common';
    const k = (r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()) as Rarity;
    return (RARITY as Record<string, unknown>)[k] ? k : 'Common';
}

export function topTier<T extends {rarity: Rarity}>(tiers: T[]): T {
    let best = tiers[0];
    let bestIdx = RARITY_ORDER.indexOf(best.rarity);
    for (const t of tiers) {
        const i = RARITY_ORDER.indexOf(t.rarity);
        if (i > bestIdx) {
            best = t;
            bestIdx = i;
        }
    }
    return best;
}

export function formatType(t: string | undefined | null): string {
    if (!t || t === 'None') return '—';
    return t.replaceAll('_', ' ');
}
