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

  // Create a hidden error message we can show if the database insert fails.
  let errorMessage = document.querySelector("#contact-error");
  if (!errorMessage) {
    errorMessage = document.createElement("p");
    errorMessage.id = "contact-error";
    errorMessage.className = "contact-form__error";
    errorMessage.hidden = true;
    errorMessage.style.color = "#dc2626";
    errorMessage.style.textAlign = "center";
    errorMessage.style.padding = "16px";
    successMessage.parentNode.insertBefore(errorMessage, successMessage);
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    // Clear any previous error before trying a new submission.
    errorMessage.hidden = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    console.log(data);

    // Read the four form fields (fullName maps to the full_name database column).
    const full_name = data.fullName;
    const email = data.email;
    const subject = data.subject;
    const message = data.message;

    // Send the submission to Supabase's "form" table and wait for the response.
    const response = await supabaseClient.from("form").insert([{ full_name, email, subject, message }]);

    // Log the full response object so we can debug in the browser console.
    console.log(response);

    if (response.error) {
      // Insert failed — keep the form visible and show a red error message.
      errorMessage.textContent = "Something went wrong. Please try again.";
      errorMessage.hidden = false;
      successMessage.hidden = true;
      contactForm.hidden = false;
      return;
    }

    // Insert succeeded — hide the form, show the thank-you message, and clear fields.
    contactForm.reset();
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

// === ADMIN INBOX (only runs on admin.html) ===
(function initAdminInbox() {
  const inboxGrid = document.querySelector("#admin-inbox-grid");

  // Bail out quietly on every other page — this block only belongs on the admin dashboard.
  if (!inboxGrid) {
    return;
  }

  const countEl = document.querySelector("#admin-count");
  const unreadToggle = document.querySelector("#admin-unread-only");

  // Turn a timestamp into a friendly relative string like "2 hours ago".
  function timeAgo(dateInput) {
    const date = new Date(dateInput);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) {
      return "just now";
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days} day${days === 1 ? "" : "s"} ago`;
    }

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Build one message card from a single database row.
  function createInboxCard(row) {
    const card = document.createElement("article");
    card.className = "inbox-card";
    if (row.is_read) {
      card.classList.add("is-read");
    }
    card.dataset.id = String(row.id);

    const topRow = document.createElement("div");
    topRow.className = "inbox-card__top";

    const subject = document.createElement("h3");
    subject.className = "inbox-card__subject";
    subject.textContent = row.subject;

    const time = document.createElement("time");
    time.className = "inbox-card__time";
    time.dateTime = row.created_at;
    time.textContent = timeAgo(row.created_at);

    topRow.append(subject, time);

    const sender = document.createElement("p");
    sender.className = "inbox-card__sender";
    sender.textContent = `${row.full_name} · ${row.email}`;

    const body = document.createElement("p");
    body.className = "inbox-card__body";
    body.textContent = row.message;

    const actions = document.createElement("div");
    actions.className = "inbox-card__actions";

    // Unread messages get a "Mark as Read" button; read ones do not.
    if (!row.is_read) {
      const markReadBtn = document.createElement("button");
      markReadBtn.type = "button";
      markReadBtn.className = "inbox-card__mark-read btn-shine";
      markReadBtn.textContent = "Mark as Read";
      markReadBtn.addEventListener("click", () => markAsRead(row.id, card, markReadBtn));
      actions.append(markReadBtn);
    }

    card.append(topRow, sender, body, actions);
    return card;
  }

  // Ask Supabase to set is_read = true for one row, then restyle that card locally.
  async function markAsRead(id, card, button) {
    button.disabled = true;

    const response = await supabaseClient.from("form").update({ is_read: true }).eq("id", id);

    if (response.error) {
      button.disabled = false;
      console.log(response);
      return;
    }

    card.classList.add("is-read");
    button.remove();
  }

  // Pull every submission from the "form" table and paint the grid.
  async function loadInbox() {
    const response = await supabaseClient
      .from("form")
      .select("*")
      .order("created_at", { ascending: false });

    console.log(response);

    inboxGrid.innerHTML = "";

    if (response.error) {
      const errorMsg = document.createElement("p");
      errorMsg.className = "admin-grid__error";
      errorMsg.textContent = "Could not load messages. Check the console for details.";
      inboxGrid.append(errorMsg);
      return;
    }

    const rows = response.data || [];

    if (countEl) {
      countEl.textContent = `📬 ${rows.length} message${rows.length === 1 ? "" : "s"}`;
    }

    if (!rows.length) {
      const emptyMsg = document.createElement("p");
      emptyMsg.className = "admin-grid__empty";
      emptyMsg.textContent = "No messages yet.";
      inboxGrid.append(emptyMsg);
      return;
    }

    rows.forEach((row) => {
      inboxGrid.append(createInboxCard(row));
    });
  }

  // When "Unread only" is checked, hide cards that already have the is-read class.
  if (unreadToggle) {
    unreadToggle.addEventListener("change", () => {
      inboxGrid.classList.toggle("admin-grid--unread-only", unreadToggle.checked);
    });
  }

  loadInbox();
})();
