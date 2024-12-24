import addNotification from "react-push-notification";

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
        addNotification({
            title: 'Éxito',
            subtitle: 'Permiso actualizado correctamente',
            message: 'Inicia sesión nuevamente',
            native: false,
            backgroundTop: '#009793',
            backgroundBottom: '#459d9a',
            colorTop: 'white',
            colorBottom: 'white',
            closeButton: 'Cerrar',
            duration:3000,
        });
    }else{
        addNotification({
            title: 'Error',
            subtitle: 'No se pudo actualizar permiso',
            message: 'Inténtalo otra vez',
            native: false,
            backgroundTop: '#FF9619',
            backgroundBottom: '#fdb864',
            colorTop: 'white',
            colorBottom: 'white',
            closeButton: 'Cerrar',
            duration:3000,
        });
    }
}