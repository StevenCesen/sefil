export default function useDropDown(button,container){
    button.addEventListener('click',()=>{
        container.classList.toggle('.active__container');
    });
}