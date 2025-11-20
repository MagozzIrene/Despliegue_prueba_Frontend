import GroupCard from "./GroupCard";

export default function GroupsList({ groups }) {
    if (groups.length === 0) {
        return <p className="empty-msg">No pertenecés a grupos.</p>;
    }

    return (
        <>
            {groups.map((g) => (
                <GroupCard key={g._id} group={g} />
            ))}
        </>
    );
}
