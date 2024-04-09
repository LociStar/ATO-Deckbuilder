import { Box, Typography, Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

export default function Footer() {
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }} />
                <Typography variant="body1" color="inherit">
                    <Link color="inherit" href="/terms-of-service">
                        Terms of Service
                    </Link>
                </Typography>
                <Typography variant="body1" color="inherit" sx={{ marginLeft: 2 }}>
                    <Link color="inherit" href="/privacy-policy">
                        Privacy Policy
                    </Link>
                </Typography>
                <Typography variant="body1" color="inherit" sx={{ marginLeft: 2 }}>
                    <Link color="inherit" href="https://github.com/LociStar/ATO-Deckbuilder">
                        GitHub
                    </Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}