import sendpush from "../sendpush";

export default async function createCall({data_call}){
    try {
        const request=await fetch(`${import.meta.env.VITE_URL_BASE}/calls`,{
            method:'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body:new URLSearchParams(data_call)
        });

        if (request.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        const response=await request.json();

        if(response.code===1){
            sendpush({
                title:'Estado de llamada.',
                message:'Se ha guardado la llamada correctamente.',
                type:'Push--sucessful',
                timeout:3000
            });

            return response.result.id;
        }else{
            sendpush({
                title:'Error al guardar',
                message:'No se pudo guardar la llamada',
                type:'Push--error',
                timeout:3000
            });
            return null;
        }

    } catch (error) {
        sendpush({
            title:'Error de conexión',
            message:'No se pudo conectar con el servidor',
            type:'Push--error',
            timeout:3000
        });
        return null;
    }
}