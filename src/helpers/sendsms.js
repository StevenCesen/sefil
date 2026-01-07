export default async function useSendsms({data}){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/sms/send`,{
        method:'POST',
        body:JSON.stringify(data),
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();
    return response;
}