/* ============================================================
   Raka Adhitama — portfolio interactions
   No dependencies. Everything is progressive enhancement.
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------
     Project data used by the case-study dialog
     ------------------------------------------------------------ */

  const projects = {
    loka: {
      title: "Loka — AI Research Assistant",
      year: 2026,
      accent: "#8be9b0",
      summary:
        "A citation-first research workspace that lets teams ask questions across their own paper library and trace every sentence back to the source.",
      tags: ["Next.js", "FastAPI", "pgvector", "OpenAI", "RAG"],
      points: [
        "Designed a hybrid retrieval pipeline that combines BM25, dense search, and a cross-encoder reranker.",
        "Built a streaming answer interface with inline citations, confidence signals, and one-click source previews.",
        "Cut hallucinated claims by 38% against a 300-question internal evaluation set."
      ]
    },
    sawitscan: {
      title: "SawitScan — Plant Health Scanner",
      year: 2025,
      accent: "#9ee6a8",
      summary:
        "An on-device palm-leaf disease detector that runs offline on mid-range Android phones, built for growers with unreliable connectivity.",
      tags: ["TensorFlow Lite", "Android", "Computer Vision", "Edge AI"],
      points: [
        "Trained an EfficientNet-Lite model on 12k field images across four disease classes and one healthy class.",
        "Quantised the model to 4.8 MB and kept inference under 40 ms on a 2021 mid-range device.",
        "Reached 94% top-1 accuracy and 28 FPS live camera inference in the capstone demo."
      ]
    },
    nusaocr: {
      title: "NusaOCR — Document Intelligence",
      year: 2025,
      accent: "#93c5fd",
      summary:
        "A document intelligence pipeline for Indonesian invoices and receipts, with a human-in-the-loop review queue for ambiguous fields.",
      tags: ["Python", "PaddleOCR", "FastAPI", "React", "PostgreSQL"],
      points: [
        "Combined OCR with a layout-aware parser to extract line items, tax fields, and totals from scanned documents.",
        "Added a confidence-based review queue so ambiguous fields route to a human instead of silently failing.",
        "Processed a 6k-document pilot set with 96% field-level accuracy on totals and invoice dates."
      ]
    },
    ruangbaca: {
      title: "RuangBaca — Reading Companion",
      year: 2024,
      accent: "#fcd34d",
      summary:
        "A reading companion that turns highlights into a personal spaced-repetition system, designed to stay out of the way while you read.",
      tags: ["Next.js", "Supabase", "OpenAI", "Product Design"],
      points: [
        "Designed a calm, keyboard-first reading flow for capturing highlights without leaving the page.",
        "Generated question cards from highlights and scheduled them with a lightweight SM-2 variant.",
        "Shipped as a personal tool used weekly by a small beta group of 40 readers."
      ]
    },
    sinyal: {
      title: "Sinyal — Hybrid Recommender",
      year: 2024,
      accent: "#c4b5fd",
      summary:
        "A real-time recommendation service that blends collaborative filtering with content embeddings to handle both taste and cold starts.",
      tags: ["PyTorch", "Redis", "FastAPI", "Recommender Systems"],
      points: [
        "Served top-k recommendations in under 15 ms using Redis-backed candidate generation.",
        "Blended implicit feedback and content embeddings to solve the cold-start problem for new items.",
        "Evaluated offline with recall@10 and online with a small A/B test on click-through rate."
      ]
    },
    portfolio: {
      title: "Portfolio v3 — This Site",
      year: 2024,
      accent: "#8be9b0",
      summary:
        "The site you are looking at: a hand-built, dependency-free portfolio with a custom contribution graph and a focus on reading comfort.",
      tags: ["HTML", "CSS", "JavaScript", "Accessibility"],
      points: [
        "Built without a framework or build step — one HTML file, one stylesheet, one script.",
        "Designed a mobile-first reading experience with sticky section navigation and reduced-motion support.",
        "Added an interactive GitHub-style contribution heatmap generated from deterministic data."
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

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay() - 52 * 7);

    let seed = 20261106;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    const fragment = document.createDocumentFragment();
    let total = 0;

    for (let i = 0; i < 371; i += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const isFuture = date > today;

      let count = 0;

      if (!isFuture) {
        const roll = random();

        if (roll > 0.42) {
          if (roll > 0.93) {
            count = 10 + Math.floor(random() * 9);
          } else if (roll > 0.8) {
            count = 6 + Math.floor(random() * 4);
          } else if (roll > 0.62) {
            count = 3 + Math.floor(random() * 3);
          } else {
            count = 1 + Math.floor(random() * 2);
          }
        }

        if ((date.getDay() === 0 || date.getDay() === 6) && random() < 0.45) {
          count = Math.floor(count / 2);
        }

        total += count;
      }

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
      dialogCta.href = `mailto:hello@raka.dev?subject=${encodeURIComponent(
        `Question about ${project.title}`
      )}`;
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
     Local time in Jakarta
     ------------------------------------------------------------ */

  const localTime = document.getElementById("localTime");

  function updateLocalTime() {
    if (!localTime) return;

    const now = new Date();
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
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
