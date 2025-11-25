import GroupCard from "./GroupCard";
import { useParams } from "react-router";

export default function GroupsList({ groups }) {
    const { groupId } = useParams();
    
    if (groups.length === 0) {
        return <p className="empty-msg">No pertenecés a grupos.</p>;
    }

    return (
        <>
            {groups.map((g) => (
                <GroupCard 
                key={g._id} 
                group={g} 
                isActive={String(g._id) === String(groupId)}
                />
            ))}
        </>
    );
}
