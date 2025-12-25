let products = [];

function getFavorites() {
  const favorites = localStorage.getItem("favoriteProducts");
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
}

function removeFavorite(productName) {
  let favorites = getFavorites();
  favorites = favorites.filter((fav) => fav !== productName);
  saveFavorites(favorites);
  loadFavorites();
}

async function loadFavorites() {
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    products = data.products;

    const favoriteNames = getFavorites();

    const favoriteProducts = products.filter((product) =>
      favoriteNames.includes(product.name)
    );

    displayFavorites(favoriteProducts);
  } catch (error) {
    console.error("Error loading favorites:", error);
    document.getElementById("favoritesGrid").innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #E91E63; font-size: 18px; padding: 40px;">Error loading favorites. Please try again later.</p>';
  }
}

function displayFavorites(favoriteProducts) {
  const favoritesGrid = document.getElementById("favoritesGrid");
  const emptyMessage = document.getElementById("emptyMessage");

  if (favoriteProducts.length === 0) {
    favoritesGrid.style.display = "none";
    emptyMessage.style.display = "block";
    return;
  }

  favoritesGrid.style.display = "grid";
  emptyMessage.style.display = "none";
  favoritesGrid.innerHTML = "";

  favoriteProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "favorite-card product-card";

    card.innerHTML = `
            <button class="remove-favorite-btn" data-product="${product.name}">
                <svg viewBox="0 0 24 24" fill="#C80253" stroke="#C80253" stroke-width="1.5" width="24" height="24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            </button>
            <img src="${product.image}" alt="${
      product.name
    }" class="product-image">
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-price">${product.price}</span>
                </div>
                <div class="product-details">
                    <div class="product-colors">
                        ${product.colors
                          .map(
                            (c) =>
                              `<div class="product-color-dot" style="background-color: ${c}"></div>`
                          )
                          .join("")}
                    </div>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;

    const removeBtn = card.querySelector(".remove-favorite-btn");
    removeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      removeFavorite(product.name);
    });

    card.addEventListener("click", function (e) {
      if (
        e.target.closest(".remove-favorite-btn") ||
        e.target.closest(".add-to-cart-btn")
      ) {
        return;
      }

      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "product-detail.html";
    });

    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Add to cart clicked for:", product.name);
      alert("Added to cart: " + product.name);
    });

    favoritesGrid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
});
