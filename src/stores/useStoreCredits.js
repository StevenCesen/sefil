import { create } from 'zustand'

export const useStoreFilterCredits = create((set,get) => ({
    credits:{data:[]},
    sync_id: '',
    client_name:'',
    client_ci:'',
    total_amount:'',
    days_past_due_min:'',
    days_past_due_max:'',
    cartera:'SEFIL_1',
    total_fees:0,
    agency:'',
    provincia:'',
    canton:'',
    sync_status:'',
    collection_state:'',
    agent:'',
    agents:[],
    setSyncID:          (value)=>{set({sync_id:value})},
    setName:            (value)=>{set({client_name:value})},
    setCI:              (value)=>{set({client_ci:value})},
    setAgency:          (value)=>{set({agency:value})},
    setMinDays:         (value)=>{set({days_past_due_min:value})},
    setMaxDays:         (value)=>{set({days_past_due_max:value})},
    setTotalAmount:     (value)=>{set({total_amount:value})},
    setCartera:         (value)=>{set({cartera:value})},
    setProvincia:       (value)=>{set({provincia:value})},
    setCanton:          (value)=>{set({canton:value})},
    setSyncStatus:      (value)=>{set({sync_status:value})},
    setCollectionState: (value)=>{set({collection_state:value})},
    setAgent:           (value)=>{set({agent:value})},
    setCredits:         async (data)=>{
        set({credits:data})
    },
    getAgents:          async ()=>{
        const { cartera } = get();
        const end_point=`${import.meta.env.VITE_URL_BASE}/campains/listAgents?cartera=${cartera}`;

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
            set({ agents:data});

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    },
    getFilterString: () => {
        const {sync_id,client_name,client_ci,total_amount,days_past_due_max,days_past_due_min,cartera,agency,provincia,canton,sync_status,collection_state,agent} = get();
        const parts = [];

        if (sync_id.trim() !== '')              parts.push(`sync_id=${sync_id.trim()}`);
        if (client_name.trim() !== '')          parts.push(`name=${client_name.trim()}`);
        if (client_ci.trim() !== '')            parts.push(`ci=${client_ci.trim()}`);
        if (total_amount.trim() !== '')         parts.push(`total_amount=${total_amount.trim()}`);
        if (cartera.trim() !== '')              parts.push(`business=${cartera.trim()}`);
        if (days_past_due_max.trim() !== '')    parts.push(`max_days=${days_past_due_max.trim()}`);
        if (days_past_due_min.trim() !== '')    parts.push(`min_days=${days_past_due_min.trim()}`);
        if (agency.trim() !== '')               parts.push(`agency=${agency.trim()}`);
        if (provincia.trim() !== '')            parts.push(`provincia=${provincia.trim()}`);
        if (canton.trim() !== '')               parts.push(`canton=${canton.trim()}`);
        if (sync_status.trim() !== '')          parts.push(`status=${sync_status.trim()}`);
        if (collection_state.trim() !== '')     parts.push(`collection_state=${collection_state.trim()}`);
        if (agent.trim() !== '')                parts.push(`user_id=${agent.trim()}`);

        return parts.join('&');
    },
    filterCredits: async (filters) => {
        const end_point=`${import.meta.env.VITE_URL_BASE}/campains/credits?${filters}`;
        console.log(end_point)
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
    changePage: async({url})=>{
        const {getFilterString}=get();
        const filters=getFilterString();

        try {
            const request=await fetch(`${url}&${filters}`,{
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!request.ok) {
                throw new Error('Error al consultar la API');
            }

            const data = await request.json();
            set({credits:data});

        } catch (error) {
            console.error('Error al hacer fetchFilteredCredits:', error);
        }
    }
}));