// Page d'une série : <body data-series="nippon">. Affiche toutes les photos de la
// série dans un ordre mélangé à chaque visite (le même ordre que la visionneuse).
(function () {
  const key = document.body.dataset.series;
  const series = findSeries(key);
  // retour depuis la visionneuse : on garde l'ordre affiché avant de partir
  const navigation = performance.getEntriesByType("navigation")[0];
  const list = seriesList(key, !(navigation && navigation.type === "back_forward"));
  const grid = document.getElementById("grid");
  const narrow = matchMedia("(max-width: 760px)");

  document.getElementById("series-count").textContent =
    `${list.length} image${list.length > 1 ? "s" : ""}`;

  // chaque photo : <figure> avec son lien et son petit numéro en dessous (comme sur l'accueil)
  const figures = list.map((entry, i) => {
    const fig = document.createElement("figure");
    const link = document.createElement("a");
    link.href = photoHref(entry, key);
    const cap = document.createElement("figcaption");
    cap.className = "label";
    cap.textContent = pad(i + 1);

    const img = document.createElement("img");
    img.alt = entryAlt(entry, `${series.name} ${series.jp} — photo ${i + 1}`);
    img.loading = "lazy";
    img.decoding = "async";
    img.sizes = "(max-width: 760px) 100vw, 60vw";
    img.srcset = srcset(entry);
    img.src = url(1200, entry);
    const ready = () => {
      // remplace le ratio provisoire (CSS) par le vrai ratio largeur / hauteur de la photo
      fig.style.setProperty("--r", img.naturalWidth / img.naturalHeight);
      img.classList.add("loaded");
    };
    if (img.complete && img.naturalWidth) ready();
    else img.addEventListener("load", ready, { once: true });

    link.append(img);
    fig.append(link, cap);
    return fig;
  });

  // rythme éditorial : une grande photo, puis deux, puis trois, et on recommence
  // (sur mobile : une, puis deux)
  const layout = () => {
    const pattern = narrow.matches ? [1, 2] : [1, 2, 3];
    const rows = [];
    for (let i = 0, p = 0; i < figures.length; p++) {
      const n = pattern[p % pattern.length];
      const row = document.createElement("div");
      row.className = n === 1 ? "row single" : "row";
      row.append(...figures.slice(i, i + n));
      rows.push(row);
      i += n;
    }
    grid.replaceChildren(...rows);
  };
  narrow.addEventListener("change", layout);
  layout();

  // série suivante, en boucle dans son groupe (séries ou couleurs)
  const group = SERIES.includes(series) ? SERIES : COLORS;
  const next = group[(group.indexOf(series) + 1) % group.length];
  const nextEl = document.getElementById("series-next");
  nextEl.innerHTML =
    `<span class="label" data-fr="Série suivante">Next series</span><a href="${next.href}">${nameHTML(next)}<span class="jp">${next.jp}</span> →</a>`;
  applyLang(nextEl);
})();
