/* import { useParams, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { ContactsContext } from "@/context/ContactsContext";
import { formatLastSeenCompact } from "@/utils/date";
import { FiArrowLeft } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import "../styles/ChatHeader.css"

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const AUTH_KEY = "auth_token";

const ChatHeader = () => {
    const { chatId } = useParams();
    const { contacts, isLoadingContacts } = useContext(ContactsContext);
    const [showDelete, setShowDelete] = useState(false);
    const navigate = useNavigate();

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

            <button className="header-back-btn" onClick={() => navigate("/home")}>
                <FiArrowLeft />
            </button>

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
            <button
                className="chat-header__delete"
                onClick={() => setShowDelete(true)}
                title="Eliminar contacto"
            >
                <FiTrash2 size={20} />
            </button>
        </header>
    );
}

export default ChatHeader; */

import { useParams, useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ContactsContext } from "@/context/ContactsContext";
import { formatLastSeenCompact } from "@/utils/date";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import "../styles/ChatHeader.css";
import ConfirmModal from "../../shared/ConfirmModal";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
const AUTH_KEY = "auth_token";

const ChatHeader = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();

    const {
        contacts,
        isLoadingContacts,
        fetchContacts,
    } = useContext(ContactsContext);

    const [presence, setPresence] = useState(null);
    const [loadingPresence, setLoadingPresence] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const activeContact =
        contacts.find((c) => String(c.user_id) === String(chatId)) ||
        contacts.find((c) => String(c.contact_id) === String(chatId)) ||
        null;

    const otherUserId = activeContact?.user_id || null;

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
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    signal: controller.signal,
                });

                const json = await res.json();
                if (json?.ok) setPresence(json.data);
            } catch (e) {
                console.error("Error cargando presencia:", e);
            } finally {
                setLoadingPresence(false);
            }
        })();

        return () => controller.abort();
    }, [otherUserId]);

const handleDeleteContact = async () => {
    if (!activeContact) return;

    try {
        const token = localStorage.getItem(AUTH_KEY);
        const contactDocId = activeContact.contact_id || activeContact._id;

        await axios.delete(
            `${API_BASE}/api/contacts/${contactDocId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        await fetchContacts();
        navigate("/home");
    } catch (e) {
        console.error("Error al eliminar contacto:", e);
    }
};

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
            <button className="header-back-btn" onClick={() => navigate("/home")}>
                <FiArrowLeft />
            </button>

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

            <button
                className="chat-header__delete"
                onClick={() => setShowDelete(true)}
                title="Eliminar contacto"
            >
                <FiTrash2 size={30} />
            </button>
            <ConfirmModal
                open={showDelete}
                title="Eliminar contacto"
                message={`¿Seguro que querés eliminar a "${activeContact.name}" y su conversación? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onCancel={() => setShowDelete(false)}
                onConfirm={async () => {
                    setShowDelete(false);
                    await handleDeleteContact();
                }}
            />
        </header>
    );
};

export default ChatHeader;
