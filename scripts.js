/* ---------------------------------------------------------------------
Tic-Tac-Toe Logic
JavaScript written by: Ryan Tan Yang Heng
UI inspired by Frontend Mentor (see styles.css for details)
------------------------------------------------------------------------ */

// Get HTML Elements
const player1PointsEl = document.getElementById("player-1-score-tag");
const player2PointsEl = document.getElementById("player-2-score-tag");
const drawCountEl = document.getElementById("draw-counts-tag");
const output = document.getElementById("output");
const gameGrid = document.getElementById("game-grid");
const gameGridCells = gameGrid.querySelectorAll("button");
const winningLine = document.getElementById("winning-line");

// Game variables
const gameState = 
{
    playerMoves : {
        player1: new Set(),
        player2: new Set(),
    },
    playerState : {
        currentTurn : "player1",
        scores: { 
            player1: 0, 
            player2: 0 
        },
    },
    status : {
        gameWon : false,
        gameEnd : false,
        winningPlayer : "", 
        drawCount: 0,
        winningIndex: -1,
    },
}

const winningCombinations = 
[
    [1, 2, 3], [4, 5, 6], [7, 8, 9], 
    [1, 4, 7], [2, 5, 8], [3, 6, 9], 
    [1, 5, 9], [3, 5, 7]
];

function initialiseEventListeners() {
    gameGridCells.forEach((button) => {
        // For mouse devices
        button.addEventListener("mousedown", () => handlePlayerInput(button));
        button.addEventListener("mouseup", (event) => handleTouchOrMouseEnd(event, button));

        // For touch devices
        button.addEventListener("touchstart", () => handlePlayerInput(button));
        button.addEventListener("touchend", (event) => handleTouchOrMouseEnd(event, button));
    })
    document.getElementById("restartBtn").addEventListener("click", resetGame);
}

function resetGame() {
    // Reset game state
    gameState.playerMoves.player1 = new Set();
    gameState.playerMoves.player2 = new Set();
    gameState.playerState.currentTurn = "player1";
    gameState.status.gameWon = false;
    gameState.status.gameEnd = false;
    gameState.status.winningPlayer = "";
    gameState.status.winningIndex = -1;

    // Update the output message to Player 1's turn
    updateUIMessage("Player 1's Turn", "turquoise");

    // Remove additional styles from winning line
    winningLine.classList = "winning-line";

    // Reset the grid cells
    gameGridCells.forEach(button => {
        button.innerHTML = "";
        button.disabled = false;
    });
}

function updateUIMessage(message, color) {
    output.innerHTML = message;
    output.className = color;
}

function handlePlayerInput(button) {
    if (button.innerHTML === "" && !gameState.status.gameEnd) {
        updateGridCell(button);
        updatePlayerArray(button); 
        checkPlayerMoves();
        togglePlayerTurn();
    };
}

function updateGridCell(button) {
    const gridCellImg = document.createElement("img");
    gridCellImg.src = gameState.playerState.currentTurn === "player1" ? "assets/images/cross.jpg" : "assets/images/circle.jpg";
    gridCellImg.alt = gameState.playerState.currentTurn === "player1" ? "X" : "O";
    gridCellImg.className = "game-grid-animate-shape-shrink";

    button.innerHTML = "";
    button.appendChild(gridCellImg);
}

function updatePlayerArray(button) {
    gameState.playerMoves[gameState.playerState.currentTurn].add(parseInt(button.dataset.tag));
}

function checkPlayerMoves() {
    const currentPlayerArray = gameState.playerState.currentTurn === "player1" ? gameState.playerMoves.player1 : gameState.playerMoves.player2;
    const winningIndex = getWinningIndex(currentPlayerArray);

    // Check if either players won
    if (winningIndex !== -1) {
        gameState.status.winningIndex = winningIndex;
        gameState.status.gameWon = true;
        gameState.status.winningPlayer = gameState.playerState.currentTurn;
        updateGameState();
        endGame();
        return;
    }

    // Handle draw condition
    if (gameState.playerMoves.player1.size + gameState.playerMoves.player2.size === 9 && !gameState.status.gameWon) {
        updateUIMessage("It's a draw!", "grey");
        gameState.status.drawCount++;
        drawCountEl.innerHTML = gameState.status.drawCount;
        endGame(); 
    }
}

function getWinningIndex(playerArray) {
    return winningCombinations.findIndex(combination => 
        combination.every(cell => playerArray.has(cell)))
}

function togglePlayerTurn() {
    if (!gameState.status.gameWon && !gameState.status.gameEnd) {
        gameState.playerState.currentTurn = gameState.playerState.currentTurn === "player1" ? "player2" : "player1";
        updateUIMessage(`Player ${gameState.playerState.currentTurn === "player1" ? "1" : "2"}'s Turn`, 
        gameState.playerState.currentTurn === "player1" ? "turquoise" : "orange");
    }  
}

function updateGameState() {
    const winner = gameState.status.winningPlayer;
    // Update player points
    gameState.playerState.scores[winner]++; 
    player1PointsEl.innerHTML = gameState.playerState.scores.player1;
    player2PointsEl.innerHTML = gameState.playerState.scores.player2;

    // Update output
    updateUIMessage(winner === "player1" ? "Player 1 Won!" : "Player 2 Won!", winner === "player1" ? "turquoise" : "orange");

    // Display winning line
    winningLine.classList.add(`winning-line-${gameState.status.winningIndex}`);
    winningLine.classList.add(winner === "player1" ? "turquoise" : "orange");
    winningLine.classList.add(gameState.status.winningIndex <= 5 ? "grow-animation-0-5" : "grow-animation-6-7");
}

function endGame() {
    gameState.status.gameEnd = true;
    gameGridCells.forEach((button) => {
        button.disabled = true;
    })
}

function handleTouchOrMouseEnd(event, button) {
    // Prevents default behavior (like scrolling or zooming)
    event.preventDefault();
    button.disabled = true;
    const gridCellImg = button.querySelector("img");
    gridCellImg.className = "shape-grow";
}

window.addEventListener("load", function() {
    initialiseEventListeners();
});


