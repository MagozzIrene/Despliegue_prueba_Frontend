import "./ConfirmModal.css";

const ConfirmModal = ({ open, title, message, confirmLabel = "Aceptar", cancelLabel = "Cancelar", onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="confirm-modal__overlay">
            <div className="confirm-modal__content">
                <h3 className="confirm-modal__title">{title}</h3>
                {message && <p className="confirm-modal__message">{message}</p>}

                <div className="confirm-modal__actions">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
