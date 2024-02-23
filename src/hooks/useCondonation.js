export default async function useCondonation(data,btn,id){
    const request= await fetch(`https://sefil.softsen.space/public/api/credit/condonar/${id}`,{
        method:'POST',
        body:new URLSearchParams(data),
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    
    const response=await request.json();

    if(response.status===200){
        btn.textContent='Condonación guardada';
        btn.setAttribute('disabled','');
        location.reload();
    }else{
        btn.textContent='Inténtalo de nuevo';
        btn.removeAttribute('disabled','');
    }
}