import CardItemCharge from "../CardItemCharge/CardItemCharge";
import "../CardPay/CardPay.css";
import "./CreditDetailsModal.css";

export default function CreditDetailsModal({ isOpen, onClose, credits }) {
    if (!isOpen) return null;

    return (
        <div className="CardPay">
            <div className="CreditDetailsModal">
                <div className="CreditDetailsModal__header">
                    <h3>Detalle de créditos ({credits?.length || 0})</h3>
                    <button
                        className="CreditDetailsModal__close"
                        onClick={onClose}
                    >
                        Ocultar
                    </button>
                </div>
                <div className="CreditDetailsModal__content">
                    <div className="CardAssignCampain__headCharge">
                        <label></label>
                        <label>Nombre</label>
                        <label>Cédula</label>
                        <label>Crédito</label>
                        <label>Monto</label>
                        <label>Cuotas pendientes</label>
                        <label>Días mora</label>
                        <label>Estado</label>
                    </div>
                    {credits?.map((credit, index) => (
                        <CardItemCharge key={`credit-${credit.id || index}`} item={credit} />
                    ))}
                </div>
            </div>
        </div>
    );
}