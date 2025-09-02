import { Mail, PiggyBank, User } from "lucide-react";
import sendpush from "../../../helpers/sendpush";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import "./CardClient.css";
import { useStoreEmail } from "../../../stores/useStoreEmail";

export default function CardClient({credit_id,name,ci,sector_economico,days_past_due,type,total_amount}){

    const store_management=useStoreManagement();
    const store_email=useStoreEmail();
    
    return(
        <div
            onClick={()=>{
                store_management.setClient({
                    client_name:name,
                    client_ci:ci,
                    client_type:type,
                    credit_id
                });

                store_management.setPhones({
                    credit_id:credit_id,
                    identification:ci
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
                <span>Cédula: {ci} | Sector económico: {sector_economico}</span>
            </div>
            <div>
                <span className={`${(type==='TITULAR') ? 'CardClient--titular' : 'CardClient--garante'}`}>{type}</span>
                <button onClick={()=>{
                    store_email.setContact({
                        name,
                        type,
                        view:true,
                        days_past_due,
                        total_amount
                    });
                    console.log(store_email);
                }} title='Enviar correo electrónico a este cliente'>
                    <Mail size={18}/>
                </button>
            </div>
        </div>
    );
}
