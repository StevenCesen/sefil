import { PhoneForwarded, UserMinus } from "lucide-react";
import "./CardContact.css";
import { useStoreProgressCall } from "../../../stores/useStoreProgessCall";
// import { useStoreSMS } from "../../../stores/useStoreSMS";
import { useStoreManagement } from "../../../stores/useStoreManagement";
import deleteContact from "../../../helpers/Calls/deleteContact";
import sendpush from "../../../helpers/sendpush";

export default function CardContact({id,phone_number,nro_sucessful,nro_fails,is_external}){
    const store_call=useStoreProgressCall();
    // const store_sms=useStoreSMS();
    const store_management=useStoreManagement();

    const handleRemoveContact = async () => {
        const data = await deleteContact({id});
        if(data && data.code === 1){
            store_management.removePhone(id);
        }else{
            sendpush({
                title:'Error al quitar contacto',
                message:'No se pudo eliminar el contacto',
                type:'Push--danger',
                timeout:3000
            });
        }
    };

    return(
        <div className="CardContact">
            <p
                className={`${is_external ? "CardContact__contact-phone--EXTERNAL" : ""}`}
                title={`${is_external ? "Número de fuente externa" : "Número creado por Gestor en SEFIL"}`}
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
                {/* <label
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
                </label> */}
                <label
                    title="Quitar contacto"
                    className="CardContact__item CardContact__item--remove"
                    onClick={handleRemoveContact}
                >
                    <UserMinus size={18}/>
                </label>
            </div>
        </div>
    );
}
