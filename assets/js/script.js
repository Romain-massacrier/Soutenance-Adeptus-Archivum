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
  const menu = getMobileMenuConfig();

  if (!menu) {
    return;
  }

  const topbar = document.createElement("div");
  const returnLink = document.createElement("a");
  const button = document.createElement("button");
  const panel = document.createElement("nav");

  document.body.classList.add("has-mobile-summary");

  topbar.className = ["mobile-topbar", menu.topbarClass]
    .filter(Boolean)
    .join(" ");

  if (menu.backHref) {
    returnLink.className = "mobile-topbar-back";
    returnLink.href = menu.backHref;
    returnLink.textContent = menu.backText;
    topbar.appendChild(returnLink);
  }

  button.className = "mobile-summary-toggle";
  button.type = "button";
  button.textContent = menu.buttonText;
  button.setAttribute("aria-label", menu.openLabel);
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", menu.panelId);

  panel.className = "mobile-summary-panel";
  panel.id = menu.panelId;
  panel.setAttribute("aria-label", menu.panelLabel);

  menu.items.forEach((item) => {
    const link = document.createElement("a");
    link.href = item.href;
    link.textContent = item.label;
    panel.appendChild(link);
  });

  if (menu.items.length) {
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
      isOpen ? menu.closeLabel : menu.openLabel
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
  return getContentSummaryItems();
}

function getMobileMenuConfig() {
  const backLink = document.querySelector(".back-link");
  const contentItems = getContentSummaryItems();
  const detailItems = getCardNavigationItems(".detail-container .faction-link");
  const factionIndexItems = getFactionIndexItems();

  if (contentItems.length) {
    return createSummaryMenuConfig(contentItems, backLink);
  }

  if (backLink && detailItems.length) {
    return createSummaryMenuConfig(detailItems, backLink);
  }

  if (factionIndexItems.length) {
    return {
      items: factionIndexItems,
      buttonText: "Factions",
      openLabel: "Ouvrir l'index des factions",
      closeLabel: "Fermer l'index des factions",
      panelLabel: "Index des factions",
      panelId: "mobile-factions-panel",
      topbarClass: "mobile-topbar--index",
    };
  }

  if (backLink) {
    return createSummaryMenuConfig([], backLink);
  }

  return null;
}

function createSummaryMenuConfig(items, backLink) {
  return {
    items,
    buttonText: "Sommaire",
    openLabel: "Ouvrir le sommaire",
    closeLabel: "Fermer le sommaire",
    panelLabel: "Sommaire de la page",
    panelId: "mobile-summary-panel",
    backHref: backLink?.href || "",
    backText: "← Factions",
  };
}

function getContentSummaryItems() {
  const contentHeadings = document.querySelectorAll(".content h2");

  return Array.from(contentHeadings).map((heading) => {
    heading.id = heading.id || createSummaryId(heading.textContent);

    return {
      href: `#${heading.id}`,
      label: heading.textContent.trim(),
    };
  });
}

function getCardNavigationItems(selector) {
  return Array.from(document.querySelectorAll(selector))
    .map((navigationLink) => {
      const heading = navigationLink.querySelector("h2, h3");
      const image = navigationLink.querySelector("img[alt]");
      const label = heading?.textContent.trim() || image?.alt.trim();
      const href = navigationLink.getAttribute("href");

      if (!label || !href) {
        return null;
      }

      return { href, label };
    })
    .filter(Boolean);
}

function getFactionIndexItems() {
  const factionsList = document.querySelector(".factions-list");

  if (!factionsList) {
    return [];
  }

  return getCardNavigationItems(".factions-list .faction-link");
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
  const openLabel =
    button.textContent.trim().toLowerCase() === "factions"
      ? "Ouvrir l'index des factions"
      : "Ouvrir le sommaire";
  button.setAttribute("aria-label", openLabel);
}
