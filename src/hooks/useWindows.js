export default function useWindows(){
    BeforeUnloadEvent.returnValue = "Seguro que quieres salir?";
}