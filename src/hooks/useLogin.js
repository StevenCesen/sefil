
export default async function useLogin(data,tag,btn){
    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/public/api/login`,{
        method:'POST',
        body:data 
    });

    if(request.status!==401){
        const response=await request.json();

        if(!response.token){
            tag.current.textContent='Usuario inválido, revisa las credenciales';
            btn.current.textContent='Ingresar';
        }else{
            localStorage.setItem('token',response.token);
            localStorage.setItem('permission',response.permission);
            localStorage.setItem('name',response.name);
            localStorage.setItem('rol',response.rol);
            localStorage.setItem('temp_uS',response.id);
            localStorage.setItem('extension',response.extension);
            location.href='./'
        }
        
    }else{
        tag.current.textContent='Usuario inválido, revisa las credenciales';
        btn.current.textContent='Ingresar';
    }

}