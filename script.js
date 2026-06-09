(function () {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const yearNodes = document.querySelectorAll("[data-year]");
  const contactForm = document.querySelector("#contact-form");
  const formStatus = document.querySelector("#form-status");

  yearNodes.forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".primary-nav a").forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  if (header) {
    const setHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  if (toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 840) {
        closeNav();
      }
    });
  }

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.classList.remove("error");
      formStatus.textContent = "";

      const formData = new FormData(contactForm);
      if (formData.get("website")) {
        contactForm.reset();
        return;
      }

      const requiredFields = ["name", "email", "company", "country", "category", "message"];
      const hasMissingField = requiredFields.some((field) => {
        const value = String(formData.get(field) || "").trim();
        return value.length === 0;
      });
      const email = String(formData.get("email") || "").trim();
      const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (hasMissingField || !emailIsValid) {
        formStatus.classList.add("error");
        formStatus.textContent = "Please complete the required fields with a valid email address.";
        return;
      }

      formStatus.textContent = "Thank you. Your inquiry is ready for review. Connect this form to your Vercel form handler or CRM for live submissions.";
      contactForm.reset();
    });
  }
})();
