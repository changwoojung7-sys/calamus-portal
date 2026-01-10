const COLORS = [
    '#FF6B6B', // Coral Red
    '#4D96FF', // Soft Blue
    '#6BCB77', // Soft Green
    '#FFD93D', // Soft Yellow
    '#A29BFE', // Soft Purple
    '#F472B6', // Soft Pink
    '#22D3EE', // Cyan
    '#F97316', // Orange
    '#A5B4FC', // Periwinkle
    '#5EEAD4'  // Teal
];

let players = [];
let currentRotation = 0;
let isSpinning = false;
let ctx;
let canvas;
let missionTitle = "";
let missionQueue = [];
let currentMissionIndex = 0;

// Sound Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const nameInput = document.getElementById('nameInput');
    const missionInput1 = document.getElementById('missionInput1');
    const missionInput2 = document.getElementById('missionInput2');
    const missionDisplay = document.getElementById('missionDisplay');
    const resultLog = document.getElementById('resultLog');
    const addBtn = document.getElementById('addBtn');
    const playerList = document.getElementById('playerList');
    const createWheelBtn = document.getElementById('createWheelBtn');
    const setupPhase = document.getElementById('setupPhase');
    const gamePhase = document.getElementById('gamePhase');
    const spinBtn = document.getElementById('spinBtn');
    const resetBtn = document.getElementById('resetBtn');

    canvas = document.getElementById('wheelCanvas');
    ctx = canvas.getContext('2d');

    // Event Listeners
    addBtn.addEventListener('click', addPlayer);
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });

    createWheelBtn.addEventListener('click', () => {
        // Build Queue
        missionQueue = [];
        const m1 = missionInput1.value.trim();
        const m2 = missionInput2.value.trim();

        if (m1) missionQueue.push(m1);
        if (m2) missionQueue.push(m2);

        if (missionQueue.length === 0) missionQueue.push("오늘의 주인공은 누구?");

        currentMissionIndex = 0;
        updateMissionDisplay();

        // Reset Log
        resultLog.innerHTML = "";

        setupPhase.style.display = 'none';
        gamePhase.style.display = 'flex';
        drawWheel();

        // Log Stats
        fetch('/api/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ appId: 'roulette', appName: '운명의 룰렛' })
        }).catch(e => console.warn(e));
    });

    spinBtn.addEventListener('click', spinWheel);

    resetBtn.addEventListener('click', () => {
        gamePhase.style.display = 'none';
        setupPhase.style.display = 'block';
        currentRotation = 0;
        isSpinning = false;
        missionDisplay.innerText = "오늘의 주인공은 누구?"; // Reset title
        // Reset Inputs? optional.
        resultLog.innerHTML = "";
    });

    function updateMissionDisplay() {
        if (currentMissionIndex < missionQueue.length) {
            missionTitle = missionQueue[currentMissionIndex];
            missionDisplay.innerText = missionTitle;
            missionDisplay.style.color = "#fff";

            spinBtn.innerText = "돌리기! 🎲";
            spinBtn.disabled = false;
        } else {
            missionDisplay.innerText = "모든 미션 종료!";
            missionDisplay.style.color = "#4ade80"; // Green
            spinBtn.innerText = "게임 종료 🎉";
            spinBtn.disabled = true;
        }
    }

    // Expose for Global Access
    window.updateGameRound = updateMissionDisplay;

    // logic functions
    function addPlayer() {
        const name = nameInput.value.trim();
        if (!name) return;
        if (players.length >= 10) {
            alert("최대 10명까지 가능합니다!");
            return;
        }
        if (players.includes(name)) {
            alert("이미 있는 이름입니다.");
            return;
        }

        players.push(name);
        renderTags();
        nameInput.value = '';
        nameInput.focus();
        checkBtn();
    }

    function removePlayer(name) {
        players = players.filter(p => p !== name);
        renderTags();
        checkBtn();
    }

    function renderTags() {
        playerList.innerHTML = '';
        players.forEach(name => {
            const chip = document.createElement('div');
            chip.className = 'player-chip';
            chip.innerHTML = `
                ${name} 
                <span class="remove" onclick="window.removePlayerTrigger('${name}')">×</span>
            `;
            playerList.appendChild(chip);
        });
    }

    function checkBtn() {
        createWheelBtn.disabled = players.length < 2;
        if (players.length < 2) {
            createWheelBtn.innerText = `룰렛 만들기 (현재 ${players.length}명/최소 2명)`;
        } else {
            createWheelBtn.innerText = "룰렛 만들기 (준비 완료!)";
        }
    }

    // Global expose for onclick
    window.removePlayerTrigger = removePlayer;
});

function drawWheel() {
    if (!canvas || players.length === 0) return;

    const arc = Math.PI * 2 / players.length;
    const radius = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(currentRotation); // Apply current rotation

    players.forEach((player, i) => {
        const angle = i * arc;

        // Slice
        ctx.beginPath();
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, angle, angle + arc);
        ctx.lineTo(0, 0);
        ctx.fill();

        // Neon Divider Line
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#ffffff";
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 10; // Neon glow
        ctx.stroke();

        // Reset shadow for text
        ctx.shadowBlur = 0;

        // Text
        ctx.save();
        ctx.fillStyle = "#fff"; // Text color
        // Add text shadow or stroke for readability on light colors
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 4;
        ctx.translate(0, 0);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.font = "bold 32px 'Pretendard', sans-serif"; // More modern font
        ctx.fillText(player, radius - 40, 10);
        ctx.restore();
    });

    ctx.restore();
}

function playTickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Sound pitch
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); // Lower volume
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    // Random spin: 5 to 10 full rotations + random offset
    const spinAngle = (Math.random() * 5 + 5) * Math.PI * 2 + (Math.random() * Math.PI * 2);
    const duration = 5000; // 5 seconds
    const startRotation = currentRotation;
    const startTime = performance.now();

    // Physics Logic for Sound
    let lastAngle = startRotation;

    function animate(time) {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Ease Out Cubic
        const ease = 1 - Math.pow(1 - t, 3);

        currentRotation = startRotation + spinAngle * ease;
        drawWheel();

        // Sound Logic (approximate)
        const speed = (spinAngle * (1 - t) * 3) / duration;
        if (Math.random() < speed * 0.5) { // Adjusted probability
            playTickSound();
        }

        lastAngle = currentRotation;

        if (t < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            determineWinner();
        }
    }

    requestAnimationFrame(animate);
}

function determineWinner() {
    const totalAngle = Math.PI * 2;
    let normalizedRot = currentRotation % totalAngle;

    // Pointer is at -0.5 PI (270 deg)
    let pointerAngle = (1.5 * Math.PI - normalizedRot);
    if (pointerAngle < 0) pointerAngle += totalAngle;
    if (pointerAngle < 0) pointerAngle += totalAngle;

    const sliceArc = totalAngle / players.length;
    const winnerIndex = Math.floor(pointerAngle / sliceArc);

    const winner = players[winnerIndex];
    showWinner(winner);
}

function showWinner(name) {
    const modal = document.getElementById('winnerModal');
    const winnerName = document.getElementById('winnerName');
    const currentMission = missionQueue[currentMissionIndex] || "당첨자";

    // Update modal text optionally if we had a dedicated element, 
    // but here we just update the name or title.
    // Let's replace the modal Title to be the mission
    modal.querySelector('h2').innerText = `🎉 ${currentMission} 🎉`;
    winnerName.innerText = name;

    modal.style.display = 'block';

    playTickSound();
    setTimeout(playTickSound, 100);

    // LOG RESULT
    const resultLog = document.getElementById('resultLog');
    const logItem = document.createElement('div');
    logItem.style.cssText = `
        background: rgba(255,255,255,0.1); 
        padding: 12px 20px; 
        border-radius: 12px; 
        margin-bottom: 10px; 
        font-size: 1.1rem; 
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
        animation: popIn 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    logItem.innerHTML = `<span style="color:#fcd34d; font-weight:bold;">${currentMission}</span> <span>👉</span> <strong style="font-size:1.2rem;">${name}</strong>`;
    resultLog.appendChild(logItem);
}

window.closeModal = function () {
    document.getElementById('winnerModal').style.display = 'none';

    // Move to next mission
    currentMissionIndex++;
    // Call the function defined in scope (updateMissionDisplay is inside DOMContentLoaded scope, but I need it here).
    // Ah, updateMissionDisplay is inside the closure. I need to expose it or move showWinner inside.
    // Easier: Expose updateMissionDisplay globally or emit event.

    if (window.updateGameRound) {
        window.updateGameRound();
    }
}
