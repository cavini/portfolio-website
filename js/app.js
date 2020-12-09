const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-items');
const navLinks = document.querySelectorAll('.navbar-menu li');


const navSlide = () => {

    if (nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active')
    }












    burger.addEventListener('click', () => {

        nav.classList.toggle('nav-active');
        document.body.classList.toggle('freeze');










        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        burger.classList.toggle('toggle');
    });


}

navSlide();




const navAs = document.querySelector('.navbar-menu');

navAs.addEventListener('click', (e) => {

    if (e.target.id === "navlis") {
        if (document.body.classList.contains('freeze')) {
            document.body.classList.remove('freeze')
        }

        if (nav.classList.contains('nav-active')) {
            nav.classList.remove('nav-active')
            burger.classList.remove('toggle')
        }

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            }
        });
    } else {
        e.preventDefault();
    }

});




