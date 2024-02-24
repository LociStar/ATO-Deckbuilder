import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useState} from "preact/hooks";
import {CharBuild} from "../types/types.tsx";
import {Button, Stack} from "@mui/material";

export default function CharBuilds({charBuild}: { charBuild: CharBuild }) {
    const [likes, setLikes] = useState(0); // Add this line
    setLikes(charBuild.likes);

    const handleLikeClick = () => {
        setLikes(likes + 1);
    };

    return (
        <Button color="secondary" variant="contained"
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
                    {charBuild.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {charBuild.charName} guide by {charBuild.userName}
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