const airCanvas = document.getElementById('air-hockey-canvas');
const airCtx = airCanvas.getContext('2d');
const airScoreDisplay = document.getElementById('air-score');
let airLoopId = null;
let airCountdown = 0;
let airCountdownActive = false;
const FIXED_DT = 1 / 60;
let lastFrameTime = performance.now();
let accumulator = 0;
let airGameState = 'PLAYING';
let airWinnerText = "";
let reactionTime = 5;
let airCountdownInterval = null;
const airGame = {
    width: 800,
    height: 450,
    running: false,
    score: { player: 0, ai: 0 },
    maxScore: 7
};

const airGoals = {
    player: { x: 0, y: airGame.height / 2, width: 20, height: 150 }, 
    ai: { x: airGame.width, y: airGame.height / 2, width: 20, height: 150 }
};

const airPuck = {
    x: airGame.width / 2,
    y: airGame.height / 2,
    vx: 0,
    vy: 0,
    radius: 15,
    mass: 1,
    friction: 0.99,
    restitution: 0.9,
    maxSpeed: 20
};

const airPlayer = {
    x: 100,
    y: airGame.height / 2,
    vx: 0,
    vy: 0,
    radius: 25,
    mass: 5,
    maxSpeed: 6,
    prevX: 100,
    prevY: airGame.height / 2
};

const airAI = {
    x: airGame.width - 100,
    y: airGame.height / 2,
    vx: 0,
    vy: 0,
    radius: 25,
    mass: 5,
    maxSpeed: 5.9,
    difficulty: 0.06
};

const airMouse = {
    x: airPlayer.x,
    y: airPlayer.y,
    prevX: airPlayer.x,
    prevY: airPlayer.y
};

function initAirHockey() {
    stopAirHockey();

    airCanvas.width = airGame.width;
    airCanvas.height = airGame.height;

    airCanvas.addEventListener('mousemove', handleAirMouseMove);
    airCanvas.addEventListener('click', handleAirCanvasClick);

    airGame.score.player = 0;
    airGame.score.ai = 0;
    updateAirScore();

    airPlayer.x = 100;
    airPlayer.y = airGame.height / 2;
    airAI.x = airGame.width - 100;
    airAI.y = airGame.height / 2;

    resetAirPuck();

    startAirCountdown();
}

function startAirCountdown() {
    if (airCountdownInterval) {
        clearInterval(airCountdownInterval);
    }

    airCountdown = 3;
    
    airCountdownActive = true;
    airGame.running = false;
    
    if (!airLoopId) {
        airGameLoop();
    }

    airCountdownInterval = setInterval(() => {
        airCountdown--;

        if (airCountdown <= 0) {
            clearInterval(airCountdownInterval);
            airCountdownActive = false;
            airGame.running = true;
        }
    }, 1000);
}

function stopAirHockey() {
    airGame.running = false;

    if (airLoopId !== null) {
        cancelAnimationFrame(airLoopId);
        airLoopId = null;
    }

    // 4. ALSO clear the interval when the game stops completely
    if (airCountdownInterval) {
        clearInterval(airCountdownInterval);
        airCountdownInterval = null; // Clear the variable
    }

    airCanvas.removeEventListener('mousemove', handleAirMouseMove);
    airCanvas.removeEventListener('click', handleAirCanvasClick);
}

document.getElementById("btn-d1").addEventListener("click", () => {
    setButtonActive("btn-d1");
    airAI.difficulty = 0.06;
    airAI.maxSpeed = 5.9;
    airAI.radius = 25;
    reactionTime = 5;
});

document.getElementById("btn-d2").addEventListener("click", () => {
    setButtonActive("btn-d2");
    airAI.difficulty = 0.08;
    airAI.radius = 25;
    airAI.maxSpeed = 9.5;
    reactionTime = 3;
});

document.getElementById("btn-d3").addEventListener("click", () => {
    setButtonActive("btn-d3");
    airAI.difficulty = 0.14;
    airAI.maxSpeed = 15.2;
    airAI.radius = 25;
    reactionTime = 0.5;
});

document.getElementById("btn-d4").addEventListener("click", () => {
    setButtonActive("btn-d4");
    airAI.difficulty = 0.2;
    airAI.maxSpeed = 18;
    airAI.radius = 30;
    reactionTime = 0.1;
});

function setButtonActive(id){
    let li = ["btn-d1", "btn-d2", "btn-d3", "btn-d4"];
    initAirHockey();
    updateAirScore();
    document.getElementById(id).classList.add("active");
    for (let i =0; i < li.length; i++){
        if (li[i] != String(id)){
            try{
                document.getElementById(li[i]).classList.remove("active");
            }
            catch{
                continue;
            }
        }
    }
}


function handleAirMouseMove(e) {
    const rect = airCanvas.getBoundingClientRect();
    const scaleX = airCanvas.width / rect.width;
    const scaleY = airCanvas.height / rect.height;
    
    airMouse.prevX = airMouse.x;
    airMouse.prevY = airMouse.y;
    airMouse.x = (e.clientX - rect.left) * scaleX;
    airMouse.y = (e.clientY - rect.top) * scaleY;
}

function resetAirPuck() {
    lastFrameTime = performance.now();
    accumulator = 0;

    airPuck.x = airGame.width / 2;
    airPuck.y = airGame.height / 2;

    airPuck.vx = 0;
    airPuck.vy = 0;

    airPlayer.vx = airPlayer.vy = 0;
    airAI.vx = airAI.vy = 0;

    airPuck.vx = (Math.random() > 0.5 ? 1 : -1) * 5;
}


function updateAirPlayer() {
    const dx = airMouse.x - airMouse.prevX;
    const dy = airMouse.y - airMouse.prevY;
    
    airPlayer.vx = dx;
    airPlayer.vy = dy;

    const minX = airPlayer.radius;
    const maxX = (airGame.width / 2) - airPlayer.radius;
    const minY = airPlayer.radius;
    const maxY = airGame.height - airPlayer.radius;

    let targetX = airMouse.x;
    let targetY = airMouse.y;

    if (targetX < minX) targetX = minX;
    if (targetX > maxX) targetX = maxX;
    if (targetY < minY) targetY = minY;
    if (targetY > maxY) targetY = maxY;
    
    airPlayer.x = targetX;
    airPlayer.y = targetY;
}

function updateAirAI() {
    let targetX = airGame.width - 60;
    let targetY = airGame.height / 2;
    let speedFactor = airAI.difficulty;

    const aiMinX = (airGame.width / 2) + airAI.radius;
    const aiMaxX = airGame.width - airAI.radius;
    const aiMinY = airAI.radius;
    const aiMaxY = airGame.height - airAI.radius;

    const isTopCorner = airPuck.y < 80 && airPuck.x > airGame.width - 100;
    const isBottomCorner = airPuck.y > airGame.height - 80 && airPuck.x > airGame.width - 100;

    if (isTopCorner) {
        targetX = airPuck.x + 10;
        targetY = airPuck.y + 35;
        speedFactor = 0.2;
    } else if (isBottomCorner) {
        targetX = airPuck.x + 10;
        targetY = airPuck.y - 35;
        speedFactor = 0.2;
    } else if (airPuck.x > airGame.width / 2) {
        targetY = airPuck.y;
        targetX = airPuck.x;

        if (airPuck.x > airAI.x) {
            targetX = airPuck.x + 20;
        } else {
            targetX = airPuck.x - 20;
        }
    } else if (airPuck.vx > 0) {
        targetY = airPuck.y;
    }

    const margin = 6;
    if (targetX < aiMinX + margin) targetX = aiMinX + margin;
    if (targetX > aiMaxX - margin) targetX = aiMaxX - margin;
    if (targetY < aiMinY) targetY = aiMinY;
    if (targetY > aiMaxY) targetY = aiMaxY;

    let dx = targetX - airAI.x;
    let dy = targetY - airAI.y;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if (dist > reactionTime) {
        if (airPuck.x > airGame.width / 2 && !isTopCorner && !isBottomCorner) {
            airAI.vx = (dx / dist) * airAI.maxSpeed;
            airAI.vy = (dy / dist) * airAI.maxSpeed;
        } else {
            airAI.vx = dx * speedFactor;
            airAI.vy = dy * speedFactor;
        }
    } else {
        airAI.vx = 0;
        airAI.vy = 0;
    }

    const speed = Math.sqrt(airAI.vx * airAI.vx + airAI.vy * airAI.vy);
    if (speed > airAI.maxSpeed) {
        const ratio = airAI.maxSpeed / speed;
        airAI.vx *= ratio;
        airAI.vy *= ratio;
    }

    const puckNearRightWall = airPuck.x + airPuck.radius >= airGame.width - 1;
    const aiPuckDist = Math.hypot(airAI.x - airPuck.x, airAI.y - airPuck.y);
    const lockedDistance = airAI.radius + airPuck.radius + 4;

    if (puckNearRightWall && aiPuckDist < lockedDistance) {
        const puckSpeed = Math.hypot(airPuck.vx, airPuck.vy);

        if (puckSpeed < 0.6) {
            airAI.vx = -airAI.maxSpeed * 0.55;
            const vySign = (airPuck.y > airAI.y) ? 0.45 : -0.45;
            airAI.vy = vySign * airAI.maxSpeed;

            airPuck.vx = -3.0;
            airPuck.vy += (Math.random() - 0.5) * 1.6;
        } else {
            airAI.vx = Math.min(airAI.vx, 0);
        }
    }

    airAI.x += airAI.vx;
    airAI.y += airAI.vy;

    if (airAI.x < aiMinX) { airAI.x = aiMinX; airAI.vx = 0; }
    if (airAI.x > aiMaxX) { airAI.x = aiMaxX; airAI.vx = 0; }
    if (airAI.y < aiMinY) { airAI.y = aiMinY; airAI.vy = 0; }
    if (airAI.y > aiMaxY) { airAI.y = aiMaxY; airAI.vy = 0; }
}


function updateAirPuck() {
    airPuck.x += airPuck.vx;
    airPuck.y += airPuck.vy;
    
    airPuck.vx *= airPuck.friction;
    airPuck.vy *= airPuck.friction;
    
    const speed = Math.sqrt(airPuck.vx * airPuck.vx + airPuck.vy * airPuck.vy);
    if (speed > airPuck.maxSpeed) {
        const ratio = airPuck.maxSpeed / speed;
        airPuck.vx *= ratio;
        airPuck.vy *= ratio;
    }

    if (airPuck.y - airPuck.radius < 0) {
        airPuck.y = airPuck.radius;
        airPuck.vy = -airPuck.vy * airPuck.restitution;
    }
    if (airPuck.y + airPuck.radius > airGame.height) {
        airPuck.y = airGame.height - airPuck.radius;
        airPuck.vy = -airPuck.vy * airPuck.restitution;
    }

    if (airPuck.x - airPuck.radius < 0) {
        const goalTop = airGoals.player.y - airGoals.player.height / 2;
        const goalBottom = airGoals.player.y + airGoals.player.height / 2;
        
        if (airPuck.y > goalTop && airPuck.y < goalBottom) {
            airGame.score.ai++;
            updateAirScore();
            resetAirPuck();
            if (airGame.score.ai >= airGame.maxScore) endAirGame('AI');
        } else {
            airPuck.x = airPuck.radius;
            airPuck.vx = -airPuck.vx * airPuck.restitution;
        }
    }

    if (airPuck.x + airPuck.radius > airGame.width) {
        const goalTop = airGoals.ai.y - airGoals.ai.height / 2;
        const goalBottom = airGoals.ai.y + airGoals.ai.height / 2;

        if (airPuck.y > goalTop && airPuck.y < goalBottom) {
            airGame.score.player++;
            updateAirScore();
            resetAirPuck();
            if (airGame.score.player >= airGame.maxScore) endAirGame('Player');
        } else {
            airPuck.x = airGame.width - airPuck.radius;
            airPuck.vx = -airPuck.vx * airPuck.restitution;
        }
    }

    if (airPuck.x < airPuck.radius) airPuck.x = airPuck.radius;
    if (airPuck.x > airGame.width - airPuck.radius) airPuck.x = airGame.width - airPuck.radius;
    if (airPuck.y < airPuck.radius) airPuck.y = airPuck.radius;
    if (airPuck.y > airGame.height - airPuck.radius) airPuck.y = airGame.height - airPuck.radius;

    const puckSpeed = Math.hypot(airPuck.vx, airPuck.vy);
    const nearRightWall = airPuck.x + airPuck.radius >= airGame.width - 1;
    const nearLeftWall = airPuck.x - airPuck.radius <= 1;

    if (puckSpeed < 0.4 && (nearRightWall || nearLeftWall)) {
        airPuck.vx = (nearRightWall ? -2.2 : 2.2);
        airPuck.vy += (Math.random() - 0.5) * 1.8;
    }
}

function handleAirStrikerPuckCollision(striker) {
    const dx = airPuck.x - striker.x;
    const dy = airPuck.y - striker.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = airPuck.radius + striker.radius;

    if (distance < minDist) {
        const angle = Math.atan2(dy, dx);
        const overlap = minDist - distance;
        
        airPuck.x += Math.cos(angle) * overlap;
        airPuck.y += Math.sin(angle) * overlap;

        const nx = Math.cos(angle);
        const ny = Math.sin(angle);

        const dvx = airPuck.vx - striker.vx;
        const dvy = airPuck.vy - striker.vy;
        const velAlongNormal = dvx * nx + dvy * ny;

        if (velAlongNormal > 0) return;

        const e = 0.95; 
        let j = -(1 + e) * velAlongNormal;
        j /= (1 / airPuck.mass + 1 / striker.mass);

        const impulseX = j * nx;
        const impulseY = j * ny;

        airPuck.vx += (impulseX / airPuck.mass);
        airPuck.vy += (impulseY / airPuck.mass);

        airPuck.vx += striker.vx * 0.35;
        airPuck.vy += striker.vy * 0.35;
    }
}

function updateAirScore() {
    airScoreDisplay.textContent = `${airGame.score.player} : ${airGame.score.ai}`;
}

function endAirGame(winner) {
    airGame.running = false;
    airGameState = 'GAMEOVER';
    airWinnerText = `${winner} Wins!`;
}
function handleAirCanvasClick(e) {
    if (airGameState === 'GAMEOVER') {
        airGame.score.player = 0;
        airGame.score.ai = 0;
        updateAirScore();
        resetAirPuck();
        airGameState = 'PLAYING';
        startAirCountdown();
    }
}

function drawAirRink() {
    airCtx.fillStyle = '#02020a';
    airCtx.fillRect(0, 0, airGame.width, airGame.height);
    
    airCtx.strokeStyle = '#0ff';
    airCtx.lineWidth = 2;
    airCtx.setLineDash([10, 10]);
    airCtx.beginPath();
    airCtx.moveTo(airGame.width / 2, 0);
    airCtx.lineTo(airGame.width / 2, airGame.height);
    airCtx.stroke();
    airCtx.setLineDash([]);
    
    airCtx.beginPath();
    airCtx.arc(airGame.width / 2, airGame.height / 2, 60, 0, Math.PI * 2);
    airCtx.stroke();
    
    airCtx.fillStyle = '#e1ff74';
    airCtx.fillRect(0, (airGame.height / 2) - (airGoals.player.height / 2), 10, airGoals.player.height);
    airCtx.fillRect(airGame.width - 10, (airGame.height / 2) - (airGoals.ai.height / 2), 10, airGoals.ai.height);
}

function drawAirPuck() {
    airCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    airCtx.beginPath();
    airCtx.arc(airPuck.x + 3, airPuck.y + 3, airPuck.radius, 0, Math.PI * 2);
    airCtx.fill();
    
    const gradient = airCtx.createRadialGradient(airPuck.x - 5, airPuck.y - 5, 0, airPuck.x, airPuck.y, airPuck.radius);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.5, '#ddd');
    gradient.addColorStop(1, '#888');
    
    airCtx.fillStyle = gradient;
    airCtx.beginPath();
    airCtx.arc(airPuck.x, airPuck.y, airPuck.radius, 0, Math.PI * 2);
    airCtx.fill();
    
    airCtx.strokeStyle = '#444';
    airCtx.lineWidth = 2;
    airCtx.stroke();
}

function drawAirStriker(striker, color) {
    airCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    airCtx.beginPath();
    airCtx.arc(striker.x + 4, striker.y + 4, striker.radius, 0, Math.PI * 2);
    airCtx.fill();
    
    const gradient = airCtx.createRadialGradient(
        striker.x - 8, striker.y - 8, 0,
        striker.x, striker.y, striker.radius
    );
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color.replace('0.8)', '0.4)'));
    
    airCtx.fillStyle = gradient;
    airCtx.beginPath();
    airCtx.arc(striker.x, striker.y, striker.radius, 0, Math.PI * 2);
    airCtx.fill();
    
    airCtx.strokeStyle = color.replace('0.8)', '1)');
    airCtx.lineWidth = 3;
    airCtx.stroke();
    
    airCtx.fillStyle = '#222';
    airCtx.beginPath();
    airCtx.arc(striker.x, striker.y, 10, 0, Math.PI * 2);
    airCtx.fill();
}

function renderAir() {
    airCtx.clearRect(0, 0, airGame.width, airGame.height);
    drawAirRink();
    drawAirPuck();
    drawAirStriker(airAI, 'rgba(255, 0, 128, 0.8)');
    drawAirStriker(airPlayer, 'rgba(0, 255, 255, 0.8)');
}

function airGameLoop(now = performance.now()) {
    const delta = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    accumulator += delta;

    while (accumulator >= FIXED_DT) {
        if (airGame.running) {
            updateAirPlayer();
            updateAirAI();
            updateAirPuck();
            handleAirStrikerPuckCollision(airPlayer);
            handleAirStrikerPuckCollision(airAI);
        }
        accumulator -= FIXED_DT;
    }

    drawAirRink();
    drawAirPuck();
    drawAirStriker(airPlayer, '#00ffff');
    drawAirStriker(airAI, '#ff4444');

    if (airCountdownActive) drawAirCountdown();
    if (airGameState === 'GAMEOVER') drawAirGameOver();

    airLoopId = requestAnimationFrame(airGameLoop);
}


function drawAirCountdown() {
    if (!airCountdownActive) return;

    airCtx.fillStyle = 'rgba(0,0,0,0.6)';
    airCtx.fillRect(0, 0, airGame.width, airGame.height);

    airCtx.fillStyle = '#0ff';
    airCtx.font = '80px monospace';
    airCtx.textAlign = 'center';
    airCtx.textBaseline = 'middle';

    airCtx.fillText(
        airCountdown === 0 ? 'GO' : airCountdown,
        airGame.width / 2,
        airGame.height / 2
    );
}
function drawAirGameOver() {
    airCtx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    airCtx.fillRect(0, 0, airGame.width, airGame.height);
    
    airCtx.fillStyle = '#0ff';
    airCtx.font = '40px monospace';
    airCtx.textAlign = 'center';
    airCtx.textBaseline = 'middle';
    airCtx.fillText(airWinnerText, airGame.width / 2, airGame.height / 2 - 20);
    
    airCtx.font = '16px monospace';
    airCtx.fillStyle = '#fff';
    airCtx.fillText('Click to play again', airGame.width / 2, airGame.height / 2 + 40);
}


function stopAirHockey() {
    airGame.running = false;
    handleAirCanvasClick();
    if (airLoopId !== null) {
        cancelAnimationFrame(airLoopId);
        airLoopId = null;
    }

    airCanvas.removeEventListener('mousemove', handleAirMouseMove);
    airCanvas.removeEventListener('click', handleAirCanvasClick);
}


if (airCanvas) {
    initAirHockey();
    updateAirScore();
}


window.resetAirHockeyGame = function() {
    cancelAnimationFrame(airHockeyAnimationId);
};