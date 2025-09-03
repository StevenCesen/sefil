export default async function createManagement({data_management}){
    try {
        const request=await fetch(`${import.meta.env.VITE_URL_BASE}/managments`,{
            method:'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body:new URLSearchParams(data_management)
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