// Snake game implementing the spec in .copilot-instructions.md
// Grid: 15 x 17 (cols x rows)

const COLS = 15;
const ROWS = 17;
const board = document.getElementById('board');
const beginBtn = document.getElementById('begin');
const restartBtn = document.getElementById('restart');
const overlay = document.getElementById('overlay');
const messageDiv = document.getElementById('message');
const trophyDiv = document.getElementById('trophy');
const scoreSpan = document.getElementById('score');

let cells = [];
let snake = [];
let dir = {r:0, c:1}; // default right
let nextDir = null;
let apple = null;
let running = false;
let tickInterval = 180; // ms
let timer = null;
let score = 0;

// Build grid
function buildBoard(){
  board.innerHTML = '';
  cells = [];
  for(let r=0;r<ROWS;r++){
    let row = [];
    for(let c=0;c<COLS;c++){
      const div = document.createElement('div');
      div.classList.add('cell');
      if((r + c) % 2 === 0) div.classList.add('light'); else div.classList.add('dark');
      div.dataset.r = r; div.dataset.c = c;
      board.appendChild(div);
      row.push(div);
    }
    cells.push(row);
  }
}

function startGame(){
  score = 0; scoreSpan.textContent = score;
  buildBoard();
  // place snake roughly centered; snake length 2
  const startR = Math.floor(ROWS/2);
  const startC = Math.floor(COLS/2) - 1;
  snake = [{r: startR, c: startC+1}, {r: startR, c: startC}];
  dir = {r:0,c:1}; nextDir = null;
  apple = spawnApple();
  render();
  hideOverlay();
  running = true;
  timer = setInterval(tick, tickInterval);
}

function gameOver(win=false){
  running = false;
  if(timer) { clearInterval(timer); timer = null; }
  if(win){
    trophyDiv.classList.remove('hidden');
    messageDiv.textContent = 'You filled the grid!';
  } else {
    trophyDiv.classList.add('hidden');
    messageDiv.textContent = 'Game Over';
  }
  showOverlay();
}

function restartGame(){
  hideOverlay();
  startGame();
}

function showOverlay(){
  overlay.classList.remove('hidden');
  overlay.classList.add('show');
}
function hideOverlay(){
  overlay.classList.add('hidden');
  overlay.classList.remove('show');
}

function spawnApple(){
  const empty = [];
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(!snake.some(s=>s.r===r && s.c===c)) empty.push({r,c});
  }
  if(empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function tick(){
  if(!running) return;
  if(nextDir){
    // prevent reverse
    if(!(nextDir.r === -dir.r && nextDir.c === -dir.c)) dir = nextDir;
    nextDir = null;
  }
  const head = snake[0];
  const newHead = {r: head.r + dir.r, c: head.c + dir.c};

  // border collision (touching border head-on) -> death
  if(newHead.r < 0 || newHead.r >= ROWS || newHead.c < 0 || newHead.c >= COLS){
    gameOver(false); return;
  }

  // self collision -> death (reasonable extension)
  if(snake.some(s=>s.r===newHead.r && s.c===newHead.c)){
    gameOver(false); return;
  }

  snake.unshift(newHead);

  // apple check
  if(apple && newHead.r === apple.r && newHead.c === apple.c){
    // eat sound for 3 seconds
    playEatSound(3000);
    score += 1; scoreSpan.textContent = score;
    apple = spawnApple();
    // if apple is null => grid full -> win
    if(!apple){
      render();
      gameOver(true);
      return;
    }
  } else {
    // normal move: remove tail
    snake.pop();
  }

  render();
}

function render(){
  // clear
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    const cell = cells[r][c];
    cell.classList.remove('snake');
    cell.classList.remove('apple');
    cell.innerHTML = '';
  }

  // apple
  if(apple){
    const ac = cells[apple.r][apple.c];
    ac.classList.add('apple');
    const dot = document.createElement('div'); dot.classList.add('apple-dot');
    ac.appendChild(dot);
  }

  // snake
  snake.forEach((seg, idx)=>{
    const sc = cells[seg.r][seg.c];
    sc.classList.add('snake');
    if(idx === 0){
      const headDot = document.createElement('div'); headDot.classList.add('head-dot');
      sc.appendChild(headDot);
    }
  });
}

function playEatSound(durationMs){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 440; // A4
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
    o.start();
    setTimeout(()=>{
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      setTimeout(()=>{ try{o.stop(); ctx.close();}catch(e){} }, 50);
    }, durationMs);
  } catch(e){ console.warn('Audio not available', e); }
}

// keyboard controls -> W A S D
window.addEventListener('keydown', (e)=>{
  if(!running) return;
  const k = e.key.toLowerCase();
  if(k === 'w') nextDir = {r:-1, c:0};
  if(k === 's') nextDir = {r:1, c:0};
  if(k === 'a') nextDir = {r:0, c:-1};
  if(k === 'd') nextDir = {r:0, c:1};
});

beginBtn.addEventListener('click', ()=>{
  beginBtn.disabled = true;
  startGame();
});

restartBtn.addEventListener('click', ()=>{
  beginBtn.disabled = false;
  restartGame();
});

// initialize board but don't start
buildBoard();
render();
