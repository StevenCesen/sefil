import CardItemCharge from "../CardItemCharge/CardItemCharge";

export default function CreditDetailsModal({ isOpen, onClose, credits }) {
    if (!isOpen) return null;

    return (
        <div className="CardPay">
            <button 
                className="CardCondonacion__close" 
                onClick={onClose}
            >
                Ocultar
            </button>
            <div style={{width:"100%",padding:"0 10px",height:"500px",overflowY:'auto'}}>
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
    );
}