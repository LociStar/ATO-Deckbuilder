import {useEffect, useState} from "preact/hooks";
import {useAuth} from "react-oidc-context";
import {AppConfig} from "../config.tsx";

export default function CharacterImage({characterId}: { characterId: string }) {
    const [imageSrc, setImageSrc] = useState<string>('');
    const auth = useAuth();

    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(AppConfig.API_URL + `/character/image/${characterId}`, {
                headers: {
                    'Authorization': 'Bearer ' + auth.user?.access_token,
                },
            });
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(new Blob([blob], {type: 'image/webp'}));
            setImageSrc(objectURL);
        };

        fetchImage().then(r => r);
    }, [auth]);

    return (
        <img
            src={imageSrc}
            alt={`Character ${characterId}`}
        />
    );
}