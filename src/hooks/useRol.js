export default function useRol(){
    const rol=localStorage.getItem('rol');
    return rol;
}