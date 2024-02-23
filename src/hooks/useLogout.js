export default async function useLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    location.href='./'
}