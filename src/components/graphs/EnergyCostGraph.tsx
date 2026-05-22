import {BarChart} from '@mui/x-charts/BarChart';
import {useEffect, useState} from "preact/hooks";
import {Card} from "../../types/types.tsx";
import {C} from "../directionC/tokens.ts";

type EnergyCostGraphProps = {
    cardList: Card[];
    height?: number;
};

export const EnergyCostGraph: React.FC<EnergyCostGraphProps> = ({cardList, height = 220}) => {
    const [energyCostDataset, setEnergyCostDataset] = useState<{energy: string; amount: number}[]>([
        {energy: '0', amount: 0}, {energy: '1', amount: 0}, {energy: '2', amount: 0},
        {energy: '3', amount: 0}, {energy: '4', amount: 0}, {energy: '5+', amount: 0},
    ]);

    useEffect(() => {
        const costs = cardList.reduce((acc: number[], card: Card) => {
            if (card.energyCost === 0) acc[0]++;
            else if (card.energyCost >= 1 && card.energyCost <= 4) acc[card.energyCost]++;
            else if (card.energyCost >= 5) acc[5]++;
            return acc;
        }, [0, 0, 0, 0, 0, 0]);

        setEnergyCostDataset(costs.map((amount, i) => ({
            energy: i === 5 ? '5+' : String(i),
            amount,
        })));
    }, [cardList]);

    return (
        <BarChart
            height={height}
            dataset={energyCostDataset}
            margin={{top: 10, right: 10, bottom: 50, left: 36}}
            series={[{label: 'Count', dataKey: 'amount', color: C.amber}]}
            xAxis={[{scaleType: 'band', dataKey: 'energy', label: 'Energy'}]}
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
            slotProps={{legend: {hidden: true}}}
        />
    );
};
