// src/components/PerkNode.tsx

import {Box, ButtonBase, Popover, Stack, Tooltip} from "@mui/material";
import {Signal, useSignal} from "@preact/signals";
import {AppConfig} from "../config";
import {PerkNodeProps} from "../types/types";
import Typography from "@mui/material/Typography";

interface PerkNodeStackProps {
    sprite?: string,
    baseSprite?: string,
    dataCases: PerkNodeProps[],
    dataBase: PerkNodeProps,
    cellSize?: number,
    optionsSignal: Record<string, Signal<boolean>>,
    disabled: Signal<boolean>;
}

export function PerkNodeStack({
                                  sprite = "",
                                  baseSprite = "",
                                  dataCases,
                                  dataBase,
                                  cellSize = 0,
                                  optionsSignal,
                                  disabled
                              }: PerkNodeStackProps) {
    const popupState = useSignal<{ open: boolean; anchorEl: HTMLElement | null }>({open: false, anchorEl: null});

    const handleClick = (event: Event) => {
        popupState.value = {open: true, anchorEl: event.currentTarget as HTMLElement};
    };

    const handleVariantSelect = (variantId: string) => {
        // Set all values in optionsSignal to false
        Object.keys(optionsSignal).forEach((key) => {
            optionsSignal[key].value = false;
        });

        // Set the selected variant to true
        optionsSignal[variantId].value = true;

        // Close the popover
        popupState.value = {open: false, anchorEl: null};
    };

    function hasSelectedPerk(selectedPerksRecord: Record<string, Signal<boolean>>): boolean {
        return Object.values(selectedPerksRecord).some((value) => value.value);
    }

    return (
        <>
            <ButtonBase
                onClick={handleClick}
                sx={{
                    width: cellSize,
                    height: cellSize,
                    overflow: "hidden",
                    boxShadow: hasSelectedPerk(optionsSignal) ? "0 0 10px 5px gold" : "none",
                    "&:hover":

                        {
                            boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.5)",
                        }

                }}
            >
                <Box
                    position="relative"
                    sx={{width: cellSize, height: cellSize, alignItems: "center", justifyContent: "center"}}
                    display="flex"
                >
                    (
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
                    )
                </Box>
            </ButtonBase>

            <Popover
                open={popupState.value.open}
                anchorEl={popupState.value.anchorEl}
                onClose={() => (popupState.value = {open: false, anchorEl: null})}
                anchorOrigin={{
                    vertical: "bottom", horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top", horizontal: "center",
                }}
            >
                <Stack direction="row">
                    {dataBase && dataBase.perksConnected.map((variant, index) => (<Tooltip
                        key={index}
                        arrow
                        sx={{fontSize: 30}}
                        title={<Typography color="inherit">
                            {dataCases.find((perk) => perk.id === variant)?.perk}
                        </Typography>}
                    >
                        <Box p={2} display="flex" flexDirection="column" alignItems="center">
                            <ButtonBase
                                onClick={() => handleVariantSelect(variant)}
                                disabled={!disabled.value}
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
                                        width: cellSize,
                                        height: cellSize,
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    display="flex"
                                >
                                    (
                                    <>
                                        <img
                                            src={AppConfig.API_URL + "/perks/image/" + dataCases.find((perk) => perk.id === variant)?.sprite}
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
                                            src={AppConfig.API_URL + "/perks/image/perk_base_" + baseSprite}
                                            alt="image2"
                                            style={{width: "100%", height: "100%", objectFit: "cover"}}
                                            draggable={false}
                                            loading="lazy"
                                        />
                                    </>
                                    )
                                </Box>
                            </ButtonBase>
                        </Box>
                    </Tooltip>))}
                </Stack>
            </Popover>
        </>);
}
