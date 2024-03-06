import {useEffect, useState} from "preact/hooks";
import {Card} from "../types/types";

export default function CardComponent({card, token, onCardClick}: { card: Card, token: string | undefined, onCardClick: (card: Card) => void }) {
    const [imageSrc, setImageSrc] = useState<string>('');

    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(`http://localhost:8080/image/${card.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            });
            const blob = await response.blob();
            const objectURL = URL.createObjectURL(blob);
            setImageSrc(objectURL);
        };

        fetchImage().then(r => r);
    }, [card.id, token]);

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