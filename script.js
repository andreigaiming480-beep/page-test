// script.js
// Javascript senzill per a ElectroComponents
// Comentaris en català per a facilitar l'aprenentatge

// Llista de productes (poden ser ampliats fàcilment)
const products = [
  { id: 1, name: 'Resistència 220Ω', price: 0.10, category: 'Components bàsics', img: null },
  { id: 2, name: 'LED vermell 5mm', price: 0.12, category: 'Components bàsics', img: null },
  { id: 3, name: 'Arduino UNO', price: 22.50, category: 'Microcontroladors', img: null },
  { id: 4, name: 'Sensor ultrasònic HC-SR04', price: 3.40, category: 'Sensors', img: null },
  { id: 5, name: 'Protoboard', price: 4.20, category: 'Robòtica', img: null },
  { id: 6, name: 'Transistor BC547', price: 0.15, category: 'Components bàsics', img: null }
];

// Carret: array d'articles amb {productId, qty}
let cart = [];

// DOM elements
const productListEl = document.getElementById('product-list');
const cartBtn = document.getElementById('cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');
const closeCartBtn = document.getElementById('close-cart');

// Genera una petita imatge SVG per a cada producte segons el nom (simple i auto-contenida)
function productSVG(name){
  // Mostra una icona diferent segons categoria o nom (molt simple)
  return `
    <svg width="80" height="60" viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="60" rx="6" fill="#f3f6fb" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#0b2545" font-size="10">${name.split(' ')[0]}</text>
    </svg>`;
}

// Renderitza la llista de productes a la pàgina
function renderProducts(list = products){
  productListEl.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-img">${productSVG(p.name)}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">${p.price.toFixed(2)} €</div>
      <button class="add-btn" data-id="${p.id}">Afegir al carret</button>
    `;
    productListEl.appendChild(card);
  });

  // Afegir esdeveniment als botons d'afegir
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

// Afegir producte al carret
function addToCart(productId){
  const found = cart.find(i => i.productId === productId);
  if(found){
    found.qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }
  updateCartUI();
}

// Eliminar producte del carret completament
function removeFromCart(productId){
  cart = cart.filter(i => i.productId !== productId);
  updateCartUI();
}

// Calcular total del carret
function calculateTotal(){
  let total = 0;
  cart.forEach(item => {
    const prod = products.find(p => p.id === item.productId);
    total += prod.price * item.qty;
  });
  return total;
}

// Actualitzar la interfície del carret (items, total i comptador)
function updateCartUI(){
  // Comptador
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  cartCountEl.textContent = totalQty;
  cartCountEl.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}],{duration:180});

  // Items
  cartItemsEl.innerHTML = '';
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<p>El carret està buit.</p>';
  } else {
    cart.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div>
          <div style="font-weight:700">${prod.name}</div>
          <div style="color:#6b7280">${item.qty} × ${prod.price.toFixed(2)} €</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${(prod.price * item.qty).toFixed(2)} €</div>
          <button class="btn remove" data-id="${prod.id}" style="margin-top:6px">Eliminar</button>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });

    // Afegir esdeveniments per eliminar
    cartItemsEl.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', () => removeFromCart(Number(btn.dataset.id)));
    });
  }

  // Total
  cartTotalEl.textContent = calculateTotal().toFixed(2);
}

// Obrir / tancar el carret
cartBtn.addEventListener('click', () => {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden','false');
  updateCartUI();
});
closeCartBtn.addEventListener('click', () => {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden','true');
});

// Simular checkout
document.getElementById('checkout').addEventListener('click', () => {
  if(cart.length === 0){
    alert('El carret està buit.');
    return;
  }
  alert('Pagament simulat. Total: ' + calculateTotal().toFixed(2) + ' €');
  cart = [];
  updateCartUI();
  cartDrawer.classList.remove('open');
});

// Filtrar per categories
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.cat;
    if(cat === 'Tots') renderProducts(products);
    else renderProducts(products.filter(p => p.category === cat));
  });
});

// Formulari de contacte (només simulació, sense enviament real)
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('contact-message').value.trim();
  if(!name || !email || !message){
    alert('Si us plau, omple tots els camps.');
    return;
  }
  // Mostrar resultat senzill per a estudiants
  alert('Missatge enviat. Gràcies, ' + name + '!');
  document.getElementById('contact-form').reset();
});

// Iniciar aplicació
renderProducts();
updateCartUI();
