(() => {
  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const video = hero.querySelector("[data-hero-video]");
  const posterFallback = hero.querySelector("[data-hero-poster]");
  if (!video) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmallViewport = window.matchMedia("(max-width: 767px)").matches;

  if (reduceMotion || isSmallViewport) {
    video.remove();
    posterFallback?.removeAttribute("hidden");
    return;
  }

  posterFallback?.setAttribute("hidden", "");

  /* The video src is intentionally absent from the initial HTML — with it
     present, the browser's preload scanner starts fetching this ~6MB file
     immediately on parse, competing for bandwidth with critical-path CSS/
     fonts and delaying the hero H1's paint (measured via Lighthouse as a
     large LCP "element render delay" under throttled conditions). Setting
     it here, after the page has otherwise loaded, keeps it off that path. */
  function loadAndPlay() {
    video.src = video.dataset.src;
    video.load();
    video.play().catch(() => {
      /* autoplay blocked — fall back to the poster frame already set */
      posterFallback?.removeAttribute("hidden");
      video.remove();
    });
  }

  /* This script is already `defer`, so it runs after DOM parsing —
     late enough that the preload scanner never sees a video src in the
     static HTML. Waiting further for window.load (all images etc. done)
     was an unnecessary extra delay, so we start immediately instead. */
  loadAndPlay();
})();
