import {Plaque} from '../primitives';
import {C} from '../tokens';
import {LibraryStats} from '../../../types/types';

export default function LibraryStatPlaques({stats}: {stats: LibraryStats | null}) {
    const dash = '—';
    return (
        <div style={{display: 'flex', gap: 10, marginBottom: 14}}>
            <Plaque
                label="Cards Catalogued"
                value={stats ? stats.total.toLocaleString() : dash}
                sub={stats ? `across ${stats.tiers.toLocaleString()} tiers` : 'loading…'}
            />
            <Plaque
                label="Heroes"
                value={stats ? stats.heroes.toLocaleString() : dash}
                sub="usable by adventurers"
                color={C.tealDeep}
            />
            <Plaque
                label="Monsters"
                value={stats ? stats.monsters.toLocaleString() : dash}
                sub="enemy actions"
                color={C.red}
            />
            <Plaque
                label="Items"
                value={stats ? stats.items.toLocaleString() : dash}
                sub="equipment & relics"
                color={C.purpleDeep}
            />
            <Plaque
                label="Indexed"
                value={stats?.gameVersion ?? dash}
                sub={stats?.updatedAt ? `updated ${new Date(stats.updatedAt).toLocaleDateString()}` : 'game data'}
                color={C.greenDeep}
            />
        </div>
    );
}
