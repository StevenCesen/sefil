import sendpush from "../helpers/sendpush";

export default async function useUpdatePermiss(data,id){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/users/edit/${id}`,{
        method:'PUT',
        body:new URLSearchParams(data),
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });

    const response=await request.json();
    
    if(response.status===200){ 
        sendpush({
            title:'Éxito.',
            message:'Permiso actualizado correctamente.',
            type:'Push--sucessful',
            timeout:3000
        });
    }else{
        sendpush({
            title:'ERR',
            message:'No se pudo actualizar permiso.',
            type:'Push--danger',
            timeout:3000
        });
    }
}