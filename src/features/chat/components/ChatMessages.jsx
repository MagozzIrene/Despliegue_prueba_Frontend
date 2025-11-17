import React, { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import "../styles/ChatMessages.css";

const ChatMessages = ({ messages, members = [], showSender = false }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="chat-messages">
            <MessageList messages={messages} members={members} showSender={showSender} />
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
