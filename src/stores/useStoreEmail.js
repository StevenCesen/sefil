import { create } from 'zustand'
import makebody from '../helpers/makebody';

export const useStoreEmail = create((set,get) => ({
    view: false,
    client_name:'',
    user_name:localStorage.getItem('name'),

    client_type:'',
    client_agency:'',
    client_ci:'',
    payment_date:'',
    total_amount:'',
    days_past_due:'',

    phone_contact:localStorage.getItem('phone_number'),
    templates:['Recordatorio','Cobranza intensiva','Judicial'],
    template:'',
    client_email:'',
    promise_date:'',

    setContact:({name,type,view,days_past_due,email,total_amount})=>{
        set({client_name:name})
        set({client_type:type})
        set({view:view})
        set({days_past_due:days_past_due})
        set({total_amount:total_amount})
        set({client_email:email})
    },
    setEmail:(value)=>{set({email:value})},
    setView:(value)=>{set({view:value})},
    setTemplate:(value)=>{set({template:value})},
    setMessage:()=>{
        const {template,client_name,client_type,client_email,total_amount,phone_contact,days_past_due,payment_date,user_name}=get();

        let values={};

        if(template==='Recordatorio'){
            values={
                client_name:`${client_name} ${client_type}`,
                total_amount,
                days_past_due,
                user_name,
                phone_contact,
                client_email
            };
        }else if(template==='Cobranza intensiva'){
            values={
                client_name:`${client_name} ${client_type}`,
                total_amount,
                days_past_due,
                payment_date,
                user_name,
                phone_contact,
                client_email
            };
        }else if(template==='Judicial'){
            values={
                client_name:`${client_name} ${client_type}`,
                total_amount,
                days_past_due,
                user_name,
                phone_contact,
                client_email
            };
        }

        return values;
        // let message=makebody({
        //     message:form.text,
        //     values
        // });

        // set({message:message});
    },
    sendEmail:async ()=>{
        const {email,setMessage}=get();
        //SendEmailRemember
        //SendEmailFull
        const data=setMessage();
        
        return data;
    }
}));