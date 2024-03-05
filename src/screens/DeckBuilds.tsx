import {Fab, Stack} from "@mui/material";
import CharCard from "../components/CharCard";
import {useState, useEffect} from "preact/hooks";
import {CharBuild} from "../types/types";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

export default function DeckBuilds() {
    const [charBuilds, setCharBuilds] = useState<CharBuild[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/deck')
            .then(response => response.json())
            .then(data => setCharBuilds(data));
    }, []);

    return (
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <Stack alignItems="center" justifyContent={'center'} spacing={2}>
                {charBuilds.map((charBuild) => (
                    <CharCard key={charBuild.id} charBuild={charBuild}/>
                ))}
            </Stack>
            <Fab color="secondary" aria-label="add" style={{position: 'fixed', right: '10px', bottom: '10px'}}>
                <AddIcon />
            </Fab>
        </Box>
    );
}