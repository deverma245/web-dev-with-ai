// === THEME (must run first) ===
(function initTheme() {
  const storageKey = "aanya-theme";
  let theme = localStorage.getItem(storageKey);

  if (!theme) {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.documentElement.setAttribute("data-theme", theme);
})();

// === SCROLL PROGRESS BAR ===
(function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateProgress();
})();

// === REVEAL ON SCROLL ===
(function initReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealElements.forEach((element) => observer.observe(element));
})();

// === NAV SHRINK ON SCROLL ===
(function initNavScroll() {
  const nav = document.querySelector(".nav");

  if (!nav) {
    return;
  }

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// === ABOUT STATS COUNTERS ===
(function initStatsCounters() {
  const statsStrip = document.querySelector(".about-stats");

  if (!statsStrip) {
    return;
  }

  const animateNumber = (element, target, duration) => {
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.querySelectorAll("[data-target]").forEach((counter) => {
          animateNumber(counter, Number(counter.dataset.target), 1400);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(statsStrip);
})();

// === PAGE-LOAD SPLASH ===
(function initSplash() {
  const splash = document.createElement("div");
  splash.className = "page-splash";
  splash.innerHTML = '<p class="page-splash__brand">Aanya Sharma</p>';
  document.body.prepend(splash);

  window.setTimeout(() => {
    splash.classList.add("is-hidden");

    window.setTimeout(() => {
      splash.remove();
    }, 400);
  }, 900);
})();

// === THEME TOGGLE UI ===
(function initThemeToggle() {
  const toggle = document.querySelector(".nav__theme-toggle");

  if (!toggle) {
    return;
  }

  const updateToggle = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  };

  updateToggle();

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("aanya-theme", next);
    updateToggle();
  });
})();

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
