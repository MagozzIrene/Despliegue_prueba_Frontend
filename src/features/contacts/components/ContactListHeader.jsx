import React, { useState } from "react";
const ContactListHeader = ({ onSearchChange}) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        onSearchChange(value);
    };

    return (
        <header className="contact-list-header">
            <div className="contact-list-header__content">
                <h1>Phantom Chats</h1>
            </div>

{/*             <Filter
                value={searchTerm}
                onChange={handleSearchChange}
                filterId="contact-filter"
                placeholder="Buscar contacto..."
            /> */}
        </header>
    );
};

export default ContactListHeader;
