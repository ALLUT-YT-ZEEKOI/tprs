(() => {
  /* ---------- site search ---------- */
  const searchToggle = document.querySelector("[data-search-toggle]");
  const searchPanel = document.querySelector("[data-site-search]");
  const searchInput = searchPanel?.querySelector("input");
  const closeSearch = () => {
    if (!searchPanel || !searchToggle) return;
    searchPanel.hidden = true;
    searchToggle.setAttribute("aria-expanded", "false");
  };
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", () => {
      searchPanel.hidden = false;
      searchToggle.setAttribute("aria-expanded", "true");
      searchInput?.focus();
    });
    searchPanel.querySelectorAll("[data-search-close]").forEach((button) => {
      button.addEventListener("click", closeSearch);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !searchPanel.hidden) {
        closeSearch();
        searchToggle.focus();
      }
    });
  }

  /* ---------- JS-assembled email links (no plaintext address in markup) ---------- */
  document.querySelectorAll("[data-email-link]").forEach((el) => {
    const user = el.dataset.emailUser || window.__TPRS_SITE__?.emailUser;
    const domain = el.dataset.emailDomain || window.__TPRS_SITE__?.emailDomain;
    if (user && domain) {
      el.href = `mailto:${user}@${domain}`;
    }
  });

  /* ---------- scroll-to-top floating button ---------- */
  const topBtn = document.querySelector("[data-scroll-top]");
  if (topBtn) {
    const toggle = () => {
      topBtn.hidden = window.scrollY < 400;
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }
})();
