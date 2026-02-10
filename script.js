$(document).ready(function() {
    const canvas = document.getElementById('footprintCanvas');
    const ctx = canvas.getContext('2d');
    let footprints = [];
    let lastX = 0, lastY = 0, stepCount = 0;

    // Toggle Map Open/Close
    $('.js-toggle').on('click', function() {
        $('#mapBase').toggleClass('active');
        resizeCanvas();
    });

    function resizeCanvas() {
        canvas.width = $('#mapBase').width();
        canvas.height = $('#mapBase').height();
    }

    // Interactive Footprints
    $('#mapBase').on('mousemove', function(e) {
        if (!$('#mapBase').hasClass('active')) return;

        const offset = $(this).offset();
        const mouseX = e.pageX - offset.left;
        const mouseY = e.pageY - offset.top;

        const dist = Math.hypot(mouseX - lastX, mouseY - lastY);

        if (dist > 30) {
            const angle = Math.atan2(mouseY - lastY, mouseX - lastX);
            footprints.push({
                x: mouseX,
                y: mouseY,
                angle: angle,
                opacity: 1,
                side: stepCount % 2 === 0 ? 8 : -8
            });
            lastX = mouseX;
            lastY = mouseY;
            stepCount++;
        }
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#615349';

        footprints.forEach((fp, i) => {
            ctx.save();
            ctx.translate(fp.x, fp.y);
            ctx.rotate(fp.angle + Math.PI / 2);
            ctx.globalAlpha = fp.opacity;
            
            // Draw small oval footprint
            ctx.beginPath();
            ctx.ellipse(fp.side, 0, 3, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
            fp.opacity -= 0.01;
            if (fp.opacity <= 0) footprints.splice(i, 1);
        });
        requestAnimationFrame(draw);
    }

    draw();
});