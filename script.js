const revealItems = document.querySelectorAll(".reveal");
const burgerToggle = document.querySelector(".burger-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu__close");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");
const openStatus = document.querySelector("[data-open-status]");

const updateOpenStatus = (now = new Date()) => {
  if (!openStatus) return;

  const minutes = now.getHours() * 60 + now.getMinutes();
  const opensAt = 10 * 60;
  const closesAt = 19 * 60;
  const isOpen = minutes >= opensAt && minutes < closesAt;

  openStatus.textContent = isOpen ? "Открыто до 19:00" : "Откроемся в 10:00";
  openStatus.classList.toggle("is-open", isOpen);
  openStatus.classList.toggle("is-closed", !isOpen);
};

const setMenuOpen = (isOpen) => {
  if (!burgerToggle || !mobileMenu) return;

  burgerToggle.setAttribute("aria-expanded", String(isOpen));
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
  mobileMenu.classList.toggle("is-open", isOpen);
};

burgerToggle?.addEventListener("click", () => {
  setMenuOpen(!mobileMenu?.classList.contains("is-open"));
});
mobileMenuClose?.addEventListener("click", () => setMenuOpen(false));
mobileMenuLinks.forEach((link) => link.addEventListener("click", () => setMenuOpen(false)));
updateOpenStatus();

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
