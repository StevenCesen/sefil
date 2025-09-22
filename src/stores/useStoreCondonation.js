import { create } from 'zustand'

export const useStoreCondonation = create((set) => ({
    isViewOn: false,
    total:0,
    capital:0,
    mora:0,
    interes:0,
    seguro_desgravamen:0,
    gastos_judiciales:0,
    gastos_cobranza:0,
    otros_valores:0,
    id:0,
    cartera:'',
    setData:'',
    view:'',
    update:'',
    viewOn:(value)=>{set({isViewOn:value})},
    setInfoCredit: ({total,capital,mora,interes,seguro_desgravamen,gastos_judiciales,gastos_cobranza,otros_valores,id,cartera,setData,view,update})=>{
        set({total})
        set({capital})
        set({mora})
        set({interes})
        set({seguro_desgravamen})
        set({gastos_judiciales})
        set({gastos_cobranza})
        set({otros_valores})
        set({id})
        set({cartera})
        set({setData})
        set({view})
        set({update})
    }
}));