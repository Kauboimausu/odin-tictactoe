
function createPlayer(name, symbol) {
    let score = 0;
    const getScore = () => score;
    const increaseScore = () => score++;

    return {name, score, symbol,  getScore, increaseScore};
}

const GameBoard = (function() {
    // const board = Array.from(Array[3], () => new Array(3));
    const board = Array.from(Array(3), () => Array.from(Array(3), () => "-"));

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

    // Function that makes a play and returns whether it's a wining play or not 
    function makePlay(xPosition, yPosition, char) {
        board[yPosition][xPosition] = char;
        return checkForWin(xPosition, yPosition, char);
    }

    // Function that verifies if a play made won the game
    function checkForWin(x, y, char){
        let horizontalCounter, verticalCounter, descendingCounter, ascendingCounter = 0;

        // First we'll check for horizontal lines 
        for(let slider = 0; slider < board.length; slider++) {
            if(board[y][slider] === char)
                horizontalCounter++;
        }

        if(horizontalCounter == board.length)
            return true;

        // Now we'll check for vertical lines

        for(let slider = 0; slider < board.length; slider++) {
            if(board[slider][x] === char)
                verticalCounter++;
        }

        if(verticalCounter == board.length);
            return true;

    }

    function clearBoard(){
        for(let row = 0; row < board.length; row++){
            for(let column = 0; column < board[row].length; column++)
                board[row][column] = "-";
        }
    }

    return {
        boardToString, makePlay, clearBoard,
    }

})();

console.log(GameBoard.boardToString());

const UIController = (function (){

})();

const GameController = (function() {
    let player1 = "Isa";
    let player2 = "Isa2";
})();