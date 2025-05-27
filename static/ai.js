/* ai.js : Minimax-기반 오목 AI
   난이도 → 탐색 깊이
   하(easy)=2, 중(medium)=3, 상(hard)=4
*/

const depthMap = { easy: 2, medium: 3, hard: 4 };

const getDifficulty = () => document.getElementById('difficulty').value;

/* ───────── AI 진입 ───────── */
const aiMove = () => {
  if (gameOver) return;
  const depth = depthMap[getDifficulty()] ?? 2;
  minimaxMove(depth);
};

/* 하나의 최적 수 선택 */
const minimaxMove = (depth) => {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let x = 0; x < boardSize; x++) {
    for (let y = 0; y < boardSize; y++) {
      if (board[x][y] !== 0) continue;

      board[x][y] = 2;                    // 가상 착수
      const score = minimax(depth - 1, false, -Infinity, Infinity);
      board[x][y] = 0;                    // 되돌리기

      if (score > bestScore) {
        bestScore = score;
        bestMove = [x, y];
      }
    }
  }

  if (bestMove) makeAIMove(...bestMove);
};

/* 재귀 미니맥스 + 알파·베타 가지치기 */
const minimax = (depth, isMaximizing, alpha, beta) => {
  const winner = evaluateBoard();
  if (winner !== 0) return winner === 2 ? 100_000 : -100_000;
  if (depth === 0) return evaluateHeuristic();

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (board[x][y] !== 0) continue;
        board[x][y] = 2;
        const evalScore = minimax(depth - 1, false, alpha, beta);
        board[x][y] = 0;
        maxEval = Math.max(maxEval, evalScore);
        alpha = Math.max(alpha, evalScore);
        if (beta <= alpha) return maxEval; // 가지치기
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let x = 0; x < boardSize; x++) {
      for (let y = 0; y < boardSize; y++) {
        if (board[x][y] !== 0) continue;
        board[x][y] = 1;
        const evalScore = minimax(depth - 1, true, alpha, beta);
        board[x][y] = 0;
        minEval = Math.min(minEval, evalScore);
        beta = Math.min(beta, evalScore);
        if (beta <= alpha) return minEval; // 가지치기
      }
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

/* 매우 단순한 휴리스틱: 중앙 선호 + 돌 개수 차이 */
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
  drawBoard();

  if (checkWinner(x, y)) {
    endGame('백돌 승리!');
  } else {
    currentPlayer = 1;
    document.getElementById('status').innerText = '흑돌 차례';
  }
};
