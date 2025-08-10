import { ExternalLink } from "lucide-react";
import "./CardCreditManagement.css"
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function CardCreditManagement({credit}){
    const store_management=useStoreManagement();

    return(
        <div className="CardCreditManagement">
            <ExternalLink onClick={()=>{
                store_management.setView(true);
                store_management.setCredit(credit);
            }} size={30} color="white"/>
            <label>{credit.name}</label>
            <label>{credit.ci}</label>
            <label>{credit.agency}</label>
            <label>{credit.days_past_due}</label>
            <label>{credit.total_amount}</label>
            <label>{credit.total_fees}</label>
            <label>{credit.status_management}</label>
            <label>{credit.promise}</label>
        </div>
    );
}