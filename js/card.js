document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".cat-btn, .dog-btn, .bird-btn, .fish-btn, .rodent-btn, .product-card .btn-secondary");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const card = this.closest(".cat-card, .dog-card, .bird-card, .fish-card, .rodent-card, .product-card");
      if (!card) return;

      const name = card.getAttribute("data-name") || (card.querySelector("h3")?.textContent?.trim()) || "Produit";
      let price = parseFloat(card.getAttribute("data-price"));
      if (isNaN(price)) {
        const priceEl = card.querySelector(".price, .product-price");
        if (priceEl) {
          const num = priceEl.textContent.replace(/[^0-9.,]/g, "").replace(",", ".");
          price = parseFloat(num) || 0;
        } else {
          price = 0;
        }
      }
      const image = card.querySelector("img") ? card.querySelector("img").src : "";
      const product = { name, price, image };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));

      updateCart();
      updateCartCount();
      alert(product.name + " a été ajouté au panier !");
    });
  });

  function updateCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.getElementById("cart-list");
    const cartTotal = document.getElementById("cart-total");
    if (!cartList || !cartTotal) return;

    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "10px";

      // Image
      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "5px";

      // Texte
      const span = document.createElement("span");
      span.textContent = `${item.name} - ${item.price} DH`;
      span.style.flex = "1";

      li.appendChild(img);
      li.appendChild(span);
      cartList.appendChild(li);

      total += item.price;
    });

    cartTotal.textContent = total;
  }

  function updateCartCount() {
    const cartCountSpan = document.getElementById("cart-count");
    if (!cartCountSpan) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartCountSpan.textContent = cart.length;
  }

  updateCart();
  updateCartCount();
});
