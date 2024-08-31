import DeckBuilder from "./DeckBuilder.tsx";
import DeckDetailsView from "./DeckDetailsView.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import DecksView from "./DecksView.tsx";
import {App} from "../app.tsx";
import createAppState from "../utils/AppState.tsx";
import {createContext} from "preact";
import CardsView from "./CardsView.tsx";
import TermsOfService from "./TermsOfServiceView.tsx";
import PrivacyPolicy from "./PrivacyPolicyView.tsx";
import DeckEditor from "./DeckEditorView.tsx";
import PerksView from "./PerksView.tsx";
import PerksDetailsView from "./PerksDetailsView.tsx";

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
                {
                    path: "/terms-of-service",
                    element: <TermsOfService/>,
                },
                {
                    path: "/privacy-policy",
                    element: <PrivacyPolicy/>,
                },
                {
                    path: "/deckeditor/*",
                    element: <DeckEditor/>,
                },
                {
                    path: "/perks",
                    element: <PerksView/>,
                },
                {
                    path: "/perks/*",
                    element: <PerksDetailsView/>,
                },
            ],
        },
    ]);

    return (
        <AppState.Provider value={createAppState()}>
            <RouterProvider router={router}/>
        </AppState.Provider>);
}