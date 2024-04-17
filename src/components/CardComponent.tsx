import {useEffect, useState} from "preact/hooks";
import {Card} from "../types/types";
import {AppConfig} from "../config.ts";

// Create a cache object outside the component
const imageCache: {[key: string]: string} = {};

export default function CardComponent({card, onCardClick}: {
    card: Card,
    onCardClick: (card: Card) => void
}) {
    const [imageSrc, setImageSrc] = useState<string>('');

    useEffect(() => {
        const fetchImage = async () => {
            // Check if the image is in the cache
            if (imageCache[card.id]) {
                setImageSrc(imageCache[card.id]);
            } else {
                const response = await fetch(AppConfig.API_URL + `/image/${card.id}`);
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                // Store the image URL in the cache
                imageCache[card.id] = objectURL;
                setImageSrc(objectURL);
            }
        };

        fetchImage().then(r => r);
    }, [card.id]);

    return (
        <div style={{width: '100%', paddingBottom: '151.52%', position: 'relative'}}>
            <img className="zoomEffect"
                 src={imageSrc}
                 alt={`Card ${card.id}`}
                 style={{position: 'absolute', width: '100%', height: '100%',}}
                 onClick={() => onCardClick(card)}
            />
        </div>
    );
}