export default function useMenu(button,container,clase,menu){
    container.current.classList.toggle(clase);

    if(menu!==null){
        if(!!menu.current.parentElement.matches('.CloseNav')){
            menu.current.parentElement.classList.remove('CloseNav');
            let options=document.getElementsByClassName('NavSlide__option');
            options=[].slice.call(options);
    
            options.map((option)=>{
                option.children[0].classList.toggle('setMargin');
                option.children[1].classList.toggle('NavSlide__optionActive');
            });
        }
    }
}