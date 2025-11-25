import { useParams } from "react-router";
import { useState } from "react";
import useIsMobile from "@/hooks/useIsMobile";

import ContactsTabs from "@/features/contacts/components/ContactsTabs";
import ChatScreen from "@/features/chat/screens/ChatScreen";
import "../layouts/styles/MainLayout.css";
import SidebarTabs from "./SidebarTabs";
import GroupChatScreen from "../groups/screens/GroupChatScreen";

const MainLayout = () => {
    const { chatId, groupId } = useParams();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState("accepted");

    if (isMobile) {
        if (!chatId && !groupId) {
            return (
                <div className="mobile-layout chat-list">
                    <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="contacts-container">
                        <ContactsTabs activeTab={activeTab} />
                    </div>
                </div>
            );
        }

        return (
            <div className="mobile-chat-layout chat-open">
                {groupId ? (
                    <GroupChatScreen isMobile />
                ) : (
                    <ChatScreen isMobile />
                )}
            </div>
        );
    }

    return (
        <div className="main-layout">
            <div className="main-layout__left">
                <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <div className="contacts-container">
                    <ContactsTabs activeTab={activeTab} />
                </div>
            </div>

            <div className="main-layout__right">
                {groupId ? (
                    <GroupChatScreen />
                ) : chatId ? (
                    <ChatScreen />
                ) : (
                    <div className="main-layout__placeholder">
                        <div className="placeholder-content">
                            <img src="/logo-wa-style.svg" alt="" />
                            <h2>Phantom Chats Web</h2>
                            <p>Seleccioná un chat para comenzar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default MainLayout;
