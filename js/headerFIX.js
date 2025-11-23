function loadHeader() {
    // Prevent duplicate injection if the script is executed multiple times
    if (document.querySelector('header[data-injected="true"]')) {
        return;
    }
    const headerHTML = `
    <header>
 
        <div class="logo">
            <img src="../images/logo.png" alt="Logo PetShop">
            <h1>PetShop</h1>
        </div>
        <button class="nav-toggle" id="nav-toggle" aria-label="Ouvrir le menu" aria-controls="primary-nav" aria-expanded="false">
            <span class="bar"></span><span class="bar"></span><span class="bar"></span>
        </button>
        <nav id="primary-nav" role="navigation">
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
                <li><a href="./panier.html" class="cart-icon">🛒 <span class="cart-label">Panier</span> <span class="cart-count" id="cart-count">0</span></a></li>
                <li>
                    <button id="theme-toggle" class="glow-toggle">
                        <span class="icon"></span>
                    </button>
                </li>
            </ul>
        </nav>
        <div class="nav-overlay" id="nav-overlay" aria-hidden="true"></div>
    </header>
    `;

    // On ajoute le header au début du body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    // Mark as injected to avoid duplicates
    const injectedHeader = document.querySelector('header');
    if (injectedHeader) injectedHeader.setAttribute('data-injected', 'true');

    // Auth helpers + UI (cookie-based)
    (function setupAuth() {
      function setCookie(name, value, days) {
        let attrs = 'path=/; samesite=Lax';
        if (days && days > 0) attrs += '; max-age=' + (days * 86400);
        document.cookie = name + '=' + encodeURIComponent(value) + '; ' + attrs;
      }
      function getCookie(name) {
        const cookies = document.cookie ? document.cookie.split('; ') : [];
        for (const c of cookies) {
          const [k, v] = c.split('=');
          if (k === name) return decodeURIComponent(v || '');
        }
        return '';
      }
      function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=0; path=/; samesite=Lax';
      }
      function getAuthUser() {
        const raw = getCookie('petshop_auth');
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
      }
      function updateAuthUI() {
        const nav = document.getElementById('primary-nav');
        if (!nav) return;
        const ul = nav.querySelector('ul');
        const loginLi = nav.querySelector('.btn-login') ? nav.querySelector('.btn-login').closest('li') : null;
        const loginLink = nav.querySelector('a.btn-login');
        let greetLi = nav.querySelector('#user-greeting');
        const user = getAuthUser();

        if (user) {
          if (!greetLi && ul) {
            greetLi = document.createElement('li');
            greetLi.id = 'user-greeting';
            greetLi.style.color = '#fff';
            greetLi.textContent = 'Bonjour, ' + (user.name || user.fullname || user.email);
            ul.insertBefore(greetLi, loginLi || ul.firstChild);
          } else if (greetLi) {
            greetLi.textContent = 'Bonjour, ' + (user.name || user.fullname || user.email);
          }
          if (loginLink) {
            loginLink.textContent = 'Déconnexion';
            loginLink.href = '#';
            loginLink.classList.add('btn-login'); // ensure class exists
            loginLink.addEventListener('click', function onLogout(e) {
              e.preventDefault();
              deleteCookie('petshop_auth');
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userEmail');
              updateAuthUI();
              if (window.showToast) window.showToast('Déconnecté', 'success');
            }, { once: true });
          }
        } else {
          if (greetLi && greetLi.parentElement) greetLi.parentElement.removeChild(greetLi);
          if (loginLink) {
            loginLink.textContent = 'Connexion';
            loginLink.setAttribute('href', './login.html');
          }
        }
      }

      window.Auth = {
        setAuth(user, days) {
          const payload = { email: user.email, name: user.fullname || user.name || '' };
          setCookie('petshop_auth', JSON.stringify(payload), days || 7);
          updateAuthUI();
        },
        clear() { deleteCookie('petshop_auth'); updateAuthUI(); },
        current() { return getAuthUser(); },
        setCookie, getCookie, deleteCookie
      };
      window.updateAuthUI = updateAuthUI;
      updateAuthUI();
    })();

    // UI containers: toasts + mini-cart drawer + overlay (guard against duplication)
    if (!document.getElementById('toast-container') &&
        !document.getElementById('cart-overlay') &&
        !document.getElementById('mini-cart')) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="toast-container" id="toast-container"></div>
        <div class="cart-overlay" id="cart-overlay"></div>
        <aside class="mini-cart" id="mini-cart" aria-label="Panier">
          <header>
            <h3>Votre panier</h3>
            <button class="close-cart" aria-label="Fermer le panier">&times;</button>
          </header>
          <div class="mini-cart-content">
            <div class="mini-cart-empty">Votre panier est vide</div>
            <ul class="mini-cart-list" id="mini-cart-list"></ul>
          </div>
          <div class="mini-cart-footer">
            <div class="row">
              <span>Sous-total</span>
              <span class="subtotal" id="mini-cart-subtotal">0 DH</span>
            </div>
            <a href="./panier.html" class="btn-secondary" style="display:block; text-align:center; margin-bottom:8px;">Voir le panier</a>
            <button class="checkout-btn" type="button">Procéder au paiement</button>
          </div>
        </aside>
        <div class="quickview-overlay" id="quickview-overlay"></div>
        <div class="quickview" id="quickview" role="dialog" aria-modal="true" aria-hidden="true">
          <div class="qv-dialog">
            <button class="qv-close" aria-label="Fermer">×</button>
            <div class="qv-body">
              <div class="qv-media">
                <img class="qv-image" src="" alt="" loading="lazy" decoding="async">
              </div>
              <div class="qv-info">
                <h3 class="qv-title"></h3>
                <div class="qv-price"></div>
                <p class="qv-desc"></p>
                <button class="qv-add btn-secondary" type="button">Ajouter au panier</button>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    // Responsive nav toggle
    const headerEl = document.querySelector('header');
    const navToggle = document.getElementById('nav-toggle');
    const primaryNav = document.getElementById('primary-nav');
    const navOverlay = document.getElementById('nav-overlay');

    if (headerEl && navToggle && primaryNav) {
        function setMenuOpen(open) {
            headerEl.classList.toggle('menu-open', open);
            navToggle.setAttribute('aria-expanded', String(open));
            document.body.classList.toggle('no-scroll', open);
            if (navOverlay) {
                navOverlay.classList.toggle('open', open);
                // Keep overlay purely visual; allow click-through to underlying elements
                navOverlay.style.pointerEvents = 'none';
            }
        }

        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            setMenuOpen(!isOpen);
        });

        // Close on link click
        primaryNav.addEventListener('click', (e) => {
            const target = e.target;
            if (target && target.tagName === 'A') setMenuOpen(false);
        });

        // Close on overlay click
        if (navOverlay) {
            navOverlay.addEventListener('click', (e) => {
                // Close menu and forward the click to the underlying target (one-tap behavior)
                const overlayEl = navOverlay;
                let below = null;
                if (overlayEl) {
                    // Temporarily disable pointer events to detect element under the overlay
                    overlayEl.style.pointerEvents = 'none';
                    below = document.elementFromPoint(e.clientX, e.clientY);
                    overlayEl.style.pointerEvents = 'none'; // keep overlay non-blocking
                }
                setMenuOpen(false);
                // If underlying element is an add-to-cart button, trigger it
                const btn = below && below.closest('.dog-btn, .cat-btn, .bird-btn, .fish-btn, .rodent-btn, .btn-secondary, .add-to-cart');
                if (btn && typeof btn.click === 'function') {
                    setTimeout(() => btn.click(), 0);
                }
            });
        }

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!headerEl.contains(e.target)) setMenuOpen(false);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        });

        // Reset on resize up
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 992) setMenuOpen(false);
        });
    }

    // Mini-cart + toast system
    (function setupCartAndToasts() {
      const toastContainer = document.getElementById('toast-container');
      const cartOverlayEl = document.getElementById('cart-overlay');
      const miniCartEl = document.getElementById('mini-cart');

      function showToast(message, type = 'success') {
        if (!toastContainer) return;
        const el = document.createElement('div');
        el.className = 'toast' + (type ? ' ' + type : '');
        el.textContent = message;
        toastContainer.appendChild(el);
        setTimeout(() => {
          el.style.animation = 'toastOut 0.3s ease forwards';
          el.addEventListener('animationend', () => el.remove());
        }, 3000);
      }

      function getCart() {
        try { return JSON.parse(localStorage.getItem('cart')) || []; }
        catch { return []; }
      }
      function setCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

      function updateCartCount() {
        const span = document.getElementById('cart-count');
        if (span) span.textContent = getCart().length;
      }

      function groupCart(items) {
        const map = new Map();
        items.forEach(it => {
          const key = it && (it.name || it.image) || '';
          const k = key || Math.random().toString(36);
          if (!map.has(k)) map.set(k, { name: it.name || 'Article', image: it.image || '', price: parseFloat(it.price) || 0, qty: 0 });
          map.get(k).qty += 1;
        });
        return Array.from(map.values());
      }

      function openMiniCart() {
        if (!miniCartEl || !cartOverlayEl) return;
        renderMiniCart();
        miniCartEl.classList.add('open');
        cartOverlayEl.classList.add('open');
        document.body.classList.add('no-scroll');
      }
      function closeMiniCart() {
        if (!miniCartEl || !cartOverlayEl) return;
        miniCartEl.classList.remove('open');
        cartOverlayEl.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }

      function renderMiniCart() {
        if (!miniCartEl) return;
        const list = miniCartEl.querySelector('#mini-cart-list');
        const empty = miniCartEl.querySelector('.mini-cart-empty');
        const subtotalEl = miniCartEl.querySelector('#mini-cart-subtotal');

        const flat = getCart();
        const groups = groupCart(flat);

        list.innerHTML = '';
        if (!groups.length) {
          if (empty) empty.style.display = 'block';
          if (subtotalEl) subtotalEl.textContent = '0 DH';
          return;
        }
        if (empty) empty.style.display = 'none';

        let subtotal = 0;
        groups.forEach(g => {
          subtotal += (g.price || 0) * g.qty;
          const li = document.createElement('li');
          li.className = 'mini-cart-item';
          li.innerHTML = `
            <img src="${g.image || ''}" alt="${g.name || ''}">
            <div>
              <div class="title">${g.name || ''}</div>
              <div class="price">${(g.price || 0)} DH &times; ${g.qty}</div>
            </div>
            <div class="controls">
              <button class="qty-btn" data-action="dec" aria-label="Diminuer">-</button>
              <button class="qty-btn" data-action="inc" aria-label="Augmenter">+</button>
              <button class="remove-btn-secondary" data-action="remove">Supprimer</button>
            </div>
          `;
          const controls = li.querySelector('.controls');
          controls.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const act = btn.getAttribute('data-action');
            if (act === 'inc') {
              const cart = getCart();
              cart.push({ name: g.name, price: g.price, image: g.image });
              setCart(cart);
            } else if (act === 'dec') {
              const cart = getCart();
              const idx = cart.findIndex(it => it.name === g.name);
              if (idx > -1) {
                cart.splice(idx, 1);
                setCart(cart);
              }
            } else if (act === 'remove') {
              const cart = getCart().filter(it => it.name !== g.name);
              setCart(cart);
            }
            updateCartCount();
            renderMiniCart();
          });
          list.appendChild(li);
        });
        if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} DH`;
      }

      // Cart link behavior: ALWAYS open mini-cart first (prevent navigation)
      const cartLink = document.querySelector('a.cart-icon');
      if (cartLink) {
        cartLink.addEventListener('click', (e) => {
          e.preventDefault();
          openMiniCart();
        });
      }

      // Close handlers
      if (cartOverlayEl) cartOverlayEl.addEventListener('click', closeMiniCart);
      const closeBtn = miniCartEl ? miniCartEl.querySelector('.close-cart') : null;
      if (closeBtn) closeBtn.addEventListener('click', closeMiniCart);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMiniCart(); });

      // Expose helpers globally for other scripts (card.js)
      window.showToast = showToast;
      window.openMiniCart = openMiniCart;
      window.refreshMiniCart = renderMiniCart;
      window.updateCartCount = updateCartCount;

      // Initial paint
      updateCartCount();
    })();

    // Quick View (product details popup)
    (function setupQuickView() {
      const overlay = document.getElementById('quickview-overlay');
      let quickView = document.getElementById('quickview');

      function ensureQuickView() {
        quickView = document.getElementById('quickview');
        return !!quickView;
      }
      function parsePriceFromText(text) {
        const m = (text || '').match(/([\d,.]+)/);
        return m ? parseFloat(m[1].replace(',', '.')) : 0;
      }
      function getProductFromCard(card) {
        if (!card) return null;
        const name = card.getAttribute('data-name') || card.querySelector('h3')?.textContent?.trim() || 'Produit';
        const priceAttr = card.getAttribute('data-price');
        let price = priceAttr != null ? parseFloat(priceAttr) : NaN;
        if (isNaN(price)) {
          price = parsePriceFromText(card.querySelector('.price')?.textContent || '');
        }
        const img = card.querySelector('img');
        const image = img ? img.src : '';
        const descEl = Array.from(card.querySelectorAll('p')).find(p => !p.classList.contains('price'));
        const description = descEl ? descEl.textContent.trim() : '';
        return { name, price: price || 0, image, description };
      }

      let lastFocus = null;
      function openQuickView(product) {
        if (!ensureQuickView()) return;
        if (overlay) overlay.classList.add('open');
        quickView.classList.add('open');
        quickView.setAttribute('aria-hidden', 'false');

        quickView.querySelector('.qv-title').textContent = product.name;
        quickView.querySelector('.qv-price').textContent = product.price.toFixed(2) + ' DH';
        quickView.querySelector('.qv-desc').textContent = product.description || '';
        const imgEl = quickView.querySelector('.qv-image');
        imgEl.src = product.image || '';
        imgEl.alt = product.name || '';

        lastFocus = document.activeElement;
        quickView.querySelector('.qv-close')?.focus();

        const addBtn = quickView.querySelector('.qv-add');
        addBtn.onclick = () => {
          const cart = (() => { try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }})();
          cart.push({ name: product.name, price: product.price, image: product.image });
          localStorage.setItem('cart', JSON.stringify(cart));
          if (window.updateCartCount) window.updateCartCount();
          if (window.refreshMiniCart) window.refreshMiniCart();
          if (window.showToast) window.showToast(product.name + ' a été ajouté au panier !', 'success');
        };
      }
      function closeQuickView() {
        if (!ensureQuickView()) return;
        quickView.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        quickView.setAttribute('aria-hidden', 'true');
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
      }

      const CLICK_SELECTORS = [
        '.product-card img', '.product-card h3',
        '.dog-card img', '.dog-card h3',
        '.cat-card img', '.cat-card h3',
        '.bird-card img', '.bird-card h3',
        '.fish-card img', '.fish-card h3',
        '.rodent-card img', '.rodent-card h3'
      ];
      document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.dog-btn, .cat-btn, .bird-btn, .fish-btn, .rodent-btn, .btn-secondary');
        if (addBtn) return;
        const trigger = e.target.closest(CLICK_SELECTORS.join(','));
        if (!trigger) return;
        const card = trigger.closest('.product-card, .dog-card, .cat-card, .bird-card, .fish-card, .rodent-card');
        const product = getProductFromCard(card);
        if (product) openQuickView(product);
      });
      if (overlay) overlay.addEventListener('click', closeQuickView);
      document.addEventListener('click', (e) => {
        if (e.target && e.target.matches('.qv-close')) closeQuickView();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeQuickView();
      });

      window.__openQuickView = openQuickView;
      window.__closeQuickView = closeQuickView;
    })();

    // Scroll-reveal animations across pages (respects reduced motion)
    (function setupRevealAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const selectors = [
            '.banner-content',
            '.category-card',
            '.product-card',
            '.dog-card',
            '.cat-card',
            '.bird-card',
            '.fish-card',
            '.rodent-card',
            '.feature-card',
            '.testimonial-card',
            '.stat-card',
            '.promo-banner',
            '.about-card',
            '.contact-form',
            '.contact-info .info-card'
        ];

        const elements = document.querySelectorAll(selectors.join(','));
        elements.forEach((el, i) => {
            el.classList.add('reveal');
            if (i % 3 === 1) el.classList.add('reveal-right');
            if (i % 3 === 2) el.classList.add('reveal-scale');
        });

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            elements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

        elements.forEach(el => observer.observe(el));
    })();
}

// Charger le header automatiquement quand le DOM est prêt
document.addEventListener("DOMContentLoaded", loadHeader);
