
let products = [
 {id:1,name:'Handloom Cotton Saree',price:1599,img:'saree1.jpg',cat:'Sarees',rating:5},
 {id:2,name:'Ikkat Weave Saree',price:2299,img:'saree2.jpg',cat:'Sarees',rating:5},
 {id:3,name:'Silk Zari Saree',price:3499,img:'saree3.jpg',cat:'Sarees',rating:5},
 {id:4,name:'Pure Khadi Saree',price:1899,img:'saree4.jpg',cat:'Sarees',rating:4},
 {id:5,name:'Woolen Shawl',price:999,img:'shawl1.jpg',cat:'Shawls',rating:4},
 {id:6,name:'Pashmina Shawl',price:2599,img:'shawl2.jpg',cat:'Shawls',rating:5},
 {id:7,name:'Handloom Men Kurta',price:1199,img:'kurta1.jpg',cat:'Kurtas',rating:4},
 {id:8,name:'Cotton Men Kurta',price:1399,img:'kurta2.jpg',cat:'Kurtas',rating:4},
 {id:9,name:'Women Straight Kurta',price:1299,img:'kurta3.jpg',cat:'Kurtas',rating:4},
 {id:10,name:'Printed Dupatta',price:799,img:'dup1.jpg',cat:'Dupattas',rating:5},
 {id:11,name:'Ikkat Dupatta',price:999,img:'dup2.jpg',cat:'Dupattas',rating:5},
 {id:12,name:'Silk Dupatta',price:1499,img:'dup3.jpg',cat:'Dupattas',rating:5},
 {id:13,name:'Woven Carpet',price:3499,img:'carpet1.jpg',cat:'Carpets',rating:5},
 {id:14,name:'Dhurrie Carpet',price:2899,img:'carpet2.jpg',cat:'Carpets',rating:4},
 {id:15,name:'Handloom Bedsheet',price:1799,img:'bed1.jpg',cat:'Bedsheets',rating:4},
 {id:16,name:'King Size Bedsheet',price:1999,img:'bed2.jpg',cat:'Bedsheets',rating:5}
];

function cardHTML(p){
  return `
  <div class="card">
    <img src="${p.img}" alt="${p.name}">
    <div class="card-body">
      <div class="name">${p.name}</div>
      <div class="price">₹${p.price}</div>
      <div class="rating">⭐ ${p.rating} / 5 · ${p.cat}</div>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <button class="secondary" onclick="addToWishlist(${p.id})">♡ Wishlist</button>
      <button class="secondary" onclick="viewProduct(${p.id})">View Details</button>
    </div>
  </div>`;
}

// Home page
function renderHome(){
  const grid = document.getElementById('featured-products');
  if(!grid) return;
  const featured = products.slice(0,8);
  grid.innerHTML = '';
  featured.forEach(p => grid.innerHTML += cardHTML(p));
}

// Listing page
function renderListing(){
  const grid = document.getElementById('all-products');
  if(!grid) return;
  const search = document.getElementById('search')?.value?.toLowerCase() || '';
  const cat = document.getElementById('catFilter')?.value || 'All';
  const sort = document.getElementById('sort')?.value || 'none';
  let filtered = products.filter(p =>
    (cat === 'All' || p.cat===cat) &&
    p.name.toLowerCase().includes(search)
  );
  if(sort==='low') filtered.sort((a,b)=>a.price-b.price);
  if(sort==='high') filtered.sort((a,b)=>b.price-a.price);

  grid.innerHTML='';
  filtered.forEach(p=>grid.innerHTML+=cardHTML(p));
}

// Product detail page
function viewProduct(id){
  localStorage.setItem('hasth_view', String(id));
  location.href = 'product.html';
}

function loadProductDetail(){
  const wrap = document.getElementById('product-detail');
  if(!wrap) return;
  const id = parseInt(localStorage.getItem('hasth_view') || '0');
  const p = products.find(x=>x.id===id) || products[0];
  wrap.innerHTML = `
  <div class="detail-layout">
    <div class="detail-img">
      <img src="${p.img}" alt="${p.name}">
    </div>
    <div class="detail-info">
      <h2>${p.name}</h2>
      <p class="rating">⭐ ${p.rating} / 5</p>
      <h3 class="price">₹${p.price}</h3>
      <p>Inclusive of all taxes. Authentic handloom product from HasthKargh.</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
      <button class="secondary" onclick="addToWishlist(${p.id})">♡ Add to Wishlist</button>
      <hr>
      <p><strong>Shipping:</strong> 2–7 days within India. Free shipping above ₹2000.</p>
      <p><strong>Returns:</strong> Easy 7–day return policy.</p>
    </div>
  </div>`;
}

// Cart + wishlist helpers
function getCart(){return JSON.parse(localStorage.getItem('hasth_cart')||'[]');}
function saveCart(c){localStorage.setItem('hasth_cart',JSON.stringify(c));}
function addToCart(id){
  let c=getCart();
  let it=c.find(x=>x.id===id);
  if(it) it.qty++; else c.push({id:id,qty:1});
  saveCart(c);
  alert('Added to cart');
}

function renderCart(){
  const box=document.getElementById('cart-items');
  const totalEl=document.getElementById('cart-total');
  if(!box||!totalEl) return;
  let c=getCart(); box.innerHTML=''; let total=0;
  c.forEach(it=>{
    const p=products.find(x=>x.id===it.id);
    if(!p) return;
    total+=p.price*it.qty;
    box.innerHTML+=`
      <div class="card">
        <div class="card-body">
          <div class="name">${p.name}</div>
          <div class="price">₹${p.price} × ${it.qty}</div>
          <button class="small" onclick="removeFromCart(${p.id})">Remove</button>
        </div>
      </div>`;
  });
  totalEl.textContent = 'Total: ₹'+total;
}

function removeFromCart(id){
  let c=getCart().filter(x=>x.id!==id);
  saveCart(c); renderCart();
}

function getWishlist(){return JSON.parse(localStorage.getItem('hasth_wish')||'[]');}
function saveWishlist(w){localStorage.setItem('hasth_wish',JSON.stringify(w));}
function addToWishlist(id){
  let w=getWishlist();
  if(!w.includes(id)) w.push(id);
  saveWishlist(w);
  alert('Added to wishlist');
}
function renderWishlist(){
  const box=document.getElementById('wish-items');
  if(!box) return;
  let w=getWishlist(); box.innerHTML='';
  w.forEach(id=>{
    const p=products.find(x=>x.id===id);
    if(!p) return;
    box.innerHTML+=`
      <div class="card">
        <div class="card-body">
          <div class="name">${p.name}</div>
          <button class="small" onclick="removeFromWishlist(${p.id})">Remove</button>
        </div>
      </div>`;
  });
}
function removeFromWishlist(id){
  let w=getWishlist().filter(x=>x!==id);
  saveWishlist(w); renderWishlist();
}

// Login + payment
function login(){
  const email=document.getElementById('email')?.value||'';
  if(!email){alert('Enter email');return;}
  localStorage.setItem('hasth_user',email);
  alert('Login success'); location.href='index.html';
}

function pay(){
  const user=localStorage.getItem('hasth_user');
  if(!user){alert('Please login first');return;}
  const cart=getCart();
  if(cart.length===0){alert('Cart is empty');return;}
  alert('Order placed successfully at HasthKargh!');
  localStorage.removeItem('hasth_cart');
  location.href='index.html';
}
