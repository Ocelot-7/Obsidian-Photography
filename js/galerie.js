// ─── Alt templates par catégorie ───────────────────────────────────────────
const altTemplates = {
  nippon:     (i) => `Japanese temple and street scene in Kyoto and Tokyo, Japan – photo ${i} – Obsidian Photography`,
  rouge:      (i) => `Red tones photography in Japan – photo ${i} – Obsidian Photography`,
  bleu:       (i) => `Blue tones photography in Japan – photo ${i} – Obsidian Photography`,
  orange:     (i) => `Orange tones photography in Japan – photo ${i} – Obsidian Photography`,
  vert:       (i) => `Green nature photography in Japan – photo ${i} – Obsidian Photography`,
  jaune:      (i) => `Yellow tones photography in Japan – photo ${i} – Obsidian Photography`,
  blackwhite: (i) => `Black and white photography in Japan – photo ${i} – Obsidian Photography`,
  bynight:    (i) => `Night photography in Japan – photo ${i} – Obsidian Photography`,
  city:       (i) => `Urban and street photography in Japan – photo ${i} – Obsidian Photography`,
  animals:    (i) => `Wildlife and animals photography in Japan – photo ${i} – Obsidian Photography`,
  buddha:     (i) => `Buddha and temple photography in Japan – photo ${i} – Obsidian Photography`,
  people:     (i) => `Portrait photography in Japan – photo ${i} – Obsidian Photography`,
  drawings:   (i) => `Digital illustration, Japanese inspired art – artwork ${i} – Obsidian Photography`,
  rose:       (i) => `Pink tones photography in Japan – photo ${i} – Obsidian Photography`,
};

// Fallback si catégorie inconnue
function getAlt(entry, category, index) {
  // Si l'entrée est un objet avec un alt personnalisé, on le prioritise
  if (typeof entry === "object" && entry.alt) return entry.alt;

  const template = altTemplates[category];
  if (template) return template(index + 1);

  return `Photography in Japan – photo ${index + 1} – Obsidian Photography`;
}

// ─── Mélange propre (Fisher-Yates) ─────────────────────────────────────────
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── Résout l'id d'une entrée (string ou objet) ─────────────────────────────
function resolveId(entry) {
  return typeof entry === "string" ? entry : entry.id;
}

// ─── Page de chaque catégorie (retour depuis photo.html) ────────────────────
const CATEGORY_PAGES = {
  nippon: "nippon.html", city: "city.html", animals: "animals.html",
  blackwhite: "blackwhite.html", bynight: "bynight.html", people: "people.html",
  buddha: "buddha.html", drawings: "artwork.html", me: "about.html",
  rouge: "index-rouge.html", rose: "index-rose.html", bleu: "index-bleu.html",
  orange: "index-orange.html", vert: "index-vert.html", jaune: "index-jaune.html",
};

// ─── Déduplique en tenant compte des objets et des strings ──────────────────
function deduplicatePhotos(list) {
  const seen = new Set();
  return list.filter(entry => {
    const id = resolveId(entry);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// ─── Masonry — horizontales sur 2 colonnes, hauteur ajustée au ratio réel ──
function layoutMasonryItem(item, img) {
  if (!img.naturalWidth || !img.naturalHeight) return;

  // dimensions intrinsèques exposées pour le SEO/accessibilité, même si le
  // rendu réel est piloté par la grille (width/height CSS)
  img.width = img.naturalWidth;
  img.height = img.naturalHeight;

  const grid = item.parentElement;
  if (!grid) return;

  const gridStyle = getComputedStyle(grid);
  const rowUnit = parseFloat(gridStyle.gridAutoRows) || 8;
  const gap = parseFloat(gridStyle.rowGap) || 24;

  const isLandscape = img.naturalWidth > img.naturalHeight;
  item.classList.toggle("landscape", isLandscape);
  // une horizontale occupe 2 colonnes : le navigateur reprend une version plus large
  if (img.srcset) img.sizes = isLandscape ? SIZES_LANDSCAPE : SIZES_PORTRAIT;

  const itemWidth = item.getBoundingClientRect().width;
  const renderedHeight = itemWidth * (img.naturalHeight / img.naturalWidth);
  const rowSpan = Math.ceil((renderedHeight + gap) / (rowUnit + gap));

  item.style.gridRowEnd = `span ${rowSpan}`;
}

function initMasonryItem(item, img) {
  // requestAnimationFrame : laisse le temps à l'élément d'être inséré dans le DOM
  // (createImageElement l'initialise avant que l'appelant ne l'ajoute à la grille)
  if (img.complete && img.naturalWidth) {
    requestAnimationFrame(() => layoutMasonryItem(item, img));
  } else {
    img.addEventListener("load", () => requestAnimationFrame(() => layoutMasonryItem(item, img)));
  }
}

let masonryResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(() => {
    document.querySelectorAll(".galerie a").forEach((item) => {
      const img = item.querySelector("img");
      if (img && img.complete && img.naturalWidth) layoutMasonryItem(item, img);
    });
  }, 200);
});

// ─── Création d'un élément image ────────────────────────────────────────────
// largeurs servies par Cloudinary pour la grille — le navigateur choisit selon
// la taille d'affichage et la densité d'écran (le 2500 px reste pour photo.html)
const GRID_WIDTHS = [600, 900, 1300, 1800];
const SIZES_PORTRAIT  = "(max-width: 640px) 50vw, 33vw";
const SIZES_LANDSCAPE = "(max-width: 640px) 100vw, 66vw";

function cloudUrl(width, id) {
  return `https://res.cloudinary.com/dhbmaw1bm/image/upload/w_${width},q_auto,f_auto/${id}`;
}

function createImageElement(entry, category, index) {
  const id  = resolveId(entry);
  const alt = getAlt(entry, category, index);

  const link = document.createElement("a");
  link.href = `photo.html?img=${encodeURIComponent(id)}&cat=${encodeURIComponent(category)}`;

  const img = document.createElement("img");
  img.srcset   = GRID_WIDTHS.map((w) => `${cloudUrl(w, id)} ${w}w`).join(", ");
  img.sizes    = SIZES_PORTRAIT;
  img.src      = cloudUrl(900, id);
  img.alt      = alt;
  img.loading  = "lazy";
  img.decoding = "async";
  img.classList.add("gallery-image");

  link.appendChild(img);
  initMasonryItem(link, img);

  // apparition en cascade une fois l'image arrivée (délai plafonné, sinon
  // les dernières photos d'une grande catégorie mettraient des secondes)
  const reveal = () => setTimeout(() => img.classList.add("visible"), Math.min(index, 12) * 60);
  if (img.complete && img.naturalWidth) reveal();
  else img.addEventListener("load", reveal, { once: true });

  return link;
}

// ─── HOME — mélange toutes les catégories ───────────────────────────────────
function generateHomeGalerie(count = 25) {
  const container = document.getElementById("galerie-random");
  if (!container || !photos) return;
  container.innerHTML = "";

  const allPhotos = Object.entries(photos).flatMap(([cat, list]) =>
    list.map(entry => ({ entry, category: cat }))
  );

  const seenIds = new Set();
  const unique  = [];
  for (const item of allPhotos) {
    const id = resolveId(item.entry);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      unique.push(item);
    }
  }

  const shuffled  = shuffleArray(unique);
  const selection = shuffled.slice(0, Math.min(count, shuffled.length));

  selection.forEach(({ entry, category }, i) => {
    const element = createImageElement(entry, category, i);
    container.appendChild(element);
  });
}

// ─── HERO — photos aléatoires à chaque chargement de la home ───────────────
// piochées uniquement dans "nippon" — pas de portrait de Thomas, sélection plus ciblée
const HERO_CATEGORIES = ["nippon"];

function populateHeroSlides(count = 5) {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length || !photos) return;

  const allPhotos = HERO_CATEGORIES
    .filter((cat) => photos[cat])
    .flatMap((cat) => photos[cat].map(entry => ({ entry, category: cat })));

  const seenIds = new Set();
  const unique  = [];
  for (const item of allPhotos) {
    const id = resolveId(item.entry);
    if (!seenIds.has(id)) {
      seenIds.add(id);
      unique.push(item);
    }
  }

  const shuffled  = shuffleArray(unique);
  const selection = shuffled.slice(0, Math.min(count, shuffled.length, slides.length));

  slides.forEach((slide, i) => {
    if (i >= selection.length) {
      slide.remove();
      return;
    }
    const { entry, category } = selection[i];
    const id = resolveId(entry);
    // seule la 1ère photo (visible) charge tout de suite ; les autres
    // attendent leur tour pour ne pas saturer le chargement initial
    slide.dataset.src = `https://res.cloudinary.com/dhbmaw1bm/image/upload/w_1920,q_auto,f_auto/${id}`;
    slide.dataset.alt = getAlt(entry, category, i);
  });

  const remaining = [...slides].filter((s) => s.dataset.src);
  if (!remaining.length) return;

  loadHeroSlide(remaining[0]);
  remaining[0].classList.add("active");
  if (remaining[1]) preloadHeroSlide(remaining[1]);
}

function loadHeroSlide(slide) {
  if (!slide || slide.src) return;
  slide.src = slide.dataset.src;
  slide.alt = slide.dataset.alt;
  slide.fetchPriority = "high";
}

function preloadHeroSlide(slide) {
  if (!slide || !slide.dataset.src || slide.dataset.preloaded) return;
  slide.dataset.preloaded = "1";
  new Image().src = slide.dataset.src;
}

function advanceHeroSlide(currentIndex) {
  const slides = [...document.querySelectorAll(".hero-slide")];
  if (!slides.length) return currentIndex;

  const nextIndex = (currentIndex + 1) % slides.length;
  loadHeroSlide(slides[nextIndex]);
  slides[currentIndex].classList.remove("active");
  slides[nextIndex].classList.add("active");

  const followingIndex = (nextIndex + 1) % slides.length;
  preloadHeroSlide(slides[followingIndex]);

  return nextIndex;
}

// ─── INDEX TILES — une photo random par catégorie ──────────────────────────
function populateIndexTiles() {
  document.querySelectorAll(".index-tile").forEach((tile) => {
    const category = tile.dataset.category;
    const list = photos[category];
    if (!list || !list.length) return;

    const entry = list[Math.floor(Math.random() * list.length)];
    const id = resolveId(entry);
    const img = tile.querySelector("img");

    img.src = `${CLOUD_THUMB}/${id}`;
    img.alt = getAlt(entry, category, 0);
  });
}

// ─── SCATTER — cartes photo éparpillées, façon mood board ──────────────────
function pickRandomPhoto() {
  const categories = Object.keys(photos);
  const category = categories[Math.floor(Math.random() * categories.length)];
  const list = photos[category];
  const entry = list[Math.floor(Math.random() * list.length)];
  return { id: resolveId(entry), alt: getAlt(entry, category, 0) };
}

function shuffleScatterCard(card) {
  const img = card.querySelector("img");
  const { id, alt } = pickRandomPhoto();

  const preload = new Image();
  preload.onload = () => {
    img.classList.remove("visible");
    setTimeout(() => {
      img.src = preload.src;
      img.alt = alt;
      requestAnimationFrame(() => img.classList.add("visible"));
    }, 700);
  };
  preload.src = `${CLOUD_THUMB}/${id}`;
}

function populateScatterCards() {
  document.querySelectorAll(".scatter-card").forEach((card) => {
    const img = card.querySelector("img");
    const { id, alt } = pickRandomPhoto();
    img.src = `${CLOUD_THUMB}/${id}`;
    img.alt = alt;
    img.addEventListener("load", () => img.classList.add("visible"), { once: true });
  });
}

// ─── CATEGORY ───────────────────────────────────────────────────────────────
function generateCategoryGalerie(category, count = 14) {
  const container = document.getElementById("galerie-random");
  if (!container || !photos[category]) return;
  container.innerHTML = "";

  const unique    = deduplicatePhotos(photos[category]);
  const shuffled  = shuffleArray(unique);
  const selection = shuffled.slice(0, Math.min(count, shuffled.length));

  selection.forEach((entry, i) => {
    const element = createImageElement(entry, category, i);
    container.appendChild(element);
  });
}