import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState} from "preact/hooks";
import {Deck} from "../types/types.tsx";
import {Box, Button, Hidden, Stack} from "@mui/material";
import {useContext} from "preact/hooks";
import {AppState} from "../screens/ViewController.tsx"
import {useNavigate} from "react-router-dom";
import {AppConfig} from "../config.ts";
import {alpha} from "@mui/material/styles";

export default function CharBuilds({deck}: { deck: Deck }) {
    const [likes, setLikes] = useState(0); // Add this line
    setLikes(deck.likes);
    const state = useContext(AppState);
    const navigate = useNavigate();

    function onDeckCardClick() {
        state.deckId = deck.id;
        // using react-router-dom navigate to the deck details view
        return navigate('/deck/' + deck.id);
    }

    return (
        <Button onClick={onDeckCardClick}
                sx={{
                    display: 'flex',
                    maxWidth: 1200,
                    maxHeight: 120,
                    width: '100%',
                    backdropFilter: 'blur(50px)',
                    backgroundColor: alpha('#000000', 0.5)
                }}>
            <Box>
                <img
                    src={AppConfig.API_URL + `/character/image/70_${deck.characterId}`}
                    alt={`Character ${deck.characterId}`}
                    width={70}
                    height={100}
                    style={{objectFit: 'contain', width: 70, margin: '10px'}}
                />
            </Box>
            <Stack marginLeft={4} alignItems="flex-start">
                <Typography variant="h5" fontWeight='bold' color='white'>
                    {deck.title}
                </Typography>
                <Hidden smDown>
                    <Typography variant="body2" color='white'>
                        created by {deck.username}
                    </Typography>
                </Hidden>
            </Stack>

            <CardActions disableSpacing sx={{marginLeft: 'auto'}}>
                <Stack direction="row" justifyContent="center">
                    <Typography variant="body1" fontWeight='bold' color="text.secondary">
                        {likes}
                    </Typography>
                    <FavoriteIcon color={"error"} sx={{marginLeft: 0.5}}/>
                </Stack>
            </CardActions>
        </Button>);
}