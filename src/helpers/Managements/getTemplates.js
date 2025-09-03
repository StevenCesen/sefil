export default async function getTemplates(){
    const request = await fetch(`${import.meta.env.VITE_URL_BASE}/templates`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    const response=await request.json();
    return response;
}