import React, { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import "../styles/ChatMessages.css";

const ChatMessages = ({ messages }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="chat-messages">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
