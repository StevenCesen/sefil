export default async function getAgents({campain_id,cartera}){
    const request=await fetch(`${import.meta.env.VITE_URL_BASE}/users/monitor?campain=${campain_id}&cartera=${cartera}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const response=await request.json();
    return response;
}