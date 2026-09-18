const menuHTML = `
<a href="index.html" class="logo">Obsidian Photography - 狐</a>

<div class="header-line"></div>

<nav class="menu">
  <a href="index.html">Home</a>

  <div class="dropdown">
    <button type="button" aria-expanded="false" aria-haspopup="true">Photos 写真</button>
    <div class="submenu">
      <a href="nippon.html">Nippon</a>
      <a href="city.html">City</a>
      <a href="animals.html">Animals</a>
      <a href="blackwhite.html">Black&White</a>
      <a href="bynight.html">By Night</a>
      <a href="people.html">People 人々</a>
      <a href="buddha.html">Buddha 仏々</a>
    </div>
  </div>

  <div class="dropdown">
    <button type="button" aria-expanded="false" aria-haspopup="true">Colors 色</button>
    <div class="submenu">
      <a href="index-orange.html">Orange 橙</a>
      <a href="index-rouge.html">Red 赤</a>
      <a href="index-bleu.html">Blue 青</a>
      <!-- Rose masquée tant qu'elle n'a qu'une photo -->
      <!-- <a href="index-rose.html">Pink ピンク</a> -->
      <a href="index-jaune.html">Yellow 黄色</a>
      <a href="index-vert.html">Green 緑</a>
    </div>
  </div>

  <a href="artwork.html">Artwork - 図</a>
  <a href="about.html">About</a>
  <a href="contact.html">Contact</a>
</nav>
`;

document.getElementById("menu").innerHTML = menuHTML;

const closeDropdowns = () => {
  document.querySelectorAll(".dropdown.open").forEach((d) => {
    d.classList.remove("open");
    d.querySelector("button").setAttribute("aria-expanded", "false");
  });
};

document.querySelectorAll(".dropdown > button").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dropdown = trigger.parentElement;
    const isOpen = dropdown.classList.contains("open");
    closeDropdowns();
    if (!isOpen) {
      dropdown.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dropdown")) closeDropdowns();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDropdowns();
});
