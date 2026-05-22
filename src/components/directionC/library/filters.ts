export const COST_MIN = 0;
export const COST_MAX = 10;

export type SortKey = 'name_asc' | 'name_desc' | 'cost_asc' | 'cost_desc';

export type Filters = {
    letter: string | null;
    rarity: string[];
    category: string[];
    class: string[];
    type: string[];
    costMin: number;
    costMax: number;
    sort: SortKey;
};

export const DEFAULT_FILTERS: Filters = {
    letter: null,
    rarity: [],
    category: [],
    class: [],
    type: [],
    costMin: COST_MIN,
    costMax: COST_MAX,
    sort: 'name_asc',
};

export function buildLibraryQuery(filters: Filters, searchQuery: string, page: number, size: number): string {
    const params = new URLSearchParams();
    if (searchQuery) params.set('searchQuery', searchQuery);
    if (filters.letter) params.set('letter', filters.letter);
    if (filters.rarity.length) params.set('rarity', filters.rarity.join(','));
    if (filters.category.length) params.set('category', filters.category.join(','));
    if (filters.class.length) params.set('class', filters.class.join(','));
    if (filters.type.length) params.set('type', filters.type.join(','));
    if (filters.costMin !== COST_MIN) params.set('costMin', String(filters.costMin));
    if (filters.costMax !== COST_MAX) params.set('costMax', String(filters.costMax));
    params.set('sort', filters.sort);
    params.set('page', String(page));
    params.set('size', String(size));
    return params.toString();
}

export function toggleArrayValue(arr: string[], value: string): string[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function hasAnyFilter(f: Filters): boolean {
    return Boolean(
        f.letter ||
        f.rarity.length ||
        f.category.length ||
        f.class.length ||
        f.type.length ||
        f.costMin !== COST_MIN ||
        f.costMax !== COST_MAX,
    );
}
