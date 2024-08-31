// src/screens/PerksDetailsView.tsx
import {Box, Button, Dialog, Input, Stack, Tab, Tabs, TextField, Typography} from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {alpha} from "@mui/material/styles";
import {AppConfig} from "../config.ts";
import {Perks} from "../types/types.tsx";
import {useEffect, useState} from "preact/hooks";
import pako from "pako";
import {TargetedEvent} from "react";
import {Signal, useSignal} from "@preact/signals";
import {CustomTabPanel} from "../components/CustomTabPanel";
import {PerkColumn} from "../components/PerkColumn.tsx";
import perkLevelsData from "../assets/perkLevels.json";
import {enqueueSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";

export default function PerksDetailsView() {
    const perkId = window.location.pathname.split("/").pop();
    const defaultPerk = {id: 0, title: "", data: ""};
    const [perks, setPerks] = useState<Perks>(defaultPerk);
    const perksList: Signal<string[]> = useSignal([]);
    const [value, setValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [buildMode, setBuildMode] = useState(false);
    const [openShareDialog, setOpenShareDialog] = useState(false);
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [importValue, setImportValue] = useState("");
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (perkId == "-") {
            setBuildMode(true);
            return;
        }
        // if perkId is not a number
        if (isNaN(Number(perkId))) {
            const encodedData = decodeURIComponent(perkId!);
            defaultPerk.data = decompressString(encodedData);
            setPerks(defaultPerk);
            initializeSelectedPerks(defaultPerk.data.split("_")[1].split('-'));
            setBuildMode(true);
            return;
        }
        fetch(AppConfig.API_URL + `/perks/${perkId}`)
            .then(response => response.json())
            .then((data: Perks) => {
                console.log(data.data)
                data.data = decompressString(data.data);
                console.log(data.data)
                setPerks(data);
                perksList.value = data.data.split("_")[1].split('-');
                initializeSelectedPerks(perksList.value);
            });
    }, []);

    function decompressString(compressedText: string): string {
        let buffer = Uint8Array.from(atob(compressedText), c => c.charCodeAt(0));
        //let dataLength = new DataView(buffer.buffer).getInt32(0, true);
        let compressedData = buffer.slice(4);
        let decompressedData = pako.ungzip(compressedData);
        return new TextDecoder("utf-8").decode(decompressedData);
    }

    function compressStringList(stringList: string[]): string {
        let combinedString = stringList.join('-');
        const countSpecialCase = stringList.filter(s => s.includes('0a' || "0b" || "0c" || '1a' || "1b" || "1c" || "1d" || '2a' || "2b" || "2c" || "2d")).length;
        combinedString = (stringList.length + countSpecialCase * 2) + '_' + combinedString;
        const encodedData = new TextEncoder().encode(combinedString);
        const compressedData = pako.gzip(encodedData);
        const result = new Uint8Array(4 + compressedData.length);
        new DataView(result.buffer).setInt32(0, encodedData.length, true);
        result.set(compressedData, 4);
        // @ts-ignore
        return btoa(String.fromCharCode(...result)); // base64String
    }

    const handleInput = (_ignored: TargetedEvent, newValue: number) => {
        setValue(newValue);
    };

    const page1PerkLevels = [
        perkLevelsData.page_1_level_1, perkLevelsData.page_1_level_2, perkLevelsData.page_1_level_3, perkLevelsData.page_1_level_4,
        perkLevelsData.page_1_level_5, perkLevelsData.page_1_level_6, perkLevelsData.page_1_level_7
    ];

    const page2PerkLevels = [
        perkLevelsData.page_2_level_1, perkLevelsData.page_2_level_2, perkLevelsData.page_2_level_3, perkLevelsData.page_2_level_4,
        perkLevelsData.page_2_level_5, perkLevelsData.page_2_level_6, perkLevelsData.page_2_level_7
    ];

    const page3PerkLevels = [
        perkLevelsData.page_3_level_1, perkLevelsData.page_3_level_2, perkLevelsData.page_3_level_3, perkLevelsData.page_3_level_4,
        perkLevelsData.page_3_level_5, perkLevelsData.page_3_level_6, perkLevelsData.page_3_level_7
    ];

    const page4PerkLevels = [
        perkLevelsData.page_4_level_1, perkLevelsData.page_4_level_2, perkLevelsData.page_4_level_3, perkLevelsData.page_4_level_4,
        perkLevelsData.page_4_level_5, perkLevelsData.page_4_level_6, perkLevelsData.page_4_level_7
    ];

    const allPerkLevels = [...page1PerkLevels, ...page2PerkLevels, ...page3PerkLevels, ...page4PerkLevels];

    const selectedPerksSignals = allPerkLevels.flat().reduce((acc, pair) => {
        acc[pair.id] = useSignal(false);
        return acc;
    }, {} as Record<string, Signal<boolean>>);

    const initializeSelectedPerks = (initialIds: string[]) => {
        initialIds.forEach(id => {
            if (selectedPerksSignals[id]) {
                selectedPerksSignals[id].value = true;
            }
        });
    };

    const handleSelectionChange = (id: string, selected: boolean) => {
        perksList.value = selected
            ? [...perksList.value, id]
            : perksList.value.filter(buttonId => buttonId !== id);
    };

    function flipPerkLevels(perkLevels: any[][]): any[][] {
        const flipped = [];
        const maxLength = Math.max(...perkLevels.map(level => level.length));
        for (let i = 0; i < maxLength; i++) {
            const column = [];
            for (let j = 0; j < perkLevels.length; j++) {
                if (perkLevels[j][i]) {
                    column.push(perkLevels[j][i]);
                }
            }
            flipped.push(column);
        }
        return flipped;
    }

    const flippedPage1PerkLevels = flipPerkLevels(page1PerkLevels);
    const flippedPage2PerkLevels = flipPerkLevels(page2PerkLevels);
    const flippedPage3PerkLevels = flipPerkLevels(page3PerkLevels);
    const flippedPage4PerkLevels = flipPerkLevels(page4PerkLevels);

    const copyToClipboard = (textToCopy: string, message: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            enqueueSnackbar(message, {variant: "success"});
            setOpenDialog(false);
            setOpenShareDialog(false);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    function onImportClicked() {
        if (importValue === "") {
            setOpenImportDialog(false);
            return;
        }

        try {
            const decodedValue = decompressString(importValue);
            defaultPerk.data = decodedValue;
            setPerks(defaultPerk)
            const importedPerks = decodedValue.split("_")[1].split('-');
            initializeSelectedPerks(importedPerks);
            perksList.value = importedPerks;
            setOpenImportDialog(false);
            enqueueSnackbar('Imported successfully', {variant: "success"})
        } catch (ignored) {
            enqueueSnackbar('Invalid import code', {variant: "error"});
        }
    }

    async function onSaveClicked() {

        if (!auth.user) {
            enqueueSnackbar('You need to be logged in to save perks!', {variant: 'error'});
            return;
        }

        if (title === "") {
            enqueueSnackbar('Please enter a title for your perks!', {variant: "error"});
            return;
        }

        const perks_body = {
            title: title,
            perks: compressStringList(perksList.value)
        }

        try {
            await fetch(AppConfig.API_URL + '/perks/upload', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(perks_body)
            }).then(response => {
                return response.json();
            }).then(data => {
                enqueueSnackbar('Deck saved successfully', {variant: "success"})
                navigate('/perks/' + data.id);
            });
        } catch (error) {
            enqueueSnackbar('Failed to save deck. Please contact the admin if the error persists.', {variant: "error"});
            console.log(error);
        }
    }

    return (
        <Stack marginBottom={5} marginX={{md: 5, xs: 0}}>
            <Stack display="flex" justifyContent="space-between" alignItems="center" marginBottom={3}>
                <Typography variant="h2" color='black'
                            style={{textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white'}}>
                    {perks?.title}
                </Typography>
                <Typography variant="h5" color='black'></Typography>
                <Stack direction={{xs: 'column', sm: 'column', md: 'row'}} marginTop={3} display="flex"
                       alignItems="center" spacing={1}></Stack>
            </Stack>
            <Stack direction={{xs: 'column', sm: 'column', md: 'column'}} marginTop={3} display="flex"
                   spacing={2}
                   alignSelf="center" width="fit-content"
                   sx={{
                       backdropFilter: 'blur(50px)',
                       backgroundColor: alpha('#000000', 0.5),
                       borderRadius: {xs: 0, sm: 2, md: 2},
                       padding: {xs: 1, md: 2},
                       width: {xs: "auto"}
                   }}>
                {buildMode && <TextField
                    sx={{fontStyle: {color: 'white'}}}
                    color="warning"
                    label="Title"
                    value={title}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setTitle(target.value);
                    }}
                />}
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <Tabs value={value} textColor="inherit" onChange={handleInput} aria-label="perk page tabs">
                        <Tab label="General" sx={{color: "white"}}/>
                        <Tab label="Physical" sx={{color: "white"}}/>
                        <Tab label="Elemental" sx={{color: "white"}}/>
                        <Tab label="Mystical" sx={{color: "white"}}/>
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Stack direction="row" spacing={{xs: 1, sm: 1, md: 2}}>
                        {flippedPage1PerkLevels.map((column, colIndex) => (
                            <PerkColumn
                                key={colIndex}
                                level={column}
                                initialGlowIds={perks!.data}
                                selectedPerksSignals={selectedPerksSignals}
                                onSelectionChange={handleSelectionChange}
                            />
                        ))}
                    </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Stack direction="row" spacing={{xs: 1, sm: 1, md: 2}}>
                        {flippedPage2PerkLevels.map((column, colIndex) => (
                            <PerkColumn
                                key={colIndex}
                                level={column}
                                initialGlowIds={perks!.data}
                                selectedPerksSignals={selectedPerksSignals}
                                onSelectionChange={handleSelectionChange}
                            />
                        ))}
                    </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                    <Stack direction="row" spacing={{xs: 1, sm: 1, md: 2}}>
                        {flippedPage3PerkLevels.map((column, colIndex) => (
                            <PerkColumn
                                key={colIndex}
                                level={column}
                                initialGlowIds={perks!.data}
                                selectedPerksSignals={selectedPerksSignals}
                                onSelectionChange={handleSelectionChange}
                            />
                        ))}
                    </Stack>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={3}>
                    <Stack direction="row" spacing={{xs: 1, sm: 1, md: 2}}>
                        {flippedPage4PerkLevels.map((column, colIndex) => (
                            <PerkColumn
                                key={colIndex}
                                level={column}
                                initialGlowIds={perks!.data}
                                selectedPerksSignals={selectedPerksSignals}
                                onSelectionChange={handleSelectionChange}
                            />
                        ))}
                    </Stack>
                </CustomTabPanel>
                <Stack direction="row" justifyContent="space-evenly">
                    <Button
                        onClick={() => {
                            setOpenDialog(true);
                        }} variant="contained">
                        <Typography variant="h3" color="gold">Export</Typography>
                    </Button>
                    {buildMode && <>
                        <Button
                            onClick={() => {
                                setOpenImportDialog(true);
                            }} variant="contained">
                            <Typography variant="h3" color="gold">Import</Typography>
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenShareDialog(true);
                            }} variant="contained">
                            <Typography variant="h3" color="gold">Share</Typography>
                        </Button>
                        <Button
                            onClick={onSaveClicked} variant="contained">
                            <Typography variant="h3" color="gold">Save</Typography>
                        </Button>
                    </>}
                </Stack>

            </Stack>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                    <Typography variant="h3">Share Code for this perk configuration</Typography>
                    <br/>
                    <Typography variant="body1" sx={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                    }}>{compressStringList(perksList.value)}</Typography>
                    <Button variant="contained"
                            onClick={() => copyToClipboard(compressStringList(perksList.value), "Share Code for this perk configuration")}
                            startIcon={<ContentCopyIcon/>} sx={{mt: 2}}>
                        Copy
                    </Button>
                </Box>
            </Dialog>
            <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)}>
                <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                    <Typography variant="h3">Share this link with your friends! (no permanent save)</Typography>
                    <br/>
                    <Typography variant="body1" sx={{
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                    }}>{window.location.href.replace("-", "")}{compressStringList(perksList.value)}</Typography>
                    <Button variant="contained"
                            onClick={() => copyToClipboard(window.location.href.replace("-", "") + encodeURIComponent(compressStringList(perksList.value)), "Share this link with your friends!")}
                            startIcon={<ContentCopyIcon/>} sx={{mt: 2}}>
                        Copy
                    </Button>
                </Box>
            </Dialog>
            <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)}>
                <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                    <Typography variant="h3">Input Your Perk Code</Typography>
                    <br/>
                    <Input value={importValue} onChange={(event) => {
                        const target = event.target as HTMLInputElement;
                        setImportValue(target.value)
                    }}/>
                    <Button variant="contained" onClick={onImportClicked} sx={{mt: 2}}>
                        Import
                    </Button>
                </Box>
            </Dialog>
        </Stack>
    );
}