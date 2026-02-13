const checkboxes = document.querySelectorAll('.mission-checkbox');
const progressBar = document.getElementById('progress-bar');
const tableBody = document.querySelector('#missions-table tbody');
const remainingMissionsSpan = document.getElementById('remaining-missions');
const resetButton = document.getElementById('reset-button');
const badgesDiv = document.getElementById('badges');
const dingSound = document.getElementById('ding-sound');
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

let confettiParticles = [];

function updateProgress() {
    const total = checkboxes.length;
    let completed = 0;

    checkboxes.forEach(cb => {
        const row = cb.parentElement.parentElement;
        if (cb.checked) {
            completed++;
            row.classList.add('completed');
            row.classList.remove('not-completed');
        } else {
            row.classList.remove('completed');
            row.classList.add('not-completed');
        }
    });

    const percent = Math.round((completed / total) * 100);

    // Barre dynamique
    if (percent <= 25) progressBar.style.background = 'red';
    else if (percent <= 50) progressBar.style.background = 'orange';
    else if (percent <= 75) progressBar.style.background = 'yellowgreen';
    else progressBar.style.background = 'green';

    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
    remainingMissionsSpan.textContent = `Missions restantes : ${total - completed}`;

    updateBadges(percent);
    sortTable();

    // Confettis aux paliers
    if ([25, 50, 75, 100].includes(percent)) launchConfetti();
}

function sortTable() {
    const rows = Array.from(tableBody.rows);
    rows.sort((a, b) => {
        const aChecked = a.querySelector('input').checked ? 1 : 0;
        const bChecked = b.querySelector('input').checked ? 1 : 0;
        return bChecked - aChecked;
    });
    rows.forEach(row => tableBody.appendChild(row));
}

function updateBadges(percent) {
    badgesDiv.innerHTML = '';
    if (percent >= 25) badgesDiv.innerHTML += '⭐ ';
    if (percent >= 50) badgesDiv.innerHTML += '⭐ ';
    if (percent >= 75) badgesDiv.innerHTML += '⭐ ';
    if (percent === 100) badgesDiv.innerHTML += '🏆';
}

window.addEventListener('load', () => {
    checkboxes.forEach((cb, i) => {
        const saved = localStorage.getItem('mission-' + i);
        if (saved === 'true') cb.checked = true;
    });
    updateProgress();
});

checkboxes.forEach((cb, i) => {
    cb.addEventListener('change', () => {
        localStorage.setItem('mission-' + i, cb.checked);
        dingSound.play();
        updateProgress();
    });
});

// Réinitialisation intelligente
resetButton.addEventListener('click', () => {
    const confirm1 = confirm("⚠️ Es-tu sûr de vouloir réinitialiser toutes les missions ?");
    if (!confirm1) return;
    const confirm2 = confirm("⚠️ Cette action décochera toutes les missions. Confirme encore !");
    if (!confirm2) return;

    checkboxes.forEach((cb, i) => {
        cb.checked = false;
        localStorage.setItem('mission-' + i, false);
    });
    updateProgress();
    alert("Toutes les missions ont été réinitialisées ✅");
});

// ==== CONFETTI ====
function launchConfetti() {
    for (let i = 0; i < 150; i++) {
        confettiParticles.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            r: Math.random() * 6 + 2,
            d: Math.random() * 150 + 50,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05
        });
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach((p, i) => {
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
        p.tilt += p.tiltAngleIncremental;
        p.y += Math.cos(0.01 + p.d / 100);
        if (p.y > confettiCanvas.height) confettiParticles.splice(i, 1);
    });
    if (confettiParticles.length > 0) requestAnimationFrame(animateConfetti);
}

// Ajuster canvas
window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;S