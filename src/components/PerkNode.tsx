// src/components/PerkNode.tsx

import {Box, ButtonBase, Tooltip} from "@mui/material";
import {Signal} from "@preact/signals";
import {AppConfig} from "../config";
import {PerkNodeProps} from "../types/types";
import PerkDescription from "./PerkDescription.tsx";

interface _PerkNodeProps {
    sprite: string,
    spriteBase: string,
    data: PerkNodeProps,
    isSelected: Signal<boolean>,
    isPreviousSelected: Signal<boolean>,
    cellSize?: number,
    disabled: Signal<boolean>,
    usedPoints: Signal<number>
}

export function PerkNode({
                             sprite = "",
                             spriteBase = "",
                             data,
                             isSelected,
                             isPreviousSelected,
                             cellSize = 0,
                             disabled,
                             usedPoints,
                         }: _PerkNodeProps) {
    const totalPoints = 50;
    const nodeCost = data.cost == "PerkCostBase" ? 1 : 3;

    const handleClick = (_: Event) => {
        isSelected.value = !isSelected.value;
        usedPoints.value = isSelected.value ? usedPoints.value + nodeCost : usedPoints.value - nodeCost;
    };

    const pointsNeededPerRow: { [key: number]: number } = {
        0: 0,
        1: 3,
        2: 6,
        3: 10,
        4: 16,
        5: 22,
        6: 30,
    };

// Implement getPointsNeeded based on the mapping
    const getPointsNeeded = (nodeRow: number): number => {
        return pointsNeededPerRow[nodeRow];
    };

    const isLocked = (usedPoints.value < getPointsNeeded(data.row));

    function requiredPerkSelected() {
        if (data.perkRequired === "") {
            return true;
        }
        return isPreviousSelected.value;
    }

    return (
        <>
            <Tooltip
                followCursor
                placement="top"
                sx={{fontSize: 30}}
                componentsProps={{
                    tooltip: {
                        sx: {
                            background: 'radial-gradient(ellipse, #453f30 0%, #453f30 30%, #2f2b21 100%)',
                            outline: '1px solid black',
                        },
                    },
                }}
                PopperProps={{
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, 40],
                            },
                        },
                    ],
                }}
                title={
                    <PerkDescription perkData={data}
                                     isLocked={isLocked || !requiredPerkSelected()}
                                     isDisabled={!disabled.value}
                                     isSelected={isSelected.value}
                                     nodeRequired={!isLocked && !requiredPerkSelected()}
                                     pointsNeeded={getPointsNeeded(data.row)}
                                     pointsAvailable={totalPoints - usedPoints.value}/>
                }
            >
                <Box>
                    <ButtonBase
                        onClick={handleClick}
                        sx={{
                            width: cellSize,
                            height: cellSize,
                            borderRadius: spriteBase === "final" ? "0%" : "50%",
                            overflow: "hidden",
                            boxShadow:
                                isSelected.value
                                    ? "0 0 10px 5px gold"
                                    : "none",
                            "&:hover":
                                !isSelected.value
                                    ? {
                                        boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
                                    }
                                    : {},
                        }}
                        disabled={!disabled.value || (((totalPoints - usedPoints.value) < nodeCost) && !isSelected.value) || isLocked || !requiredPerkSelected()}
                    >
                        <Box
                            position="relative"
                            sx={{width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center"}}
                            display="flex"
                        >
                            <>
                                <img
                                    src={AppConfig.API_URL + "/perks/image/" + sprite}
                                    alt="image1"
                                    style={{
                                        width: "60%",
                                        height: "60%",
                                        objectFit: "cover",
                                        position: "absolute",
                                    }}
                                    draggable={false}
                                    loading="lazy"
                                />
                                <img
                                    src={AppConfig.API_URL + "/perks/image/perk_base_" + spriteBase}
                                    alt="image2"
                                    style={{width: "100%", height: "100%", objectFit: "cover"}}
                                    draggable={false}
                                    loading="lazy"
                                />
                            </>
                        </Box>
                    </ButtonBase>
                </Box>
            </Tooltip>
        </>
    );
}
