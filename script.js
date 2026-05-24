console.log("Portfolio loaded ✅");

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  const successMessage = document.querySelector("#contact-success");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    contactForm.hidden = true;
    successMessage.hidden = false;
  });
}

const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.querySelector("#nav-menu");

if (nav && navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}
