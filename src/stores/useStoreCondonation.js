import { create } from 'zustand'

export const useStoreCondonation = create((set) => ({
    isViewOn: false,
    viewPDF: false,
    total:0,
    capital:0,
    mora:0,
    interes:0,
    seguro_desgravamen:0,
    gastos_judiciales:0,
    gastos_cobranza_sefil:0,
    gastos_cobranza:0,
    otros_valores:0,
    id:0,
    cartera:'',
    ci:'',
    name:'',
    setData:'',
    view:'',
    update:'',
    response:{},
    setResponse:(value)=>{set({response:value})},
    viewOn:(value)=>{set({isViewOn:value})},
    setViewPDF:(value)=>{set({viewPDF:value})},
    setInfoCredit: ({ci,name,total,capital,mora,interes,seguro_desgravamen,gastos_judiciales,gastos_cobranza,gastos_cobranza_sefil,otros_valores,id,cartera,setData,view,update})=>{
        set({ci})
        set({name})
        set({total})
        set({capital})
        set({mora})
        set({interes})
        set({seguro_desgravamen})
        set({gastos_judiciales})
        set({gastos_cobranza_sefil})
        set({gastos_cobranza})
        set({otros_valores})
        set({id})
        set({cartera})
        set({setData})
        set({view})
        set({update})
        set({isViewOn:true})
    }
}));