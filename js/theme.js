document.addEventListener("DOMContentLoaded", function () {

    const toggle = document.getElementById("theme-toggle");
    const body = document.body;

    if (!toggle) {
        console.error("Le bouton #theme-toggle est introuvable !");
        return;
    }

    // Fonction pour mettre à jour l'icône
    function updateIcon() {
        const icon = toggle.querySelector(".icon");

        if (!icon) {
            console.error("L'élément .icon est introuvable dans le bouton !");
            return;
        }

        if (body.classList.contains("dark-mode")) {
            icon.innerHTML = "🌙"; // Icône pour mode sombre
        } else {
            icon.innerHTML = "☀️"; // Icône mode clair
        }
    }

    // Charger le thème sauvegardé
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark-mode");
    }

    updateIcon(); // Mise à jour initiale

    // Gestion du clic
    toggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }

        updateIcon();
    });

});
