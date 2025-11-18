document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (!toggleBtn) {
        console.error("Le bouton theme-toggle n'existe pas !");
        return;
    }

    // Appliquer le thème sauvegardé
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        toggleBtn.textContent = '🌞';
    }

    // Changer le thème au clic
    toggleBtn.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            toggleBtn.textContent = '🌞';
            localStorage.setItem('theme', 'dark');
        } else {
            toggleBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
});
