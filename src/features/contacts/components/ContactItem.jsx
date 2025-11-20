import ContactCard from "./ContactCard";

export default function ContactItem({ contact }) {
    return (
        <div className="contact-item">
            <ContactCard
                id={contact.user_id}
                name={contact.name}
                avatar={contact.avatar}
                last_message={contact.last_message}
                last_message_time={contact.last_message_time}
            />
        </div>
    );
}
