import { Link } from "react-router";
import "../styles/GroupCard.css";

const fallbackAvatar = (seed) =>
    `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed || "group")}`;

    const GroupCard = ({ group }) => {
    const avatar = group.avatar && group.avatar.trim() !== ""
        ? group.avatar
        : fallbackAvatar(group.name || group._id);

    return (
        <Link to={`/groups/${group._id}`} className="group-card">
        <img className="group-card__avatar" src={avatar} alt={group.name} />
        <div className="group-card__info">
            <h3 className="group-card__name">{group.name}</h3>
            {group.description ? (
            <p className="group-card__desc">{group.description}</p>
            ) : null}
        </div>
        </Link>
    );
};

export default GroupCard;
