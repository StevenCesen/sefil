export default function useSessions(){
    if(localStorage.getItem('token') && localStorage.getItem('token')!==null){
        return true;
    }else{
        return false;
    }
}