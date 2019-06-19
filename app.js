/*
GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game
*/

const RESET_VALUE = 2;

let scores = [0, 0];
let activePlayer = 0;
let activePlayerName = '';
let current = 0;
let rating = {};

const diceElement = document.querySelectorAll('.dice');
const maxScore = document.querySelector('.input');

const player0 = prompt('Player 1', 'Player 1');
const player1 = prompt('Player 2', 'Player 2');

document.getElementById('name-0').innerText = player0;
document.getElementById('name-1').innerText = player1;

const initGame = () => {
  const ratingStorage = JSON.parse(localStorage.getItem('rating'));

  rating[player0] = ratingStorage && ratingStorage[player0] || 0;
  rating[player1] = ratingStorage && ratingStorage[player1] || 0;
  activePlayerName = player0;

  document.querySelector('#current-0').textContent = 0;
  document.querySelector('#current-1').textContent = 0;
  document.querySelector('#score-0').textContent = 0;
  document.querySelector('#score-1').textContent = 0;
  [...diceElement].forEach((item) => item.style.display = 'none');
};

initGame();

document.querySelector('.btn-roll').addEventListener('click', function() {
  const dices = [];

  [...diceElement].map((item) => {
    const dice = Math.floor(Math.random() * 6) + 1;
    dices.push(dice);

    item.src = `dice-${dice}.png`;
    item.style.display = 'block';
  });

  const isDicesEqual = dices.every((value, i, arr) => value === arr[0]);

  if (dices.includes(RESET_VALUE) || isDicesEqual) {
    return changePlayer();
  }

  const points = dices.reduce((acc, current) => acc + current, 0);
  current += points;
  document.getElementById('current-'+activePlayer).textContent = current;

  if (scores[activePlayer] + current >= maxScore.value) {
    rating[activePlayerName] = rating[activePlayerName] + 1;
    localStorage.setItem('rating', JSON.stringify(rating));
    alert(`Player ${activePlayer} won!!!`);
  }
});

const changePlayer = () => {
  activePlayer = +!activePlayer;
  activePlayerName = document.getElementById(`name-${activePlayer}`).textContent;
  current = 0;
  document.getElementById('current-'+activePlayer).textContent = 0;
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
  [...diceElement].forEach((item) => item.style.display = 'none');
  document.querySelector(`.player-${activePlayer}-panel`).classList.toggle('active');
};

document.querySelector('.btn-hold').addEventListener('click', function() {
  scores[activePlayer] += current;
  document.querySelector(`#score-${activePlayer}`).textContent = scores[activePlayer];
  changePlayer();
});

document.querySelector('.btn-new').addEventListener('click', function() {
  initGame();
});

document.querySelector('.rating-btn').addEventListener('click', function () {
  const ratingSort = Object.keys(rating)
    .sort((a, b) => rating[a] - rating[b])
    .map(item => `${item}-${rating[item]}`)
    .reverse()
    .join("\r\n");

  alert(ratingSort)
});