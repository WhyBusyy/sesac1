const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

const blockSize = 20;
const canvasSize = 400;
const snakeSpeed = 200; // 뱀 이동 속도(밀리초)

let snake = [
  { x: 0, y: 0 }, // 초기 뱀 위치
];

let food = generateFood();

let direction = "right";
let directionBuffer = [];
let snakeLength = 5;

let gameOver = false;

function draw() {
  context.clearRect(0, 0, canvasSize, canvasSize); // 화면 초기화

  if (gameOver) {
    context.fillStyle = "#F00";
    context.font = "40px Arial";
    context.fillText("Game Over", 90, canvasSize / 2);

    context.font = "30px Arial";
    context.fillText("Retry? Y / N", 110, canvasSize / 2 + 40);
    return;
  }

  drawSnake();
  drawFood();

  moveSnake();
  checkCollision();
  checkFood();
}

function checkCollision() {
  // 벽에 부딪히면 죽기
  const head = snake[0];

  if (
    head.x < 0 ||
    head.x * blockSize > canvasSize - blockSize ||
    head.y < 0 ||
    head.y * blockSize > canvasSize - blockSize ||
    isSnakeCollision()
  ) {
    console.log("죽음");
    gameOver = true;
  }
  // 나의 머리가 나의 몸통에 닿으면 죽기
}

function isSnakeCollision() {
  const head = snake[0];
  return snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);
}

function checkFood() {
  const head = snake[0];
  if (head.x === food[0].x && head.y === food[0].y) {
    console.log("같음");
    food = generateFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  context.fillStyle = "#00F";

  snake.forEach((segment) => {
    context.fillRect(
      segment.x * blockSize,
      segment.y * blockSize,
      blockSize,
      blockSize
    ); // x, y, width, height
  });
}

function drawFood() {
  context.fillStyle = "#F00";
  context.fillRect(
    food[0].x * blockSize,
    food[0].y * blockSize,
    blockSize,
    blockSize
  );
}

function generateFood() {
  let foodPosition;

  do {
    foodPosition = {
      x: Math.floor(Math.random() * (canvasSize / blockSize)),
      y: Math.floor(Math.random() * (canvasSize / blockSize)),
    };
  } while (isFoodOnSnake(foodPosition));

  return [foodPosition];
}

function isFoodOnSnake(foodPosition) {
  // let isOnSnake = false;

  // snake.forEach((segment) => {
  //   if (segment.x === foodPosition.x && segment.y === foodPosition.y) {
  //     isOnSnake = true;
  //   }
  // });

  // return isOnSnake;

  // some으로 한 줄로 작성해보기
  return snake.some(
    (segment) => segment.x === foodPosition.x && segment.y === foodPosition.y
  );
}

function moveSnake() {
  const head = { ...snake[0] };

  if (directionBuffer.length > 0) {
    direction = directionBuffer.shift();
    console.log(direction);
  }

  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  //   if (head.x < 0 || head.x * blockSize > canvasSize - blockSize || (head.y < 0 && head.y * blockSize > canvasSize - blockSize)) {
  //     return;
  //   }

  // 벗어나지 않았다면 머리 추가
  snake.unshift(head);

  //   if (snake.length > snakeLength) {
  //     snake.pop();
  //   }
}

document.addEventListener("keydown", handleKeyPress);

// let lastKeyPressTime = 0;

function resetGame() {
  snake = [{ x: 0, y: 0 }];
  direction = "right";
  food = generateFood();
  gameOver = false;
}

function handleKeyPress(event) {
  console.log(event.key);

  if (gameOver) {
    if (event.key.toLowerCase() === "y") {
      resetGame();
    }
    return;
  }

  if (directionBuffer.length >= 2) {
    console.log("그만 눌러라:", directionBuffer);
    return;
  }

  let previousKeyPress = direction;
  if (directionBuffer.length > 0) {
    previousKeyPress = directionBuffer[directionBuffer.length - 1];
  }

  console.log(event.key);
  switch (event.key) {
    case "ArrowUp":
      previousKeyPress !== "down" ? directionBuffer.push("up") : null;
      // ? (direction = "up") : null;
      break;
    case "ArrowDown":
      previousKeyPress !== "up" ? directionBuffer.push("down") : null;
      // ? (direction = "down") : null;
      break;
    case "ArrowLeft":
      previousKeyPress !== "right" ? directionBuffer.push("left") : null;
      // ? (direction = "left") : null;
      break;
    case "ArrowRight":
      previousKeyPress !== "left" ? directionBuffer.push("right") : null;
      // ? (direction = "right") : null;
      break;
  }

  // lastKeyPressTime = now;
}

setInterval(draw, snakeSpeed);
