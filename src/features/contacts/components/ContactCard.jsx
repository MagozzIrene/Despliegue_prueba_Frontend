import { useContext } from "react";
import "../styles/ContactCard.css";
import { formatMessageTime } from "@/services/authService";
import { useNavigate } from "react-router";

const ContactCard = ({ id, name, avatar, last_message, last_message_time }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/chat/${id}`);
    };

    const truncateMessage = (text, maxLength = 25) => {
        if (!text) return "Sin mensajes aún";
        return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    };

    return (
        <div className="contact" onClick={handleClick}>
            <div className="contact__photo">
                <img src={avatar} alt={`Avatar de ${name}`} />
            </div>

            <div className="contact__body">
                <div className="contact__header">
                    <h3 className="contact__name">{name}</h3>
                    {last_message_time && (
                        <span className="contact__time">{formatMessageTime(last_message_time)}</span>
                    )}
                </div>
                <p className="contact__last-message">{truncateMessage(last_message)}</p>
            </div>
        </div>
    );
};

export default ContactCard;
