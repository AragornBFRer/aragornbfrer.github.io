(() => {
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

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

    const tucks = [...document.querySelectorAll(".tuck")];
    const prints = tucks.map((tuck) => tuck.querySelector(".print"));

    // Hover draws prints out for a mouse; on touch a tap toggles one print and a tap elsewhere puts it back.
    addEventListener("pointerup", (event) => {
        if (event.pointerType === "mouse") return;
        const tapped = event.target.closest(".print");
        for (const print of prints) {
            print.classList.toggle("is-open", print === tapped && !print.classList.contains("is-open"));
        }
    });

    let centers = [];
    let frame = 0;

    // Prints trail the page by a few pixels, as if lying one layer beneath it.
    function drift() {
        frame = 0;
        const middle = window.scrollY + window.innerHeight / 2;
        tucks.forEach((tuck, i) => {
            const offset = reduceMotion.matches ? 0 : Math.max(-8, Math.min(8, (middle - centers[i]) * 0.016));
            tuck.style.transform = offset ? `translate3d(0, ${offset.toFixed(2)}px, 0)` : "";
        });
        root.classList.toggle("scrolled", window.scrollY > 40);
    }

    const schedule = () => {
        if (!frame) frame = requestAnimationFrame(drift);
    };

    function measure() {
        centers = tucks.map((tuck) => tuck.offsetTop + tuck.offsetHeight / 2);
        schedule();
    }

    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", measure);
    new ResizeObserver(measure).observe(document.body);
    reduceMotion.addEventListener("change", schedule);
    measure();
})();
