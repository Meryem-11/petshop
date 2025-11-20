// Script pour gérer l'effet de scroll sur le header et le menu hamburger
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
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
    
    // Gestion du menu hamburger
    if (menuToggle && navMenu) {
        // Ajouter un gestionnaire d'événement pour le clic
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Empêcher le scroll du body quand le menu est ouvert
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu quand on clique sur un lien
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Fermer le menu lors du redimensionnement de la fenêtre
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

