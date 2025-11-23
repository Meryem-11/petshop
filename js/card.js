 // Register delegated click handler immediately (no DOMContentLoaded wrapper)
  // Delegated click handler for all "add to cart" buttons across pages
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.cat-btn, .dog-btn, .bird-btn, .fish-btn, .rodent-btn, .btn-secondary, .add-to-cart');
    if (!btn) return;

    const card = btn.closest('.product-card, .dog-card, .cat-card, .bird-card, .fish-card, .rodent-card');
    if (!card) return;

    // Derive product name
    const name =
      (card.getAttribute('data-name') || card.querySelector('h3')?.textContent || '').trim() || 'Produit';

    // Derive product price (supports data-price, ".price" and ".product-price", comma decimals)
    let price = NaN;
    const rawAttr = card.getAttribute('data-price');
    if (rawAttr != null && rawAttr !== '') {
      price = parseFloat(String(rawAttr).replace(',', '.'));
    }
    if (isNaN(price)) {
      const priceEl = card.querySelector('.price, .product-price');
      if (priceEl) {
        const txt = priceEl.textContent || '';
        const m = txt.match(/([\d.,]+)/);
        if (m) {
          // Normalize number: remove thousand separators, convert comma decimal to dot
          // Normalize number without lookbehind (Safari-safe)
          const rawNum = (m[1] || '').replace(/\s/g, '');
          const lastDot = rawNum.lastIndexOf('.');
          const lastComma = rawNum.lastIndexOf(',');
          const sepIndex = Math.max(lastDot, lastComma);
          let normalized;
          if (sepIndex >= 0) {
            const intPart = rawNum.slice(0, sepIndex).replace(/[.,]/g, '');
            const fracPart = rawNum.slice(sepIndex + 1).replace(/[.,]/g, '');
            normalized = intPart + '.' + fracPart;
          } else {
            normalized = rawNum.replace(/[.,]/g, '');
          }
          price = parseFloat(normalized);
        }
      }
    }
    if (isNaN(price)) price = 0;

    // Image
    const img = card.querySelector('img');

    const product = {
      name,
      price,
      image: img ? img.src : ''
    };

    console.debug('Add to cart clicked', { name, price });

    // Persist to localStorage
    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch (_) {
      cart = [];
    }
    cart.push(product);
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (err) {
      console.warn('localStorage.setItem failed:', err);
    }

    // UI updates
    updateCart();
    updateCartCount();

    // Optional hooks if defined elsewhere
    if (window.showToast) window.showToast(product.name + ' a été ajouté au panier !', 'success');
    if (window.updateCartCount) window.updateCartCount();
    if (window.refreshMiniCart) window.refreshMiniCart();
  });

  // Initial sync on script load (works even if DOMContentLoaded already fired)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateCart();
      updateCartCount();
    });
  } else {
    updateCart();
    updateCartCount();
  }

function updateCart() {
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (err) { cart = []; }
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  if (!cartList || !cartTotal) return;

  cartList.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.gap = '10px';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '5px';

    const span = document.createElement('span');
    span.textContent = `${item.name} - ${item.price} DH`;
    span.style.flex = '1';

    li.appendChild(img);
    li.appendChild(span);
    cartList.appendChild(li);

    total += Number(item.price) || 0;
  });

  cartTotal.textContent = total;
}

function updateCartCount() {
  const cartCountSpan = document.getElementById('cart-count');
  if (!cartCountSpan) return;

  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('cart')) || []; } catch (err) { cart = []; }
  cartCountSpan.textContent = cart.length;
}
