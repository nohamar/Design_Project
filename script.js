let currentIndex = 0;
let styleCategories = [];
const cardsPerView = 3;

async function loadCategories() {
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    styleCategories = data.styleCategories;

    renderCategories();
    renderDots();
    updateCarousel();
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

function renderCategories() {
  const carousel = document.getElementById("categoryCarousel");
  carousel.innerHTML = "";

  styleCategories.forEach((category) => {
    const card = document.createElement("div");
    card.className = "category-card";
card.addEventListener("click", (e) => {
  console.log("Category clicked:", category.name);
  window.location.href = `products.html?style=${encodeURIComponent(category.name)}`;
});
    let arrowDecor = "";

    if (category.decoration) {
      if (category.decoration.arrow.includes("arrow top")) {
        arrowDecor = `
                    <div class="top-arrow-decoration" 
                         >
                        <img src="${category.decoration.arrow}" 
                             alt="arrow" 
                             class="top-decorative-arrow"
                             >
                        <span class="arrow-text" style="font-size: 24px;">${category.decoration.text}</span>
                    </div>
                `;
      } else if (category.decoration.arrow.includes("arrow-curve")) {
        arrowDecor = `
                    <div class="arrow-decoration arrow-curve-style" 
                        >
                        <img src="${category.decoration.arrow}" 
                             alt="arrow" 
                             class="decorative-arrow"
                             >
                        <span class="arrow-text" style="font-size: 28px;">${category.decoration.text}</span>
                    </div>
                `;
      }
    }

    card.innerHTML = `
            ${arrowDecor}
            <div class="category-circle">
                <img src="${category.image}" alt="${category.name}">
                <div class="hover-circle">
                <h2 style="color: ${category.color};">${category.name}</h2>
                </div>
            </div>
            <h3 style="color: ${category.color};">${category.name}</h3>
            <p>${category.description}</p>
        `;

    carousel.appendChild(card);
  });
}

function renderDots() {
  const dotsContainer = document.getElementById("carouselDots");
  dotsContainer.innerHTML = "";

  const totalDots = styleCategories.length - cardsPerView + 1;

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (i === 0) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentIndex = i;
      updateCarousel();
    });

    dotsContainer.appendChild(dot);
  }
}

function updateCarousel() {
  const carousel = document.getElementById("categoryCarousel");
  const cards = document.querySelectorAll(".category-card");

  if (!cards.length) return;

  const cardWidth = cards[0].offsetWidth;
  const offset = -currentIndex * cardWidth;
  carousel.style.transform = `translateX(${offset}px)`;

 
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });

  
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  const maxIndex = styleCategories.length - cardsPerView;

  if (leftArrow && rightArrow) {
    leftArrow.disabled = currentIndex === 0;
    rightArrow.disabled = currentIndex >= maxIndex;

    leftArrow.style.opacity = currentIndex === 0 ? "0.3" : "1";
    rightArrow.style.opacity = currentIndex >= maxIndex ? "0.3" : "1";
  }
}

function moveLeft() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

function moveRight() {
  const maxIndex = styleCategories.length - cardsPerView;
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateCarousel();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCategories();

  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (leftArrow) leftArrow.addEventListener("click", moveLeft);
  if (rightArrow) rightArrow.addEventListener("click", moveRight);

  window.addEventListener("resize", updateCarousel);
});
let get_btn = document.getElementById("button_Mystery");
let box_btn = document.getElementById("box_button");
let box_X = document.getElementById("box_X");
let box = document.getElementById("box_section");
let overlay = document.getElementById("overlayBg");
get_btn.addEventListener("click", function () {
  box.classList.add("show");
  overlay.style.display = "block";
});

box_btn.addEventListener("click", function () {
  box.classList.remove("show");
  overlay.style.display = "none";
});

box_X.addEventListener("click", function () {
  box.classList.remove("show");
  overlay.style.display = "none";
});

window.onload = function () {
  if (!sessionStorage.getItem("seenPopup")) {
    document.getElementById("news_overlay").style.display = "block";
    document.getElementById("newsletter_section").classList.add("show1");

    sessionStorage.setItem("seenPopup", "true");
  }
};

document.getElementById("X_news").addEventListener("click", function () {
  document.getElementById("news_overlay").style.display = "none";
  document.getElementById("newsletter_section").classList.remove("show1");
});

let login_icon = document.getElementById("login_icon");

login_icon.addEventListener("click", function () {
  document.getElementById("login_overlay").style.display = "block";
  document.getElementById("login_section").classList.add("show2");
});

document.getElementById("X_login").addEventListener("click", function () {
  document.getElementById("login_overlay").style.display = "none";
  document.getElementById("login_section").classList.remove("show2");
});

document
  .getElementById("signup_transition")
  .addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("login_overlay").style.display = "none";
    document.getElementById("login_section").classList.remove("show2");
    document.getElementById("signup_overlay").style.display = "block";
    document.getElementById("signup_section").classList.add("show3");
  });

document.getElementById("X_signup").addEventListener("click", function () {
  document.getElementById("signup_overlay").style.display = "none";
  document.getElementById("signup_section").classList.remove("show3");
});

document
  .getElementById("login_transition")
  .addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("signup_overlay").style.display = "none";
    document.getElementById("signup_section").classList.remove("show3");
    document.getElementById("login_overlay").style.display = "block";
    document.getElementById("login_section").classList.add("show2");
  });

document.querySelectorAll(".size_circle").forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    button.classList.toggle("selected");
  });
});

const readMoreBtn = document.querySelector('.read-more');
if (readMoreBtn) {
  readMoreBtn.addEventListener('click', function() {
    window.location.href = 'aboutUs.html';
  });
}