import './app.css'

import {createTheme, CssBaseline, responsiveFontSizes, ThemeProvider} from "@mui/material";
import AppBar from "./components/AppBar.tsx";
import {oidcConfig} from "./config.tsx";
import {AuthProvider} from "react-oidc-context";
import ViewController from "./screens/ViewController.tsx";
//import CantoraOne from "./fonts/font.ttf";
import createAppState from "./utils/AppState.tsx";
import {createContext} from "preact";
import backgroundImage from './assets/extended-town.jpg';
import {useEffect} from "preact/hooks";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
        topography: {
            fontFamily: string;
        }
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
        topography?: {
            fontFamily?: string;
        }
    }
}

const theme = createTheme({
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
        fontFamily: ['Cantora One'].join(','),
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
});

export const AppState = createContext(createAppState());

export function App() {

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if ('ontouchstart' in window) {
                return;
            }
            const x = event.clientX;
            const width = window.innerWidth;
            const percentage = ((x / width) * 4) - 2; // calculate percentage from -10% to 10%
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
        <div className="App">
            <AppState.Provider value={createAppState()}>
                <AuthProvider {...oidcConfig}>
                    <ThemeProvider theme={responsiveFontSizes(theme)}>
                        <CssBaseline/>
                        <AppBar/>
                        <ViewController/>
                    </ThemeProvider>
                </AuthProvider>
            </AppState.Provider>
        </div>
    );
}