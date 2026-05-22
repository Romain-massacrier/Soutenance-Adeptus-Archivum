document.querySelectorAll(".lore-image img").forEach((image) => {
  image.addEventListener("click", () => {
    image.classList.toggle("image-zoomed");
  });
});
