import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import { GroupsContext } from "@/context/GroupsContext";
import InviteToGroup from "./InviteToGroup";
import { AuthContext } from "../../../context/AuthContext";


const fallbackAvatar = (seed) =>
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed || "group")}`;

const GroupChatHeader = () => {
    const { groupId } = useParams();
    const { getGroupById, getMembers } = useContext(GroupsContext);

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    const { activeUser } = useContext(AuthContext);

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const [g, m] = await Promise.all([
                    getGroupById(groupId),
                    getMembers(groupId),
                ]);

                if (!alive) return;
                setGroup(g || null);
                setMembers(Array.isArray(m) ? m : []);
            } catch (e) {
                console.error("Group header load error:", e);
                setGroup(null);
                setMembers([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [groupId, getGroupById, getMembers]);

    const avatar = group?.avatar?.trim()
        ? group.avatar
        : fallbackAvatar(group?.name || groupId);

    const memberNames = members
        .map((m) => ({
            id: m.user_id?._id ?? m.user?._id ?? m.user_id ?? m.user ?? null,
            name:
                m.user_id?.name ??
                m.user?.name ??
                m.name ??
                "(sin nombre)",
        }))
        .filter(x => x.id)
        .map((x) => (x.id === activeUser._id ? "Tú" : x.name));

    const formatMembers = (names, max = 5) => {
        if (names.length <= max) return names.join(", ");
        const visible = names.slice(0, max).join(", ");
        const rest = names.length - max;
        return `${visible} +${rest}`;
    };

    const membersLine = formatMembers(memberNames);

    return (
        <header className="group-header">
            <div className="group-header__info">
                <img className="group-header__avatar" src={avatar} alt="" />
                <div>
                    <h2 className="group-header__title">{group?.name || "Grupo"}</h2>
                    <div className="group-header__meta">
                        <span className="members-line">{membersLine}</span>
                    </div>
                </div>
            </div>

            <div className="group-header__actions">
                <button className="btn btn-primary" onClick={() => setShowInvite(true)}>
                    Invitar
                </button>
            </div>

            {showInvite && (
                <InviteToGroup
                    groupId={groupId}
                    onInvited={() => { }}
                    onClose={() => setShowInvite(false)}
                />
            )}
        </header>
    );
};

export default GroupChatHeader;
