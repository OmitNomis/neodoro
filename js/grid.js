const CELL_SIZE = 100;
const GLOW_RADIUS = 300;

let mouseX = 0;
let mouseY = 0;
let isAnimating = false;
let cells = [];

function createGrid() {
  const container = document.getElementById("grid-container");
  const rows = Math.ceil(document.body.scrollHeight / CELL_SIZE);
  const cols = Math.ceil(window.innerWidth / CELL_SIZE);

  container.innerHTML = "";
  cells = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.style.top = `${i * CELL_SIZE}px`;
      cell.style.left = `${j * CELL_SIZE}px`;
      container.appendChild(cell);
      cells.push({
        element: cell,
        centerX: j * CELL_SIZE + CELL_SIZE / 2,
        centerY: i * CELL_SIZE + CELL_SIZE / 2,
      });
    }
  }
}

function getDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function updateCellsGlow() {
  const scrollY = window.scrollY;
  const mouseYWithScroll = mouseY + scrollY;

  cells.forEach((cell) => {
    const distance = getDistance(
      mouseX,
      mouseYWithScroll,
      cell.centerX,
      cell.centerY
    );

    if (distance <= GLOW_RADIUS) {
      const intensity = 1 - distance / GLOW_RADIUS;
      cell.element.style.setProperty("--glow-intensity", intensity);
      cell.element.classList.add("glowing");
    } else {
      cell.element.classList.remove("glowing");
      cell.element.style.setProperty("--glow-intensity", 0);
    }
  });

  if (isAnimating) {
    requestAnimationFrame(updateCellsGlow);
  }
}

function startAnimation() {
  if (!isAnimating) {
    isAnimating = true;
    requestAnimationFrame(updateCellsGlow);
  }
}

function stopAnimation() {
  isAnimating = false;
}

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  startAnimation();
});

document.addEventListener("scroll", () => {
  startAnimation();
});

document.addEventListener("mouseleave", stopAnimation);

window.addEventListener("load", createGrid);
window.addEventListener("resize", createGrid);
