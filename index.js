const moves = document.getElementById("moves-count");

const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;
let highscoreval;
//Items array
const items = [
    {name:"squirel", image:"squirel.jpg"},
    {name:"mouse", image:"mouse.jpg"},
    {name:"lion", image:"lion.jpg"},
    {name:"horse", image:"horse.jpg"},
    {name:"fox", image:"fox.jpg"},
    {name:"cat", image:"cat.jpg"},
    {name:"bunny", image:"bunny.jpg"},
    {name:"bear", image:"bear.jpg"}

];
let timer=0;
let movesCount = 0,
  winCount = 0;

let score=0;
const timeGenerator = () => {
    if(timer>60){
        alert("Times UP!! press ok to play again . your score is" + score);
    const  Time = document.getElementById('time');
    timer=0;
    Time.innerHTML = `<span>Time:</span>${60-timer}`;
stopGame();
score=0;
scoreBox.innerHTML="score:"+score;

    }
    else{
        const  Time = document.getElementById('time');
        Time.innerHTML = `<span>Time:</span>${60-timer}`;
timer++;
scoreBox.innerHTML="score:"+score;

    }
};

//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};


const generateRandom = (size = 4) => {

  let tempArray = [...items];
 
  let cardValues = [];
  
  size = (size * size) / 2;

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
 
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];

  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
  
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">*</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            score+=5;
            if((score>highscoreval)){
                highscoreval = score;
                localStorage.setItem("highscore",JSON.stringify(highscoreval))
                highscoreBox.innerHTML ="Highscore:"+highscoreval;
            }
            scoreBox.innerHTML="score:"+score;
            
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>
            <h4>Score: ${score}</h4>`;
              stopGame();
              score=0;
              timer=0;
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};
let highscore = localStorage.getItem("highscore");
if(highscore ===null){
highscoreval = 0;
localStorage.setItem("highscore",JSON.stringify(highscoreval));
}
else{
highscoreval = JSON.parse(highscore);
highscoreBox.innerHTML ="Highscore:"+highscore;
}