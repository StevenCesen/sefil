export default async function useSearchCreditInDistribution({value,distribution,cartera,setAgent,setCredit}){
    const request=await fetch(`${import.meta.env.VITE_URL_BASE}/cartera/search?cartera=${cartera}&credito=${value}`);
    const response=await request.json();

    setAgent({
        id:(response.user_id===0) ? 0 : response.user_id,
        name:(response.user_id===0) ? "N/A" : response.agent_name
    });
    setCredit([response]);
}