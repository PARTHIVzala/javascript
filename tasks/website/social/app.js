/* app.js */
document.addEventListener('DOMContentLoaded', ()=> {
  const products = [
    {id:1,title:'Unicity Health Pack',price:129.99,img:'images/unicity.webp'},
    {id:2,title:'Wishcare Skin Kit',price:39.99,img:'images/wishcare.webp'},
    {id:3,title:'4Life Transfer Factor',price:199.99,img:'images/4life.webp'},
    {id:4,title:'NIGHTFALL',price:29.99,img:'images/nightfall.jpg'}
  ];

  const grid = document.getElementById('grid');
  const cnt = document.getElementById('cnt');
  const qInput = document.getElementById('q');
  const searchBtn = document.getElementById('s');

  const fimg = document.getElementById('fimg');
  const ftitle = document.getElementById('ftitle');
  const dots = document.getElementById('dots');
  const addFeat = document.getElementById('addFeat');

  const cartBack = document.getElementById('cartBack');
  const itemsEl = document.getElementById('items');
  const totalEl = document.getElementById('total');
  const openCart = document.getElementById('openCart');
  const closeBtn = document.getElementById('close');

  let cart = {};
  let featuredIndex = 0;
  let interval = null;

  // render product grid
  function render(list = products){
    grid.innerHTML = '';
    list.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div style="font-weight:700;margin-top:8px">${p.title}</div>
        <div style="color:#666;margin-top:6px">$${p.price.toFixed(2)}</div>
        <div class="meta"><div></div><button class="btn" data-id="${p.id}">Add</button></div>
      `;
      grid.appendChild(el);
    });
    grid.querySelectorAll('button[data-id]').forEach(b => b.onclick = ()=> addToCart(+b.dataset.id));
  }

  // cart logic
  function addToCart(id, qty=1){
    const p = products.find(x=> x.id===id);
    if(!p) return;
    cart[id] = cart[id] ? {...cart[id], qty: cart[id].qty + qty} : {...p, qty};
    updateCartUI();
  }
  function updateCartUI(){
    const totalQty = Object.values(cart).reduce((s,i)=> s + i.qty, 0);
    cnt.textContent = totalQty;
    itemsEl.innerHTML = totalQty ? Object.values(cart).map(i=>`
      <div style="display:flex;justify-content:space-between;margin:6px 0">
        <div>${i.title} × ${i.qty}</div><div>$${(i.price*i.qty).toFixed(2)}</div>
      </div>
    `).join('') : '<div style="color:#666">Cart empty</div>';
    totalEl.textContent = 'Total: $' + Object.values(cart).reduce((s,i)=> s + i.price*i.qty, 0).toFixed(2);
  }

  // featured carousel
  function setFeatured(i){
    featuredIndex = i % products.length;
    const p = products[featuredIndex];
    fimg.src = p.img;
    ftitle.textContent = p.title;
    Array.from(dots.children).forEach((d,idx)=> d.classList.toggle('active', idx === featuredIndex));
  }
  function renderDots(){
    dots.innerHTML = '';
    products.forEach((_,i)=> {
      const d = document.createElement('div');
      d.className = 'dot' + (i===0 ? ' active' : '');
      d.onclick = ()=> setFeatured(i);
      dots.appendChild(d);
    });
  }
  addFeat.onclick = ()=> addToCart(products[featuredIndex].id);

  // search
  searchBtn.onclick = ()=> {
    const q = (qInput.value || '').trim().toLowerCase();
    render(q ? products.filter(p => (p.title + ' ' + (p.desc||'')).toLowerCase().includes(q)) : products);
  };

  // cart modal controls
  document.getElementById('openCart').onclick = ()=> { cartBack.style.display = 'flex'; cartBack.setAttribute('aria-hidden','false'); };
  closeBtn.onclick = ()=> { cartBack.style.display = 'none'; cartBack.setAttribute('aria-hidden','true'); };
  cartBack.addEventListener('click', e => { if(e.target === cartBack) { cartBack.style.display = 'none'; cartBack.setAttribute('aria-hidden','true'); } });

  // init
  function start(){
    render();
    renderDots();
    setFeatured(0);
    updateCartUI();
    interval = setInterval(()=> setFeatured(featuredIndex + 1), 3000);
  }

  start();
});
