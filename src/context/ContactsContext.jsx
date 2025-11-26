import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export const ContactsContext = createContext({
    accepted: [],
    pending: [],
    isLoading: false,

    fetchAllContacts: () => { },
    sendRequest: () => { },
    acceptRequest: () => { },
    rejectRequest: () => { },
    deleteRequest: () => { },
    updateLastMessageLocally: () => { },
});

const ContactsContextProvider = ({ children }) => {
    const { activeUser } = useContext(AuthContext);

    const [accepted, setAccepted] = useState([]);
    const [pending, setPending] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    const token = localStorage.getItem("auth_token");

    const sortByLastMessage = (list) =>
        [...list].sort((a, b) => {
            const tA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
            const tB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
            return tB - tA;
        });

    const fetchAllContacts = useCallback(async () => {
        if (!activeUser?._id) return;

        setIsLoading(true);
        try {
            const [acceptedRes, pendingRes] = await Promise.all([
                axios.get(`${API_BASE}/api/contacts/accepted`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`${API_BASE}/api/contacts/pending`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            const parsedAccepted = (acceptedRes.data.data || []).map((c) => {
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

            const parsedPending = pendingRes.data.data || [];

            setAccepted(sortByLastMessage(parsedAccepted));
            setPending(parsedPending);
        } catch (e) {
            console.error("Error en fetchAllContacts:", e);
        } finally {
            setIsLoading(false);
        }
    }, [activeUser?._id]);

    useEffect(() => {
        fetchAllContacts();
    }, [fetchAllContacts]);

    const sendRequest = async (receiverId) => {
        await axios.post(
            `${API_BASE}/api/contacts`,
            { receiver_id: receiverId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchAllContacts();
    };

    const acceptRequest = async (contactId) => {
        await axios.put(
            `${API_BASE}/api/contacts/${contactId}`,
            { status: "aceptado" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchAllContacts();
    };

    const rejectRequest = async (contactId) => {
        await axios.put(
            `${API_BASE}/api/contacts/${contactId}`,
            { status: "rechazado" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchAllContacts();
    };

    const deleteRequest = async (contactId) => {
        await axios.delete(`${API_BASE}/api/contacts/${contactId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchAllContacts();
    };

    const updateLastMessageLocally = (userId, text, time = new Date()) => {
        setAccepted((prev) =>
            sortByLastMessage(
                prev.map((c) =>
                    c.user_id === userId
                        ? {
                            ...c,
                            last_message: text,
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
                accepted,
                pending,
                isLoading,

                fetchAllContacts,
                sendRequest,
                acceptRequest,
                rejectRequest,
                deleteRequest,

                updateLastMessageLocally,
            }}
        >
            {children}
        </ContactsContext.Provider>
    );
};

export default ContactsContextProvider;
