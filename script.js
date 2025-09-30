// -------- Loading Screen --------
window.addEventListener("load", ()=>{
  setTimeout(()=>{
    document.getElementById("loading-screen").style.display="none";
    showGame('tic-tac-toe');
  }, 2000);
});

// -------- Menu Function --------
function showGame(id){
  document.querySelectorAll('.game').forEach(g=>g.style.display='none');
  document.getElementById(id).style.display='block';
}

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
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for(let combo of wins){
    let [a,b,c] = combo;
    if(tttBoard[a] && tttBoard[a]===tttBoard[b] && tttBoard[a]===tttBoard[c]){
      document.getElementById("ttt-status").innerText = tttBoard[a]+" Wins!";
      return;
    }
  }
  if(!tttBoard.includes(null)) document.getElementById("ttt-status").innerText = "Draw!";
}

function tttRestart(){ tttBoard = Array(9).fill(null); tttCurrent="X"; document.getElementById("ttt-status").innerText=""; tttRender();}
tttRender();

// -------- Rock-Paper-Scissors --------
function rpsPlay(player){
  const choices=['rock','paper','scissors'];
  const computer=choices[Math.floor(Math.random()*3)];
  let result="";
  if(player===computer) result="Draw!";
  else if((player==='rock'&&computer==='scissors')||(player==='paper'&&computer==='rock')||(player==='scissors'&&computer==='paper')) result="You Win!";
  else result="Computer Wins!";
  document.getElementById("rps-result").innerText=`You: ${player} | Computer: ${computer} → ${result}`;
}

// -------- Number Guessing --------
let numberToGuess = Math.floor(Math.random()*10)+1;
function checkGuess(){
  const guess = parseInt(document.getElementById("guess-input").value);
  let msg="";
  if(guess===numberToGuess) msg="🎉 Correct!";
  else if(guess<numberToGuess) msg="Too low!";
  else msg="Too high!";
  document.getElementById("guess-result").innerText=msg;
}

// -------- Car/Bike Game --------
const raceCanvas = document.getElementById("raceCanvas");
const raceCtx = raceCanvas.getContext("2d");
let playerCar={x:180,y:500,width:40,height:60,speed:10};
let obstacles=[],raceScore=0,raceOver=false;

document.addEventListener("keydown",e=>{
  if(showingGame('car-bike') && !raceOver){
    if(e.key==="ArrowLeft") playerCar.x -= playerCar.speed;
    if(e.key==="ArrowRight") playerCar.x += playerCar.speed;
    if(e.key==="ArrowUp") playerCar.y -= playerCar.speed;
    if(e.key==="ArrowDown") playerCar.y += playerCar.speed;
    if(playerCar.x<0) playerCar.x=0;
    if(playerCar.x>raceCanvas.width-playerCar.width) playerCar.x=raceCanvas.width-playerCar.width;
    if(playerCar.y<0) playerCar.y=0;
    if(playerCar.y>raceCanvas.height-playerCar.height) playerCar.y=raceCanvas.height-playerCar.height;
  }
});

function addObstacle(){
  if(raceOver) return;
  let width=Math.random()*80+20;
  let x=Math.random()*(raceCanvas.width-width);
  obstacles.push({x:x,y:-60,width:width,height:20});
}
setInterval(addObstacle,1500);

function updateRace(){
  if(!showingGame('car-bike')||raceOver) return;
  raceCtx.clearRect(0,0,raceCanvas.width,raceCanvas.height);
  raceCtx.fillStyle="red";
  raceCtx.fillRect(playerCar.x,playerCar.y,playerCar.width,playerCar.height);
  raceCtx.fillStyle="black";
  for(let obs of obstacles){
    obs.y +=3;
    raceCtx.fillRect(obs.x,obs.y,obs.width,obs.height);
    if(playerCar.x<obs.x+obs.width && playerCar.x+playerCar.width>obs.x && playerCar.y<obs.y+obs.height && playerCar.y+playerCar.height>obs.y){
      raceOver=true;
      document.getElementById("race-score").innerText="Game Over! Score: "+raceScore;
    }
  }
  obstacles=obstacles.filter(o=>o.y<raceCanvas.height);
  raceScore++;
  document.getElementById("race-score").innerText="Score: "+raceScore;
  requestAnimationFrame(updateRace);
}
setInterval(()=>{ if(showingGame('car-bike')) updateRace(); },30);
function restartRace(){playerCar={x:180,y:500,width:40,height:60,speed:10};obstacles=[];raceScore=0;raceOver=false;updateRace();}

// -------- Snake Game --------
const snakeCanvas=document.getElementById("snakeCanvas");
const snakeCtx=snakeCanvas.getContext("2d");
let snakeSize=20,snake=[{x:200,y:200}],snakeDir='RIGHT',snakeFood={x:Math.floor(Math.random()*20)*snakeSize,y:Math.floor(Math.random()*20)*snakeSize},snakeScore=0,snakeGameOver=false;
document.addEventListener("keydown",e=>{
  if(!showingGame('snake')) return;
  if(e.key==="ArrowUp" && snakeDir!=="DOWN") snakeDir="UP";
  if(e.key==="ArrowDown" && snakeDir!=="UP") snakeDir="DOWN";
  if(e.key==="ArrowLeft" && snakeDir!=="RIGHT") snakeDir="LEFT";
 



