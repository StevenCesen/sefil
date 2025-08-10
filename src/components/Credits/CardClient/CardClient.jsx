import { User } from "lucide-react";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./CardClient.css";

export default function CardClient({credit_id,name,ci,type}){

    const store_management=useStoreManagement();
    
    return(
        <button 
            onClick={()=>{
                store_management.setClient({
                    client_name:name,
                    client_ci:ci,
                    client_type:type,
                    credit_id
                });
                    
                sendpush({
                    title:'Estado',
                    message:'Se seleccionó un cliente',
                    type:'Push--sucessful',
                    timeout:1000
                });
            }}
            className="CardClient"
        >
            <label>
                <User/>
            </label>
            <div>
                <h3>{name}</h3>
                <span>Cédula: {ci}</span>
            </div>
            <span className={`${(type==='TITULAR') ? 'CardClient--titular' : 'CardClient--garante'}`}>{type}</span>
        </button>
    );
}
