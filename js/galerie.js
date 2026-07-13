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

// ─── Création d'un élément image ────────────────────────────────────────────
function createImageElement(entry, category, index) {
  const id  = resolveId(entry);
  const alt = getAlt(entry, category, index);

  const link = document.createElement("a");
  link.href = `photo.html?img=${id}`;

  const img = document.createElement("img");
  img.src      = `${CLOUD}/${id}`;
  img.alt      = alt;
  img.loading  = "lazy";
  img.decoding = "async";
  img.classList.add("gallery-image");

  link.appendChild(img);

  setTimeout(() => {
    img.classList.add("visible");
  }, index * 60);

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