document.addEventListener('DOMContentLoaded', () => {
  const cardArrayEasy = [
    { name: 'fries', img: 'Images/fries.png' },
    { name: 'cheeseburger', img: 'Images/cheeseburger.png' },
    { name: 'ice-cream', img: 'Images/ice-cream.png' }
  ];

  const cardArrayMedium = [
    { name: 'fries', img: 'Images/fries.png' },
    { name: 'cheeseburger', img: 'Images/cheeseburger.png' },
    { name: 'ice-cream', img: 'Images/ice-cream.png' },
    { name: 'pizza', img: 'Images/pizza.png' }
  ];

  const cardArrayHard = [
    { name: 'fries', img: 'Images/fries.png' },
    { name: 'cheeseburger', img: 'Images/cheeseburger.png' },
    { name: 'ice-cream', img: 'Images/ice-cream.png' },
    { name: 'pizza', img: 'Images/pizza.png' },
    { name: 'milkshake', img: 'Images/milkshake.png' },
    { name: 'hotdog', img: 'Images/hotdog.png' }
  ];

  const grid = document.querySelector('#grid');
  const resultDisplay = document.querySelector('#result');
  const timerDisplay = document.querySelector('#timer');
  const difficultySelect = document.querySelector('#difficulty');
  const bestTimeDisplay = document.querySelector('#best-time');
  let cardsChosen = [];
  let cardsChosenId = [];
  let cardsWon = [];
  let timer = 0;
  let gameTimer;
  let cardArray;

  // Load best time from localStorage
  const bestTime = localStorage.getItem('bestTime');
  if (bestTime) {
      bestTimeDisplay.textContent = bestTime + " seconds";
  }

  // Set difficulty based on selected option
  difficultySelect.addEventListener('change', setDifficulty);

  function setDifficulty() {
      const difficulty = difficultySelect.value;
      if (difficulty === 'easy') {
          cardArray = cardArrayEasy;
      } else if (difficulty === 'medium') {
          cardArray = cardArrayMedium;
      } else {
          cardArray = cardArrayHard;
      }
      startGame();
  }

  function startGame() {
      // Create pairs of cards, 2 of each, based on the selected difficulty
      cardArray = cardArray.slice(); // Clone the original card array
      cardArray = [...cardArray, ...cardArray]; // Create pairs of each card
      cardArray.sort(() => 0.5 - Math.random()); // Shuffle the cards
      createBoard();
      cardsWon = [];
      resultDisplay.textContent = 0;
      timer = 0;
      timerDisplay.textContent = timer;
      clearInterval(gameTimer);
      gameTimer = setInterval(updateTimer, 1000);
  }

  function createBoard() {
      grid.innerHTML = '';
      for (let i = 0; i < cardArray.length; i++) {
          const card = document.createElement('img');
          card.setAttribute('src', 'Images/blank.png');
          card.setAttribute('data-id', i);
          card.classList.remove('flipped');
          card.addEventListener('click', flipCard);
          grid.appendChild(card);
      }
  }

  function flipCard() {
      const cardId = this.getAttribute('data-id');
      if (cardsChosenId.includes(cardId)) return; // Prevent flipping the same card
      this.setAttribute('src', cardArray[cardId].img);
      this.classList.add('flipped');
      cardsChosen.push(cardArray[cardId].name);
      cardsChosenId.push(cardId);
      if (cardsChosen.length === 2) {
          setTimeout(checkForMatch, 500);
      }
  }

  function checkForMatch() {
      const cards = document.querySelectorAll('img');
      const optionOneId = cardsChosenId[0];
      const optionTwoId = cardsChosenId[1];

      if (optionOneId === optionTwoId) {
          cards[optionOneId].setAttribute('src', 'Images/blank.png');
          cards[optionTwoId].setAttribute('src', 'Images/blank.png');
          alert('You clicked the same card!');
      } else if (cardsChosen[0] === cardsChosen[1]) {
          alert('You found a match!');
          cards[optionOneId].removeEventListener('click', flipCard);
          cards[optionTwoId].removeEventListener('click', flipCard);
          cardsWon.push(cardsChosen);
      } else {
          cards[optionOneId].setAttribute('src', 'Images/blank.png');
          cards[optionTwoId].setAttribute('src', 'Images/blank.png');
          cards[optionOneId].classList.remove('flipped');
          cards[optionTwoId].classList.remove('flipped');
          alert('Try again!');
      }
      cardsChosen = [];
      cardsChosenId = [];
      resultDisplay.textContent = cardsWon.length;

      if (cardsWon.length === cardArray.length / 2) {
          clearInterval(gameTimer);
          const currentTime = timer;
          alert(`Congratulations! You completed the game in ${currentTime} seconds.`);
          const bestTime = localStorage.getItem('bestTime');
          if (!bestTime || currentTime < bestTime) {
              localStorage.setItem('bestTime', currentTime);
              bestTimeDisplay.textContent = currentTime + " seconds";
          }
      }
  }

  function updateTimer() {
      timer++;
      timerDisplay.textContent = timer;
  }

  startGame();
});
