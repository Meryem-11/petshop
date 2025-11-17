// Animation des statistiques
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Fonction pour animer un nombre
    function animateNumber(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const currentText = element.textContent;
        // Extraire la valeur numérique de départ
        let start = 0;
        if (currentText.includes('/')) {
            // Pour "24/24", on part de 0
            start = 0;
        } else {
            start = parseFloat(currentText.replace(/[^0-9.]/g, '')) || 0;
        }
        
        const duration = 2000; // 2 secondes
        const range = target - start;
        const increment = range / (duration / 16); // 60 FPS
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            
            // Formater le nombre selon le type
            if (target === 24) {
                // Pour la livraison, afficher "24/24"
                element.textContent = Math.floor(current) + '/24';
            } else if (target % 1 === 0) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = current.toFixed(1);
            }
        }, 16);
    }
    
    // Observer pour déclencher l'animation quand la section est visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const currentValue = stat.textContent;
                    // Vérifier si c'est une valeur de départ (pas encore animée)
                    if (currentValue && !currentValue.includes('+') && !currentValue.includes('/')) {
                        const target = parseFloat(stat.getAttribute('data-target'));
                        const current = parseFloat(currentValue.replace(/[^0-9.]/g, ''));
                        // Animer seulement si la valeur actuelle est inférieure à la cible
                        if (current < target) {
                            animateNumber(stat);
                        }
                    }
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Animation au scroll pour les cartes
    const cards = document.querySelectorAll('.feature-card, .testimonial-card, .product-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        cardObserver.observe(card);
    });
});

