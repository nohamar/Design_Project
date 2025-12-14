
        let currentSlide = 0;
        const totalSlides = 2; // Now showing 3 at a time from 6 total = 2 slides

        function moveCarousel(direction) {
            currentSlide += direction;
            
            if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
            } else if (currentSlide >= totalSlides) {
                currentSlide = 0;
            }
            
            updateCarousel();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateCarousel();
        }

        function updateCarousel() {
            const carousel = document.querySelector('.category-carousel');
            const slideWidth = 100; // Each slide shows 3 cards (100% width)
            carousel.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
            
            // Update dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        document.querySelectorAll('.size_circle').forEach(button => {
    button.addEventListener('click', function (event) {
        event.preventDefault();

        button.classList.toggle('selected');
    });
});


let get_btn = document.getElementById('button_Mystery'); 
let box_btn = document.getElementById('box_button'); 
let box_X = document.getElementById('box_X'); 
let box = document.getElementById('box_section'); 
let overlay = document.getElementById('overlayBg');
get_btn.addEventListener('click', function(){

box.classList.add('show'); 
 overlay.style.display = 'block';
    
})

box_btn.addEventListener('click', function(){
box.classList.remove('show'); 
overlay.style.display = 'none';
})

box_X.addEventListener('click', function(){
box.classList.remove('show'); 
overlay.style.display = 'none';
})

window.onload = function() {
    
    if (!sessionStorage.getItem('seenPopup')) {
        document.getElementById('news_overlay').style.display = 'block'; 
        document.getElementById('newsletter_section').classList.add('show1');
        
        sessionStorage.setItem('seenPopup', 'true');
    }
}

document.getElementById('X_news').addEventListener('click', function(){

   document.getElementById('news_overlay').style.display = 'none'; 
    document.getElementById('newsletter_section').classList.remove('show1');

})
    

let login_icon = document.getElementById('login_icon'); 

login_icon.addEventListener('click', function(){

document.getElementById('login_overlay').style.display = 'block'; 
document.getElementById('login_section').classList.add('show2'); 

})

document.getElementById('X_login').addEventListener('click', function(){

  document.getElementById('login_overlay').style.display = 'none'; 
document.getElementById('login_section').classList.remove('show2'); 

})


document.getElementById('signup_transition').addEventListener('click', function(e){
e.preventDefault();
document.getElementById('login_overlay').style.display = 'none'; 
document.getElementById('login_section').classList.remove('show2'); 
document.getElementById('signup_overlay').style.display = 'block'; 
document.getElementById('signup_section').classList.add('show3'); 

})

document.getElementById('X_signup').addEventListener('click', function(){

  document.getElementById('signup_overlay').style.display = 'none'; 
document.getElementById('signup_section').classList.remove('show3'); 

})

document.getElementById('login_transition').addEventListener('click', function(e){
    e.preventDefault();
document.getElementById('signup_overlay').style.display = 'none'; 
document.getElementById('signup_section').classList.remove('show3'); 
document.getElementById('login_overlay').style.display = 'block'; 
document.getElementById('login_section').classList.add('show2'); 
})