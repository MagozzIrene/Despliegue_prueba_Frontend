import React from "react";

const TabHeader = ({ icon, title }) => {
    return (
        <div className="tab-header">
            <span className="tab-header__icon">{icon}</span>
            <h2 className="tab-header__title">{title}</h2>
        </div>
    );
};

export default TabHeader;
