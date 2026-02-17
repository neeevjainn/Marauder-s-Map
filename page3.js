document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NAV TOGGLE ---
    const navContainer = document.querySelector('.nav-container');
    const mainBtn = document.getElementById('main-nav-btn');

    mainBtn.addEventListener('click', () => {
        navContainer.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!navContainer.contains(e.target)) {
            navContainer.classList.remove('active');
        }
    });

    // --- 2. REVEAL ANIMATION ---
    // We observe both text blocks AND the center page markers
    const revealElements = document.querySelectorAll('.text-block, .page-marker');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // If it's a page marker, increase opacity
                if(entry.target.classList.contains('page-marker')){
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'scale(1.1)';
                }
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));

    // --- 3. INFINITE PATH LOGIC ---
    const body = document.body;
    const html = document.documentElement;
    const path = document.getElementById('walk-path');
    const footprintContainer = document.getElementById('footprint-container');
    const bgLayer = document.querySelector('.sand-layer');

    function getDocHeight() {
        return Math.max( body.scrollHeight, body.offsetHeight, 
                         html.clientHeight, html.scrollHeight, html.offsetHeight );
    }

    function resizeMap() {
        const docHeight = getDocHeight();
        bgLayer.style.height = `${docHeight}px`;
        
        // A "Shifting" Path: Irregular waves to simulate sand dunes
        let d = "M150,0 ";
        const waveHeight = 200;
        const steps = Math.ceil(docHeight / waveHeight);
        
        for(let i=0; i<steps; i++) {
            let yStart = i * waveHeight;
            let yEnd = (i+1) * waveHeight;
            
            // Randomize the "drift" slightly to look organic
            const drift = (i % 2 === 0) ? 120 : 180;
            
            d += `C ${drift},${yStart + 100} ${drift},${yEnd - 50} 150,${yEnd} `;
        }
        path.setAttribute('d', d);
    }

    setTimeout(resizeMap, 100);

    // Footprints
    let pathLength = 0;
    let accumulatedDistance = 0;
    let isLeftFoot = true;
    const stepDistance = 55; 

    function updateFootprints() {
        pathLength = path.getTotalLength();
        const scrollY = window.scrollY; 
        const docHeight = getDocHeight();
        const windowHeight = window.innerHeight;

        // Footprints appear slightly ahead of scroll center
        const progress = (scrollY + windowHeight * 0.5) / docHeight;
        const currentPathDistance = progress * pathLength;

        if (currentPathDistance > accumulatedDistance + stepDistance) {
            while (currentPathDistance > accumulatedDistance + stepDistance) {
                accumulatedDistance += stepDistance;
                placeFootprint(accumulatedDistance);
            }
        }
    }

    function placeFootprint(distance) {
        if(!pathLength) return;

        const point = path.getPointAtLength(distance);
        const nextPoint = path.getPointAtLength(distance + 5);
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI;

        const footprint = document.createElement('div');
        footprint.classList.add('static-footprint');
        
        const offsetAmount = 9;
        const rad = angle * (Math.PI / 180);
        const offsetX = Math.cos(rad + Math.PI/2) * (isLeftFoot ? -offsetAmount : offsetAmount);
        const offsetY = Math.sin(rad + Math.PI/2) * (isLeftFoot ? -offsetAmount : offsetAmount);

        footprint.style.left = `${point.x + offsetX}px`;
        footprint.style.top = `${point.y + offsetY}px`;
        footprint.style.transform = `rotate(${angle + 90}deg)`;

        footprintContainer.appendChild(footprint);
        isLeftFoot = !isLeftFoot;
    }

    window.addEventListener('scroll', updateFootprints);
    window.addEventListener('resize', () => {
        resizeMap();
        pathLength = path.getTotalLength();
    });
});