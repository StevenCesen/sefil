export default async function useAddPost(id,data,input,btn){
    const request= await fetch(`https://apis.softsen.space/binnacle/public/api/binnacles/edit/${id}`,{
        method:'PUT',
        body:data 
    });

    const response=await request.json();
    
    if(response.status==200){
        input.value='';
        btn.textContent='Subir';
        btn.removeAttribute('disabled');
    }else{
        btn.textContent='Subir';
        btn.removeAttribute('disabled');
    }

}