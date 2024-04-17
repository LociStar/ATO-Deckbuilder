import {useEffect, useState} from "preact/hooks";
import {AppConfig} from "../config.ts";
import {Container} from "@mui/material";
import {alpha} from "@mui/material/styles";

export default function CharacterImage({characterId}: { characterId: string }) {
    const [imageSrc, setImageSrc] = useState<string>('');

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
                style={{
                    borderRadius: 5,
                    backdropFilter: 'blur(50px)',
                    backgroundColor: alpha('#000000', 0.5)
                }}
            />
        </Container>
    );
}