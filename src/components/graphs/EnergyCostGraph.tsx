import {BarChart} from '@mui/x-charts/BarChart';
import Typography from "@mui/material/Typography";
import {useEffect, useState} from "preact/hooks";
import {Card} from "../../types/types.tsx";

type EnergyCostGraphProps = {
    cardList: Card[];
};

export const EnergyCostGraph: React.FC<EnergyCostGraphProps> = ({cardList}) => {
    const [energyCostDataset, setEnergyCostDataset] = useState<{ energy: string, amount: number }[]>([{
        energy: '1',
        amount: 0
    }, {energy: '2', amount: 0}, {energy: '3', amount: 0}, {energy: '4', amount: 0}, {energy: '5+', amount: 0}]);
    const [averageEnergyCost, setAverageEnergyCost] = useState<number>(0);

    useEffect(() => {
        let totalEnergyCost = 0;
        const costs = cardList.reduce((acc: number[], card: Card) => {
            if (card.energyCost >= 1 && card.energyCost <= 5) {
                acc[card.energyCost - 1]++;
            } else if (card.energyCost > 5) {
                acc[4]++;
            }
            totalEnergyCost += card.energyCost;
            return acc;
        }, [0, 0, 0, 0, 0]);

        const averageCost = totalEnergyCost / cardList.length;

        const newEnergyCostDataset = costs.map((cost: number, index: number) => ({
            energy: (index + 1).toString(),
            amount: cost,
        }));

        setEnergyCostDataset(newEnergyCostDataset);
        setAverageEnergyCost(averageCost);
    }, [cardList]);
    return (
        <>
            <Typography variant="h5">
                Average energy cost: {averageEnergyCost}
            </Typography>
            <BarChart height={300}
                      dataset={energyCostDataset}
                      series={[
                          {
                              label: 'Count',
                              dataKey: 'amount',
                              color: '#cc8b00',
                          },
                      ]}
                      xAxis={[{scaleType: 'band', dataKey: 'energy', label: 'Energy'}]}
            />
        </>
    );
};