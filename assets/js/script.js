document.addEventListener("DOMContentLoaded", () => {
  const contentImages = getContentImages();

  if (!contentImages.length) {
    return;
  }

  const modal = createImageModal();
  const modalImage = modal.querySelector(".image-modal-content");
  const closeButton = modal.querySelector(".image-modal-close");
  let activeImage = null;

  // Seules les images de contenu deviennent cliquables.
  contentImages.forEach((image) => {
    image.classList.add("clickable-image");
    image.setAttribute("tabindex", "0");

    image.addEventListener("click", () => openModal(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(image);
      }
    });
  });

  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  function getContentImages() {
    return Array.from(
      document.querySelectorAll(
        ".content img, .article-content img, .gallery img, .lore-block img, .hero-banner img"
      )
    ).filter((image) => !shouldIgnoreImage(image));
  }

  function shouldIgnoreImage(image) {
    return Boolean(
      image.closest("header") ||
        image.closest(".home-header") ||
        image.closest(".factions-list") ||
        image.closest(".faction-link") ||
        image.classList.contains("site-logo") ||
        image.classList.contains("faction-img") ||
        image.getAttribute("role") === "presentation" ||
        image.getAttribute("aria-hidden") === "true"
    );
  }

  function createImageModal() {
    const imageModal = document.createElement("div");
    imageModal.className = "image-modal";
    imageModal.setAttribute("role", "dialog");
    imageModal.setAttribute("aria-modal", "true");
    imageModal.setAttribute("aria-label", "Image agrandie");

    imageModal.innerHTML = `
      <button class="image-modal-close" type="button" aria-label="Fermer l'image agrandie">×</button>
      <img class="image-modal-content" src="" alt="">
    `;

    document.body.appendChild(imageModal);
    return imageModal;
  }

  function openModal(sourceImage) {
    activeImage = sourceImage;
    modalImage.src = sourceImage.currentSrc || sourceImage.src;
    modalImage.alt = sourceImage.alt || "";
    modal.classList.add("open");
    document.body.classList.add("image-modal-open");
    closeButton.focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("image-modal-open");
    modalImage.removeAttribute("src");
    activeImage?.focus();
    activeImage = null;
  }
});
