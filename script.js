document.addEventListener('DOMContentLoaded', () => {
    
    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            const name = document.getElementById('visitorName').value;
            if (name.trim() !== "") {
                localStorage.setItem('marauderName', name);
                document.body.style.opacity = '0';
                setTimeout(() => { window.location.href = 'home.html'; }, 1000);
            } else {
                alert("The map reveals nothing to those who have no name.");
            }
        });
    }

    const mapBase = document.querySelector('.map-base');
    if (mapBase) {
        const userName = localStorage.getItem('marauderName') || "Unknown Wizard";
        const cursorName = document.getElementById('cursor-name');
        if (cursorName) cursorName.innerText = userName;

        setTimeout(() => {
            mapBase.classList.add('active');
        }, 1000);

        const closeBtn = document.getElementById('closeMapBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                mapBase.classList.remove('active');
                setTimeout(() => { window.location.href = 'index.html'; }, 2000);
            });
        }

        const follower = document.getElementById('cursor-follower');
        let lastX = 0, lastY = 0, isLeftFoot = true, lastFootprintTime = 0;

        document.addEventListener('mousemove', (e) => {
            follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            const now = Date.now();
            if (now - lastFootprintTime > 150) {
                createFootprint(e.clientX, e.clientY, lastX, lastY, isLeftFoot);
                lastX = e.clientX; lastY = e.clientY;
                isLeftFoot = !isLeftFoot;
                lastFootprintTime = now;
            }
        });
    }
});

function createFootprint(x, y, prevX, prevY, isLeft) {
    if (Math.hypot(x - prevX, y - prevY) < 20) return;
    const footprint = document.createElement('div');
    footprint.classList.add('footprint');
    const angle = Math.atan2(y - prevY, x - prevX) * 180 / Math.PI;
    const offset = isLeft ? -10 : 10;
    const rad = angle * (Math.PI / 180);
    footprint.style.left = `${x + Math.cos(rad + Math.PI/2) * offset}px`;
    footprint.style.top = `${y + Math.sin(rad + Math.PI/2) * offset}px`;
    footprint.style.transform = `rotate(${angle + 90}deg)`;
    document.body.appendChild(footprint);
    setTimeout(() => footprint.remove(), 2000);
}