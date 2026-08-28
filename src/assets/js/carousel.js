(() => {
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const prevBtn = carousel.parentElement.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.parentElement.querySelector("[data-carousel-next]");
    if (!track) return;

    function scrollByCard(dir) {
      const card = track.querySelector("li");
      const gap = 24;
      const amount = card ? card.offsetWidth + gap : 300;
      track.scrollBy({
        left: dir * amount,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }

    prevBtn?.addEventListener("click", () => scrollByCard(-1));
    nextBtn?.addEventListener("click", () => scrollByCard(1));

    function updateNavState() {
      if (!prevBtn || !nextBtn) return;
      const max = track.scrollWidth - track.clientWidth - 2;
      prevBtn.disabled = track.scrollLeft <= 0;
      nextBtn.disabled = track.scrollLeft >= max;
    }
    track.addEventListener("scroll", updateNavState, { passive: true });
    updateNavState();
  });
})();
