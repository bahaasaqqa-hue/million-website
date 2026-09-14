const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const form = document.querySelector("#ai-search");
const prompt = form?.querySelector("[name='prompt']");
const toast = document.querySelector("[data-toast]");

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "فتح القائمة");
};

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  navigation.classList.toggle("open", !open);
  menuButton.setAttribute("aria-expanded", String(!open));
  menuButton.setAttribute("aria-label", open ? "فتح القائمة" : "إغلاق القائمة");
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && document.activeElement === prompt) {
    form.requestSubmit();
  }
});

window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 10), { passive: true });

document.querySelectorAll("[data-suggestion]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!prompt) return;
    prompt.value = button.dataset.suggestion || "";
    prompt.focus();
    prompt.dispatchEvent(new Event("input"));
  });
});

prompt?.addEventListener("input", () => {
  prompt.style.height = "auto";
  prompt.style.height = Math.min(prompt.scrollHeight, 130) + "px";
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!prompt?.value.trim()) {
    prompt?.focus();
    return;
  }
  toast?.classList.add("show");
  window.setTimeout(() => toast?.classList.remove("show"), 2800);
});

const observer = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

document.querySelectorAll(".reveal").forEach((element) => {
  if (observer) observer.observe(element);
  else element.classList.add("visible");
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
