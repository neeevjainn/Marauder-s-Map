document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SETUP ---
    const scrollContainer = document.getElementById('scroll-container');
    const footprintContainer = document.getElementById('spiral-footprints');
    const mapCol = document.getElementById('map-col');
    
    // We are simulating a spiral mathematically rather than strictly following the SVG path
    // to allow for easier dynamic drawing
    const centerX = 250;
    const centerY = 250;
    const maxRadius = 200;
    const totalRotations = 3 * Math.PI * 2; // 3 full circles inward
    
    let isLeftFoot = true;
    let accumulatedScroll = 0;
    const stepThreshold = 30; // Pixel scroll distance between steps
    
    // --- 2. SCROLL LISTENER ---
    scrollContainer.addEventListener('scroll', () => {
        
        // Calculate Percentage (0.0 to 1.0)
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollPercent = scrollContainer.scrollTop / maxScroll;

        // --- A. GENERATE FOOTPRINTS SPIRALING INWARD ---
        // We map the scroll % to the spiral angle
        const currentAngle = scrollPercent * totalRotations;
        
        // Radius decreases as we scroll (spiral in)
        // Starts at maxRadius, ends at 20px (center)
        const currentRadius = maxRadius - (scrollPercent * (maxRadius - 20));

        // Only add footprint if we moved enough
        // We use scrollPercent to gate creation so it doesn't flood
        const scrollPixelDistance = scrollContainer.scrollTop;
        
        if (scrollPixelDistance > accumulatedScroll + stepThreshold && scrollPercent < 0.95) {
            createSpiralFootprint(currentRadius, currentAngle);
            accumulatedScroll = scrollPixelDistance;
        }

        // --- B. THE CLIMAX (FIRE EFFECT) ---
        // If user reaches near the end (95%), trigger the burning effect
        if (scrollPercent > 0.95) {
            mapCol.classList.add('burning');
        } else {
            mapCol.classList.remove('burning');
        }
    });

    function createSpiralFootprint(radius, angle) {
        // Polar to Cartesian coordinates
        // x = r * cos(theta), y = r * sin(theta)
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Rotation: Tangent to the circle + 90deg for the foot icon
        // The angle of movement is roughly the current angle + 90 degrees (tangential)
        const rotation = (angle * 180 / Math.PI) + 90;

        // Offset for left/right foot staggerting
        const footOffset = 8;
        // Perpendicular vector to the tangent is just the radial vector
        const offsetX = Math.cos(angle) * (isLeftFoot ? -footOffset : footOffset);
        const offsetY = Math.sin(angle) * (isLeftFoot ? -footOffset : footOffset);

        const print = document.createElement('div');
        print.classList.add('spiral-print');
        
        // Scale container coordinates to percentages or pixels?
        // Our SVG viewbox is 500x500. We assume the container matches.
        // We need to handle responsive scaling if the container isn't 500px.
        // Easiest is to set style as percentages:
        
        print.style.left = ((x + offsetX) / 500 * 100) + '%';
        print.style.top = ((y + offsetY) / 500 * 100) + '%';
        print.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        
        // Color variation based on depth (radius)
        if(radius < 100) {
            print.style.background = "#5c4d3c"; // Darker as they go deeper
        }

        footprintContainer.appendChild(print);
        isLeftFoot = !isLeftFoot;
        
        // Clean up old footprints to prevent DOM bloat (maintain a trail of ~40)
        const allPrints = document.querySelectorAll('.spiral-print');
        if (allPrints.length > 40) {
            allPrints[0].remove();
        }
    }
});