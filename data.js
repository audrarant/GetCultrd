/* ===================================================================
   Get Cultrd — Shared Content Data
   All article text below is Lorem Ipsum placeholder copy, per request.
   Replace the LOREM blocks / titles with real content whenever ready —
   everything else on the site reads from this file automatically.
=================================================================== */

const CATEGORIES = [
  { key: "nature",     name: "Nature" },
  { key: "music",      name: "Music" },
  { key: "literature", name: "Literature" },
  { key: "theatre",    name: "Theatre" },
  { key: "fashion",    name: "Fashion" },
  { key: "language",   name: "Language" },
  { key: "art",        name: "Art" },
  { key: "history",    name: "History" },
  { key: "film",       name: "Film" }
];

// Most recent month first. "current: true" month is what shows on the homepage.
const MONTHS = [
  { key: "2026-07", label: "July 2026",  current: true },
  { key: "2026-06", label: "June 2026",  current: false },
  { key: "2026-05", label: "May 2026",   current: false }
];

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Curabitur pretium tincidunt lacus, ut interdum tellus elementum sagittis vitae.",
  "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.",
  "Nullam quis risus eget urna mollis ornare vel eu leo pellentesque.",
  "Aenean lacinia bibendum nulla sed consectetur, curabitur blandit tempus porttitor.",
  "Cras mattis consectetur purus sit amet fermentum, sed posuere consectetur est."
];

function loremParagraph(seed, count) {
  const words = [];
  for (let i = 0; i < count; i++) {
    words.push(LOREM_SENTENCES[(seed + i) % LOREM_SENTENCES.length]);
  }
  return words.join(" ");
}

// Build the full article catalog: 9 categories x however many issues exist.
const ARTICLES = [];
MONTHS.forEach((month, mIdx) => {
  CATEGORIES.forEach((cat, cIdx) => {
    const seed = mIdx * 9 + cIdx;
    const id = `${month.key}-${cat.key}`;
    const excerpt = loremParagraph(seed, 2);
    const body = [
      loremParagraph(seed, 4),
      loremParagraph(seed + 3, 4),
      loremParagraph(seed + 5, 3)
    ];
    ARTICLES.push({
      id,
      monthKey: month.key,
      monthLabel: month.label,
      category: cat.key,
      categoryName: cat.name,
      title: `${cat.name}, Cultrd: Lorem Ipsum Dispatch No. ${cIdx + 1}`,
      cover: `https://picsum.photos/seed/${cat.key}-${month.key}/700/900`,
      secondaryImage: `https://picsum.photos/seed/${cat.key}-${month.key}-b/600/700`,
      excerpt,
      body
    });
  });
});

function getCurrentMonthArticles() {
  const current = MONTHS.find(m => m.current);
  return ARTICLES.filter(a => a.monthKey === current.key);
}

function getArticleById(id) {
  return ARTICLES.find(a => a.id === id);
}

function getArticlesByMonth(monthKey) {
  return ARTICLES.filter(a => a.monthKey === monthKey);
}

// Every article lives on its own real page at articles/{id}.html
// (these pages are intentionally not added to the main nav bar).
function articleUrl(article) {
  return `${article.id}.html`;
}

// Front page layout: one featured story, plus 8 stories that ring
// the tarot dragon card in the 3x3 grid (dragon takes the center tile).
function getHomeLayout(monthKey) {
  const monthArticles = getArticlesByMonth(monthKey);
  const byCategory = key => monthArticles.find(a => a.category === key);
  const [featureCat, ...ringCats] = CATEGORIES.map(c => c.key);
  return {
    feature: byCategory(featureCat),
    ring: ringCats.map(byCategory)
  };
}

// Dragon "spiritual fact" cards — 8 possible flips, Lorem Ipsum placeholders.
const SPIRITUAL_FACTS = [
  "Lorem ipsum dolor sit amet: the universe conspires in curious, quiet ways.",
  "Consectetur adipiscing elit — every wandering path still leads somewhere sacred.",
  "Sed do eiusmod: stillness is not empty, it is simply listening.",
  "Tempor incididunt ut labore — what you seek is also, quietly, seeking you.",
  "Ut enim ad minim veniam: the moon keeps no secrets, only patience.",
  "Duis aute irure dolor — old stories live in new breath, again and again.",
  "Excepteur sint occaecat: gratitude is a language every culture speaks fluently.",
  "Cupidatat non proident — the smallest rituals often hold the deepest roots."
];

// ===================== GAMES PAGE CONTENT =====================

const WOULD_YOU_RATHER = [
  { a: "Learn every language on Earth", b: "Visit every country on Earth" },
  { a: "Only read plays for a year", b: "Only read poetry for a year" },
  { a: "Attend a concert in 1969", b: "Attend a concert in 2069" },
  { a: "Live in a museum after hours", b: "Live backstage in a theatre" }
];

const READER_RESPONSES = [
  { name: "J. from Helsinki", answer: "Every country, no question — I want the smell of the air to change." },
  { name: "M. from Austin", answer: "1969, obviously. I'd take grainy film over holograms any day." },
  { name: "A. from Manila", answer: "Backstage in a theatre — the chaos before curtain is its own art form." }
];

const WORD_OF_THE_MONTH = {
  word: "Sonder",
  pronunciation: "/ˈsɒn.dər/",
  definition: "The realization that each passerby has a life as vivid and complex as your own — lorem ipsum dolor sit amet.",
  origin: "Coined in The Dictionary of Obscure Sorrows; adopted informally across several languages.",
  useIt: "\"Walking through the archive today gave me such a strong sense of sonder.\""
};

// Non-article pages/sections indexed for site search.
const SITE_EXTRAS = [
  { title: "Would You Rather", type: "Game", snippet: "This month's would-you-rather questions, plus reader responses.", url: "games.html" },
  { title: `Word of the Month: ${WORD_OF_THE_MONTH.word}`, type: "Game", snippet: "This month's featured word, definition, and how to use it.", url: "games.html" },
  { title: "Culture Crossword", type: "Game", snippet: "A short crossword-style puzzle themed around this month's articles.", url: "games.html" },
  { title: "Printable Coloring Sheet", type: "Game", snippet: "Print out this month's coloring sheet.", url: "games.html" },
  { title: "Cultrd Runner: Around the World", type: "Game", snippet: "Jump obstacles and pass cultural checkpoints in the browser game.", url: "games.html" },
  { title: "About the Sisters", type: "About", snippet: "A little about the two sisters who make Get Cultrd.", url: "about.html" }
];

// Culture-themed crossword-style word puzzle: one numbered clue per word,
// rendered as its own row of letter boxes (no shared/interlocking cells,
// which keeps the placeholder puzzle simple and reliably solvable).
const CROSSWORD = {
  words: [
    { number: 1, answer: "OPERA",   clue: "A dramatic art form set entirely to music." },
    { number: 2, answer: "PALETTE", clue: "An artist's board of mixed colors." },
    { number: 3, answer: "SONNET",  clue: "A 14-line poem, often about love." },
    { number: 4, answer: "MASK",    clue: "Worn in classic theatre to show emotion." },
    { number: 5, answer: "FRESCO",  clue: "A painting made on wet plaster." }
  ]
};

// Allows this same file to be `require()`-d by the Node build script
// (build-articles.js) that generates the individual article pages,
// while remaining a plain script tag in the browser (module is
// undefined there, so this block is simply skipped).
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CATEGORIES, MONTHS, ARTICLES, SPIRITUAL_FACTS,
    getCurrentMonthArticles, getArticleById, getArticlesByMonth,
    articleUrl, getHomeLayout
  };
}
