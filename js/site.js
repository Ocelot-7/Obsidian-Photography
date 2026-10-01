// Socle commun à toutes les pages : séries, images, thème, menu, pied de page.
// Les photos viennent de js/photos.js.

const SERIES = [
  { key: "nippon",     name: "Nippon",        jp: "日本", href: "nippon.html" },
  { key: "city",       name: "City",          jp: "街",   href: "city.html" },
  { key: "animals",    name: "Animals",       jp: "動物", href: "animals.html" },
  { key: "blackwhite", name: "Black & White", jp: "白黒", href: "blackwhite.html" },
  { key: "bynight",    name: "By Night",      jp: "夜",   href: "bynight.html" },
  { key: "people",     name: "People",        jp: "人々", href: "people.html" },
  { key: "buddha",     name: "Buddha",        jp: "仏々", href: "buddha.html" },
  { key: "drawings",   name: "Artwork",       jp: "図",   href: "artwork.html" },
];
const COLORS = [
  { key: "orange", name: "Orange",               jp: "橙",   href: "index-orange.html" },
  { key: "rouge",  name: "Red",    fr: "Rouge",   jp: "赤",   href: "index-rouge.html" },
  { key: "bleu",   name: "Blue",   fr: "Bleu",    jp: "青",   href: "index-bleu.html" },
  { key: "jaune",  name: "Yellow", fr: "Jaune",   jp: "黄色", href: "index-jaune.html" },
  { key: "vert",   name: "Green",  fr: "Vert",    jp: "緑",   href: "index-vert.html" },
];
// Rose : page conservée mais hors menu tant qu'elle n'a qu'une photo
const EXTRA_SERIES = [{ key: "rose", name: "Pink", fr: "Rose", jp: "桃", href: "index-rose.html" }];
const ALL_SERIES = [...SERIES, ...COLORS, ...EXTRA_SERIES];
const findSeries = (key) => ALL_SERIES.find((s) => s.key === key);

// ─── LANGUE — anglais par défaut ; le français est porté par l'attribut data-fr ──
// (le texte anglais est celui écrit dans la page, mémorisé dans data-en au premier passage)
let lang = document.documentElement.lang === "fr" ? "fr" : "en";
const tr = (en, fr) => `<span data-fr="${fr}">${en}</span>`;
const nameHTML = (s) => (s.fr ? tr(s.name, s.fr) : s.name);
function applyLang(root = document) {
  root.querySelectorAll("[data-fr]").forEach((el) => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === "fr" ? el.dataset.fr : el.dataset.en;
  });
}
function setLang(next) {
  lang = next === "fr" ? "fr" : "en";
  document.documentElement.lang = lang;
  try { localStorage.setItem("v2-lang", lang); } catch (e) {}
  applyLang();
  document.querySelectorAll("[data-lang-toggle]").forEach((b) => {
    b.textContent = lang === "en" ? "FR" : "EN";
    b.setAttribute("aria-label", lang === "en" ? "Passer en français" : "Switch to English");
  });
}

// ─── IMAGES ─────────────────────────────────────────────────────────────────
const resolveId = (entry) => (typeof entry === "string" ? entry : entry.id);
const entryAlt = (entry, fallback) => (typeof entry === "object" && entry.alt ? entry.alt : fallback);
// c_limit : Cloudinary ne dépasse jamais la taille d'origine (pas d'agrandissement flou)
const url = (w, entry) =>
  `https://res.cloudinary.com/dhbmaw1bm/image/upload/c_limit,w_${w},q_auto,f_auto/${resolveId(entry)}`;
const WIDTHS = [500, 800, 1200, 1600, 2000, 2600, 3200];
// le navigateur choisit la largeur selon la taille affichée ET la densité de l'écran (retina)
const srcset = (entry) => WIDTHS.map((w) => `${url(w, entry)} ${w}w`).join(", ");
const photoHref = (entry, key) =>
  `photo.html?img=${encodeURIComponent(resolveId(entry))}&cat=${encodeURIComponent(key)}`;

const pick = (list, n) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
};
const unique = (list) => {
  const seen = new Set();
  return list.filter((entry) => !seen.has(resolveId(entry)) && seen.add(resolveId(entry)));
};
const pad = (n) => String(n).padStart(2, "0");

// ─── ORDRE DES PHOTOS D'UNE SÉRIE — mélangé à chaque visite de la page de série ──
// Le tirage est mémorisé pour l'onglet (sessionStorage), afin que la visionneuse
// suive exactement le même ordre et les mêmes numéros que la page d'où l'on vient.
function seededShuffle(list, seed) {
  const random = () => {   // mulberry32 : petit générateur reproductible
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// reshuffle = true : nouveau tirage (page de série) ; sinon on reprend le tirage en cours
function seriesList(key, reshuffle = false) {
  const list = unique(photos[key] || []);
  let seed = 0;
  try {
    seed = Number(sessionStorage.getItem(`v2-order-${key}`)) || 0;
    if (reshuffle || !seed) {
      seed = Math.floor(Math.random() * 2147483646) + 1;
      sessionStorage.setItem(`v2-order-${key}`, seed);
    }
  } catch (e) {}
  return seed ? seededShuffle(list, seed) : list;
}

// ─── PHOTOS CHOISIES (js/covers.js, chargé seulement par les pages qui en ont besoin) ──
const covers = () => (typeof COVERS !== "undefined" ? COVERS : {});
// retrouve une photo de photos.js à partir de son identifiant, avec la série qui la contient
const findPhoto = (id) => {
  for (const cat of ALL_SERIES) {
    const entry = (photos[cat.key] || []).find((e) => resolveId(e) === id);
    if (entry) return { entry, cat };
  }
  return null;
};
// photos masquées depuis admin.html : retirées de leur série pour tout le site
// (photos.js n'est pas modifié ; la page admin, elle, garde tout pour pouvoir les remettre)
if (!window.KEEP_HIDDEN_PHOTOS) {
  for (const [key, ids] of Object.entries(covers().hidden || {})) {
    if (photos[key]) photos[key] = photos[key].filter((e) => !ids.includes(resolveId(e)));
  }
}
const coverList = (ids) => (ids || []).map(findPhoto).filter(Boolean);
const homeCovers = () => coverList(covers().home).map((p) => p.entry);
const seriesCovers = (key) => coverList((covers().series || {})[key]).map((p) => p.entry);
const selectionCovers = () => coverList(covers().selection);
const SEAL = `<span class="seal" aria-hidden="true"><span>狐</span></span>`;

// ─── THÈME — Sable par défaut ; le visiteur peut en changer avec les petits ronds ──
const THEMES = [
  { key: "sable",  color: "#DED4C3" },
  { key: "clair",  color: "#fafaf8" },
  { key: "sombre", color: "#0b0b0c" },
  { key: "grenat", color: "#3B0C00" },
  { key: "nuit",   color: "#03092E" },
];
const THEME_DOTS = `<span class="theme-dots" role="group" aria-label="Theme">${THEMES.map((t) =>
  `<button data-set-theme="${t.key}" style="--dot: ${t.color}" title="${t.key}" aria-label="${t.key}"></button>`).join("")}</span>`;
function setTheme(theme) {
  if (!THEMES.some((t) => t.key === theme)) theme = "sable";
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll("[data-set-theme]").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.setTheme === theme));
  try { localStorage.setItem("v2-theme", theme); } catch (e) {}
}

// ─── MENU + PANNEAU (sauf visionneuse : <body data-nav="none">) ─────────────
if (document.body.dataset.nav !== "none") {
  const li = (s) => `<li><a href="${s.href}">${nameHTML(s)}<span class="jp">${s.jp}</span></a></li>`;
  document.body.insertAdjacentHTML("afterbegin", `
<header class="nav" id="nav">
  <a class="logo" href="index.html"><span>ASHTAR</span>${SEAL}</a>
  <nav class="nav-links label">
    <button id="panel-toggle" aria-expanded="false" aria-controls="panel"><span class="when-closed" data-fr="Travaux">Works</span><span class="when-open" data-fr="Fermer">Close</span></button>
    <a class="hide-m" href="about.html" data-fr="À propos">About</a>
    <a class="hide-m" href="contact.html">Contact</a>
    <button class="label" data-lang-toggle></button>
  </nav>
</header>
<div class="panel wrap" id="panel" aria-hidden="true">
  <ul class="panel-series">${SERIES.map(li).join("")}</ul>
  <div class="panel-side">
    <h2 class="label" data-fr="Couleurs 色">Colors 色</h2>
    <ul>${COLORS.map(li).join("")}</ul>
    <h2 class="label" data-fr="Infos">Info</h2>
    <ul>
      <li><a href="about.html" data-fr="À propos">About</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <h2 class="label" data-fr="Thème">Theme</h2>
    ${THEME_DOTS}
  </div>
</div>`);

  const nav = document.getElementById("nav");
  const panel = document.getElementById("panel");
  const toggle = document.getElementById("panel-toggle");

  // menu transparent uniquement au-dessus d'une photo d'accueil
  const hero = document.querySelector(".hero");
  const onScroll = () => nav.classList.toggle("scrolled", !hero || window.scrollY > window.innerHeight * .7);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setPanel = (open) => {
    panel.classList.toggle("open", open);
    nav.classList.toggle("open", open);
    panel.setAttribute("aria-hidden", !open);
    toggle.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  toggle.addEventListener("click", () => setPanel(!panel.classList.contains("open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setPanel(false); });
}

// ─── PIED DE PAGE ───────────────────────────────────────────────────────────
const foot = document.getElementById("footer");
if (foot) {
  foot.className = "foot label";
  foot.innerHTML = `
  <span class="mark">${SEAL}© 2026 Ashtar Photography</span>
  ${THEME_DOTS}
  <nav>
    <a href="about.html" data-fr="À propos">About</a>
    <a href="contact.html">Contact</a>
    <a href="https://www.instagram.com/obsidian_photography_" target="_blank" rel="noopener">Instagram</a>
  </nav>`;
}

// emplacement libre pour les ronds de thème (visionneuse) : <span data-theme-dots></span>
document.querySelectorAll("[data-theme-dots]").forEach((el) => { el.outerHTML = THEME_DOTS; });
document.querySelectorAll("[data-set-theme]").forEach((b) =>
  b.addEventListener("click", () => setTheme(b.dataset.setTheme)));
setTheme(new URLSearchParams(location.search).get("theme") || document.documentElement.dataset.theme);

setLang(lang);
document.querySelectorAll("[data-lang-toggle]").forEach((b) =>
  b.addEventListener("click", () => setLang(lang === "en" ? "fr" : "en")));

// ─── APPARITION AU DÉFILEMENT ───────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); }
  });
}, { rootMargin: "0px 0px -8% 0px" });
const observeReveals = (root = document) =>
  root.querySelectorAll(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
observeReveals();
