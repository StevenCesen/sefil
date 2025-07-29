import { useState } from "react";
import "./CardSendSMS.css";
import makebody from "../../helpers/makebody";
import useSendsms from "../../helpers/sendsms";
import sendpush from "../../helpers/sendpush";

export default function CardSendSMS({clients,days_past_due,total_amount}){
    const [client,setClient]=useState('');
    const [phone,setPhone]=useState('');
    const [format,setFormat]=useState('');
    const [message,setMessage]=useState('');
    
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
            <div className="CardSendmail__head">
                <label className="CardSendMail__label">
                    Cliente (s)
                    <select
                        defaultValue={client}
                        onChange={(e)=>{
                            setClient(e.target.value);
                        }}
                    >
                        <option>-- Seleccionar --</option>
                        <option value={"all"}>TITULAR Y GARANTE</option>
                        {
                            clients.map(client=>(
                                <option value={`${client.name}`}>{client.name}</option>
                            ))
                        }
                    </select>
                </label>
                <label className="CardSendMail__label">
                    Números disponibles
                    <input 
                        type="text"
                        value={phone}
                        onChange={(e)=>{
                            setPhone(e.target.value);
                        }}
                    />
                </label>
                <label className="CardSendMail__label">
                    Plantilla
                    <select
                        defaultValue={format}
                        onChange={(e)=>{
                            if(client!==''){
                                setFormat(e.target.value);
                                let message_complete='';

                                if(client==='all'){
                                    
                                    clients.map(cli=>{
                                        const values=[
                                            `Estimado(a) ${cli.name}`,
                                            days_past_due,
                                            (e.target.value!==43335) ? total_amount : '0999380019'
                                        ];

                                        let sms=genMessage({
                                            id:e.target.value,
                                            values
                                        });

                                        message_complete+=`${sms}@`;
                                    });

                                    setMessage(message_complete);

                                }else{
                                    const values=[
                                        `Estimado(a) ${client}`,
                                        days_past_due,
                                        (e.target.value!==43335) ? total_amount : '0999380019'
                                    ];

                                    setMessage(
                                        genMessage({
                                            id:e.target.value,
                                            values
                                        })
                                    );
                                }
                            }
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
            </div>
            
            <div className="CardSendMail__body">
                {
                    message.split('@').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))
                }
            </div>
            <button 
                className="CardSendMail__send"
                onClick={(e)=>{
                    const body_sms={
                        "phone":phone,
                        "cod_sms":format,
                        "name":client,
                        "dias_mora":days_past_due,
                        "total_pendiente":total_amount
                    };

                    handlerSendSMS({data:body_sms});
                }}
            >Enviar correo</button>
        </div>
    );
}