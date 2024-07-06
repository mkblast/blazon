import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { User } from "./types";
import NavBar from "./components/NavBar";
import Styles from "./App.module.css";

type AppContextType = {
    me: User | null,
    token: string | null,
    API_URI: string | undefined,
    setMe: Dispatch<SetStateAction<User | null>>
}

function App() {
    const [me, setMe] = useState<User | null>(null);
    const token = localStorage.getItem("token");
    const API_URI = import.meta.env.VITE_API_URI;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return navigate("/auth/login");
        }
    }, [navigate]);

    useEffect(() => {
        (async () => {
            const meRes = await fetch(`${API_URI}/api/main/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const meData = await meRes.json();
            const me: User = meData.me;

            setMe(me);
        })();
    }, [API_URI, token]);

    return (
        <>
            <NavBar me={me!} />
            <div className={Styles.main}>
                <Outlet context={{ me, token, API_URI, setMe } satisfies AppContextType} />
            </div>
        </>
    );
}

export function useApp() {
    return useOutletContext<AppContextType>();
}

export default App;
