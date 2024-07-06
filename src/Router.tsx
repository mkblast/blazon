import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import User from "./routes/Root/Users";
import Signup from "./routes/Root/Auth/Signup";
import Login from "./routes/Root/Auth/Login";
import Logout from "./routes/Root/Auth/Logout";
import Root from "./routes/Root";
import FullPost from "./routes/Root/Posts";
import Explore from "./routes/Root/Explore";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "",
                    element: <Root />
                },
                {
                    path: "/explore",
                    element: <Explore />
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
                },
                {
                    path: "/users/:id",
                    element: <User />,
                },
                {
                    path: "/posts/:id",
                    element: <FullPost />
                }
            ]
        },
    ]);

    return <RouterProvider router={router} />;
}

export default Router;
