export default async function useLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('temp_uS');
    localStorage.removeItem('permission');
    localStorage.removeItem('name');
    location.href='./'
}