// Handles changing the UI to reflect game state, does not handle receiving information from UI

const UIController = (function () {
    const board = document.querySelector(".gameboard");
    const gameStatus = document.querySelector(".game-status");
    const scoreBoard = document.querySelector(".score");

    function makeBoard() {
        for(let row = 0; row < 3; row++)
            for(let column = 0; column < 3; column++) {
                const box = document.createElement("div");
                box.classList.add(`row${row}`);
                box.classList.add(`column${column}`);
                box.classList.add("box");
                board.appendChild(box);
            }
    }

    makeBoard();

    // Tells the player who's turn it is 
    function changeGameStatus(toPlay) {
        gameStatus.textContent = `${toPlay}'s turn to play`;
    }

    function winningMessage(winner){
        gameStatus.textContent = `${winner} won the game!`;
    }

    function updateScoreboard(players, scores){
        scoreBoard.textContent = `${players[0]}: ${scores[0]} - ${scores[1]} :${players[1]}`;
    }

    function updateUI(y, x, char) {
        const box = document.getElementsByClassName(`row${y} column${x}`);
        box[0].textContent = char;
    }

    function resetBoard(){
        for(let row = 0; row < 3; row++)
            for(let column; column < 3; column++)
                updateUI(row, column, '-');
    }

    return {
        updateUI, changeGameStatus, winningMessage, updateScoreboard, resetBoard,
    };

})();

function createPlayer(name, symbol) {
    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;

    return {name, score, symbol,  getScore, increaseScore};
}

const GameBoard = (function() {
    const board = Array.from(Array(3), () => Array.from(Array(3), () => "-"));
    // We'll use this to keep track of ties, when the total number of plays is equal to the playable slots and nobody won it's a tie
    const playableSlots = board.length * board[0].length;
    let plays = 0;
    let players = [];
    let playerPointer = 0;
    let gameEnded = false;

    // Function that shows a string with the board status
    function boardToString(){
        let boardRepresentation = "";
        for(let row = 0; row < board.length; row++) {
            for(let column = 0; column < board[row].length; column++){
                boardRepresentation += board[row][column];
                if(column + 1 < board.length)
                    boardRepresentation += "|";
            }
            boardRepresentation += "\n";
        }

        return boardRepresentation;
    }

    function addListenersToBoxes(){
        for(let row = 0; row < board.length; row++) {
            for(let column = 0; column < board.length; column++){
                document.getElementsByClassName(`row${row} column${column}`)[0].addEventListener("click", () => {
                    if(players.length == 0) {
                        alert("You need to hit start game and set the names before playing");
                        return;
                    }
                    if(gameEnded) {
                        alert("This game has already been won/tied, hit the reset button to play again");
                        return;
                    }
                    if(board[row][column] != '-') {
                        alert("This square has already been played");
                        return; 
                    }
                    const gameStatus = makePlay(row, column, players[playerPointer].symbol);
                    if(gameStatus == 1 || gameStatus == -1)
                        gameEnded = true;
                    playerPointer = (playerPointer + 1) % 2;
                });
            }
        }
    }

    // Function that makes a play and returns whether it's a wining play or not, or even if it's a tying play
    function makePlay(yPosition, xPosition, char) {
        board[yPosition][xPosition] = char;
        UIController.updateUI(yPosition, xPosition, char);
        plays++;
        return checkForWin(yPosition, xPosition, char);
    }

    // Function that verifies if a play made won the game
    // 1 - Winning Play
    // 0 - Normal Play
    // -1 - Tying Play
    function checkForWin(y, x, char){
        let counter = 0;

        // First we'll check for horizontal lines 
        for(let slider = 0; slider < board.length; slider++) {
            if(board[y][slider] === char)
                counter++;
        }

        if(counter == board.length)
            return 1;

        // Now we'll check for vertical lines
        counter = 0;

        for(let slider = 0; slider < board.length; slider++) {
            if(board[slider][x] === char)
                counter++;
        }

        if(counter == board.length)
            return 1;

        // We'll use these variables to determine what the starting and endingpoint should be for the diagonals

        let min, max;

        // Note the diagonals are different than what youd think since were working on the 4th quadrant
        // Next we'll check the ascending diagonal
        counter = 0;

        min = Math.min(x, y);

        for(let xAux = x - min, yAux = y - min; xAux < board.length && yAux < board.length; xAux++, yAux++) {
            if(board[yAux][xAux] === char)
                counter++;
        }

        if(counter == board.length) 
            return 1;

        // Finally we'll check the ascending diagonal
        counter = 0;

        max = Math.max(x, y);

        for(let xAux = x + (board.length - (max + 1)), yAux = y + (board.length - (max + 1)); xAux >= 0 && yAux >= 0; xAux--, yAux--)
            if(board[yAux][xAux] === char)
                counter++;

        if (counter == board.length)
            return 1;

        if(plays == playableSlots)
            return -1;

        return 0;
    }

    function clearBoard() {
        plays = 0;
        gameEnded = false;
        playerPointer = 0;
        UIController.resetBoard();
    }

    function setPlayers(newPlayers){
        players = newPlayers;
        console.log(players);
        
    }

    addListenersToBoxes();

    return {
        clearBoard, setPlayers,
    }

})();



const GameController = (function() {

    const submitNewPlayers = document.querySelector("#submit-players-form");
    const inputWindow = document.querySelector("#submit-players");

    async function assignPlayers(){
        let newPlayersData = new FormData(submitNewPlayers);
        let players = [];
        players.push(createPlayer(newPlayersData.get("player1"), "O"));
        players.push(createPlayer(newPlayersData.get("player2"), "X"));
        GameBoard.setPlayers(players);
        inputWindow.close();
    }

    submitNewPlayers.addEventListener("submit", (e) => {
        e.preventDefault();
        assignPlayers();
    });

    function getNames(){
        const inputWindow = document.querySelector("#submit-players");
        inputWindow.showModal();
    }

    return {
        getNames,
    }

})();

document.querySelector(".start-game").addEventListener("click", () => {
    GameController.getNames();
})
