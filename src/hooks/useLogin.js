
export default async function useLogin(data,tag,btn,setload){

    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/login`,{
        method:'POST',
        body:data 
    });

    if(request.status!==401 & request.status!==403){
        const response=await request.json();

        if(!response.result.token){
            tag.current.textContent='Usuario inválido, revisa las credenciales';
            btn.current.textContent='Ingresar';
            setload(false);
        }else{

            localStorage.setItem('token', response.result.token);
            localStorage.setItem('name', response.result.user.username);
            localStorage.setItem('role', response.result.user.role);
            localStorage.setItem('temp_uS', response.result.user.id);
            localStorage.setItem('extension', response.result.user.extension);
            localStorage.setItem('phone_number', response.result.user.phone);
            localStorage.setItem('timestamp_cc', new Date().getTime());
            localStorage.setItem('estado', 'CONECTADO');

            // Guardar permisos personalizados si existen
            if (response.result.user.permission && response.result.user.permission !== '[]') {
                // Asegurar que se guarde como string JSON
                const permissionString = typeof response.result.user.permission === 'string'
                    ? response.result.user.permission
                    : JSON.stringify(response.result.user.permission);

                localStorage.setItem('user_permissions', permissionString);
            } else {
                localStorage.removeItem('user_permissions');
            }

            if(response.changePassword){
                localStorage.setItem('change_ps', true);
                location.href='#/dashboard/me';
                location.reload();
            }else{
                localStorage.setItem('change_ps', false);
                location.href='./';
            }
        }
    }else if(request.status===403){
        tag.current.textContent='Acceso denegado fuera del horario permitido';
        btn.current.textContent='Ingresar';
        setload(false);
    }else{
        tag.current.textContent=request.message || 'Error en el servidor, intente más tarde.';
        btn.current.textContent='Ingresar';
        setload(false);
    }

}