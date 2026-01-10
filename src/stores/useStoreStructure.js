import { create } from 'zustand'

export const useStoreStructure = create((set) => ({
    isViewOn: false,
    viewPDF: false,
    total_amount:0,
    gasto_cobranza:0,
    checksum:0,
    credit_id:0,
    ci:'',
    name:'',
    response:{},
    cartera:'',
    type:'automatico',
    total_fees:0,
    amount_fee:0,
    fees:[],
    agreement_id: null,
    view: '',
    existing_fees: [],
    viewOn:(value)=>{set({isViewOn:value})},
    setViewPDF:(value)=>{set({viewPDF:value})},
    setTitle:(value)=>{set({title:value})},
    setMessage:(value)=>{set({message:value})},
    setType:(value)=>{set({type:value})},
    setChecksum:(value)=>{set({checksum:value})},
    setResponse:(value)=>{set({response:value})},
    setTotalFees: (value)=>{set({total_fees:value})},
    setAmountFee: (value)=>{set({amount_fee:value})},
    setFees: (value)=>{set({fees:value})},
    setInfoCredit: ({ci,name,total_amount,gasto_cobranza,cartera,credit_id,agreement_id,view,existing_fees})=>{
        set({ci})
        set({name})
        set({total_amount})
        set({gasto_cobranza})
        set({cartera})
        set({credit_id})
        set({agreement_id: agreement_id || null})
        set({view: view || ''})
        set({existing_fees: existing_fees || []})
    }
}));