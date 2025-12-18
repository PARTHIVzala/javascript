let cart = [];

function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: price, quantity: 1 });
    }
    displayCart();
}

function calculateDiscount(total) {
    return total >= 200 ? total * 0.1 : 0; // 10% discount if total ≥ 200
}

function updateQuantity(index, newQty) {
    if (newQty < 1) newQty = 1; // Minimum quantity is 1
    cart[index].quantity = parseInt(newQty);
    displayCart();
}

function displayCart() {
    const table = document.getElementById("billTable");
    const cartBody = document.getElementById("cart-body");
    cartBody.innerHTML = "";

    let grandTotal = 0, grandDiscount = 0, grandPay = 0;

    if (cart.length > 0) {
        table.style.display = "table";
    } else {
        table.style.display = "none";
    }

    cart.forEach((item, index) => {
        const total = item.price * item.quantity;
        const discount = calculateDiscount(total);
        const pay = total - discount;

        grandTotal += total;
        grandDiscount += discount;
        grandPay += pay;

        cartBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>
                    <input type="number" class="qty" value="${item.quantity}" 
                    onchange="updateQuantity(${index}, this.value)">
                </td>
                <td>${total}</td>
                <td>${discount.toFixed(2)}</td>
                <td>${pay.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
    document.getElementById("grandDiscount").innerText = grandDiscount.toFixed(2);
    document.getElementById("grandPay").innerText = grandPay.toFixed(2);
}
