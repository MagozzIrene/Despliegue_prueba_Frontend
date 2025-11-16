import { useState } from "react";
import axios from "axios";

const AddContactForm = ({ onContactAdded }) => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setSuccess(false);

        try {
            const token = localStorage.getItem("auth_token");

            const userRes = await axios.get(`${API_BASE}/api/users`, {
                params: { email },
                headers: { Authorization: `Bearer ${token}` },
            });

            const receiver = userRes.data?.data;
            if (!receiver?._id) {
                setMessage("Usuario no encontrado");
                return;
            }

            const res = await axios.post(
                `${API_BASE}/api/contacts`,
                { receiver_id: receiver._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSuccess(true);
            setMessage("Solicitud enviada correctamente.");
            setEmail("");

            if (onContactAdded) {
                onContactAdded();
            }

        } catch (error) {
            console.error("ERROR AL ENVIAR SOLICITUD:", error);
            setSuccess(false);

            setMessage(
                error.response?.data?.message ||
                "Hubo un error al enviar la solicitud."
            );
        }
    };

    return (
        <div className="add-contact-wrapper">
            <form className="add-contact-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email del usuario..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button className="btn-primary" type="submit" disabled={!email.trim()}>
                    Agregar
                </button>
            </form>

            {message && (
                <p className={`add-contact-msg ${success ? "success" : "error"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default AddContactForm;

