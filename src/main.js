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

  const checkTie = function () {
    for (let i = 0; i < board[0].length; i++){
      for (let j = 0; j < board.length; j++){
        if(isCellEmpty(i, j))
          return false
      } 
    }
    return true;
  }

  const clearBoard = () => {
    board = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  }

  return { setCell, viewBoard, checkWin, clearBoard, isCellEmpty, checkTie};
})();

const game = (function(gameboard) {
  let player_one_mark = "X"
  let player_two_mark = "O"
  let winner;

  let player_ones_turn = true;

  const setWinner = () => winner = true;
  const getWinner = () => winner;
  const changePlayersTurn = () => player_ones_turn = !player_ones_turn;
  const getCurrentPlayer = () => player_ones_turn;

  const playRound = function(row, col) {
    if (!gameboard.isCellEmpty(row, col)){
      console.log("cell isn't empty, try again");
      return;
    }
    if(player_ones_turn){
      gameboard.setCell(row, col, player_one_mark)
      if (gameboard.checkWin(player_one_mark)){
        events.emit("gameWon", player_ones_turn);
        gameboard.clearBoard();
      }
    }
    else{
      gameboard.setCell(row, col, player_two_mark)
      if (gameboard.checkWin(player_two_mark)){
        events.emit("gameWon", player_ones_turn);
        gameboard.clearBoard();
      }
    }

    if(gameboard.checkTie()){
      alert('TIE');
      gameboard.clearBoard();
      return;
    }
    changePlayersTurn();
    ScreenController.drawBoard(gameboard.viewBoard());
    events.emit("playerChanged", player_ones_turn);
  }
  
  return {playRound, changePlayersTurn, getCurrentPlayer, getWinner}
})(gameboard);

const ScreenController = (function(gameboard, game) {
  let player_ones_name = "player one";
  let player_twos_name = "player two";

  const setNames = function (name1, name2){
    player_ones_name = name1;
    player_twos_name = name2;
  }

  const setWinner = function (player_one_winner) {
    let winner_element = document.querySelector("#winner");
    if (player_one_winner)
      winner_element.textContent = player_ones_name + " is the winner";
    else
      winner_element.textContent = player_twos_name + " is the winner";
  }

  const namesSubmission = function (){
    let submission_button = document.querySelector("#names-submission");
    submission_button.addEventListener("click", () => {
      let player_one_name_input = document.querySelector("#player-one");
      let player_two_name_input = document.querySelector("#player-two");
      setNames(player_one_name_input.value, player_two_name_input.value);
      startGame();
    });
  }

  const startGame = function() {
    gameboard.clearBoard();
    ScreenController.drawBoard(gameboard.viewBoard());
    ScreenController.updatePlayer(true);
    ScreenController.addCellListeners();
    events.on("playerChanged", ScreenController.updatePlayer);
    events.on("gameWon", ScreenController.setWinner);
    events.on("playerChanged", ScreenController.addCellListeners);
  }

  const addCellListeners = function (){
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.addEventListener("click", () => game.playRound(cell.dataset.rowNumber, cell.dataset.colNumber)))
  }

  const drawBoard = function(board) {
    let boardContainer = document.querySelector(".board");
    boardContainer.innerHTML = "";

    for(let i = 0; i < board.length; i++){
      let row = document.createElement("div");
      row.dataset.rowNumber = i;
      row.classList.add("row")
      for(let j = 0; j < board.length; j++){
        let col = document.createElement("button");
        col.classList.add("cell");
        col.dataset.rowNumber = i;
        col.dataset.colNumber = j;
        if(board[i][j])
          col.textContent = board[i][j];
        row.appendChild(col);
      }
      boardContainer.appendChild(row)
    }
  }


  const updatePlayer = (function (player_ones_turn) {
    let player_div = document.querySelector(".player-info");
    if (player_ones_turn){
      player_div.textContent = `It is ${player_ones_name}'s turn`;
    }
    else {
      player_div.textContent = `It is ${player_twos_name}'s turn`;
    }
  })

  return { drawBoard, updatePlayer, addCellListeners, namesSubmission, setWinner};
})(gameboard, game);



ScreenController.namesSubmission();