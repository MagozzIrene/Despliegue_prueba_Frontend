import { useNavigate } from "react-router";
import ChatScreen from "./ChatScreen";

export default function MobileChatScreen() {
    const navigate = useNavigate();

    return (
        <div className="mobile-chat-screen">
            <div className="mobile-chat-header">
                <button className="back-btn" onClick={() => navigate("/")}>
                    ←
                </button>
                <p>Chat</p>
            </div>

            <ChatScreen />
        </div>
    );
}
