import { create } from 'zustand'
import getTemplates from '../helpers/Managements/getTemplates';

export const useStoreTemplate = create((set,get) => ({
    templates:[],
    current_template:[],
    getTemplates: async () => {
        const data_templates=await getTemplates();
        if(data_templates && data_templates.result){
            set({templates:data_templates.result})
        }
    },
    setTemplate:()=>{
        const {templates}=get();
        set({current_template:templates})
    }
}));