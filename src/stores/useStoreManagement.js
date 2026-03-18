import { create } from 'zustand'
import getListPhones from '../helpers/Calls/getListPhones';
import getListNotes from '../helpers/Managements/getListNotes';
import checkManagement from '../helpers/Managements/checkManagement';
import { useStoreFilterManagement } from './useStoreFilterManagement';

export const useStoreManagement = create((set,get) => ({
    credit:null,
    view_panel:false,
    client_name:'',
    client_ci:'',
    client_type:'',
    client_id:'',
    credit_id:'',
    state:'',
    substate:'',
    observation:'',
    promise_date:'',
    promise_amount:0,
    created_by:null,
    call_id:null,
    call_collection:[],
    days_past_due:0,
    paid_fees:0,
    pending_fees:0,
    managed_amount:0,
    campain_id:'',
    nro_notification:'',
    cartera:'',
    monto:0,
    message:'No gestionado',

    phones:null,
    managements:null,
    payments:null,
    calls:null,
    notes:null,
    section:'MANAGEMENTS',

    setClient:({client_name,client_ci,client_type,client_id,credit_id})=>{
        set({client_name:client_name})
        set({client_ci:client_ci})
        set({client_type:client_type})
        set({client_id:client_id})
        set({credit_id:credit_id})
    },
    setView:     (value)=>{set({view_panel:value})},
    setNroNotification:     (value)=>{set({nro_notification:value})},
    setCredit:     (value)=>{

        const { setPhones }=get();

        set({credit:value}),
        set({credit_id:value.id})
        set({client_id:value.clients[0].id});
        set({client_name:value.clients[0].name});
        set({client_ci:value.clients[0].ci});
        set({client_type:value.clients[0].type});
        set({days_past_due:value.days_past_due});
        set({paid_fees:value.paid_fees || 0});
        set({pending_fees:value.pending_fees || 0});
        set({monto:value.total_amount});
        set({managed_amount:value.managed_amount || 0});

        const store_filter = useStoreFilterManagement.getState();
        if (store_filter.campains && store_filter.campains.data && value.business_id) {
            const campain = store_filter.campains.data.find(
                camp => camp.business_id === value.business_id
            );
            if (campain) {
                set({campain_id: campain.id});
            }
        }

        setPhones({
            client_id: value.clients[0].id,
        });

        set({managements: { data: value.collection_managements || [] }});
        set({payments: { data: value.collection_payments || [] }});
        set({calls: { data: value.collection_calls || [] }});
        set({notes: { data: [] }});
        set({section: 'MANAGEMENTS'});

    },
    setState:     (value)=>{set({state:value})},
    setSubstate:     (value)=>{set({substate:value})},
    setPromiseDate:     (value)=>{set({promise_date:value})},
    setPromiseAmount:     (value)=>{set({promise_amount:value})},
    setCampainID:     (value)=>{set({campain_id:value})},
    setObservation:     (value)=>{set({observation:value})},
    setSection:     (value)=>{set({section:value})},
    setCreatedBy:     (value)=>{set({created_by:value})},
    setCallId:     (value)=>{set({call_id:value})},
    setCallCollection:     (value)=>{set({call_collection:value})},
    setDaysPastDue:     (value)=>{set({days_past_due:value})},
    setPaidFees:     (value)=>{set({paid_fees:value})},
    setPendingFees:     (value)=>{set({pending_fees:value})},
    setManagedAmount:     (value)=>{set({managed_amount:value})},
    setNewPhone:     (value)=>{
        const {phones}=get();
        const newPhones = [...phones, value];
        set({phones:newPhones});
    },
    removePhone:     (id)=>{
        const {phones}=get();
        set({phones: phones.filter(p => p.id !== id)});
    },
    setMessage:     (value)=>{set({message:value})},
    setIDCampain: (cartera) => {
        set({cartera:cartera});

        if(cartera=='SEFIL_1'){
            set({campain_id:16});
        }else if(cartera==='SEFIL_2'){
            set({campain_id:17});
        }else if(cartera==='legal'){
            set({campain_id:36});
        }else{
            set({campain_id:32});
        }
    },
    setNew:     ()=>{
        set({phones:null}),
        set({managements:null}),
        set({payments:null})
    },
    setPhones: async ({client_id}) => {
        const phones=await getListPhones({client_id});
        if(phones && phones.result && phones.result.data) {
            set({phones: phones.result.data.filter(p => p.phone_status !== 'INACTIVE')});
        }
    },
    addManagement: async (data) => {
        const { managements }=get();

        if (!managements || !managements.data) {
            return;
        }

        const temp = managements.data || [];
        temp.unshift(data);
        set({managements:{...managements, data:temp}});
    },
    setNotes: async () =>{
        const {cartera,credit_id}=get();
        const notes=await getListNotes({credit_id,cartera});
        set({notes:notes});
    },
    setIdCall:(call)=>{
        const {call_collection}=get();

        const temp_ids=[...call_collection];
        temp_ids.push(call);

        set({call_id:call}),
        set({call_collection:temp_ids})
    },
    clean:()=>{
        set({state:''}),
        set({substate:''}),
        set({promise_date:''}),
        set({promise_amount:0}),
        set({call_id:null}),
        set({call_collection:[]}),
        set({observation:''}),
        set({nro_notification:''}),
        set({managed_amount:0}),
        set({message:'No gestionado'})
    },
    checkManagement: async () => {
        const {campain_id,credit_id}=get();
        const state=await checkManagement({credit_id,campain_id});
        return state.state;
    },
    refreshCredit: async () => {
        const { credit } = get();
        if (!credit?.id || !credit?.business_id) return;

        try {
            const response = await fetch(
                `${import.meta.env.VITE_URL_BASE}/credits/${credit.id}?business_id=${credit.business_id}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            const data = await response.json();
            if (data.code === 1 && data.result) {
                const updatedCredit = data.result;
                set({ credit: updatedCredit });
                set({ monto: updatedCredit.total_amount });
                set({ payments: { data: updatedCredit.collection_payments || [] } });
            }
        } catch (error) {
            console.error('Error refreshing credit:', error);
        }
    }
}));