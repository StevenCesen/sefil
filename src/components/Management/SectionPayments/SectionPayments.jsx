import "./SectionPayments.css";

export default function SectionPayments({payments}){
    return(
        <div className="SectionPayments">
            <div className="SectionPayments__header">
                <label>Fecha pago</label>
                <label>Tipo de pago</label>
                <label>Monto</label>
                <label>Estado</label>
            </div>
            
            {
                console.log(payments)
            }

        </div>
    );
}