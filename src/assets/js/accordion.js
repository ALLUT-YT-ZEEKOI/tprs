(() => {
  document.querySelectorAll("[data-accordion]").forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion__trigger");
    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const panel = document.getElementById(trigger.getAttribute("aria-controls"));
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isOpen));
        if (panel) panel.hidden = isOpen;
      });

      trigger.addEventListener("keydown", (e) => {
        const list = Array.from(triggers);
        const idx = list.indexOf(trigger);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          list[(idx + 1) % list.length]?.focus();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          list[(idx - 1 + list.length) % list.length]?.focus();
        } else if (e.key === "Home") {
          e.preventDefault();
          list[0]?.focus();
        } else if (e.key === "End") {
          e.preventDefault();
          list[list.length - 1]?.focus();
        }
      });
    });
  });
})();
