export default async function useUpdate(url,data,btn,resp){
    const request= await fetch(url,{
        method: 'PUT',
        body: data
    });

    const response=await request.json();
    btn.target.textContent='Guardar distribución';
    btn.target.removeAttribute('disabled');
    if(response.status===200){
        console.log("Guardado")
        resp.current.textContent='Horario guardado correctamente';
    }
}