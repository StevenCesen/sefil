import { create } from 'zustand'
import getListPhones from '../helpers/Calls/getListPhones';
import getListManagements from '../helpers/Managements/getListManagements';
import getListPayments from '../helpers/Payments/getListPayments';

export const useStoreManagement = create((set,get) => ({
    credit:null,
    view_panel:false,
    client_name:'',
    client_ci:'',
    client_type:'',
    credit_id:'',
    state_gestion:'',
    substate_gestion:'',
    promise_date:'',
    promise_amount:0,
    campain_id:'',
    id_call:'',
    id_calls_extras:[],
    observation:'',
    dias_vencidos:0,
    cartera:'',
    monto:0,
    nro_notificacion:'',

    phones:null,
    managements:null,
    payments:null,
    section:'MANAGEMENTS',

    setClient:({client_name,client_ci,client_type,credit_id})=>{
        set({client_name:client_name})
        set({client_ci:client_ci})
        set({client_type:client_type})
        set({credit_id:credit_id})
    },
    setView:     (value)=>{set({view_panel:value})},
    setCredit:     (value)=>{

        const {setPhones,setManagements,setPayments}=get();

        set({credit:value}),
        set({credit_id:value.id})
        set({client_name:value.clients[0].name});
        set({client_ci:value.clients[0].ci});
        set({client_type:value.clients[0].type});
        set({dias_vencidos:value.days_past_due});
        set({monto:value.total_amount});
        
        setPhones({
            identification:value.clients[0].ci,
            credit_id:value.id
        });

        setManagements();
        setPayments();
    },
    setState:     (value)=>{set({state_gestion:value})},
    setSubstate:     (value)=>{set({substate_gestion:value})},
    setPromiseDate:     (value)=>{set({promise_date:value})},
    setPromiseAmount:     (value)=>{set({promise_amount:value})},
    setCampainID:     (value)=>{set({campain_id:value})},
    setObservation:     (value)=>{set({observation:value})},
    setSection:     (value)=>{set({section:value})},
    setIDCampain: (cartera) => {
        set({cartera:cartera});
        if(cartera=='SEFIL_1'){
            set({campain_id:16});
        }else if(cartera==='SEFIL_2'){
            set({campain_id:17});
        }else{
            set({campain_id:32});
        }
    },
    setNew:     ()=>{
        set({phones:null}),
        set({managements:null}),
        set({payments:null})
    },
    setPhones: async ({identification,credit_id}) => {
        const phones=await getListPhones({credit_id,identification});
        set({phones:phones});
    },
    setManagements: async () => {
        const {cartera,credit_id}=get();
        const managements=await getListManagements({credit_id,cartera});
        set({managements:managements});
    },
    setPayments: async () => {
        const {cartera,credit_id}=get();
        const payments=await getListPayments({credit_id,cartera});
        set({payments:payments});
    },
    setIdCall:(call)=>{
        const {id_calls_extras}=get();

        const temp_ids=id_calls_extras;
        temp_ids.push(call);

        set({id_call:call}),
        set({id_calls_extras:temp_ids})
    },
    clean:()=>{
        set({state_gestion:''}),
        set({substate_gestion:''}),
        set({promise_date:''}),
        set({promise_amount:0}),
        set({id_call:''}),
        set({id_calls_extras:[]}),
        set({observation:''}),
        set({nro_notificacion:''})
    }
}));