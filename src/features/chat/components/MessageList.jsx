import { useContext, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import "../styles/ChatScreen.css";
import { formatMessageTime } from "@/services/authService";

const MessageList = ({ messages, members = [], showSender = false }) => {
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

    const byId = useMemo(() => {
        const map = {};
        for (const m of members) {
            const uid = m?.user_id?._id ?? m?.user?._id ?? m?.user_id ?? m?.user;
            const name = m?.user_id?.name ?? m?.user?.name ?? m?.name ?? "Miembro";
            if (uid) map[uid] = name;
        }
        return map;
    }, [members]);

    const getSenderId = (msg) =>
        msg?.sender?._id ??
        msg?.sender_id?._id ??
        msg?.sender_id ??
        msg?.senderId ??
        msg?.user_id ??
        msg?.user?._id ??
        null;

    return (
        <div className="message-list">
            {messages.map((msg) => {
                const senderId = getSenderId(msg);
                const isOwnMessage = senderId === activeUser._id;

                const senderLabel = isOwnMessage
                    ? "Tú"
                    : (byId[senderId] || msg?.sender?.name || "Miembro");

                return (
                    <div
                        key={msg._id}
                        className={`message-item ${isOwnMessage ? "message--own" : "message--other"}`}
                    >
                        {/* Etiqueta de remitente (solo en grupos / cuando se pide) */}
                        {showSender && (
                            <small className={`message-sender ${isOwnMessage ? "me" : "other"}`}>
                                {senderLabel}
                            </small>
                        )}

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
