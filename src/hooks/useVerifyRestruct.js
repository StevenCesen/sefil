export default async function useVerifyStruct(id){
    const request= await fetch(`https://sefil.softsen.space/public/api/credit/verify/restruct/${id}`,{
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