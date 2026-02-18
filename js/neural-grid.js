document.addEventListener("DOMContentLoaded", () => {
    if (window.innerWidth < 768) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = document.getElementById("neural-grid");
    if (!svg) return;

    // Fade in the grid
    setTimeout(() => {
        svg.style.opacity = "1";
    }, 500);

    const linesGroup = svg.querySelector(".lines");
    const nodesGroup = svg.querySelector(".nodes");

    const width = 1200;
    const height = 600;

    const nodes = [];
    const nodeCount = 12; // Reduced count for subtlety
    const maxDistance = 200;

    // Initialize Nodes
    for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        // Velocity (very slow)
        const vx = (Math.random() - 0.5) * 0.2;
        const vy = (Math.random() - 0.5) * 0.2;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", 2); // Smaller radius
        circle.setAttribute("fill", "#4F8CFF");
        circle.setAttribute("opacity", "0.4"); // Very low opacity nodes

        nodesGroup.appendChild(circle);

        nodes.push({ x, y, vx, vy, circle });
    }

    function animate() {
        // Clear lines
        while (linesGroup.firstChild) {
            linesGroup.removeChild(linesGroup.firstChild);
        }

        // Update Nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;

            node.circle.setAttribute("cx", node.x);
            node.circle.setAttribute("cy", node.y);
        });

        // Draw Lines
        nodes.forEach((nodeA, i) => {
            nodes.forEach((nodeB, j) => {
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

                    // Opacity based on distance, max 0.1 (Requested 10%)
                    const opacity = (1 - distance / maxDistance) * 0.1;
                    line.setAttribute("opacity", opacity);

                    linesGroup.appendChild(line);
                }
            });
        });

        requestAnimationFrame(animate);
    }

    animate();
});
