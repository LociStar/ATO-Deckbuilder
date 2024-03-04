import './app.css'

import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import AppBar from "./components/AppBar.tsx";
import CardsView from "./screens/CardsView.tsx";
import {useState} from "preact/hooks";
import CharBuilds from "./screens/CharBuilds.tsx";
import {oidcConfig} from "./config.tsx";
import {AuthProvider} from "react-oidc-context";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const theme = createTheme({
    palette: {
        background: {
            default: 'gray',
        },
        primary: {
            light: '#616161',
            main: '#424242',
            dark: '#212121',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#eeeeee',
            main: '#bdbdbd',
            dark: '#616161',
            contrastText: '#000',
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
                <CharBuilds/>
            </ThemeProvider>
            </AuthProvider>
        </div>
    );
}
