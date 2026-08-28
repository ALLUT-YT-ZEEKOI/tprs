(() => {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  /* ---------- scroll state ---------- */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- desktop mega menu ---------- */
  const navItems = Array.from(header.querySelectorAll("[data-nav-item]"));

  function closeItem(item) {
    const trigger = item.querySelector(":scope > .nav-item__trigger");
    const panel = item.querySelector(":scope > .mega-panel");
    if (!trigger || !panel) return;
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
    item.removeAttribute("data-open");
  }

  function openItem(item) {
    navItems.forEach((other) => other !== item && closeItem(other));
    const trigger = item.querySelector(":scope > .nav-item__trigger");
    const panel = item.querySelector(":scope > .mega-panel");
    if (!trigger || !panel) return;
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    item.setAttribute("data-open", "");
  }

  function closeAll() {
    navItems.forEach(closeItem);
  }

  navItems.forEach((item) => {
    const trigger = item.querySelector(":scope > .nav-item__trigger");
    if (!trigger) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.hasAttribute("data-open");
      closeAll();
      if (!isOpen) openItem(item);
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        openItem(item);
        item.querySelector(".mega-panel__link")?.focus();
      } else if (e.key === "Escape") {
        closeItem(item);
        trigger.focus();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const idx = navItems.indexOf(item);
        const next = e.key === "ArrowRight" ? navItems[idx + 1] : navItems[idx - 1];
        next?.querySelector(":scope > .nav-item__trigger")?.focus();
      }
    });

    item.addEventListener("mouseenter", () => openItem(item));
    item.addEventListener("mouseleave", () => closeItem(item));

    /* swap right-panel preview on hover/focus of a left link */
    const links = item.querySelectorAll("[data-mega-link]");
    links.forEach((link) => {
      const activate = () => {
        const targetId = link.getAttribute("data-panel-target");
        item.querySelectorAll("[data-mega-link]").forEach((l) => l.classList.toggle("is-active", l === link));
        item.querySelectorAll("[data-mega-preview]").forEach((p) => p.classList.toggle("is-active", p.id === targetId));
      };
      link.addEventListener("mouseenter", activate);
      link.addEventListener("focus", activate);
    });

    item.querySelectorAll(".mega-panel").forEach((panel) => {
      panel.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeItem(item);
          trigger.focus();
        }
      });
    });
  });

  document.addEventListener("click", (e) => {
    if (!header.contains(e.target)) closeAll();
  });

  document.addEventListener("focusin", (e) => {
    if (!header.contains(e.target)) closeAll();
  });

  /* ---------- language switcher ---------- */
  const langSwitch = header.querySelector("[data-lang-switch]");
  if (langSwitch) {
    const trigger = langSwitch.querySelector(".lang-switch__trigger");
    const list = langSwitch.querySelector(".lang-switch__list");
    trigger.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!open));
      list.hidden = open;
    });
    document.addEventListener("click", (e) => {
      if (!langSwitch.contains(e.target)) {
        trigger.setAttribute("aria-expanded", "false");
        list.hidden = true;
      }
    });
    langSwitch.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        trigger.setAttribute("aria-expanded", "false");
        list.hidden = true;
        trigger.focus();
      }
    });
  }

  /* ---------- mobile nav ---------- */
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const menuToggle = header.querySelector("[data-menu-toggle]");
  const mobileClose = mobileNav?.querySelector("[data-mobile-nav-close]");
  const mobileOverlay = mobileNav?.querySelector("[data-mobile-nav-overlay]");
  let lastFocused = null;

  function trapFocus(e) {
    if (!mobileNav.classList.contains("is-open")) return;
    if (e.key !== "Tab") return;
    const focusables = mobileNav.querySelectorAll(
      'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
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

  function openMobileNav() {
    lastFocused = document.activeElement;
    mobileNav.hidden = false;
    requestAnimationFrame(() => mobileNav.classList.add("is-open"));
    document.body.classList.add("mobile-nav-open");
    header.classList.add("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "true");
    mobileClose?.focus();
    document.addEventListener("keydown", onMobileKeydown);
  }

  function closeMobileNav() {
    mobileNav.classList.remove("is-open");
    document.body.classList.remove("mobile-nav-open");
    header.classList.remove("is-menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onMobileKeydown);
    setTimeout(() => {
      if (!mobileNav.classList.contains("is-open")) mobileNav.hidden = true;
    }, 300);
    (lastFocused || menuToggle)?.focus();
  }

  function onMobileKeydown(e) {
    if (e.key === "Escape") closeMobileNav();
    trapFocus(e);
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileNav() : openMobileNav();
  });
  mobileClose?.addEventListener("click", closeMobileNav);
  mobileOverlay?.addEventListener("click", closeMobileNav);

  /* mobile accordion */
  mobileNav?.querySelectorAll(".mobile-accordion__trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });
})();
