let categories = [];
let colors = [];
let shoeSizes = [];
let clothingSizes = [];
let products = [];
let styleCategories = [];

let currentPage = 1;
const productsPerPage = 9;

let activeFilters = {
  categories: [],
  colors: [],
  shoeSizes: [],
  clothingSizes: [],
  style: null, 
};

function getFavorites() {
  const favorites = localStorage.getItem("favoriteProducts");
  return favorites ? JSON.parse(favorites) : [];
}

function saveFavorites(favorites) {
  localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
}

function toggleFavorite(productName) {
  let favorites = getFavorites();
  const index = favorites.indexOf(productName);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(productName);
  }

  saveFavorites(favorites);
}

function isFavorite(productName) {
  const favorites = getFavorites();
  return favorites.includes(productName);
}

function getCart() {
  const cart = localStorage.getItem("shoppingCart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();

  const existingItemIndex = cart.findIndex(
    (item) => item.name === product.name
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      image: product.image,
      colors: product.colors,
      quantity: 1,
      size: product.sizes.length > 0 ? product.sizes[0] : null,
    });
  }

  saveCart(cart);
}

function getStyleFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("style");
}

function getProductCategoriesForStyle(styleName) {
  return null;
}

async function loadData() {
  try {
    const response = await fetch("products.json");
    const data = await response.json();

    categories = data.categories;
    colors = data.colors;
    shoeSizes = data.shoeSizes;
    clothingSizes = data.clothingSizes;
    products = data.products;
    styleCategories = data.styleCategories;

    console.log("Products loaded:", products.length);

    const styleFilter = getStyleFromURL();
    if (styleFilter) {
      activeFilters.style = styleFilter;
      console.log("Filtering by style:", styleFilter);
    }

    initializeFilters();
    displayProductsWithPagination(getFilteredProducts());
    updateProductCount(getFilteredProducts().length);
  } catch (error) {
    console.error("Error loading product data:", error);
    document.getElementById("productsGrid").innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #E91E63; font-size: 18px; padding: 40px;">Error loading products. Please try again later.</p>';
  }
}

function initializeFilters() {
  const categoryList = document.getElementById("categoryList");
  categories.forEach((cat) => {
    const item = document.createElement("div");
    item.className = "category-item";
    item.innerHTML = `
            <div class="category-checkbox"></div>
            <span class="category-label">${cat}</span>
        `;
    item.addEventListener("click", () => {
      const checkbox = item.querySelector(".category-checkbox");
      checkbox.classList.toggle("checked");

      if (checkbox.classList.contains("checked")) {
        activeFilters.categories.push(cat);
      } else {
        activeFilters.categories = activeFilters.categories.filter(
          (c) => c !== cat
        );
      }
      updateSizeAvailability();
      filterProducts();
    });
    categoryList.appendChild(item);
  });

  const colorGrid = document.getElementById("colorGrid");
  colors.forEach((color) => {
    const item = document.createElement("div");
    item.className = "color-item";
    item.innerHTML = `
            <div class="color-circle" style="background-color: ${color.hex}; ${
      color.hex === "#FFFFFF" ? "border: 2px solid #ddd;" : ""
    }"></div>
            <span class="color-name">${color.name}</span>
        `;
    item.addEventListener("click", () => {
      const circle = item.querySelector(".color-circle");
      circle.classList.toggle("selected");

      if (circle.classList.contains("selected")) {
        activeFilters.colors.push(color.hex);
      } else {
        activeFilters.colors = activeFilters.colors.filter(
          (c) => c !== color.hex
        );
      }
      filterProducts();
    });
    colorGrid.appendChild(item);
  });

  const shoeSizeGrid = document.getElementById("shoeSizeGrid");
  shoeSizes.forEach((size) => {
    const item = document.createElement("div");
    item.className = "size-item";
    item.textContent = size;
    item.addEventListener("click", () => {
      if (item.classList.contains("disabled")) return;

      item.classList.toggle("selected");

      if (item.classList.contains("selected")) {
        activeFilters.shoeSizes.push(size);
      } else {
        activeFilters.shoeSizes = activeFilters.shoeSizes.filter(
          (s) => s !== size
        );
      }
      filterProducts();
    });
    shoeSizeGrid.appendChild(item);
  });

  const clothingSizeGrid = document.getElementById("clothingSizeGrid");
  clothingSizes.forEach((size) => {
    const item = document.createElement("div");
    item.className = "size-item";
    item.textContent = size;
    item.addEventListener("click", () => {
      if (item.classList.contains("disabled")) return;

      item.classList.toggle("selected");

      if (item.classList.contains("selected")) {
        activeFilters.clothingSizes.push(size);
      } else {
        activeFilters.clothingSizes = activeFilters.clothingSizes.filter(
          (s) => s !== size
        );
      }
      filterProducts();
    });
    clothingSizeGrid.appendChild(item);
  });

  updateSizeAvailability();
}

function getFilteredProducts() {
  return products.filter((product) => {
    if (activeFilters.style) {
    }

    if (
      activeFilters.categories.length > 0 &&
      !activeFilters.categories.includes(product.category)
    ) {
      return false;
    }

    if (activeFilters.colors.length > 0) {
      const hasMatchingColor = product.colors.some((color) =>
        activeFilters.colors.includes(color)
      );
      if (!hasMatchingColor) return false;
    }

    const allSizeFilters = [
      ...activeFilters.shoeSizes,
      ...activeFilters.clothingSizes,
    ];
    if (allSizeFilters.length > 0) {
      const hasMatchingSize = product.sizes.some((size) =>
        allSizeFilters.includes(size)
      );
      if (!hasMatchingSize) return false;
    }
    if (activeFilters.style && product.style !== activeFilters.style) {
      return false;
    }

    return true;
  });
}

function filterProducts() {
  const filteredProducts = getFilteredProducts();

  currentPage = 1;

  displayProductsWithPagination(filteredProducts);
  updateProductCount(filteredProducts.length);
  updateActiveFilterDisplay();
}

function displayProductsWithPagination(productsToDisplay) {
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = productsToDisplay.slice(startIndex, endIndex);

  displayProducts(paginatedProducts);
  updatePagination(productsToDisplay.length);
}

function displayProducts(productsToDisplay) {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  console.log("Displaying products:", productsToDisplay.length);

  productsToDisplay.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.cursor = "pointer";

    const isProductFavorite = isFavorite(product.name);

    card.innerHTML = `
            <button class="favorite-btn ${isProductFavorite ? "active" : ""}">
                <svg viewBox="0 0 24 24" fill="${
                  isProductFavorite ? "white" : "none"
                }" stroke="white" stroke-width="1.5" width="24" height="24">
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

    card.addEventListener("click", function (e) {
      if (
        e.target.closest(".favorite-btn") ||
        e.target.closest(".add-to-cart-btn")
      ) {
        return;
      }

      console.log("Card clicked, navigating to product:", product.name);

      try {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        console.log("Product saved to localStorage");
        window.location.href = "product-detail.html";
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("Error loading product. Please try again.");
      }
    });

    const favBtn = card.querySelector(".favorite-btn");
    const heartSvg = favBtn.querySelector("svg");
    favBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Favorite button clicked");

      toggleFavorite(product.name);

      favBtn.classList.toggle("active");
      if (favBtn.classList.contains("active")) {
        heartSvg.setAttribute("fill", "white");
        heartSvg.setAttribute("stroke", "white");
      } else {
        heartSvg.setAttribute("fill", "none");
        heartSvg.setAttribute("stroke", "white");
      }
    });

    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      console.log("Add to cart clicked for:", product.name);

      addToCart(product);

      addToCartBtn.textContent = "Added!";
      addToCartBtn.style.background = "#C80253";

      setTimeout(() => {
        addToCartBtn.textContent = "Add to Cart";
        addToCartBtn.style.background = "#00CED1";
      }, 1000);
    });

    productsGrid.appendChild(card);
  });

  if (productsToDisplay.length === 0) {
    productsGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #E91E63; font-size: 18px; padding: 40px;">No products match your filters. Try adjusting your selection.</p>';
  }
}

function updatePagination(totalProducts) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginationContainer = document.getElementById("pagination");

  if (!paginationContainer) {
    console.error("Pagination container not found");
    return;
  }

  if (totalPages <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let paginationHTML = '<div class="pagination-wrapper">';

  paginationHTML += `
        <button class="pagination-arrow ${currentPage === 1 ? "disabled" : ""}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? "disabled" : ""}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

  paginationHTML += '<div class="pagination-numbers">';

  paginationHTML += `
        <button class="pagination-number ${currentPage === 1 ? "active" : ""}" 
                onclick="changePage(1)">
            1
        </button>
    `;

  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (startPage > 2) {
    paginationHTML += `
            <button class="pagination-dots" disabled>
                •••
            </button>
        `;
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
            <button class="pagination-number ${
              currentPage === i ? "active" : ""
            }" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
  }

  if (endPage < totalPages - 1) {
    paginationHTML += `
            <button class="pagination-dots" disabled>
                •••
            </button>
        `;
  }

  if (totalPages > 1) {
    paginationHTML += `
            <button class="pagination-number ${
              currentPage === totalPages ? "active" : ""
            }" 
                    onclick="changePage(${totalPages})">
                ${totalPages}
            </button>
        `;
  }

  paginationHTML += "</div>";

  paginationHTML += `
        <button class="pagination-arrow ${
          currentPage === totalPages ? "disabled" : ""
        }" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? "disabled" : ""}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

  paginationHTML += "</div>";

  paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
  const filteredProducts = getFilteredProducts();

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (page < 1 || page > totalPages) return;

  currentPage = page;

  displayProductsWithPagination(filteredProducts);

  const productsGrid = document.querySelector(".products-grid");
  if (productsGrid) {
    productsGrid.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateProductCount(count) {
  const productCountEl = document.querySelector(".product-count");
  productCountEl.textContent = `${count} Products`;
}

function updateActiveFilterDisplay() {
  const activeFilterEl = document.getElementById("activeFilter");
  activeFilterEl.innerHTML = "";

  const filterTags = [];

  if (activeFilters.style) {
    filterTags.push({
      type: "style",
      value: activeFilters.style,
      display: `Style: ${activeFilters.style}`,
    });
  }

  activeFilters.categories.forEach((cat) => {
    filterTags.push({ type: "category", value: cat, display: cat });
  });

  activeFilters.colors.forEach((hex) => {
    const colorName = colors.find((c) => c.hex === hex)?.name || hex;
    filterTags.push({ type: "color", value: hex, display: colorName });
  });

  activeFilters.shoeSizes.forEach((size) => {
    filterTags.push({ type: "shoeSize", value: size, display: `Size ${size}` });
  });

  activeFilters.clothingSizes.forEach((size) => {
    filterTags.push({
      type: "clothingSize",
      value: size,
      display: `Size ${size}`,
    });
  });

  if (filterTags.length > 0) {
    filterTags.forEach((tag) => {
      const tagEl = document.createElement("span");
      tagEl.className = "filter-tag";
      tagEl.innerHTML = `
                <span class="activefilter-label">${tag.display}</span>
                <button class="remove-filter" data-type="${tag.type}" data-value="${tag.value}">×</button>
            `;

      const removeBtn = tagEl.querySelector(".remove-filter");
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFilter(tag.type, tag.value);
      });

      activeFilterEl.appendChild(tagEl);
    });
  } else {
    activeFilterEl.textContent = "All Products";
  }
}

function removeFilter(type, value) {
  switch (type) {
    case "style":
      activeFilters.style = null;
      window.history.replaceState({}, "", "products.html");
      break;
    case "category":
      activeFilters.categories = activeFilters.categories.filter(
        (c) => c !== value
      );
      const categoryItems = document.querySelectorAll(".category-item");
      categoryItems.forEach((item) => {
        if (item.querySelector(".category-label").textContent === value) {
          item.querySelector(".category-checkbox").classList.remove("checked");
        }
      });
      break;
    case "color":
      activeFilters.colors = activeFilters.colors.filter((c) => c !== value);
      const colorItems = document.querySelectorAll(".color-item");
      colorItems.forEach((item) => {
        const circle = item.querySelector(".color-circle");
        if (
          circle.style.backgroundColor === value.toLowerCase() ||
          rgbToHex(circle.style.backgroundColor) === value
        ) {
          circle.classList.remove("selected");
        }
      });
      break;
    case "shoeSize":
      activeFilters.shoeSizes = activeFilters.shoeSizes.filter(
        (s) => s !== value
      );
      const shoeSizeItems = document.querySelectorAll(
        "#shoeSizeGrid .size-item"
      );
      shoeSizeItems.forEach((item) => {
        if (item.textContent === value) {
          item.classList.remove("selected");
        }
      });
      break;
    case "clothingSize":
      activeFilters.clothingSizes = activeFilters.clothingSizes.filter(
        (s) => s !== value
      );
      const clothingSizeItems = document.querySelectorAll(
        "#clothingSizeGrid .size-item"
      );
      clothingSizeItems.forEach((item) => {
        if (item.textContent === value) {
          item.classList.remove("selected");
        }
      });
      break;
  }

  updateSizeAvailability();
  filterProducts();
}

function updateSizeAvailability() {
  const shoeSizeItems = document.querySelectorAll("#shoeSizeGrid .size-item");
  const clothingSizeItems = document.querySelectorAll(
    "#clothingSizeGrid .size-item"
  );

  const hasShoes = activeFilters.categories.includes("Shoes");
  const hasClothing = activeFilters.categories.includes("Clothing");
  const hasAccessories = activeFilters.categories.includes("Accessories");
  const hasBags = activeFilters.categories.includes("Bags");
  const hasJewelry = activeFilters.categories.includes("Jewelry");

  const nonSizedCategories = [hasAccessories, hasBags, hasJewelry].filter(
    Boolean
  ).length;
  const hasOnlyNonSizedCategories =
    nonSizedCategories > 0 && !hasShoes && !hasClothing;

  const shouldDisableShoes =
    (hasClothing && !hasShoes && activeFilters.categories.length === 1) ||
    (hasOnlyNonSizedCategories && !hasShoes);

  const shouldDisableClothing =
    (hasShoes && !hasClothing && activeFilters.categories.length === 1) ||
    (hasOnlyNonSizedCategories && !hasClothing);

  if (shouldDisableShoes && activeFilters.shoeSizes.length > 0) {
    activeFilters.shoeSizes = [];
    shoeSizeItems.forEach((item) => {
      item.classList.remove("selected");
    });
  }

  if (shouldDisableClothing && activeFilters.clothingSizes.length > 0) {
    activeFilters.clothingSizes = [];
    clothingSizeItems.forEach((item) => {
      item.classList.remove("selected");
    });
  }

  shoeSizeItems.forEach((item) => {
    if (shouldDisableShoes) {
      item.classList.add("disabled");
    } else {
      item.classList.remove("disabled");
    }
  });

  clothingSizeItems.forEach((item) => {
    if (shouldDisableClothing) {
      item.classList.add("disabled");
    } else {
      item.classList.remove("disabled");
    }
  });
}

function rgbToHex(rgb) {
  if (rgb.startsWith("#")) return rgb;
  const result = rgb.match(/\d+/g);
  if (!result) return rgb;
  return (
    "#" +
    result
      .map((x) => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
      .toUpperCase()
  );
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded, loading data...");
  loadData();
});
