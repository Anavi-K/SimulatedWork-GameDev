const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('#score')
const livesDisplay = document.querySelector('#lives')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 560
const boardHeight = 300
let xDirection = -2
let yDirection = 2

const userStart = [230, 10]
let currentPosition = userStart

const ballStart = [270, 40]
let ballCurrentPosition = ballStart

let timerId
let score = 0
let lives = 3
let brokenBricks = 0 // Counter for broken bricks

// Sounds
const ballBounce = new Audio('audio/ball-bounce.wav')
const brickHit = new Audio('audio/brick-hit.wav')
const gameWin = new Audio('audio/game-win.wav')
const gameOver = new Audio('audio/game-over.wav')

// Block class
class Block {
  constructor(xAxis, yAxis) {
    this.bottomLeft = [xAxis, yAxis]
    this.bottomRight = [xAxis + blockWidth, yAxis]
    this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
    this.topLeft = [xAxis, yAxis + blockHeight]
  }
}

// Blocks
let blocks = [
  new Block(10, 270),
  new Block(120, 270),
  new Block(230, 270),
  new Block(340, 270),
  new Block(450, 270),
  new Block(10, 240),
  new Block(120, 240),
  new Block(230, 240),
  new Block(340, 240),
  new Block(450, 240),
  new Block(10, 210),
  new Block(120, 210),
  new Block(230, 210),
  new Block(340, 210),
  new Block(450, 210),
]

function addBlocks() {
  blocks.forEach(block => {
    const blockElement = document.createElement('div')
    blockElement.classList.add('block')
    blockElement.style.left = block.bottomLeft[0] + 'px'
    blockElement.style.bottom = block.bottomLeft[1] + 'px'
    grid.appendChild(blockElement)
  })
}
  
// User (Paddle)
const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

// Ball
const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

// Move User (Paddle)
function moveUser(e) {
  switch (e.key) {
    case 'ArrowLeft':
      if (currentPosition[0] > 0) {
        currentPosition[0] -= 10
        drawUser()
      }
      break
    case 'ArrowRight':
      if (currentPosition[0] < (boardWidth - blockWidth)) {
        currentPosition[0] += 10
        drawUser()
      }
      break
  }
}
document.addEventListener('keydown', moveUser)

// Draw User (Paddle)
function drawUser() {
  user.style.left = currentPosition[0] + 'px'
  user.style.bottom = currentPosition[1] + 'px'
}

// Draw Ball
function drawBall() {
  ball.style.left = ballCurrentPosition[0] + 'px'
  ball.style.bottom = ballCurrentPosition[1] + 'px'
}

// Move Ball
function moveBall() {
  ballCurrentPosition[0] += xDirection
  ballCurrentPosition[1] += yDirection
  drawBall()
  checkForCollisions()
}

function startGame() {
  score = 0
  lives = 3
  brokenBricks = 0
  scoreDisplay.innerHTML = score
  livesDisplay.innerHTML = 'Lives: ' + lives
  blocks = [
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
  ]
  addBlocks()
  resetBall()
  timerId = setInterval(moveBall, 30)
  document.querySelector('#startButton').disabled = true
}

document.querySelector('#startButton').addEventListener('click', startGame)

function checkForCollisions() {
  // Block collisions
  for (let i = 0; i < blocks.length; i++) {
    if (
      ballCurrentPosition[0] + ballDiameter > blocks[i].bottomLeft[0] &&
      ballCurrentPosition[0] < blocks[i].bottomRight[0] &&
      ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] &&
      ballCurrentPosition[1] < blocks[i].topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block') // Remove the block from the DOM
      blocks.splice(i, 1) // Remove the block from the array
      brickHit.play() // Play brick-hit sound
      changeDirection() // Change ball direction
      score++
      brokenBricks++ // Increment the broken bricks counter
      scoreDisplay.innerHTML = score
      if (brokenBricks % 5 === 0) {
        increaseBallSpeed() // Increase ball speed after every 5 bricks
      }
      if (blocks.length === 0) {
        gameWin.play() // Play game-win sound
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
      break // Exit loop after breaking the brick
    }
  }

  // Wall hits
  if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) || ballCurrentPosition[0] <= 0) {
    ballBounce.play() // Play ball bounce sound
    xDirection = -xDirection // Reverse x direction
  }

  if (ballCurrentPosition[1] >= (boardHeight - ballDiameter)) {
    ballBounce.play() // Play ball bounce sound
    yDirection = -yDirection // Reverse y direction
  }

  // User (Paddle) collision
  if (
    ballCurrentPosition[0] > currentPosition[0] && ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] && ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    ballBounce.play() // Play ball bounce sound
    yDirection = -yDirection // Reverse y direction
  }

  // Ball falls below the paddle (lose life)
  if (ballCurrentPosition[1] <= 0) {
    lives--
    livesDisplay.innerHTML = 'Lives: ' + lives
    if (lives === 0) {
      gameOver.play() // Play game-over sound
      scoreDisplay.innerHTML = 'Game Over!'
      clearInterval(timerId)
      document.removeEventListener('keydown', moveUser)
    } else {
      resetBall() // Reset ball and paddle after losing a life
    }
  }
}

// Change Ball Direction
function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
    return
  }
  if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
    return
  }
  if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
    return
  }
  if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
    return
  }
}

// Increase Ball Speed
function increaseBallSpeed() {
  if (xDirection > 0) {
    xDirection += 0.8 
  } else {
    xDirection -= 0.8 
  }
  if (yDirection > 0) {
    yDirection += 0.8 
  } else {
    yDirection -= 0.8
  }
}


// Reset Ball Position
function resetBall() {
  ballCurrentPosition = [270, 40]
  xDirection = -2
  yDirection = 2
  drawBall()
  currentPosition = userStart
  drawUser()
}
