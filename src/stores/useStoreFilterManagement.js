import { create } from 'zustand'

export const useStoreFilterManagement = create((set,get) => ({
    credits: null,
    campains: null,
    current_index:0,
    tray:'PENDIENTE',
    name: '',
    business_id:0,
    sector:'',
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
    setBusiness:        (value)=>{set({business_id:value})},
    setName:            (value)=>{set({name:value})},
    setCi:              (value)=>{set({ci:value})},
    setAgency:          (value)=>{set({agency:value})},
    setMinDays:         (value)=>{set({days_past_due_min:value})},
    setMaxDays:         (value)=>{set({days_past_due_max:value})},
    setManagementState: (value)=>{set({management_state:value})},
    setPromiseDate:     (value)=>{set({promise_date:value})},
    setSector:          (value)=>{set({sector:value})},
    setCurrent:     (value)=>{set({current_index:value})},
    setCredits:     (value)=>{set({credits:value})},
    getCampains: async () => {
        const { numberTrays } = get();

        const end_point=`${import.meta.env.VITE_URL_BASE}/campains?state=active`;
        try {
            const request=await fetch(end_point,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (request.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                return;
            }
            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();
            set({ campains:data.result});
            set({ business_id:data.result.data.length > 0 ? data.result.data[0].business_id : 0 }); 
            await numberTrays();
        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    getFilterString: () => {
        const {name,business_id,ci,days_past_due_max,days_past_due_min,agency,sector,management_state,promise_date,tray} = get();
        const parts = [];
        if (name.trim() !== '') parts.push(`client_name=${name.trim()}`);
        if (business_id.trim() !== '') parts.push(`business_id=${business_id.trim()}`);
        if (agency.trim() !== '') parts.push(`agency=${agency.trim()}`);
        if (ci.trim() !== '') parts.push(`client_ci=${ci.trim()}`);
        if (days_past_due_max.trim() !== '') parts.push(`days_past_due_max=${days_past_due_max.trim()}`);
        if (days_past_due_min.trim() !== '') parts.push(`days_past_due_min=${days_past_due_min.trim()}`);
        if (management_state.trim() !== '') parts.push(`management_status=${management_state.trim()}`);
        if (promise_date.trim() !== '') parts.push(`management_promise=${promise_date.trim()}`);
        if (sector.trim() !== '') parts.push(`sector=${sector.trim()}`);
        if (tray.trim() !== '') parts.push(`management_tray=${tray.trim()}`);
        parts.push(`user_id=${localStorage.getItem('temp_uS')}`);
        return parts.join('&');
    },
    FilteredCredits: async (filters) => {
        const end_point=`${import.meta.env.VITE_URL_BASE}/credits?${filters}&with_payments=true&with_managements=true`;
        try {
            const request=await fetch(end_point,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (request.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                return;
            }

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();
            set({ credits:data.result});

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    getNextPage:async ({next_page_url})=>{
        const {getFilterString}=get();
        const filters=getFilterString();

        try {
            const request=await fetch(`${next_page_url}&${filters}&with_payments=true&with_managements=true`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (request.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                return;
            }

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();
            set({ credits:data.result});
            set({current_index:0});
            return data.result.data[0];

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    nextPage: async({url})=>{
        const {getFilterString}=get();
        const filters=getFilterString();

        try {
            const request=await fetch(`${url}&${filters}&with_payments=true&with_managements=true`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (request.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                return;
            }

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();
            set({credits:data.result});

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    numberTrays: async () => {
        const { business_id }=get();
        const end_point=`${import.meta.env.VITE_URL_BASE}/number-trays?user_id=${localStorage.getItem('temp_uS')}&business_id=${business_id}`;
        try {
            const request=await fetch(end_point,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (request.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
                return;
            }

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();

            set({nro_pending: ('PENDIENTE' in data.result.trays) ? data.result.trays.PENDIENTE : 0 });
            set({nro_processed: ('EN PROCESO' in data.result.trays) ? data.result.trays['EN PROCESO'] : 0 });
            set({nro_managements: ('GESTIONADO' in data.result.trays) ? data.result.trays.GESTIONADO : 0 });
            set({nro_inactive: ('INACTIVE' in data.result.trays) ? data.result.trays.INACTIVE : 0 });

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