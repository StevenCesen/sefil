import { MessageSquareText, PhoneForwarded } from "lucide-react";
import "./CardContact.css";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";
import { useStoreSMS } from "../../../stores/useStoreSMS";
import sendpush from "../../../helpers/sendpush";

export default function CardContact({phone_number,nro_sucessful,nro_fails,name,ci,type,total_amount,days_past_due,channel,client_id}){
    const store_call=useStoreProgressCall();
    const store_sms=useStoreSMS();

    return(
        <div className="CardContact">
            <p
                className={`${(channel==='FACES') ? "CardContact__labelred" : ""}`}
                title={`${(channel==='FACES') ? "Número enviado por FACES" : "Número creado por Gestor en SEFIL"}`}
            >
                {phone_number}
            </p>
            <div className="CardContact__metrics">
                <label
                    title="Número de veces que contestó"
                    className="CardContact__item CardContact__item--success"
                >
                    {(nro_sucessful>10) ? '+10' : nro_sucessful}
                </label>
                <label
                    title="Número de veces que no contestó"
                    className="CardContact__item CardContact__item--fails"
                >
                    {(nro_fails>10) ? '+10' : nro_fails}
                </label>
            </div>
            <div className="CardContact__actions">
                <label
                    title="Escoger número para llamar"
                    className="CardContact__item CardContact__item--normalcall"
                    onClick={()=>{
                        store_call.setInfoPhone({phone_number});
                    }}
                >
                    <PhoneForwarded size={18}/>
                </label>
                <label
                    title="Enviar SMS a este número"
                    className="CardContact__item CardContact__item--sms"
                    onClick={()=>{
                        if(phone_number.length==10){
                            store_sms.setContact({
                                phone_number,
                                name,
                                ci,
                                type,
                                view:true,
                                total_amount,
                                days_past_due,
                                campain_id:store_call.campain_id,
                                credit_id:store_call.credit_id,
                                client_id:client_id
                            });
                        }else{
                            sendpush({
                                title:'Número incorrecto para SMS',
                                message:'Número no soporta SMS',
                                type:'Push--danger',
                                timeout:3000
                            });
                        }
                    }}
                >
                    <MessageSquareText size={18}/>
                </label>
            </div>
        </div>
    );
}
