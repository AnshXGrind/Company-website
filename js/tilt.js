/**
 * Micro 3D Tilt Interaction
 * - Applies subtle perspective tilt to elements with .tilt-card class
 * - Disabled on mobile for performance
 */

(function () {
    'use strict';

    // Settings
    const config = {
        maxTilt: 6, // degrees
        perspective: 1000,
        scale: 1.02,
        speed: 400, // ms
        easing: 'cubic-bezier(.03,.98,.52,.99)'
    };

    // Responsive Check
    if (window.matchMedia('(hover: none)').matches || window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.card, .pricing-card');

    cards.forEach(card => {
        // Init Styles
        card.style.transformStyle = 'preserve-3d';
        card.style.transition = `transform ${config.speed}ms ${config.easing}`;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -config.maxTilt; // Rotate X based on Y axis
            const rotateY = ((x - centerX) / centerX) * config.maxTilt;  // Rotate Y based on X axis

            // Apply Transform
            // We use requestAnimationFrame for smoothness if needed, 
            // but for simple tilt, direct style update is usually fine in modern browsers.
            window.requestAnimationFrame(() => {
                card.style.transform = `
                    perspective(${config.perspective}px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    scale(${config.scale})
                `;
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = `transform ${config.speed}ms ${config.easing}`;
            card.style.transform = `
                perspective(${config.perspective}px)
                rotateX(0deg)
                rotateY(0deg)
                scale(1)
            `;
        });

        // Remove transition during movement to prevent lag
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

})();
