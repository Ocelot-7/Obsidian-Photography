// Mélange propre (Fisher-Yates, meilleur que sort random)
function shuffleArray(array) {
  const arr = [...array]; // copie pour ne pas modifier l'original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatCategoryName(category) {
  const map = {
    street: "Street Photography",
    night: "Night Photography",
    blackwhite: "Black & White Photography",
    city: "City Photography",
    animals: "Wildlife Photography",
    japan: "Japan Photography"
  };

  return map[category] || `${category} Photography`;
}

// Création d'une image (évite de répéter le code)
function createImageElement(filename, category, index) {
  const link = document.createElement("a");
  link.href = `photo.html?img=${filename}`;

  const img = document.createElement("img");
  img.src = `${CLOUD}/${filename}`;
  const location = "Japan";
const categoryName = formatCategoryName(category);

img.alt = category === "japan"
  ? `${categoryName} – Obsidian Photography`
  : `${categoryName} in ${location} – Obsidian Photography`;
  img.loading = "lazy";
  img.decoding = "async";
  img.classList.add("gallery-image");

  link.appendChild(img);

  setTimeout(() => {
    img.classList.add("visible");
  }, index * 60);

  return link;
}


// HOME — mélange toutes les photos (SANS doublons)
function generateHomeGalerie(count = 25) {
  const container = document.getElementById("galerie-random");
  if (!container || !photos) return;

  

  container.innerHTML = "";

  // Fusionne toutes les photos de toutes les catégories
  const allPhotos = Object.values(photos).flat();

  // Supprime les doublons éventuels
  const uniquePhotos = [...new Set(allPhotos)];

  // Mélange
  const shuffled = shuffleArray(uniquePhotos);

  // Sélection limitée
  const selection = shuffled.slice(0, Math.min(count, shuffled.length));

 selection.forEach((filename, i) => {
  const element = createImageElement(filename, "japan", i);
  container.appendChild(element);
  });
}


// CATÉGORIE — une seule catégorie (SANS doublons)
function generateCategoryGalerie(category, count = 14) {
  const container = document.getElementById("galerie-random");
  if (!container || !photos[category]) return;

  container.innerHTML = "";

  // Copie + suppression des doublons
  const uniquePhotos = [...new Set(photos[category])];

  // Mélange propre
  const shuffled = shuffleArray(uniquePhotos);

  // Sélection
  const selection = shuffled.slice(0, Math.min(count, shuffled.length));

 selection.forEach((filename, i) => {
  const element = createImageElement(filename, category, i);
  container.appendChild(element);
  });
}
