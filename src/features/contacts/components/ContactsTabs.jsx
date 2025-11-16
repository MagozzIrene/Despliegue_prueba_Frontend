import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ContactsContext } from "@/context/ContactsContext";
import ContactCard from "../components/ContactCard";
import AddContactForm from "../components/AddContactForm";
import PanelHeader from "./PanelHeader";
import Loader from "../../shared/Loader";

import { GroupsContext } from "@/context/GroupsContext";
import GroupCard from "@/features/groups/components/GroupCard";
import CreateGroupModal from "@/features/groups/components/CreateGroupModal";

import "../styles/ContactsTabs.css";

const ContactsTabs = ({ activeTab }) => {

    const {
        contacts: acceptedContacts,
        fetchContacts,
        isLoadingContacts
    } = useContext(ContactsContext);

    const [tabContacts, setTabContacts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

    useEffect(() => {
        let alive = true;

        const loadData = async () => {
            setLoading(true);

            if (activeTab === "accepted") {
                await fetchContacts();
                setTimeout(() => {
                    if (alive) setLoading(false);
                }, 120);
                return;
            }

            const token = localStorage.getItem("auth_token");
            const endpoint =
                activeTab === "pending"
                    ? "/api/contacts/pending"
                    : "/api/groups";

            try {
                const { data } = await axios.get(`${API_BASE}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (alive) {
                    setTabContacts(data.data || []);
                    setTimeout(() => setLoading(false), 120);
                }
            } catch (err) {
                console.error(err);
                if (alive) setLoading(false);
            }
        };

        loadData();
        return () => (alive = false);
    }, [activeTab]);

    const filteredAccepted =
        activeTab === "accepted"
            ? acceptedContacts.filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
            )
            : [];

    const filteredPendingOrGroups =
        activeTab !== "accepted"
            ? tabContacts.filter((c) => {
                const otherUser =
                    c.requester_id?._id === currentUserId
                        ? c.receiver_id
                        : c.requester_id;

                const name =
                    otherUser?.name?.toLowerCase() ||
                    c.name?.toLowerCase() ||
                    "";

                return name.includes(search.toLowerCase());
            })
            : [];

    const sortedAccepted = [...filteredAccepted].sort((a, b) => {
        const tA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
        const tB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
        return tB - tA;
    });

    const handleAccept = async (id) => {
        const token = localStorage.getItem("auth_token");

        await axios.put(
            `${API_BASE}/api/contacts/${id}`,
            { status: "aceptado" },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setTabContacts((p) => p.filter((c) => c._id !== id));

        fetchContacts();
    };

    const handleReject = async (id) => {
        const token = localStorage.getItem("auth_token");

        await axios.put(
            `${API_BASE}/api/contacts/${id}`,
            { status: "rechazado" },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setTabContacts((p) => p.filter((c) => c._id !== id));
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("auth_token");

        await axios.delete(`${API_BASE}/api/contacts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (activeTab === "accepted") {
            fetchContacts();
        } else {
            setTabContacts((p) => p.filter((c) => c._id !== id));
        }
    };

    const { groups, fetchMyGroups, isLoadingGroups } = useContext(GroupsContext);
    const [showCreate, setShowCreate] = useState(false);

    useEffect(() => {
        if (activeTab === "groups") {
            fetchMyGroups();
        }
    }, [activeTab, fetchMyGroups]);

    return (
        <div className="contacts-tabs">
            <PanelHeader
                title={
                    activeTab === "accepted"
                        ? "Tus chats"
                        : activeTab === "pending"
                            ? "Solicitudes"
                            : "Grupos"
                }
                searchValue={search}
                setSearchValue={setSearch}
            />

            <div className="tabs-content">
                {(loading || (activeTab === "accepted" && isLoadingContacts)) ? (
                    <Loader message="Cargando..." />
                ) : (
                    <>
                        {activeTab === "accepted" &&
                            (sortedAccepted.length > 0 ? (
                                sortedAccepted.map((c) => (
                                    <div key={c.contact_id} className="contact-item">
                                        <ContactCard
                                            id={c.user_id}
                                            name={c.name}
                                            avatar={c.avatar}
                                            last_message={c.last_message}
                                            last_message_time={c.last_message_time}
                                        />

                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(c.contact_id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="empty-msg">No hay chats aún.</p>
                            ))}

                            {activeTab === "pending" && (
                                <>
                                    <AddContactForm
                                        onContactAdded={async () => {
                                            const token = localStorage.getItem("auth_token");
                                            const { data } = await axios.get(`${API_BASE}/api/contacts/pending`, {
                                                headers: { Authorization: `Bearer ${token}` },
                                            });

                                            setTabContacts(data.data || []);
                                        }}
                                    />

                                    {filteredPendingOrGroups.length > 0 ? (
                                        filteredPendingOrGroups.map((c) => {
                                            const otherUser =
                                                c.requester_id?._id === currentUserId
                                                    ? c.receiver_id
                                                    : c.requester_id;

                                            const sentByUser = c.requester_id?._id === currentUserId;

                                            return (
                                                <div key={c._id} className="pending-contact">
                                                    <img
                                                        src={otherUser?.avatar}
                                                        alt=""
                                                        className="pending-contact__avatar"
                                                    />

                                                    <div className="pending-contact__info">
                                                        <h3>{otherUser?.name}</h3>
                                                        <p>{sentByUser ? "Solicitud enviada" : "Te envió una solicitud"}</p>
                                                    </div>

                                                    {!sentByUser ? (
                                                        <div className="pending-contact__actions">
                                                            <button
                                                                className="btn-accept"
                                                                onClick={() => handleAccept(c._id)}
                                                            >
                                                                ✔
                                                            </button>
                                                            <button
                                                                className="btn-reject"
                                                                onClick={() => handleReject(c._id)}
                                                            >
                                                                ✖
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => handleDelete(c._id)}
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="empty-msg">No hay solicitudes.</p>
                                    )}
                                </>
                            )}

                            {activeTab === "groups" && (
                                <>
                                    <div>
                                        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                                            + Crear grupo
                                        </button>
                                    </div>

                                    {isLoadingGroups ? (
                                        <Loader message="Cargando..." />
                                    ) : groups.length > 0 ? (
                                        groups
                                        .filter((g) => (g.name || "").toLowerCase().includes(search.toLowerCase()))
                                        .map((g) => <GroupCard key={g._id} group={g} />)
                                ) : (
                                    <p className="empty-msg">No pertenecés a grupos.</p>
                                )}

                                {showCreate && <CreateGroupModal onClose={()=>setShowCreate(false)} />}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ContactsTabs;
