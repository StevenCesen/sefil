import { X } from "lucide-react";
import { useStoreEmail } from "../../../stores/useStoreEmail";
import "./CardSendMail.css";

export default function CardSendMail(){
    
    const store_email=useStoreEmail();

    const handleSendEmail=async ({e})=>{
        e.target.textContent=`Enviando...`;

        const send_email=await store_email.sendEmail();

        console.log(send_email)

        // if(Number(send_sms.cod_respuesta)===100){
        //     sendpush({
        //         title:'Envío completado.',
        //         message:'Se completo el envío del SMS correctamente.',
        //         type:'Push--sucessful',
        //         timeout:3000
        //     });
        // }else{
        //     sendpush({
        //         title:'Error enviando SMS.',
        //         message:'No se pudo enviar el mensaje en este momento, contáctate con supervisión.',
        //         type:'Push--danger',
        //         timeout:5000
        //     });
        // }

        e.target.textContent=`Enviar correo`;
    }

    if(!store_email.view) return <></>

    return (
        <div className="CardSendMail">
            <div className="CardSend__head">
                <h2>Enviar correo electrónico</h2>
                <label>
                    <X size={18} color="black" onClick={()=>{store_email.setView(false)}}/>
                </label>
            </div>

            <p>Selecciona una plantilla, y un correo válido de cada cliente.</p>

            <div className="CardSendMail__head">
                <label>
                    Plantilla
                    <select
                        onChange={(e)=>{
                            store_email.setTemplate(e.target.value)
                        }}
                    >
                        <option value={''}>-- Seleccionar --</option>
                        {
                            store_email.templates.map(format=>(
                                <option value={format}>{`${format}`}</option>
                            ))
                        }
                    </select>
                </label>
            </div>
            <div className="CardSendMail__body">
                <h4>Vista previa del correo electrónico</h4>
                <p>{store_email.message}</p>
            </div>
            <button onClick={(e)=>{handleSendEmail({e})}}>Enviar correo</button>
        </div>
    );
}