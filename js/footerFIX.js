function loadFooter() {
    const footerHTML = `
    <footer>
      <div class="footer-content">
        <div class="footer-column">
          <h4>Produits</h4>
          <ul>
            <li><a href="./chiens.html">Chiens</a></li>
            <li><a href="./chats.html">Chats</a></li>
            <li><a href="./oiseaux.html">Oiseaux</a></li>
            <li><a href="./poissons.html">Poissons</a></li>
            <li><a href="./rongeurs.html">Rongeurs</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Informations</h4>
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="./contact.html">Support</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Entreprise</h4>
          <ul>
            <li><a href="./apropos.html">À propos</a></li>
            <li><a href="#">Carrières</a></li>
            <li><a href="./contact.html">Contactez-nous</a></li>
          </ul>
        </div>
        <div class="footer-subscribe">
          <h4>S'abonner</h4>
          <form class="subscribe-form" onsubmit="event.preventDefault();">
            <input type="email" placeholder="Adresse e-mail" required>
            <button type="submit" class="subscribe-btn">
              <ion-icon name="arrow-forward"></ion-icon>
            </button>
          </form>
          <p>Bonjour, nous sommes PetShop. Notre objectif est de fournir les meilleurs produits pour le bien-être de vos animaux de compagnie.</p>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-logo">
          <img src="../images/logo.png" alt="Logo PetShop">
          <h3>PetShop</h3>
        </div>
        <div class="footer-legal">
          <a href="#">Conditions</a>
          <a href="#">Confidentialité</a>
          <a href="#">Cookies</a>
        </div>
        <div class="footer-social">
          <a href="#" class="social-icon" aria-label="LinkedIn">
            <ion-icon name="logo-linkedin"></ion-icon>
          </a>
          <a href="#" class="social-icon" aria-label="Facebook">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
          <a href="#" class="social-icon" aria-label="Twitter">
            <ion-icon name="logo-twitter"></ion-icon>
          </a>
        </div>
      </div>
      <p class="copyright">© 2025 PetShop — Your pet's favorite place 🐾</p>
    </footer>
    `;

    // On ajoute le footer à la fin du body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// Charger le footer automatiquement quand le DOM est prêt
document.addEventListener("DOMContentLoaded", loadFooter);
