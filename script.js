/* ============================================================
   Naufal Darmawan — portfolio interactions
   No dependencies. Everything is progressive enhancement.
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const contactEmail = "naufaldarmawan7@gmail.com";

  /* ------------------------------------------------------------
     Project data used by the case-study dialog
     ------------------------------------------------------------ */

  const projects = {
    "pasar-umkm": {
      title: "Pasar UMKM — Local Business Catalog",
      year: 2026,
      accent: "#8be9b0",
      url: "https://nuffalle.github.io/pasar-umkm/",
      summary:
        "A dependency-free catalog prototype that helps small businesses present their products online, with search, filters, and detail modals.",
      tags: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      points: [
        "Built search across business name, product, category, and city, plus category filters and rating/name sorting.",
        "Added accessible detail modals with keyboard support (Enter/Space to open, Esc to close) and a responsive layout.",
        "Kept the prototype fully static — data lives in a single data.js file, so it runs without a database or build step."
      ]
    },
    "papan-skor": {
      title: "Papan Skor Domino",
      year: 2026,
      accent: "#93c5fd",
      url: "https://github.com/nuffalle/project-asal",
      summary:
        "A browser-based scoreboard for domino games, built to replace pen-and-paper scoring during late-night rounds.",
      tags: ["HTML", "CSS", "JavaScript"],
      points: [
        "Tracks two teams with custom names, quick score buttons (+1 to +4), and an undo action.",
        "Keeps a round history and a running log so disputed scores are easy to check.",
        "Built as a single-page vanilla JavaScript app with a mobile-friendly board layout."
      ]
    },
    portologi: {
      title: "Portologi — Portfolio v1",
      year: 2025,
      accent: "#c4b5fd",
      url: "https://github.com/nuffalle/portologi",
      summary:
        "An earlier portfolio experiment from semester 3 — a more playful, animation-heavy take on presenting personal work.",
      tags: ["HTML", "CSS", "JavaScript", "Responsive"],
      points: [
        "Explored layout, motion, and visual identity before the current minimal version.",
        "Built with plain HTML, CSS, and JavaScript, including responsive sections and scroll interactions.",
        "Kept as a reference for how the design has evolved since then."
      ]
    },
    portfolio: {
      title: "Portfolio v3 — This Site",
      year: 2026,
      accent: "#8be9b0",
      url: "https://github.com/nuffalle/portfolio",
      summary:
        "The site you are looking at: a hand-built, dependency-free portfolio with a contribution graph generated from real GitHub activity.",
      tags: ["HTML", "CSS", "JavaScript", "Accessibility"],
      points: [
        "Built without a framework or build step — one HTML file, one stylesheet, one script.",
        "Includes sticky section navigation, accessible project dialogs, and reduced-motion support.",
        "Renders a contribution heatmap from a snapshot of real GitHub activity, with a tooltip on hover."
      ]
    }
  };

  /* ------------------------------------------------------------
     Section navigation
     ------------------------------------------------------------ */

  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function setActiveNav(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollTicking = false;

  function updateActiveSection() {
    if (navSections.length) {
      const probe = window.scrollY + Math.min(window.innerHeight * 0.32, 180);
      let activeId = navSections[0].id;

      navSections.forEach((section) => {
        if (section.offsetTop <= probe) activeId = section.id;
      });

      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

      if (nearBottom) {
        activeId = navSections[navSections.length - 1].id;
      }

      setActiveNav(activeId);
    }

    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        window.requestAnimationFrame(updateActiveSection);
      }
    },
    { passive: true }
  );

  updateActiveSection();
  window.addEventListener("load", updateActiveSection);

  /* ------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------ */

  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.04, rootMargin: "0px 0px -6% 0px" }
      );

      revealItems.forEach((item) => revealObserver.observe(item));
    }
  }

  /* ------------------------------------------------------------
     Show more / show less
     ------------------------------------------------------------ */

  document.querySelectorAll("[data-show-more]").forEach((button) => {
    const target = document.getElementById(button.dataset.showMore);
    const label = button.querySelector(".show-more__label");

    if (!target) return;

    button.addEventListener("click", () => {
      const isOpen = target.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      if (label) label.textContent = isOpen ? "Show less" : "Show more";
    });
  });

  /* ------------------------------------------------------------
     Contribution heatmap
     ------------------------------------------------------------ */

  function initHeatmap() {
    const grid = document.getElementById("heatmapGrid");
    const months = document.getElementById("heatmapMonths");
    const totalLabel = document.getElementById("heatmapTotal");
    const tooltip = document.getElementById("heatmapTip");

    if (!grid || !months) return;

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Snapshot of real public GitHub activity for @nuffalle.
    // Source: https://github-contributions-api.jogruber.de/v4/nuffalle?y=last
    // Refresh by replacing this array and the start date below.
    const contributionCounts = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,0,5,0];

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const start = new Date("2025-11-02T12:00:00");

    const fragment = document.createDocumentFragment();
    let total = 0;

    for (let i = 0; i < 371; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const isFuture = date > today;

      let count = isFuture ? 0 : contributionCounts[i] || 0;

      total += count;

      const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4;

      const cell = document.createElement("span");
      cell.className = "heatmap__cell";
      cell.dataset.level = String(level);

      if (!isFuture) {
        cell.dataset.tip = `${count} contribution${count === 1 ? "" : "s"} on ${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })}`;
      }

      fragment.appendChild(cell);
    }

    grid.appendChild(fragment);
    grid.setAttribute("aria-label", `${total.toLocaleString("en-US")} contributions in the last year`);

    if (totalLabel) {
      totalLabel.innerHTML = `<strong>${total.toLocaleString("en-US")}</strong> contributions in the last year`;
    }

    const monthLabels = [];
    let lastMonth = -1;

    for (let week = 0; week < 53; week += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + week * 7);
      const month = date.getMonth();

      if (month !== lastMonth) {
        monthLabels.push({ name: monthNames[month], span: 1 });
        lastMonth = month;
      } else {
        monthLabels[monthLabels.length - 1].span += 1;
      }
    }

    monthLabels.forEach((label) => {
      const span = document.createElement("span");
      span.textContent = label.name;
      span.style.gridColumn = `span ${label.span}`;
      months.appendChild(span);
    });

    if (tooltip) {
      grid.addEventListener("pointerover", (event) => {
        const cell = event.target.closest(".heatmap__cell");
        if (!cell || !cell.dataset.tip) return;

        tooltip.textContent = cell.dataset.tip;
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 8}px`;
        tooltip.classList.add("is-visible");
      });

      grid.addEventListener("pointerout", (event) => {
        const nextCell = event.relatedTarget && event.relatedTarget.closest
          ? event.relatedTarget.closest(".heatmap__cell")
          : null;

        if (!nextCell) tooltip.classList.remove("is-visible");
      });

      window.addEventListener("scroll", () => tooltip.classList.remove("is-visible"), {
        passive: true
      });
    }
  }

  initHeatmap();

  /* ------------------------------------------------------------
     Project dialog
     ------------------------------------------------------------ */

  const dialog = document.getElementById("projectDialog");
  const dialogEyebrow = document.getElementById("projectDialogEyebrow");
  const dialogTitle = document.getElementById("projectDialogTitle");
  const dialogSummary = document.getElementById("projectDialogSummary");
  const dialogTags = document.getElementById("projectDialogTags");
  const dialogPoints = document.getElementById("projectDialogPoints");
  const dialogCta = document.getElementById("projectDialogCta");
  const dialogLink = document.getElementById("projectDialogLink");
  const dialogClose = dialog ? dialog.querySelector("[data-close-dialog]") : null;

  function openProject(id) {
    const project = projects[id];
    if (!project || !dialog) return;

    dialog.style.setProperty("--project-accent", project.accent);
    dialogEyebrow.textContent = `Case study · ${project.year}`;
    dialogTitle.textContent = project.title;
    dialogSummary.textContent = project.summary;

    dialogTags.replaceChildren(
      ...project.tags.map((tag) => {
        const element = document.createElement("span");
        element.className = "tag";
        element.textContent = tag;
        return element;
      })
    );

    dialogPoints.replaceChildren(
      ...project.points.map((point) => {
        const item = document.createElement("li");
        item.textContent = point;
        return item;
      })
    );

    if (dialogCta) {
      dialogCta.href = `mailto:${contactEmail}?subject=${encodeURIComponent(
        `Question about ${project.title}`
      )}`;
    }

    if (dialogLink) {
      if (project.url) {
        dialogLink.href = project.url;
        dialogLink.hidden = false;
      } else {
        dialogLink.hidden = true;
        dialogLink.removeAttribute("href");
      }
    }

    dialog.showModal();
    document.body.classList.add("dialog-open");
  }

  document.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(button.dataset.project));
  });

  if (dialog) {
    if (dialogClose) {
      dialogClose.addEventListener("click", () => dialog.close());
    }

    dialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-open");
    });

    dialog.addEventListener("click", (event) => {
      const rect = dialog.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) dialog.close();
    });
  }

  /* ------------------------------------------------------------
     Local time in Makassar
     ------------------------------------------------------------ */

  const localTime = document.getElementById("localTime");

  function updateLocalTime() {
    if (!localTime) return;

    const now = new Date();
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Makassar",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    localTime.textContent = time;
    localTime.setAttribute("datetime", now.toISOString());
  }

  updateLocalTime();
  window.setInterval(updateLocalTime, 30000);

  /* ------------------------------------------------------------
     Copy email + toast
     ------------------------------------------------------------ */

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  document.querySelectorAll("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const email = button.dataset.copyEmail || "";
      let copied = false;

      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(email);
          copied = true;
        } catch (error) {
          copied = false;
        }
      }

      if (!copied) {
        try {
          const temporary = document.createElement("textarea");
          temporary.value = email;
          temporary.setAttribute("readonly", "");
          temporary.style.position = "fixed";
          temporary.style.opacity = "0";
          document.body.appendChild(temporary);
          temporary.select();
          copied = document.execCommand("copy");
          temporary.remove();
        } catch (error) {
          copied = false;
        }
      }

      showToast(copied ? "Email copied to clipboard" : email);
    });
  });

  /* ------------------------------------------------------------
     Back to top + current year
     ------------------------------------------------------------ */

  const toTop = document.querySelector(".to-top");

  function updateToTop() {
    if (!toTop) return;
    toTop.classList.toggle("is-visible", window.scrollY > 640);
  }

  window.addEventListener("scroll", updateToTop, { passive: true });
  updateToTop();

  if (toTop) {
    toTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
