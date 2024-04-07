import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import {useContext} from "preact/hooks";
import {AppState} from "../screens/ViewController.tsx"
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "react-oidc-context";
import {enqueueSnackbar} from "notistack";

export default function TemporaryDrawer() {
    const auth = useAuth();
    const navigate = useNavigate();
    const state = useContext(AppState);

    const toggleDrawer = (newOpen: boolean) => () => {
        state.appMenuOpen.value = newOpen;
    };

    function handleDeckbuilderClick() {
        if (auth.user) {
            navigate('/deckbuilder');
        } else {
            enqueueSnackbar('You need to be logged in to create decks', {
                variant: 'error',
                autoHideDuration: 5000
            });
        }
    }

    const DrawerList = (
        <Box role="presentation" onClick={toggleDrawer(false)}>
            <List>
                <ListItem>
                    <ListItemButton component={Link} to={'/'}>
                        <ListItemText primary="Home"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={handleDeckbuilderClick}>
                        <ListItemText primary="Deck Builder"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton component={Link} to={'/cards-wiki'}>
                        <ListItemText primary="Cards Wiki"/>
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>
                <ListItem>
                    <ListItemButton>
                        <ListItemText primary="Home"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <div>
            <Drawer open={state.appMenuOpen.value} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}