document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. INDEX PAGE LOGIC ---
    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            const name = document.getElementById('visitorName').value;
            if (name.trim() !== "") {
                localStorage.setItem('marauderName', name);
                // Simple fade out effect
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
            } else {
                alert("The map reveals nothing to those who have no name.");
            }
        });
    }

    // --- 2. HOME PAGE LOGIC ---
    const mapBase = document.querySelector('.map-base');
    if (mapBase) {
        // Retrieve Name
        const userName = localStorage.getItem('marauderName') || "Unknown Wizard";
        const cursorName = document.getElementById('cursor-name');
        if(cursorName) cursorName.innerText = userName;

        // Auto Open Map after a short delay
        setTimeout(() => {
            mapBase.classList.add('active');
        }, 500);

        // Close Button Logic
        const closeBtn = document.getElementById('closeMapBtn');
        if(closeBtn) {
            closeBtn.addEventListener('click', () => {
                mapBase.classList.remove('active');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); // Wait for close animation
            });
        }

        // --- 3. CURSOR & FOOTPRINTS LOGIC ---
        const follower = document.getElementById('cursor-follower');
        let lastX = 0;
        let lastY = 0;
        let isLeftFoot = true;
        
        // Throttling variable to prevent too many footprints
        let lastFootprintTime = 0; 
        const footprintInterval = 150; // ms between footprints

        document.addEventListener('mousemove', (e) => {
            // 1. Move the name tag
            follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

            // 2. Generate Footprints
            const now = Date.now();
            if (now - lastFootprintTime > footprintInterval) {
                createFootprint(e.clientX, e.clientY, lastX, lastY, isLeftFoot);
                
                // Update state
                lastX = e.clientX;
                lastY = e.clientY;
                isLeftFoot = !isLeftFoot;
                lastFootprintTime = now;
            }
        });
    }
});

function createFootprint(x, y, prevX, prevY, isLeft) {
    // Only create if moved significantly
    const dist = Math.hypot(x - prevX, y - prevY);
    if (dist < 20) return; 

    const footprint = document.createElement('div');
    footprint.classList.add('footprint');

    // Calculate rotation angle based on movement direction
    const angle = Math.atan2(y - prevY, x - prevX) * 180 / Math.PI;
    
    // Offset for left/right foot
    const offset = isLeft ? -10 : 10;
    // Rotate offset 90deg relative to direction
    const rad = angle * (Math.PI / 180);
    const offsetX = Math.cos(rad + Math.PI/2) * offset;
    const offsetY = Math.sin(rad + Math.PI/2) * offset;

    footprint.style.left = `${x + offsetX}px`;
    footprint.style.top = `${y + offsetY}px`;
    
    // Apply rotation (add 90deg because the foot shape points up by default)
    footprint.style.transform = `rotate(${angle + 90}deg)`;

    document.body.appendChild(footprint);

    // Cleanup after animation
    setTimeout(() => {
        footprint.remove();
    }, 2000);
}