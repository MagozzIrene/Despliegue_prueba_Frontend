import { Link } from "react-router";
import "../styles/GroupCard.css";

const fallbackAvatar = (seed) =>
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed || "group")}`;

export default function GroupCard({ group }) {
    const avatar = group.avatar?.trim()
        ? group.avatar
        : fallbackAvatar(group.name || group._id);

    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <Link to={`/groups/${group._id}`} className="group-card">
            <img className="group-card__avatar" src={avatar} alt={group.name} />

            <div className="group-card__main">
                <div className="group-card__top">
                    <h3 className="group-card__name">{group.name}</h3>
                    <span className="group-card__time">
                        {formatTime(group.last_message_time)}
                    </span>
                </div>

                {group.last_message ? (
                    <p className="group-card__preview">
                        {group.last_message_sender ? (
                            <strong>{group.last_message_sender}: </strong>
                        ) : null}
                        {group.last_message}
                    </p>
                ) : group.description ? (
                    <p className="group-card__desc">{group.description}</p>
                ) : null}
            </div>

            {/* 
            {group.unread_count > 0 && (
                <span className="group-card__badge">{group.unread_count}</span>
            )} 
            */}
        </Link>
    );
}





