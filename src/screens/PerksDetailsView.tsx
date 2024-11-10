// src/screens/PerksDetailsView.tsx
import {Box, Button, Dialog, Input, Stack, Tab, Tabs, TextField, Typography, useMediaQuery} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {AppConfig} from "../config.ts";
import {PerkNodeProps, UserPerk} from "../types/types.tsx";
import {useEffect, useState} from "preact/hooks";
import {Signal, useSignal} from "@preact/signals";
import {useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import PerkGrid from "../components/PerkGrid.tsx";
import {TargetedEvent} from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {enqueueSnackbar} from "notistack";
import pako from "pako";

export default function PerksDetailsView() {
    const perkId = window.location.pathname.split("/").pop();
    const [userPerks, setUserPerks] = useState<UserPerk>();
    const [perkNodes, setPerkNodes] = useState<PerkNodeProps[]>();
    const [openDialog, setOpenDialog] = useState(false);
    const isBuildMode = useSignal<boolean>(false);
    const [openImportDialog, setOpenImportDialog] = useState(false);
    const [importValue, setImportValue] = useState("");
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const auth = useAuth();
    const isMobile = useMediaQuery('(max-width:600px)');
    const selectedPerksRecord = useSignal<Record<string, Signal<boolean>>>({});
    const tabIndex = useSignal<number>(0);


    useEffect(() => {
        fetch(AppConfig.API_URL + `/perks/main/all`)
            .then(response => response.json())
            .then((data) => {
                setPerkNodes(data);
                // Initialize selectedPerksRecord by creating a new object with Signals
                const newSelectedPerksRecord: Record<string, Signal<boolean>> = {};
                for (const perk of data) {
                    newSelectedPerksRecord[perk.id] = new Signal(false); // Direct instantiation of Signal
                }

                // Assign the initialized record to selectedPerksRecord.value
                selectedPerksRecord.value = newSelectedPerksRecord;
            });
    }, []);

    useEffect(() => {
        if (perkNodes?.length === 0) return;
        if (perkId == "-") {
            isBuildMode.value = true;
            setUserPerks({id: 0, title: "", data: ""});
        } else {
            fetch(AppConfig.API_URL + `/perks/${perkId}`)
                .then(response => response.json())
                .then((data) => {
                    setUserPerks(data);
                    processDecodedData(decompressString(data.data));
                });
        }
    }, [window.location.pathname, perkNodes]);

    function getSelectedPerksCompressed(): string {
        const stringList = Object.entries(selectedPerksRecord.value)
            .filter(([_, signal]) => signal.value) // Only keep entries with `true` values
            .map(([key]) => key)
            .map((key) => perkNodes?.find((perkNode) => perkNode.id == key)!.perk); // Extract the keys
        let combinedString = stringList.join('-');
        const countSpecialCase = stringList.filter(s => s!.includes('0a' || "0b" || "0c" || '1a' || "1b" || "1c" || "1d" || '2a' || "2b" || "2c" || "2d")).length;
        combinedString = (stringList.length + countSpecialCase * 2) + '_' + combinedString;
        const encodedData = new TextEncoder().encode(combinedString);
        const compressedData = pako.gzip(encodedData);
        const result = new Uint8Array(4 + compressedData.length);
        new DataView(result.buffer).setInt32(0, encodedData.length, true);
        result.set(compressedData, 4);
        // @ts-ignore
        return btoa(String.fromCharCode(...result)); // base64String
    }

    const handleTabSelection = (_ignored: TargetedEvent, newValue: number) => {
        tabIndex.value = newValue;
    };

    const copyToClipboard = (textToCopy: string, message: string) => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            enqueueSnackbar(message, {variant: "success"});
            setOpenDialog(false);
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
            processDecodedData(decodedValue);
            setOpenImportDialog(false);
            enqueueSnackbar('Imported successfully', {variant: "success"})
        } catch (ignored) {
            enqueueSnackbar('Invalid import code', {variant: "error"});
        }
    }

    function decompressString(compressedText: string): string {
        let buffer = Uint8Array.from(atob(compressedText), c => c.charCodeAt(0));
        //let dataLength = new DataView(buffer.buffer).getInt32(0, true);
        let compressedData = buffer.slice(4);
        let decompressedData = pako.ungzip(compressedData);
        return new TextDecoder("utf-8").decode(decompressedData);
    }

    function processDecodedData(decodedData: string) {
        const importPerkList = decodedData.split("_")[1].split('-')
        importPerkList
            .map((perk) => {
                const perkNode = perkNodes?.find((node) => node.perk === perk);
                if (perkNode) {
                    selectedPerksRecord.value[perkNode.id].value = true;
                }
            })
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
            perks: getSelectedPerksCompressed()
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
                    {isBuildMode.value ? "Perk Builder" : userPerks?.title}
                </Typography>
                <Typography variant="h5" color='black'></Typography>
            </Stack>
            <Stack direction={{xs: 'column', sm: 'column', md: 'column'}} display="flex"
                   spacing={2}
                   alignSelf="center" width="fit-content"
                   sx={{
                       backdropFilter: 'blur(50px)',
                       backgroundColor: alpha('#000000', 0.5),
                       borderRadius: {xs: 0, sm: 2, md: 2},
                       padding: {xs: 1, md: 2},
                       width: {xs: "auto"}
                   }}>
                {isBuildMode.value && <TextField
                    sx={{fontStyle: {color: 'white'}}}
                    color="warning"
                    label="Title"
                    value={title}
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setTitle(target.value);
                    }}
                />}
                <Box sx={{borderBottom: 1, borderColor: 'divider'}} width={{xs: 300, sm: "100%"}}>
                    <Tabs orientation={isMobile ? "vertical" : "horizontal"} value={tabIndex.value}
                          onChange={handleTabSelection} textColor="inherit"
                          aria-label="perk page tabs">
                        <Tab label="General" sx={{color: "white"}}/>
                        <Tab label="Physical" sx={{color: "white"}}/>
                        <Tab label="Elemental" sx={{color: "white"}}/>
                        <Tab label="Mystical" sx={{color: "white"}}/>
                    </Tabs>
                </Box>
                <PerkGrid
                    selectedPerksRecord={selectedPerksRecord}
                    data={perkNodes?.filter((node) => node.type == tabIndex.value)}
                    disabled={isBuildMode}/>
                <Stack direction="row" justifyContent="space-evenly">
                    <Button
                        onClick={() => {
                            setOpenDialog(true);
                        }} variant="contained">
                        <Typography variant="h3"
                                    color="gold">{isBuildMode.value ? "Share/ Export" : "Share"}</Typography>
                    </Button>
                    {isBuildMode.value && <>
                        <Button
                            onClick={() => {
                                setOpenImportDialog(true);
                            }} variant="contained">
                            <Typography variant="h3" color="gold">Import</Typography>
                        </Button>
                        <Button
                            onClick={onSaveClicked}
                            variant="contained">
                            <Typography variant="h3" color="gold">Save</Typography>
                        </Button>
                    </>}
                </Stack>

            </Stack>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box display="flex" flexDirection="column" alignItems="start" gap={2} p={2}>
                    <div>
                        <Typography variant="h4">Share Code for this perk configuration</Typography>
                        <Button variant="contained"
                                onClick={() => copyToClipboard(getSelectedPerksCompressed(), "Copied share code for this perk configuration")}
                                startIcon={<ContentCopyIcon/>} sx={{mt: 2}}>
                            Copy
                        </Button>
                    </div>
                    <div hidden={!isBuildMode.value}>
                        <Typography variant="h4">Or share this link with your friends!</Typography>
                        <Button variant="contained"
                                onClick={() => copyToClipboard(window.location.href.replace("-", "") + encodeURIComponent(getSelectedPerksCompressed()), "Copied link for this perk configuration")}
                                startIcon={<ContentCopyIcon/>} sx={{mt: 2}}>
                            Copy
                        </Button>
                    </div>
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