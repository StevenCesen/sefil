export default async function useVerifyCondonation(id){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/verify/condonation/${id}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();
    
    if(response.status===200){
        return true;
    }else{
        return false;
    }
}