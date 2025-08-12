import sendpush from "../sendpush";

export default async function createCall({e,data_call}){
    try {
        const request=await fetch(`${import.meta.env.VITE_URL_BASE}/calls`,{
            method:'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body:new URLSearchParams(data_call)
        });

        const response=await request.json();

        if(response.state===200){
            e.target.textContent='Guardar llamada';
            
            sendpush({
                title:'Estado de llamada.',
                message:'Se ha guardado la llamada correctamente.',
                type:'Push--sucessful',
                timeout:3000
            });

            return response.id_call;

        }else{
            e.target.textContent="Intentar de nuevo";
        }

    } catch (error) {
        e.target.textContent=error;
    }
}