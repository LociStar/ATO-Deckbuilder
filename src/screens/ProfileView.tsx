import {Box, TextField, Button, Stack} from '@mui/material';
import {alpha} from '@mui/system';
import {useAuth} from "react-oidc-context";
import {useEffect, useState} from "preact/hooks";
import {AppConfig} from "../config.ts";
import {useSnackbar} from "notistack";

export default function ProfileView() {

    const auth = useAuth()
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleDeleteAccount = () => {
    };

    const handleUpdateAccount = () => {
        console.log(auth.user?.profile.name)
        fetch(AppConfig.API_URL + '/user/update?username=' + username + '&email=' + email, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.user?.access_token}`
            },
        })
            .then(response => {
                console.log(response.status)
                if (response.ok) {
                    auth.signinSilent()
                    enqueueSnackbar('Update completed', {
                        variant: 'success',
                        autoHideDuration: 5000
                    });
                }
            })
    };

    useEffect(() => {
        if (auth.user) {
            setEmail(auth.user.profile.email!)
            setUsername(auth.user.profile.preferred_username!)
        }
    }, [auth]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            <Box sx={{
                padding: 2,
                borderRadius: 1,
                backdropFilter: 'blur(50px)',
                backgroundColor: alpha('#000000', 0.5),
            }}>
                <Stack spacing={2}>
                    <TextField
                        label="Username"
                        value={username}
                        variant="outlined"
                        onChange={(e) => {
                            setUsername((e.target as HTMLSelectElement).value)
                        }}
                    />
                    <TextField
                        label="E-Mail"
                        value={email}
                        variant="outlined"
                        onChange={(e) => {
                            setEmail((e.target as HTMLSelectElement).value)
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleUpdateAccount}>
                        Update Account
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};