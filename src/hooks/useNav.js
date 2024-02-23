export default function useNav(btn,storage){
    const content=btn.target.parentElement.parentElement.parentElement;
    let options=document.getElementsByClassName('NavSlide__option');
    options=[].slice.call(options);

    options.map((option)=>{
        option.children[0].classList.toggle('setMargin');
        option.children[1].classList.toggle('NavSlide__optionActive');
    });
    content.classList.toggle('CloseNav');
}