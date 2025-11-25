import { useContext, useState } from "react";
import axios from "axios";

import PanelHeader from "./PanelHeader";
import AddContactForm from "../components/AddContactForm";
import Loader from "@/shared/Loader";

import useSearch from "@/hooks/useSearch";
import useGroupsTab from "@/hooks/useGroupsTab";

import { ContactsContext } from "@/context/ContactsContext";

import "../styles/ContactsTabs.css";
import GroupsList from "../../groups/components/GroupsList";
import PendingContactsList from "./PendingContactsList";
import usePendingContacts from "@/hooks/usePendingContacts";
import useAcceptedContacts from "@/hooks/useAcceptedContacts";
import AcceptedContactsList from "./AcceptedContactsList";
import CreateGroupModal from "../../groups/components/CreateGroupModal";

const ContactsTabs = ({ activeTab }) => {
    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    const token = localStorage.getItem("auth_token");
    const [showCreate, setShowCreate] = useState(false);

    const { handleSearch, search } = useSearch();
    const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

    const { filtered: accepted, isLoadingContacts } = useAcceptedContacts(search);
    const { pending, loading: loadingPending, setPending } = usePendingContacts(
        search,
        API_BASE,
        currentUserId
    );

    const { groups, isLoadingGroups } = useGroupsTab(search, activeTab);

    const { fetchContacts } = useContext(ContactsContext);

    const handleAccept = async (id) => {
        await axios.put(
            `${API_BASE}/api/contacts/${id}`,
            { status: "aceptado" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPending((p) => p.filter((c) => c._id !== id));
        fetchContacts();
    };

    const handleReject = async (id) => {
        await axios.put(
            `${API_BASE}/api/contacts/${id}`,
            { status: "rechazado" },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setPending((p) => p.filter((c) => c._id !== id));
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE}/api/contacts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchContacts();
        setPending((p) => p.filter((c) => c._id !== id));
    };

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
                setSearchValue={handleSearch}
            />

            <div className="tabs-content">
                {activeTab === "accepted" && (
                    isLoadingContacts ? (
                        <Loader message="Cargando..." />
                    ) : (
                        <AcceptedContactsList contacts={accepted} />
                    )
                )}

                {activeTab === "pending" && (
                    <>
                        <AddContactForm
                            onContactAdded={async () => {
                                const { data } = await axios.get(
                                    `${API_BASE}/api/contacts/pending`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );
                                setPending(data?.data || []);
                            }}
                        />
                        {loadingPending ? (
                            <Loader message="Cargando..." />
                        ) : (
                            <PendingContactsList
                                contacts={pending}
                                currentUserId={currentUserId}
                                onAccept={handleAccept}
                                onReject={handleReject}
                                onDelete={handleDelete}
                            />
                        )}
                    </>
                )}

                {activeTab === "groups" && (
                    <>
                        <div className="groups-header">
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCreate(true)}
                            >
                                + Crear grupo
                            </button>
                        </div>

                        {isLoadingGroups ? (
                            <Loader message="Cargando..." />
                        ) : (
                            <GroupsList groups={groups} />
                        )}

                        {showCreate && (
                            <CreateGroupModal onClose={() => setShowCreate(false)} />
                        )}
                    </>
                )}

            </div>
        </div>
    );
};

export default ContactsTabs;
