import React, { useEffect } from "react";
import { useParams } from "react-router";
import { MessagesContext } from "@/context/MessagesContext";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageForm from "../components/MessageForm";
import "../styles/ChatScreen.css";
import Loader from "../../shared/Loader";

const ChatScreen = () => {

    const { chatId } = useParams();

    const {
        messages,
        fetchMessages,
        isLoading,
        addNewMessage,
    } = React.useContext(MessagesContext);

    useEffect(() => {
        if (chatId) fetchMessages(chatId);
    }, [chatId, fetchMessages]);

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
                <MessageList messages={messages} />
            )}

            <MessageForm onSend={handleSendMessage} />
        </div>
    );
};

export default ChatScreen;
