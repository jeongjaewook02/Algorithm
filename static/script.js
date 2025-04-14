const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const boardSize = 15;
const cellSize = 40;
let board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
let currentPlayer = 1;
let gameOver = false;

const drawBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      ctx.beginPath();
      ctx.rect(i * cellSize, j * cellSize, cellSize, cellSize);
      ctx.strokeStyle = '#000';
      ctx.stroke();

      if (board[i][j] === 1) {
        ctx.beginPath();
        ctx.arc(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize / 2 - 4, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
      } else if (board[i][j] === 2) {
        ctx.beginPath();
        ctx.arc(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize / 2 - 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
  }
};

const handleClick = (event) => {
  if (gameOver) return;

  const x = Math.floor(event.offsetX / cellSize);
  const y = Math.floor(event.offsetY / cellSize);

  if (board[x][y] === 0) {
    board[x][y] = currentPlayer;
    drawBoard();

    if (checkWinner(x, y)) {
      document.getElementById('status').innerText = `${currentPlayer === 1 ? "흑돌" : "백돌"} 승리!`;
      gameOver = true;
      return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('status').innerText = `${currentPlayer === 1 ? "흑돌" : "백돌"} 차례`;

    if (currentPlayer === 2) {
      setTimeout(() => {
        aiMove(); // AI 차례
      }, 500);
    }
  }
};

canvas.addEventListener('click', handleClick);

const checkWinner = (x, y) => {
  const directions = [
    [[1, 0], [-1, 0]],  // 가로
    [[0, 1], [0, -1]],  // 세로
    [[1, 1], [-1, -1]], // 대각 \
    [[1, -1], [-1, 1]]  // 대각 /
  ];

  for (let dir of directions) {
    let count = 1;

    for (let [dx, dy] of dir) {
      let nx = x + dx;
      let ny = y + dy;
      while (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && board[nx][ny] === board[x][y]) {
        count++;
        nx += dx;
        ny += dy;
      }
    }

    if (count >= 5) return true;
  }

  return false;
};

const resetGame = () => {
  board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
  currentPlayer = 1;
  gameOver = false;
  document.getElementById('status').innerText = '흑돌 차례';
  drawBoard();
};

drawBoard();