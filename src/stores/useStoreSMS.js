import { create } from 'zustand'
import makebody from '../helpers/makebody';
import useSendsms from '../helpers/sendsms';

export const useStoreSMS = create((set,get) => ({
    view: false,
    name:'',
    type:'',
    phone_number:'',
    payment_date:'',
    cod_sms:'',
    total_amount:'',
    days_past_due:'',
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
    setContact:({phone_number,name,type,view,days_past_due,total_amount})=>{
        set({phone_number:phone_number})
        set({name:name})
        set({type:type})
        set({view:view})
        set({days_past_due:days_past_due})
        set({total_amount:total_amount})
        set({phone_contact:localStorage.getItem('phone_number')})
    },
    setView:(value)=>{set({view:value})},
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
        const {name,type,total_amount,phone_contact,days_past_due,payment_date,cod_sms}=get();

        let data={}

        if(Number(cod_sms)===43334){
            data={
                "phone":"593978950498",
                "cod_sms":cod_sms,
                "name":`Sr(a) ${name} ${type}`,
                "payment_date":payment_date,
                "total_amount":total_amount
            }
        }else if(Number(cod_sms)===43335){
            data={
                "phone":"593978950498",
                "cod_sms":cod_sms,
                "name":`Sr(a) ${name} ${type}`,
                "days_past_due":days_past_due,
                "total_amount":total_amount
            }
        }else if(Number(cod_sms)===48392){
            data={
                "phone":"593978950498",
                "cod_sms":cod_sms,
                "name":`Sr(a) ${name} ${type}`,
                "total_amount":total_amount,
                "phone_contact":phone_contact
            }
        }

        console.log(data);

        const send=await useSendsms({data});
        return send.respuesta;
    }
}));