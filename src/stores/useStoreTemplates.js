import { create } from 'zustand'
import getTemplates from '../helpers/Managements/getTemplates';

export const useStoreTemplate = create((set,get) => ({
    templates:null,
    current_template:[],
    getTemplates: async () => {
        const data_templates=await getTemplates();
        set({templates:data_templates})
    },
    getTemplate:({id})=>{
        const {templates}=get();
        let temp='';
        
        templates.map(template => {
            if(template.id===id){
                const states=JSON.parse(template.structure);
                temp=states.default[2].suboptions;
            }
        });

        return temp;
    },
    setTemplate:({role,days_past_due})=>{
        const {getTemplate}=get();
        if (role === 'legal') {
            // Se usa la plantilla de Judicial
            set({current_template:getTemplate({id:3})});
        } else if ((role === 'campo' || role === 'administrador') && days_past_due > 31) {
            // Se usa la plantilla de Campo
            set({current_template:getTemplate({id:2})});
        } else if (role === 'call' || role === 'campo' || role === 'administrador') {
            // Se usa la plantilla de Call Center
            set({current_template:getTemplate({id:1})});
        }
    }
}));