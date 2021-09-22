/* 
GAME FUNCTION:
- Player must guess a number between a min and max
- Player gets a certain amount of guesses
- Notify the player of guesses remaining
- Notify the playee of the correct answer if lost
- Let player chose to play again
*/

//Game Values
let
  min = 1,
  max = 10,
  guessesLeft = 0,
  currentHiScore = 0;

// Ui Elements
const
  game = document.querySelector('#game'),
  minNum = document.querySelector('.min-num'),
  maxNum = document.querySelector('.max-num'),
  guessBtn = document.querySelector('#guess-btn'),
  guessInput = document.querySelector('#guess-input'),
  message = document.querySelector('.message'),
  gameMode = document.querySelector('.modeSelect')
highScore = document.querySelector('.hi-score'),
  clearButton = document.querySelector('.button'),
  scoreList = document.querySelector('.scores');

//Assign Ui Min And Max
minNum.textContent = min;
maxNum.textContent = max;
//Play Again Function
game.addEventListener('mousedown', (e) => {
  if (e.target.className === 'play-again') {
    window.location.reload();
  }
})

//Generating Random Num
function getWinningNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//Game mode + winning number function calling
let winningNumber =
  function(mode) {
    if (mode === 'Easy') {
      max = 10
      guessesLeft = 5;
      maxNum.textContent = max;
      winNum = getWinningNumber(min, max);
      guessInput.disabled = false;
      guessBtn.disabled = false;
    } else if (mode === 'Normal') {
      max = 20;
      maxNum.textContent = max;
      guessesLeft = 10;
      winNum = getWinningNumber(min, max);
      guessInput.disabled = false;
      guessBtn.disabled = false;

    } else if (mode === 'Hard') {
      max = 30;
      maxNum.textContent = max;
      guessesLeft = 15;
      winNum = getWinningNumber(min, max);
      guessInput.disabled = false;
      guessBtn.disabled = false;

    } else if (mode === 'disabled') {
      guessInput.disabled = true;
    }
  }

//Set Message
const setMessage = (msg, color) => {
  message.style.color = color
  message.textContent = msg;
}

//Game Over Screen Win || Lose
const gameOver = (won, msg) => {
  let color;
  won === true ? color = 'green' : color = 'red';

  //Disabling The Input Field
  guessInput.disabled = true;
  //Setting The Colour
  guessInput.style.borderColor = color;
  //Setting Text Colour
  message.style.color = color;
  //Notifying The User
  setMessage(msg)

  //Play Again
  guessBtn.value = 'Play Again';
  guessBtn.className += 'play-again';
}

//Game Mode Select Function
gameMode.addEventListener('change', (e) => {
  const mode = e.target.value;
  const p = document.querySelector('.mode-selected');
  winningNumber(mode);
  p.textContent = `You've chosed ${mode} mode, GOOD LUCK! You have ${guessesLeft} chances to guess the correct number.
  `;
  if (mode === 'Easy') {
    p.style.color = 'Green';
  } else if (mode === 'Normal') {
    p.style.color = '#290FBA';
  } else if (mode === 'Hard') {
    p.style.color = '#FF5C58';
  }

});

//Listen For Guess
guessBtn.addEventListener('click', (e) => {
  guess = parseInt(guessInput.value)

  if (e.target.value === 'Submit' && guess === '') {
    guessBtn.disabled = true;
  }

  if (isNaN(guess) || guess < min || guess > max) {
    setMessage(`Please enter a number between  ${min} and ${max}`, 'red');
  }
  //Check if User Num Is Same As Winning Num
  if (guess === winNum) {
    //Game Over-Won
    gameOver(true, `${winNum} is correct number, You Won!`)

    //Setting The High Score 
    if (guessesLeft > currentHiScore) {
      let current_score = guessesLeft

      highScore.textContent = guessesLeft;

      setScoreToLocalStorage(guessesLeft);

      if (guessesLeft < current_score) {
        setScoreToLocalStorage(guessesLeft)
      } else if (guessesLeft > current_score) {
        setScoreToLocalStorage(current_score)
      }
    }

  } else {
    if (guessesLeft === 0) {
      //Game Over-Lost 
      gameOver(false, `${winNum} was the correct number, You Lost!`)
    } else if (guessesLeft > 0) {
      //Game Continues - Wrong Guess

      setMessage(`${guess} is not correct, ${guessesLeft} guess left`, 'red')

      guessInput.style.borderColor = 'red';

      guessInput.value = '';

      guessesLeft -= 1;
    }
  }
});

//Setting The Hiscore To Local Storage
function setScoreToLocalStorage(scores) {
  let score;
  if (localStorage.getItem('score') === null) {
    score = [];
  } else {
    score = JSON.parse(localStorage.getItem('score'))
  }
  score.push(scores);
  localStorage.setItem('score', JSON.stringify(score));
}

//Showing The Hiscore 
function showScoreFromLocalStorage() {
  let score;
  if (localStorage.getItem('score') === null) {
    score = [];
  } else {
    score = JSON.parse(localStorage.getItem('score'))
  }

  //Creating The Elements to show the Hiscore
  score.forEach(function(scores) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(scores));
    highScore.appendChild(p)
  })
}

//Clear Hi-score 
clearButton.addEventListener('click', () => {
  while (scoreList.firstChild) {
    scoreList.removeChild(scoreList.firstChild)
  }
  localStorage.clear();
})



document.addEventListener('DOMContentLoaded', () => {
  showScoreFromLocalStorage();
  guessInput.disabled = true;
  guessBtn.disabled = true;
  // alert('loaded')
})