import { create } from 'zustand'

export const useStoreManagement = create((set) => ({
    credit:null,
    view_panel:false,
    client_name:'',
    client_ci:'',
    client_type:'',
    credit_id:'',
    state_gestion:'',
    substate_gestion:'',
    promise_date:'',
    promise_amount:0,
    campain_id:'',
    id_call:'',
    id_calls_extras:[],
    observation:'',
    dias_vencidos:0,
    cartera:'',
    monto:0,
    monto_pagar:0,
    nro_notificacion:'',
    setClient:({client_name,client_ci,client_type,credit_id})=>{
        set({client_name:client_name})
        set({client_ci:client_ci})
        set({client_type:client_type})
        set({credit_id:credit_id})
    },
    setView:     (value)=>{set({view_panel:value})},
    setCredit:     (value)=>{set({credit:value})},
    setState:     (value)=>{set({state_gestion:value})},
    setSubtate:     (value)=>{set({substate_gestion:value})},
    setPromiseDate:     (value)=>{set({promise_date:value})},
    setPromiseAmount:     (value)=>{set({promise_amount:value})},
    setCampainID:     (value)=>{set({campain_id:value})},
    setObservation:     (value)=>{set({credit:value})},
}));