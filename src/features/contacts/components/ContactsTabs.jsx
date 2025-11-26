import { useContext, useEffect, useState } from "react";
import PanelHeader from "./PanelHeader";
import AddContactForm from "../components/AddContactForm";
import Loader from "@/shared/Loader";

import useSearch from "@/hooks/useSearch";
import useGroupsTab from "@/hooks/useGroupsTab";

import { ContactsContext } from "@/context/ContactsContext";

import "../styles/ContactsTabs.css";
import GroupsList from "../../groups/components/GroupsList";
import PendingContactsList from "./PendingContactsList";
import AcceptedContactsList from "./AcceptedContactsList";
import CreateGroupModal from "../../groups/components/CreateGroupModal";

const ContactsTabs = ({ activeTab }) => {
    const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

    const [showCreate, setShowCreate] = useState(false);
    const { handleSearch, search } = useSearch();

    const {
        accepted,
        pending,
        isLoading,
        fetchAllContacts,
        acceptRequest,
        rejectRequest,
        deleteRequest,
    } = useContext(ContactsContext);

    const { groups, isLoadingGroups } = useGroupsTab(search, activeTab);

    useEffect(() => {
        handleSearch("");
    }, [activeTab]);


    const filteredAccepted = accepted.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredPending = pending.filter((c) => {
        const otherUser =
            c.requester_id?._id === currentUserId
                ? c.receiver_id
                : c.requester_id;

        return otherUser?.name?.toLowerCase().includes(search.toLowerCase());
    });

    const handleAccept = async (id) => {
        await acceptRequest(id);
    };

    const handleReject = async (id) => {
        await rejectRequest(id);
    };

    const handleDelete = async (id) => {
        await deleteRequest(id);
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
                    isLoading ? (
                        <Loader message="Cargando..." />
                    ) : (
                        filteredAccepted.length === 0 ? (
                            <p className="empty-msg">
                                {search.trim()
                                    ? "No hay resultados."
                                    : "No hay chats aún."}
                            </p>
                        ) : (
                            <AcceptedContactsList contacts={filteredAccepted} />
                        )
                    )
                )}

                {activeTab === "pending" && (
                    <>
                        <AddContactForm
                            onContactAdded={() => fetchAllContacts()}
                        />

                        {isLoading ? (
                            <Loader message="Cargando..." />
                        ) : (
                            filteredPending.length === 0 ? (
                                <p className="empty-msg">
                                    {search.trim()
                                        ? "No hay resultados."
                                        : "No hay solicitudes."}
                                </p>
                            ) : (
                                <PendingContactsList
                                    contacts={filteredPending}
                                    currentUserId={currentUserId}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    onDelete={handleDelete}
                                />
                            )
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
                        ) : search.trim() === "" && groups.length === 0 ? (
                            <p className="empty-msg">
                                No perteneces a ningún grupo.
                            </p>
                        ) : groups.length === 0 ? (
                            <p className="empty-msg">
                                No hay resultados.
                            </p>
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
