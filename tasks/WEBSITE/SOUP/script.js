let total = 0;
let list = [];

function add(name, price){
  list.push(`${name} - ₹${price}`);
  total += price;

  document.getElementById("items").innerHTML =
    list.map(i=>`<li>${i}</li>`).join("");

  document.getElementById("total").innerText = total;
}

function order(){
  if(total===0){
    alert("Cart empty");
    return;
  }

  const msg = `Hello, I want to order:%0A${list.join("%0A")}%0ATotal: ₹${total}`;
  window.open(`https://wa.me/919999999999?text=${msg}`,"_blank");
}
