import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../../App";
import LecturerPlan from "../features/LecturerPlan";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'LecturerPlan',element: <LecturerPlan />},
        ]
    }
]

export const router = createBrowserRouter(routes);