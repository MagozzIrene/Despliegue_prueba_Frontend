/* import { useParams } from "react-router";
import { ContactsContext } from "@/context/ContactsContext";
import { useContext } from "react";

const ChatHeader = () => {
    const { chatId } = useParams();
    const { contacts } = useContext(ContactsContext);

    const activeContact = contacts.find(c => c.user_id === chatId);

    if (!activeContact) return null;

    return (
        <header className="chat-header">
            <img 
                src={activeContact.avatar}
                alt={activeContact.name}
                className="chat-header__avatar"
            />
            <h2 className="chat-header__name">{activeContact.name}</h2>
        </header>
    );
};

export default ChatHeader;
 */

import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import { ContactsContext } from "@/context/ContactsContext";
import { formatLastSeenCompact } from "@/utils/date";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const AUTH_KEY = "auth_token";

const ChatHeader = () => {
    const { chatId } = useParams();
    const { contacts, isLoadingContacts } = useContext(ContactsContext);

    const activeContact =
        contacts.find(c => String(c.contact_id) === String(chatId)) ||
        contacts.find(c => String(c.user_id) === String(chatId)) ||
        null;

    const otherUserId = activeContact?.user_id || null;

    const [presence, setPresence] = useState(null);
    const [loadingPresence, setLoadingPresence] = useState(false);

    useEffect(() => {
        if (!otherUserId) {
            setPresence(null);
            return;
        }
        const controller = new AbortController();
        const token = localStorage.getItem(AUTH_KEY);

        (async () => {
            try {
                setLoadingPresence(true);
                const res = await fetch(`${API_BASE}/api/presence/${otherUserId}`, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    signal: controller.signal,
                });
                const json = await res.json();
                if (json?.ok) setPresence(json.data);
            } finally {
                setLoadingPresence(false);
            }
        })();

        return () => controller.abort();
    }, [otherUserId]);

    if (isLoadingContacts) {
        return (
            <header className="chat-header">
                <div className="chat-header__skeleton" />
            </header>
        );
    }

    if (!activeContact) {
        return (
            <header className="chat-header">
                <h2 className="chat-header__name">Chat</h2>
                <span className="chat-header__meta">—</span>
            </header>
        );
    }

    const statusText = presence?.is_online
        ? "En línea"
        : formatLastSeenCompact(presence?.last_seen);

    return (
        <header className="chat-header">
            <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="chat-header__avatar"
            />
            <div className="chat-header__info">
                <h2 className="chat-header__name">{activeContact.name}</h2>
                <span className="chat-header__meta">
                    {loadingPresence ? "Comprobando estado…" : statusText}
                </span>
            </div>
        </header>
    );
}

export default ChatHeader;