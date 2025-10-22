export default async function checkManagement({campain_id,credit_id}){
    try {
        const request=await fetch(`${import.meta.env.VITE_URL_BASE}/managments/check/${credit_id}`,{
            method:'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body:new URLSearchParams({campain_id})
        });
        
        const response=await request.json();

        return response;

    } catch (error) {
        return {
            state:400,
            error:error
        };
    }
}