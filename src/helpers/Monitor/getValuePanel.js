export default async function getAgents(){
    const request=await fetch(`${import.meta.env.VITE_URL_BASE}/panel-metrics`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    const response=await request.json();
    return response;
}