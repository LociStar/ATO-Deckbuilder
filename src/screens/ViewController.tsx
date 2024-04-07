import DeckBuilder from "./DeckBuilder.tsx";
import DeckDetailsView from "./DeckDetailsView.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import DecksView from "./DecksView.tsx";
import {App} from "../app.tsx";
import createAppState from "../utils/AppState.tsx";
import {createContext} from "preact";
import CardsView from "./CardsView.tsx";

export const AppState = createContext(createAppState());

export default function ViewController() {

    const router = createBrowserRouter([
        {
            path: "/",
            element: <App/>,
            children: [
                {
                    path: "/",
                    element: <DecksView/>,
                },
                {
                    path: "/deck/*",
                    element: <DeckDetailsView/>,
                },
                {
                    path: "/deckbuilder",
                    element: <DeckBuilder/>,
                },
                {
                    path: "/cards-wiki",
                    element: <CardsView/>,
                },
            ],
        },
    ]);

    return (
        <AppState.Provider value={createAppState()}>
            <RouterProvider router={router}/>
        </AppState.Provider>);
}