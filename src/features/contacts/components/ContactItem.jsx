import ContactCard from "./ContactCard";
import "../styles/ContactItem.css"

export default function ContactItem({ contact, isActive }) {
    return (
        <div className={`contact-item ${isActive ? "active" : ""}`}>
            <ContactCard
                id={contact.user_id}
                name={contact.name}
                avatar={contact.avatar}
                last_message={contact.last_message}
                last_message_time={contact.last_message_time}
                isActive={isActive}
            />
        </div>
    );
}
