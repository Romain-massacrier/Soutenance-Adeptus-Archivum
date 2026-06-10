document.addEventListener("DOMContentLoaded", () => {
  setupMobileSummary();

  const images = document.querySelectorAll(".content img, .gallery img");

  const modal = document.createElement("div");
  modal.className = "image-modal";
  modal.innerHTML = `
    <button class="image-modal-close">×</button>
    <img class="image-modal-content" src="" alt="">
  `;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector(".image-modal-content");
  const closeButton = modal.querySelector(".image-modal-close");

  images.forEach((image) => {
    image.classList.add("clickable-image");

    image.addEventListener("click", () => {
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      modal.classList.add("open");
      document.body.classList.add("image-modal-open");
    });
  });

  closeButton.addEventListener("click", () => {
    modal.classList.remove("open");
    document.body.classList.remove("image-modal-open");
    modalImage.src = "";
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
      document.body.classList.remove("image-modal-open");
      modalImage.src = "";
    }
  });
});

function setupMobileSummary() {
  const summaryItems = getSummaryItems();
  const backLink = document.querySelector(".back-link");

  if (!backLink && !summaryItems.length) {
    return;
  }

  const topbar = document.createElement("div");
  const returnLink = document.createElement("a");
  const button = document.createElement("button");
  const panel = document.createElement("nav");
  const panelId = "mobile-summary-panel";

  document.body.classList.add("has-mobile-summary");

  topbar.className = "mobile-topbar";

  if (backLink) {
    returnLink.className = "mobile-topbar-back";
    returnLink.href = backLink.href;
    returnLink.textContent = "← Factions";
    topbar.appendChild(returnLink);
  }

  button.className = "mobile-summary-toggle";
  button.type = "button";
  button.textContent = "Sommaire";
  button.setAttribute("aria-label", "Ouvrir le sommaire");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", panelId);

  panel.className = "mobile-summary-panel";
  panel.id = panelId;
  panel.setAttribute("aria-label", "Sommaire de la page");

  summaryItems.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    panel.appendChild(link);
  });

  if (summaryItems.length) {
    topbar.appendChild(button);
    document.body.appendChild(panel);
  }

  document.body.appendChild(topbar);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = panel.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Fermer le sommaire" : "Ouvrir le sommaire"
    );
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      handleSummaryLinkClick(event, link, button, panel);
    });
  });

  document.addEventListener("click", (event) => {
    if (!topbar.contains(event.target) && !panel.contains(event.target)) {
      closeMobileSummary(button, panel);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileSummary(button, panel);
    }
  });
}

function getSummaryItems() {
  const contentHeadings = document.querySelectorAll(".content h2");

  if (contentHeadings.length) {
    return Array.from(contentHeadings).map((heading) => {
      heading.id = heading.id || createSummaryId(heading.textContent);

      return {
        href: `#${heading.id}`,
        label: heading.textContent.trim(),
      };
    });
  }

  return Array.from(document.querySelectorAll(".detail-container .faction-link"))
    .map((navigationLink) => {
      const heading = navigationLink.querySelector("h2, h3");
      const label = heading?.textContent.trim();
      const href = navigationLink.getAttribute("href");

      if (!label || !href) {
        return null;
      }

      return { href, label };
    })
    .filter(Boolean);
}

function handleSummaryLinkClick(event, link, button, panel) {
  const href = link.getAttribute("href");

  closeMobileSummary(button, panel);

  if (!href || !href.startsWith("#")) {
    return;
  }

  event.preventDefault();

  const target = document.getElementById(href.slice(1));

  if (!target) {
    return;
  }

  openContainingBlock(target);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openContainingBlock(target) {
  const details = target.closest("details");

  if (details) {
    details.open = true;
    return;
  }

  const collapsible = target.closest("[hidden], [aria-hidden='true']");

  if (collapsible) {
    collapsible.hidden = false;
    collapsible.setAttribute("aria-hidden", "false");
  }

  const toggle = target.closest("[data-summary-panel]")?.querySelector(
    "[aria-expanded='false']"
  );

  if (toggle) {
    toggle.setAttribute("aria-expanded", "true");
  }
}

function createSummaryId(text) {
  return `section-${text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

function closeMobileSummary(button, panel) {
  panel.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Ouvrir le sommaire");
}
