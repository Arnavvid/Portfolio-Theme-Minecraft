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
        this.teleportCooldown = 0;
        this.boostTimer = 0;
    }

    update() {
        if (this.teleportCooldown > 0) this.teleportCooldown--;

        let accel = this.boostTimer > 0 ? MOVE_SPEED * BOOST_MULTIPLIER : MOVE_SPEED;

        if (keys[this.control.left]) {
            this.vx -= accel;
            this.facing = -1;
        }
        if (keys[this.control.right]) {
            this.vx += accel;
            this.facing = 1;
        }

        this.vx *= FRICTION;
        let maxSpeed = this.boostTimer > 0 ? MAX_SPEED * BOOST_MULTIPLIER : MAX_SPEED;
        this.vx = Math.max(Math.min(this.vx, maxSpeed), -maxSpeed);


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
        if (this.boostTimer > 0) {
            this.boostTimer -= 1/60;
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
    
    PortalManager.reset();

    hint.style.display = 'block';
    hint.innerHTML = `<span style="color:${colors[0]}">P1: WASD</span> | <span style="color:${colors[1]}">P2: Arrows</span>${count > 2 ? ` | <span style="color:${colors[2]}">P3: IJL</span>` : ''}`;
    BoostManager.active = false;
    BoostManager.timer = 2;
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
    
    PortalManager.update(dt);
    BoostManager.update(dt);
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

    PortalManager.draw();
    BoostManager.draw();

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
        ctx.fillStyle = colors[starHolder];
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(winnerText, tagcanvas.width/2, tagcanvas.height/2);
    }
}


const PortalManager = {
    locations: [
        { x: 110, y: 320 },
        { x: 690, y: 320 },
        { x: 400, y: 90 }
    ],
    
    activeIndices: [],
    state: 'COOLDOWN',
    
    timer: 0,
    animationScale: 0,
    
    spawnDelay: 10.0,
    lifeTime: 6.0,
    usedLifeTime: 2.0,
    radius: 35,
    
    reset: function() {
        this.state = 'COOLDOWN';
        this.timer = this.spawnDelay;
        this.activeIndices = [];
        this.animationScale = 0;
    },

    update: function(dt) {
        switch(this.state) {
            case 'COOLDOWN':
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.spawnPortals();
                }
                break;
                
            case 'OPENING':
                this.animationScale += dt * 2;
                if (this.animationScale >= 1) {
                    this.animationScale = 1;
                    this.state = 'ACTIVE';
                    this.timer = this.lifeTime;
                }
                break;
                
            case 'ACTIVE':
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.state = 'CLOSING';
                }
                this.checkCollisions();
                break;
                
            case 'WAITING_CLOSE':
                this.timer -= dt;
                if (this.timer <= 0) {
                    this.state = 'CLOSING';
                }
                this.checkCollisions();
                break;
                
            case 'CLOSING':
                this.animationScale -= dt * 2;
                if (this.animationScale <= 0) {
                    this.animationScale = 0;
                    this.activeIndices = [];
                    this.state = 'COOLDOWN';
                    this.timer = this.spawnDelay;
                }
                break;
        }
    },

    spawnPortals: function() {
        let first = Math.floor(Math.random() * 3);
        let second = Math.floor(Math.random() * 3);
        while (second === first) {
            second = Math.floor(Math.random() * 3);
        }
        
        this.activeIndices = [first, second];
        this.state = 'OPENING';
        this.animationScale = 0;
    },

    checkCollisions: function() {
        if (this.activeIndices.length < 2) return;

        const p1 = this.locations[this.activeIndices[0]];
        const p2 = this.locations[this.activeIndices[1]];

        players.forEach(player => {
            if (player.teleportCooldown > 0) return;

            const dist1 = Math.hypot((player.x + player.w/2) - p1.x, (player.y + player.h/2) - p1.y);
            const dist2 = Math.hypot((player.x + player.w/2) - p2.x, (player.y + player.h/2) - p2.y);

            if (dist1 < this.radius) {
                this.teleport(player, p2);
            } else if (dist2 < this.radius) {
                this.teleport(player, p1);
            }
        });
    },

    teleport: function(player, destination) {
        player.x = destination.x - player.w / 2;
        player.y = destination.y - player.h / 2;
        player.vx = 0;
        player.vy = 0;
        
        player.teleportCooldown = 120;

        if (this.state === 'ACTIVE') {
            this.state = 'WAITING_CLOSE';
            this.timer = this.usedLifeTime; 
        }
    },

    draw: function() {
        if (this.activeIndices.length < 2) return;
        
        if (this.animationScale > 0) {
            const loc1 = this.locations[this.activeIndices[0]];
            const loc2 = this.locations[this.activeIndices[1]];
            
            drawPortal(loc1.x, loc1.y, null, 0.3 * this.animationScale);
            
            drawPortal(loc2.x, loc2.y, null, 0.3 * this.animationScale);
        }
    }
};


function drawPortal(x, y, color, size = 1) {
    const t = Date.now() / 600;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);

    const outerG = ctx.createRadialGradient(0, 0, 10, 0, 0, 160);
    outerG.addColorStop(0, 'rgba(90,200,255,0.18)');
    outerG.addColorStop(0.4, 'rgba(40,150,255,0.12)');
    outerG.addColorStop(1, 'rgba(5,12,30,0)');
    ctx.fillStyle = outerG;
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = 'lighter';
    for (let layer = 0; layer < 3; layer++) {
        const baseR = 72 - layer * 10;
        const amp = 8 + layer * 3;
        const points = 90;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const a = (i / points) * Math.PI * 2;
            const r =
                baseR +
                Math.sin(a * (4 + layer) + t * (1.0 + layer * 0.45)) * amp +
                Math.sin(a * (2 + layer * 0.5) - t * (0.8 + layer * 0.2)) * (amp * 0.45);
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();

        const alpha = 0.10 + layer * 0.07;
        ctx.fillStyle = `rgba(60,190,255,${alpha})`;
        ctx.fill();
    }

    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(140,240,255,0.95)';
    ctx.arc(0, 0, 66, 0, Math.PI * 2);
    ctx.stroke();

    const innerG = ctx.createRadialGradient(0, 0, 0, 0, 0, 56);
    innerG.addColorStop(0, 'rgba(8,10,16,0.8)');
    innerG.addColorStop(0.6, 'rgba(6,8,12,0.95)');
    innerG.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = innerG;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.fill();

    for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + t * 0.9;
        const r = 86 + Math.sin(t * 1.8 + i) * 6;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        ctx.beginPath();
        const sizeP = 1.5 + (i % 3) * 0.7;
        ctx.fillStyle = 'rgba(180,240,255,0.9)';
        ctx.arc(px, py, sizeP, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.beginPath();
    const flickR = 44;
    const flickPts = 36;
    ctx.moveTo(flickR, 0);
    for (let i = 1; i <= flickPts; i++) {
        const a = (i / flickPts) * Math.PI * 2;
        const r = flickR + Math.sin(a * 8 + t * 2.2) * 3;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(50,150,230,0.12)';
    ctx.fill();

    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
}
const BOOST_DURATION = 5.0;
const BOOST_RESPAWN = 8.0;
const BOOST_MULTIPLIER = 2;

const BoostManager = {
    x: 0,
    y: 0,
    radius: 10,
    active: false,
    timer: 0,

    spawn() {
        const spot = platforms[Math.floor(Math.random() * platforms.length)];
        this.x = spot.x + Math.random() * spot.w;
        this.y = spot.y - 20;
        this.active = true;
    },

    update(dt) {
        if (!this.active) {
            this.timer -= dt;
            if (this.timer <= 0) {
                this.spawn();
            }
            return;
        }

        for (let p of players) {
            const d = Math.hypot(
                (p.x + p.w/2) - this.x,
                (p.y + p.h/2) - this.y
            );

            if (d < this.radius + 10) {
                p.boostTimer = BOOST_DURATION;
                this.active = false;
                this.timer = BOOST_RESPAWN;
            }
        }
    },

    draw() {
        if (!this.active) return;

        const t = Date.now() / 300;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalCompositeOperation = "lighter";

        // glow
        const g = ctx.createRadialGradient(0,0,2,0,0,30);
        g.addColorStop(0,"rgba(0,255,255,0.9)");
        g.addColorStop(1,"rgba(0,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0,0,30,0,Math.PI*2);
        ctx.fill();

        // core orb
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.arc(0, Math.sin(t)*3, 8, 0, Math.PI*2);
        ctx.fill();

        ctx.restore();
        ctx.globalCompositeOperation = "source-over";
    }
};


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

const gameSelectorButtons = document.querySelectorAll('#game-selector button');

gameSelectorButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        resetTagGameToMenu();
    });
});
function resetTagGameToMenu() {
    gameState = 'MENU';
    players = [];
    winnerText = "";
    tagPaused = false;
    PortalManager.reset();

    scoreDisplay.textContent = "Select Game type";
    hint.style.display = 'none';

    btn1.classList.remove('active');
    btn2.classList.remove('active');
}