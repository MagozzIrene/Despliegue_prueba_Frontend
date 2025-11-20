import PendingItem from "./PendingItem";

export default function PendingContactsList({
    contacts,
    currentUserId,
    onAccept,
    onReject,
    onDelete,
}) {
    if (contacts.length === 0) {
        return <p className="empty-msg">No hay solicitudes.</p>;
    }

    return (
        <>
            {contacts.map((c) => (
                <PendingItem
                    key={c._id}
                    contact={c}
                    currentUserId={currentUserId}
                    onAccept={onAccept}
                    onReject={onReject}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
}
