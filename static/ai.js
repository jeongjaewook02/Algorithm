/* ai.js : Minimax-기반 오목 AI
   난이도 → 탐색 깊이
   하(easy)=2, 중(medium)=3, 상(hard)=4
*/

/* ai.js : Minimax 기반 오목 AI (후보 수 제한 + 위협 감지 + 개선사항 반영) */

const depthMap = { easy: 2, medium: 3, hard: 4 };
const getDifficulty = () => document.getElementById('difficulty').value;

/* ───────── AI 진입 ───────── */
const aiMove = () => {
  if (gameOver) return;

  // ⏳ AI 수 계산 중 메시지 표시
  document.getElementById('status').innerText = '백돌 계산 중...';

  const depth = depthMap[getDifficulty()] ?? 2;
  setTimeout(() => minimaxMove(depth), 100); // UI 업데이트 시간 확보
};

/* 최적 수 선택 (후보 수 제한 적용) */
const minimaxMove = (depth) => {
  let bestScore = -Infinity;
  let bestMove = null;
  const candidates = getCandidateMoves();

  for (const [x, y] of candidates) {
    board[x][y] = 2;
    const score = minimax(depth - 1, false, -Infinity, Infinity);
    board[x][y] = 0;

    if (score > bestScore) {
      bestScore = score;
      bestMove = [x, y];
    }
  }

  if (bestMove) makeAIMove(...bestMove);
};

/* 재귀 미니맥스 + 알파·베타 가지치기 */
const minimax = (depth, isMaximizing, alpha, beta) => {
  const winner = evaluateBoard();
  if (winner !== 0) return winner === 2 ? 100_000 : -100_000;
  if (depth === 0) return evaluateHeuristic();

  const candidates = getCandidateMoves();
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const [x, y] of candidates) {
      board[x][y] = 2;
      const evalScore = minimax(depth - 1, false, alpha, beta);
      board[x][y] = 0;
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const [x, y] of candidates) {
      board[x][y] = 1;
      const evalScore = minimax(depth - 1, true, alpha, beta);
      board[x][y] = 0;
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

/* 현재 보드에 승자가 있으면 돌 색(1·2) 반환, 없으면 0 */
const evaluateBoard = () => {
  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] !== 0 && checkWinner(x, y)) return board[x][y];
    }
  }
  return 0;
};

/* 단순 휴리스틱: 중앙 선호 + 돌 개수 차이 */
const evaluateHeuristic = () => {
  let score = 0;
  const center = Math.floor(boardSize / 2);

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] === 2) {
        score += 10;
        score += 5 - (Math.abs(center - x) + Math.abs(center - y));
      } else if (board[x][y] === 1) {
        score -= 10;
        score -= 5 - (Math.abs(center - x) + Math.abs(center - y));
      }
    }
  }
  return score;
};

/* AI 실제 착수 후 게임 상태 갱신 */
const makeAIMove = (x, y) => {
  board[x][y] = 2;
  console.log(`📍 AI 수: (${x}, ${y})`);
  drawBoard();

  if (checkWinner(x, y)) {
    endGame('백돌 승리!');
  } else {
    currentPlayer = 1;
    document.getElementById('status').innerText = '흑돌 차례';
  }
};

/* ───── 후보 수 필터링 및 위협 평가 ───── */

/* 가중치 기반 후보 수 선택 */
const getCandidateMoves = () => {
  const candidates = new Map();
  const inBounds = (x, y) => x >= 0 && y >= 0 && x < boardSize && y < boardSize;

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] !== 0) {
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            const nx = x + dx;
            const ny = y + dy;
            if (!inBounds(nx, ny)) continue;
            if (board[nx][ny] !== 0) continue;
            const key = `${nx},${ny}`;
            if (!candidates.has(key)) {
              const weight = evaluateThreat(nx, ny);
              candidates.set(key, weight);
            }
          }
        }
      }
    }
  }

  return [...candidates.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([key]) => key.split(',').map(Number));
};

/* 위치별 위협 가중치 평가 (공격·방어 모두 고려) */
const evaluateThreat = (x, y) => {
  let score = 0;
  const directions = [
    [1, 0], [0, 1], [1, 1], [1, -1]
  ];

  for (const [dx, dy] of directions) {
    for (const color of [1, 2]) {
      let count = 0;
      for (let offset = -4; offset <= 4; offset++) {
        const nx = x + dx * offset;
        const ny = y + dy * offset;
        if (nx < 0 || ny < 0 || nx >= boardSize || ny >= boardSize) continue;
        if (board[nx][ny] === color) count++;
      }
      const weight = count * count;
      score += (color === 1) ? weight * 1.2 : weight;
    }
  }

  return score;
};
