import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "../features/auth/components/protected";
import ForgotPassword from "../features/auth/pages/ForgotPassword";


export const router = createBrowserRouter([
     {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },

     {
        path: "/",
        element:  <Protected>
            <Dashboard />
        </Protected>
    },

    {
    path: "/forgot-password",
    element: <ForgotPassword />
},
    ])