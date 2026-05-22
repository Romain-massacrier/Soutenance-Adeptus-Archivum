document.querySelectorAll(".lore-image img").forEach((image) => {
  image.addEventListener("pointerup", () => {
    image.classList.toggle("image-zoomed");
  });
});