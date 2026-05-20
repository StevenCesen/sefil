import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, CreditCard, HandshakeIcon, Scale, X } from "lucide-react";
import "./CardActions.css";

const hasRecaudacion = () => {
    const raw = localStorage.getItem('user_permissions');
    if (raw && raw !== '[]') {
        try { return JSON.parse(raw).some(p => p.section === 'recaudacion'); } catch { /* fall through */ }
    }
    const role = localStorage.getItem('role');
    return role === 'superadmin' || role === 'admin';
};

export default function CardActions({isViewOn, setAction, invoice_value, collection_state}){
    const role = localStorage.getItem('role');
    const canCancelInvoice = (role === 'admin' || role === 'superadmin') && invoice_value > 0;
    const canLegalPayment = hasRecaudacion() && collection_state === 'Judicial';

    if(!isViewOn) return <></>

    return(
        <div className="CardActions">
            <h2>Acciones</h2>
            <div className="CardActions__actions">
                <button onClick={()=>{setAction('PAY_CREDIT')}} className="CardActions__action"><CreditCard size={20}/> Bajar pago</button>
                <button onClick={()=>{setAction('PAY_GASTO')}} className="CardActions__action"><BanknoteArrowUpIcon size={20}/> Generar gasto de cobranza</button>
                {canCancelInvoice && (
                    <button onClick={()=>{setAction('CANCEL_INVOICE')}} className="CardActions__action CardActions__action--danger"><X size={20}/> Cancelar gasto de cobranza</button>
                )}
                <button onClick={()=>{setAction('GEN_CONDONATION')}} className="CardActions__action"><BanknoteArrowDownIcon size={20}/> Generar condonación</button>
                <button onClick={()=>{setAction('GEN_CONVENIO')}} className="CardActions__action"><HandshakeIcon size={20}/> Generar convenio de pago</button>
                <button onClick={()=>{setAction('GEN_JUDICIAL')}} className="CardActions__action"><BanknoteArrowUpIcon size={20}/> Subir gasto judicial</button>
                {canLegalPayment && (
                    <button onClick={()=>{setAction('GEN_LEGAL_PAYMENT')}} className="CardActions__action"><Scale size={20}/> Registrar pago legal</button>
                )}
            </div>
        </div>
    );
}