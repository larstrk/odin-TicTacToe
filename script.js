// Create IIFE for the Gameboard because we only use it once 
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""]

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;

        Game.addClickEvent();
    }
    
    const update = (index, value) => {
        gameboard[index] = value;
        render();
    }

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard,
    }

})();

// Factory to create a player
const createPlayer = (name, mark) => {
    return {
        name,
        mark,
    }
}

// Module to control the game as an IIFE
const Game = (() => {
    let players = [];
    let currentPlayer;
    let gameOver;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayer = 0;
        gameOver = false;
        console.log("Player1: " + players[0].name + " - " + players[0].mark);
        console.log("Player2: " + players[1].name + " - " + players[1].mark);

        Gameboard.render();

        console.log("Gameboard render success")
    }

    const restart = () => {
        for (let i = 0; i < 9; i++) {
            Gameboard.update(i, "");
        }
        Gameboard.render();
        displayController.renderMessage("");
        currentPlayer = 0;
        gameOver = false;
    }

    const addClickEvent = () => {
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    }

    const handleClick = (event) => {
        if (gameOver) {
            return;
        }

        let index = parseInt(event.target.id.split("-")[1]);
        console.log(index);

        if (Gameboard.getGameboard()[index] !== "") {
            return;
        }

        Gameboard.update(index, players[currentPlayer].mark);

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayer].mark)) {
            gameOver = true;
            console.log(`${players[currentPlayer].name} won!`)
            displayController.renderMessage(`${players[currentPlayer].name} won!`);
        }else if (checkForTie(Gameboard.getGameboard())) {
            gameOver = true;
            console.log("It's a tie!")
            displayController.renderMessage("It's a tie!");
        }

        currentPlayer = currentPlayer === 0 ? 1 : 0;
    }

    return {
        start,
        restart,
        addClickEvent,
        handleClick,
    }
})();

function checkForWin(board) {
    const winningCombs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winningCombs.length; i++) {
        const [a, b, c] = winningCombs[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

// Display Controller module to handle all messages 
const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }

    return {
        renderMessage,
    }
})()

// Handle the start and restart button and its event.
const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");

startBtn.addEventListener("click", ()=> {
    Game.start();
    console.log("Game started");
})

restartBtn.addEventListener("click", ()=> {
    Game.restart();
    console.log("Game restarted");
})

Gameboard.render();