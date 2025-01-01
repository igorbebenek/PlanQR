import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../../App";
import LecturerPlan from "../features/LecturerPlan";
import PlanDetails from "../features/PlanDetails";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'LecturerPlan',element: <LecturerPlan />},
            {path: ':department/:room',element: <PlanDetails />},
        ]
    }
]

export const router = createBrowserRouter(routes);