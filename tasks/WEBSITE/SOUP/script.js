let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = JSON.parse(localStorage.getItem("total")) || 0;

render();

function add(name, price) {
  let item = cart.find(i => i.name === name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  total += price;
  save();
  render();
}

function render() {
  let tbody = document.getElementById("items");
  tbody.innerHTML = "";

  cart.forEach((item, index) => {
    let row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td>
        <div class="qty">
          <button onclick="decrease(${index})">−</button>
          <span>${item.qty}</span>
          <button onclick="increase(${index})">+</button>
        </div>
      </td>
      <td>₹${item.price * item.qty}</td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("total").innerText = total;
}

/* Increase qty */
function increase(index) {
  cart[index].qty++;
  total += cart[index].price;
  save();
  render();
}

/* Decrease qty */
function decrease(index) {
  cart[index].qty--;
  total -= cart[index].price;

  if (cart[index].qty === 0) {
    cart.splice(index, 1);
  }

  save();
  render();
}

/* Save */
function save() {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("total", JSON.stringify(total));
}

/* Order */
function order() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let payment = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  let message = "🍲 *Uttran Soup Corner Order*%0A%0A";

  cart.forEach(item => {
    message += `• ${item.name} x ${item.qty} = ₹${item.price * item.qty}%0A`;
  });

  message += `%0A💰 *Total:* ₹${total}`;
  message += `%0A💳 *Payment:* ${payment}`;
  message += `%0A📍 Uttran, Surat`;

  let phone = "91XXXXXXXXXX"; // 🔴 your WhatsApp number
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

  cart = [];
  total = 0;
  save();
  render();
}
