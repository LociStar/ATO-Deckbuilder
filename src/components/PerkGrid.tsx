// src/components/PerkGrid.tsx

import {Box} from '@mui/material';
import {PerkNode} from './PerkNode.tsx';
import {PerkNodeProps} from '../types/types';
import {Signal, useSignal} from '@preact/signals';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {PerkNodeStack} from "./PerkNodeStack.tsx";

interface GridProps {
    data: PerkNodeProps[] | undefined;
    selectedPerksRecord: Signal<Record<string, Signal<boolean>>>;
    disabled: Signal<boolean>;
}

export default function PerkGrid({data, selectedPerksRecord, disabled}: GridProps) {
    const theme = useTheme();
    const matches = {
        xs: useMediaQuery(theme.breakpoints.only('xs')),
        sm: useMediaQuery(theme.breakpoints.only('sm')),
        md: useMediaQuery(theme.breakpoints.only('md')),
        lg: useMediaQuery(theme.breakpoints.only('lg')),
        xl: useMediaQuery(theme.breakpoints.only('xl')),
    };

    const cellSizeMap = {
        xs: 20,
        sm: 40,
        md: 50,
        lg: 60,
        xl: 70,
    };

    const cellGapMap = {
        xs: 2,
        sm: 5,
        md: 20,
        lg: 30,
        xl: 40,
    };

    let cellSize = 40; // default value
    let gapSize = 20; // default value

    if (matches.xs) {
        cellSize = cellSizeMap.xs;
        gapSize = cellGapMap.xs;
    } else if (matches.sm) {
        cellSize = cellSizeMap.sm;
        gapSize = cellGapMap.sm;
    } else if (matches.md) {
        cellSize = cellSizeMap.md;
        gapSize = cellGapMap.md;
    } else if (matches.lg) {
        cellSize = cellSizeMap.lg;
        gapSize = cellGapMap.lg;
    } else if (matches.xl) {
        cellSize = cellSizeMap.xl;
        gapSize = cellGapMap.xl;
    }

    const numColumns = 12;
    const numRows = 7;// Gap size in pixels
    const gridWidth = numColumns * cellSize + gapSize * (numColumns - 1);
    const gridHeight = numRows * cellSize + gapSize * (numRows - 1);

    const gridItems: (PerkNodeProps | null)[][] = Array.from({length: numRows}, () =>
        Array(numColumns).fill(null)
    );
    const lines: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];
    const usedPoints = useSignal<number>(0)


    data &&
    data
        .filter((node) => {
            const lastChar = node.id.slice(-1).toLowerCase();
            return !['a', 'b', 'c'].includes(lastChar);
        })
        .forEach((item) => {
            const rowIndex = item.row;
            const colIndex = item.column;
            gridItems[rowIndex][colIndex] = item;

            if (item.perkRequired) {
                const requiredPerk = data.find((perk) => perk.id === item.perkRequired);
                if (requiredPerk) {
                    const requiredRowIndex = requiredPerk.row;
                    const requiredColIndex = requiredPerk.column;
                    lines.push({
                        from: {
                            x: requiredColIndex * (cellSize + gapSize) + cellSize / 2,
                            y: requiredRowIndex * (cellSize + gapSize) + cellSize / 2,
                        },
                        to: {
                            x: colIndex * (cellSize + gapSize) + cellSize / 2,
                            y: rowIndex * (cellSize + gapSize) + cellSize / 2,
                        },
                    });
                }
            }
        });

    return (
        <div className="perk-grid-container">
            <Box
                sx={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${numColumns}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
                    gap: `${gapSize}px`,
                    width: gridWidth,
                    height: gridHeight,
                }}
            >
                {gridItems.flat().map((item, index) => (
                    <Box key={index} sx={{width: cellSize, height: cellSize}}>
                        {item && (item.perksConnected!.length === 0) ? (
                                <PerkNode
                                    data={item}
                                    isSelected={selectedPerksRecord.value[item.id] || useSignal(false)}
                                    cellSize={cellSize}
                                    sprite={item.sprite}
                                    spriteBase={item.cost === 'PerkCostBase' ? 'silver' : 'gold'}
                                    disabled={disabled}
                                    usedPoints={usedPoints}
                                    isPreviousSelected={index == 0 ? useSignal(true) : (selectedPerksRecord.value[item.perkRequired] || useSignal(true))}
                                />
                            ) :
                            item && <PerkNodeStack
                                dataBase={item}
                                dataCases={data?.filter((node) => node.id.startsWith(item.id)) || []}
                                optionsSignal={Object.fromEntries(
                                    Object.entries(selectedPerksRecord.value)
                                        .filter(([id]) => data?.some((node) => node.id.startsWith(item.id) && node.id === id))
                                ) as Record<string, Signal<boolean>>}
                                cellSize={cellSize}
                                sprite={item.sprite}
                                baseSprite={item.cost === 'PerkCostBase' ? 'silver' : 'gold'}
                                disabled={disabled}
                                usedPoints={usedPoints}
                                isPreviousSelected={index == 0 ? useSignal(true) : (selectedPerksRecord.value[item.perkRequired] || useSignal(true))}
                            />}
                    </Box>
                ))}
                <svg
                    className="perk-grid-lines"
                    width={gridWidth}
                    height={gridHeight}
                    style={{position: 'absolute', top: 0, left: 0}}
                >
                    {lines.map((line, index) => (
                        <line
                            key={index}
                            x1={line.from.x}
                            y1={line.from.y}
                            x2={line.to.x}
                            y2={line.to.y}
                            stroke="gold"
                            strokeWidth="2"
                        />
                    ))}
                </svg>
            </Box>
        </div>
    );
}
