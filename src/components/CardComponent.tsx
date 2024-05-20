import {useEffect, useState} from "preact/hooks";
import {Card} from "../types/types";
import {AppConfig} from "../config.ts";
import Skeleton from '@mui/material/Skeleton';
import {Theme, useMediaQuery} from "@mui/material";

// Create a cache object outside the component
const imageCache: {[key: string]: string} = {};

export default function CardComponent({card, onCardClick}: {
    card: Card,
    onCardClick: (card: Card) => void
}) {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const isMdScreenOrSmaller = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const CARD_WIDTH = isMdScreenOrSmaller ? 100 : 200;
    const CARD_HEIGHT =  450 * (CARD_WIDTH / 297)

    useEffect(() => {
        const fetchImage = async () => {
            // Check if the image is in the cache
            if (imageCache[card.id]) {
                setImageSrc(imageCache[card.id]);
                setImageLoaded(true);
            } else {
                const response = await fetch(AppConfig.API_URL + `/card/image/${card.id}`);
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                // Store the image URL in the cache
                imageCache[card.id] = objectURL;
                setImageSrc(objectURL);
                setImageLoaded(true);
            }
        };

        fetchImage().then(r => r);
    }, [card.id]);

    return (
        <div style={{width: '100%', paddingBottom: '151.52%', position: 'relative'}}>
            {!imageLoaded? <Skeleton variant="rounded" animation="wave" width={CARD_WIDTH} height={CARD_HEIGHT}/>:
            <img className="zoomEffect"
                 src={imageSrc}
                 alt={`Card ${card.id}`}
                 style={{position: 'absolute', width: '100%'}}
                 onClick={() => onCardClick(card)}
            />}
        </div>
    );
}