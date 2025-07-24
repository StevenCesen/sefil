import Push from "../components/Push/Push";

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
        Push({
            title:'Éxito',
            message:`Permiso actualizado correctamente.`,
            timeout:5000,
            type:200
        });
    }else{
        Push({
            title:'ERR',
            message:`No se pudo actualizar permiso.`,
            timeout:5000,
            type:400
        });
    }
}