import "./CardSendSMS.css";
import sendpush from "../../../helpers/sendpush";
import { useStoreSMS } from "../../../stores/useStoreSMS";
import { X } from "lucide-react";
import createManagement from "../../../helpers/Managements/createManagement";
import { useStoreManagement } from "../../../stores/useStoreManagement";

export default function CardSendSMS(){
    const store_sms=useStoreSMS();
    const store_management=useStoreManagement();

    const handlerSendSMS=async ({e})=>{

        e.target.textContent=`Enviando...`;

        if(store_sms.promise_date===''){
            sendpush({
                title:'Fecha de regestión.',
                message:'Ingresa una fecha para regestión.',
                type:'Push--danger',
                timeout:5000
            });

            e.target.textContent=`Enviar SMS`;

            return;
        }

        const send_sms=await store_sms.sendSMS();

        if(send_sms.code === 1 && send_sms.result && send_sms.result.respuesta && Number(send_sms.result.respuesta.cod_respuesta)===100){
            const data_management={
                campain_id:store_sms.campain_id,
                call_collection:"[]",
                credit_id:store_sms.credit_id,
                client_id:store_sms.client_id,
                state:'CONTACTADO EFECTIVO',
                substate:'MENSAJE DE TEXTO',
                promise_date:store_sms.promise_date,
                observation:store_sms.message,
                days_past_due:parseInt(store_sms.days_past_due) || 0,
                paid_fees:store_sms.paid_fees || 0,
                pending_fees:store_sms.pending_fees || 0,
                managed_amount:parseFloat(store_sms.total_amount) || 0,
                promise_amount:parseFloat(store_sms.total_amount) || 0,
                created_by:Number(localStorage.getItem('temp_uS'))
            }

            const userId = parseInt(localStorage.getItem('user_id'));
            if(userId) {
                data_management.created_by = userId;
            }
            
            if(store_sms.call_id) {
                data_management.call_id = parseInt(store_sms.call_id);
            }

            const create_management=await createManagement({data_management});

            if(create_management.code===1 && create_management.result){
                store_management.addManagement(create_management.result);
                sendpush({
                    title:'Envío completado.',
                    message:'Se completo el envío del SMS correctamente y se ha registrado una gestión.',
                    type:'Push--sucessful',
                    timeout:5000
                });
            }else{
                sendpush({
                    title:'Envío completado.',
                    message:'Se completo el envío del SMS correctamente, pero no se guardo la gestión.',
                    type:'Push--danger',
                    timeout:5000
                });
            }

            store_sms.setView(false);
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
                <label>
                    Fecha regestión
                    <input 
                        onChange={(e)=>{
                            store_sms.setPromiseDate(e.target.value);
                        }} 
                        type="date"
                    />
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