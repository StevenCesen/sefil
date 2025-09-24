import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, CreditCard, HandshakeIcon } from "lucide-react";
import "./CardActions.css";

export default function CardActions({setAction}){
    return(
        <div className="CardActions">
            <h2>Acciones</h2>
            <div className="CardActions__actions">
                <button onClick={()=>{setAction('PAY_CREDIT')}} className="CardActions__action"><CreditCard size={20}/> Bajar pago</button>
                <button onClick={()=>{setAction('PAY_GASTO')}} className="CardActions__action"><BanknoteArrowUpIcon size={20}/> Generar gasto de cobranza</button>
                <button onClick={()=>{setAction('GEN_CONDONATION')}} className="CardActions__action"><BanknoteArrowDownIcon size={20}/> Generar condonación</button>
                <button onClick={()=>{setAction('GEN_CONVENIO')}} className="CardActions__action"><HandshakeIcon size={20}/> Generar convenio de pago</button>
                <button onClick={()=>{setAction('GEN_JUDICIAL')}} className="CardActions__action"><BanknoteArrowUpIcon size={20}/> Subir gasto judicial</button>
            </div>
        </div>
    );
}