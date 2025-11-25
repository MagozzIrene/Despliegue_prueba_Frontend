import { Fragment, memo, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import useAutoScroll from "@/hooks/useAutoScroll";
import useMessageObserver from "@/hooks/useMessageObserver";
import ConfirmModal from "@/shared/ConfirmModal";

const getMessageDate = (msg) => {
    if (!msg) return null;
    const raw = msg.sent_at || msg.created_at || msg.date;
    if (!raw) return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
};

const isSameDay = (a, b) =>
    a &&
    b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const getDateLabel = (date) => {
    if (!date) return "";

    const today = new Date();
    const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const msgMid = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffMs = todayMid.getTime() - msgMid.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";

    return date.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "short",
        year: today.getFullYear() === date.getFullYear() ? undefined : "numeric",
    });
};

const getDateLabelForMessage = (messages, index) => {
    const msg = messages[index];
    const currentDate = getMessageDate(msg);
    if (!currentDate) return "";

    const prev = messages[index - 1];
    const prevDate = getMessageDate(prev);

    if (prevDate && isSameDay(prevDate, currentDate)) return "";

    return getDateLabel(currentDate);
};

const MessageList = ({
    messages,
    members = [],
    myId,
    isGroup,
    onDelete,
    groupMembersLength = 0,
}) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    const handleAskDelete = (messageId) => {
        setMessageToDelete(messageId);
        setShowDeleteModal(true);
    };
    const bottomRef = useRef(null);
    const observerRef = useRef(null);

    useAutoScroll(messages, bottomRef);

    useMessageObserver(isGroup, observerRef);

    if (!messages?.length) {
        return (
            <div className="message-list message-list--empty">
                <p>No hay mensajes todavía 💬</p>
            </div>
        );
    }

    return (
        <div className="message-list" role="list">
            {messages.map((msg, index) => {
                const dateLabel = getDateLabelForMessage(messages, index);

                return (
                    <Fragment key={msg._id || index}>
                        {dateLabel && (
                            <div className="msg-date-separator">
                                <span className="msg-date-separator__pill">
                                    {dateLabel}
                                </span>
                            </div>
                        )}

                        <MessageItem
                            msg={msg}
                            index={index}
                            messages={messages}
                            members={members}
                            myId={myId}
                            isGroup={isGroup}
                            onDelete={handleAskDelete}
                            groupMembersLength={groupMembersLength}
                            observerRef={observerRef}
                        />
                    </Fragment>
                );
            })}
            <div ref={bottomRef} />

            <ConfirmModal
                open={showDeleteModal}
                title="Eliminar mensaje"
                message="¿Seguro que querés eliminar este mensaje? Esta acción no se puede deshacer."
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={async () => {
                    setShowDeleteModal(false);
                    if (messageToDelete) {
                        await onDelete(messageToDelete);
                    }
                    setMessageToDelete(null);
                }}
            />
        </div>
    );
};

export default memo(MessageList);
