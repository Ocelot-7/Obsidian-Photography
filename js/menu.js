const menuHTML = `
<a href="index.html" class="logo">Obsidian Photography - 狐</a>

<div class="header-line"></div>

<nav class="menu">
  <a href="index.html">Home</a>

  <div class="dropdown">
    <span>Photos 写真</span>
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
    <span>Colors 色</span>
    <div class="submenu">
      <a href="index-orange.html">Orange 橙</a>
      <a href="index-rouge.html">Red 赤</a>
      <a href="index-bleu.html">Blue 青</a>
      <a href="index-rose.html">Pink ピンク</a>
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