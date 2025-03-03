import {useState} from "preact/hooks";
import {Card} from "../types/types";
import {AppConfig} from "../config.ts";
import Skeleton from '@mui/material/Skeleton';
import {Theme, useMediaQuery} from "@mui/material";

export default function CardComponent({card, onCardClick}: {
    card: Card,
    onCardClick: (card: Card) => void
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const isMdScreenOrSmaller = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const CARD_WIDTH = isMdScreenOrSmaller ? 100 : 200;
    const CARD_HEIGHT = 450 * (CARD_WIDTH / 297)

    function handleImageLoaded() {
        setImageLoaded(true);
    }

    return (
        <div style={{width: CARD_WIDTH, height: CARD_HEIGHT, position: 'relative'}}>
            {!imageLoaded && (
                <Skeleton
                    variant="rounded"
                    animation="wave"
                    width={CARD_WIDTH}
                    height={CARD_HEIGHT}
                    style={{position: 'absolute', top: 0, left: 0}}
                />
            )}
            <img className="zoomEffect"
                 src={AppConfig.API_URL + `/card/image/${card.id}`}
                 alt={`Card ${card.id}`}
                 style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}
                 onClick={() => onCardClick(card)}
                 onLoad={handleImageLoaded}
            />
        </div>
    );
}