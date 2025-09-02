import { create } from 'zustand'

export const useStoreMonitor = create((set,get) => ({
    cartera:'',
    agents:[],
    campain_id:'',
    connectWS: async ()=>{
        const conn = new WebSocket('wss://check.sefil.com.ec/ws');

        conn.onopen = function(e) {
            console.log("WSS: Connection established!");
        };
        
        conn.onmessage = function(e) {
            const data=JSON.parse(e.data);
            console.log(data);
        };
    },
    setAgents: async ()=>{

    },
    setIDCampain: (cartera) => {
        set({cartera:cartera});
        if(cartera=='SEFIL_1'){
            set({campain_id:16});
        }else if(cartera==='SEFIL_2'){
            set({campain_id:17});
        }else{
            set({campain_id:33});
        }
    },
    // setPayments: async () => {
    //     const {cartera,credit_id}=get();
    //     const payments=await getListPayments({credit_id,cartera});
    //     set({payments:payments});
    // }
}));