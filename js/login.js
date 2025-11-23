document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!loginForm) return;

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function showError(input, message) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    let errorMessage = formGroup.querySelector('.error-message');
    if (!errorMessage) {
      errorMessage = document.createElement('span');
      errorMessage.className = 'error-message';
      formGroup.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
    input.classList.add('error');
  }
  function removeError(input) {
    const formGroup = input.closest('.form-group') || input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
    input.classList.remove('error');
  }
  function showSuccess(message) {
    const container = document.querySelector('.login-container') || document.body;
    let box = container.querySelector('.success-message');
    if (!box) {
      box = document.createElement('div');
      box.className = 'success-message';
      container.insertBefore(box, loginForm);
    }
    box.textContent = message;
    box.style.display = 'block';
    setTimeout(() => { box.style.display = 'none'; }, 3000);
  }

  // Cookie helpers
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
    return null;
  }
  function setCookie(name, value, days) {
    const expires = days ? `; max-age=${days * 24 * 60 * 60}` : '';
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  }

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    removeError(emailInput);
    removeError(passwordInput);

    if (!email) { showError(emailInput, "L'adresse e-mail est requise"); return; }
    if (!validateEmail(email)) { showError(emailInput, 'Veuillez entrer une adresse e-mail valide'); return; }
    if (!password) { showError(passwordInput, 'Le mot de passe est requis'); return; }

    // Retrieve user cookie
    const userCookie = getCookie(`user_${email}`);
    if (!userCookie) {
      showError(passwordInput, 'E-mail ou mot de passe incorrect');
      return;
    }

    const user = JSON.parse(userCookie);
    if (user.password !== password) {
      showError(passwordInput, 'E-mail ou mot de passe incorrect');
      return;
    }

    // Set session cookie (30 days)
    setCookie('loggedIn', 'true', 30);
    setCookie('loggedEmail', email, 30);

    showSuccess('Connexion réussie ! Redirection...');
    setTimeout(() => { window.location.href = './index.html'; }, 900);
  });
});
