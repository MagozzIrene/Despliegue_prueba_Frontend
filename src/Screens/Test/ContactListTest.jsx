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
                <ul style={{ listStyle: "none", padding: 0 }}>
    {contacts.map((contact) => {
    const user = contact.receiver_id || contact.requester_id;
    return (
        <li
        key={contact._id}
        style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem"
        }}
        >
        <img
            src={user?.avatar || "https://api.dicebear.com/8.x/avataaars/svg?seed=Anonimo&radius=50&size=70"}
            alt={`Avatar de ${user?.name || "Usuario"}`}
            style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            objectFit: "cover"
            }}
        />
        <span>{user?.name || "Sin nombre"}</span>
        </li>
    );
    })}
</ul>
            )}
        </div>
    );
};

export default ContactListTest;
