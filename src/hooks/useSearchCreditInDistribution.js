export default async function useSearchCreditInDistribution({value,distribution,cartera,setAgent,setCredit}){
    // Obtengo el codigo => credito del value actual
    const request=await fetch(`${import.meta.env.VITE_URL_BASE}/public/api/cartera/search?cartera=${cartera}&credito=${value}`);
    const response=await request.json();

    JSON.parse(distribution.distributions).map((agent)=>{
        agent.distribution.map((credito)=>{
            if(credito.id===response.id){

                JSON.parse(distribution.agents).map((ag)=>{
                    if(ag.id===agent.agent_id){
                        setAgent({
                            id:agent.agent_id,
                            name:ag.name
                        });

                        setCredit([response]);

                    }
                })
            }
        });
    });
}