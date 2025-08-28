 const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const birdImg = new Image();
birdImg.src = "bird.png";

const pipeImg = new Image();
pipeImg.src = "bamboo.png";

const bgImg = new Image();
bgImg.src = "background.png";

// Game variables
let birdY = 250;
let birdVelocity = 0;
const gravity = 0.5;
const jumpStrength = -8;

const bird = {
  x: 80,
  y: birdY,
  width: 34,
  height: 34,
};

let pipes = [];
let pipeWidth = 60;
let pipeGap = 150;
let frame = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

function createPipe() {
  let topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50;
  pipes.push({
    x: canvas.width,
    topHeight: topHeight,
    bottomY: topHeight + pipeGap,
  });
}

function drawBackground() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  pipes.forEach(pipe => {
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.topHeight);
    ctx.drawImage(pipeImg, pipe.x, pipe.bottomY, pipeWidth, canvas.height - pipe.bottomY);
  });
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText(`Score: ${score}`, 10, 40);
}

function drawStartScreen() {
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.fillText("Tap to Start", 100, 300);
}

function drawGameOver() {
  ctx.fillStyle = "red";
  ctx.font = "48px Arial";
  ctx.fillText("Game Over", 90, 300);
  ctx.font = "24px Arial";
  ctx.fillText("Tap or Press SPACE to Restart", 60, 350);
}

function checkCollision(pipe) {
  return (
    bird.x < pipe.x + pipeWidth &&
    bird.x + bird.width > pipe.x &&
    (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
  ) || (bird.y + bird.height > canvas.height || bird.y < 0);
}

function restartGame() {
  birdY = 250;
  birdVelocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameStarted = false;
  loop();
}

function flap() {
  if (!gameStarted) {
    gameStarted = true;
  }
  if (!gameOver) {
    birdVelocity = jumpStrength;
  } else {
    restartGame();
  }
}

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    flap();
  }
});
canvas.addEventListener("click", flap);
canvas.addEventListener("touchstart", flap);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  if (!gameStarted) {
    drawBird();
    drawStartScreen();
    requestAnimationFrame(loop);
    return;
  }

  // Update bird
  birdVelocity += gravity;
  birdY += birdVelocity;
  bird.y = birdY;

  // Pipes
  if (frame % 90 === 0) {
    createPipe();
  }
  pipes.forEach(pipe => pipe.x -= 2);
  pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

  pipes.forEach(pipe => {
    if (pipe.x + pipeWidth === bird.x) {
      score++;
    }
    if (checkCollision(pipe)) {
      gameOver = true;
    }
  });

  drawBird();
  drawPipes();
  drawScore();

  if (gameOver) {
    drawGameOver();
    return;
  }

  frame++;
  requestAnimationFrame(loop);
}

loop();

const bgMusic = document.getElementById("bgMusic");

function flap() {
  if (!gameStarted) {
    gameStarted = true;
    bgMusic.play(); // Start background music
  }

  if (!gameOver) {
    birdVelocity = jumpStrength;
  } else {
    restartGame();
  }
}

function restartGame() {
  birdY = 250;
  birdVelocity = 0;
  pipes = [];
  frame = 0;
  score = 0;
  gameOver = false;
  gameStarted = false;
  bgMusic.pause();
  bgMusic.currentTime = 0;
  loop();
}
