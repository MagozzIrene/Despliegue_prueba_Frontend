import { useContext, useState } from "react";
import { GroupsContext } from "@/context/GroupsContext";
import "../styles/InviteToGroup.css";

const InviteToGroup = ({ groupId, onInvited, onClose }) => {
    const { inviteToGroup } = useContext(GroupsContext);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");
        if (!email.trim()) {
            setApiError("Ingresá un email válido.");
            return;
        }

        try {
            setLoading(true);
            const resp = await inviteToGroup({ group_id: groupId, email });
            onInvited?.(resp);
            onClose?.();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                "No se pudo enviar la invitación.";
            setApiError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="invite-modal__backdrop" onClick={onClose}>
            <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                <h3>Invitar al grupo</h3>

                <form onSubmit={handleSubmit} className="invite-form">
                    <label>
                        Email del invitado
                        <input
                            type="email"
                            placeholder="usuario@dominio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    {apiError && <p className="invite-error">{apiError}</p>}

                    <div className="invite-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Enviando..." : "Enviar invitación"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteToGroup;
