import React, { useState } from "react";
import ContactListHeader from "../components/ContactListHeader";
import ContactList from "../components/ContactList";
import "../styles/ContactScreen.css";

const ContactScreen = ({ toggleTheme, isLight }) => {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="contact-screen">
            <ContactListHeader
                onSearchChange={setSearchTerm}
                toggleTheme={toggleTheme}
                isLight={isLight}
            />
            <ContactList searchTerm={searchTerm} onSelect={(id) => console.log("Chat con:", id)} />
        </div>
    );
};

export default ContactScreen;
