import { createContext, useState, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { ContactsContext } from "@/context/ContactsContext";

export const MessagesContext = createContext({
    messages: [],
    isLoading: false,
    fetchMessages: () => { },
    addNewMessage: () => { },
});

const MessagesContextProvider = ({ children }) => {
    const { activeUser } = useContext(AuthContext);
    const { updateLastMessageLocally } = useContext(ContactsContext);

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE =
        import.meta.env.VITE_BACKEND_URL ||
        "https://despliegue-prueba-backend.vercel.app";

    const fetchMessages = useCallback(
        async (chatIdFromURL) => {
            if (!chatIdFromURL || !activeUser?._id) return;

            setIsLoading(true);

            try {
                const token = localStorage.getItem("auth_token");
                const { data } = await axios.get(
                    `${API_BASE}/api/messages/${activeUser._id}/${chatIdFromURL}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setMessages(Array.isArray(data) ? data : data.data || []);
            } catch (error) {
                console.error("Error al obtener mensajes:", error);
            } finally {
                setIsLoading(false);
            }
        },
        [activeUser?._id]
    );

    const addNewMessage = async (text, chatIdFromURL) => {
        if (!chatIdFromURL || !activeUser?._id || !text.trim()) return;

        const payload = {
            senderId: activeUser._id,
            receiverId: chatIdFromURL,
            text,
        };

        try {
            const token = localStorage.getItem("auth_token");

            const { data } = await axios.post(
                `${API_BASE}/api/messages`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const msg = data?.data || data;

            setMessages((prev) => [...prev, msg]);

            updateLastMessageLocally(chatIdFromURL, text, msg.sent_at);

        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    const fetchGroupMessages = useCallback(
        async (groupIdFromURL) => {
            if (!groupIdFromURL || !activeUser?._id) return;
            setIsLoading(true);
            try {
                const token = localStorage.getItem("auth_token");
                const { data } = await axios.get(
                    `${API_BASE}/api/group-messages/${groupIdFromURL}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMessages(Array.isArray(data) ? data : data.data || []);
            } catch (err) {
                console.error("Error al obtener mensajes del grupo:", err);
            } finally {
                setIsLoading(false);
            }
        },
        [activeUser?._id]
    );

    const sendGroupMessage = async (text, groupIdFromURL) => {
        if (!groupIdFromURL || !activeUser?._id || !text.trim()) return;
        try {
            const token = localStorage.getItem("auth_token");
            const payload = { group_id: groupIdFromURL, text };
            const { data } = await axios.post(
                `${API_BASE}/api/group-messages`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const msg = data?.data || data;
            setMessages((prev) => [...prev, msg]);
            // ultimo mensaje???
        } catch (err) {
            console.error("Error al enviar mensaje de grupo:", err);
        }
    };

    return (
        <MessagesContext.Provider
            value={{
                messages,
                isLoading,
                fetchMessages,
                addNewMessage,
                fetchGroupMessages,
                sendGroupMessage,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
