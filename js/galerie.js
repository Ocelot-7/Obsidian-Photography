function generateRandomGalerie(count = 25) {
  const container = document.getElementById("galerie-random");
  if (!container) return;

  let allPhotos = [];

  for (const category in photos) {
    photos[category].forEach(filename => {
      allPhotos.push({ category, filename });
    });
  }

  allPhotos.sort(() => Math.random() - 0.5);
  const selection = allPhotos.slice(0, count);

  selection.forEach((item, i) => {
    const link = document.createElement("a");
    link.href = `photo.html?cat=${item.category}&img=${item.filename}`;

    const img = document.createElement("img");
    img.src = `${CLOUD}/${item.filename}`;


    link.appendChild(img);
    container.appendChild(link);

    setTimeout(() => {
      img.classList.add("visible");
    }, i * 100);
  });
}

generateRandomGalerie(25);


