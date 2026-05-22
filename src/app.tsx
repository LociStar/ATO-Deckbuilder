import './app.css'

import {createTheme, CssBaseline, responsiveFontSizes, ThemeProvider} from "@mui/material";
import {SnackbarProvider} from 'notistack';
import TemporaryDrawer from "./components/TemporaryDrawer.tsx";
import {Outlet} from "react-router-dom";
import {oidcConfig} from "./config.ts";
import {AuthProvider} from "react-oidc-context";
import Footer from "./components/Footer.tsx";
import NavC from "./components/directionC/NavC.tsx";
import {C} from "./components/directionC/tokens.ts";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
        topography: {
            fontFamily: string;
        }
    }
}

const theme = responsiveFontSizes(createTheme({
    palette: {
        mode: 'dark', primary: {
            main: '#494949',
        }
    },
    typography: {
        fontFamily: 'Cantora One',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                body {
                  background: ${C.cream};
                }
              `,
        },
    },
}));

export function App() {
    return (
        <div className="App" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: C.cream,
        }}>
            <AuthProvider {...oidcConfig}>
                <ThemeProvider theme={responsiveFontSizes(theme)}>
                    <SnackbarProvider>
                        <CssBaseline/>
                        <NavC/>
                        <TemporaryDrawer/>
                        <div style={{flexGrow: 1}}>
                            <Outlet/>
                        </div>
                        <Footer/>
                    </SnackbarProvider>
                </ThemeProvider>
            </AuthProvider>
        </div>
    );
}
