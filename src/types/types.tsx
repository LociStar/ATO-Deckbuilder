type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Mythic';

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

export type Perks = {
    id: number;
    data: string;
    title: string;
};

export type PagedPerks = {
    perks: Perks[];
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