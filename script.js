const bird = document.querySelector(".bird");
const gameContainer = document.querySelector(".game-container");
const pipes = document.querySelectorAll(".pipe");
const scoreElement = document.querySelector(".score");
const restartButton = document.querySelector(".restart");

let birdY = 240;
let birdVelocity = 0;
const gravity = 0.5;
const jumpHeight = 8;
const pipeWidth = 80;
const pipeGap = 250;
const pipeSpeed = 2;
const pipeSpawnInterval = 2500;
const minHeight = 100;
const horizontalBuffer = 100;

let gameActive = false;
let score = 0;

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    birdVelocity = -jumpHeight;
    if (!gameActive) {
      gameActive = true;
      pipes.forEach((pipe) => (pipe.style.left = `${gameContainer.clientWidth - horizontalBuffer}px`));
      score = 0;
      scoreElement.textContent = score;
      restartButton.style.display = "none";
      gameLoop();
    }
  }
});

restartButton.addEventListener("click", () => {
  gameActive = true;
  pipes.forEach((pipe) => (pipe.style.left = `${gameContainer.clientWidth - horizontalBuffer}px`));
  birdY = 240;
  birdVelocity = 0;
  score = 0;
  scoreElement.textContent = score;
  restartButton.style.display = "none";
  gameLoop();
});

function gameLoop() {
  if (!gameActive) return;

  birdY += birdVelocity;
  birdVelocity += gravity;
  bird.style.top = `${birdY}px`;

  let passedPipe = false;

  pipes.forEach((pipe) => {
    const pipeX = parseInt(pipe.style.left, 10) - settings.speed * pipeSpeed;
    pipe.style.left = `${pipeX}px`;

    if (pipeX + pipeWidth <= 0) {
      pipe.style.left = `${gameContainer.clientWidth - horizontalBuffer}px`;

      if (pipe.classList.contains("top")) {
        pipe.style.top = `${Math.random() * -320}px`;
      } else {
        const topPipe = pipe.previousElementSibling;
        const topPipeY = parseInt(topPipe.style.top, 10);
        const bottomPipeY = topPipeY + 480 + pipeGap;
        if (bottomPipeY < minHeight) {
          pipe.style.top = `${minHeight}px`;
        } else {
          pipe.style.top = `${bottomPipeY}px`;
        }
      }

      if (!passedPipe) {
        passedPipe = true;
        score++;
        scoreElement.textContent = score;
      }
    } else {
      passedPipe = false;
    }

    if (
      birdY <= 0 ||
      birdY + bird.clientHeight >= gameContainer.clientHeight ||
      (bird.offsetLeft + bird.clientWidth > pipeX &&
        bird.offsetLeft < pipeX + pipeWidth &&
        (birdY < parseInt(pipe.style.top, 10) + 480 ||
          birdY + bird.clientHeight >
            parseInt(pipe.style.top, 10) + 480 + pipeGap))
    ) {
      gameActive = false;
      birdY = 240;
      birdVelocity = 0;
      restartButton.style.display = "block";
    }
  });

  requestAnimationFrame(gameLoop);
}

pipes.forEach((pipe) => {
  pipe.style.left = `${gameContainer.clientWidth - horizontalBuffer}px`;
});

const settings = {
  speed: localStorage.getItem("flappyBirdSpeed") || 2,
  color: localStorage.getItem("flappyBirdColor") || "#FFFF00",
};

const speedInput = document.querySelector("#speed");
const colorInput = document.querySelector("#color");

speedInput.value = settings.speed;
colorInput.value = settings.color;

bird.style.backgroundColor = settings.color;

speedInput.addEventListener("input", (event) => {
  settings.speed = event.target.value;
  localStorage.setItem("flappyBirdSpeed", settings.speed);
});

colorInput.addEventListener("input", (event) => {
  settings.color = event.target.value;
  bird.style.backgroundColor = settings.color;
  localStorage.setItem("flappyBirdColor", settings.color);
});

