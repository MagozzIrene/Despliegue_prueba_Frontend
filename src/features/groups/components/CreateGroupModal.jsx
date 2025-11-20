import { useContext, useEffect } from "react";
import { createPortal } from "react-dom";
import { GroupsContext } from "@/context/GroupsContext";
import { useState } from "react";
import "../styles/CreateGroupModal.css"

const CreateGroupModal = ({ onClose }) => {
    const { createGroup } = useContext(GroupsContext);
    const [name, setName] = useState("");
    const [description, setDesc] = useState("");

    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose?.();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleBackdrop = (e) => {
        if (e.target.classList.contains("modal-backdrop")) onClose?.();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        await createGroup({ name: name.trim(), description: description.trim() });
        onClose?.();
    };

    const modal = (
        <div className="modal-backdrop" onMouseDown={handleBackdrop}>
            <div className="modal-card" role="dialog" aria-modal="true">
                <h2>Crear grupo</h2>

                <form className="form-vertical" onSubmit={handleSubmit}>
                    <label className="field">
                        <span>Nombre</span>
                        <input type="text" autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={20} />
                    </label>

                    <label className="field">
                        <span>Descripción (opcional)</span>
                        <input value={description} onChange={(e) => setDesc(e.target.value)} />
                    </label>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
                            Crear
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default CreateGroupModal;

