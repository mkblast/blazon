import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Logout from "./components/Auth/Logout";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
        },
        {
            path: "/auth/",
            children: [
                {
                    path: "signup",
                    element: <Signup />
                },
                {
                    path: "login",
                    element: <Login />
                },
                {
                    path: "logout",
                    element: <Logout />
                }
            ]
        }
    ]);

    return <RouterProvider router={router} />;
}

export default Router;
