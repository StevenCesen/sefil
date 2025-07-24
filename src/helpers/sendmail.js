export default async function sendmail({data}){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/sendmail`,{
        method:'POST',
        body:new URLSearchParams(data),
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();
    return response;
}