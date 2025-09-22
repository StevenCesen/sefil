export default async function useVerifyStruct({credit_id,cartera}){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/verify/restruct/${credit_id}?cartera=${cartera}`,{
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