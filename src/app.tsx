import './app.css'

import {createTheme, CssBaseline, responsiveFontSizes, ThemeProvider} from "@mui/material";
import backgroundImage from './assets/extended-town_.webp';
import {useEffect} from "preact/hooks";
import {SnackbarProvider} from 'notistack';
import TemporaryDrawer from "./components/TemporaryDrawer.tsx";
import {Outlet} from "react-router-dom";
import PrimarySearchAppBar from "./components/AppBar.tsx";
import {oidcConfig} from "./config.ts";
import {AuthProvider} from "react-oidc-context";
import Footer from "./components/Footer.tsx";

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
    // palette: {
    //     background: {
    //         default: 'gray',
    //     },
    //     primary: {
    //         light: '#616161',
    //         main: '#424242',
    //         dark: '#212121',
    //         contrastText: '#ffffff',
    //     },
    //     secondary: {
    //         light: '#eeeeee',
    //         main: '#bdbdbd',
    //         dark: '#616161',
    //         contrastText: '#000',
    //     },
    // },
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
                body::before {
                  content: "";
                  position: fixed;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  background-image: url(${backgroundImage});
                  background-size: auto 100%; // image will take the full height
                  background-position-x: var(--mouse-x, center); // use the --mouse-x CSS variable
                  background-position-y: center;
                  background-repeat: no-repeat;
                  filter: blur(0px); // apply blur effect
                  z-index: -1; // place the pseudo-element behind the content
                }
              `,
        },
    },
}));
export function App() {

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if ('ontouchstart' in window) {
                return;
            }
            const x = event.clientX;
            const width = window.innerWidth;
            const percentage = ((x / width) * 2) - 1; // calculate percentage from -5% to 5%
            const adjustedPercentage = 50 + percentage; // adjust the default position (50%) by the calculated percentage
            document.body.style.setProperty('--mouse-x', `${adjustedPercentage}%`);
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Clean up the event listener when the component is unmounted
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (

        <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AuthProvider {...oidcConfig}>
            <ThemeProvider theme={responsiveFontSizes(theme)}>
                <SnackbarProvider>
                    <CssBaseline/>
                    <PrimarySearchAppBar/>
                    <TemporaryDrawer/>
                    <div style={{flexGrow: 1, marginBottom: 10}}>
                        <Outlet/>
                    </div>
                    <Footer/>
                </SnackbarProvider>
            </ThemeProvider>
            </AuthProvider>
        </div>
    );
}