export default async function useLogout(e){
    
    e.target.textContent='Cerrando';

    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/public/api/logout/${localStorage.getItem('temp_uS')}`,{
        method:'GET'
    });

    if(request.ok){
        const response=await request.json();
        
        if(response.status===200){
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            localStorage.removeItem('temp_uS');
            localStorage.removeItem('permission');
            localStorage.removeItem('name');
            localStorage.removeItem('extension');
            location.href='./'
        }
    }
}