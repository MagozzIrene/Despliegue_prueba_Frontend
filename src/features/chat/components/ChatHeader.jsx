import { useParams } from "react-router";
import { ContactsContext } from "@/context/ContactsContext";
import { useContext } from "react";

const ChatHeader = () => {
    const { chatId } = useParams();
    const { contacts } = useContext(ContactsContext);

    const activeContact = contacts.find(c => c.user_id === chatId);

    if (!activeContact) return null;

    return (
        <header className="chat-header">
            <img 
                src={activeContact.avatar}
                alt={activeContact.name}
                className="chat-header__avatar"
            />
            <h2 className="chat-header__name">{activeContact.name}</h2>
        </header>
    );
};

export default ChatHeader;
