import { create } from 'zustand'

export const useStoreFilterManagement = create((set,get) => ({
    credits:null,
    current_index:0,
    tray:'PENDIENTE',
    name: '',
    business:'SEFIL_1',
    ci:'',
    agency:'',
    days_past_due_min:'',
    days_past_due_max:'',
    management_state:'',
    promise_date:'',
    nro_pending:0,
    nro_processed:0,
    nro_managements:0,
    nro_inactive:0,
    setTray:            (value)=>{set({tray:value})},
    setBusiness:        (value)=>{set({business:value})},
    setName:            (value)=>{set({name:value})},
    setCi:              (value)=>{set({ci:value})},
    setAgency:          (value)=>{set({agency:value})},
    setMinDays:         (value)=>{set({days_past_due_min:value})},
    setMaxDays:         (value)=>{set({days_past_due_max:value})},
    setManagementState: (value)=>{set({management_state:value})},
    setPromiseDate:     (value)=>{set({promise_date:value})},
    setCurrent:     (value)=>{set({current_index:value})},
    setCredits:     (value)=>{set({credits:value})},
    getFilterString: () => {
        const {name,business,ci,days_past_due_max,days_past_due_min,agency,management_state,promise_date,tray} = get();
        const parts = [];
        if (name.trim() !== '') parts.push(`name=${name.trim()}`);
        if (business.trim() !== '') parts.push(`business=${business.trim()}`);
        if (agency.trim() !== '') parts.push(`agency=${agency.trim()}`);
        if (ci.trim() !== '') parts.push(`ci=${ci.trim()}`);
        if (days_past_due_max.trim() !== '') parts.push(`max_days=${days_past_due_max.trim()}`);
        if (days_past_due_min.trim() !== '') parts.push(`min_days=${days_past_due_min.trim()}`);
        if (management_state.trim() !== '') parts.push(`status_management=${management_state.trim()}`);
        if (promise_date.trim() !== '') parts.push(`promise=${promise_date.trim()}`);
        if (tray.trim() !== '') parts.push(`tray=${tray.trim()}`);
        parts.push(`user_id=${localStorage.getItem('temp_uS')}`);
        return parts.join('&');
    },
    FilteredCredits: async (filters) => {
        const end_point=`${import.meta.env.VITE_URL_BASE}/campains/credits?${filters}`;
        try {
            const request=await fetch(end_point,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();
            set({ credits:data});

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    numberTrays: async () => {
        const {business}=get();
        const end_point=`${import.meta.env.VITE_URL_BASE}/campains/NumberTrays?user_id=${localStorage.getItem('temp_uS')}&business=${business}`;
        try {
            const request=await fetch(end_point,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();

            set({nro_pending:data.pendiente});
            set({nro_processed:data.proceso});
            set({nro_managements:data.gestionado});
            set({nro_inactive:data.inactivo});

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    getNextCredit:()=>{
        const {current_index,credits}=get();
        if((current_index + 1) < credits.data.length){
            set({current_index:current_index+1});
            return credits.data[current_index+1];
        }
    }
}));