(() => {
  const wraps = document.querySelectorAll("[data-counters]");
  if (!wraps.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animate(el) {
    const end = parseFloat(el.dataset.counterEnd) || 0;
    const decimals = (el.dataset.counterEnd.split(".")[1] || "").length;
    if (reduceMotion) {
      el.textContent = end.toFixed(decimals);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (eased * end).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!("IntersectionObserver" in window)) {
    wraps.forEach((wrap) => wrap.querySelectorAll("[data-counter]").forEach(animate));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll("[data-counter]").forEach(animate);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  wraps.forEach((wrap) => observer.observe(wrap));
})();
