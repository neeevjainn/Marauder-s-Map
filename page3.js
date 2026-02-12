document.addEventListener('DOMContentLoaded', () => {

    // --- 1. INFINITE PAGINATION LOGIC ---
    const pageNums = document.querySelectorAll('.dynamic-page-num');
    const scrollContainer = document.getElementById('scroll-container');

    // List of "impossible" page numbers from the story + random ones
    const randomPages = ["999", "40,514", "88", "1,000", "Unknown", "∞", "1", "19", "2,001", "End?"];

    scrollContainer.addEventListener('scroll', () => {
        // Randomly scramble page numbers as user scrolls to simulate the shifting book
        if (Math.random() > 0.8) { // Only do it sometimes to avoid chaos
            const randomTarget = pageNums[Math.floor(Math.random() * pageNums.length)];
            const randomVal = randomPages[Math.floor(Math.random() * randomPages.length)];
            
            // Simple fade out/in effect
            randomTarget.style.opacity = 0;
            setTimeout(() => {
                randomTarget.innerText = randomVal;
                randomTarget.style.opacity = 1;
            }, 300);
        }
    });


    // --- 2. SAND FOOTPRINT LOGIC ---
    const mapCol = document.getElementById('sand-map');
    const footprintContainer = document.getElementById('sand-footprints');

    let isLeftFoot = true;
    let lastX = 0;
    let lastY = 0;
    const stepDistance = 50;

    // On this page, footprints follow the mouse inside the map container
    // symbolizing the user getting lost in the library
    mapCol.addEventListener('mousemove', (e) => {
        const rect = mapCol.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const dist = Math.hypot(x - lastX, y - lastY);

        if (dist > stepDistance) {
            createSandFootprint(x, y, lastX, lastY);
            lastX = x;
            lastY = y;
        }
    });

    function createSandFootprint(x, y, prevX, prevY) {
        // Calculate angle
        const angle = Math.atan2(y - prevY, x - prevX) * 180 / Math.PI;

        const print = document.createElement('div');
        print.classList.add('sand-footprint');

        // Offset for feet
        const offset = 10;
        const rad = angle * (Math.PI / 180);
        const offsetX = Math.cos(rad + Math.PI/2) * (isLeftFoot ? -offset : offset);
        const offsetY = Math.sin(rad + Math.PI/2) * (isLeftFoot ? -offset : offset);

        print.style.left = `${x + offsetX}px`;
        print.style.top = `${y + offsetY}px`;
        // Rotate (print points down by default in CSS, so add 180 if needed, or 90. 
        // Our CSS print is vertical. Movement angle 0 is right. 
        // So we rotate angle + 90deg.)
        print.style.transform = `rotate(${angle + 90}deg)`;

        footprintContainer.appendChild(print);

        // Create dissolving particles ("Sand")
        createSandParticles(x + offsetX, y + offsetY);

        isLeftFoot = !isLeftFoot;

        // Cleanup DOM
        setTimeout(() => {
            print.remove();
        }, 2500);
    }

    function createSandParticles(x, y) {
        for(let i=0; i<5; i++) {
            const grain = document.createElement('div');
            grain.classList.add('sand-grain');
            
            // Random scatter
            const rx = (Math.random() - 0.5) * 15;
            const ry = (Math.random() - 0.5) * 15;
            
            grain.style.left = `${x + rx}px`;
            grain.style.top = `${y + ry}px`;
            
            footprintContainer.appendChild(grain);

            setTimeout(() => grain.remove(), 1000);
        }
    }
});