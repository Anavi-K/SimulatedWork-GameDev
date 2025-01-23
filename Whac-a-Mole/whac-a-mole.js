const squares = document.querySelectorAll('.square');
const timeLeft = document.querySelector('#time-left');
const score = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

let result = 0;
let hitPosition;
let currentTime = 60;
let timerId = null;
let countDownTimerId = null;

// Function to randomize mole appearance
function randomSquare() {
  squares.forEach(square => {
      square.classList.remove('mole', 'bonus');
  });

  let randomSquare = squares[Math.floor(Math.random() * 9)];
  let moleType = Math.random() < 0.15 ? 'bonus' : 'mole'; // 15% chance for a bonus mole
  randomSquare.classList.add(moleType);

  hitPosition = randomSquare.id;
}

// Event listener for clicking on the mole
squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (square.id == hitPosition) {
            result += square.classList.contains('bonus') ? 5 : 1; // Bonus mole gives 5 points
            score.textContent = result;
            hitPosition = null;
        }
    });
});

// Function to move the mole with random intervals
function moveMole() {
    let speed = Math.max(500 - Math.floor(result / 10) * 50, 200); // Speed increases with score
    timerId = setInterval(randomSquare, speed);
}

// Function to handle countdown
function countDown() {
    currentTime--;
    timeLeft.textContent = currentTime;

    if (currentTime === 0) {
        clearInterval(countDownTimerId);
        clearInterval(timerId);
        alert('GAME OVER! Your final score is ' + result);
        startButton.disabled = false; // Re-enable the Start button
    }
}

// Start the game
function startGame() {
    result = 0;
    score.textContent = result;
    currentTime = 60;
    timeLeft.textContent = currentTime;

    moveMole();
    countDownTimerId = setInterval(countDown, 1000);

    startButton.disabled = true; // Disable the Start button after game starts
}

// Event listener for the Start button
startButton.addEventListener('click', startGame);
