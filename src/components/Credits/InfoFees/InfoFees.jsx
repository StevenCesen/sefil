import "./InfoFees.css";

export default function InfoFees({pending_fees,paid_fees,total_fees}){
    return(
        <div className="InfoFees">
            <div>
                <h3>{pending_fees}</h3>
                <p>Cuotas vencidas</p>
            </div>
            <div>
                <h3>{paid_fees}</h3>
                <p>Cuotas pagadas</p>
            </div>
            <div>
                <h3>{total_fees}</h3>
                <p>Total cuotas</p>
            </div>
        </div>
    );
}