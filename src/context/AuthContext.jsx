import { createContext, useEffect, useState } from "react";
import LOCALSTORAGE_KEYS from "../constants/localstorage";
import { startPresenceHeartbeat, stopPresenceHeartbeat } from "@/services/presence.service";


export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem(LOCALSTORAGE_KEYS.USER);
        if (raw) setActiveUser(JSON.parse(raw));
    }, []);



    useEffect(() => {
        const getToken = () => localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);

        if (activeUser?._id) {
            startPresenceHeartbeat(getToken);
            return () => { stopPresenceHeartbeat(getToken); };
        } else {
            stopPresenceHeartbeat(getToken);
        }
    }, [activeUser?._id]);

    const logout = async () => {
        const getToken = () => localStorage.getItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
        await stopPresenceHeartbeat(getToken);
        localStorage.removeItem(LOCALSTORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(LOCALSTORAGE_KEYS.USER);
        setActiveUser(null);
    };

    return (
        <AuthContext.Provider value={{ activeUser, setActiveUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider


