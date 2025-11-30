// ----------------------
// Zufallslinkgenerator
// ----------------------
function randomKV() {
  const min = 225083;
  const max = 504676;
  const rnd = Math.floor(Math.random() * (max - min + 1)) + min;
  return `https://keinverlag.de/${rnd}.text`;
}

// ----------------------
// Kalender erstellen
// ----------------------
const calendar = document.getElementById("calendar");

for (let i = 1; i <= 24; i++) {
  const day = document.createElement("div");
  day.classList.add("day");
  day.textContent = i;

  day.addEventListener("click", () => {
    day.classList.add("open");
    window.open(randomKV(), "_blank");
  });

  calendar.appendChild(day);
}

// ----------------------
// SNOW CANVAS ANIMATION
// ----------------------
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const flakes = [];
for (let i = 0; i < 180; i++) {
  flakes.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    d: Math.random() * 1
  });
}

function drawSnow() {
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();

  for (let f of flakes) {
    ctx.moveTo(f.x, f.y);
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
  }
  ctx.fill();

  updateSnow();
}

let angle = 0;

function updateSnow() {
  angle += 0.002;
  for (let f of flakes) {
    f.y += Math.cos(angle + f.d) + 1 + f.r / 3;
    f.x += Math.sin(angle) * 0.5;

    // reset
    if (f.y > h) {
      f.y = -10;
      f.x = Math.random() * w;
    }
  }
}

setInterval(drawSnow, 33);
