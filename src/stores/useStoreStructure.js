import { create } from 'zustand'

export const useStoreStructure = create((set) => ({
    isViewOn: false,
    total_amount:0,
    gasto_cobranza:0,
    checksum:0,
    credit_id:0,
    cartera:'',
    type:'automatico',
    total_fees:0,
    amount_fee:0,
    fees:[],
    viewOn:(value)=>{set({isViewOn:value})},
    setTitle:(value)=>{set({title:value})},
    setMessage:(value)=>{set({message:value})},
    setType:(value)=>{set({type:value})},
    setChecksum:(value)=>{set({checksum:value})},
    setTotalFees: (value)=>{set({total_fees:value})},
    setAmountFee: (value)=>{set({amount_fee:value})},
    setFees: (value)=>{set({fees:value})},
    setInfoCredit: ({total_amount,gasto_cobranza,cartera,credit_id})=>{
        set({total_amount})
        set({gasto_cobranza})
        set({cartera})
        set({credit_id})
    }
}));