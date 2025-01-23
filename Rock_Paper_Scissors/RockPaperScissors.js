// Original DOM Elements
const computerChoiceDisplay = document.getElementById('computer-choice');
const userChoiceDisplay = document.getElementById('user-choice');
const resultDisplay = document.getElementById('result');
const possibleChoices = document.querySelectorAll('button');

// New: Score Tracking Variables
let wins = 0;
let losses = 0;
let draws = 0;

// New: Sound Effects with Correct File Extensions
const winSound = new Audio('audios/win.wav');
const loseSound = new Audio('audios/loss.mp3');
const drawSound = new Audio('audios/draw.wav');

// Existing: Variables for User and Computer Choices
let userChoice;
let computerChoice;
let result;

// Original: Handle Button Clicks for User Choice
possibleChoices.forEach((possibleChoice) =>
    possibleChoice.addEventListener('click', (e) => {
        userChoice = e.target.id;
        userChoiceDisplay.innerHTML = userChoice;

        // Animation handled by CSS :active
        generateComputerChoice();
        getResult();
    })
);

// Fixed: Generate Random Computer Choice
function generateComputerChoice() {
    const randomNumber = Math.floor(Math.random() * 3);

    if (randomNumber === 0) {
        computerChoice = 'rock';
    } else if (randomNumber === 1) {
        computerChoice = 'paper';
    } else if (randomNumber === 2) {
        computerChoice = 'scissors';
    }

    computerChoiceDisplay.innerHTML = computerChoice;
}

// Enhanced: Get Result and Update Score
function getResult() {
    if (computerChoice === userChoice) {
        result = 'its a draw!';
        draws++;
        drawSound.play(); // Play draw sound
    } else if (
        (computerChoice === 'rock' && userChoice === 'paper') ||
        (computerChoice === 'paper' && userChoice === 'scissors') ||
        (computerChoice === 'scissors' && userChoice === 'rock')
    ) {
        result = 'you win!';
        wins++;
        winSound.play(); // Play win sound
    } else {
        result = 'you lost!';
        losses++;
        loseSound.play(); // Play lose sound
    }

    resultDisplay.innerHTML = result;

    // Update Scores in the DOM
    document.getElementById('wins').innerText = wins;
    document.getElementById('losses').innerText = losses;
    document.getElementById('draws').innerText = draws;
}
