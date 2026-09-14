const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const form = document.querySelector("#ai-search");
const prompt = form?.querySelector("[name='prompt']");
const result = document.querySelector("#ai-result");
const resultTitle = document.querySelector("[data-result-title]");
const resultStatus = document.querySelector("[data-result-status]");
const progress = document.querySelector("[data-progress]");
const resultSteps = [...document.querySelectorAll("[data-result-step]")];
let demoTimers = [];

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

const clearDemo = () => {
  demoTimers.forEach(window.clearTimeout);
  demoTimers = [];
  resultSteps.forEach((step) => step.classList.remove("active", "done"));
  if (progress) progress.style.width = "0";
};

const runDemo = (idea) => {
  if (!result || !idea) return;
  clearDemo();
  result.hidden = false;
  if (resultTitle) resultTitle.textContent = idea;
  if (resultStatus) resultStatus.textContent = "جاري التحليل...";
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const delay = reducedMotion ? 20 : 650;
  resultSteps.forEach((step, index) => {
    demoTimers.push(window.setTimeout(() => {
      if (index > 0) resultSteps[index - 1].classList.add("done");
      step.classList.add("active");
      if (progress) progress.style.width = `${((index + 1) / resultSteps.length) * 100}%`;
      if (resultStatus) resultStatus.textContent = index === resultSteps.length - 1 ? "النتيجة جاهزة" : `الخطوة ${index + 1} من ${resultSteps.length}`;
      if (index === resultSteps.length - 1) {
        demoTimers.push(window.setTimeout(() => step.classList.add("done"), delay));
      }
    }, delay * (index + 1)));
  });
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && document.activeElement === prompt) form.requestSubmit();
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
  const idea = prompt?.value.trim();
  if (!idea) return prompt?.focus();
  runDemo(idea);
});

const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 }) : null;
document.querySelectorAll(".reveal").forEach((element) => observer ? observer.observe(element) : element.classList.add("visible"));
document.querySelector("[data-year]").textContent = new Date().getFullYear();
