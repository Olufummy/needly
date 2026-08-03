document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#product-grid');
  const filters = [...document.querySelectorAll('.filter')];
  const searchPanel = document.querySelector('.search-panel');
  const searchInput = document.querySelector('#product-search');
  const searchStatus = document.querySelector('.search-status');
  const emptyState = document.querySelector('.empty-state');
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.overlay');
  const dialog = document.querySelector('.product-dialog');
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  const toast = document.querySelector('.toast');
  let activeFilter = 'all';
  let cart = JSON.parse(localStorage.getItem('needly-cart') || '[]');

  const money = value => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);
  const showToast = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  function visibleProducts() {
    const term = searchInput.value.trim().toLowerCase();
    return allProducts.filter(product => {
      const categoryMatch = activeFilter === 'all' || product.category === activeFilter;
      const textMatch = !term || `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(term);
      return categoryMatch && textMatch;
    });
  }

  function renderProducts() {
    const products = visibleProducts();
    grid.innerHTML = products.map(product => `
      <article class="product-card" data-id="${product.id}">
        <div class="product-image"><img src="${product.image}" alt="${product.name}" loading="lazy">${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}</div>
        <div class="product-info"><div class="product-meta"><h3>${product.name}</h3><strong>${money(product.price)}</strong></div><p>${product.description}</p>
        <div class="product-actions"><button class="quick-view" type="button">Details</button><button class="add" type="button">Add to bag</button></div></div>
      </article>`).join('');
    emptyState.hidden = products.length > 0;
    searchStatus.textContent = searchInput.value ? `${products.length} product${products.length === 1 ? '' : 's'} found` : '';
  }

  function saveCart() {
    localStorage.setItem('needly-cart', JSON.stringify(cart));
    document.querySelector('.cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.subtotal').textContent = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    document.querySelector('.cart-items').innerHTML = cart.length ? cart.map(item => `
      <article class="cart-item" data-id="${item.id}"><img src="${item.image}" alt=""><div><h3>${item.name}</h3><p>${money(item.price)}</p><div class="qty"><button type="button" data-action="minus" aria-label="Decrease ${item.name}">−</button><span>${item.quantity}</span><button type="button" data-action="plus" aria-label="Increase ${item.name}">+</button></div></div><button class="remove" type="button" data-action="remove" aria-label="Remove ${item.name}">×</button></article>`).join('') : '<p class="cart-empty">Your ritual is waiting. Add an essential to begin.</p>';
  }

  function openCart() { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); overlay.hidden = false; document.body.style.overflow = 'hidden'; document.querySelector('.cart-close').focus(); }
  function closeCart() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); overlay.hidden = true; document.body.style.overflow = ''; }
  function addToCart(product) {
    const item = cart.find(entry => entry.id === product.id);
    if (item) item.quantity += 1; else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    saveCart(); showToast(`${product.name} added to your ritual`);
  }

  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active')); button.classList.add('active'); activeFilter = button.dataset.filter; renderProducts();
  }));
  grid.addEventListener('click', event => {
    const card = event.target.closest('.product-card'); if (!card) return;
    const product = allProducts.find(item => item.id === Number(card.dataset.id));
    if (event.target.closest('.add')) addToCart(product);
    if (event.target.closest('.quick-view')) {
      document.querySelector('.dialog-content').innerHTML = `<img src="${product.image}" alt="${product.name}"><div class="dialog-copy"><p class="eyebrow">${product.category}</p><h2>${product.name}</h2><strong>${money(product.price)}</strong><p>${product.description}</p><p>Designed to fit into a clear, repeatable Needly ritual.</p><button type="button" data-dialog-add="${product.id}">Add to bag ↗</button></div>`;
      dialog.showModal();
    }
  });
  document.querySelector('.dialog-content').addEventListener('click', event => { const id = event.target.dataset.dialogAdd; if (id) { addToCart(allProducts.find(item => item.id === Number(id))); dialog.close(); openCart(); } });
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.querySelector('.bag-button').addEventListener('click', openCart);
  document.querySelector('.cart-close').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  document.querySelector('.cart-items').addEventListener('click', event => {
    const row = event.target.closest('.cart-item'); if (!row || !event.target.dataset.action) return;
    const item = cart.find(entry => entry.id === Number(row.dataset.id));
    if (event.target.dataset.action === 'plus') item.quantity += 1;
    if (event.target.dataset.action === 'minus') item.quantity = Math.max(1, item.quantity - 1);
    if (event.target.dataset.action === 'remove') cart = cart.filter(entry => entry.id !== item.id);
    saveCart();
  });
  document.querySelector('.checkout-button').addEventListener('click', () => {
    if (!cart.length) { showToast('Your ritual is empty'); return; }
    const lines = cart.map(item => `${item.quantity} × ${item.name} — ${money(item.price * item.quantity)}`).join('\n');
    const total = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    window.location.href = `mailto:hello@needly.com?subject=${encodeURIComponent('Needly order enquiry')}&body=${encodeURIComponent(`Hello Needly,\n\nI would like to enquire about this ritual:\n\n${lines}\n\nSubtotal: ${total}\n\nMy delivery location is:`)}`;
  });

  document.querySelector('.search-toggle').addEventListener('click', () => { searchPanel.classList.add('open'); searchPanel.setAttribute('aria-hidden', 'false'); searchInput.focus(); });
  document.querySelector('.search-close').addEventListener('click', () => { searchPanel.classList.remove('open'); searchPanel.setAttribute('aria-hidden', 'true'); });
  searchInput.addEventListener('input', renderProducts);
  menuButton.addEventListener('click', () => { const open = mobileNav.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
  mobileNav.addEventListener('click', () => { mobileNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); });
  document.querySelector('#newsletter-form').addEventListener('submit', event => { event.preventDefault(); document.querySelector('.form-status').textContent = 'You’re on the list. Welcome to a quieter skincare inbox.'; event.target.reset(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCart(); searchPanel.classList.remove('open'); mobileNav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); } });
  document.querySelector('#year').textContent = new Date().getFullYear();
  renderProducts(); saveCart();
});
