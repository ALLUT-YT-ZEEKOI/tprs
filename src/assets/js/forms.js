(() => {
  function showFieldError(form, fieldName, message) {
    const err = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (err) err.textContent = message || "";
  }

  function validate(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach((field) => {
      if (field.type === "checkbox") {
        if (!field.checked) {
          valid = false;
          showFieldError(form, field.id, "This field is required.");
        } else {
          showFieldError(form, field.id, "");
        }
        return;
      }
      if (!field.value.trim()) {
        valid = false;
        showFieldError(form, field.id, "This field is required.");
      } else if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        valid = false;
        showFieldError(form, field.id, "Enter a valid email address.");
      } else {
        showFieldError(form, field.id, "");
      }
    });
    return valid;
  }

  function setLoading(form, loading) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle("is-loading", loading);
    btn.querySelector(".btn__spinner")?.toggleAttribute("hidden", !loading);
  }

  function setStatus(form, message, kind) {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = message;
    status.classList.remove("is-success", "is-error");
    if (kind) status.classList.add(`is-${kind}`);
  }

  async function handleSubmit(e) {
    const form = e.target;
    if (!form.matches("[data-newsletter-form], [data-contact-form], [data-enquiry-form], [data-careers-form]")) return;
    e.preventDefault();

    /* honeypot */
    const honeypot = form.querySelector('input[name="company"], input[name="website"]');
    if (honeypot && honeypot.value.trim() !== "") {
      return; // silently drop — likely a bot
    }

    if (!validate(form)) return;

    const endpoint = form.dataset.endpoint || form.action;
    if (!endpoint || endpoint === window.location.href) {
      setStatus(form, "This form isn't connected to an endpoint yet.", "error");
      return;
    }

    setLoading(form, true);
    setStatus(form, "", null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStatus(form, "Thanks — we've received your submission.", "success");
      form.reset();
    } catch (err) {
      setStatus(form, "Something went wrong. Please try again.", "error");
    } finally {
      setLoading(form, false);
    }
  }

  document.addEventListener("submit", handleSubmit);
})();
