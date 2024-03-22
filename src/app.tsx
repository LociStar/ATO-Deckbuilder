import './app.css'

import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import AppBar from "./components/AppBar.tsx";
import CardsView from "./screens/CardsView.tsx";
import {useState} from "preact/hooks";
import DeckBuilds from "./screens/DeckBuilds.tsx";
import {oidcConfig} from "./config.tsx";
import {AuthProvider} from "react-oidc-context";
import DeckBuilder from "./screens/DeckBuilder.tsx";
import ViewController from "./screens/ViewController.tsx";
import CantoraOne from "./assets/fonts/font.ttf";

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
            main: '#414FD8',
        }
    },
    typography: {
        fontFamily: 'CantoraOne',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'CantoraOne';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('CantoraOne'), local('CantoraOne-Regular'), url(${CantoraOne}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
        },
    },
});

export function App() {
    const [searchQuery, setSearchQuery] = useState(''); // Add a state variable for the search query

    return (
        <div className="App">
            <AuthProvider {...oidcConfig}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <AppBar setSearchQuery={setSearchQuery}/>
                {/*<CardsView searchQuery={searchQuery}/>*/}
                {/*<DeckBuilds/>*/}
                <ViewController/>
            </ThemeProvider>
            </AuthProvider>
        </div>
    );
}
