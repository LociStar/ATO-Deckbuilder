export type Card = {
    id: string;
    name: string;
    class: string;
    version: string;
    rarity: string;
    originalRarity: string;
};

export type Deck = {
    id: string;
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