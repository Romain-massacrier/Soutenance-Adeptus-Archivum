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
  const headings = getSummaryHeadings();

  if (headings.length < 2) {
    return;
  }

  const button = document.createElement("button");
  const panel = document.createElement("nav");
  const panelId = "mobile-summary-panel";

  button.className = "mobile-summary-toggle";
  button.type = "button";
  button.textContent = "Sommaire";
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", panelId);

  panel.className = "mobile-summary-panel";
  panel.id = panelId;
  panel.setAttribute("aria-label", "Sommaire de la page");

  headings.forEach((heading) => {
    const link = document.createElement("a");
    heading.id = heading.id || createSummaryId(heading.textContent);
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent.trim();
    panel.appendChild(link);
  });

  document.body.appendChild(button);
  document.body.appendChild(panel);

  button.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMobileSummary(button, panel));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileSummary(button, panel);
    }
  });
}

function getSummaryHeadings() {
  const contentHeadings = document.querySelectorAll(".content h2");

  if (contentHeadings.length > 1) {
    return Array.from(contentHeadings);
  }

  return Array.from(document.querySelectorAll(".detail-container .faction-link h2"));
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
  panel.classList.remove("open");
  button.setAttribute("aria-expanded", "false");
}
