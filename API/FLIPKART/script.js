/* ================= API PRODUCTS ================= */
const API = "https://fakestoreapi.com/products";
let products = JSON.parse(localStorage.getItem("adminProducts")) || [];

fetch(API)
  .then(res => res.json())
  .then(data => {
    products = [...data, ...products];
    renderProducts();
  });

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ================= HOME ================= */
function renderProducts(){
  const box = document.getElementById("products");
  if(!box) return;

  box.innerHTML = "";
  products.forEach(p=>{
    box.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h4>${p.title}</h4>
        <p>₹${Math.round(p.price*80)}</p>
        <button onclick="view(${p.id})">View</button>
        <button onclick="addToCart(${p.id})">Add</button>
      </div>
    `;
  });

  updateCartCount();
}

/* ================= CART ================= */
function addToCart(id){
  let item = cart.find(i=>i.id===id);
  item ? item.qty++ : cart.push({id,qty:1});
  localStorage.setItem("cart",JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(){
  const c=document.getElementById("cartCount");
  if(c) c.innerText = cart.reduce((a,b)=>a+b.qty,0);
}

/* ================= VIEW ================= */
function view(id){
  localStorage.setItem("view",id);
  location.href="product.html";
}

/* ================= PRODUCT PAGE ================= */
const pd=document.getElementById("productDetail");
if(pd){
  const p = products.find(p=>p.id==localStorage.getItem("view"));
  pd.innerHTML=`
    <img src="${p.image}" width="200">
    <h2>${p.title}</h2>
    <h3>₹${Math.round(p.price*80)}</h3>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
  `;
}

/* ================= CART PAGE ================= */
const ci=document.getElementById("cartItems");
const totalDiv=document.getElementById("total");
if(ci){
  let total=0;
  cart.forEach(c=>{
    const p=products.find(p=>p.id===c.id);
    total+=p.price*80*c.qty;
    ci.innerHTML+=`
      <p>${p.title} × ${c.qty}
      <button onclick="removeItem(${c.id})">Remove</button></p>
    `;
  });
  totalDiv.innerText="Total ₹"+Math.round(total);
}

function removeItem(id){
  cart=cart.filter(i=>i.id!==id);
  localStorage.setItem("cart",JSON.stringify(cart));
  location.reload();
}

/* ================= ADMIN ================= */
function addProduct(){
  const t=title.value;
  const p=price.value;
  const i=img.value;
  const newP={
    id:Date.now(),
    title:t,
    price:p,
    image:i
  };
  const saved=JSON.parse(localStorage.getItem("adminProducts"))||[];
  saved.push(newP);
  localStorage.setItem("adminProducts",JSON.stringify(saved));
  alert("Product Added");
}

/* ================= RAZORPAY ================= */
function payNow(){
  const options={
    key:"rzp_test_1DP5mmOlF5G5ag",
    amount:50000,
    currency:"INR",
    name:"Flipkart JS Clone",
    description:"Test Payment",
    handler:function(res){
      alert("Payment Success ✅\n"+res.razorpay_payment_id);
    }
  };
  const rzp=new Razorpay(options);
  rzp.open();
}
