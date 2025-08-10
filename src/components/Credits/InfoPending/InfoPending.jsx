import "./InfoPending.css";

export default function InfoPending({days_past_due,total_amount,payment_date}){
    return(
        <div className="InfoPending">
            <div>
                <h3>{days_past_due}</h3>
                <p>Días de mora</p>
            </div>
            <div>
                <h3>{total_amount}</h3>
                <p>Total pendiente</p>
            </div>
            <div>
                <h3>{payment_date}</h3>
                <p>Fecha de pago</p>
            </div>
        </div>
    );
}