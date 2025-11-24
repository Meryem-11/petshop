document.addEventListener("DOMContentLoaded", function() {

    // Sélectionner les boutons après que le header et le DOM soient prêts
    const buttons = document.querySelectorAll(".cat-btn");
    const cartCountSpan = document.getElementById('cart-count');

    console.log("Nombre de boutons trouvés :", buttons.length);
    console.log("Cart count span :", cartCountSpan);

    // Charger le panier depuis le localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cartCountSpan) cartCountSpan.textContent = cart.length;

    // Ajouter l'événement click à chaque bouton
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            console.log("Bouton cliqué !");

            const card = this.closest(".cat-card");
            if (!card) {
                console.log("Impossible de trouver la carte !");
                return;
            }

            const product = {
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                quantity: 1,
                image: card.querySelector('img') ? card.querySelector('img').src : ''
            };

            // Vérifier si le produit est déjà dans le panier
            const existingIndex = cart.findIndex(item => item.name === product.name);
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(product);
            }

           console.log("Avant sauvegarde :", cart);
localStorage.setItem('cart', JSON.stringify(cart));
console.log("Après sauvegarde :", JSON.parse(localStorage.getItem('cart')));


            // Mettre à jour le compteur
            if (cartCountSpan) cartCountSpan.textContent = cart.length;

            alert(`${product.name} a été ajouté au panier !`);
        });
    });
});
