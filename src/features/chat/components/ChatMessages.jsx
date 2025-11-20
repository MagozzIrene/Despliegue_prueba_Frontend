import { useEffect, useRef } from "react";
import MessageList from "./MessageList";
import "../styles/ChatMessages.css";

const ChatMessages = ({ messages, members = [], showSender = false, myId, isGroup, onDelete, groupMembersLength }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="chat-messages">
            <MessageList
                messages={messages}
                members={members}
                showSender={showSender}
                myId={myId}
                isGroup={isGroup}
                onDelete={onDelete}
                groupMembersLength={groupMembersLength} 
            />
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatMessages;
