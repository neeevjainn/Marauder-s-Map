document.addEventListener('DOMContentLoaded', () => {

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

    const textBlocks = document.querySelectorAll('.text-block');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    textBlocks.forEach(block => observer.observe(block));

    const body = document.body;
    const html = document.documentElement;
    const path = document.getElementById('walk-path');
    const footprintContainer = document.getElementById('footprint-container');
    const bgLayer = document.querySelector('.ruins-layer');

    function getDocHeight() {
        return Math.max( body.scrollHeight, body.offsetHeight, 
                         html.clientHeight, html.scrollHeight, html.offsetHeight );
    }

    function resizeMap() {
        const docHeight = getDocHeight();
        bgLayer.style.height = `${docHeight}px`;
        
        let d = "M150,0 ";
        const waveHeight = 300;
        const steps = Math.ceil(docHeight / waveHeight);
        
        for(let i=0; i<steps; i++) {
            let yStart = i * waveHeight;
            let yEnd = (i+1) * waveHeight;
            
            if(i % 2 === 0) {

                d += `C 50,${yStart + 150} 50,${yEnd - 100} 150,${yEnd} `;
            } else {

                d += `C 250,${yStart + 150} 250,${yEnd - 100} 150,${yEnd} `;
            }
        }
        path.setAttribute('d', d);
    }

    setTimeout(resizeMap, 100);

    let pathLength = 0;
    let accumulatedDistance = 0;
    let isLeftFoot = true;
    const stepDistance = 50; 

    function updateFootprints() {
        pathLength = path.getTotalLength();
        const scrollY = window.scrollY; 
        const docHeight = getDocHeight();
        const windowHeight = window.innerHeight;

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
        
        const offsetAmount = 8;
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