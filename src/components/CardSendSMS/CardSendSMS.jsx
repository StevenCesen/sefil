import { useEffect, useState } from "react";
import "./CardSendSMS.css";
import makebody from "../../helpers/makebody";
import useSendsms from "../../helpers/sendsms";
import sendpush from "../../helpers/sendpush";

export default function CardSendSMS({clients,days_past_due,total_amount,setClose}){
    const [client,setClient]=useState('');
    const [phone,setPhone]=useState('');
    const [format,setFormat]=useState('');
    const [message,setMessage]=useState('');
    
    console.log(clients);

    const formats=[
        {
            'id':43334,
            'name':'Recordatorio de pago',
            'text':'(x), en nombre de FACES le recordamos que la fecha de pago de su credito es el (x), valor $(x)'
        },
        {
            'id':43335,
            'name':'Se requiere pago',
            'text':'(x), en nombre de FACES solicitamos el pago inmediato del valor pendiente. Esta con (x) dias de mora por $(x)'
        },
        {
            'id':48392,
            'name':'Contáctame',
            'text':'(x). Somos de Empresa de cobranzas SEFIL estamos gestionando el pago de su deuda en FACES su saldo a la fecha es $(x). Podemas llegar a un acuerdo de pago por favor contactarse al (x).'
        }
    ];

    const getFormat=({id})=>{
        let format="";

        formats.map(form=>{
            if(Number(form.id)===Number(id)){
                format=form.text;
            }
        });

        return format;
    }

    const handlerSendSMS=async ({data})=>{
        const send=await useSendsms({data});

        sendpush({
            title:'Envío completado.',
            message:'Se completo el envío del SMS correctamente.',
            type:'Push--sucessful',
            timeout:3000
        });
    }

    const genMessage=({id,values})=>{
        let message="";

        message=makebody({
            message:getFormat({id}),
            values
        });

        return message;
    }

    return (
        <div className="CardSendMail">
            <h2>Enviar SMS</h2>
            <p>Selecciona una plantilla, y el número de teléfono de cada cliente. (Si no seleccionas un número al cliente no se le enviará SMS)</p>
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
                                Teléfonos
                                <select>
                                    <option>-- Selecciona un número --</option>
                                    {
                                        client.phones.map(tel=>(
                                            <option value={tel.numero}>{tel.numero}</option>
                                        ))
                                    }
                                </select>
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
                    onClick={(e)=>{
                        e.textContent="Procesando...";

                        const body_sms={
                            "cod_sms":format,
                            "dias_mora":days_past_due,
                            "total_pendiente":total_amount
                        };

                        console.log(body_sms);
                        e.textContent="Enviar SMS";
                        // handlerSendSMS({data:body_sms});
                    }}
                >Enviar SMS</button>
            </div>
        </div>
    );
}