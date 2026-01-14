export default async function useVerifyStruct({credit_id}){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/agreements/credit/${credit_id}/has`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();
    
    if(response.result.has_agreement){
        return true;
    }else{
        return false;
    }
}