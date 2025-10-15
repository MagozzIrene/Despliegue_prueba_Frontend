import { createContext, useEffect, useState } from "react";
import LOCALSTORAGE_KEYS from "../constants/localstorage";


export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem(LOCALSTORAGE_KEYS.USER);
        if (raw) setActiveUser(JSON.parse(raw));
    }, []);

    const logout = () => {
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
