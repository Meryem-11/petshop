
// Script pour gérer l'effet de scroll sur le header
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    // Fonction pour gérer le scroll
    function handleScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Écouter l'événement de scroll
    window.addEventListener('scroll', handleScroll);
    
    // Vérifier l'état initial au chargement
    handleScroll();
});

