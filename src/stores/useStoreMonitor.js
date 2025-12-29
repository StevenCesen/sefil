import { create } from 'zustand'
import getAgents from '../helpers/Monitor/getAgents';

export const useStoreMonitor = create((set,get) => ({
    agents:[],
    campain_id: "",
    setAgents: async ()=>{
        const {campain_id}=get();
        const agents=await getAgents({campain_id});
        console.log('🔍 Agents loaded from API:', agents);
        if (agents.length > 0) {
            console.log('🔍 First agent structure:', agents[0]);
            console.log('🔍 First agent keys:', Object.keys(agents[0]));
        }
        set({agents:agents})
    },
    setIDCampain: (campain_id) => {
        set({campain_id: campain_id});
    },
    updateAgent: async ({data}) =>{
        const {campain_id,agents}=get();
        console.log('WebSocket data received:', data);
        console.log('Current agents:', agents);
        console.log('Looking for user_id:', data.user_id);

        // La nueva estructura tiene los datos directamente en data, no en data.data
        if(Number(data.campain_id)===Number(campain_id) || data.campain_id==='ALL' || campain_id===''){
            let agentFound = false;
            const updatedAgents = agents.map(agent => {
                console.log(`Comparing agent.user_id (${agent.user_id}) with data.user_id (${data.user_id})`);
                if (Number(agent.user_id) === Number(data.user_id)) {
                    agentFound = true;
                    console.log('✅ Agent found! Updating:', agent.name);
                    // Actualizar con la nueva estructura de datos
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