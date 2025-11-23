document.addEventListener('DOMContentLoaded', function () {
  // 1) Lazy-load all product images (cards across categories)
  const cardImgSel = '.product-card img, .dog-card img, .cat-card img, .bird-card img, .fish-card img, .rodent-card img';
  document.querySelectorAll(cardImgSel).forEach(img => {
    try {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    } catch (_) {}
  });

  // 2) Active nav highlight (works with injected header)
  (function setActiveNav() {
    const trySet = () => {
      const links = document.querySelectorAll('nav a[href]');
      if (!links.length) {
        requestAnimationFrame(trySet);
        return;
      }
      const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      links.forEach(a => {
        const href = (a.getAttribute('href') || '').toLowerCase();
        // Match by file name, supports ./chiens.html, chiens.html, etc.
        if (href.endsWith(path)) a.classList.add('active');
      });
    };
    trySet();
  })();

  // 3) PLP toolbar handlers (search, price range, sort, clear)
  const toolbar = document.querySelector('.plp-toolbar');
  if (!toolbar) {
    // Nothing to do if toolbar is not present on this page
    return;
  }

  const inputQ = document.getElementById('plp-q');
  const inputMin = document.getElementById('plp-min');
  const inputMax = document.getElementById('plp-max');
  const selectSort = document.getElementById('plp-sort');
  const btnClear = document.getElementById('plp-clear');

  // Card selectors per grid type on page
  const GRID_SELECTORS = ['.product-grid', '.dog-grid', '.cat-grid', '.bird-grid', '.fish-grid', '.rodent-grid'];
  const CARD_SELECTORS = '.product-card, .dog-card, .cat-card, .bird-card, .fish-card, .rodent-card';

  function getCardName(card) {
    return (card.getAttribute('data-name') || card.querySelector('h3')?.textContent || '').trim();
  }
  function getCardPrice(card) {
    const raw = card.getAttribute('data-price');
    const val = raw != null ? parseFloat(raw) : NaN;
    if (!isNaN(val)) return val;
    // Fallback: try reading from text "Prix : 129 DH"
    const p = card.querySelector('.price')?.textContent || '';
    const m = p.match(/([\d,.]+)/);
    return m ? parseFloat(m[1].replace(',', '.')) : 0;
  }

  function applyFiltersAndSort() {
    const q = (inputQ?.value || '').trim().toLowerCase();
    const min = inputMin?.value ? parseFloat(inputMin.value) : Number.NEGATIVE_INFINITY;
    const max = inputMax?.value ? parseFloat(inputMax.value) : Number.POSITIVE_INFINITY;
    const sort = selectSort?.value || 'relevance';

    // Filter visibility for all cards
    const allCards = Array.from(document.querySelectorAll(CARD_SELECTORS));
    allCards.forEach(card => {
      const name = getCardName(card).toLowerCase();
      const price = getCardPrice(card);
      const matchesQ = !q || name.includes(q);
      const matchesMin = price >= min;
      const matchesMax = price <= max;
      card.style.display = (matchesQ && matchesMin && matchesMax) ? '' : 'none';
    });

    // Sort each grid independently (keeps sections intact)
    GRID_SELECTORS.forEach(gridSel => {
      const grid = document.querySelector(gridSel);
      if (!grid) return;
      const cards = Array.from(grid.querySelectorAll(CARD_SELECTORS)).filter(c => c.style.display !== 'none');
      if (!cards.length) return;

      const cmp = (a, b) => {
        if (sort === 'price-asc') return getCardPrice(a) - getCardPrice(b);
        if (sort === 'price-desc') return getCardPrice(b) - getCardPrice(a);
        if (sort === 'name-asc') return getCardName(a).localeCompare(getCardName(b), undefined, { sensitivity: 'base' });
        return 0; // relevance (no change)
      };
      if (sort !== 'relevance') {
        cards.sort(cmp).forEach(c => grid.appendChild(c));
      }
    });
  }

  function clearAll() {
    if (inputQ) inputQ.value = '';
    if (inputMin) inputMin.value = '';
    if (inputMax) inputMax.value = '';
    if (selectSort) selectSort.value = 'relevance';
    applyFiltersAndSort();
  }

  // Wire events
  if (inputQ) inputQ.addEventListener('input', applyFiltersAndSort);
  if (inputMin) inputMin.addEventListener('input', applyFiltersAndSort);
  if (inputMax) inputMax.addEventListener('input', applyFiltersAndSort);
  if (selectSort) selectSort.addEventListener('change', applyFiltersAndSort);
  if (btnClear) btnClear.addEventListener('click', clearAll);

  // Initial apply
  applyFiltersAndSort();
});
