export default function useNav(btn,storage){
    const navSlide=btn.target.parentElement.parentElement;
    const content=navSlide.parentElement;
    let options=document.getElementsByClassName('NavSlide__option');
    options=[].slice.call(options);

    // Toggle mobile menu (active class)
    navSlide.classList.toggle('active');

    // Toggle desktop menu (CloseNav class)
    options.map((option)=>{
        option.children[0].classList.toggle('setMargin');
        option.children[1].classList.toggle('NavSlide__optionActive');
    });
    content.classList.toggle('CloseNav');
}