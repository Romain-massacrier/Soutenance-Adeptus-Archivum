document.addEventListener("DOMContentLoaded", () => {
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
