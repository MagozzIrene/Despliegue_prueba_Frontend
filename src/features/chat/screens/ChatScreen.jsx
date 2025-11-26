import { useEffect, useContext } from "react";
import { useParams } from "react-router";
import { MessagesContext } from "@/context/MessagesContext";
import { AuthContext } from "@/context/AuthContext";

import ChatHeader from "../components/ChatHeader"
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";

import "../styles/chat.css"
import "../styles/MessageForm.css"
import Loader from "@/shared/Loader";

const ChatScreen = () => {

    const { chatId } = useParams();
    const { activeUser } = useContext(AuthContext);

    const {
        messages,
        fetchMessages,
        isLoading,
        addNewMessage,
        markPrivateMessageAsRead,
        deletePrivateMessage,
    } = useContext(MessagesContext);

    const storedUser = JSON.parse(localStorage.getItem("auth_user") || "{}");
    const myUserId = activeUser?._id || storedUser?._id;

    useEffect(() => {
        if (chatId) fetchMessages(chatId);
    }, [chatId, fetchMessages]);

    useEffect(() => {
    if (!chatId || !messages.length || !myUserId) return;

    messages.forEach((m) => {
        if (m.sender?._id !== myUserId && !m.read) {
            markPrivateMessageAsRead(m._id);
        }
    });
}, [messages, chatId, myUserId, markPrivateMessageAsRead]);


    const handleSendMessage = async (text) => {
        await addNewMessage(text, chatId);
    };

    if (!chatId) {
        return (
            <div className="chat-placeholder">
                <p>Seleccioná un contacto para chatear 💬</p>
            </div>
        );
    }

    return (
        <div className="chat-screen">
            <ChatHeader />

            {isLoading ? (
                <Loader message="Cargando mensajes..." size={40} />
            ) : (
                <MessageList
                    messages={messages}
                    onDelete={deletePrivateMessage}
                />
            )}

            <MessageForm onSend={handleSendMessage} />
        </div>
    );
};

export default ChatScreen;
