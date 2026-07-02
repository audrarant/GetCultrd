/* ===================================================================
   Get Cultrd — Games page interactivity (would-you-rather, word of
   the month, crossword). Runner game lives in game.js.
=================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initWouldYouRather();
  initWordOfMonth();
  initInterviews();
  initCrossword();
});

/* ---------- Would You Rather ---------- */
let wyrIndex = 0;

function initWouldYouRather() {
  renderWYR();
  const btn = document.getElementById("wyrNextBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      wyrIndex = (wyrIndex + 1) % WOULD_YOU_RATHER.length;
      renderWYR();
    });
  }
}

function renderWYR() {
  const pair = WOULD_YOU_RATHER[wyrIndex];
  const a = document.getElementById("wyrOptionA");
  const b = document.getElementById("wyrOptionB");
  if (a) a.textContent = pair.a;
  if (b) b.textContent = pair.b;
}

/* ---------- Reader interviews (kept intentionally small) ---------- */
function initInterviews() {
  const list = document.getElementById("interviewList");
  if (!list) return;
  list.innerHTML = READER_RESPONSES.map(
    r => `<div class="interview-item"><strong>${r.name}:</strong> "${r.answer}"</div>`
  ).join("");
}

/* ---------- Word of the month ---------- */
function initWordOfMonth() {
  const panel = document.getElementById("wordOfMonthPanel");
  if (!panel) return;
  const w = WORD_OF_THE_MONTH;
  panel.innerHTML = `
    <h2>Word of the Month</h2>
    <div class="word-title">${w.word} <small style="font-size:1rem; color:var(--ink-soft);">${w.pronunciation}</small></div>
    <p>${w.definition}</p>
    <p><em>Origin:</em> ${w.origin}</p>
    <p><em>Use it:</em> ${w.useIt}</p>`;
}

/* ---------- Crossword-style word puzzle ---------- */
function initCrossword() {
  const area = document.getElementById("crosswordArea");
  if (!area) return;

  area.innerHTML = CROSSWORD.words.map(w => `
    <div class="crossword-row" data-answer="${w.answer}">
      <div class="crossword-clue-num">${w.number}</div>
      <div class="crossword-boxes">
        ${w.answer.split("").map((_, i) =>
          `<input maxlength="1" data-index="${i}" aria-label="Letter ${i + 1}">`
        ).join("")}
      </div>
      <div class="crossword-clue-text">${w.clue}</div>
    </div>
  `).join("");

  area.querySelectorAll(".crossword-row").forEach(row => {
    const inputs = row.querySelectorAll("input");
    inputs.forEach((input, i) => {
      input.addEventListener("input", () => {
        input.value = input.value.toUpperCase().slice(0, 1);
        if (input.value && inputs[i + 1]) inputs[i + 1].focus();
      });
      input.addEventListener("keydown", e => {
        if (e.key === "Backspace" && !input.value && inputs[i - 1]) inputs[i - 1].focus();
      });
    });
  });

  const checkBtn = document.getElementById("checkCrosswordBtn");
  const resultEl = document.getElementById("crosswordResult");
  if (checkBtn) {
    checkBtn.addEventListener("click", () => {
      let correctCount = 0;
      area.querySelectorAll(".crossword-row").forEach(row => {
        const answer = row.dataset.answer;
        const inputs = [...row.querySelectorAll("input")];
        const guess = inputs.map(i => i.value.toUpperCase()).join("");
        const isCorrect = guess === answer;
        if (isCorrect) correctCount++;
        inputs.forEach(i => {
          i.classList.remove("correct", "incorrect");
          i.classList.add(isCorrect ? "correct" : "incorrect");
        });
      });
      resultEl.textContent = `${correctCount} / ${CROSSWORD.words.length} correct`;
    });
  }
}
