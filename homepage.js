window.addEventListener('wheel', e => {
    if (e.ctrlKey) e.preventDefault();
}, { passive: false });

window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
        e.preventDefault();
    }
});

const canvas = document.getElementById('steve-canvas');
const scene = new THREE.Scene();

const aspect = window.innerWidth / (window.innerHeight * 0.15);
const frustumSize = 4;
const camera = new THREE.OrthographicCamera(
    frustumSize * aspect / -2,
    frustumSize * aspect / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight * 0.15);
camera.position.z = 5;

let mouseCloseToZombie = false;

function createSteve() {
    const steve = new THREE.Group();
    
    const skinTone = 0xBD7C3A;
    const shirtBlue = 0x0088cc;
    const pantsBlue = 0x3B5998;
    const shoeGray = 0x59544e;
    const hairBrown = 0x4D3425;
    
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterial = new THREE.MeshLambertMaterial({ color: skinTone });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    steve.add(head);
    
    const hairGeometry = new THREE.BoxGeometry(0.85, 0.3, 0.85);
    const hairMaterial = new THREE.MeshLambertMaterial({ color: hairBrown });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 1.55, 0);
    steve.add(hair);
    
    const hairExtensionSize = 0.1;
    
    const hairLeftFront = new THREE.Mesh(
        new THREE.BoxGeometry(hairExtensionSize, hairExtensionSize, 0.06),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairLeftFront.position.set(-0.35, 1.35, 0.415);
    steve.add(hairLeftFront);
    
    const hairRightFront = new THREE.Mesh(
        new THREE.BoxGeometry(hairExtensionSize, hairExtensionSize, 0.06),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairRightFront.position.set(0.35, 1.35, 0.415);
    steve.add(hairRightFront);
    

    const hairLeftSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.3, 0.8),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairLeftSide.position.set(-0.4, 1.4, 0);
    steve.add(hairLeftSide);

    const hairRightSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.3, 0.8),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairRightSide.position.set(0.4, 1.4, 0);
    steve.add(hairRightSide);
    
    const hairLeftSideFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.1, 0.2),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairLeftSideFront.position.set(-0.4, 1.2, 0.3);
    steve.add(hairLeftSideFront);


    const hairRightSideFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.1, 0.2),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairRightSideFront.position.set(0.4, 1.2, 0.3);
    steve.add(hairRightSideFront);


    const hairLeftSideBackUp = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.2, 0.35),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairLeftSideBackUp.position.set(-0.4, 1.2, -0.2);
    steve.add(hairLeftSideBackUp);


    const hairRightSideBackUp = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.2, 0.35),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairRightSideBackUp.position.set(0.4, 1.2, -0.2);
    steve.add(hairRightSideBackUp);


    const hairLeftSideBackDown = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.2, 0.25),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairLeftSideBackDown.position.set(-0.4, 1.1, -0.25);
    steve.add(hairLeftSideBackDown);


    const hairRightSideBackDown = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.2, 0.25),
        new THREE.MeshLambertMaterial({ color: hairBrown })
    );
    hairRightSideBackDown.position.set(0.4, 1.1, -0.25);
    steve.add(hairRightSideBackDown);


    const leftEyeWhite = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.1, 0.05),
        new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
    );
    leftEyeWhite.position.set(-0.2, 1.2, 0.41);
    steve.add(leftEyeWhite);
    
    const leftEyeCenter = new THREE.Mesh(
        new THREE.BoxGeometry(0.125, 0.1, 0.06),
        new THREE.MeshLambertMaterial({ color: 0x8B00FF })
    );
    leftEyeCenter.position.set(-0.1375, 1.2, 0.415);
    steve.add(leftEyeCenter);
    
    const rightEyeWhite = new THREE.Mesh(
        new THREE.BoxGeometry(0.25, 0.1, 0.05),
        new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
    );
    rightEyeWhite.position.set(0.2, 1.2, 0.41);
    steve.add(rightEyeWhite);
    
    const rightEyeCenter = new THREE.Mesh(
        new THREE.BoxGeometry(0.125, 0.1, 0.06),
        new THREE.MeshLambertMaterial({ color: 0x8B00FF })
    );
    rightEyeCenter.position.set(0.1375, 1.2, 0.415);
    steve.add(rightEyeCenter);
    
    const beardColor = 0x73481d;
    const beardThickness = 0.06;
    
    const mouthBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: 0xa3682e })
    );
    mouthBar.position.set(0, 1.08, 0.415);
    steve.add(mouthBar);
    
    const beardBottom = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: beardColor })
    );
    beardBottom.position.set(0, 0.88, 0.415);
    steve.add(beardBottom);
    
    const beardLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.17, beardThickness),
        new THREE.MeshLambertMaterial({ color: beardColor })
    );
    beardLeft.position.set(-0.135, 0.96, 0.415);
    steve.add(beardLeft);
    
    const beardRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.17, beardThickness),
        new THREE.MeshLambertMaterial({ color: beardColor })
    );
    beardRight.position.set(0.135, 0.96, 0.415);
    steve.add(beardRight);
    
    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: shirtBlue });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    steve.add(body);
    
    const dripGeometry = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    const shirtDrip = new THREE.Mesh(dripGeometry, bodyMaterial);
    shirtDrip.position.set(0.25, -0.05, 0.2);
    steve.add(shirtDrip);
    
    const drip2Geometry = new THREE.BoxGeometry(0.15, 0.1, 0.1);
    const shirtDripTwo = new THREE.Mesh(drip2Geometry, bodyMaterial);
    shirtDripTwo.position.set(0.35, -0.15, 0.2);
    steve.add(shirtDripTwo);

    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.55, 0.85, 0);
    leftArmGroup.userData = { isArm: true, side: 'left' };
    
    const leftSleeve = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshLambertMaterial({ color: shirtBlue })
    );
    leftSleeve.position.set(0, -0.15, 0);
    leftArmGroup.add(leftSleeve);
    
    const leftForearm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.7, 0.3),
        new THREE.MeshLambertMaterial({ color: skinTone })
    );
    leftForearm.position.set(0, -0.65, 0);
    leftArmGroup.add(leftForearm);
    
    steve.add(leftArmGroup);
    
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.55, 0.85, 0);
    rightArmGroup.userData = { isArm: true, side: 'right' };
    
    const rightSleeve = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshLambertMaterial({ color: shirtBlue })
    );
    rightSleeve.position.set(0, -0.15, 0);
    rightArmGroup.add(rightSleeve);
    
    const rightForearm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.7, 0.3),
        new THREE.MeshLambertMaterial({ color: skinTone })
    );
    rightForearm.position.set(0, -0.65, 0);
    rightArmGroup.add(rightForearm);
    
    steve.add(rightArmGroup);
    
    const legGeometry = new THREE.BoxGeometry(0.4, 1.05, 0.35);
    const legMaterial = new THREE.MeshLambertMaterial({ color: pantsBlue });

    const shoeGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.35);
    const shoeMaterial = new THREE.MeshLambertMaterial({ color: shoeGray });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0, 0);
    leftLeg.geometry.translate(0, -0.525, 0);

    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    leftShoe.position.set(0, -0.85, 0);
    leftShoe.geometry.translate(0, -0.1, 0);

    leftLeg.add(leftShoe);
    leftLeg.userData = { isLeg: true, side: 'left' };
    steve.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0, 0);
    rightLeg.geometry = leftLeg.geometry.clone();

    const rightShoeGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.35);
    const rightShoe = new THREE.Mesh(rightShoeGeometry, shoeMaterial);
    rightShoe.position.set(0, -0.85, 0);
    rightShoe.geometry.translate(0, -0.1, 0);

    rightLeg.add(rightShoe);
    rightLeg.userData = { isLeg: true, side: 'right' };
    steve.add(rightLeg);

    
    steve.userData = { 
        head, 
        leftArm: leftArmGroup, 
        rightArm: rightArmGroup, 
        leftLeg, 
        rightLeg
    };
    return steve;
}

const steve = createSteve();
steve.scale.set(0.7, 0.7, 0.7);
steve.position.set(0, 0.25, 0);
scene.add(steve);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let walkCycle = 0;
let isWalking = false;
let targetX = steve.position.x;
let currentSection = 'about';
let scrollTimeout;
let lastScrollY = window.scrollY;
let scrollDirection = 0;
let isTurning = false;
let turnProgress = 0;
let teleportLock = false;
let lastSteveX = steve.position.x;

let isHitting = false;
let hitTimer = 0;
let hitCooldown = 0;

const HIT_DURATION = 20;
const HIT_COOLDOWN = 40;
const HIT_SOUND_CD = 18;

const HIT_Z_SPEED = 900;
const HIT_Y_SPEED = 700;


let nameTagEl = null;
const _nametagTmp = new THREE.Vector3();

function addNameTag(name) {
if (nameTagEl) nameTagEl.remove();
    nameTagEl = document.createElement('div');
    nameTagEl.className = 'steve-nametag';
    nameTagEl.textContent = name;
    document.body.appendChild(nameTagEl);
}

addNameTag('Arnav');

function updateNametagPosition() {
    if (!nameTagEl) return;

    steve.userData.head.getWorldPosition(_nametagTmp);
    
    _nametagTmp.y += 0.45; 
    
    _nametagTmp.project(camera);

    const rect = canvas.getBoundingClientRect();
    const x = ( _nametagTmp.x * .5 + .5 ) * rect.width;
    const y = ( -_nametagTmp.y * .5 + .5 ) * rect.height;

    nameTagEl.style.left = `${x + rect.left}px`;
    nameTagEl.style.top  = `${y + rect.top}px`;
    
    if (x < 0 || x > window.innerWidth) {
        nameTagEl.style.opacity = '0';
    } else {
        nameTagEl.style.opacity = '1';
    }
}


function animate() {
    requestAnimationFrame(animate);
    animateWalk();
    updateNametagPosition();
    renderer.render(scene, camera);
}

const sectionObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSection = entry.target.id;

                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.dataset.section === currentSection
                    );
                });
            }
        });
    },
    { threshold: 0.6 }
);

document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
});

let teleportCount = 0;
const achievementSound = new Audio('sounds/achievement.mp3');
achievementSound.volume = 0.2;
let achievementUnlocked = false;

function onTeleport() {
    teleportCount++;
    if (teleportCount >= 10 && !achievementUnlocked) {
        unlockAchievement();
    }
}

function unlockAchievement() {
    achievementUnlocked = true;
    
    achievementSound.volume = 0.2;
    achievementSound.play();

    const toast = document.getElementById('achievement-toast');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}


function getNavLinkPositions() {
    const links = document.querySelectorAll('.nav-link');
    const positions = [];
    const aspect = window.innerWidth / (window.innerHeight * 0.15);
    const frustumSize = 4;
    
    links.forEach(link => {
        const rect = link.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        
        const normalizedX = (centerX / window.innerWidth) * 2 - 1;
        const threeX = normalizedX * (frustumSize * aspect / 2);
        
        positions.push({
            section: link.dataset.section,
            x: threeX,
            element: link
        });
    });
    
    return positions;
}

let navPositions = getNavLinkPositions();
if (navPositions.length > 0) {
    const firstPos = navPositions[0];
    steve.position.x = firstPos.x -1;
    targetX = firstPos.x;
    steve.rotation.y = 0;
}

function teleportSteveToScreenX(screenX) {
    const aspect = window.innerWidth / (window.innerHeight * 0.15);
    const frustumSize = 4;

    const normalizedX = (screenX / window.innerWidth) * 2 - 1;
    const threeX = normalizedX * (frustumSize * aspect / 2);

    steve.position.x = threeX;
    targetX = threeX;

    isWalking = false;
    isTurning = false;
    walkCycle = 0;

    steve.userData.leftLeg.rotation.x = 0;
    steve.userData.rightLeg.rotation.x = 0;
    steve.userData.leftArm.rotation.x = 0;
    steve.userData.rightArm.rotation.x = 0;
    steve.position.y = 0.25;

    scrollDirection = 0;
    steve.rotation.y = 0;
    steve.rotation.z = 0;
    steve.userData.head.rotation.y = 0;
}

function spawnTeleportBlockParticles() {
    const aspect = window.innerWidth / (window.innerHeight * 0.15);
    const frustumSize = 4;

    const normalizedX = steve.position.x / (frustumSize * aspect / 2);
    const screenX = (normalizedX + 1) * window.innerWidth / 2;
    const screenY = window.innerHeight * 0.075;

    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'teleport-particle';

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 10;

        const dx = Math.cos(angle) * distance + 'px';
        const dy = Math.sin(angle) * distance + 'px';

        p.style.left = screenX + 'px';
        p.style.top = screenY + 'px';
        p.style.setProperty('--dx', dx);
        p.style.setProperty('--dy', dy);

        document.body.appendChild(p);

        setTimeout(() => p.remove(), 600);
    }
}

function generateForegroundGrass() {
    const navbar = document.getElementById('navbar');
    
    const existingLayer = document.querySelector('.foreground-grass-layer');
    if (existingLayer) existingLayer.remove();

    const layer = document.createElement('div');
    layer.className = 'foreground-grass-layer';
    navbar.appendChild(layer);

    const totalItems = 25;
    
    for (let i = 0; i < totalItems; i++) {
        const item = document.createElement('div');
        item.classList.add('flora-sprite');
        
        const rng = Math.random(); 
        
        if (rng > 0.90) { 
            item.classList.add('pixel-tree');
            item.style.zIndex = "5";
        } else if (rng > 0.65) { 
            item.classList.add('tall-grass-blade');
        } else { 
            item.classList.add('grass-blade');
        }

        const randomLeft = Math.random() * 110 - 5; 
        item.style.left = `${randomLeft}%`;

        const isTree = item.classList.contains('pixel-tree');
        const scaleBase = isTree ? 0.9 : 0.8; 
        const scaleVar = isTree ? 0.3 : 0.5;
        
        const randomScale = scaleBase + Math.random() * scaleVar;
        item.style.transform = `scale(${randomScale})`;

        item.style.opacity = 0.85 + Math.random() * 0.15;

        layer.appendChild(item);
    }
}

generateForegroundGrass();

function animateWalk() {
        const moved = Math.abs(steve.position.x - lastSteveX) > 0.0001;
    lastSteveX = steve.position.x;

    if (!moved) {
        isWalking = false;
    }
    if (isWalking) {
        walkCycle += 0.15;
        
        steve.userData.leftLeg.rotation.x = Math.sin(walkCycle) * 0.5;
        steve.userData.rightLeg.rotation.x = Math.sin(walkCycle + Math.PI) * 0.5;
        
        steve.userData.leftArm.rotation.x = Math.sin(walkCycle + Math.PI) * 0.4;
        steve.userData.rightArm.rotation.x = Math.sin(walkCycle) * 0.4;
        
        steve.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.05;
        
        const targetRotation = scrollDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
        steve.rotation.y += (targetRotation - steve.rotation.y) * 0.1;
        
    } else if (isTurning) {
        turnProgress += 0.08;
        
        if (turnProgress >= 1) {
            turnProgress = 1;
            isTurning = false;
            steve.rotation.y = 0;
        }
        
        const startRotation = scrollDirection > 0 ? Math.PI / 2 : -Math.PI / 2;
        steve.rotation.y = startRotation + (0 - startRotation) * turnProgress;
        
        steve.userData.leftLeg.rotation.x *= 0.85;
        steve.userData.rightLeg.rotation.x *= 0.85;
        steve.userData.leftArm.rotation.x *= 0.85;
        steve.userData.rightArm.rotation.x *= 0.85;
        steve.position.y *= 0.85;
        
    } else {
        steve.userData.leftLeg.rotation.x *= 0.9;
        steve.userData.rightLeg.rotation.x *= 0.9;
        steve.userData.leftArm.rotation.x *= 0.9;
        steve.userData.rightArm.rotation.x *= 0.9;
        steve.position.y *= 0.9;
        
        steve.rotation.y *= 0.9;
    }
}

function tiltTowardsTarget(targetX) {
    const currentX = steve.position.x;
    const diff = targetX - currentX;
    
    if (!isWalking && !isTurning) {
        const headTiltAngle = Math.atan2(diff, 5) * 0.6;
        steve.userData.head.rotation.y += (headTiltAngle - steve.userData.head.rotation.y) * 0.1;
        
        const bodyTiltAngle = Math.atan2(diff, 8) * 0.3;
        steve.rotation.z += (bodyTiltAngle - steve.rotation.z) * 0.08;
    } else {
        steve.userData.head.rotation.y *= 0.9;
        steve.rotation.z *= 0.9;
    }
}

const playlist = [
    'tracks/otherside.mp3',
    'tracks/FREE99.mp3',
    'tracks/SensualMelancholia.mp3',
    'tracks/8-BitKungFu.mp3',
];

let currentTrackIndex = 0;
const audio = new Audio();
audio.volume = 0.3;
let isMuted = true;

const jukebox = document.getElementById('jukebox-container');

function playNextTrack() {
    if (playlist.length === 0) return;
    
    audio.src = playlist[currentTrackIndex];
    audio.play().catch(e => console.log("User interaction required for audio"));
    
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
}

audio.onended = playNextTrack;

jukebox.addEventListener('click', () => {
    if (isMuted) {
        if (!audio.src) playNextTrack();
        audio.muted = false;
        audio.play();
        isMuted = false;
        jukebox.classList.add('music-playing');
        document.getElementById('music-note-particle').textContent = '♪';
    } else {
        audio.muted = true;
        isMuted = true;
        jukebox.classList.remove('music-playing');
    }
});

function updateStevePosition() {
    if (teleportLock) return;
    const sections = document.querySelectorAll('.section');
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(Math.max(scrollPos / documentHeight, 0), 1);

    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
        scrollDirection = 1;
    } else if (currentScrollY < lastScrollY) {
        scrollDirection = -1;
    }
    lastScrollY = currentScrollY;
    
    const aspect = window.innerWidth / (window.innerHeight * 0.15);
    const frustumSize = 4;
    const leftEdge = -frustumSize * aspect / 2;
    const rightEdge = frustumSize * aspect / 2;
    
    const padding = (rightEdge - leftEdge) * 0.1;
    const firstPos = leftEdge + padding;
    const lastPos = rightEdge - padding;
    
    targetX = firstPos + (lastPos - firstPos) * scrollPercent;
    
    const diff = targetX - steve.position.x;
    const scrollVelocity = Math.abs(currentScrollY - lastScrollY);
    
    if (scrollVelocity > 50 || Math.abs(diff) > 2) {
        steve.position.x += diff * 0.3;
    } else if (Math.abs(diff) > 0.02) {
        steve.position.x += diff * 0.15;
        isWalking = true;
        isTurning = false;
        turnProgress = 0;
    } else {
        if (isWalking) {
            isWalking = false;
            isTurning = true;
            turnProgress = 0;
        }
    }
    
    if (scrollVelocity > 1 && Math.abs(diff) > 0.02) {
        isWalking = true;
        isTurning = false;
        turnProgress = 0;
    }
    
    
}
const teleportSound = new Audio('sounds/teleport.mp3');
teleportSound.volume = 0.05;

function throwEnderpearl(startPos, endPos, callback) {
    const pearl = document.createElement('div');
    pearl.className = 'enderpearl';
    document.body.appendChild(pearl);
    
    const startX = startPos.x;
    const startY = startPos.y;
    const endX = endPos.x;
    const endY = endPos.y;
    
    const duration = 800;
    const startTime = Date.now();
    
    function animatePearl() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const x = startX + (endX - startX) * progress;
        const arc = Math.sin(progress * Math.PI) * 100;
        const y = startY + (endY - startY) * progress - arc;
        
        pearl.style.left = x + 'px';
        pearl.style.top = y + 'px';
        
        if (progress < 1) {
            requestAnimationFrame(animatePearl);
        } else {
            pearl.remove();
            if (callback) callback();
        }
    }
    
    animatePearl();
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetSection = link.dataset.section;
        const targetElement = document.getElementById(targetSection);
        
        const aspect = window.innerWidth / (window.innerHeight * 0.15);
        const frustumSize = 4;
        const normalizedX = steve.position.x / (frustumSize * aspect / 2);
        const steveScreenX = (normalizedX + 1) * window.innerWidth / 2;
        const steveScreenY = window.innerHeight * 0.075;
        
        const linkRect = link.getBoundingClientRect();
        const targetScreenX = linkRect.left + linkRect.width / 2;
        const targetScreenY = linkRect.top + linkRect.height / 2;
        
        throwEnderpearl(
            { x: steveScreenX, y: steveScreenY },
            { x: targetScreenX, y: targetScreenY },
            () => {
                teleportLock = true;
                teleportSteveToScreenX(targetScreenX);
                teleportSound.currentTime = 0;
                teleportSound.play()
                spawnTeleportBlockParticles();
                targetElement.scrollIntoView({ behavior: 'smooth' });

                setTimeout(() => {
                    teleportLock = false;

                    targetX = steve.position.x;
                    lastSteveX = steve.position.x;
                    isWalking = false;
                    isTurning = false;

                }, 600);

            }
        );
        onTeleport();
    });
});

let lastScrollTime = Date.now();
window.addEventListener('scroll', () => {
    lastScrollTime = Date.now();
    updateStevePosition();
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (Date.now() - lastScrollTime > 100) {
            isWalking = false;
        }
    }, 150);
});

window.addEventListener('resize', () => {
    const navbarHeight = window.innerHeight * 0.15;
    renderer.setSize(window.innerWidth, navbarHeight);
    
    const aspect = window.innerWidth / navbarHeight;
    const frustumSize = 4;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    
    navPositions = getNavLinkPositions();
    
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.min(Math.max(window.scrollY / documentHeight, 0), 1);
    
    const leftEdge = -frustumSize * aspect / 2;
    const rightEdge = frustumSize * aspect / 2;
    const padding = (rightEdge - leftEdge) * 0.1;
    const firstPos = leftEdge + padding;
    const lastPos = rightEdge - padding;
    
    targetX = firstPos + (lastPos - firstPos) * scrollPercent;
});

updateStevePosition();
animate();


const zCanvas = document.getElementById('zombie-canvas');
const zContainer = document.getElementById('zombie-container');
const zScene = new THREE.Scene();

const zAspect = zContainer.clientWidth / zContainer.clientHeight;
const zFrustum = 5; 
const zCamera = new THREE.OrthographicCamera(
    zFrustum * zAspect / -2,
    zFrustum * zAspect / 2,
    zFrustum / 2,
    zFrustum / -2,
    0.1,
    1000
);
zCamera.position.z = 5;
zCamera.position.y = 1;

const zRenderer = new THREE.WebGLRenderer({ canvas: zCanvas, alpha: true, antialias: true });
zRenderer.setSize(zContainer.clientWidth, zContainer.clientHeight);

function createZombie() {
    const zombie = new THREE.Group();
    
    const skinGreen = 0x4f7b39; 
    const shirtTeal = 0x3a8e8e; 
    const pantsPurple = 0x4d4094;
    const shoeDarkPurple = 0x302b50;
    
    const headGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75);
    const headMaterial = new THREE.MeshLambertMaterial({ color: skinGreen });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.25;
    head.position.z = 0.05;

    const eyeColor = 0x171717;
    const eyeGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.01);
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: eyeColor });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.2, 0.07, 0.41); 
    head.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.2, 0.07, 0.41); 
    head.add(rightEye);
    
    const hairGreen = 0x3a721d;
    const hairGeometry = new THREE.BoxGeometry(0.75, 0.175, 0.75);
    const hairMaterial = new THREE.MeshLambertMaterial({ color: hairGreen });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.set(0, 0.35, 0);
    head.add(hair);


    const hairLeftFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.15 , 0.1 , 0.01),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairLeftFront.position.set(-0.3, 0.25, 0.37);
    head.add(hairLeftFront);
    
    const hairRightFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.15 , 0.1 , 0.01),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairRightFront.position.set(0.3, 0.25, 0.37);
    head.add(hairRightFront);


    const hairLeftSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.3, 0.8),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairLeftSide.position.set(-0.375, 0.203, 0);
    head.add(hairLeftSide);

    const hairRightSide = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.3, 0.8),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairRightSide.position.set(0.375, 0.203, 0);
    head.add(hairRightSide);

    const hairLeftSideFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.1, 0.25),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairLeftSideFront.position.set(-0.375, 0, 0.25);
    head.add(hairLeftSideFront);

    const hairRightSideFront = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.1, 0.25),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairRightSideFront.position.set(0.375, 0, 0.25);
    head.add(hairRightSideFront);


    const hairLeftSideBackUp = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.2, 0.35),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairLeftSideBackUp.position.set(-0.375, -0.01, -0.2);
    head.add(hairLeftSideBackUp);


    const hairRightSideBackUp = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 0.2, 0.35),
        new THREE.MeshLambertMaterial({ color: hairGreen })
    );
    hairRightSideBackUp.position.set(0.375, -0.01, -0.2);
    head.add(hairRightSideBackUp);



    const beardColor = 0x3a721d;
    const beardThickness = 0.06;
    
    const mouthBar = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: 0x3a721d })
    );
    mouthBar.position.set(0, -0.05, 0.35);
    head.add(mouthBar);
    
    const beardBottom = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: beardColor })
    );
    beardBottom.position.set(-0.1, -0.25, 0.35);
    head.add(beardBottom);
    
    const beardLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.17, beardThickness),
        new THREE.MeshLambertMaterial({ color: beardColor })
    );
    beardLeft.position.set(-0.135, -0.17, 0.35);
    head.add(beardLeft);
    
    const beardRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.17, beardThickness),
        new THREE.MeshLambertMaterial({ color: beardColor })
    );
    beardRight.position.set(0.135, -0.17, 0.35);
    head.add(beardRight);

    const mouthPart1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: 0x3a721d })
    );
    mouthPart1.position.set(-0.25, -0.325, 0.35);
    head.add(mouthPart1);

    const mouthPart2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: 0x3a721d })
    );
    mouthPart2.position.set(-0.03, -0.325, 0.35);
    head.add(mouthPart2);

    const mouthPart3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.08, beardThickness),
        new THREE.MeshLambertMaterial({ color: 0x3a721d })
    );
    mouthPart3.position.set(0.19, -0.325, 0.35);
    head.add(mouthPart3);

    zombie.add(head);

    const bodyGeometry = new THREE.BoxGeometry(0.8, 1.0, 0.4);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: shirtTeal });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    zombie.add(body);

    
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.55, 0.85, 0);
    
    const leftSleeve = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshLambertMaterial({ color: shirtTeal })
    );
    leftSleeve.position.set(0, -0.15, 0);
    leftArmGroup.add(leftSleeve);
    
    const leftForearm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.7, 0.3),
        new THREE.MeshLambertMaterial({ color: skinGreen })
    );
    leftForearm.position.set(0, -0.65, 0);
    leftArmGroup.add(leftForearm);
    
    zombie.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.55, 0.85, 0);
    
    const rightSleeve = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshLambertMaterial({ color: shirtTeal })
    );
    rightSleeve.position.set(0, -0.15, 0);
    rightArmGroup.add(rightSleeve);
    
    const rightForearm = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.7, 0.3),
        new THREE.MeshLambertMaterial({ color: skinGreen })
    );
    rightForearm.position.set(0, -0.65, 0);
    rightArmGroup.add(rightForearm);
    
    zombie.add(rightArmGroup);

    leftArmGroup.rotation.x = -Math.PI / 2;
    rightArmGroup.rotation.x = -Math.PI / 2;

    const legGeometry = new THREE.BoxGeometry(0.4, 1.05, 0.35);
    const legMaterial = new THREE.MeshLambertMaterial({ color: pantsPurple });
    const shoeGeometry = new THREE.BoxGeometry(0.4, 0.2, 0.35);
    const shoeMaterial = new THREE.MeshLambertMaterial({ color: shoeDarkPurple });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, 0, 0);
    leftLeg.geometry.translate(0, -0.525, 0);

    const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    leftShoe.position.set(0, -0.85, 0);
    leftShoe.geometry.translate(0, -0.1, 0);
    leftLeg.add(leftShoe);
    
    zombie.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, 0, 0);
    rightLeg.geometry = leftLeg.geometry.clone(); 
    
    const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
    rightShoe.position.set(0, -0.85, 0);
    rightShoe.geometry.translate(0, -0.1, 0);
    rightLeg.add(rightShoe);

    zombie.add(rightLeg);

    zombie.userData = { leftArm: leftArmGroup, rightArm: rightArmGroup, leftLeg, rightLeg, head };
    return zombie;
}

const zombie = createZombie();
zombie.scale.set(0.9, 0.9, 0.9);
zombie.position.y = -0.5; 
zScene.add(zombie);

const zAmbient = new THREE.AmbientLight(0xffffff, 0.5);
zScene.add(zAmbient);
const zDirLight = new THREE.DirectionalLight(0xffffff, 0.8);
zDirLight.position.set(-2, 5, 5);
zScene.add(zDirLight);

let zMouseX = 0;
let zMouseY = 0;
let zTargetX = 0;
let zTargetY_Mouse = 0;
let zWalkCycle = 0;
let zIsMoving = false;

function updateZombieTarget() {
    const rect = zContainer.getBoundingClientRect();
    
    const normX = (zMouseX / window.innerWidth) * 2 - 1;
    const aspect = zContainer.clientWidth / zContainer.clientHeight;
    zTargetX = normX * (zFrustum * aspect / 2);

    const centerY = rect.top + (rect.height / 2);
    const mouseRelY = zMouseY - centerY;
    
    const normY = mouseRelY / (rect.height / 2);
    zTargetY_Mouse = normY * (zFrustum / 2);
}

window.addEventListener('mousemove', (e) => {
    zMouseX = e.clientX;
    zMouseY = e.clientY;
    updateZombieTarget();
});

window.addEventListener('scroll', () => {
    updateZombieTarget();
});



function animateZombie() {
    requestAnimationFrame(animateZombie);
    const diffX = zTargetX - zombie.position.x;
    const diffY = Math.min(zTargetY_Mouse - zombie.position.y, 0.6);
    const speed = 0.04, baseY = -0.2;
    const horizontalDist = Math.abs(diffX);
    const lookVerticalAngle = Math.atan2(diffY, Math.max(horizontalDist, 0.4));
    const clampedVertical = Math.max(Math.min(lookVerticalAngle, 0.4), -0.9);

    if (Math.abs(diffX) > 0.1) {
        zIsMoving = true;
        zombie.position.x += Math.sign(diffX) * speed;
        const targetRot = diffX > 0 ? Math.PI / 4 : -Math.PI / 4;
        zombie.rotation.y += (targetRot - zombie.rotation.y) * 0.05;
        zombie.userData.head.rotation.x += (clampedVertical - zombie.userData.head.rotation.x) * 0.05;
    } else {
        zIsMoving = false;
        zombie.rotation.y += (0 - zombie.rotation.y) * 0.1;
        zombie.userData.head.rotation.x += (clampedVertical - zombie.userData.head.rotation.x) * 0.1;
        zombie.userData.head.rotation.y *= 0.9;
    }

    if (zIsMoving) {
        zWalkCycle += 0.1;
        zombie.userData.leftLeg.rotation.x = Math.sin(zWalkCycle) * 0.6;
        zombie.userData.rightLeg.rotation.x = Math.sin(zWalkCycle + Math.PI) * 0.6;
        if (!isHitting) {
            zombie.userData.leftArm.rotation.x = -Math.PI / 2 + Math.sin(zWalkCycle) * 0.1;
            zombie.userData.rightArm.rotation.x = -Math.PI / 2 + Math.sin(zWalkCycle + Math.PI) * 0.1;
        }
        zombie.position.y = baseY + Math.abs(Math.sin(zWalkCycle * 2)) * 0.05;
    } else {
        zombie.userData.leftLeg.rotation.x *= 0.9;
        zombie.userData.rightLeg.rotation.x *= 0.9;
        if (!isHitting) {
            zombie.userData.leftArm.rotation.x =
                -Math.PI / 2 + Math.sin(Date.now() * 0.002) * 0.05;
            zombie.userData.rightArm.rotation.x =
                -Math.PI / 2 + Math.sin(Date.now() * 0.002 + 1) * 0.05;
        }
        zombie.position.y = baseY;
    }
    zRenderer.render(zScene, zCamera);

    const zombieScreen = zombieWorldToScreen(zombie, zCamera, zCanvas);

    const dx = zombieScreen.x - zMouseX;
    const dy = zombieScreen.y - zMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const HIT_RADIUS = 40;

    mouseCloseToZombie = distance < HIT_RADIUS;

    if (mouseCloseToZombie) {
        zombieHit(zombie);
    }
    
    if (isHitting) {
        document.body.style.cursor = 'url("images/red_cursor.svg") 0 0, auto';
        hitTimer++;

        

        const progress = hitTimer / HIT_DURATION;
        const swing = -Math.sin(progress * Math.PI);

        const base = -Math.PI / 2;
        const amplitude = 0.8;

        zombie.userData.leftArm.rotation.x = base + swing * amplitude;
        zombie.userData.rightArm.rotation.x = base + swing * amplitude;

        if (hitTimer >= HIT_DURATION) {
            const hit_sound = new Audio('sounds/hit_sound.mp3');
            hit_sound.volume = 0.2;
            hit_sound.duration = 2;
            hit_sound.play();
            isHitting = false;
            hitCooldown = HIT_COOLDOWN;
        }
    }
    else {
        document.body.style.cursor = 'auto';
    }

    if (hitCooldown > 0) {
        hitCooldown--;
    }


}

function zombieHit(zombie){
    if (hitCooldown > 0 || isHitting) return;
    isHitting = true;
    hitTimer = 0;
}


function zombieWorldToScreen(zombie, camera, zCanvas) {
    const pos = new THREE.Vector3();
    zombie.getWorldPosition(pos);

    pos.project(camera);

    const rect = zCanvas.getBoundingClientRect();

    const x = (pos.x * 0.5 + 0.5) * rect.width + rect.left;
    const y = (-pos.y * 0.5+0.3) * rect.height + rect.top;

    return { x, y };
}


window.addEventListener('resize', () => {
    if (!zContainer) return;
    const w = zContainer.clientWidth, h = zContainer.clientHeight;
    zRenderer.setSize(w, h);
    const aspect = w / h;
    zCamera.left = -zFrustum * aspect / 2;
    zCamera.right = zFrustum * aspect / 2;
    zCamera.top = zFrustum / 2;
    zCamera.bottom = -zFrustum / 2;
    zCamera.updateProjectionMatrix();
});

animateZombie();

lastTime = performance.now();

const gameButtons = document.querySelectorAll('#game-selector .mc-button');
const tagGame = document.getElementById('tag-game');
const airHockeyGame = document.getElementById('air-hockey-game');

gameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        gameButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const game = btn.dataset.game;

        if (typeof stopAirHockey === 'function') stopAirHockey();
        if (typeof stopTagGame === 'function') stopTagGame();

        if (game === 'tag') {
            airHockeyGame.classList.add('hidden');
            tagGame.classList.remove('hidden');
            resetTagGame();
        }
        else {
            tagGame.classList.add('hidden');
            airHockeyGame.classList.remove('hidden');
            initAirHockey();
        }
    });
});

const movedWords = new Set();
const wordLastMoved = new Map();


function initDraggableWords() {
    const hobbiesArea = document.getElementById('hobbies-draggable-area');
    const draggableWords = document.querySelectorAll('.draggable-word');

    draggableWords.forEach(word => {
        word.style.position = 'relative';
        word.style.display = 'inline-block';
        word.style.margin = '0 1px';
    });

    hobbiesArea.offsetHeight;

    const positions = [];
    draggableWords.forEach((word) => {
        const rect = word.getBoundingClientRect();
        const areaRect = hobbiesArea.getBoundingClientRect();
        
        let left = rect.left - areaRect.left;

        if (word.classList.contains("punctuation")) {
            left -= 10;
        }
        
        positions.push({
            left: left,
            top: rect.top - areaRect.top
        });

    });

    draggableWords.forEach((word, index) => {
        word.style.position = 'absolute';
        word.style.display = 'block';
        word.style.margin = '0';
        word.style.left = positions[index].left + 'px';
        word.style.top = positions[index].top + 'px';
    });

    draggableWords.forEach(word => {
        let isDragging = false;
        let currentX = parseFloat(word.style.left);
        let currentY = parseFloat(word.style.top);
        let initialX = 0;
        let initialY = 0;

        word.addEventListener('mousedown', dragStart);
        word.addEventListener('touchstart', dragStart, { passive: false });

        function dragStart(e) {
            if (e.type === 'touchstart') {
                initialX = e.touches[0].clientX;
                initialY = e.touches[0].clientY;
            } else {
                initialX = e.clientX;
                initialY = e.clientY;
            }

            currentX = parseFloat(word.style.left);
            currentY = parseFloat(word.style.top);

            isDragging = true;
            word.classList.add('dragging');

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            document.addEventListener('touchmove', drag, { passive: false });
            document.addEventListener('touchend', dragEnd);
            window.addEventListener('scroll', dragEnd);
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();

                let clientX, clientY;
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const deltaX = clientX - initialX;
                const deltaY = clientY - initialY;

                let newX = currentX + deltaX;
                let newY = currentY + deltaY;

                const areaRect = hobbiesArea.getBoundingClientRect();
                const wordRect = word.getBoundingClientRect();
                
                const maxX = areaRect.width - wordRect.width;
                const maxY = areaRect.height - wordRect.height;

                newX = Math.max(0, Math.min(newX, maxX));
                newY = Math.max(0, Math.min(newY, maxY));

                word.style.left = newX + 'px';
                word.style.top = newY + 'px';
            }
        }

        function dragEnd(e) {
            if (isDragging) {
                currentX = parseFloat(word.style.left);
                currentY = parseFloat(word.style.top);
                movedWords.add(word);
                wordLastMoved.set(word, Date.now());
                checkForSentence();


            }
            
            isDragging = false;
            word.classList.remove('dragging');

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('touchend', dragEnd);
            window.removeEventListener('scroll', dragEnd);
        }
    });
}    
function checkWordProximity() {
    checkForSentence();
}

const SENTENCE_MATCHES = [

    { words: ["I'm", "not", "coding"], reply: "What are you upto then ?" },
    { words: ["When", "I'm", "not", "coding"], reply: "Slep." },
    { words: ["not", "coding"], reply: "ok ?" },

    { words: ["I", "usually", "game"], reply: "Which game ?" },
    { words: ["I", "usually", "read"], reply: "Which book ?" },
    { words: ["usually", "game"], reply: "Unusually game." },
    { words: ["usually", "read"], reply: "Unusually read." },
    { words: ["usually", "game", "or"], reply: "Slep" },
    { words: ["When", "I", "game"], reply: "Oh ?" },
    { words: ["I", "game"], reply: "What game ?" },
    { words: ["I","read"], reply: "Which book ?" },
    { words: ["game", "or", "read"], reply: "Game obviously." },
    { words: ["read", "or", "game"], reply: "Game obviously." },
    { words: ["usually", "game", "or", "read"], reply: "Good for you." },
    

    { words: ["I", "usually","play", "badminton"], reply: "Every weekend!" },
    { words: ["I", "usually","play", "chess"], reply: "Send me a request!" },
    { words: ["I", "usually","play", "football"], reply: "Messi or Ronaldo ? Neymar maybe ?" },
    { words: ["I", "usually","play", "table", "tennis"], reply: "I'm out of practice now." },
    { words: ["play", "chess"], reply: "e4." },
    { words: ["play", "badminton"], reply: "I'll serve." },
    { words: ["play", "table", "tennis"], reply: "I'll take this side." },
    { words: ["and", "football"], reply: "Classic." },
    { words: ["Bad", "game"], reply: "Which one ?" },
    { words: ["I", "like", "badminton"], reply: "I do too!" },
    { words: ["I", "like", "table", "tennis"], reply: "I do too!" },
    { words: ["I", "like", "chess"], reply: "I do too!" },
    { words: ["I", "like", "football"], reply: "Great ! Which position do you play ?" },

    { words: ["I", "also"], reply: "Got it." },
    { words: ["also", "like"], reply: "Nice." },
    { words: ["like", "watching"], reply: "creep." },
    { words: ["I", "like", "watching", "web", "series"], reply: "Which one's the best ?" },
    { words: ["I've", "already", "completed", "Dr", "House"], reply: "Oh great, im on season 6." },
    { words: ["I've", "already", "completed", "Breaking", "Bad"], reply: "Same!" },
    { words: ["I've", "almost", "completed", "Dr", "House"], reply: "Me too!" },
    { words: ["I've", "almost", "completed", "Breaking", "Bad"], reply: "BCS next." },
    { words: ["I've", "completed", "Dr", "House"], reply: "Oh great, im almost done." },
    { words: ["I've", "completed", "Breaking", "Bad"], reply: "Same!" },
    { words: ["I've", "completed", "web", "series"], reply: "Which!" },
    { words: ["watching", "web"], reply: "Watching what on web ?" },
    { words: ["web", "series"], reply: "Any favorites?" },
    { words: ["watching", "web", "series"], reply: "Same here." },
    { words: ["completed", "series"], reply: "Which one ?" },
    { words: ["I", "like", "Breaking", "Bad"], reply: "Who's your favorite character?" },
    { words: ["I", "like", "Dr", "House"], reply: "I like the series" },
    { words: ["I've", "already"], reply: "Good job." },
    { words: ["already", "completed"], reply: "Good." },
    { words: ["Breaking", "Bad"], reply: "Great show." },
    { words: ["completed", "Breaking", "Bad"], reply: "Worth it." },
    { words: ["I've", "already", "completed"], reply: "Completed what ?" },
    { words: ["Bad", "series"], reply: "Which one ?" },
    { words: ["I'm", "Breaking", "Bad"], reply: "Good luck," },

    { words: ["I'm", "Bad"], reply: "yea, bad at everything." },
    { words: ["I'm", "not", "Bad"], reply: "That's good." },
];


function getOrderedWords() {
    const words = [...document.querySelectorAll(".draggable-word")];

    const mapped = words.map(w => {
        const r = w.getBoundingClientRect();
        return { el: w, left: r.left };
    });

    mapped.sort((a, b) => a.left - b.left);
    return mapped.map(m => m.el.textContent.trim());
}

function areAdjacent(elements, tolerance = 20) {
for (let i = 0; i < elements.length - 1; i++) {
    const r1 = elements[i].getBoundingClientRect();
    const r2 = elements[i + 1].getBoundingClientRect();
    const gap = r2.left - (r1.left + r1.width);
    if (gap > tolerance) return false;
}
return true;
}


let lastDetectedSentence = "";

function checkForSentence() {

    const words = [...document.querySelectorAll(".draggable-word")]
        .filter(w => movedWords.has(w));

    if (words.length < 2) return;

    const sorted = words
        .map(w => ({ el: w, rect: w.getBoundingClientRect() }))
        .sort((a, b) => a.rect.left - b.rect.left);

    let bestMatch = null;
    let bestTime = 0;

    for (const combo of SENTENCE_MATCHES) {
        const len = combo.words.length;

        for (let i = 0; i <= sorted.length - len; i++) {

            const slice = sorted.slice(i, i + len);
            const texts = slice.map(x => x.el.textContent.trim());

            if (
                JSON.stringify(texts) === JSON.stringify(combo.words) &&
                areAdjacent(slice.map(x => x.el))
            ) {

                let newest = 0;
                slice.forEach(x => {
                    const t = wordLastMoved.get(x.el) || 0;
                    if (t > newest) newest = t;
                });

                if (newest > bestTime) {
                    bestTime = newest;
                    bestMatch = combo;
                }
            }
        }
    }

    if (!bestMatch) return;

    const key = bestMatch.words.join(" ");

    if (key !== lastDetectedSentence) {
        lastDetectedSentence = key;
        typeReply(bestMatch.reply);
    }
}


const chatText = document.getElementById("hobbies-chat-text");

let typingLock = false;
function typeReply(text) {
    if (typingLock) return;
    typingLock = true;

    if(text === chatText.textContent) {
        typingLock = false;
        return;
    }

    chatText.textContent = "";
    let i = 0;

    const interval = setInterval(() => {
        chatText.textContent += text[i];
        i++;

        if (i >= text.length) {
        clearInterval(interval);
        typingLock = false;
        }
    }, 35);
}

setTimeout(initDraggableWords, 100);