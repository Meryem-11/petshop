document.addEventListener("DOMContentLoaded", function () {

    // On attend que le header soit injecté par loadHeader()
    function initThemeToggle() {
        const toggle = document.getElementById("theme-toggle");
        const body = document.body;

        if (!toggle) {
            // Le header n’est pas encore chargé → on réessaie dans 50ms
            setTimeout(initThemeToggle, 50);
            return;
        }

        // ---- L'icône ----
        function updateIcon() {
            const icon = toggle.querySelector(".icon");

            if (!icon) return;

            if (body.classList.contains("dark-mode")) {
                icon.innerHTML = "🌙";
            } else {
                icon.innerHTML = "☀️";
            }
        }

        // ---- Charger le thème sauvegardé ----
        if (localStorage.getItem("theme") === "dark") {
            body.classList.add("dark-mode");
        }

        updateIcon();

        // ---- Clic bouton ----
        toggle.addEventListener("click", () => {
            body.classList.toggle("dark-mode");

            if (body.classList.contains("dark-mode")) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }

            updateIcon();
        });

        console.log("Bouton thème sombre OK ✔");
    }

    initThemeToggle(); // on lance
});
