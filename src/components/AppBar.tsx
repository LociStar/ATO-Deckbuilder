import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import {useContext, useState} from 'preact/hooks';
import {JSX} from 'preact';
import {useAuth} from "react-oidc-context";
import RenderOnAuthenticated from "./conditionals/RenderOnAuthenticated.tsx";
import RenderOnAnonymous from "./conditionals/RenderOnAnonymous.tsx";
import CustomSearch from "./CustomSearch.tsx";
import {AppState} from "../screens/ViewController.tsx";
import AppBar from '@mui/material/AppBar';
import logo from "../assets/LOGO_ATO_small.webp";
import {useNavigate} from "react-router-dom";
import {Button, Chip} from "@mui/material";


export default function PrimarySearchAppBar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
    const state = useContext(AppState);
    const navigate = useNavigate();

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const auth = useAuth();

    const handleProfileMenuOpen = (event: JSX.TargetedMouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAppMenuOpen = () => {
        state.appMenuOpen.value = true;
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <RenderOnAuthenticated>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    window.open("https://account.ato-deckbuilder.com/realms/ATO-Deckbuilder/account")
                }}>Profile</MenuItem>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    return auth.signoutSilent()
                }}>Log out</MenuItem>
            </RenderOnAuthenticated>
            <RenderOnAnonymous>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    return auth.signinRedirect()
                }}>Login/Register</MenuItem>
            </RenderOnAnonymous>
        </Menu>
    );
    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <RenderOnAuthenticated>
                <MenuItem onClick={
                    () => {
                        setAnchorEl(null);
                        handleMobileMenuClose();
                        window.open("https://account.ato-deckbuilder.com/realms/ATO-Deckbuilder/account")
                    }
                }>Profile</MenuItem>
                {/*<MenuItem onClick={handleMenuClose}>My account</MenuItem>*/}
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    handleMobileMenuClose();
                    return auth.signoutSilent()
                }}>Log out</MenuItem>
            </RenderOnAuthenticated>
            <RenderOnAnonymous>
                <MenuItem onClick={() => {
                    setAnchorEl(null);
                    handleMobileMenuClose();
                    return auth.signinRedirect()
                }}>Login/Register</MenuItem>
            </RenderOnAnonymous>
        </Menu>
    );

    return (<AppBar position={"sticky"} sx={{mb: 2}}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{mr: 0}}
                    onClick={handleAppMenuOpen}
                >
                    <MenuIcon/>
                </IconButton>
                <Button onClick={() => navigate("/")}>
                    <img width={45} height={45} style={{width: 45}} src={logo} alt="Logo"/>
                    <Typography
                        variant="h6"
                        noWrap
                        color={"textPrimary"}
                        sx={{display: {xs: 'none', sm: 'block'}, marginLeft: 1}}
                    >
                        ATO-Deckbuilder
                    </Typography>
                </Button>
                <CustomSearch/>
                <Box sx={{flexGrow: 1}}/>
                <Chip color="success" label="Game Version 1.5.0" variant="outlined" sx={{mr: 2}}/>
                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle/>
                    </IconButton>
                </Box>
                <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit"
                    >
                        <MoreIcon/>
                    </IconButton>
                </Box>
            </Toolbar>
            {renderMobileMenu}
            {renderMenu}
        </AppBar>
    );
}