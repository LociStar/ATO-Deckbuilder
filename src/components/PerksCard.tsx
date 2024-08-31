import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import {useEffect} from "preact/hooks";
import {Perks} from "../types/types.tsx";
import {Button, Stack} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {alpha} from "@mui/material/styles";

export default function PerksCard({perks}: { perks: Perks }) {
    //const [likes, setLikes] = useState(0); // Add this line
    //setLikes(0);
    const navigate = useNavigate();

    function onDeckCardClick() {
        return navigate('/perks/' + perks.id);
    }

    useEffect(() => {
        console.log(`Perks: ${perks.data}`)
    }, [perks]);

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
            <Stack marginLeft={4} alignItems="flex-start">
                <Typography variant="h5" fontWeight='bold' color='white'>
                    {perks.title}
                </Typography>
                {/*<Hidden smDown>*/}
                {/*    <Typography variant="body2" color='white'>*/}
                {/*        created by {deck.username}*/}
                {/*    </Typography>*/}
                {/*</Hidden>*/}
            </Stack>

            <CardActions disableSpacing sx={{marginLeft: 'auto'}}>
                {/*<Stack direction="row" justifyContent="center">*/}
                {/*    <Typography variant="body1" fontWeight='bold' color="text.secondary">*/}
                {/*        {likes}*/}
                {/*    </Typography>*/}
                {/*    <FavoriteIcon color={"error"} sx={{marginLeft: 0.5}}/>*/}
                {/*</Stack>*/}
            </CardActions>
        </Button>);
}