// src/components/PerkNode.tsx

import {Box, ButtonBase, Tooltip} from "@mui/material";
import {useEffect} from "preact/hooks";
import {Signal, useSignal} from "@preact/signals";
import {AppConfig} from "../config";
import {PerkNodeProps} from "../types/types";
import Typography from "@mui/material/Typography";

interface _PerkNodeProps {
    sprite: string;
    spriteBase: string;
    data: PerkNodeProps;
    isSelected: Signal<boolean>;
    cellSize?: number;
    disabled: Signal<boolean>;
}

export function PerkNode({
                             sprite = "",
                             spriteBase = "",
                             data,
                             isSelected,
                             cellSize = 0,
                             disabled
                         }: _PerkNodeProps) {
    const isSpecial = useSignal<boolean>(false);

    useEffect(() => {
        if (!data.perk) {
            isSpecial.value = true;
        }
    }, []);

    const handleClick = (_: Event) => {
        isSelected.value = !isSelected.value;
    };

    return (
        <>
            <Tooltip
                arrow
                sx={{fontSize: 30}}
                title={
                    <Typography color="inherit">
                        {data.perk}
                    </Typography>
                }
                PopperProps={{
                    modifiers: [
                        {
                            name: "offset",
                            options: {
                                offset: [0, cellSize / 4],
                            },
                        },
                    ],
                }}
            >
                <span>
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
                        disabled={!disabled.value}
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
                            )
                        </Box>
                    </ButtonBase>
                </span>
            </Tooltip>
        </>
    );
}
