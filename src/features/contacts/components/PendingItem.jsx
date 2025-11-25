import { useState } from "react";
import ConfirmModal from "@/shared/ConfirmModal";
import { FiTrash2 } from "react-icons/fi";
import "../styles/PendingItems.css"

export default function PendingItem({
    contact,
    currentUserId,
    onAccept,
    onReject,
    onDelete
}) {
    const otherUser =
        contact.requester_id?._id === currentUserId
            ? contact.receiver_id
            : contact.requester_id;

    const sentByUser = contact.requester_id?._id === currentUserId;

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleAskDelete = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setShowDeleteModal(false);
        await onDelete(contact._id);
    };


    return (
        <div className="pending-contact">
            <img src={otherUser.avatar} alt="" className="pending-contact__avatar" />

            <div className="pending-contact__info">
                <h3>{otherUser.name}</h3>
                <p>
                    {sentByUser ? "Solicitud enviada" : "Te envió una solicitud"}
                </p>
            </div>

            {!sentByUser ? (
                <div className="pending-contact__actions">
                    <button className="btn-accept" onClick={() => onAccept(contact._id)}>
                        ✔
                    </button>
                    <button className="btn-reject" onClick={() => onReject(contact._id)}>
                        ✖
                    </button>
                </div>
            ) : (
                <button className="btn-delete" onClick={handleAskDelete}>
                    <FiTrash2 />
                </button>
            )}
            <ConfirmModal
                open={showDeleteModal}
                title="Cancelar solicitud"
                message={`¿Seguro que querés cancelar la solicitud enviada a "${otherUser.name}"?`}
                confirmLabel="Eliminar"
                cancelLabel="Cancelar"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
