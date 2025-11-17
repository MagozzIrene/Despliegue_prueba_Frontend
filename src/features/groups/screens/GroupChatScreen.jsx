import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MessagesContext } from "@/context/MessagesContext";

import "../styles/GroupChatScreen.css";
import GroupChatHeader from "../components/GroupChatHeader";
import MessageForm from "@/features/chat/components/MessageForm";
import ChatMessages from "@/features/chat/components/ChatMessages";
import { GroupsContext } from "@/context/GroupsContext";

const GroupChatScreen = () => {
    const { groupId } = useParams();

    const { getMembers } = useContext(GroupsContext);

    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        (async () => {
            const m = await getMembers(groupId);
            setGroupMembers(Array.isArray(m) ? m : (m?.members ?? []));
        })();
    }, [groupId, getMembers]);



    const {
        messages,
        isLoading,
        fetchGroupMessages,
        sendGroupMessage,
    } = useContext(MessagesContext);

    useEffect(() => {
        if (groupId) fetchGroupMessages(groupId);
    }, [groupId, fetchGroupMessages]);

    const handleSend = (text) => {
        if (groupId) sendGroupMessage(text, groupId);
    };

    return (
        <div className="group-chat">
            <GroupChatHeader />

            <div className="group-chat__content">
                {isLoading ? (
                    <p className="loading">Cargando mensajes…</p>
                ) : (
                    <ChatMessages messages={messages} members={groupMembers} showSender />
                )}
            </div>

            <div className="group-chat__form">
                <MessageForm onSend={handleSend} />
            </div>
        </div>
    );
};

export default GroupChatScreen;
