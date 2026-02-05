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
    invoice_value:0,
    otros_valores:0,
    id:0,
    cartera:'',
    ci:'',
    name:'',
    setData:'',
    view:'',
    update:'',
    // Valores condonados (para modo edición)
    condonated_capital:0,
    condonated_interes:0,
    condonated_mora:0,
    condonated_seguro_desgravamen:0,
    condonated_gastos_judiciales:0,
    condonated_gastos_cobranza:0,
    condonated_otros_valores:0,
    response:{},
    setResponse:(value)=>{set({response:value})},
    viewOn:(value)=>{set({isViewOn:value})},
    setViewPDF:(value)=>{set({viewPDF:value})},
    setInfoCredit: ({ci,name,total,capital,mora,interes,seguro_desgravamen,gastos_judiciales,gastos_cobranza,gastos_cobranza_sefil,otros_valores,invoice_value,id,cartera,setData,view,update,condonated_capital,condonated_interes,condonated_mora,condonated_seguro_desgravamen,condonated_gastos_judiciales,condonated_gastos_cobranza,condonated_otros_valores})=>{
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
        set({invoice_value})
        set({id})
        set({cartera})
        set({setData})
        set({view})
        set({update})
        set({condonated_capital: condonated_capital || 0})
        set({condonated_interes: condonated_interes || 0})
        set({condonated_mora: condonated_mora || 0})
        set({condonated_seguro_desgravamen: condonated_seguro_desgravamen || 0})
        set({condonated_gastos_judiciales: condonated_gastos_judiciales || 0})
        set({condonated_gastos_cobranza: condonated_gastos_cobranza || 0})
        set({condonated_otros_valores: condonated_otros_valores || 0})
        set({isViewOn:true})
    }
}));