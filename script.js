const revealItems = document.querySelectorAll(".reveal");
const burgerToggle = document.querySelector(".burger-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu__close");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

const setMenuOpen = (isOpen) => {
  if (!burgerToggle || !mobileMenu) return;

  burgerToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

burgerToggle?.addEventListener("click", () => setMenuOpen(true));
mobileMenuClose?.addEventListener("click", () => setMenuOpen(false));
mobileMenuLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenuOpen(false);
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
