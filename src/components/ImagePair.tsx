import {Box, ButtonBase, Popover, Stack, Tooltip} from "@mui/material";
import {useEffect, useState} from "preact/hooks";
import React, {TargetedEvent} from "react";
import {AppConfig} from "../config.ts";
import {Signal} from "@preact/signals";
import {PerkDetails} from "../types/types.tsx";
import Typography from "@mui/material/Typography";

interface ImagePairProps {
    src1?: string;
    src2?: string;
    empty?: boolean;
    id: string;
    initialGlowIds: string;
    specialCase?: string[];
    selected: Signal<boolean>;
    onSelectionChange: (id: string, selected: boolean) => void;
}

export function ImagePair({
                              src1 = "",
                              src2 = "",
                              empty = false,
                              id,
                              initialGlowIds,
                              specialCase = [],
                              selected,
                              onSelectionChange
                          }: ImagePairProps) {
    const size = {xs: 25, sm: 36, md: 52, lg: 70, xl: 80};
    const [popupState, setPopupState] = useState<{ open: boolean, anchorEl: HTMLElement | null }>({
        open: false, anchorEl: null
    });
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [initialGlowLock, setInitialGlowLock] = useState(true);
    const [perkDetails, setPerkDetails] = useState<PerkDetails>();
    const [perkDetailsSpecial, setPerkSpecial] = useState<PerkDetails[]>([]);

    useEffect(() => {
        if (initialGlowLock && initialGlowIds !== "") {
            if (specialCase.length !== 0) {
                const specialCaseId = specialCase.find(specialId => initialGlowIds.includes(specialId));
                if (specialCaseId) {
                    setSelectedVariant(specialCaseId);
                }
            }
            setInitialGlowLock(false);
        }
    }, [id, initialGlowIds, specialCase]);

    useEffect(() => {
        if (id.startsWith("mainperk")) {
            // fetch PerkDetails from API
            fetch(AppConfig.API_URL + `/perks/details/${id}`, {method: 'GET'})
                .then(response => response.json())
                .then(data => setPerkDetails(data));
        } else {
            // fetch PerkDetails from API for special case and add to state
            if (specialCase.length !== 0) {
                const promises = specialCase.map(specialId => fetch(AppConfig.API_URL + `/perks/details/${specialId}`, {method: 'GET'})
                    .then(response => response.json()));
                Promise.all(promises).then(data => setPerkSpecial(data));
            }
        }
    }, []);

    const handleClick = (event: TargetedEvent<HTMLButtonElement>, id: string) => {
        if (specialCase.length !== 0) {
            setPopupState({open: true, anchorEl: event.currentTarget});
        } else {
            selected.value = !selected.value;
            onSelectionChange(id, selected.value);
        }
    };

    const handleVariantSelect = (variantId: string) => {
        setSelectedVariant(prevVariant => {
            if (prevVariant) {
                onSelectionChange(prevVariant, false); // Remove old variant
            }
            const newSelected = prevVariant === variantId ? null : variantId;
            selected.value = newSelected !== null;
            if (newSelected) {
                onSelectionChange(newSelected, true); // Add new variant
            }
            return newSelected;
        });
        setPopupState({open: false, anchorEl: null});
    };


    return (<>
        <Tooltip
            arrow={true}
            sx={{fontSize: 30}}
            title={<React.Fragment>
                <Typography color="inherit">
                    {id.startsWith("mainperk") ? "Increases " + (id.split(/mainperk(\w+)/)[1].split(/\d+[a-zA-Z]?/)[0] + " " + perkDetails?.iconTextValue) : ""}
                </Typography>
            </React.Fragment>}
            disableHoverListener={empty || !id.startsWith("mainperk")}
            disableFocusListener={empty || !id.startsWith("mainperk")}
        >
                <span>
                    <ButtonBase
                        onClick={(event) => handleClick(event, id)}
                        disabled={empty}
                        sx={{
                            width: size,
                            height: size,
                            borderRadius: src2 === 'final' ? '0%' : '50%',
                            overflow: 'hidden',
                            boxShadow: selected.value || selectedVariant !== null ? '0 0 10px 5px gold' : 'none',
                            '&:hover': !empty && !(selected.value || selectedVariant !== null) ? {
                                boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)',
                            } : {}
                        }}
                    >
                        <Box position="relative"
                             sx={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}
                             display="flex">
                            {!empty && (<>
                                <img src={AppConfig.API_URL + '/perks/image/' + src1} alt="image1"
                                     style={{width: '60%', height: '60%', objectFit: 'cover', position: 'absolute'}}
                                     draggable={false} loading="lazy"/>
                                <img src={AppConfig.API_URL + '/perks/image/perk_base_' + src2} alt="image2"
                                     style={{width: '100%', height: '100%', objectFit: 'cover'}} draggable={false}
                                     loading="lazy"/>
                            </>)}
                        </Box>
                    </ButtonBase>
                </span>
        </Tooltip>

        <Popover
            open={popupState.open}
            anchorEl={popupState.anchorEl}
            onClose={() => setPopupState({open: false, anchorEl: null})}
            anchorOrigin={{
                vertical: 'bottom', horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top', horizontal: 'center',
            }}
        >
            <Stack direction="row">
                {specialCase.map((variant, index) => (
                    <Tooltip
                        arrow={true}
                        sx={{fontSize: 30}}
                        title={(specialCase) && <React.Fragment>
                            <Typography color="inherit">
                                {"Increases " + perkDetailsSpecial[index]?.icon + " " + perkDetailsSpecial[index]?.iconTextValue}
                            </Typography>
                        </React.Fragment>}
                    >
                        <Box p={2} display="flex" flexDirection="column" alignItems="center" key={index}>
                            <ButtonBase
                                onClick={() => handleVariantSelect(variant)}
                                disabled={empty}
                                sx={{
                                    width: size,
                                    height: size,
                                    borderRadius: src2 === 'final' ? '0%' : '50%',
                                    overflow: 'hidden',
                                    boxShadow: selectedVariant === variant ? '0 0 10px 5px gold' : 'none',
                                    '&:hover': !empty ? {
                                        boxShadow: '0 0 10px 5px rgba(255, 255, 255, 0.5)',
                                    } : {}
                                }}
                            >
                                <Box position="relative"
                                     sx={{
                                         width: size, height: size, alignItems: 'center', justifyContent: 'center'
                                     }}
                                     display="flex">
                                    {!empty && (<>
                                        <img src={AppConfig.API_URL + '/perks/image/' + perkDetailsSpecial[index]?.icon}
                                             alt="image1"
                                             style={{
                                                 width: '60%',
                                                 height: '60%',
                                                 objectFit: 'cover',
                                                 position: 'absolute'
                                             }}
                                             draggable={false}
                                             loading="lazy"/>
                                        <img src={AppConfig.API_URL + '/perks/image/perk_base_' + src2}
                                             alt="image2"
                                             style={{width: '100%', height: '100%', objectFit: 'cover'}}
                                             draggable={false}
                                             loading="lazy"/>
                                    </>)}
                                </Box>
                            </ButtonBase>
                        </Box>
                    </Tooltip>))}
            </Stack>
        </Popover>
    </>);
}