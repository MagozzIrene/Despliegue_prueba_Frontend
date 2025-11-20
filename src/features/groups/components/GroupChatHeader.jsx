import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { GroupsContext } from "@/context/GroupsContext";
import InviteToGroup from "./InviteToGroup";
import { AuthContext } from "../../../context/AuthContext";
import { FiArrowLeft } from "react-icons/fi";

const fallbackAvatar = (seed) =>
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
        seed || "group"
    )}`;

const GroupChatHeader = () => {
    const { groupId } = useParams();
    const { getGroupById, getMembers, deleteGroup } = useContext(GroupsContext);
    const { activeUser } = useContext(AuthContext);

    const [group, setGroup] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);

    const navigate = useNavigate();

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
                if (!alive) return;
                setGroup(null);
                setMembers([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [groupId, getGroupById, getMembers]);

    const avatar = group?.avatar?.trim()
        ? group.avatar
        : fallbackAvatar(group?.name || groupId);

    const adminId =
        typeof group?.admin === "string"
            ? group.admin
            : group?.admin?._id ?? group?.admin?.id ?? null;

    const isAdmin =
        adminId &&
        activeUser?._id &&
        adminId.toString() === activeUser._id.toString();

    const memberNames = members
        .map((m) => ({
            id:
                m.user_id?._id ??
                m.user?._id ??
                m.user_id ??
                m.user ??
                null,
            name:
                m.user_id?.name ??
                m.user?.name ??
                m.name ??
                "(sin nombre)",
        }))
        .filter((x) => x.id)
        .map((x) =>
            activeUser?._id && x.id === activeUser._id ? "Tú" : x.name
        );

    const formatMembers = (names, max = 5) => {
        if (names.length <= max) return names.join(", ");
        const visible = names.slice(0, max).join(", ");
        const rest = names.length - max;
        return `${visible} +${rest}`;
    };

    const membersLine = formatMembers(memberNames);

    const handleDeleteGroup = useCallback(async () => {
        if (!groupId || !isAdmin) return;

        const confirmed = window.confirm(
            "¿Seguro que querés eliminar este grupo? Esta acción no se puede deshacer."
        );
        if (!confirmed) return;

        try {
            await deleteGroup(groupId);
            navigate("/home")
        } catch (e) {
            console.error("Error al eliminar el grupo:", e);
        }
    }, [groupId, isAdmin, deleteGroup, navigate]);

    return (
        <header className="group-header">

            <button className="header-back-btn" onClick={() => navigate("/home")}>
                <FiArrowLeft />
            </button>

            <div className="group-header__info">
                <img className="group-header__avatar" src={avatar} alt="" />
                <div>
                    <h2 className="group-header__title">
                        {group?.name || "Grupo"}
                    </h2>
                    <div className="group-header__meta">
                        <span className="members-line">{membersLine}</span>
                    </div>
                </div>
            </div>

            <div className="group-header__actions">
                {isAdmin && (
                    <>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setShowInvite(true)}
                            disabled={loading}
                        >
                            Invitar
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleDeleteGroup}
                            disabled={loading}
                        >
                            Eliminar
                        </button>
                    </>
                )}
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
