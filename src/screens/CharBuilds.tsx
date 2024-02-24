import {Stack} from "@mui/material";
import CharCard from "../components/CharCard";
import {useState, useEffect} from "preact/hooks";
import {CharBuild} from "../types/types";

export default function CharBuilds() {
    const [charBuilds, setCharBuilds] = useState<CharBuild[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/char')
            .then(response => response.json())
            .then(data => setCharBuilds(data));
    }, []);

    return (
        <Stack alignItems="center" justifyContent={'center'} spacing={2}>
            {charBuilds.map((charBuild) => (
                <CharCard key={charBuild.id} charBuild={charBuild}/>
            ))}
        </Stack>
    );
}