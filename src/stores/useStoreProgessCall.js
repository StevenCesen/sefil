import { create } from 'zustand'

export const useStoreProgressCall = create((set) => ({
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

    setInfoCall:({credit_id,phone_number,channel,campain_id})=>{
        set({credit_id:credit_id})
        set({phone_number:phone_number})
        set({channel:channel})
        set({campain_id:campain_id})
    },
    setRecordAudio:     ({record,duration})=>{
        set({record_audio:record}),
        set({duration:duration})
    },
    setMessage:     (value)=>{set({message_status:value})},
    setInCall:     (value)=>{set({in_call:value})},
    setState:     (value)=>{set({state_call:value})},
    setViewSelect:     (value)=>{set({view_select:value})}
}));