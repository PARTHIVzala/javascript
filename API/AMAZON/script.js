const API_BASE_URL = "http://localhost:3000"; 
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products`;
const CART_ENDPOINT = `${API_BASE_URL}/api/cart`; 

// ================= PRODUCT DATA (local fallback) =================
let PRODUCTS = {
  p1: {
    id: "p1",
    name: "Noise ColorFit Smartwatch",
    price: 1999,
    desc: 'Bluetooth calling smartwatch with 1.69" display, multiple sports modes and up to 7 days battery life.',
    imgText: "Noise Smartwatch Image",
  },
  p2: {
    id: "p2",
    name: "boAt Rockerz Headphones",
    price: 1499,
    desc: "Wireless over-ear headphones with deep bass, up to 15 hours playback and comfy cushioning.",
    imgText: "boAt Headphones Image",
  },
  p3: {
    id: "p3",
    name: 'Samsung 32" Smart TV',
    price: 14999,
    desc: "32 inch HD Ready LED Smart TV with built-in apps, screen mirroring and powerful sound.",
    imgText: "Samsung TV Image",
  },
  p4: {
    id: "p4",
    name: "Realme Narzo Smartphone",
    price: 11999,
    desc: "Powerful smartphone with fast processor, 50MP camera and long battery life.",
    imgText: "Realme Narzo Phone Image",
  },
};

// ---------- API helpers ----------
async function loadProductsFromApi() {
  try {
    const res = await fetch(PRODUCTS_ENDPOINT);
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();

    // Expecting: [ { id, name, price, desc, imgText }, ... ]
    const obj = {};
    data.forEach((p) => {
      if (!p.id) return;
      obj[p.id] = {
        id: p.id,
        name: p.name,
        price: Number(p.price),
        desc: p.desc || "",
        imgText: p.imgText || p.name || "",
      };
    });

    if (Object.keys(obj).length > 0) {
      PRODUCTS = obj; // override local products with API data
      console.log("Products loaded from API:", PRODUCTS);
    }
  } catch (err) {
    console.warn("Using local PRODUCTS fallback. API error:", err);
  }
}

async function syncCartToApi(cart) {
  try {
    await fetch(CART_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart }),
    });
    // no need to handle response for simple demo
  } catch (err) {
    console.warn("Cart sync failed (API):", err);
  }
}

// ================= HERO SLIDER (home page only) =================
const slides = document.querySelectorAll(".hero-slide");
const prevBtn = document.querySelector(".hero-prev");
const nextBtn = document.querySelector(".hero-next");

let currentSlide = 0;
let slideIntervalId = null;

function showSlide(index) {
  if (slides.length === 0) return;
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  if (slides.length === 0) return;
  const nextIndex = (currentSlide + 1) % slides.length;
  showSlide(nextIndex);
}

function prevSlideFn() {
  if (slides.length === 0) return;
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prevIndex);
}

function startSlider() {
  if (slides.length === 0) return;
  slideIntervalId = setInterval(nextSlide, 4000);
}

function stopSlider() {
  if (slideIntervalId) clearInterval(slideIntervalId);
}

if (prevBtn && nextBtn && slides.length > 0) {
  prevBtn.addEventListener("click", () => {
    stopSlider();
    prevSlideFn();
    startSlider();
  });

  nextBtn.addEventListener("click", () => {
    stopSlider();
    nextSlide();
    startSlider();
  });

  startSlider();
}

// ================= DEAL COUNTDOWN TIMER (if present) =================
const countdownEl = document.getElementById("deal-countdown");
if (countdownEl) {
  const DEAL_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours
  const dealEndTime = Date.now() + DEAL_DURATION_MS;

  function updateCountdown() {
    const now = Date.now();
    const remaining = dealEndTime - now;

    if (remaining <= 0) {
      countdownEl.textContent = "00:00:00";
      clearInterval(countdownInterval);
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(
      Math.floor((totalSeconds % 3600) / 60)
    ).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    countdownEl.textContent = `${hours}:${minutes}:${seconds}`;
  }

  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();
}

// ================= CART SYSTEM (localStorage + API) =================
const CART_STORAGE_KEY = "amazona-cart";

// In-memory cart
let cart = [];

// DOM elements (present on both pages)
const cartBtn = document.getElementById("cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const cartClearBtn = document.getElementById("cart-clear-btn");

// Add to cart buttons on listing/home
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

// Load cart from localStorage
function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) {
      cart = [];
      return;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      cart = parsed;
    } else {
      cart = [];
    }
  } catch (err) {
    console.error("Error parsing cart from localStorage", err);
    cart = [];
  }
}

// Save cart to localStorage
function saveCartToStorage() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Error saving cart to localStorage", err);
  }
}

// Show / Hide cart panel
function openCart() {
  if (!cartOverlay) return;
  cartOverlay.classList.add("open");
}

function closeCart() {
  if (!cartOverlay) return;
  cartOverlay.classList.remove("open");
}

if (cartBtn) {
  cartBtn.addEventListener("click", openCart);
}
if (cartCloseBtn) {
  cartCloseBtn.addEventListener("click", closeCart);
}

// Close when click outside panel
if (cartOverlay) {
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) {
      closeCart();
    }
  });
}

// Add to cart click handlers (for all .add-to-cart-btn on page)
addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    addToCart({ id, name, price });
  });
});

// Add item to cart
function addToCart(product) {
  if (!product || !product.id) return;
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  }

  updateCartUI();
}

// Remove completely
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
}

// Change quantity
function changeQty(id, delta) {
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    updateCartUI();
  }
}

// Clear cart
if (cartClearBtn) {
  cartClearBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
  });
}

// Update cart count, list and total
function updateCartUI() {
  // Save to localStorage
  saveCartToStorage();

  // 🔁 Also sync to backend API (optional)
  syncCartToApi(cart);

  if (!cartItemsEl || !cartTotalEl || !cartCountEl) return;

  // Update count (total qty)
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = totalQty;

  // Update list
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.textContent = "Your cart is empty.";
    emptyLi.style.fontSize = "14px";
    cartItemsEl.appendChild(emptyLi);
  } else {
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString(
            "en-IN"
          )}</div>
          <button class="cart-remove-btn" data-id="${item.id}">Remove</button>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${item.id}" data-action="dec">-</button>
          <span class="cart-item-qty">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
  }

  // Update total
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  cartTotalEl.textContent = `₹${totalAmount.toLocaleString("en-IN")}`;

  // Attach listeners for qty & remove buttons
  attachCartItemEvents();
}

// Attach events to dynamically created buttons
function attachCartItemEvents() {
  const qtyButtons = cartItemsEl
    ? cartItemsEl.querySelectorAll(".qty-btn")
    : [];
  const removeButtons = cartItemsEl
    ? cartItemsEl.querySelectorAll(".cart-remove-btn")
    : [];

  qtyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      if (action === "inc") changeQty(id, +1);
      if (action === "dec") changeQty(id, -1);
    });
  });

  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      removeFromCart(id);
    });
  });
}

// ================= PRODUCT PAGE POPULATION (with API) =================
const productPageEl = document.querySelector(".product-page");

async function initProductPage() {
  if (!productPageEl) return;

  // First, try to load products from API (will override local PRODUCTS)
  await loadProductsFromApi();

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id") || "p1";
  const product = PRODUCTS[productId] || Object.values(PRODUCTS)[0];

  if (!product) return;

  const titleEl = document.getElementById("pd-title");
  const priceEl = document.getElementById("pd-price");
  const descEl = document.getElementById("pd-desc");
  const imgEl = document.getElementById("pd-img");
  const addBtn = document.getElementById("pd-add-btn");

  if (titleEl) titleEl.textContent = product.name;
  if (priceEl)
    priceEl.textContent = `₹${product.price.toLocaleString("en-IN")}`;
  if (descEl) descEl.textContent = product.desc;
  if (imgEl) imgEl.textContent = product.imgText;

  if (addBtn) {
    addBtn.dataset.id = product.id;
    addBtn.dataset.name = product.name;
    addBtn.dataset.price = String(product.price);

    addBtn.addEventListener("click", () => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
      });
    });
  }
}

// ================= INITIALIZE ON PAGE LOAD =================
loadCartFromStorage();
updateCartUI();
initProductPage(); // runs only on product page