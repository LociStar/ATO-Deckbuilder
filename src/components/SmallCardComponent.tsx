import {useEffect, useState} from "preact/hooks";
import {Card} from "../types/types";
import {AppConfig} from "../config.ts";
import {Box, Stack, Theme, Tooltip, useMediaQuery, Zoom} from "@mui/material";
import {alpha} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import CardComponent from "./CardComponent.tsx";

// Create a cache object outside the component
const imageCache: { [key: string]: string } = {};

export default function SmallCardComponent({card}: {
    card: Card
}) {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [imageLoaded, setImageLoaded] = useState(false);
    const isMdScreenOrSmaller = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    const CARD_WIDTH = isMdScreenOrSmaller ? 100 : 200;
    const CARD_HEIGHT = 450 * (CARD_WIDTH / 297)

    useEffect(() => {
        const fetchImage = async () => {
            // Check if the image is in the cache
            if (imageCache[card.id]) {
                setImageSrc(imageCache[card.id]);
                setImageLoaded(true);
            } else {
                const response = await fetch(AppConfig.API_URL + "/card/sprite/" + card.id);
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
        <Tooltip TransitionComponent={Zoom} placement="right-start" followCursor
                 title={<Box width={200}><CardComponent card={card} onCardClick={() => null}/></Box>}>
            <Stack direction="row" justifyContent="space-between" alignItems="center"
                   position="relative"
                   maxWidth="500px"
                   color={"white"} bgcolor={alpha('#000000', 0.5)}
                   borderRadius='40px 10px 10px 40px'
                   boxShadow={5}
                   overflow="hidden">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack justifyContent="center" alignItems="center" position="relative" width="60px"
                           height="60px">
                        <img
                            src={AppConfig.API_URL + "/character/image/" + "card_base_energy_" + card.rarity.toLowerCase()}
                            alt="energy"
                            style={{position: 'absolute', width: '100%', height: '100%'}}
                        />
                        <p style={{
                            color: 'white',
                            fontSize: '2em',
                            fontWeight: 'bold',
                            position: 'relative'
                        }}>
                            {card.energyCost}
                        </p>
                    </Stack>
                    <Typography variant="h5">{card.name}</Typography>
                </Stack>
                {!imageLoaded ? <Skeleton variant="rounded" animation="wave" width={CARD_WIDTH} height={CARD_HEIGHT}/> :
                    <img
                        src={imageSrc}
                        alt={card.name.replaceAll(' ', "").toLowerCase()}
                        style={{
                            width: '60px',
                            height: '60px',
                            alignSelf: 'end',

                        }}
                    />}
            </Stack>
        </Tooltip>
    );
}