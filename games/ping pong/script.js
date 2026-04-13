const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const W = canvas.width, H = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 98;
const BALL_SIZE = 12;
const MAX_SCORE = 10;

let singlePlayer = true;
let paused = false;
let soundOn = true;

const leftPaddle = { x: 16, y: (H - PADDLE_HEIGHT)/2, vy: 0 };
const rightPaddle = { x: W - 16 - PADDLE_WIDTH, y: (H - PADDLE_HEIGHT)/2, vy: 0 };

const ball = {
  x: W/2,
  y: H/2,
  vx: 6*(Math.random()>.5?1:-1),
  vy: 3*(Math.random()>.5?1:-1),
  size: BALL_SIZE
};

let leftScore = 0, rightScore = 0;

const keys = {};

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (e.key === 'p') paused = !paused;
});

window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

document.getElementById('toggleMode').onclick = () => {
  singlePlayer = !singlePlayer;
  document.getElementById('toggleMode').textContent =
    'Mode: ' + (singlePlayer ? 'Single Player' : 'Two Player');
};

document.getElementById('restart').onclick = restart;

document.getElementById('soundToggle').onclick = () => {
  soundOn = !soundOn;
  document.getElementById('soundToggle').textContent =
    'Sound: ' + (soundOn ? 'On' : 'Off');
};

function beep(){
  if(!soundOn) return;
}

function resetBall(direction = 0){
  ball.x = W/2;
  ball.y = H/2;

  const speed = 5;
  ball.vx = (direction === 0 ? (Math.random()>.5?1:-1) : direction) * speed;
  ball.vy = (Math.random()*2 - 1) * speed;
}

function restart(){
  leftScore = 0;
  rightScore = 0;

  document.getElementById('leftScore').textContent = leftScore;
  document.getElementById('rightScore').textContent = rightScore;

  resetBall();
}

function update(){

  if(paused) return;

  if(keys['w']) leftPaddle.vy = -8;
  else if(keys['s']) leftPaddle.vy = 8;
  else leftPaddle.vy = 0;

  if(!singlePlayer){
    if(keys['arrowup']) rightPaddle.vy = -8;
    else if(keys['arrowdown']) rightPaddle.vy = 8;
    else rightPaddle.vy = 0;
  }

  leftPaddle.y += leftPaddle.vy;
  rightPaddle.y += rightPaddle.vy;

  if(singlePlayer){
    const target = ball.y - PADDLE_HEIGHT/2;
    rightPaddle.y += (target - rightPaddle.y) * 0.1;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  if(ball.y <= 0 || ball.y >= H - BALL_SIZE){
    ball.vy *= -1;
  }

  if(ball.x < 0){
    rightScore++;
    document.getElementById('rightScore').textContent = rightScore;
    resetBall(1);
  }

  if(ball.x > W){
    leftScore++;
    document.getElementById('leftScore').textContent = leftScore;
    resetBall(-1);
  }
}

function draw(){

  ctx.clearRect(0,0,W,H);

  ctx.fillStyle = "#fff";
  ctx.fillRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

  ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

resetBall();
loop();