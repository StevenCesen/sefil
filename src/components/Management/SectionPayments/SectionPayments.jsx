import useFormatterNumber from "../../../hooks/useFormatterNumber";
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
                payments.map((payment,n)=>(
                    <div key={n} className="SectionPayments__item">
                        <label>{payment.fecha}</label>
                        <label>{payment.forma_pago}</label>
                        <label>{useFormatterNumber({value:payment.valor_recibido,currency:'USD'})}</label>
                        <label>{(payment.status==='guardado') ? 'Guardado' : 'Revertido'}</label>
                    </div>
                ))
            }

        </div>
    );
}