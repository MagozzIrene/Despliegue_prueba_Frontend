import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { MessagesContext } from "@/context/MessagesContext";
import { GroupsContext } from "@/context/GroupsContext";
import { AuthContext } from "@/context/AuthContext";

import GroupChatHeader from "../components/GroupChatHeader";
import MessageList from "@/features/chat/components/MessageList";
import MessageForm from "@/features/chat/components/MessageForm";
import Loader from "@/shared/Loader";

import "../styles/GroupChatScreen.css";
import "../../chat/styles/chat.css"
import "../../chat/styles/MessageForm.css"

const GroupChatScreen = () => {
    const { groupId } = useParams();

    const { getMembers } = useContext(GroupsContext);
    const { activeUser } = useContext(AuthContext);

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
        deleteGroupMessage,
    } = useContext(MessagesContext);

    useEffect(() => {
        if (groupId) fetchGroupMessages(groupId);
    }, [groupId, fetchGroupMessages]);

    const handleSend = (text) => {
        if (groupId) sendGroupMessage(text, groupId);
    };

    return (
        <div className="chat-screen">

            <GroupChatHeader />
            
                {isLoading ? (
                    <Loader message="Cargando mensajes..." size={40} />
                ) : (
                    <MessageList
                        messages={messages}
                        members={groupMembers}
                        isGroup={true}
                        myId={activeUser?._id}
                        groupMembersLength={groupMembers.length}
                        onDelete={deleteGroupMessage}
                    />
                )}

            <MessageForm onSend={handleSend} />
        </div>
    );
};

export default GroupChatScreen;
