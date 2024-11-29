// src/components/PerkNode.tsx

import {Box, ButtonBase, Stack, Tooltip} from "@mui/material";
import {Signal} from "@preact/signals";
import {AppConfig} from "../config";
import {PerkNodeProps} from "../types/types";
import {useState} from "preact/hooks";
import PerkDescription from "./PerkDescription.tsx";

interface PerkNodeStackProps {
    sprite?: string,
    baseSprite?: string,
    dataCases: PerkNodeProps[],
    dataBase: PerkNodeProps,
    cellSize?: number,
    optionsSignal: Record<string, Signal<boolean>>,
    disabled: Signal<boolean>,
    usedPoints: Signal<number>,
    isPreviousSelected: Signal<boolean>
}

export function PerkNodeStack({
                                  sprite = "",
                                  baseSprite = "",
                                  dataCases,
                                  dataBase,
                                  cellSize = 0,
                                  optionsSignal,
                                  disabled,
                                  usedPoints,
                                  isPreviousSelected
                              }: PerkNodeStackProps) {

    const [tooltipOpen, setTooltipOpen] = useState(false);

    const handleVariantSelect = (variantId: string) => {

        // If the selected variant is already true, set it to false and return
        if (optionsSignal[variantId].value) {
            optionsSignal[variantId].value = false;
            usedPoints.value -= 3;
            return;
        }

        // Set all values in optionsSignal to false
        Object.keys(optionsSignal).forEach((key) => {
            optionsSignal[key].value = false;
        });

        // Set the selected variant to true if it was false
        optionsSignal[variantId].value = !optionsSignal[variantId].value;
        usedPoints.value += 3;

        // Close the tooltip after selection
        setTooltipOpen(false);

    };

    function hasSelectedPerk(selectedPerksRecord: Record<string, Signal<boolean>>): boolean {
        return Object.values(selectedPerksRecord).some((value) => value.value);
    }

    const handleTooltipOpen = () => setTooltipOpen(true);
    const handleTooltipClose = () => setTooltipOpen(false);

    const getVariant = (variantId: string) => dataCases.find((perk) => perk.id === variantId)

    const totalPoints = 50;

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

    const isVariantLocked = (variantId: string) => (usedPoints.value < getPointsNeeded(getVariant(variantId)!.row));

    function requiredPerkVariantSelected(variantId: string) {
        if (getVariant(variantId)!.perkRequired === "") {
            return true;
        }
        return isPreviousSelected.value;
    }

    const isLocked = (usedPoints.value < getPointsNeeded(dataBase.row));

    function requiredPerkSelected() {
        if (dataBase.perkRequired === "") {
            return true;
        }
        return isPreviousSelected.value;
    }

    // function to check if one variant is selected
    function hasSelectedPerkVariant(): boolean {
        return Object.values(optionsSignal).some((value) => value.value);
    }

    const variantButtons = <Stack direction="row" gap={2} ml={1} mr={1} mt={2} mb={2}>
        {dataBase && dataBase.perksConnected.map((variant, index) => (<Tooltip
            key={index}
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
                modifiers: [{
                    name: "offset", options: {
                        offset: [0, 40],
                    },
                },],
            }}
            title={<PerkDescription perkData={getVariant(variant) || null}
                                    isLocked={isVariantLocked(variant) || !requiredPerkVariantSelected(variant)}
                                    isDisabled={!disabled.value}
                                    isSelected={optionsSignal[variant].value}
                                    nodeRequired={!isVariantLocked && !requiredPerkVariantSelected(variant)}
                                    pointsNeeded={getPointsNeeded(getVariant(variant)!.row)}
                                    pointsAvailable={totalPoints - usedPoints.value}/>}
        >
            <Box display="flex" flexDirection="column" alignItems="center">
                <ButtonBase
                    onClick={() => handleVariantSelect(variant)}
                    disabled={!disabled.value || (((totalPoints - usedPoints.value) < 3) && !hasSelectedPerkVariant()) || isLocked || !requiredPerkSelected()}
                    sx={{
                        width: cellSize,
                        height: cellSize,
                        borderRadius: baseSprite === "final" ? "0%" : "50%",
                        overflow: "hidden",
                        boxShadow: optionsSignal[variant]?.value ? "0 0 10px 5px gold" : "none",
                        "&:hover": {
                            boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
                        }
                    }}
                >
                    <Box
                        position="relative"
                        sx={{
                            width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center"
                        }}
                        display="flex"
                    >
                        <>
                            <img
                                src={AppConfig.API_URL + "/perks/image/" + dataCases.find((perk) => perk.id === variant)?.sprite}
                                alt="image1"
                                style={{
                                    width: "60%", height: "60%", objectFit: "cover", position: "absolute",
                                }}
                                draggable={false}
                                loading="lazy"
                            />
                            <img
                                src={AppConfig.API_URL + "/perks/image/perk_base_" + baseSprite}
                                alt="image2"
                                style={{width: "100%", height: "100%", objectFit: "cover"}}
                                draggable={false}
                                loading="lazy"
                            />
                        </>
                    </Box>
                </ButtonBase>
            </Box>
        </Tooltip>))}
    </Stack>

    return (<>
        <Tooltip
            key={dataBase.id}
            arrow
            title={variantButtons}
            open={tooltipOpen}
            onOpen={handleTooltipOpen}
            onClose={handleTooltipClose}
            componentsProps={{
                tooltip: {
                    sx: {
                        background: 'radial-gradient(ellipse, #453f30 0%, #453f30 30%, #2f2b21 100%)',
                        outline: '1px solid black',
                    },
                },
            }}>
            <Box>
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
                        <PerkDescription perkData={dataBase}
                                         isLocked={isLocked || !requiredPerkSelected()}
                                         isDisabled={!disabled.value}
                                         isSelected={hasSelectedPerkVariant()}
                                         nodeRequired={!isLocked && !requiredPerkSelected()}
                                         pointsNeeded={getPointsNeeded(dataBase.row)}
                                         pointsAvailable={totalPoints - usedPoints.value}/>
                    }
                >
            <Box
                sx={{
                    width: cellSize,
                    height: cellSize,
                    overflow: "hidden",
                    boxShadow: hasSelectedPerk(optionsSignal) ? "0 0 10px 5px gold" : "none",
                    "&:hover": {boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)"}
                }}
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
                                width: "60%", height: "60%", objectFit: "cover", position: "absolute",
                            }}
                            draggable={false}
                            loading="lazy"
                        />
                        <img
                            src={AppConfig.API_URL + "/perks/image/perk_base_final"}
                            alt="image2"
                            style={{width: "100%", height: "100%", objectFit: "cover"}}
                            draggable={false}
                            loading="lazy"
                        />
                    </>
                </Box>
            </Box>
                </Tooltip>
            </Box>
        </Tooltip>
    </>);
}
