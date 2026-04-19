/**
 * LastOne — runtime logic
 * Depends on: i18n.js (loaded before this file, exposes window.I18N + LANGUAGES + DEFAULT_LANG)
 */

// ============== Nav scroll effect ==============
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 40) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// ============== FAQ accordion ==============
document.querySelectorAll(".faq").forEach(faq => {
  faq.addEventListener("click", () => {
    faq.classList.toggle("open");
  });
});

// ============== Tier CTA buttons → scroll to final CTA ==============
document.querySelectorAll(".tier-cta").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("cta").scrollIntoView({ behavior: "smooth" });
  });
});

// ============== Scroll reveal (assemblage) ==============
document.documentElement.classList.add("js");

document.querySelectorAll(
  ".section-header, .cta-content, footer .footer-grid"
).forEach(el => el.classList.add("reveal"));

document.querySelectorAll(
  ".features, .timeline, .pricing-grid, .pricing-notes, .included-wrapper, .addons-grid, .faq-grid"
).forEach(el => el.classList.add("reveal-stagger"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal, .reveal-stagger").forEach(el => {
  revealObserver.observe(el);
});

// ============== I18N — language switching ==============
function applyLang(lang) {
  const dict = window.I18N && window.I18N[lang];
  if (!dict) return;

  document.documentElement.lang = lang;
  try { localStorage.setItem("lang", lang); } catch (e) {}

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const [key, attr] = el.getAttribute("data-i18n-attr").split(":");
    if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
  });

  // Sync <title> from data-i18n
  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) document.title = titleEl.textContent;

  // Update toggle visual state
  document.querySelectorAll("[data-lang-opt]").forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-lang-opt") === lang);
  });
}

let savedLang = window.DEFAULT_LANG || "en";
try {
  const stored = localStorage.getItem("lang");
  if (stored && window.LANGUAGES && window.LANGUAGES.includes(stored)) {
    savedLang = stored;
  }
} catch (e) {}
applyLang(savedLang);

const langToggle = document.getElementById("lang-toggle");
if (langToggle && window.LANGUAGES) {
  langToggle.addEventListener("click", () => {
    const current = document.documentElement.lang;
    const idx = window.LANGUAGES.indexOf(current);
    const next = window.LANGUAGES[(idx + 1) % window.LANGUAGES.length];
    applyLang(next);
  });
}
