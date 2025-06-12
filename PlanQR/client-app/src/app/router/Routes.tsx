import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../../App";
import LecturerPlan from "../features/LecturerPlan";
import PlanDetails from "../features/PlanDetails";
import Tablet from "../layout/Tablet";
import AdminPanel from "../admin/AdminPanel";


export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {path: 'LecturerPlan/:teacher',element: <LecturerPlan />},
            {path: ':department/:room',element: <PlanDetails />},
            {path: 'tablet/:department/:room/:secretUrl',element: <Tablet />},
            {path: 'AdminPanel',element: <AdminPanel />}
        ]
    }
]

export const router = createBrowserRouter(routes);