import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export const ContactsContext = createContext({
    contacts: [],
    isLoadingContacts: false,
    fetchContacts: () => {},
    updateLastMessageLocally: () => {},
});

const ContactsContextProvider = ({ children }) => {
    const { activeUser } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(false);

    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

    const sortByLastMessage = (list) =>
        [...list].sort((a, b) => {
            const tA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
            const tB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
            return tB - tA;
        });

    const fetchContacts = useCallback(async () => {
        if (!activeUser?._id) return;
        setIsLoadingContacts(true);

        try {
            const token = localStorage.getItem("auth_token");
            const { data } = await axios.get(`${API_BASE}/api/contacts/accepted`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const parsed = (data.data || []).map((c) => {
                const other =
                    c.requester_id?._id === activeUser._id
                        ? c.receiver_id
                        : c.requester_id;

                return {
                    contact_id: c._id,
                    user_id: other?._id,
                    name: other?.name || "",
                    email: other?.email || "",
                    avatar: other?.avatar || "",
                    status: c.status,
                    last_message: c.last_message ?? "Sin mensajes aún",
                    last_message_time: c.last_message_time ?? null,
                };
            });

            setContacts(sortByLastMessage(parsed));
        } catch (error) {
            console.error("Error al obtener contactos:", error);
        } finally {
            setIsLoadingContacts(false);
        }
    }, [activeUser?._id]);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const updateLastMessageLocally = (userId, messageText, time = new Date()) => {
        setContacts((prev) =>
            sortByLastMessage(
                prev.map((c) =>
                    c.user_id === userId
                        ? {
                                ...c,
                                last_message: messageText,
                                last_message_time: time,
                        }
                        : c
                )
            )
        );
    };

    return (
        <ContactsContext.Provider
            value={{
                contacts,
                isLoadingContacts,
                fetchContacts,
                updateLastMessageLocally,
            }}
        >
            {children}
        </ContactsContext.Provider>
    );
};

export default ContactsContextProvider;
