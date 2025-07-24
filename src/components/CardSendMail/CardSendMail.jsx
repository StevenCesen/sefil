import { useState } from "react";
import "./CardSendMail.css";
import makebody from "../../helpers/makebody";
import sendmail from "../../helpers/sendmail";
import Push from "../Push/Push";

export default function CardSendMail({clients,days_past_due,total_amount}){
    const [client,setClient]=useState('');
    const [mail,setMail]=useState('');
    const [message,setMessage]=useState('');
    console.log(clients)
    const formats=[
        {
            'id':1,
            'name':'Contáctanos',
            'text':'(x). Somos de Empresa de cobranzas SEFIL estamos gestionando el pago de su deuda en FACES su saldo a la fecha es $(x). Podemas llegar a un acuerdo de pago por favor contactarse al (x).'
        },
        {
            'id':2,
            'name':'Recordatorio',
            'text':'(x), en nombre de FACES le recordamos que la fecha de pago de su credito es el (x), valor $(x)'
        }
    ];

    return (
        <div className="CardSendMail">
            <h2>Enviar correo</h2>
            <div className="CardSendmail__head">
                <label className="CardSendMail__label">
                    Cliente
                    <select
                        defaultValue={client}
                        onChange={(e)=>{
                            setClient(e.target.value);
                        }}
                    >
                        <option>-- Seleccionar --</option>
                        {
                            clients.map(client=>(
                                <option value={`${client.name}`}>{client.name}</option>
                            ))
                        }
                    </select>
                </label>
                <label className="CardSendMail__label">
                    Correo electrónico
                    <input 
                        type="text"
                        value={mail}
                        onChange={(e)=>{
                            setMail(e.target.value);
                        }}
                    />
                </label>
                <label className="CardSendMail__label">
                    Plantilla
                    <select
                        onChange={(e)=>{
                            if(client!=''){
                                const values=[
                                    `Estimado(a) ${client}`,
                                    days_past_due,
                                    (e.target.value.split('/')[1]!=='Contáctanos') ? total_amount : '0999380019'
                                ];

                                setMessage(
                                    makebody({
                                        message:e.target.value.split('/')[0],
                                        values
                                    })
                                );
                            }
                        }}
                    >
                        <option value={''}>-- Seleccionar --</option>
                        {
                            formats.map(format=>(
                                <option value={`${format.text}/${format.name}`}>{`${format.name} - ${format.text}`}</option>
                            ))
                        }
                    </select>
                </label>
            </div>
            
            <div className="CardSendMail__body">
                {
                    (message!='') ? <p>Asunto - Recordatorio</p> : <></>
                }
                {message}
                {
                    (message!='')
                    ?
                        <>
                            <span>Agradecemos su atención prestada.</span>
                            <span>Saludos cordiales.</span>
                        </>
                    :   <></>
                }
            </div>
            <button 
                className="CardSendMail__send"
                onClick={async (e)=>{
                    const values=[
                        `Estimado(a) ${client}`,
                        days_past_due,
                        (message.split('/')[1]!=='Contáctanos') ? total_amount : '0999380019'
                    ];

                    const body_message=makebody({
                        message:message.split('/')[0],
                        values
                    });

                    const body_mail={
                        dstn:mail,
                        body:body_message
                    };

                    const send=await sendmail({data:body_mail});

                    console.log(send);

                    Push({
                        title:'Éxito',
                        message:`Generado.`,
                        timeout:3000,
                        type:200
                    });
                }}

            >Enviar correo</button>
        </div>
    );
}