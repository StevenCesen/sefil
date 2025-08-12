import { ExternalLink } from "lucide-react";
import "./CardCreditManagement.css"
import { useStoreManagement } from "../../../stores/useStoreManagement";
import { useStoreFilterManagement } from "../../../stores/useStoreFilterManagement";

export default function CardCreditManagement({credit,index}){
    const store_management=useStoreManagement();
    const store_credits=useStoreFilterManagement();

    return(
        <div className="CardCreditManagement">
            <ExternalLink onClick={()=>{
                store_management.setNew();
                store_management.setCredit(credit);
                store_management.setView(true);
                store_credits.setCurrent(index);

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