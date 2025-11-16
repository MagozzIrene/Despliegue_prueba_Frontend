import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import "../styles/ChatScreen.css";
import { formatMessageTime } from "@/services/authService";

const MessageList = ({ messages }) => {
    const { activeUser } = useContext(AuthContext);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!messages?.length) {
        return (
            <div className="message-list message-list--empty">
                <p>No hay mensajes todavía 💬</p>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages.map((msg) => {

                const getSenderId = (msg) =>
                    msg?.sender?._id ??
                    msg?.sender_id?._id ??
                    msg?.sender_id ??
                    msg?.senderId ??
                    msg?.user_id ??
                    msg?.user?._id ??
                    null;

                const isOwnMessage = getSenderId(msg) === activeUser._id;

                return (
                    <div
                        key={msg._id}
                        className={`message-item ${isOwnMessage ? "message--own" : "message--other"
                            } message-appeared`}
                    >
                        <p>{msg.text}</p>

                        <small className="message-time">
                            {formatMessageTime(msg.sent_at)}
                        </small>

                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
