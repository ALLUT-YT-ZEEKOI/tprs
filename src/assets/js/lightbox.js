/*
 * Progressive-enhancement lightbox for project galleries.
 * Markup (already real, working links without this script):
 *   <div class="project-gallery" data-lightbox>
 *     <a href="/path/to/full.jpg" data-lightbox-item data-lightbox-index="0">
 *       <img src="..." alt="..." />
 *     </a>
 *     ...
 *   </div>
 *
 * Without JS the anchors simply navigate to the full-size image. With JS,
 * clicking an anchor opens a focus-trapped modal overlay instead; Escape
 * closes it, Left/Right arrows move between images.
 */
(() => {
  const galleries = document.querySelectorAll("[data-lightbox]");
  if (!galleries.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  galleries.forEach((gallery) => {
    const items = Array.from(gallery.querySelectorAll("[data-lightbox-item]"));
    if (!items.length) return;

    /* Build the modal once per gallery and append to <body> so it can
       cover the full viewport regardless of the gallery's own stacking
       context. */
    const modal = document.createElement("div");
    modal.className = "lightbox";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Image viewer");
    if (reduceMotion) modal.classList.add("lightbox--no-motion");
    modal.innerHTML = `
      <div class="lightbox__overlay" data-lightbox-overlay></div>
      <div class="lightbox__dialog">
        <button type="button" class="lightbox__close" data-lightbox-close aria-label="Close image viewer">&times;</button>
        ${items.length > 1 ? '<button type="button" class="lightbox__nav lightbox__nav--prev" data-lightbox-prev aria-label="Previous image">&lsaquo;</button>' : ""}
        <img class="lightbox__image" data-lightbox-image alt="" />
        <p class="lightbox__caption" data-lightbox-caption></p>
        ${items.length > 1 ? '<button type="button" class="lightbox__nav lightbox__nav--next" data-lightbox-next aria-label="Next image">&rsaquo;</button>' : ""}
      </div>
    `;
    document.body.appendChild(modal);

    const imageEl = modal.querySelector("[data-lightbox-image]");
    const captionEl = modal.querySelector("[data-lightbox-caption]");
    const closeBtn = modal.querySelector("[data-lightbox-close]");
    const prevBtn = modal.querySelector("[data-lightbox-prev]");
    const nextBtn = modal.querySelector("[data-lightbox-next]");
    const overlay = modal.querySelector("[data-lightbox-overlay]");

    let currentIndex = 0;
    let lastFocused = null;

    function show(index) {
      currentIndex = (index + items.length) % items.length;
      const item = items[currentIndex];
      const img = item.querySelector("img");
      imageEl.src = item.getAttribute("href");
      imageEl.alt = img ? img.alt : "";
      captionEl.textContent = img ? img.alt : "";
    }

    function open(index) {
      lastFocused = document.activeElement;
      show(index);
      modal.hidden = false;
      document.body.classList.add("lightbox-open");
      requestAnimationFrame(() => modal.classList.add("is-open"));
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function close() {
      modal.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      document.removeEventListener("keydown", onKeydown);
      const finish = () => {
        modal.hidden = true;
      };
      if (reduceMotion) {
        finish();
      } else {
        modal.addEventListener("transitionend", finish, { once: true });
      }
      (lastFocused || items[currentIndex]).focus();
    }

    function trapFocus(e) {
      if (e.key !== "Tab") return;
      const focusables = modal.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function onKeydown(e) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowRight" && items.length > 1) {
        show(currentIndex + 1);
      } else if (e.key === "ArrowLeft" && items.length > 1) {
        show(currentIndex - 1);
      } else {
        trapFocus(e);
      }
    }

    items.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        open(index);
      });
    });

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);
    prevBtn?.addEventListener("click", () => show(currentIndex - 1));
    nextBtn?.addEventListener("click", () => show(currentIndex + 1));
  });
})();
