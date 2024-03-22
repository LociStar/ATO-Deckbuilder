import DeckBuilder from "./DeckBuilder.tsx";
import DeckDetailsView from "./DeckDetailsView.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import DecksView from "./DecksView.tsx";

export default function ViewController() {

    const router = createBrowserRouter([
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
    ]);

    return (
        <div>
            <RouterProvider router={router}/>
        </div>
    );
}