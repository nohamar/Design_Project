let shirts = [
  'images/shirt1.png',
  'images/shirt2.png',
  'images/shirt3.png',
  'images/shirt4.png',
  'images/shirt5.png'
];

let currentIndexShirt = 0;

let shirtleft = document.getElementById('shirt_left');
let shirt_right = document.getElementById('shirt_right');
let shirt_selected = document.getElementById('selected_shirt');
let left_arrow_shirt = document.getElementById('left_arrow_shirt');
let right_arrow_shirt = document.getElementById('right_arrow_shirt');

function updateShirts() {
  shirtleft.src = shirts[(currentIndexShirt + 1) % shirts.length];
  shirt_selected.src = shirts[(currentIndexShirt + 2) % shirts.length];
  shirt_right.src = shirts[(currentIndexShirt + 3) % shirts.length];
}

left_arrow_shirt.addEventListener('click', function () {
  currentIndexShirt = (currentIndexShirt + 1) % shirts.length;
  updateShirts();
});

right_arrow_shirt.addEventListener('click', function () {
  currentIndexShirt =
    (currentIndexShirt - 1 + shirts.length) % shirts.length;
  updateShirts();
});


let pants = [
  'images/pants1.png',
  'images/pants2.png',
  'images/pants3.png',
  'images/pants4.png'
];

let currentIndexPant = 0;

let pantleft = document.getElementById('pant_left');
let pant_right = document.getElementById('pant_right');
let pant_selected = document.getElementById('selected_pants');
let left_arrow_pants = document.getElementById('left_arrow_pants');
let right_arrow_pants = document.getElementById('right_arrow_pants');

function updatePants() {
  pantleft.src = pants[(currentIndexPant + 1) % pants.length];
  pant_selected.src = pants[(currentIndexPant + 2) % pants.length];
  pant_right.src = pants[(currentIndexPant + 3) % pants.length];
}

left_arrow_pants.addEventListener('click', function () {
  currentIndexPant = (currentIndexPant + 1) % pants.length;
  updatePants();
});

right_arrow_pants.addEventListener('click', function () {
  currentIndexPant =
    (currentIndexPant - 1 + pants.length) % pants.length;
  updatePants();
});


let shoes = [
  'images/shoes1.png',
  'images/shoes2.png',
  'images/shoes3.png',
  'images/shoes4.png'
];

let currentIndexShoe = 0;

let shoeleft = document.getElementById('shoe_left');
let shoe_right = document.getElementById('shoe_right');
let shoe_selected = document.getElementById('selected_shoes');
let left_arrow_shoes = document.getElementById('left_arrow_shoes');
let right_arrow_shoes = document.getElementById('right_arrow_shoes');

function updateShoes() {
  shoeleft.src = shoes[(currentIndexShoe + 1) % shoes.length];
  shoe_selected.src = shoes[(currentIndexShoe + 2) % shoes.length];
  shoe_right.src = shoes[(currentIndexShoe + 3) % shoes.length];
}

left_arrow_shoes.addEventListener('click', function () {
  currentIndexShoe = (currentIndexShoe + 1) % shoes.length;
  updateShoes();
});

right_arrow_shoes.addEventListener('click', function () {
  currentIndexShoe =
    (currentIndexShoe - 1 + shoes.length) % shoes.length;
  updateShoes();
});