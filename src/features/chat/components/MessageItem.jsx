import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { formatMessageTime } from "@/services/authService";
import useMessageSenderData from "@/hooks/useMessageSenderData";
import { FiTrash2 } from "react-icons/fi";

const MessageItem = ({
    msg,
    index,
    messages,
    members,
    myId,
    isGroup,
    groupMembersLength,
    onDelete,
    observerRef,
}) => {
    const { activeUser } = useContext(AuthContext);

    const {
        senderId,
        isOwnMessage,
        senderChanged,
        senderName,
        senderAvatar,
        senderColor,
    } = useMessageSenderData(msg, index, messages, members, myId, activeUser);

    let showChecks = false;
    let checksClass = "";

    if (isOwnMessage) {
        if (!isGroup) {
            showChecks = true;
            checksClass = msg.read ? "msg-status--read" : "msg-status--sent";
        } else {
            const readBy = msg.read_by || [];
            const othersCount = Math.max(groupMembersLength - 1, 0);

            if (readBy.length > 0) {
                showChecks = true;
                checksClass =
                    othersCount > 0 && readBy.length >= othersCount
                        ? "msg-status--read"
                        : "msg-status--sent";
            }
        }
    }

    const refCallback = (el) => {
        if (!isGroup || isOwnMessage || !observerRef.current) return;

        if (el) {
            const id = msg._id || msg.id;
            if (!id) return;

            el.dataset.messageId = id;
            observerRef.current.observe(el);
        }
    };

    return (
        <div
            className={`message-row ${isOwnMessage ? "own" : "other"}`}
            ref={refCallback}
        >
            {isOwnMessage && onDelete && (
                <button
                    className="msg-delete-btn"
                    onClick={() => onDelete(msg._id || msg.id)}
                    aria-label="Eliminar mensaje"
                    title="Eliminar mensaje"
                >
                    <FiTrash2 />
                </button>
            )}

            {isGroup && !isOwnMessage ? (
                senderChanged ? (
                    <img className="msg-avatar" src={senderAvatar} alt={senderName} />
                ) : (
                    <div className="msg-avatar-spacer"></div>
                )
            ) : null}

            <div className="msg-bubble">
                {isGroup && !isOwnMessage && senderChanged && (
                    <span className="msg-sender-name" style={{ color: senderColor }}>
                        {senderName}
                    </span>
                )}

                <p className="msg-text">{msg.text}</p>

                <span className="msg-time">
                    {formatMessageTime(msg.sent_at)}{" "}
                    {showChecks && (
                        <span className={`msg-status ${checksClass}`}>✔✔</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default MessageItem;
