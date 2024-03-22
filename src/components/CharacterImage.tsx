import {useEffect, useState} from "preact/hooks";
import {useAuth} from "react-oidc-context";
import {AppConfig} from "../config.tsx";
import {Box, Container} from "@mui/material";

export default function CharacterImage({characterId}: { characterId: string }) {
    const [imageSrc, setImageSrc] = useState<string>('');
    const auth = useAuth();

    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(AppConfig.API_URL + `/character/image/${characterId}`);
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(new Blob([blob], {type: 'image/webp'}));
            setImageSrc(objectURL);
        };

        fetchImage().then(r => r);
    }, []);

    return (
        <Container>
            <img
                src={imageSrc}
                alt={`Character ${characterId}`}
            />
        </Container>
    );
}