import {Card} from "../types/types.tsx";

export function calculate_deck_cost(
    cardList: Card[],
    baseCards: Card[],
    cardCraftingModifier: number,
    cardUpgradingModifier: number
): number {
    const costMap: { [key: string]: number } = {
        'Common': 60,
        'Uncommon': 180,
        'Rare': 420,
        'Epic': 1260,
        'Mythic': 1940
    };

    // Track the count of each base card by ID
    const baseCardCounts: { [key: string]: number } = {};
    baseCards.forEach(baseCard => {
        baseCardCounts[baseCard.id] = (baseCardCounts[baseCard.id] || 0) + 1;
    });

    let totalCost = 0;
    //const sortedCardList = [...cardList].sort((a, b) => a.id.localeCompare(b.id));

    cardList.forEach(card => {
        // Determine if this card is an upgrade of a base card
        const baseCardId = (card.version != "No\n") ? card.id.replace(/[ab]$/, '') : card.id; // remove "a" or "b" if present
        const baseCardCount = baseCardCounts[baseCardId] || 0;

        if (baseCardCount > 0) {
            // Subtract base card cost if there are remaining base cards for this ID
            const baseCardCost = costMap[card.rarity];
            totalCost -= Math.round(baseCardCost * cardCraftingModifier);

            // Decrement the count of base cards for this ID
            baseCardCounts[baseCardId] -= 1;
        }

        const baseCost = costMap[card.rarity];

        if (card.originalRarity == null) { // full card cost
            totalCost += Math.round(baseCost * cardCraftingModifier);
        } else { // upgrade cost
            if (card.rarity === card.originalRarity) {
                totalCost += Math.round(baseCost * (cardCraftingModifier + cardUpgradingModifier));
            } else {
                const originalCost = costMap[card.originalRarity];
                totalCost += Math.round(originalCost * cardCraftingModifier + baseCost * cardUpgradingModifier);
            }
        }
    });

    return totalCost;
}
