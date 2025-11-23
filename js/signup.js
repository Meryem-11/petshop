document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('signupForm');
  if (!form) return;

  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmInput = document.getElementById('confirmPassword');
  const termsCheckbox = form.querySelector('input[name="terms"]');

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(input, message) {
    const group = input.closest('.form-group') || input.parentElement;
    let span = group.querySelector('.error-message');
    if (!span) {
      span = document.createElement('span');
      span.className = 'error-message';
      group.appendChild(span);
    }
    span.textContent = message;
    input.classList.add('error');
  }
  function clearError(input) {
    const group = input.closest('.form-group') || input.parentElement;
    const span = group.querySelector('.error-message');
    if (span) span.remove();
    input.classList.remove('error');
  }
  function showSuccess(message) {
    const container = document.querySelector('.signup-container') || document.body;
    let box = container.querySelector('.success-message');
    if (!box) {
      box = document.createElement('div');
      box.className = 'success-message';
      container.insertBefore(box, form);
    }
    box.textContent = message;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 3000);
  }

  // Validation live
  [emailInput, passwordInput, confirmInput, fullnameInput].forEach(inp => {
    inp.addEventListener('input', () => { if (inp.classList.contains('error')) clearError(inp); });
  });

  // Cookies helpers
  function setCookie(name, value, days) {
    const expires = days ? `; max-age=${days * 24 * 60 * 60}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  }
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const terms = termsCheckbox && termsCheckbox.checked;

    [fullnameInput, emailInput, passwordInput, confirmInput].forEach(clearError);

    let ok = true;
    if (!fullname) { showError(fullnameInput, 'Le nom complet est requis'); ok = false; }
    if (!email) { showError(emailInput, "L'adresse e-mail est requise"); ok = false; }
    else if (!validateEmail(email)) { showError(emailInput, "Veuillez entrer une adresse e-mail valide"); ok = false; }
    if (!password) { showError(passwordInput, 'Le mot de passe est requis'); ok = false; }
    else if (password.length < 6) { showError(passwordInput, 'Au moins 6 caractères'); ok = false; }
    if (confirm !== password) { showError(confirmInput, 'Les mots de passe ne correspondent pas'); ok = false; }
    if (!terms) { 
      const lbl = (termsCheckbox && termsCheckbox.closest('.form-options')) || form;
      let warn = lbl.querySelector('.error-message');
      if (!warn) {
        warn = document.createElement('span');
        warn.className = 'error-message';
        lbl.appendChild(warn);
      }
      warn.textContent = "Veuillez accepter les conditions générales";
      ok = false; 
    }

    if (!ok) return;

    // Check if user exists
    if (getCookie(`user_${email}`)) {
      showError(emailInput, 'Un compte existe déjà avec cet e-mail');
      return;
    }

    // Store user in cookie for 30 days
    const userData = JSON.stringify({ fullname, email, password });
    setCookie(`user_${email}`, userData, 30);

    showSuccess('Compte créé avec succès ! Redirection...');
    setTimeout(() => { window.location.href = './login.html'; }, 1200);
  });
});
