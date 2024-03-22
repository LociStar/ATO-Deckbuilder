type Rarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Mythic';

export type Card = {
    id: string;
    name: string;
    class: string;
    version: string;
    rarity: Rarity;
    originalRarity: string;
    energyCost: number;
};

export type Deck = {
    id: number;
    title: string;
    description: string;
    charName: string;
    username: string;
    likes: number;
    characterId: string;
    cardList: Card[];
};

export type CharBuild = {
    id: string;
    title: string;
    charName: string;
    userName: string;
    likes: number;
};

export type Character = {
    characterId: string;
    characterClass: string;
    secondaryCharacterClass: string;
}

export type CharacterItem = {
    value: string;
    label: string;
}