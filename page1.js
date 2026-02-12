document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SCROLL REVEAL TEXT ANIMATION ---
    const paragraphs = document.querySelectorAll('.story-content p');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        root: document.getElementById('scroll-container')
    });

    paragraphs.forEach(p => observer.observe(p));


    // --- 2. MAP PATH LOGIC ---
    const scrollContainer = document.getElementById('scroll-container');
    const path = document.getElementById('walk-path');
    const footprintContainer = document.getElementById('footprint-container');
    
    // Total length of the SVG path
    const pathLength = path.getTotalLength();
    
    // State to manage footprints
    let isLeftFoot = true;
    let lastScrollY = 0;
    let accumulatedDistance = 0;
    const stepDistance = 40; // Pixels of path distance between footprints

    // Function to calculate position on path based on scroll %
    function updateMap() {
        // Calculate how far down the text we are (0 to 1)
        // We subtract clientHeight so 100% is reached when we hit the bottom
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollPercentage = scrollContainer.scrollTop / maxScroll;

        // Map scroll % to path length
        // We cap it at 0.98 to avoid going off the very edge
        const currentPathDistance = Math.min(scrollPercentage * pathLength, pathLength * 0.98);

        // --- SPAWN FOOTPRINTS ---
        // We only want to add footprints if we've moved forward enough
        if (currentPathDistance > accumulatedDistance + stepDistance) {
            
            // Loop to fill in gaps if user scrolls fast
            while (currentPathDistance > accumulatedDistance + stepDistance) {
                accumulatedDistance += stepDistance;
                placeFootprint(accumulatedDistance);
            }
        }
        // Optional: Remove footprints if scrolling back up? 
        // For a "memory" map, usually footprints stay, but let's clear them 
        // if the user goes way back up to keep the UI clean.
        else if (currentPathDistance < accumulatedDistance - 100) {
            footprintContainer.innerHTML = '';
            accumulatedDistance = 0;
        }
    }

    function placeFootprint(distance) {
        // Get coordinates at specific distance along path
        const point = path.getPointAtLength(distance);
        
        // Get coordinates slightly ahead to determine rotation angle
        const nextPoint = path.getPointAtLength(distance + 5);
        
        // Calculate angle
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;

        // Create Element
        const footprint = document.createElement('div');
        footprint.classList.add('static-footprint');
        
        // Offset for left/right foot logic
        const offsetAmount = 8;
        const rad = angle * (Math.PI / 180);
        // Calculate perpendicular offset
        const offsetX = Math.cos(rad + Math.PI/2) * (isLeftFoot ? -offsetAmount : offsetAmount);
        const offsetY = Math.sin(rad + Math.PI/2) * (isLeftFoot ? -offsetAmount : offsetAmount);

        footprint.style.left = `${point.x + offsetX}px`;
        footprint.style.top = `${point.y + offsetY}px`;
        
        // Rotate (add 90deg because css footprint points up)
        footprint.style.transform = `rotate(${angle + 90}deg)`;

        footprintContainer.appendChild(footprint);
        
        // Toggle foot
        isLeftFoot = !isLeftFoot;
    }

    // Attach scroll listener
    scrollContainer.addEventListener('scroll', updateMap);
});