import { useContext } from "react";
import { ContactsContext } from "../../context/ContactsContext";
import { AuthContext } from "../../context/AuthContext";

const ContactListTest = () => {
    const { contacts, loading, error } = useContext(ContactsContext);
    const { activeUser } = useContext(AuthContext);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Mis contactos</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {contacts.map((c) => (
                    <li
                        key={c._id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                            background: "#f5f5f5",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            maxWidth: "300px"
                        }}
                    >
                        <img
                            src={
                                c.avatar ||
                                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                            }
                            alt={c.name}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                objectFit: "cover",
                            }}
                        />
                        <div>
                            <strong>{c.name}</strong>
                            <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                {c.email}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#009688" }}>
                                {c.status}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ContactListTest;
