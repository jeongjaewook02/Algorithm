const aiMove = () => {
    if (gameOver) return;
  
    let availableMoves = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (board[i][j] === 0) {
          availableMoves.push([i, j]);
        }
      }
    }
  
    if (availableMoves.length > 0) {
      const [x, y] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      board[x][y] = 2;
      drawBoard();
  
      if (checkWinner(x, y)) {
        document.getElementById('status').innerText = '백돌 승리!';
        gameOver = true;
        return;
      }
  
      currentPlayer = 1;
      document.getElementById('status').innerText = '흑돌 차례';
    }
  };