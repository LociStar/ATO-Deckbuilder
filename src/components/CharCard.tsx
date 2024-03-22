import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState} from "preact/hooks";
import {Deck} from "../types/types.tsx";
import {Button, Stack} from "@mui/material";
import { useContext } from "preact/hooks";
import {AppState} from "../app.tsx";
import {useNavigate} from "react-router-dom";

export default function CharBuilds({deck}: { deck: Deck }) {
    const [likes, setLikes] = useState(0); // Add this line
    setLikes(deck.likes);
    const state = useContext(AppState);
    const navigate = useNavigate();

    const handleLikeClick = () => {
        setLikes(likes + 1);
    };

    function onDeckCardClick() {
        state.deckId = deck.id;
        // using react-router-dom navigate to the deck details view
        return navigate('/deck/' + deck.id);
    }

    return (
        <Button color="secondary" variant="contained" onClick={onDeckCardClick}
                sx={{
                    display: 'flex', maxWidth: 1200, maxHeight: 100, width: '100%',
                }}>
            <img
                src="src/assets/Nezglekt.webp"
                alt="Character Image"
                style={{objectFit: 'contain', width: 50, margin: '10px'}}
            />
            <Stack marginLeft={5} alignItems="flex-start">
                <Typography variant="h5" fontWeight='bold'>
                    {deck.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {deck.charName} guide by {deck.username}
                </Typography>
            </Stack>

            <CardActions disableSpacing sx={{marginLeft: 'auto'}}>
                <Typography variant="body1" fontWeight='bold' color="text.secondary">
                    {likes}
                </Typography>
                <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
                    <FavoriteIcon color={"error"}/>
                </IconButton>
            </CardActions>
        </Button>);
}