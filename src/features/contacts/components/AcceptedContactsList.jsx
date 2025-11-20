import ContactItem from "./ContactItem";

export default function AcceptedContactsList({ contacts }) {
    if (contacts.length === 0) {
        return <p className="empty-msg">No hay chats aún.</p>;
    }

    return (
        <>
            {contacts.map((c) => (
                <ContactItem key={c.contact_id} contact={c} />
            ))}
        </>
    );
}
