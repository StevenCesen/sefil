
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
        tag.current.textContent='No autorizado, IP restringida';
        btn.current.textContent='Ingresar';
        setload(false);
    }else{
        tag.current.textContent='Usuario inválido, revisa las credenciales';
        btn.current.textContent='Ingresar';
        setload(false);
    }

}