let total = 0;
const cartItems = document.getElementById("cartItems");
const totalEl = document.getElementById("total");

function addToCart(name, price) {
  const li = document.createElement("li");
  li.textContent = `${name} - ₹${price}`;
  cartItems.appendChild(li);

  total += price;
  totalEl.textContent = total;
}

function placeOrder() {
  if (total === 0) {
    alert("Cart is empty!");
  } else {
    alert("Order placed successfully! 🍲");
    cartItems.innerHTML = "";
    total = 0;
    totalEl.textContent = total;
  }
}
