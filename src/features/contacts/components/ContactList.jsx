import { useContext } from "react";
import { ContactsContext } from "@/context/ContactsContext";
import "../styles/ContactList.css";
import ContactsTabs from "./ContactsTabs";

const ContactList = ({ searchTerm }) => {
    const { contacts, isLoadingContacts } = useContext(ContactsContext);

    if (isLoadingContacts) {
        return (
            <div className="contact-list">
                {/* <LoaderSpinner /> */}
            </div>
        );
    }

    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredContacts.length === 0) {
        return (
            <div className="contact-list__empty">
                <p>No hay contactos para mostrar 😢</p>
            </div>
        );
    }

    return (
        <div className="contact-list-container">
            <ContactsTabs />
        </div>
    );
};

export default ContactList;
