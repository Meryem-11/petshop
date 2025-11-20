// Header behavior: sticky shadow on scroll, accessible hamburger menu, overlay, lazy images, cart count
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // Ensure ARIA defaults for accessibility
  const initAria = () => {
    if (menuToggle) {
      if (!menuToggle.hasAttribute('aria-controls')) {
        menuToggle.setAttribute('aria-controls', 'nav-menu');
      }
      menuToggle.setAttribute('aria-expanded', 'false');
    }
    if (navMenu) {
      navMenu.setAttribute('role', 'navigation');
      if (!navMenu.hasAttribute('aria-label')) {
        navMenu.setAttribute('aria-label', 'Navigation principale');
      }
      navMenu.setAttribute('aria-hidden', 'true');
    }
  };
  initAria();

  // Create overlay if not present
  const overlay = (() => {
    let o = document.getElementById('nav-overlay');
    if (!o) {
      o = document.createElement('div');
      o.id = 'nav-overlay';
      o.className = 'nav-overlay';
      document.body.appendChild(o);
    }
    return o;
  })();

  const lockBody = () => {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  };
  const unlockBody = () => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };

  const openMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    navMenu.setAttribute('aria-hidden', 'false');
    lockBody();
    const firstLink = navMenu.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
    if (firstLink) firstLink.focus();
  };

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('aria-hidden', 'true');
    unlockBody();
  };

  // Hamburger interactions
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on link click
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
      const isClickInsideMenu = navMenu.contains(event.target);
      const isClickOnToggle = menuToggle.contains(event.target);
      if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeMenu);

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Reset on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // Progressive enhancement: lazy-load non-critical images and async decode
  try {
    document.querySelectorAll('img:not([loading])').forEach((img) => {
      // Avoid lazy-loading critical header/nav images
      if (!img.closest('header') && !img.closest('nav')) {
        img.setAttribute('loading', 'lazy');
      }
      img.setAttribute('decoding', 'async');
    });
  } catch (_) {
    // no-op
  }

  // Shared cart count update (replaces inline scripts)
  try {
    const cartCountSpan = document.getElementById('cart-count');
    if (cartCountSpan) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cartCountSpan.textContent = String(cart.length);
    }
  } catch (_) {
    // no-op
  }
});
