const UIController = (function () {
    board = document.querySelector(".gameboard");

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

    function updateUI(y, x, char) {
        const box = document.getElementsByClassName(`row${y} column${x}`);
        box[0].textContent = char;
    }

    return {
        updateUI,
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
        for(let row = 0; row < board.length; row++) {
            for(let column = 0; column < board[row].length; column++)
                board[row][column] = "-";
        }
    }

    return {
        boardToString, makePlay, clearBoard,
    }

})();

console.log(GameBoard.boardToString());
GameBoard.makePlay(1, 1, "X");
console.log(GameBoard.boardToString());
GameBoard.makePlay(0, 2, "O");
console.log(GameBoard.boardToString());
GameBoard.makePlay(0, 1, "X");
console.log(GameBoard.boardToString());
GameBoard.makePlay(0, 0, "X");
console.log(GameBoard.boardToString());
GameBoard.makePlay(2, 2, "X");
console.log(GameBoard.boardToString());
GameBoard.makePlay(1, 2, "O");
console.log(GameBoard.boardToString());
GameBoard.makePlay(1, 0, "O");
console.log(GameBoard.boardToString());
GameBoard.makePlay(2, 0, "O");
console.log(GameBoard.boardToString());
const tie = GameBoard.makePlay(2, 1, "O");
console.log(GameBoard.boardToString());
console.log(tie);



const GameController = (function() {

    let player1, player2;
    const submitNewPlayers = document.querySelector(".submit-names");

    async function assignPlayers(){
        let newPlayersData = new FormData(submitNewPlayers);
        player1 = createPlayer(newPlayersData.get("name1"), "O");
        player2 = createPlayer(newPlayersData.get("name2"), "X");
        console.log("hi");
        
    }

    function getNames(){
        const inputWindow = document.querySelector("#submit-players");
        inputWindow.showModal();
    }

    submitNewPlayers.addEventListener("submit", (e) => {
        e.preventDefault();
        assignPlayers();
    });

    return {
        getNames,
    }

})();

document.querySelector(".start-game").addEventListener("click", () => {
    GameController.getNames();
})