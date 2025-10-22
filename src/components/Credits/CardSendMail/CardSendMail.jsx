import { X } from "lucide-react";
import { useStoreEmail } from "../../../stores/useStoreEmail";
import "./CardSendMail.css";
import sendpush from "../../../helpers/sendpush";

export default function CardSendMail(){
    
    const store_email=useStoreEmail();

    const handleSendEmail=async ({e})=>{
        e.target.textContent=`Enviando...`;

        const send_email=await store_email.sendEmail();

        if(send_email.client_email!=='' || send_email.template!==''){
            sendpush({
                title:'Envío completado.',
                message:'Se envío el correo electrónico.',
                type:'Push--sucessful',
                timeout:3000
            });
        }else{
            sendpush({
                title:'Datos incompletos.',
                message:'No se introdució un correo electrónico o una plantilla, por favor, ingrésalo.',
                type:'Push--danger',
                timeout:5000
            });
        }
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
                                <option key={format} value={format}>{`${format}`}</option>
                            ))
                        }
                    </select>
                </label>
                <label>
                    Correo electrónico
                    <input 
                        type="email"
                        value={store_email.client_email}
                        placeholder="user@domain.com"
                        onChange={(e)=>{
                            store_email.setEmail(e.target.value);
                        }}
                    />
                </label>
            </div>
            <div className="CardSendMail__body">
                <h4>Vista previa del correo electrónico a {store_email.client_name}</h4>
                <p>{store_email.message}</p>
            </div>
            <button onClick={(e)=>{handleSendEmail({e})}}>Enviar correo</button>
        </div>
    );
}