
export default async function useLogin(data,tag,btn,setload){

    const request= await fetch(`${import.meta.env.VITE_URL_BASE}/login`,{
        method:'POST',
        body:data 
    });

    if(request.status!==401){
        const response=await request.json();

        if(!response.token){
            tag.current.textContent='Usuario inválido, revisa las credenciales';
            btn.current.textContent='Ingresar';
            setload(false);
        }else{

            localStorage.setItem('token',response.token);
            localStorage.setItem('permission',response.permission);
            localStorage.setItem('name',response.name);
            localStorage.setItem('rol',response.rol);
            localStorage.setItem('temp_uS',response.id);
            localStorage.setItem('extension',response.extension);
            localStorage.setItem('phone_number',response.phone_number);
            localStorage.setItem('timestamp_cc',new Date().getTime());
            localStorage.setItem('estado','CONECTADO');
            
            if(response.changePassword){
                localStorage.setItem('change_ps',true);
                location.href='#/dashboard/me';
                location.reload();
            }else{
                localStorage.setItem('change_ps',false);
                location.href='./';
            }
        }
    }else{
        tag.current.textContent='Usuario inválido, revisa las credenciales';
        btn.current.textContent='Ingresar';
        setload(false);
    }

}