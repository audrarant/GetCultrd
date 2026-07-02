/* ===================================================================
   Get Cultrd — Shared site behavior (nav highlight, card markup,
   tarot dragon flip card). Loaded on every page after data.js.
   Articles live on their own real pages (articles/*.html, generated
   by build-articles.js), reached only by clicking through — never
   from the main nav.
=================================================================== */

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

// Simple placeholder line-art dragon (swap for real art whenever ready).
const DRAGON_SVG = `
  <svg class="tarot-dragon-art" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M15 90 Q 25 60, 45 65 T 75 55 Q 90 50, 85 35"/>
    <path d="M85 35 Q 95 30, 100 20 Q 102 28, 108 25"/>
    <path d="M92 22 L 96 10"/>
    <circle cx="93" cy="27" r="1.6" fill="currentColor" stroke="none"/>
    <path d="M45 65 L 42 55 M55 60 L 52 50 M65 57 L 63 47"/>
    <path d="M15 90 Q 5 95, 8 85 Q 12 78, 18 83"/>
    <path d="M35 68 L 32 80 M60 58 L 58 70"/>
  </svg>`;

document.addEventListener("DOMContentLoaded", () => {
  highlightActiveNav();
  initTarotCard();
});

/* ---------- Nav ---------- */
function highlightActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".gc-nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === path) link.classList.add("active");
  });
}

/* ---------- Card markup ---------- */

function tarotStaticCardHTML(article, numeral) {
  return `
    <a class="tarot-card-static" href="${articleUrl(article)}">
      <span class="tarot-numeral">${numeral}</span>
      <img src="${article.cover}" alt="${article.categoryName} cover">
      <span class="tarot-name">${article.categoryName}</span>
    </a>`;
}

function featureCardHTML(article) {
  return `
    <a class="tarot-card-static featured" href="${articleUrl(article)}">
      <span class="tarot-numeral">&#9733;</span>
      <img src="${article.cover}" alt="${article.categoryName} cover">
      <span class="tarot-name">${article.categoryName}</span>
      <p class="tarot-excerpt">${article.excerpt}</p>
    </a>`;
}

function archiveCardHTML(article) {
  return `
    <a class="archive-card" href="${articleUrl(article)}">
      <img src="${article.cover}" alt="${article.categoryName} cover">
      <div class="archive-card-body">
        <span class="category-tag">${article.categoryName}</span>
        <h4>${article.title}</h4>
      </div>
    </a>`;
}

/* ---------- Home page: featured card + tarot grid ---------- */
function renderHomeLayout(monthKey) {
  const { feature, ring } = getHomeLayout(monthKey);

  const featureEl = document.getElementById("featureCardSlot");
  if (featureEl && feature) featureEl.innerHTML = featureCardHTML(feature);

  const gridEl = document.getElementById("tarotGrid");
  if (!gridEl) return;

  const firstFour = ring.slice(0, 4).map((a, i) => tarotStaticCardHTML(a, ROMAN_NUMERALS[i])).join("");
  const lastFour = ring.slice(4, 8).map((a, i) => tarotStaticCardHTML(a, ROMAN_NUMERALS[i + 4])).join("");

  const dragonHTML = `
    <div class="tarot-card-wrap">
      <div class="tarot-card" id="dragonCard" tabindex="0" role="button" aria-label="Flip the dragon card for a spiritual fact">
        <div class="tarot-card-inner">
          <div class="tarot-face tarot-front">
            <span class="tarot-numeral">0</span>
            ${DRAGON_SVG}
            <span class="tarot-label">The Dragon</span>
            <span class="tarot-hint">Tap to reveal</span>
          </div>
          <div class="tarot-face tarot-back">
            <span class="tarot-numeral">&middot;&middot;&middot;</span>
            <p class="tarot-fact" id="dragonFactText">Tap again to draw another.</p>
            <span class="tarot-hint">A Cultrd Fortune</span>
          </div>
        </div>
      </div>
    </div>`;

  gridEl.innerHTML = firstFour + dragonHTML + lastFour;
  initTarotCard();
}

/* ---------- Tarot dragon flip card ---------- */
function initTarotCard() {
  const card = document.getElementById("dragonCard");
  if (!card || card.dataset.bound) return;
  card.dataset.bound = "true";
  const backText = document.getElementById("dragonFactText");

  card.addEventListener("click", () => {
    const fact = SPIRITUAL_FACTS[Math.floor(Math.random() * SPIRITUAL_FACTS.length)];
    if (backText) backText.textContent = fact;
    card.classList.toggle("flipped");
  });

  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
}
