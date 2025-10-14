import { useContext, useEffect } from "react";
import { ContactsContext } from "../../context/ContactsContext";

const ContactListTest = () => {
    const { contacts, isLoadingContacts, fetchContacts } = useContext(ContactsContext);

    useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    if (isLoadingContacts) {
        return <p style={{ textAlign: "center" }}>Cargando contactos...</p>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Lista de contactos</h2>
            {contacts.length === 0 ? (
                <p>No hay contactos aceptados todavía.</p>
            ) : (
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact._id}>
                            {contact.receiver_id?.name || contact.requester_id?.name || "Sin nombre"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ContactListTest;
