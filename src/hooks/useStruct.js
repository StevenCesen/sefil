export default async function useStruct(data,btn,id){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/credit/estructurar/${id}`,{
        method:'POST',
        body:new URLSearchParams(data),
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    const response=await request.json();

    if(response.status===200){
        btn.textContent='Guardado correctamente';
        btn.setAttribute('disabled','');
        // location.reload();
    }else{
        btn.textContent='Inténtalo de nuevo';
        btn.removeAttribute('disabled','');
    }
}