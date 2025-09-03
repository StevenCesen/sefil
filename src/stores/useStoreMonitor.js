import { create } from 'zustand'
import getAgents from '../helpers/Monitor/getAgents';

export const useStoreMonitor = create((set,get) => ({
    cartera:'syncs',
    agents:[],
    campain_id:33,
    setAgents: async ()=>{
        const {cartera,campain_id}=get();
        const agents=await getAgents({cartera,campain_id});
        set({agents:agents})
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
    updateAgent: async ({data}) =>{
        const {campain_id,agents}=get();
        console.log(data.data)
        if(Number(data.data.campain)===Number(campain_id) || data.data.campain==='ALL'){
            const updatedAgents = agents.map(agent => {
                if ((Number(agent.id) === Number(data.data.user_id))) {
                    if ('all' in data.data && data.data.campain!=='ALL') {
                        return {
                            ...agent,
                            id: data.data.user_id,
                            agente: data.data.agente,
                            state: data.data.state,
                            tiempo: data.data.tiempo,
                            campain: data.data.campain,
                            total_credits: data.data.total_credits,
                            total_credits_ges: data.data.total_credits_ges,
                            total_credits_ges_dia: data.data.total_credits_ges_dia,
                            total_credits_ges_efec: data.data.total_credits_ges_efec,
                            total_credits_ges_efec_dia: data.data.total_credits_ges_efec_dia,
                            nro_pendientes: data.data.nro_pendientes,
                            nro_proceso_dia: data.data.nro_proceso_dia,
                            nro_proceso: data.data.nro_proceso,
                            nro_llamadas: data.data.nro_llamadas,
                            nro_llamadas_acum: data.data.nro_llamadas_acum,
                            nro_llamadas_efec: data.data.nro_llamadas_efec,
                            nro_llamadas_no_efec: data.data.nro_llamadas_no_efec
                        };
                    } else {
                        return {
                            ...agent,
                            state: data.data.state,
                            tiempo: data.data.tiempo
                        };
                    }
                }
                
                return agent;
            });

            set({agents:updatedAgents});
        }
    }
}));