document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth < 768) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = document.getElementById("neural-grid");
    if (!svg) return;

    const linesGroup = svg.querySelector(".lines");
    const nodesGroup = svg.querySelector(".nodes");

    // Use viewBox dimensions
    const width = 1200;
    const height = 600;

    const nodes = [];
    const nodeCount = 18;
    const maxDistance = 250;

    for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;

        nodes.push({ x, y });

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 3);
        circle.setAttribute("fill", "#4F8CFF");
        circle.setAttribute("opacity", "0.8");

        // Optional: Add class for CSS animation if needed, or keep JS pulse
        // circle.classList.add('node-pulse'); 

        nodesGroup.appendChild(circle);

        animatePulse(circle);
    }

    // Draw lines between close nodes
    nodes.forEach((nodeA, i) => {
        nodes.forEach((nodeB, j) => {
            // Avoid duplicates and self-connection
            if (i >= j) return;

            const dx = nodeA.x - nodeB.x;
            const dy = nodeA.y - nodeB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute("x1", nodeA.x);
                line.setAttribute("y1", nodeA.y);
                line.setAttribute("x2", nodeB.x);
                line.setAttribute("y2", nodeB.y);
                line.setAttribute("stroke", "#4F8CFF");
                line.setAttribute("stroke-width", "1");
                line.setAttribute("opacity", "0.15"); // Lowered opacity for subtlety

                linesGroup.appendChild(line);
            }
        });
    });

    function animatePulse(element) {
        let scale = 1;
        let growing = true;
        // Random offset for organic feel
        let step = 0.002 + Math.random() * 0.004;

        function pulse() {
            // Simple scale oscillation
            // Note: SVG transform origin is 0,0 by default. 
            // For circles, we can animate 'r' or use transform with transform-origin.
            // Simplifying to radius animation for smoother SVG behavior without transform-origin complexity.

            // Actually, the user script used setAttribute("transform", scale...). 
            // SVG scale transforms from 0,0 unless origin is set.
            // Let's strictly follow the user's requested logic but fix the origin issue if needed.
            // User provided: element.setAttribute("transform", `scale(${scale})`);
            // This will shift the circle unless we handle origin. 
            // BETTER APPROACH: Animate radius 'r' for circles.

            if (growing) {
                scale += step;
                if (scale >= 1.4) growing = false;
            } else {
                scale -= step;
                if (scale <= 1) growing = true;
            }

            // To scale a circle in place using transform, we need setTransformOrigin.
            // Or just animate 'r'. The prompt asked for "production-ready".
            // Let's use the user's logic but adapted to work (animating 'r' is safer for cx/cy positioned circles).

            const baseR = 3;
            element.setAttribute("r", baseR * scale);

            requestAnimationFrame(pulse);
        }

        pulse();
    }
});
