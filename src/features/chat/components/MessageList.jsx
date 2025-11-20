/* import { useContext, useEffect, useMemo, useRef } from "react";
import { AuthContext } from "@/context/AuthContext";
import { MessagesContext } from "@/context/MessagesContext";
import "../styles/ChatScreen.css";
import { formatMessageTime } from "@/services/authService";

const fallbackAvatar = (seed = "user") =>
    `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

const getId = (v) =>
    (typeof v === "object" && v !== null ? (v._id || v.id) : v) ?? null;

const normalizeSenderId = (msg) =>
    getId(
        msg?.sender ??
        msg?.sender_id ??
        msg?.senderId ??
        msg?.user ??
        msg?.user_id
    );

const MessageList = ({
    messages,
    members = [],
    showSender = false,
    myId,
    isGroup,
    onDelete,
    groupMembersLength = 0,
}) => {
    const { activeUser } = useContext(AuthContext);
    const { markGroupMessageAsRead } = useContext(MessagesContext);

    const bottomRef = useRef(null);
    const observerRef = useRef(null); 

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!isGroup) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.dataset.messageId;
                        if (messageId) {
                            markGroupMessageAsRead(messageId);
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isGroup, markGroupMessageAsRead]);

    const byId = useMemo(() => {
        const map = {};
        const colors = ["#8bc34a", "#03a9f4", "#e91e63", "#ff9800", "#9c27b0", "#ffc107"];

        const hash = (str) => {
            let h = 0;
            for (let i = 0; i < str.length; i++) {
                h = str.charCodeAt(i) + ((h << 5) - h);
            }
            return Math.abs(h);
        };

        for (const m of members) {
            const uid = getId(m?.user_id) ?? getId(m?.user) ?? getId(m?._id);
            if (!uid) continue;

            const name =
                m?.name ??
                m?.user_id?.name ??
                m?.user?.name ??
                "Miembro";

            const avatar =
                m?.avatar ??
                m?.user_id?.avatar ??
                m?.user?.avatar ??
                null;

            const color = colors[hash(String(uid)) % colors.length];

            map[String(uid)] = { name, avatar, color };
        }

        return map;
    }, [members]);

    if (!messages?.length) {
        return (
            <div className="message-list message-list--empty">
                <p>No hay mensajes todavía 💬</p>
            </div>
        );
    }

    return (
        <div className="message-list">
            {messages.map((msg, i) => {
                const senderId = String(normalizeSenderId(msg) ?? "");
                const currentUserId = String(myId ?? activeUser?._id ?? "");
                const isOwnMessage = senderId === currentUserId;

                const prev = messages[i - 1];
                const prevSenderId = prev ? String(normalizeSenderId(prev)) : null;
                const senderChanged = !prev || prevSenderId !== senderId;

                const member = byId[senderId] || {};
                const name = member.name || msg?.sender?.name || "Miembro";
                const avatar = member.avatar || msg?.sender?.avatar || fallbackAvatar(name);

                let showChecks = false;
                let checksClass = "";

                if (isOwnMessage) {
                    if (!isGroup) {
                        showChecks = true;
                        checksClass = msg.read
                            ? "msg-status--read"
                            : "msg-status--sent";
                    } else {
                        const readBy = msg.read_by || [];
                        const othersCount = Math.max(groupMembersLength - 1, 0);

                        if (readBy.length > 0) {
                            showChecks = true;
                            if (othersCount > 0 && readBy.length >= othersCount) {
                                checksClass = "msg-status--read";
                            } else {
                                checksClass = "msg-status--sent";
                            }
                        }
                    }
                }

                let lastEl = null;
                const refCallback = (el) => {
                    const observer = observerRef.current;
                    if (!observer || !isGroup || isOwnMessage) return;

                    if (el) {
                        lastEl = el;
                        el.dataset.messageId = msg._id;
                        observer.observe(el);
                    } else if (lastEl) {
                        observer.unobserve(lastEl);
                    }
                };

                return (
                    <div
                        key={msg._id || i}
                        className={`message-row ${isOwnMessage ? "own" : "other"}`}
                        ref={isGroup && !isOwnMessage ? refCallback : null}
                    >

                        {isOwnMessage && onDelete && (
                            <button
                                className="msg-delete-btn"
                                onClick={() => onDelete(msg._id)}
                            >
                                🗑
                            </button>
                        )}

                        {isGroup ? (
                            !isOwnMessage && senderChanged ? (
                                <img className="msg-avatar" src={avatar} alt={name} />
                            ) : (
                                <div className="msg-avatar-spacer"></div>
                            )
                        ) : null}

                        <div className="msg-bubble">
                            {isGroup && !isOwnMessage && senderChanged && (
                                <span className="msg-sender-name" style={{ color: member.color }}>
                                    {name}
                                </span>
                            )}

                            <p className="msg-text">{msg.text}</p>

                            <span className="msg-time">
                                {formatMessageTime(msg.sent_at)}{" "}
                                {showChecks && (
                                    <span className={`msg-status ${checksClass}`}>
                                        ✔✔
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList; */


import { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";
import useAutoScroll from "@/hooks/useAutoScroll";
import useMessageObserver from "@/hooks/useMessageObserver";

import "../styles/ChatScreen.css";

const MessageList = ({
    messages,
    members = [],
    myId,
    isGroup,
    onDelete,
    groupMembersLength = 0,
}) => {
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
        <div className="message-list">
            {messages.map((msg, index) => (
                <MessageItem
                    key={msg._id || index}
                    msg={msg}
                    index={index}
                    messages={messages}
                    members={members}
                    myId={myId}
                    isGroup={isGroup}
                    onDelete={onDelete}
                    groupMembersLength={groupMembersLength}
                    observerRef={observerRef}
                />
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

export default MessageList;
