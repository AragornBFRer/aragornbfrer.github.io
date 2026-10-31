(() => {
    const root = document.documentElement;

    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
        const systemDark = matchMedia("(prefers-color-scheme: dark)");
        const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

        const syncToggle = () => {
            const next = currentTheme() === "dark" ? "light" : "dark";
            toggle.dataset.next = next;
            toggle.setAttribute("aria-label", `Switch to ${next} theme`);
        };

        toggle.addEventListener("click", () => {
            root.dataset.theme = currentTheme() === "dark" ? "light" : "dark";
            try {
                localStorage.setItem("theme", root.dataset.theme);
            } catch (err) {}
            syncToggle();
        });
        systemDark.addEventListener("change", syncToggle);
        syncToggle();
        toggle.hidden = false;
    }

    const markScrolled = () => root.classList.toggle("scrolled", window.scrollY > 40);
    addEventListener("scroll", markScrolled, { passive: true });
    markScrolled();
})();
