export default async function useLogout(e){
    
    if(e!==null){
        e.target.textContent='Cerrando';
    }

    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/logout`,{
        method:'POST',
        headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: new URLSearchParams({
            'user_id': localStorage.getItem('temp_uS')
        })
    });

    if(request.ok){
        const response=await request.json();
        console.log(response);
        if(response.code===1){
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            localStorage.removeItem('temp_uS');
            localStorage.removeItem('permission');
            localStorage.removeItem('name');
            localStorage.removeItem('extension');
            localStorage.removeItem('extension');
            localStorage.removeItem('timestamp_cc');
            localStorage.removeItem('estado');
            location.href='./'
        }
    }
}