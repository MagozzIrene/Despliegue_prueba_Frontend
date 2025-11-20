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
                <button className="btn-delete" onClick={() => onDelete(contact._id)}>
                    🗑️
                </button>
            )}
        </div>
    );
}
