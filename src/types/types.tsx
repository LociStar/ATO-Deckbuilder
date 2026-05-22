export type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Mythic';

export type LibraryCategory = 'hero' | 'monster' | 'item' | 'boon' | 'injury' | 'special';

export type LibraryTier = {
    rarity: Rarity;
    cost: number;
    cardId: string;
    description: string | null;
};

export type LibraryEntry = {
    name: string;
    letter: string;
    category: LibraryCategory;
    class: string;
    type: string;
    target: string;
    tiers: LibraryTier[];
    tags: string[];
    firstChapter: number | null;
    sources: string[];
};

export type LibraryFacetCounts = {
    rarity: Record<string, number>;
    class: Record<string, number>;
    type: Record<string, number>;
    category: Record<string, number>;
};

export type PagedLibrary = {
    entries: LibraryEntry[];
    page: number;
    pages: number;
    total: number;
    letterCounts: Record<string, number>;
    facetCounts: LibraryFacetCounts;
};

export type LibraryStats = {
    total: number;
    tiers: number;
    heroes: number;
    monsters: number;
    items: number;
    boons: number;
    injuries: number;
    specials: number;
    gameVersion: string | null;
    updatedAt: string | null;
    knownTypes: string[];
    knownClasses: string[];
};

export type Card = {
    id: string;
    name: string;
    class: string;
    version: string;
    rarity: Rarity;
    originalRarity: string;
    energyCost: number;
    chapter: number;
};

export type Deck = {
    id: number;
    title: string;
    description: string;
    username: string;
    likes: number;
    characterId: string;
    cardList: Card[];
    // Optional metadata shown on the deck card. Populated by the backend
    // when available; UI falls back to computed values or hides the badge.
    shards?: number;
    difficulty?: string;
    tags?: string[];
};

export type PagedDeck = {
    decks: Deck[];
    pages: number;
}

export type Character = {
    characterId: string;
    characterClass: string;
    secondaryCharacterClass: string;
}

export type UserPerk = {
    id: number;
    data: string;
    title: string;
};

export type PagedPerks = {
    perks: UserPerk[];
    pages: number;
}

export type PerkDetails = {
    id: number;
    additionalCurrency: number;
    additionalShards: number;
    auraCurseBonus: string;
    auraCurseBonusValue: number;
    cardClass: string;
    customDescription: string;
    damageFlatBonus: string;
    damageFlatBonusValue: number;
    energyBegin: number;
    healQuantity: number;
    icon: string;
    iconTextValue: string;
    level: number;
    mainPerk: boolean;
    maxHealth: number;
    obeliskPerk: boolean;
    resistModified: string;
    resistModifiedValue: number;
    row: number;
    speedQuantity: number;
};

export type PerkNodeProps = {
    id: string;
    column: number;
    cost: string;
    lockedInTown: boolean;
    noStack: boolean;
    perk: string;
    perkRequired: string;
    perksConnected: string[];
    row: number;
    sprite: string;
    type: number;
    description: string;
    iconTextValue: string;
    customDescription: string;
    maxHealth: number;
    additionalCurrency: number;
    additionalShards: number;
    speedQuantity: number;
    healQuantity: number;
    energyBegin: number;
    auraCurseBonus: string;
    resistModified: string;
    damageFlatBonus: string;
};
