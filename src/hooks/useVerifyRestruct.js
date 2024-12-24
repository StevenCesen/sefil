export default async function useVerifyStruct(id){
    console.log(id)
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/verify/restruct/${id}`,{
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();

    console.log(response)
    
    if(response.status===200){
        return true;
    }else{
        return false;
    }
}