const tagcanvas = document.getElementById('game-canvas');
const ctx = tagcanvas.getContext('2d');
const scoreDisplay = document.getElementById('score-display');
let tagPaused = false;

const GRAVITY = 0.45;
const FRICTION = 0.82;
const MOVE_SPEED = 0.8;
const JUMP_FORCE = -10;
const MAX_SPEED = 5.5;

let gameState = 'MENU'; 
let gameTime = 60;
let lastTime = 0;
let playerCount = 2;
let winnerText = "";

let starHolder = 0; 
let lastTagTime = 0;
const TAG_COOLDOWN = 1000; 

const keys = {};

const platforms = [
    { x: 0, y: 430, w: 800, h: 20 },
    { x: 50, y: 340, w: 120, h: 10 },
    { x: 630, y: 340, w: 120, h: 10 },
    { x: 250, y: 270, w: 300, h: 10 },
    { x: 80, y: 190, w: 150, h: 10 },
    { x: 570, y: 190, w: 150, h: 10 },
    { x: 300, y: 110, w: 200, h: 10 },
    { x: 20, y: 80, w: 80, h: 10 }
];

let players = [];

const controls = [
    { up: 'w', left: 'a', right: 'd' },             
    { up: 'arrowup', left: 'arrowleft', right: 'arrowright' }, 
    { up: 'i', left: 'j', right: 'l' }              
];

const colors = ['#FF4444', '#4444FF', '#44FF44']; 

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.code) > -1) e.preventDefault();
});
window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

const btn1 = document.getElementById('btn-1p');
const btn2 = document.getElementById('btn-2p');
const hint = document.getElementById('controls-hint');
const gameContainer = document.getElementById('game-container');

btn1.textContent = "2 Players";
btn2.textContent = "3 Players";

let fsBtn = document.getElementById('fs-btn');
if (!fsBtn) {
    fsBtn = document.createElement('button');
    fsBtn.id = 'fs-btn';
    fsBtn.textContent = '⛶ Fullscreen';
    fsBtn.className = 'mc-button';
    fsBtn.style.marginLeft = '15px';
    document.getElementById('game-controls-tag').appendChild(fsBtn);
    fsBtn.addEventListener('click', toggleFullScreen);
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        gameContainer.requestFullscreen().catch(err => console.log(err.message));
    } else {
        document.exitFullscreen();
    }
}


class Player {
    constructor(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = 18;
        this.h = 24;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.isGrounded = false;
        this.control = controls[id];
        this.facing = 1;
    }

    update() {
        if (keys[this.control.left]) {
            this.vx -= MOVE_SPEED;
            this.facing = -1;
        }
        if (keys[this.control.right]) {
            this.vx += MOVE_SPEED;
            this.facing = 1;
        }

        this.vx *= FRICTION;
        this.vx = Math.max(Math.min(this.vx, MAX_SPEED), -MAX_SPEED);

        if (keys[this.control.up] && this.isGrounded) {
            this.vy = JUMP_FORCE;
            this.isGrounded = false;
        }

        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.w < 0) this.x = tagcanvas.width;
        if (this.x > tagcanvas.width) this.x = -this.w;
        
        this.isGrounded = false;
        for (let p of platforms) {
            if (this.vy >= 0 &&
                this.y + this.h <= p.y + p.h + this.vy && 
                this.y + this.h >= p.y &&                 
                this.x + this.w > p.x &&                  
                this.x < p.x + p.w) {
                
                this.y = p.y - this.h;
                this.vy = 0;
                this.isGrounded = true;
            }
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        const eyeY = this.y + 6;
        const eyeSpacing = 4;
        const lookOffset = this.facing * 2;
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x + 5 + lookOffset, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 5 + eyeSpacing + 4 + lookOffset, eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x + 5 + lookOffset + (this.facing), eyeY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 5 + eyeSpacing + 4 + lookOffset + (this.facing), eyeY, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`P${this.id + 1}`, this.x + this.w/2, this.y - 5);
    }
}


function startGame(count) {
    playerCount = count;
    players = [];
    const spawns = [{ x: 50, y: 400 }, { x: 730, y: 400 }, { x: 400, y: 100 }];

    for(let i=0; i<count; i++) {
        players.push(new Player(i, spawns[i].x, spawns[i].y, colors[i]));
    }

    gameState = 'PLAYING';
    gameTime = 60;
    lastTime = performance.now();
    lastTagTime = 0;
    starHolder = Math.floor(Math.random() * count);
    
    hint.style.display = 'block';
    hint.innerHTML = `<span style="color:${colors[0]}">P1: WASD</span> | <span style="color:${colors[1]}">P2: Arrows</span>${count > 2 ? ` | <span style="color:${colors[2]}">P3: IJL</span>` : ''}`;
}

function checkTagCollisions() {
    const now = performance.now();
    if (now - lastTagTime < TAG_COOLDOWN) return;

    const holder = players[starHolder];
    for (let i = 0; i < players.length; i++) {
        if (i === starHolder) continue;
        const other = players[i];

        if (holder.x < other.x + other.w && holder.x + holder.w > other.x &&
            holder.y < other.y + other.h && holder.y + holder.h > other.y) {
            starHolder = i;
            lastTagTime = now;
            break; 
        }
    }
}

function drawStar(player) {
    const x = player.x + player.w / 2;
    const y = player.y - 18;
    const time = Date.now() / 200;
    
    ctx.save();
    ctx.translate(x, y + Math.sin(time) * 3); 
    ctx.rotate(time); 
    
    ctx.beginPath();
    ctx.fillStyle = '#FFD700';
    for (let i = 0; i < 5; i++) {
        ctx.lineTo(Math.cos((18 + i * 72) * 0.01745) * 8, -Math.sin((18 + i * 72) * 0.01745) * 8);
        ctx.lineTo(Math.cos((54 + i * 72) * 0.01745) * 3, -Math.sin((54 + i * 72) * 0.01745) * 3);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function update(dt) {
    if (gameState !== 'PLAYING') return;
    if (tagPaused) return;
    gameTime -= dt;
    if (gameTime <= 0) {
        gameTime = 0;
        gameState = 'GAMEOVER';
        winnerText = `P${starHolder + 1} IS IT! (LOSER)`;
    }
    scoreDisplay.textContent = `TIME: ${Math.ceil(gameTime)}`;
    players.forEach(p => p.update());
    checkTagCollisions();
}

function draw() {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, tagcanvas.width, tagcanvas.height);

    ctx.fillStyle = '#444';
    platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = '#5fa83a';
        ctx.fillRect(p.x, p.y, p.w, 3);
        ctx.fillStyle = '#444';
    });

    if (gameState === 'MENU') {
        ctx.fillStyle = 'white';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("MINI TAG PLATFORMER", tagcanvas.width/2, 200);
        return;
    }

    players.forEach(p => p.draw());
    if (players[starHolder]) drawStar(players[starHolder]);

    if (performance.now() - lastTagTime < TAG_COOLDOWN) {
        const holder = players[starHolder];
        ctx.strokeStyle = 'white';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(holder.x + holder.w/2, holder.y + holder.h/2, 20, 0, Math.PI*2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    if (gameState === 'GAMEOVER') {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, tagcanvas.width, tagcanvas.height);
        ctx.fillStyle = '#FF4444';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(winnerText, tagcanvas.width/2, tagcanvas.height/2);
    }
}

function stopTagGame() {
    tagPaused = true;
}

function resetTagGame() {
    tagPaused = false;
    players = [];
    lastTagTime = 0;
    starHolder = 0;

    startGame(playerCount || 2);
}


function loop() {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
}


loop();
btn1.addEventListener('click', () => startGame(2));
btn2.addEventListener('click', () => startGame(3));

btn1.addEventListener('click', () => {
    btn1.classList.add('active');
    btn2.classList.remove('active');
    startGame(2);
});

btn2.addEventListener('click', () => {
    btn2.classList.add('active');
    btn1.classList.remove('active');
    startGame(3);
});
