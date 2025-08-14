import "./CardSendSMS.css";
import sendpush from "../../../helpers/sendpush";
import { useStoreSMS } from "../../../stores/useStoreSMS";
import { Send, X } from "lucide-react";

export default function CardSendSMS(){
    const store_sms=useStoreSMS();

    const handlerSendSMS=async ({e})=>{

        e.target.textContent=`Enviando...`;

        const send_sms=await store_sms.sendSMS();

        if(Number(send_sms.cod_respuesta)===100){
            sendpush({
                title:'Envío completado.',
                message:'Se completo el envío del SMS correctamente.',
                type:'Push--sucessful',
                timeout:3000
            });
        }else{
            sendpush({
                title:'Error enviando SMS.',
                message:'No se pudo enviar el mensaje en este momento, contáctate con supervisión.',
                type:'Push--danger',
                timeout:5000
            });
        }

        e.target.textContent=`Enviar SMS`;
    }

    if(!store_sms.view) return <></>

    return (
        <div className="CardSendMail">
            <div className="CardSend__head">
                <h2>Enviar SMS</h2>
                <label>
                    <X size={18} color="black" onClick={()=>{store_sms.setView(false)}}/>
                </label>
            </div>
            <p>Selecciona una plantilla para formar el mensaje.</p>
            
            <div className="CardSendMail__head">
                <label>
                    Plantilla
                    <select
                        onChange={(e)=>{
                            store_sms.setMessage(e.target.value);
                        }}
                    >
                        <option value={''}>-- Seleccionar --</option>
                        {
                            store_sms.templates.map(format=>(
                                <option key={format.id} value={format.id}>{`${format.name} - ${format.text.substring(0,100)}`}</option>
                            ))
                        }
                    </select>
                </label>
            </div>
            <div className="CardSendMail__body">
                <h4>Vista previa del mensaje a {store_sms.phone_number}</h4>
                <p>{store_sms.message}</p>
            </div>
            <button onClick={(e)=>{handlerSendSMS({e})}}>Enviar SMS</button>
        </div>
    );
}