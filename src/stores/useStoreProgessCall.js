import { create } from 'zustand'
import sendpush from '../helpers/sendpush';

export const useStoreProgressCall = create((set,get) => ({
    credit_id:0,
    phone_number:'',
    channel:'',
    campain_id:0,

    record_audio:'',
    duration:0,
    state_call:'',

    message_status:'Llamar',
    in_call:false,
    view_select:false,

    setInfoCall:({credit_id,campain_id})=>{
        set({credit_id:credit_id})
        set({campain_id:campain_id})
    },
    setInfoPhone:({phone_number})=>{
        const {in_call}=get();

        if(in_call){
            sendpush({
                title:'Llamada en progreso',
                message:'No puedes llamar hasta que termine la llamada actual.',
                type:'Push--danger',
                timeout:3000
            });
        }else{
            set({phone_number:phone_number})
        }
    },
    setChannel:     (value)=>{set({channel:value})},
    setRecordAudio:     ({record,duration})=>{
        set({record_audio:record}),
        set({duration:duration})
    },
    setMessage:     (value)=>{set({message_status:value})},
    setInCall:     (value)=>{set({in_call:value})},
    setState:     (value)=>{set({state_call:value})},
    setViewSelect:     (value)=>{set({view_select:value})},
    clean:     ()=>{
        set({channel:''}),
        set({record_audio:''}),
        set({duration:0}),
        set({state_call:''}),
        set({in_call:false}),
        set({view_select:false})
    },
}));