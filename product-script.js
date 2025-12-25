let allProducts = [];


async function loadAllProducts() {
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    allProducts = data.products;
    console.log("All products loaded:", allProducts.length);
    loadProduct();
  } catch (error) {
    console.error("Error loading products:", error);
    alert("Error loading product data. Please check the console.");
  }
}


function loadProduct() {
  console.log("=== LOADING PRODUCT ===");
  const productData = localStorage.getItem("selectedProduct");
  console.log("Retrieved product data:", productData);

  if (productData) {
    try {
      const product = JSON.parse(productData);
      console.log("Parsed product:", product);
      console.log("Product name:", product.name);
      console.log("Product category:", product.category);
      console.log("Product colors:", product.colors);

      displayProduct(product);
      loadRecommendations(product.category, product.name);
    } catch (error) {
      console.error("Error parsing product data:", error);
      alert("Error loading product data. Check console for details.");
    }
  } else {
    console.log("No product data found in localStorage");
    console.log("localStorage contents:", localStorage);
    alert(
      "No product selected. Please click a product from the products page first."
    );
  }
}

function displayProduct(product) {
  console.log("=== DISPLAYING PRODUCT ===");

  
  const elements = {
    productName: document.getElementById("productName"),
    productCategory: document.getElementById("productCategory"),
    productPrice: document.getElementById("productPrice"),
    productDescription: document.getElementById("productDescription"),
    mainImage: document.getElementById("mainImage"),
    thumbnailImages: document.getElementById("thumbnailImages"),
    sizeSection: document.getElementById("sizeSection"),
    sizeLabel: document.getElementById("sizeLabel"),
    detailsSection: document.getElementById("detailsSection"),
    detailsContent: document.getElementById("detailsContent"),
  };

  
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Missing element: #${key}`);
    } else {
      console.log(`Found element: #${key}`);
    }
  }

  
  if (
    !elements.productName ||
    !elements.productCategory ||
    !elements.productPrice ||
    !elements.mainImage
  ) {
    console.error("Critical elements missing! Check your HTML IDs.");
    alert("Error: Page structure is incorrect. Check console for details.");
    return;
  }

  
  elements.productName.textContent = product.name;
  elements.productCategory.textContent = product.category;
  elements.productPrice.textContent = product.price;

  
  if (elements.productDescription && product.description) {
    elements.productDescription.textContent = product.description;
  }

  
  elements.mainImage.src = product.image;
  elements.mainImage.alt = product.name;

  
  if (elements.thumbnailImages) {
    elements.thumbnailImages.innerHTML = `
            <img src="${product.image}" alt="Thumbnail 1" class="thumbnail active" onclick="changeImage(this)">
        `;
  }

  
  if (
    product.sizes &&
    product.sizes.length > 0 &&
    elements.sizeSection &&
    elements.sizeLabel
  ) {
    elements.sizeSection.style.display = "block";
    elements.sizeLabel.textContent = `Available Sizes: ${product.sizes.join(
      ", "
    )}`;
  }

  
  if (product.details && elements.detailsSection && elements.detailsContent) {
    elements.detailsSection.style.display = "block";
    elements.detailsContent.innerHTML = Object.entries(product.details)
      .map(
        ([label, value]) =>
          `<div class="detail-item"><span class="detail-label">${label}:</span> ${value}</div>`
      )
      .join("");
  }

  
  document.title = `${product.name} - Spree With Dee`;

  console.log("Product display completed successfully");
}

function loadRecommendations(category, currentProductName) {
  console.log("=== LOADING RECOMMENDATIONS ===");
  console.log("Current category:", category);
  console.log("Current product name:", currentProductName);
  console.log("Total products available:", allProducts.length);

  const currentProduct = allProducts.find((p) => p.name === currentProductName);
  if (!currentProduct) {
    console.error("Could not find current product in allProducts array");
    return;
  }

  console.log("Current product found:", currentProduct);

  
  const currentColors = currentProduct.colors;
  console.log("Current product colors:", currentColors);

  
  const scoredProducts = allProducts
    .filter((p) => p.name !== currentProductName) 
    .map((product) => {
      let score = 0;

      
      if (product.category === category) {
        score += 100;
      }

      
      const sharedColors = product.colors.filter((color) =>
        currentColors.includes(color)
      );
      score += sharedColors.length * 20; 

      return { product, score };
    })
    .sort((a, b) => b.score - a.score) 
    .slice(0, 4) 
    .map((item) => item.product);

  console.log("Scored products count:", scoredProducts.length);
  console.log(
    "Recommendation details:",
    scoredProducts.map((p) => ({
      name: p.name,
      category: p.category,
      colors: p.colors,
      sharedColors: p.colors.filter((c) => currentColors.includes(c)).length,
    }))
  );

  const grid = document.getElementById("recommendationsGrid");
  console.log("Recommendations grid element:", grid);

  if (!grid) {
    console.error("Could not find #recommendationsGrid element!");
    return;
  }

  if (scoredProducts.length === 0) {
    console.log("No recommendations found");
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #EA79A5; font-size: 18px;">No recommendations available at this time.</p>';
    return;
  }

  console.log("Generating HTML for recommendations...");
  grid.innerHTML = scoredProducts
    .map(
      (product) => `
        <div class="recommendation-card" onclick="navigateToProduct('${product.name.replace(
          /'/g,
          "\\'"
        )}')">
            <img src="${product.image}" alt="${
        product.name
      }" class="recommendation-image">
            <div class="recommendation-info">
                <h3 class="recommendation-name">${product.name}</h3>
                <p class="recommendation-price">${product.price}</p>
                <div class="recommendation-colors">
                    ${product.colors
                      .map(
                        (color) =>
                          `<div class="recommendation-color-dot" style="background-color: ${color}"></div>`
                      )
                      .join("")}
                </div>
                <button class="view-btn"> View Product</button>
            </div>
        </div>
    `
    )
    .join("");

  console.log("Recommendations HTML generated and inserted");
}

function navigateToProduct(productName) {
  const product = allProducts.find((p) => p.name === productName);
  if (product) {
    console.log("Navigating to product:", product.name);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    window.location.reload();
  }
}

function changeImage(thumbnail) {
  const mainImage = document.getElementById("mainImage");
  mainImage.src = thumbnail.src;

  document
    .querySelectorAll(".thumbnail")
    .forEach((t) => t.classList.remove("active"));
  thumbnail.classList.add("active");
}

function shareProduct() {
  const productName = document.getElementById("productName").textContent;
  if (navigator.share) {
    navigator
      .share({
        title: productName,
        text: `Check out this product: ${productName}`,
        url: window.location.href,
      })
      .catch((err) => console.log("Error sharing:", err));
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Product link copied to clipboard!");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log("Product detail page loaded");
  loadAllProducts();
});

function getCart() {
  return JSON.parse(localStorage.getItem("shoppingCart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function addToCart(product, selectedSize = null, quantity = 1) {
  let cart = getCart();

  const existingItem = cart.find(
    (item) => item.name === product.name && item.size === selectedSize
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity,
    });
  }

  saveCart(cart);
}
function getSelectedSize() {
  const sizeButtons = document.querySelectorAll(".size-option.selected");
  return sizeButtons.length ? sizeButtons[0].textContent : null;
}

function handleAddToCart(button) {
  const productData = localStorage.getItem("selectedProduct");
  if (!productData) return;

  const product = JSON.parse(productData);
  const selectedSize = getSelectedSize(); 
  const quantity = 1;

  addToCart(product, selectedSize, quantity);
  button.textContent = "Added!";

  setTimeout(() => {
    button.textContent = "Add to Cart";
  }, 1000);
}

function animateAddButton(button) {}
