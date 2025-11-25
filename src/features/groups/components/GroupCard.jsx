import { Link } from "react-router";
import "../styles/GroupCard.css";

const fallbackAvatar = (seed) =>
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed || "group")}`;

export default function GroupCard({ group, isActive }) {
    const avatar = group.avatar?.trim()
        ? group.avatar
        : fallbackAvatar(group.name || group._id);

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <Link to={`/groups/${group._id}`} className={`group-card ${isActive ? "active" : ""}`}>
            <img className="group-card__avatar" src={avatar} alt={group.name} />

            <div className="group-card__main">

                <div className="group-card__top">
                    <h3 className="group-card__name">{group.name}</h3>

                    {group.last_message_time && (
                        <span className="group-card__time">
                            {formatTime(group.last_message_time)}
                        </span>
                    )}
                </div>
                <p className="group-card__desc">
                    {group.description?.trim()
                        ? group.description
                        : "Sin descripción"}
                </p>
                <p className="group-card__preview">
                    {group.last_message
                        ? group.last_message_sender
                            ? `${group.last_message_sender}: ${group.last_message}`
                            : group.last_message
                        : "Sin mensajes aún"}
                </p>
            </div>

            {/* 
            {group.unread_count > 0 && (
                <span className="group-card__badge">{group.unread_count}</span>
            )} 
            */}
        </Link>
    );
}
