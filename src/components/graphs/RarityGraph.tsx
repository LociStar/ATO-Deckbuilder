import {BarChart} from '@mui/x-charts/BarChart';
import {Card} from "../../types/types.tsx";
import {useEffect, useState} from "preact/hooks";
import {C} from "../directionC/tokens.ts";

type RarityGraphProps = {
    cardList: Card[];
    height?: number;
};

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Mythic'] as const;
type Rarity = typeof RARITIES[number];

const rarityColors: Record<Rarity, string> = {
    Common: '#b8bdc7',
    Uncommon: '#5ec07e',
    Rare: '#4aa8e8',
    Epic: '#b985e4',
    Mythic: '#e8a04a',
};

export const RarityGraph: React.FC<RarityGraphProps> = ({cardList, height = 220}) => {
    const [counts, setCounts] = useState<Record<Rarity, number>>({
        Common: 0, Uncommon: 0, Rare: 0, Epic: 0, Mythic: 0,
    });

    useEffect(() => {
        const next: Record<Rarity, number> = {Common: 0, Uncommon: 0, Rare: 0, Epic: 0, Mythic: 0};
        cardList.forEach((c) => {
            next[c.rarity] = (next[c.rarity] ?? 0) + 1;
        });
        setCounts(next);
    }, [cardList]);

    return (
        <BarChart
            height={height}
            margin={{top: 10, right: 10, bottom: 50, left: 36}}
            series={RARITIES.map((r) => ({
                label: r,
                data: [counts[r]],
                color: rarityColors[r],
            }))}
            xAxis={[{scaleType: 'band', data: ['Rarity']}]}
            yAxis={[{tickMinStep: 1}]}
            sx={{
                color: C.inkDim,
                '& text': {fill: C.inkDim},
                '& .MuiChartsAxis-tickLabel text, & .MuiChartsAxis-tickLabel': {fill: `${C.inkDim} !important`, fontFamily: C.mono, fontSize: 10},
                '& .MuiChartsAxis-label text, & .MuiChartsAxis-label': {fill: `${C.inkSoft} !important`, fontFamily: C.display, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase'},
                '& .MuiChartsAxis-line': {stroke: C.ink},
                '& .MuiChartsAxis-tick': {stroke: C.ink},
                '& .MuiChartsGrid-line': {stroke: C.inkMute, opacity: 0.2},
                '& .MuiBarElement-root': {stroke: C.ink, strokeWidth: 1.5},
            }}
            slotProps={{
                legend: {
                    direction: 'row',
                    position: {vertical: 'bottom', horizontal: 'middle'},
                    itemMarkHeight: 5,
                    labelStyle: {fontFamily: C.mono, fontSize: 10, fill: C.inkDim},
                },
            }}
        />
    );
};
