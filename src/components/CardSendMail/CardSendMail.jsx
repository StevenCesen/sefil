import { useState } from "react";
import "./CardSendMail.css";
import makebody from "../../helpers/makebody";
import sendmail from "../../helpers/sendmail";

export default function CardSendMail({clients,days_past_due,total_amount,setClose}){
    const [client,setClient]=useState('');
    const [mail,setMail]=useState('');
    const [message,setMessage]=useState('');
    const [format,setFormat]=useState('');
    
    const formats=[
        {
            'id':1,
            'name':'Recordatorio de pago pendiente – FACES',
            'text':''
        },
        {
            'id':2,
            'name':'URGENTE – Pagos pendiente en FACES requiere solución inmediata',
            'text':''
        }
    ];

    return (
        <div className="CardSendMail">
            <h2>Enviar correo</h2>

            <p>Selecciona una plantilla, y el correo de cada cliente. (Si no seleccionas un correo al cliente no se le enviará.)</p>

            <div>
                <div className="CardSendMail__head">
                    <label>
                        Plantilla
                        <select
                            defaultValue={format}
                            onChange={(e)=>{
                                setFormat(e.target.value);
                            }}
                        >
                            <option value={''}>-- Seleccionar --</option>
                            {
                                formats.map(format=>(
                                    <option value={format.id}>{`${format.name} - ${format.text}`}</option>
                                ))
                            }
                        </select>
                    </label>
                    <label>
                        Contactar a
                        <input type="text" placeholder="0XXXXXXXXXX"/>
                    </label>
                </div>

                {
                    clients.map(client=>(
                        <div className="CardSendSMS__item">
                            <label>
                                <h4>{client.name} - {client.tipo}</h4>
                            </label>
                            <label>
                                Correo electrónico
                                <input type="email" placeholder="user@domain"/>
                            </label>
                        </div>
                    ))
                }              
            </div>
            
            <div className="CardSendMail__buttons">
                <button
                    className="CardSendMail__send"
                    onClick={()=>{
                        setClose(false);
                    }}
                >Cancelar</button>
                <button 
                    className="CardSendMail__send"
                    onClick={async (e)=>{
                        // const send=await sendmail({data:body_mail});
                        sendpush({
                            title:'Éxito.',
                            message:'Correo enviado correctamente.',
                            type:'Push--sucessful',
                            timeout:3000
                        });
                    }}
                >Enviar correo</button>
            </div>
        </div>
    );
}