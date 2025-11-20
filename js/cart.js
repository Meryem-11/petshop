// Cart page logic: render cart items, handle removals, keep header count in sync
document.addEventListener('DOMContentLoaded', () => {
  const cartList = document.getElementById('cart-list');
  const totalSpan = document.getElementById('total');

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('cart') || '[]');
    } catch {
      return [];
    }
  }

  function setCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateHeaderCount() {
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) {
      cartCountSpan.textContent = String(getCart().length);
    }
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    setCart(cart);
    displayCart();
  }

  function displayCart() {
    if (!cartList || !totalSpan) return;

    const cart = getCart();
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const li = document.createElement('li');

      // Image
      const img = document.createElement('img');
      img.src = item.image || '';
      img.alt = item.name || 'Produit';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.width = '90px';
      img.style.height = '90px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '5px';

      // Texte
      const span = document.createElement('span');
      span.textContent = `${item.name} - ${item.price} DH`;
      span.style.flex = '1';

      // Bouton supprimer
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Supprimer';
      removeBtn.className = 'remove-btn';
      removeBtn.addEventListener('click', () => removeFromCart(index));

      li.appendChild(img);
      li.appendChild(span);
      li.appendChild(removeBtn);
      cartList.appendChild(li);

      total += Number(item.price) || 0;
    });

    totalSpan.textContent = total.toFixed(2);
    updateHeaderCount();
  }

  displayCart();
  updateHeaderCount();
});
