import "./ConfirmDialog.css";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="ConfirmDialog__overlay" onClick={onCancel}>
            <div className="ConfirmDialog" onClick={(e) => e.stopPropagation()}>
                <h3 className="ConfirmDialog__title">{title}</h3>
                <p className="ConfirmDialog__message">{message}</p>
                <div className="ConfirmDialog__actions">
                    <button
                        className="ConfirmDialog__btnCancel"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                    <button
                        className="ConfirmDialog__btnConfirm"
                        onClick={onConfirm}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}
