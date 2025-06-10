// script.js : 보드 그리기 및 게임 흐름
const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');
const boardSize = 15;
const cellSize = 40;

let board, currentPlayer, gameOver;

const initBoard = () => {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  currentPlayer = 1; // 1: 흑(플레이어), 2: 백(컴퓨터)
  gameOver = false;
};

const drawBoard = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🔹 바둑판 선 그리기
  for (let i = 0; i < boardSize; i++) {
    // 가로줄
    ctx.beginPath();
    ctx.moveTo(cellSize / 2, cellSize / 2 + i * cellSize);
    ctx.lineTo(canvas.width - cellSize / 2, cellSize / 2 + i * cellSize);
    ctx.stroke();

    // 세로줄
    ctx.beginPath();
    ctx.moveTo(cellSize / 2 + i * cellSize, cellSize / 2);
    ctx.lineTo(cellSize / 2 + i * cellSize, canvas.height - cellSize / 2);
    ctx.stroke();
  }

  // 🔹 돌 그리기 (교차점 중심 기준)
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== 0) {
        ctx.beginPath();
        const cx = cellSize / 2 + i * cellSize;
        const cy = cellSize / 2 + j * cellSize;
        ctx.arc(cx, cy, cellSize / 2 - 4, 0, Math.PI * 2);
        ctx.fillStyle = board[i][j] === 1 ? 'black' : 'white';
        ctx.fill();
      }
    }
  }
};

const checkWinner = (x, y) => {
  const directions = [
    [[1, 0], [-1, 0]],
    [[0, 1], [0, -1]],
    [[1, 1], [-1, -1]],
    [[1, -1], [-1, 1]],
  ];

  for (const dir of directions) {
    let count = 1;
    for (const [dx, dy] of dir) {
      let nx = x + dx;
      let ny = y + dy;
      while (
        nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize &&
        board[nx][ny] === board[x][y]
      ) {
        count++;
        nx += dx;
        ny += dy;
      }
    }
    if (count >= 5) return true;
  }
  return false;
};

// 화면 요소
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const statusText = document.getElementById('status');
const winnerText = document.getElementById('winner-text');

const startGame = () => {
  initBoard();
  drawBoard();
  statusText.innerText = '흑돌 차례';
  startScreen.style.display = 'none';
  endScreen.style.display = 'none';
  gameScreen.style.display = 'block';
};

const endGame = (msg) => {
  gameOver = true;
  winnerText.innerText = msg;
  gameScreen.style.display = 'none';
  endScreen.style.display = 'block';
};

const restartGame = () => {
  startScreen.style.display = 'block';
  endScreen.style.display = 'none';
  gameScreen.style.display = 'none';
};

// 플레이어 클릭 이벤트
canvas.addEventListener('click', (e) => {
  if (gameOver || currentPlayer !== 1) return;

  const x = Math.floor(e.offsetX / cellSize);
  const y = Math.floor(e.offsetY / cellSize);

  if (board[x][y] === 0) {
    board[x][y] = 1;
    drawBoard();

    if (checkWinner(x, y)) {
      endGame('흑돌 승리!');
      return;
    }

    currentPlayer = 2;
    statusText.innerText = '백돌 차례';
    setTimeout(aiMove, 200);
  }
});

// 버튼 이벤트
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);

// 초기 보드 설정 (첫 로드 시)
initBoard();
