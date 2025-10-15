import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

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

    const API_BASE = import.meta.env.VITE_BACKEND_URL || "https://despliegue-prueba-backend.vercel.app/";

    let currentUser = {};
    try {
        const raw = localStorage.getItem("user");
        currentUser = raw ? JSON.parse(raw) : {};
    } catch {
        currentUser = {};
    }

    const fetchContacts = useCallback(async () => {
        if (!currentUser?._id) return;
        setIsLoadingContacts(true);

        try {
            const { data } = await axios.get(`${API_BASE}/api/contacts/${currentUser._id}/accepted`);
            setContacts(data.data || []);
        } catch (error) {
            console.error("Error al cargar contactos:", error);
        } finally {
            setIsLoadingContacts(false);
        }
    }, [currentUser?._id]);

    const addContact = async (receiverId) => {
        try {
            const { data } = await axios.post(`${API_BASE}/api/contacts`, {
                requester_id: currentUser._id,
                receiver_id: receiverId,
            });
            console.log("Solicitud enviada:", data);
        } catch (error) {
            console.error("Error al agregar contacto:", error);
        }
    };

    const acceptContact = async (contactId) => {
        try {
            const { data } = await axios.put(`${API_BASE}/api/contacts/${contactId}`, {
                status: "aceptado",
            });
            console.log("Solicitud aceptada:", data);
            await fetchContacts();
        } catch (error) {
            console.error("Error al aceptar contacto:", error);
        }
    };

    const removeContact = async (contactId) => {
        try {
            await axios.delete(`${API_BASE}/api/contacts/${contactId}`);
            setContacts((prev) => prev.filter((c) => c._id !== contactId));
        } catch (error) {
            console.error("Error al eliminar contacto:", error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

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
