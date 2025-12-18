const API_URL = "https://fakestoreapi.com/products";

const productContainer = document.getElementById("product-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartCountEl = document.getElementById("cartCount");
const cartTotalEl = document.getElementById("cartTotal");
const overlay = document.getElementById("overlay");

// Modal elements
const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalAddToCart = document.getElementById("modalAddToCart");

// Data store
let allProducts = [];
let filteredProducts = [];

// LocalStorage keys
const CART_KEY = "apiShopCart";
const WISHLIST_KEY = "apiShopWishlist";

// Cart & Wishlist
let cart = [];
let wishlist = []; // store product ids
let currentModalProduct = null;

/* STORAGE HELPERS */
function loadCartFromStorage() {
  const stored = localStorage.getItem(CART_KEY);
  if (stored) {
    try {
      cart = JSON.parse(stored);
    } catch (e) {
      console.error("Cart parse error:", e);
      cart = [];
    }
  } else {
    cart = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function loadWishlistFromStorage() {
  const stored = localStorage.getItem(WISHLIST_KEY);
  if (stored) {
    try {
      wishlist = JSON.parse(stored);
    } catch (e) {
      console.error("Wishlist parse error:", e);
      wishlist = [];
    }
  } else {
    wishlist = [];
  }
}

function saveWishlistToStorage() {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

/* FETCH PRODUCTS */
fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    filteredProducts = data;

    populateCategories(data);
    renderProducts(data);
  })
  .catch((err) => {
    console.error("API Error:", err);
    productContainer.innerHTML = "<p>Failed to load products.</p>";
  });

/* CATEGORY FILTER */
function populateCategories(products) {
  const categories = new Set();
  products.forEach((p) => categories.add(p.category));

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(opt);
  });
}

/* RENDER PRODUCTS */
function renderProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    const inRupees = (product.price * 85).toFixed(0);
    const isWishlisted = wishlist.includes(product.id);

    card.innerHTML = `
      <button class="wishlist-btn ${isWishlisted ? "active" : ""}">♥</button>
      <img src="${product.image}" alt="${product.title}">
      <h3 class="card-title">${product.title.slice(0, 40)}${product.title.length > 40 ? "..." : ""
      }</h3>
      <p class="card-category">${product.category}</p>
      <p class="card-desc">${product.description.slice(0, 70)}...</p>
      <div class="card-bottom">
        <span class="price">₹${inRupees}</span>
        <button class="btn-primary add-cart-btn">Add</button>
      </div>
    `;

    // Wishlist button
    const wishlistBtn = card.querySelector(".wishlist-btn");
    wishlistBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(product.id);
      wishlistBtn.classList.toggle("active");
    });

    // Open modal
    card
      .querySelector("img")
      .addEventListener("click", () => openProductModal(product));
    card
      .querySelector(".card-title")
      .addEventListener("click", () => openProductModal(product));
    card
      .querySelector(".card-desc")
      .addEventListener("click", () => openProductModal(product));

    // Add to cart button
    card
      .querySelector(".add-cart-btn")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(product);
      });

    productContainer.appendChild(card);
  });
}

/* SEARCH + FILTER + SORT */
searchInput.addEventListener("input", () => {
  applyFilters();
});

categoryFilter.addEventListener("change", () => {
  applyFilters();
});

sortSelect.addEventListener("change", () => {
  applyFilters();
});

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  let result = allProducts.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchText.trim());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  result = applySort(result);
  filteredProducts = result;
  renderProducts(filteredProducts);
}

function applySort(list) {
  const sortValue = sortSelect.value;
  const sorted = [...list];

  if (sortValue === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortValue === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  }

  return sorted;
}

/* CART LOGIC */
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  const priceInRupees = product.price * 85;

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: priceInRupees,
      qty: 1,
    });
  }

  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalItems;

  cartItemsEl.innerHTML = "";
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    row.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-title">${item.title.slice(0, 35)}${item.title.length > 35 ? "..." : ""
      }</div>
        <div class="cart-item-qty">Qty: ${item.qty}</div>
      </div>
      <div>
        <div class="cart-item-price">₹${(item.price * item.qty).toFixed(
        0
      )}</div>
        <button class="remove-btn">✕</button>
      </div>
    `;

    row.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartItemsEl.appendChild(row);
  });

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  cartTotalEl.textContent = totalAmount.toFixed(0);

  saveCartToStorage();
}

/* WISHLIST LOGIC */
function toggleWishlist(productId) {
  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter((id) => id !== productId);
  } else {
    wishlist.push(productId);
  }
  saveWishlistToStorage();
}

/* CART SIDEBAR */
cartToggle.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  overlay.classList.add("show");
});

closeCart.addEventListener("click", () => {
  closeCartSidebar();
});

overlay.addEventListener("click", () => {
  closeCartSidebar();
  closeProductModal();
});

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("show");
}

/* PRODUCT MODAL */
function openProductModal(product) {
  currentModalProduct = product;
  const inRupees = (product.price * 85).toFixed(0);

  modalImage.src = product.image;
  modalTitle.textContent = product.title;
  modalDescription.textContent = product.description;
  modalPrice.textContent = inRupees;

  productModal.classList.add("open");
  overlay.classList.add("show");
}

function closeProductModal() {
  productModal.classList.remove("open");
  overlay.classList.remove("show");
  currentModalProduct = null;
}

closeModal.addEventListener("click", () => {
  closeProductModal();
});

modalAddToCart.addEventListener("click", () => {
  if (currentModalProduct) {
    addToCart(currentModalProduct);
  }
});

/* INIT ON LOAD */
loadWishlistFromStorage();
loadCartFromStorage();