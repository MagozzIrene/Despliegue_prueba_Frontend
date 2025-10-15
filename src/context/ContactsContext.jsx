import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ContactsContext = createContext({
    contacts: [],
    isLoadingContacts: true,
    fetchContacts: () => { },
    addContact: () => { },
    acceptContact: () => { },
    removeContact: () => { },
});

const ContactsContextProvider = ({ children }) => {
    const [contacts, setContacts] = useState([]);
    const [isLoadingContacts, setIsLoadingContacts] = useState(true);
    const { activeUser } = useContext(AuthContext);

    const API_BASE =
        import.meta.env.VITE_BACKEND_URL || "https://despliegue-prueba-backend.vercel.app";

    const fetchContacts = useCallback(async () => {
        if (!activeUser?._id) return;
        setIsLoadingContacts(true);

        try {
            const token = localStorage.getItem("auth_token");
            const { data } = await axios.get(
                `${API_BASE}/api/contacts/${activeUser._id}/accepted`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setContacts(data.data || []);
        } catch (error) {
            console.error("Error al cargar contactos:", error);
        } finally {
            setIsLoadingContacts(false);
        }
    }, [activeUser?._id]);

    const addContact = async (receiverId) => {
        try {
            const token = localStorage.getItem("auth_token");
            const { data } = await axios.post(
                `${API_BASE}/api/contacts`,
                {
                    requester_id: activeUser._id,
                    receiver_id: receiverId,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Solicitud enviada:", data);
        } catch (error) {
            console.error("Error al agregar contacto:", error);
        }
    };

    const acceptContact = async (contactId) => {
        try {
            const token = localStorage.getItem("auth_token");
            const { data } = await axios.put(
                `${API_BASE}/api/contacts/${contactId}`,
                { status: "aceptado" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Solicitud aceptada:", data);
            await fetchContacts();
        } catch (error) {
            console.error("Error al aceptar contacto:", error);
        }
    };

    const removeContact = async (contactId) => {
        try {
            const token = localStorage.getItem("auth_token");
            await axios.delete(`${API_BASE}/api/contacts/${contactId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts((prev) => prev.filter((c) => c._id !== contactId));
        } catch (error) {
            console.error("Error al eliminar contacto:", error);
        }
    };

    useEffect(() => {
        if (activeUser?._id) {
            fetchContacts();
        }
    }, [activeUser?._id, fetchContacts]);

    return (
        <ContactsContext.Provider
            value={{
                contacts,
                isLoadingContacts,
                fetchContacts,
                addContact,
                acceptContact,
                removeContact,
            }}
        >
            {children}
        </ContactsContext.Provider>
    );
};

export default ContactsContextProvider;
