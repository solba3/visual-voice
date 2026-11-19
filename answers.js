// Answers page: floats the saved answers around the window.
// Needs storage.js loaded first.

const MIN_SPEED = 15; // pixels per second
const MAX_SPEED = 40;

const emptyMessage = document.getElementById('empty');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let floaters = [];
let frameId = null;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// Furthest an answer can go and still be fully inside the window.
function limits(el) {
  return {
    maxX: Math.max(0, window.innerWidth - el.offsetWidth),
    maxY: Math.max(0, window.innerHeight - el.offsetHeight)
  };
}

function place(f) {
  f.el.style.transform = `translate(${f.x}px, ${f.y}px)`;
}

function showAnswers() {
  const answers = loadAnswers();
  emptyMessage.hidden = answers.length > 0;

  floaters = answers.map((answer) => {
    const el = document.createElement('p');
    el.className = 'answer';
    el.textContent = answer.text; // textContent, so typed HTML is shown as text
    // New random size from 12px to 20px on every load.
    el.style.fontSize = Math.round(randomBetween(12, 20)) + 'px';
    document.body.appendChild(el);

    // Random starting spot and random drifting direction.
    const { maxX, maxY } = limits(el);
    const angle = randomBetween(0, Math.PI * 2);
    const speed = randomBetween(MIN_SPEED, MAX_SPEED);
    const f = {
      el,
      x: randomBetween(0, maxX),
      y: randomBetween(0, maxY),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
    place(f);
    return f;
  });
}

// Drift each answer and bounce it off the window edges.
let lastTime = null;
function step(time) {
  const dt = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;

  for (const f of floaters) {
    const { maxX, maxY } = limits(f.el);
    f.x += f.vx * dt;
    f.y += f.vy * dt;
    if (f.x < 0) { f.x = 0; f.vx = Math.abs(f.vx); }
    if (f.x > maxX) { f.x = maxX; f.vx = -Math.abs(f.vx); }
    if (f.y < 0) { f.y = 0; f.vy = Math.abs(f.vy); }
    if (f.y > maxY) { f.y = maxY; f.vy = -Math.abs(f.vy); }
    place(f);
  }
  frameId = requestAnimationFrame(step);
}

document.getElementById('clear').addEventListener('click', () => {
  if (!confirm('Delete all answers saved in this browser?')) return;
  clearAnswers();
  if (frameId !== null) cancelAnimationFrame(frameId);
  floaters.forEach((f) => f.el.remove());
  floaters = [];
  emptyMessage.hidden = false;
});

showAnswers();
// People who ask their system for less motion get the random spots without the drifting.
if (!reduceMotion && floaters.length > 0) {
  frameId = requestAnimationFrame(step);
}
