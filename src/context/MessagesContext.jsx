import { createContext, useState, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { ContactsContext } from "@/context/ContactsContext";
import { GroupsContext } from "@/context/GroupsContext";

export const MessagesContext = createContext({
    messages: [],
    isLoading: false,
    fetchMessages: () => { },
    addNewMessage: () => { },
});

const MessagesContextProvider = ({ children }) => {
    const { activeUser } = useContext(AuthContext);
    const { updateLastMessageLocally } = useContext(ContactsContext);
    const { updateGroupLastMessageLocally } = useContext(GroupsContext);

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE =
        import.meta.env.VITE_BACKEND_URL ||
        "https://despliegue-prueba-backend.vercel.app";

    const normalizeMessage = (raw) => {
        const sender =
            raw.sender?._id ||
            raw.sender_id?._id ||
            raw.sender ||
            raw.sender_id ||
            null;

        return {
            _id: raw._id,
            text: raw.text,
            sent_at: raw.sent_at,
            read: raw.read ?? false,
            read_by: raw.read_by ?? [],
            senderId: sender ? String(sender) : null,
            groupId: raw.group_id?._id || raw.group_id || null,
            receiverId: raw.receiver?._id || raw.receiver || null,
        };
    };

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

                const list = Array.isArray(data) ? data : data.data || [];
                setMessages(list.map(normalizeMessage));
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

            const msg = normalizeMessage(data?.data || data);
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

                const list = Array.isArray(data) ? data : data.data || [];
                setMessages(list.map(normalizeMessage));
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

            const msg = normalizeMessage(data?.data || data);

            setMessages((prev) => [...prev, msg]);

            updateGroupLastMessageLocally(groupIdFromURL, msg.text, msg.sent_at);
        } catch (err) {
            console.error("Error al enviar mensaje de grupo:", err);
        }
    };

    const deletePrivateMessage = async (messageId) => {
        if (!messageId) return;

        try {
            const token = localStorage.getItem("auth_token");

            await axios.delete(`${API_BASE}/api/messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        } catch (error) {
            console.error("Error al eliminar mensaje privado:", error);
        }
    };

    const deleteGroupMessage = async (messageId) => {
        if (!messageId) return;

        try {
            const token = localStorage.getItem("auth_token");

            await axios.delete(`${API_BASE}/api/group-messages/${messageId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessages((prev) => prev.filter((m) => m._id !== messageId));
        } catch (error) {
            console.error("Error al eliminar mensaje de grupo:", error);
        }
    };

    const markPrivateMessageAsRead = async (messageId) => {
        try {
            const token = localStorage.getItem("auth_token");

            setMessages((prev) =>
                prev.map((m) =>
                    m._id === messageId ? { ...m, read: true } : m
                )
            );

            await axios.patch(
                `${API_BASE}/api/messages/${messageId}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Error marcando mensaje privado como leído:", err);
        }
    };

    const markGroupMessageAsRead = async (messageId) => {
        try {
            const token = localStorage.getItem("auth_token");

            setMessages((prev) =>
                prev.map((m) =>
                    m._id === messageId
                        ? {
                            ...m,
                            read_by: [...new Set([...(m.read_by || []), activeUser._id])],
                        }
                        : m
                )
            );

            await axios.patch(
                `${API_BASE}/api/group-messages/read/${messageId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Error marcando como leído (grupo):", err);
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
                deletePrivateMessage,
                deleteGroupMessage,
                markPrivateMessageAsRead,
                markGroupMessageAsRead,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

export default MessagesContextProvider;
