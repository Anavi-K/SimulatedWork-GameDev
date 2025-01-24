const grid = document.querySelector('.grid');
const currentPlayerDisplay = document.getElementById('current-player');
const timerDisplay = document.getElementById('timer');
const gameStatusDisplay = document.getElementById('game-status');
let currentPlayer = 1;
let gameActive = true;
let timer;
let timeLeft = 15;

// Create the grid dynamically
function createGrid() {
  for (let i = 0; i < 42; i++) {
    const slot = document.createElement('div');
    slot.classList.add('slot');
    slot.setAttribute('data-index', i);
    grid.appendChild(slot);
  }
}

const slots = [];

// Start the game timer
function startTimer() {
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    } else {
      clearInterval(timer);
      switchPlayer();
      timeLeft = 15;
      startTimer();
    }
  }, 1000);
}

// Drop the token in the grid
function dropToken(index, playerClass) {
  let dropIndex = index;
  while (
    dropIndex + 7 < 42 &&
    !slots[dropIndex + 7].classList.contains('player-one') &&
    !slots[dropIndex + 7].classList.contains('player-two')
  ) {
    dropIndex += 7;
  }
  slots[dropIndex].classList.add(playerClass, 'falling');
  setTimeout(() => {
    slots[dropIndex].classList.remove('falling');
  }, 500);
  return dropIndex;
}

// Switch players
function switchPlayer() {
  if (!gameActive) return;

  const playerClass = currentPlayer === 1 ? 'player-one' : 'player-two';
  if (checkWin(playerClass)) {
    clearInterval(timer);
    gameActive = false;
    gameStatusDisplay.textContent = `Player ${currentPlayer} Wins!`;
    return;
  }

  currentPlayer = currentPlayer === 1 ? 2 : 1;
  currentPlayerDisplay.textContent = currentPlayer;

  if (currentPlayer === 2) {
    setTimeout(() => {
      aiMove();
      switchPlayer();
    }, 500);
  }
}

// Check win condition
function checkWin(playerClass) {
  // Check horizontal, vertical, and diagonal directions
  const winningCombos = [
    // Horizontal
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
    [7, 8, 9, 10],
    [8, 9, 10, 11],
    [9, 10, 11, 12],
    [10, 11, 12, 13],
    [14, 15, 16, 17],
    [15, 16, 17, 18],
    [16, 17, 18, 19],
    [17, 18, 19, 20],
    [21, 22, 23, 24],
    [22, 23, 24, 25],
    [23, 24, 25, 26],
    [24, 25, 26, 27],
    [28, 29, 30, 31],
    [29, 30, 31, 32],
    [30, 31, 32, 33],
    [31, 32, 33, 34],
    [35, 36, 37, 38],
    [36, 37, 38, 39],
    [37, 38, 39, 40],
    [38, 39, 40, 41],
    // Vertical
    [0, 7, 14, 21],
    [7, 14, 21, 28],
    [14, 21, 28, 35],
    [1, 8, 15, 22],
    [8, 15, 22, 29],
    [15, 22, 29, 36],
    [2, 9, 16, 23],
    [9, 16, 23, 30],
    [16, 23, 30, 37],
    [3, 10, 17, 24],
    [10, 17, 24, 31],
    [17, 24, 31, 38],
    [4, 11, 18, 25],
    [11, 18, 25, 32],
    [18, 25, 32, 39],
    [5, 12, 19, 26],
    [12, 19, 26, 33],
    [19, 26, 33, 40],
    [6, 13, 20, 27],
    [13, 20, 27, 34],
    [20, 27, 34, 41],
    // Diagonal (left-to-right)
    [3, 9, 15, 21],
    [4, 10, 16, 22],
    [5, 11, 17, 23],
    [10, 16, 22, 28],
    [11, 17, 23, 29],
    [12, 18, 24, 30],
    [17, 23, 29, 35],
    [18, 24, 30, 36],
    [19, 25, 31, 37],
    // Diagonal (right-to-left)
    [6, 12, 18, 24],
    [5, 11, 17, 23],
    [4, 10, 16, 22],
    [3, 9, 15, 21],
    [10, 16, 22, 28],
    [9, 15, 21, 27],
    [8, 14, 20, 26],
    [7, 13, 19, 25]
  ];

  return winningCombos.some(combo =>
    combo.every(index => slots[index].classList.contains(playerClass))
  );
}

// AI Logic
function aiMove() {
  const playerTwoClass = 'player-two';
  const validMoves = [];
  for (let i = 0; i < 42; i++) {
    if (
      !slots[i].classList.contains('player-one') &&
      !slots[i].classList.contains('player-two')
    ) {
      validMoves.push(i);
    }
  }
  const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
  dropToken(randomMove, playerTwoClass);
}

// Attach event listeners
function setupEventListeners() {
  slots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
      if (
        !gameActive ||
        slot.classList.contains('player-one') ||
        slot.classList.contains('player-two')
      )
        return;

      dropToken(index, currentPlayer === 1 ? 'player-one' : 'player-two');
      timeLeft = 15; // Reset timer
      switchPlayer();
    });
  });
}

// Start the game
createGrid();
const slotElements = document.querySelectorAll('.slot');
slotElements.forEach(slot => slots.push(slot));
setupEventListeners();
startTimer();