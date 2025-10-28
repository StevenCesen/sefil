import { create } from 'zustand'

export const useStoreBilling = create((set) => ({
    viewPDF: '',
    name:'',
    ci:'',
    direction:'',
    access_key:'',
    date:'',
    value:'',
    setViewPDF:(value)=>{set({viewPDF:value})},
    setInfo: ({ci,name,direction,access_key,date,value})=>{
        set({ci})
        set({name})
        set({direction})
        set({access_key})
        set({date})
        set({value})
        set({viewPDF:true})
    }
}));