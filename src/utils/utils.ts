import {Card} from "../types/types.tsx";

export function calculate_deck_cost(cardList: Card[], cardCraftingModifier: number, cardUpgradingModifier: number): number {
    const costMap: { [key: string]: number } = {
        'Common': 60,
        'Uncommon': 180,
        'Rare': 420,
        'Epic': 1260,
        'Mythic': 1940
    };

    let totalCost = 0;

    cardList.forEach(card => {
        const baseCost = costMap[card.rarity];
        if (card.originalRarity == null) { // card cost
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