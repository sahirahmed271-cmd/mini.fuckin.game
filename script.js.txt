// -------- Menu Function --------
function showGame(id){
  document.querySelectorAll('.game').forEach(g=>g.style.display='none');
  document.getElementById(id).style.display='block';
}
showGame('tic-tac-toe'); // Show first game by default

// -------- Tic-Tac-Toe --------
let tttBoard = Array(9).fill(null);
let tttCurrent = "X";

function tttRender() {
  let html = "";
  tttBoard.forEach((val,i)=>{
    html += `<div class="cell" onclick="tttMove(${i})">${val||""}</div>`;
  });
  document.getElementById("ttt-board").innerHTML = html;
}

function tttMove(i){
  if(!tttBoard[i]){
    tttBoard[i] = tttCurrent;
    tttCurrent = tttCurrent === "X" ? "O" : "X";
    tttRender();
    tttCheckWin();
  }
}

function tttCheckWin(){
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for(let combo of wins){
    let [a,b,c] = combo;
    if(tttBoard[a] && tttBoard[a] === tttBoard[b] && tttBoard[a] === tttBoard[c]){
      document.getElementById("ttt-status").innerText = tttBoard[a]+" Wins!";
      return;
    }
  }
  if(!tttBoard.includes(null)){
    document.getElementById("ttt-status").innerText = "Draw!";
  }
}

function tttRestart(){
  tttBoard = Array(9).fill(null);
  tttCurrent = "X";
  document.getElementById("ttt-status").innerText = "";
  tttRender();
}
tttRender();


// -------- Rock-Paper-Scissors --------
function rpsPlay(player){
  const choices = ['rock','paper','scissors'];
  const computer = choices[Math.floor(Math.random()*3)];
  let result = "";
  if(player === computer) result="Draw!";
  else if(
    (player==='rock' && computer==='scissors') ||
    (player==='paper' && computer==='rock') ||
    (player==='scissors' && computer==='paper')
  ) result="You Win!";
  else result="Computer Wins!";
  document.getElementById("rps-result").innerText = `You: ${player} | Computer: ${computer} → ${result}`;
}

// -------- Number Guessing --------
let numberToGuess = Math.floor(Math.random()*10)+1;
function checkGuess(){
  const guess = parseInt(document.getElementById("guess-input").value);
  let msg="";
  if(guess===numberToGuess) msg="🎉 Correct! You guessed it!";
  else if(guess<numberToGuess) msg="Too low!";
  else msg="Too high!";
  document.getElementById("guess-result").innerText = msg;
}

// -------- Car/Bike Game --------
const raceCanvas = document.getElementById("raceCanvas");
const raceCtx = raceCanvas.getContext("2d");
let playerCar = {x:180, y:500, width:40, height:60, speed:10};
let obstacles = [];
let raceScore = 0;
let raceOver = false;

document.addEventListener("keydown", e=>{
  if(showingGame('car-bike') && !raceOver){
    if(e.key==="ArrowLeft") playerCar.x -= playerCar.speed;
    if(e.key==="ArrowRight") playerCar.x += playerCar.speed;
    if(e.key==="ArrowUp") playerCar.y -= playerCar.speed;
    if(e.key==="ArrowDown") playerCar.y += playerCar.speed;
    if(playerCar.x <0) playerCar.x=0;
    if(playerCar.x >raceCanvas.width-playerCar.width) playerCar.x=raceCanvas.width-playerCar.width;
    if(playerCar.y <0) playerCar.y=0;
    if(playerCar.y >raceCanvas.height-playerCar.height) playerCar.y=raceCanvas.height-playerCar.height;
  }
});

function showingGame(id){
  return document.getElementById(id).style.display === "block";
}

function addObstacle(){
  if(raceOver) return;
  let width = Math.random()*80+20;
  let x = Math.random()*(raceCanvas.width-width);
  obstacles.push({x: x, y: -60, width: width, height: 20});
}

function updateRace(){
  if(!showingGame('car-bike') || raceOver) return;

  raceCtx.clearRect(0,0,raceCanvas.width,raceCanvas.height);
  raceCtx.fillStyle="red";
  raceCtx.fillRect(playerCar.x, playerCar.y, playerCar.width, playerCar.height);

  raceCtx.fillStyle="black";
  for(let obs of obstacles){
    obs.y +=5;
    raceCtx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if(playerCar.x < obs.x + obs.width &&
       playerCar.x + playerCar.width > obs.x &&
       playerCar.y < obs.y + obs.height &&
       playerCar.y + playerCar.height > obs.y){
      raceOver = true;
      document.getElementById("race-score").innerText = "Game Over! Score: " + raceScore;
    }
  }

  obstacles = obstacles.filter(o=>o.y<raceCanvas.height);
  raceScore++;
  document.getElementById("race-score").innerText = "Score: "+raceScore;
  requestAnimationFrame(updateRace);
}

setInterval(addObstacle, 1000);

function restartRace(){
  playerCar = {x:180, y:500, width:40, height:60, speed:10};
  obstacles = [];
  raceScore = 0;
  raceOver = false;
  updateRace();
}

setInterval(()=>{ if(showingGame('car-bike')) updateRace(); }, 30);

// -------- Snake Game --------
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
let snakeSize = 20;
let snake = [{x:200, y:200}];
let snakeDir = 'RIGHT';
let snakeFood = {x: Math.floor(Math.random()*20)*snakeSize, y: Math.floor(Math.random()*20)*snakeSize};
let snakeScore = 0;
let snakeGameOver = false;

document.addEventListener("keydown", e=>{
  if(!showingGame('snake')) return;
  if(e.key==="ArrowUp" && snakeDir!=="DOWN") snakeDir="UP";
  if(e.key==="ArrowDown" && snakeDir!=="UP") snakeDir="DOWN";
  if(e.key==="ArrowLeft" && snakeDir!=="RIGHT") snakeDir="LEFT";
  if(e.key==="ArrowRight" && snakeDir!=="LEFT") snakeDir="RIGHT";
});

function updateSnake(){
  if(!showingGame('snake') || snakeGameOver) return;

  snakeCtx.clearRect(0,0,snakeCanvas.width,snakeCanvas.height);

  // move snake
  let head = {x: snake[0].x, y: snake[0].y};
  if(snakeDir==="UP") head.y -= snakeSize;
  if(snakeDir==="DOWN") head.y += snakeSize;
  if(snakeDir==="LEFT") head.x -= snakeSize;
  if(snakeDir==="RIGHT") head.x += snakeSize;

  // collision
  if(head.x <0 || head.x >= snakeCanvas.width || head.y <0 || head.y >= snakeCanvas.height || snake.some(s=>s.x===head.x && s.y===head.y)){
    snakeGameOver = true;
    document.getElementById("snake-score").innerText = "Game Over! Score: " + snakeScore;
    return;
  }

  snake.unshift(head);

  // eat food
  if(head.x===snakeFood.x && head.y===snakeFood.y){
    snakeScore++;
    snakeFood = {x: Math.floor(Math.random()*20)*snakeSize, y: Math.floor(Math.random()*20)*snakeSize};
  } else {
    snake.pop();
  }

  // draw snake
  snakeCtx.fillStyle="green";
  snake.forEach(s=>snakeCtx.fillRect(s.x, s.y, snakeSize, snakeSize));
  // draw food
  snakeCtx.fillStyle="red";
  snakeCtx.fillRect(snakeFood.x, snakeFood.y, snakeSize, snakeSize);

  document.getElementById("snake-score").innerText = "Score: "+snakeScore;
  requestAnimationFrame(updateSnake);
}

function restartSnake(){
  snake = [{x:200, y:200}];
  snakeDir='RIGHT';
  snakeFood = {x: Math.floor(Math.random()*20)*snakeSize, y: Math.floor(Math.random()*20)*snakeSize};
  snakeScore = 0;
  snakeGameOver = false;
  updateSnake();
}

setInterval(()=>{ if(showingGame('snake')) updateSnake(); }, 100);

// -------- Memory Card Game --------
let memoryCards = [];
let memoryFirst=null, memorySecond=null;
let memoryLock=false, memoryMatches=0;

function setupMemory(){
  memoryCards = [];
  memoryMatches = 0;
  const values = [1,2,3,4,5,6,7,8];
  const cards = [...values, ...values].sort(()=>0.5-Math.random());
  const board = document.getElementById("memory-board");
  board.innerHTML = "";
  cards.forEach(val=>{
    const card = document.createElement("div");
    card.className="memory-card";
    card.dataset.value=val;
    card.innerText="?";
    card.onclick=()=>flipMemory(card);
    board.appendChild(card);
    memoryCards.push(card);
  });
}

function flipMemory(card){
  if(memoryLock || card===memoryFirst || card.innerText!== "?") return;
  card.innerText=card.dataset.value;
  if(!memoryFirst){
    memoryFirst=card;
  } else {
    memorySecond=card;
    if(memoryFirst.dataset.value===memorySecond.dataset.value){
      memoryMatches++;
      memoryFirst=null;
      memorySecond=null;
      if(memoryMatches===8) document.getElementById("memory-result").innerText="🎉 You Win!";
    } else {
      memoryLock=true;
      setTimeout(()=>{
        memoryFirst.innerText="?";
        memorySecond.innerText="?";
        memoryFirst=null;
        memorySecond=null;
        memoryLock=false;
      },500);
    }
  }
}

function restartMemory(){ 
  document.getElementById("memory-result").innerText="";
  setupMemory();
}
setupMemory();

// -------- Clicker Game --------
let clickerScore = 0;
const clickerBtn = document.getElementById("clicker-btn");
clickerBtn.onclick = ()=>{
  clickerScore++;
  document.getElementById("clicker-score").innerText = clickerScore;
}
function restartClicker(){
  clickerScore=0;
  document.getElementById("clicker-score").innerText = clickerScore;
}

