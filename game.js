function createEmptyBoard(x, y) {
    let board = [];
    for (let i = 0; i < x; i++) {
      board.push([]);
      for (let j = 0; j < y; j++) {
        board[i].push({
          revealed: false,
          flagged: false,
          mine: false,
          mineCount: 0,
          clicked: false
        });
      }
    }
    return board;
  }
  
  function addBombs(board, bombCount) {
    let x = board.length;
    let y = board[0].length;
    for (let i = 0; i < bombCount; i++) {
      let xIndex = Math.floor(Math.random() * x);
      let yIndex = Math.floor(Math.random() * y);
      board[xIndex][yIndex].mine = true;
    }
    return board;
  }
  
  function addMineCounts(board) {
    let x = board.length;
    let y = board[0].length;
    for (let i = 0; i < x; i++) {
      for (let j = 0; j < y; j++) {
        if (board[i][j].mine) {
          continue;
        }
        let count = 0;
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            if (i + k < 0 || i + k >= x || j + l < 0 || j + l >= y) {
              continue;
            }
            if (board[i + k][j + l].mine) {
              count++;
            }
          }
        }
        board[i][j].mineCount = count;
      }
    }
    return board;
  }
  
  function createBoard(x, y, bombCount) {
    let board = createEmptyBoard(x, y);
    board = addBombs(board, bombCount);
    board = addMineCounts(board);
    return board;
  }
  
  function renderBoard(board) {
    const gameGrid = document.querySelector(".game-grid");
    gameGrid.innerHTML = "";
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellElement = document.createElement("div");
        cellElement.dataset.rowIndex = rowIndex;
        cellElement.dataset.cellIndex = cellIndex;
        cellElement.classList.add("cell");
        if (cell.flagged) {
          cellElement.classList.add("flagged");
        }
        if (cell.revealed) {
          cellElement.classList.add("revealed");
          if (cell.mine) {
            if (cell.clicked) {
              cellElement.classList.add("mine-clicked");
            }
            cellElement.classList.add("mine");
          } else {
            cellElement.textContent = cell.mineCount;
            cellElement.classList.add(`mine-count-${cell.mineCount}`);
          }
        }
  
        gameGrid.appendChild(cellElement);
      });
    });
  }
  
  function revealCell(board, rowIndex, cellIndex) {
    let cell = board[rowIndex][cellIndex];
    if (cell.flagged) {
      return;
    }
    cell.revealed = true;
    if (cell.mine) {
      endGame(board, rowIndex, cellIndex);
      return;
    }
    if (cell.mineCount > 0) {
      return;
    }
  
    const cellX = Number.parseInt(cellIndex);
    const cellY = Number.parseInt(rowIndex);
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const neighborX = cellX + x;
        const neighborY = cellY + y;
        if (neighborX < 0 || neighborX >= board[0].length) {
          continue;
        }
        if (neighborY < 0 || neighborY >= board.length) {
          continue;
        }
        const neighborCell = board[neighborY][neighborX];
        if (neighborCell.revealed) {
          continue;
        }
        revealCell(board, neighborY, neighborX);
      }
    }
  }
  
  function flagMine(board, rowIndex, cellIndex) {
    let cell = board[rowIndex][cellIndex];
    if (cell.revealed) {
      return;
    }
    cell.flagged = !cell.flagged;
  }
  
  function endGame(board, rowIndex, cellIndex) {
    // reveal all cells that are mines
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell.mine) {
          cell.revealed = true;
        }
      });
    });
    board[rowIndex][cellIndex].clicked = true;
  }
  
  window.addEventListener("load", () => {
    const NUM_BOMBS = 10;
    const NUM_ROWS = 10;
    const NUM_COLS = 10;
    let board = createBoard(NUM_ROWS, NUM_COLS, NUM_BOMBS);
  
    renderBoard(board);
    const gameGrid = document.querySelector(".game-grid");
  
    gameGrid.addEventListener("click", (event) => {
      if (!event.target.classList.contains("cell")) {
        return;
      }
      let rowIndex = event.target.dataset.rowIndex;
      let cellIndex = event.target.dataset.cellIndex;
      revealCell(board, rowIndex, cellIndex);
      renderBoard(board);
    });
  
    gameGrid.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (!event.target.classList.contains("cell")) {
        return;
      }
      let rowIndex = event.target.dataset.rowIndex;
      let cellIndex = event.target.dataset.cellIndex;
      flagMine(board, rowIndex, cellIndex);
      renderBoard(board)
    });
  });
  
