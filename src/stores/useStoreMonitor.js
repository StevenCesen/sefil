import { create } from 'zustand'
import getAgents from '../helpers/Monitor/getAgents';

export const useStoreMonitor = create((set,get) => ({
    agents:[],
    campain_id: "",
    setAgents: async ()=>{
        const {campain_id}=get();
        const agents=await getAgents({campain_id});
        set({agents:agents})
    },
    setIDCampain: (campain_id) => {
        set({campain_id: campain_id});
    },
    updateAgent: async ({data}) =>{
        const {campain_id,agents}=get();

        if(Number(data.campain_id)===Number(campain_id) || data.campain_id==='ALL' || campain_id===''){
            let agentFound = false;
            const updatedAgents = agents.map(agent => {
                if (Number(agent.user_id) === Number(data.user_id)) {
                    agentFound = true;
                    if (data.campain_id === 'ALL') {
                        return {
                            ...agent,
                            user_state: data.user_state,
                            time_state: data.time_state
                        };
                    }  

                    return {
                        ...agent,
                        user_state: data.user_state,
                        time_state: data.time_state,
                        campain_name: data.campain_name,
                        campain_id: data.campain_id,
                        data: {
                            nro_credits: data.data.nro_credits,
                            nro_gestions: data.data.nro_gestions,
                            nro_gestions_dia: data.data.nro_gestions_dia,
                            nro_gestions_efec: data.data.nro_gestions_efec,
                            nro_gestions_efec_dia: data.data.nro_gestions_efec_dia,
                            nro_pendientes: data.data.nro_pendientes,
                            nro_proceso: data.data.nro_proceso,
                            nro_proceso_dia: data.data.nro_proceso_dia,
                            nro_calls: data.data.nro_calls,
                            nro_calls_acum: data.data.nro_calls_acum
                        }
                    };
                }

                return agent;
            });

            if (!agentFound) {
                console.log('⚠️ Agent not found in list!');
            } else {
                console.log('✅ Updated agents:', updatedAgents);
            }

            set({agents:updatedAgents});
        } else {
            console.log('❌ Campaign filter did not match');
        }
    }
}));