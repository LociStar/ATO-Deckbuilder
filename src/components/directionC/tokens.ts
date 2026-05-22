// Direction C — "Guild Hall" design tokens.
// Palette + font families lifted from the Direction C design exploration.
// Components import from here so the look stays internally consistent and
// is easy to retune in one place.

export const C = {
    // Sky & atmosphere
    sky:        '#a8c8da',
    skyDeep:    '#7da8c0',
    // Parchment / paper UI
    cream:      '#f5ead0',
    creamHi:    '#fbf3df',
    creamShade: '#e8d8a8',
    parchment:  '#ecdbb0',
    // Wood
    wood:       '#6e3c1c',
    woodMid:    '#8a532a',
    woodDark:   '#3a1f10',
    // Stone / ink
    stone:      '#a89c84',
    stoneDark:  '#6b5f4b',
    ink:        '#1f1408',
    inkSoft:    '#4a3520',
    inkDim:     '#7d6342',
    inkMute:    '#a89175',
    // Stained-glass accents (windows, banners, awnings, crystals)
    amber:      '#d6881a',
    amberDeep:  '#9a560c',
    teal:       '#2f8db8',
    tealDeep:   '#1d5a78',
    purple:     '#864aa6',
    purpleDeep: '#5a2e72',
    green:      '#5b9844',
    greenDeep:  '#2f6224',
    red:        '#b03826',
    // Fonts
    display:    '"Cinzel", "Cormorant Garamond", Georgia, serif',
    serif:      '"Cormorant Garamond", Georgia, serif',
    ui:         '"Inter", system-ui, sans-serif',
    mono:       '"JetBrains Mono", ui-monospace, monospace',
} as const;

// Stained-glass accent color per character class. Keys match backend
// `characterId` values. Fallback to amber for unknown classes.
export const CLASS_ACCENT: Record<string, string> = {
    Warrior:  C.amber,
    Ranger:   C.green,
    Mage:     C.purple,
    Cleric:   C.amberDeep,
    Bard:     C.teal,
    Engineer: C.tealDeep,
    Rogue:    C.purpleDeep,
    Druid:    C.greenDeep,
};

export function classAccent(characterId: string | undefined): string {
    return (characterId && CLASS_ACCENT[characterId]) || C.amber;
}
