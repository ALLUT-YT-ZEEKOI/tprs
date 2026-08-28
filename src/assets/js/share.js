(() => {
  document.querySelectorAll("[data-copy-link]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const wrap = btn.closest("[data-share]");
      const url = wrap ? wrap.getAttribute("data-url") : window.location.href;
      const original = btn.textContent;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const temp = document.createElement("textarea");
          temp.value = url;
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.select();
          document.execCommand("copy");
          document.body.removeChild(temp);
        }
        btn.textContent = "Copied!";
      } catch (err) {
        btn.textContent = "Copy failed";
      }

      setTimeout(() => {
        btn.textContent = original;
      }, 2000);
    });
  });
})();
