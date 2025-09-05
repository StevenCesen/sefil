import useFormatterNumber from "../../../hooks/useFormatterNumber";
import "./InfoPending.css";

export default function InfoPending({days_past_due,total_amount,payment_date}){
    return(
        <div className="InfoPending">
            <div>
                <h3>{days_past_due}</h3>
                <p>Días de mora</p>
            </div>
            <div>
                <h3>{useFormatterNumber({value:total_amount,currency:'USD'})}</h3>
                <p>Total pendiente</p>
            </div>
            <div>
                <h3>{payment_date.split(' ')[0]}</h3>
                <p>Fecha de pago</p>
            </div>
        </div>
    );
}