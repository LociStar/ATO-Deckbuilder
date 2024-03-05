export type Card = {
    id: string;
    name: string;
    class: string;
    version: string;
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