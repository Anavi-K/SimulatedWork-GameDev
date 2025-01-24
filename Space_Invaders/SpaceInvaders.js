const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
let aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let waveCount = 0;  // Track the number of completed waves

// Create grid and squares
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

// Define alien invaders (initial wave)
let alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

// Audio elements
const winAudio = new Audio("audio/win.wav");
const lossAudio = new Audio("audio/loss.mp3");
const shootAudio = new Audio("audio/shoot.wav");
const hitAudio = new Audio("audio/hit.wav");

// Draw invaders
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add("invader");
        }
    }
}

draw();

// Add shooter
squares[currentShooterIndex].classList.add("shooter");

// Remove invaders
function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove("invader");
    }
}

// Move shooter
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
            break;
    }
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

// Move invaders
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1;
            direction = -1;
            isGoingRight = false;
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1;
            direction = 1;
            isGoingRight = true;
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction;
    }

    draw();

    // Game over if the shooter is hit
    if (squares[currentShooterIndex].classList.contains("invader")) {
        handleLoss(); // Play loss sound and show Game Over message
    }

    // Start a new wave if all aliens are removed
    if (aliensRemoved.length === alienInvaders.length) {
        waveCount++;  // Increment wave count after each wave
        if (waveCount < 2) {
            resetWave();  // Reset for the next wave
        } else {
            handleWin(); // Play win sound and show You Win message after 2 waves
        }
    }
}

invadersId = setInterval(moveInvaders, 600);

// Handle win
function handleWin() {
    resultDisplay.innerHTML = "YOU WIN! Final Score: " + results;
    winAudio.play(); // Play win sound
    clearInterval(invadersId); // Stop the game after 2 waves
}

// Handle loss
function handleLoss() {
    resultDisplay.innerHTML = "GAME OVER! Final Score: " + results;
    clearInterval(invadersId);
    lossAudio.play(); // Play loss sound
}

// Reset the game for the next wave
function resetWave() {
    aliensRemoved = [];
    alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39
    ];
    draw();
}

// Shoot laser
function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add("laser");

        if (squares[currentLaserIndex].classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = "Score: " + results;  // Continuously display the score

            // Play hit sound when an alien is hit
            hitAudio.play();
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
        shootAudio.play(); // Play shooting sound when shoot is triggered
    }
}

document.addEventListener('keydown', shoot);
