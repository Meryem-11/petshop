// Validation du formulaire de connexion
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.querySelector('input[name="remember"]');

    // Fonction pour valider l'email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Fonction pour afficher un message d'erreur
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorMessage = formGroup.querySelector('.error-message');
        
        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
        input.classList.add('error');
    }

    // Fonction pour supprimer le message d'erreur
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.classList.remove('error');
    }

    // Fonction pour afficher un message de succès
    function showSuccess(message) {
        const loginContainer = document.querySelector('.login-container');
        let successMessage = document.querySelector('.success-message');
        
        if (!successMessage) {
            successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            loginContainer.insertBefore(successMessage, loginForm);
        }
        
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        
        // Masquer le message après 3 secondes
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }

    // Validation en temps réel pour l'email
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        
        if (email === '') {
            showError(emailInput, 'L\'adresse e-mail est requise');
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Veuillez entrer une adresse e-mail valide');
        } else {
            removeError(emailInput);
        }
    });

    // Validation en temps réel pour le mot de passe
    passwordInput.addEventListener('blur', function() {
        const password = passwordInput.value;
        
        if (password === '') {
            showError(passwordInput, 'Le mot de passe est requis');
        } else if (password.length < 6) {
            showError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères');
        } else {
            removeError(passwordInput);
        }
    });

    // Supprimer les erreurs lors de la saisie
    emailInput.addEventListener('input', function() {
        if (emailInput.classList.contains('error')) {
            const email = emailInput.value.trim();
            if (email !== '' && validateEmail(email)) {
                removeError(emailInput);
            }
        }
    });

    passwordInput.addEventListener('input', function() {
        if (passwordInput.classList.contains('error')) {
            const password = passwordInput.value;
            if (password !== '' && password.length >= 6) {
                removeError(passwordInput);
            }
        }
    });

    // Gestion de la soumission du formulaire
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const remember = rememberCheckbox.checked;
        
        // Réinitialiser les erreurs
        removeError(emailInput);
        removeError(passwordInput);
        
        // Validation
        let isValid = true;
        
        // Valider l'email
        if (email === '') {
            showError(emailInput, 'L\'adresse e-mail est requise');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Veuillez entrer une adresse e-mail valide');
            isValid = false;
        }
        
        // Valider le mot de passe
        if (password === '') {
            showError(passwordInput, 'Le mot de passe est requis');
            isValid = false;
        } else if (password.length < 6) {
            showError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères');
            isValid = false;
        }
        
        // Si le formulaire est valide
        if (isValid) {
            // Désactiver le bouton de soumission
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Connexion en cours...';
            
            // Simuler une connexion (dans un vrai projet, cela ferait une requête au serveur)
            console.log('Tentative de connexion avec:', { email, remember });
            
            // Simuler un délai de connexion
            setTimeout(() => {
                // Sauvegarder les informations si "Se souvenir de moi" est coché
                if (remember) {
                    localStorage.setItem('rememberedEmail', email);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
                
                // Sauvegarder l'état de connexion
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Afficher un message de succès
                showSuccess('Connexion réussie ! Redirection...');
                
                // Réactiver le bouton
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                
                // Simuler une redirection (dans un vrai projet, rediriger vers la page d'accueil ou dashboard)
                setTimeout(() => {
                    window.location.href = './index.html';
                }, 1500);
            }, 1000);
        }
    });

    // Charger l'email sauvegardé si "Se souvenir de moi" était coché
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;
    }
});

