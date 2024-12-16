// copied from learn code academy youtube videos (Modular js 4 pubsub js design pattern + vid 5)
let events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function (eventName, fn) {
    if (this.events[eventName]) {
      for (let i = 0; i< this.events[eventName].length; i++){
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },
  emit: function(eventName, data){
    if(this.events[eventName]){
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
}

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

  const changePlayersTurn = () => player_ones_turn = !player_ones_turn;

  const playRound = function(row, col) {
    if (!gameboard.isCellEmpty(row, col)){
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

    changePlayersTurn();
    events.emit("playerChanged", player_ones_turn);
  }
  
  return {playRound, changePlayersTurn}
})(gameboard);

const ScreenController = (function() {
  const drawBoard = function(board) {
    // todo delete old board from screen
    let boardContainer = document.querySelector(".board");
    boardContainer.innerHTML = "";

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

  const updatePlayer = (function (player_ones_turn) {
    let player_div = document.querySelector(".player-info");
    if (player_ones_turn){
      player_div.textContent = "It is Player One's turn";
    }
    else {
      player_div.textContent = "It is Player two's turn";
    }
  })
  events.on("playerChanged", updatePlayer);

  return { drawBoard, updatePlayer };
})();

ScreenController.drawBoard(gameboard.viewBoard());
ScreenController.updatePlayer(true);