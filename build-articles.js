/* ===================================================================
   Get Cultrd — Article page generator.

   Every article gets its own real, standalone HTML page (intentionally
   NOT added to the main nav bar — reachable only by clicking through
   from Home, Archive, or Search).

   Everything in this project lives FLAT in one folder on purpose (no
   css/, js/, or articles/ subfolders) — GitHub's drag-and-drop upload
   UI can silently flatten subfolders, which breaks relative links.
   Keeping everything at one level makes re-uploading foolproof.

   Reads data.js and writes one file per article, right next to it.
   Re-run any time you replace the Lorem Ipsum in data.js:

       node build-articles.js

   Requires Node.js. No other dependencies.
=================================================================== */

const fs = require("fs");
const path = require("path");
const { ARTICLES } = require("./data.js");

const OUT_DIR = __dirname;

const ASIDE_LABELS = ["A Closer Look", "Worth Knowing"];

function template(article) {
  const [p1, p2, p3] = article.body;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${article.title} — Get Cultrd</title>
<meta name="description" content="${article.excerpt.replace(/"/g, "&quot;")}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Baloo+2:wght@500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav class="gc-topbar">
  <div class="gc-nav-inner">
    <a class="brand-link" href="index.html">Get Cultrd</a>
    <ul class="gc-nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="search.html">Search</a></li>
      <li><a href="games.html">Games</a></li>
      <li><a href="archive.html">Archive</a></li>
      <li><a href="about.html">About Us</a></li>
    </ul>
  </div>
</nav>

<div class="article-page">
  <a class="back-link" href="index.html">&larr; Back to Home</a>

  <span class="article-eyebrow">${article.categoryName} &middot; ${article.monthLabel}</span>
  <h1 class="article-headline">${article.title}</h1>
  <p class="article-byline">By the Get Cultrd Editors</p>

  <img class="cover" src="${article.cover}" alt="${article.categoryName} cover">
  <p class="lede">${p1}</p>

  <h2 class="article-aside-label">${ASIDE_LABELS[0]}</h2>
  <img class="secondary" src="${article.secondaryImage}" alt="${article.categoryName} detail">
  <p>${p2}</p>

  <h2 class="article-aside-label">${ASIDE_LABELS[1]}</h2>
  <p>${p3}</p>

  <a class="gc-btn back-home-btn" href="index.html">&larr; Back to Home</a>
</div>

<footer class="gc-footer">&copy; 2026 GET CULTRD &middot; Placeholder text &amp; images — swap freely.</footer>

</body>
</html>
`;
}

let count = 0;
ARTICLES.forEach(article => {
  const filePath = path.join(OUT_DIR, `${article.id}.html`);
  fs.writeFileSync(filePath, template(article), "utf8");
  count++;
});

console.log(`Generated ${count} article pages in ${OUT_DIR}`);
