
export default async function useLogin(data,tag,btn){
    const request= await fetch('https://sefil.softsen.space/public/api/login',{
        method:'POST',
        body:data 
    });

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
        location.href='./'
    }

}