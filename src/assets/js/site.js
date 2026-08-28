(() => {
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
