const footerHTML = `
<footer class="footer">

  <div class="footer-content">

    <div class="footer-left">
      © 2026 Obsidian Photography
    </div>

    <div class="footer-right">
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>

    <a href="https://www.instagram.com/obsidian_photography_" target="_blank">
      Instagram
    </a>
  </div>
    </div>

  </div>



</footer>
`;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("footer").innerHTML = footerHTML;
});
