function loadHeader() {
    const headerHTML = `
    <header>
        <div class="logo">
            <img src="../images/logo.png" alt="Logo PetShop">
            <h1>PetShop</h1>
        </div>
        <nav>
            <ul>
                <li><a href="./index.html">Accueil</a></li>
                <li><a href="./chiens.html">Chiens</a></li>
                <li><a href="./chats.html">Chats</a></li>
                <li><a href="./oiseaux.html">Oiseaux</a></li>
                <li><a href="./poissons.html">Poissons</a></li>
                <li><a href="./rongeurs.html">Rongeurs</a></li>
                <li><a href="./apropos.html">À propos</a></li>
                <li><a href="./contact.html">Contact</a></li>
                <li><a href="./login.html" class="btn-login">Connexion</a></li>
                <li><a href="./panier.html" class="cart-icon">🛒 Panier (<span id="cart-count">0</span>)</a></li>
                <li>
                    <button id="theme-toggle" class="glow-toggle">
                        <span class="icon"></span>
                    </button>
                </li>
            </ul>
        </nav>
    </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
}

// Charger le header immédiatement
loadHeader();
