const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

let currentPlayer = 'X';
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const index = e.target.getAttribute('data-index');
    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    e.target.classList.add('animated');
    setTimeout(() => e.target.classList.remove('animated'), 300);

    checkWinner();
}

function checkWinner() {
    let roundWon = false;
    let winningCombo = [];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCombo = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        statusText.classList.add('winner');
        gameActive = false;
        winningCombo.forEach(i => cells[i].classList.add('winning'));
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        statusText.classList.add('draw');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
    currentPlayer = 'X';
    gameActive = true;
    board = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = "Player X's turn";
    statusText.classList.remove('winner', 'draw');
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('winning');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);