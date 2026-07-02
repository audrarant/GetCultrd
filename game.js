/* ===================================================================
   Get Cultrd — "Cultrd Runner: Around the World"
   A simple no-internet-dino-style endless runner. Built with plain
   geometric shapes (no sprite art yet) so it's easy to reskin later:
   swap the draw functions below for images once you have character
   art. Jump with Space / Click / Tap. Clear checkpoints to "visit"
   a new culture as the world scrolls by.
=================================================================== */

(function () {
  const canvas = document.getElementById("gameCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GROUND_Y = 200;
  const GRAVITY = 0.62;
  const JUMP_VELOCITY = -12.5;
  const BASE_SPEED = 5;

  const CHECKPOINTS = [
    { name: "Paris" },
    { name: "Japan" },
    { name: "Egypt" },
    { name: "Kenya" },
    { name: "Mexico" },
    { name: "Russia" },
    { name: "Italy" },
    { name: "Ghana" },
    { name: "China" }
  ];

  let player, obstacles, speed, score, best, running, distanceSinceCheckpoint, banner;

  function resetGame() {
    player = { x: 70, y: GROUND_Y - 40, w: 34, h: 40, vy: 0, onGround: true };
    obstacles = [];
    speed = BASE_SPEED;
    score = 0;
    distanceSinceCheckpoint = 0;
    banner = null;
    running = true;
    best = Number(localStorage.getItem("gc_runner_best") || 0);
    spawnObstacle(true);
    updateScoreUI();
  }

  function spawnObstacle(first) {
    const gap = first ? 400 : 260 + Math.random() * 260;
    const lastX = obstacles.length ? obstacles[obstacles.length - 1].x : canvas.width;
    const height = 30 + Math.random() * 30;
    obstacles.push({
      x: Math.max(canvas.width, lastX + gap),
      y: GROUND_Y - height,
      w: 22 + Math.random() * 14,
      h: height
    });
  }

  function jump() {
    if (!running) {
      resetGame();
      return;
    }
    if (player.onGround) {
      player.vy = JUMP_VELOCITY;
      player.onGround = false;
    }
  }

  function update() {
    if (!running) return;

    player.vy += GRAVITY;
    player.y += player.vy;
    if (player.y >= GROUND_Y - player.h) {
      player.y = GROUND_Y - player.h;
      player.vy = 0;
      player.onGround = true;
    }

    obstacles.forEach(o => (o.x -= speed));
    if (obstacles.length && obstacles[0].x + obstacles[0].w < 0) obstacles.shift();
    if (obstacles.length < 3) spawnObstacle(false);

    for (const o of obstacles) {
      const pad = 6;
      if (
        player.x + pad < o.x + o.w &&
        player.x + player.w - pad > o.x &&
        player.y + pad < o.y + o.h &&
        player.y + player.h - pad > o.y
      ) {
        gameOver();
        return;
      }
    }

    score += speed * 0.12;
    speed = BASE_SPEED + Math.floor(score / 250) * 0.6;

    distanceSinceCheckpoint += speed;
    if (distanceSinceCheckpoint > 600) {
      distanceSinceCheckpoint = 0;
      const cp = CHECKPOINTS[Math.floor(Math.random() * CHECKPOINTS.length)];
      banner = { text: `Checkpoint reached: ${cp.name}!`, life: 120 };
    }
    if (banner) {
      banner.life--;
      if (banner.life <= 0) banner = null;
    }

    updateScoreUI();
  }

  function gameOver() {
    running = false;
    if (score > best) {
      best = Math.floor(score);
      localStorage.setItem("gc_runner_best", best);
    }
    updateScoreUI();
  }

  function updateScoreUI() {
    const scoreEl = document.getElementById("gameScore");
    const bestEl = document.getElementById("gameBest");
    if (scoreEl) scoreEl.textContent = Math.floor(score);
    if (bestEl) bestEl.textContent = Math.floor(best);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#2E2620";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    ctx.fillStyle = "#E8779F";
    roundRect(ctx, player.x, player.y, player.w, player.h, 8);
    ctx.fill();
    ctx.fillStyle = "#2E2620";
    ctx.beginPath();
    ctx.arc(player.x + player.w / 2, player.y - 6, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#6B5847";
    obstacles.forEach(o => {
      roundRect(ctx, o.x, o.y, o.w, o.h, 4);
      ctx.fill();
    });

    if (banner) {
      ctx.fillStyle = "rgba(46,38,32,0.85)";
      ctx.font = "bold 18px 'Baloo 2', sans-serif";
      const textWidth = ctx.measureText(banner.text).width;
      const bx = canvas.width / 2 - textWidth / 2 - 14;
      roundRect(ctx, bx, 20, textWidth + 28, 36, 10);
      ctx.fill();
      ctx.fillStyle = "#FFFDF8";
      ctx.fillText(banner.text, bx + 14, 44);
    }

    if (!running) {
      ctx.fillStyle = "rgba(46,38,32,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#FFFDF8";
      ctx.font = "bold 24px 'Baloo 2', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Game Over — tap Start to try again", canvas.width / 2, canvas.height / 2);
      ctx.textAlign = "left";
    }
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  document.addEventListener("keydown", e => {
    if (e.code === "Space") {
      e.preventDefault();
      jump();
    }
  });
  canvas.addEventListener("mousedown", jump);
  canvas.addEventListener("touchstart", e => {
    e.preventDefault();
    jump();
  }, { passive: false });

  const startBtn = document.getElementById("gameStartBtn");
  if (startBtn) startBtn.addEventListener("click", resetGame);

  best = Number(localStorage.getItem("gc_runner_best") || 0);
  player = { x: 70, y: GROUND_Y - 40, w: 34, h: 40, vy: 0, onGround: true };
  obstacles = [];
  score = 0;
  running = false;
  updateScoreUI();
  draw();
  loop();
})();
