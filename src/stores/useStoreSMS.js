import { create } from 'zustand'
import makebody from '../helpers/makebody';
import useSendsms from '../helpers/sendsms';
import checkSMS from '../helpers/checksms';
import sendpush from '../helpers/sendpush';

export const useStoreSMS = create((set,get) => ({
    view: false,
    name:'',
    ci:'',
    type:'',
    phone_number:'',
    payment_date:'',
    cod_sms:'',
    promise_date:'',
    total_amount:'',
    days_past_due:'',
    campain_id:'',
    credit_id:'',
    client_id:'',
    phone_contact:'',
    templates:[
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
    ],  
    setContact: async ({phone_number,name,type,view,days_past_due,total_amount,ci,campain_id,credit_id,client_id})=>{
        // Primero verificamos si ya se envió un SMS
        if(view) {
            const check_result = await checkSMS({
                client_id: client_id,
                credit_id: credit_id,
                campain_id: campain_id
            });

            if (check_result.error) {
                sendpush({
                    title: 'Error de verificación.',
                    message: check_result.message || 'No se pudo verificar el estado del SMS.',
                    type: 'Push--danger',
                    timeout: 5000
                });
                return; // No abrir el modal
            }

            // Si el backend indica que no se puede enviar (code: -1 o puede_enviar: false)
            if (check_result.code === -1 || (check_result.result && check_result.result.puede_enviar === false)) {
                sendpush({
                    title: 'SMS ya enviado.',
                    message: check_result.message || 'Ya se envió un SMS a este cliente en esta campaña.',
                    type: 'Push--warning',
                    timeout: 5000
                });
                return; // No abrir el modal
            }
        }

        // Si pasa las verificaciones, configurar los datos y abrir el modal
        set({phone_number:phone_number})
        set({name:name})
        set({type:type})
        set({view:view})
        set({days_past_due:days_past_due})
        set({total_amount:Number(total_amount).toFixed(2)})
        set({phone_contact:localStorage.getItem('phone_number')})
        set({campain_id:campain_id})
        set({credit_id:credit_id})
        set({client_id:client_id})
        set({ci:ci})
    },
    setView:(value)=>{set({view:value})},
    setPromiseDate:(value)=>{set({promise_date:value})},
    setMessage:(id)=>{
        const {templates,name,type,total_amount,phone_contact,days_past_due,payment_date}=get();

        templates.map(form=>{
            if(Number(form.id)===Number(id)){
                let values=[];

                if(Number(id)===43334){
                    values=[
                        `Sr(a) ${name} ${type}`,
                        payment_date,
                        total_amount
                    ];
                }else if(Number(id)===43335){
                    values=[
                        `Sr(a) ${name} ${type}`,
                        days_past_due,
                        total_amount
                    ];
                }else if(Number(id)===48392){
                    values=[
                        `Sr(a) ${name} ${type}`,
                        total_amount,
                        phone_contact
                    ];
                }

                set({cod_sms:id});

                let message=makebody({
                    message:form.text,
                    values
                });

                set({message:message});
            }
        });
    },
    sendSMS:async ()=>{
        const {name,type,total_amount,phone_contact,phone_number,days_past_due,payment_date,cod_sms,campain_id,credit_id,client_id}=get();

        let data={}

        if(Number(cod_sms)===43334){
            data={
                "phone":phone_number,
                "cod_sms":cod_sms,
                "client_id":client_id,
                "credit_id":credit_id,
                "campain_id":campain_id,
                "name":`Sr(a) ${name} ${type}`,
                "payment_date":payment_date,
                "total_amount":total_amount
            }
        }else if(Number(cod_sms)===43335){
            data={
                "phone":phone_number,
                "cod_sms":cod_sms,
                "client_id":client_id,
                "credit_id":credit_id,
                "campain_id":campain_id,
                "name":`Sr(a) ${name} ${type}`,
                "days_past_due":days_past_due,
                "total_amount":total_amount
            }
        }else if(Number(cod_sms)===48392){
            data={
                "phone":phone_number,
                "cod_sms":cod_sms,
                "client_id":client_id,
                "credit_id":credit_id,
                "campain_id":campain_id,
                "name":`Sr(a) ${name} ${type}`,
                "total_amount":total_amount,
                "phone_contact":phone_contact
            }
        }

        const send=await useSendsms({data});
        return send;
    }
}));