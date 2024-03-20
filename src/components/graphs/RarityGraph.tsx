import { BarChart } from '@mui/x-charts/BarChart';
import {Card} from "../../types/types.tsx";
import {useEffect, useState} from "preact/hooks";

type RarityGraphProps = {
    cardList: Card[];
};

const rarityColors = {
    'Common': '#6d6d6d',
    'Uncommon': '#1f77b4',
    'Rare': '#2ca02c',
    'Epic': '#d62728',
    'Mythic': '#9467bd'
};

export const RarityGraph: React.FC<RarityGraphProps> = ({ cardList }) => {
    const [rarityDataset, setRarityDataset] =
        useState<{'Common': number, 'Uncommon': number, 'Rare': number, 'Epic': number, 'Mythic': number}>({
            'Common': 0,
            'Uncommon': 0,
            'Rare': 0,
            'Epic': 0,
            'Mythic': 0
        });

    useEffect(() => {
        const rarities = {
            'Common': 0,
            'Uncommon': 0,
            'Rare': 0,
            'Epic': 0,
            'Mythic': 0
        };

        cardList.forEach((card: Card) => {
            rarities[card.rarity]++;
        });

        setRarityDataset(rarities);
    }, [cardList]);
    return (
        <BarChart width={500} height={300}
                  slotProps={{
                      legend: {
                          direction: 'row',
                          position: {vertical: 'bottom', horizontal: 'middle'},
                          padding: 0,
                      },
                  }}
                  series={[
                      {
                          label: 'Common',
                          data: [rarityDataset['Common']],
                          color: rarityColors['Common'],
                      },
                      {
                          label: 'Uncommon',
                          data: [rarityDataset['Uncommon']],
                          color: rarityColors['Uncommon'],
                      },
                      {
                          label: 'Rare',
                          data: [rarityDataset['Rare']],
                          color: rarityColors['Rare'],
                      },
                      {
                          label: 'Epic',
                          data: [rarityDataset['Epic']],
                          color: rarityColors['Epic'],
                      },
                      {
                          label: 'Mythic',
                          data: [rarityDataset['Mythic']],
                          color: rarityColors['Mythic'],
                      },
                  ]}
                  xAxis={[{scaleType: 'band', data: ['Rarity']}]}
                  yAxis={[{scaleType: 'linear', label: 'Amount'}]}
        />
    );
};