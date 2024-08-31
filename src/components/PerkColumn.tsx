import {Box, Stack} from "@mui/material";
import {ImagePair} from "./ImagePair";
import {Signal} from "@preact/signals";

interface PerkColumnProps {
    level: { id: string, src1?: string, src2?: string, empty?: boolean, specialCase?: string[] }[];
    initialGlowIds: string;
    selectedPerksSignals: Record<string, Signal<boolean>>;
    onSelectionChange: (id: string, selected: boolean) => void;
}

export function PerkColumn({level, initialGlowIds, selectedPerksSignals, onSelectionChange}: PerkColumnProps) {
    // Find the indices of the first and last non-empty ImagePair
    const firstNonEmptyIndex = level.findIndex(pair => !pair.empty);
    const lastNonEmptyIndex = level.length - 1 - [...level].reverse().findIndex(pair => !pair.empty);
    const size = {xs: 35, sm: 46, md: 72, lg: 100, xl: 110};

    return (
        <Stack alignItems="center" flexWrap="nowrap" direction="column" spacing={{xs:1, md:3, lg:4}} position="relative">
            {level.map((pair) => (
                <ImagePair
                    src1={pair.src1}
                    src2={pair.src2}
                    empty={pair.empty}
                    key={pair.id}
                    id={pair.id}
                    initialGlowIds={initialGlowIds}
                    specialCase={pair.specialCase}
                    selected={selectedPerksSignals[pair.id]}
                    onSelectionChange={onSelectionChange}
                />
            ))}
            {firstNonEmptyIndex !== -1 && lastNonEmptyIndex !== -1 && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: {
                            xs: `calc(${firstNonEmptyIndex} * ${size.xs}px)`,
                            sm: `calc(${firstNonEmptyIndex} * ${size.sm}px)`,
                            md: `calc(${firstNonEmptyIndex} * ${size.md}px)`,
                            lg: `calc(${firstNonEmptyIndex} * ${size.lg}px)`,
                            xl: `calc(${firstNonEmptyIndex} * ${size.xl}px)`
                        },
                        height: {
                            xs: `calc((${lastNonEmptyIndex - firstNonEmptyIndex}) * ${size.xs}px)`,
                            sm: `calc((${lastNonEmptyIndex - firstNonEmptyIndex}) * ${size.sm}px)`,
                            md: `calc((${lastNonEmptyIndex - firstNonEmptyIndex}) * ${size.md}px)`,
                            lg: `calc((${lastNonEmptyIndex - firstNonEmptyIndex}) * ${size.lg}px)`,
                            xl: `calc((${lastNonEmptyIndex - firstNonEmptyIndex}) * ${size.xl}px)`
                        },
                        width: {xs: "2px", sm: "4px", md: "5px"},
                        zIndex: -1,
                        backgroundColor: "rgba(255, 215, 0, 0.5)",
                        pointerEvents: 'none'
                    }}
                />
            )}
        </Stack>
    );
}