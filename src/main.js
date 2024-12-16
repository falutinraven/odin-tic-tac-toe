const gameboard = (function() {
  let board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const isCellEmpty = (row, col) => !board[row][col];
  const setCell = (row, col, player_mark) => {
    if(isCellEmpty)
      board[row][col] = player_mark
  };
  const viewBoard = () => board;
  
  const checkWin = function (player_mark) {
    // rows
    for (let i = 0; i < board[0].length; i++){
      for (let j = 0; j < board.length; j++){
        if(board[i][j] !== player_mark)
          break;
        else if (j === (board.length - 1)){
          return true;
        }
      } 
    }

    // cols
    for (let i = 0; i < board[0].length; i++){
      for (let j = 0; j < board.length; j++){
        if(board[j][i] !== player_mark)
          break;
        else if (j === (board.length - 1)){
          return true;
        }
      } 
    }

    // diagonal 
    for (let j = 0; j < board.length; j++){
      if(board[j][j] !== player_mark)
        break;
      else if (j === (board.length - 1)){
        return true;
      }
    } 

    // other diagonal
    for (let j = 0; j < board.length; j++){
      if(board[j][board.length - 1 - j] !== player_mark)
        break;
      else if (j === (board.length - 1)){
        return true;
      }
    } 
  }

  const clearBoard = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  return { setCell, viewBoard, checkWin, clearBoard, isCellEmpty };
})();

const game = (function(gameboard) {
  let player_one_mark = "X"
  let player_two_mark = "O"

  let player_ones_turn = true;

  const playerOnesTurn = () => player_ones_turn;

  const playRound = function(row, col) {
    if (!gameboard.isCellEmpty()){
      console.log("cell isn't empty, try again");
      return;
    }
    if(player_ones_turn){
      gameboard.setCell(row, col, player_one_mark)
      if (gameboard.checkWin(player_one_mark)){
        console.log("player one wins!");
        gameboard.clearBoard();
      }
    }
    else{
      gameboard.setCell(row, col, player_two_mark)
      if (gameboard.checkWin(player_two_mark)){
        console.log("player two wins!");
        gameboard.clearBoard();
      }
    }

    player_ones_turn = !player_ones_turn;
  }
  
  return {playRound, playerOnesTurn}
})(gameboard);

const ScreenController = (function() {
  const drawBoard = function(board) {
    let boardContainer = document.querySelector(".board");

    for(let i = 0; i < board.length; i++){
      let row = document.createElement("div");
      row.classList.add("row")
      for(let j = 0; j < board.length; j++){
        let col = document.createElement("button");
        col.classList.add("col");
        if(board[i][j])
          col.textContent = board[i][j];
        row.appendChild(col);
      }
      boardContainer.appendChild(row);
    }
  }

  return { drawBoard };
})();

ScreenController.drawBoard(gameboard.viewBoard());