// HOME — mélange toutes les photos
function generateHomeGalerie(count = 25) {
  const container = document.getElementById("galerie-random");
  if (!container) return;

  container.innerHTML = "";

  let allPhotos = [];

  for (const category in photos) {
    photos[category].forEach(filename => {
      allPhotos.push(filename);
    });
  }

  const shuffled = allPhotos.sort(() => Math.random() - 0.5);
  const selection = shuffled.slice(0, count);

  selection.forEach((filename, i) => {
    const link = document.createElement("a");
    link.href = `photo.html?img=${filename}`;

    const img = document.createElement("img");
    img.src = `${CLOUD}/${filename}`;

    link.appendChild(img);
    container.appendChild(link);

    setTimeout(() => {
      img.classList.add("visible");
    }, i * 60);
  });
}


// CATÉGORIE — une seule catégorie
function generateCategoryGalerie(category, count = 14) {
  const container = document.getElementById("galerie-random");
  if (!container) return;

  container.innerHTML = "";

  const list = photos[category];
  if (!list) return;

  const shuffled = [...list].sort(() => Math.random() - 0.5);
  const selection = shuffled.slice(0, count);

  selection.forEach((filename, i) => {
    const link = document.createElement("a");
    link.href = `photo.html?img=${filename}`;

    const img = document.createElement("img");
    img.src = `${CLOUD}/${filename}`;

    link.appendChild(img);
    container.appendChild(link);

    setTimeout(() => {
      img.classList.add("visible");
    }, i * 60);
  });
}
