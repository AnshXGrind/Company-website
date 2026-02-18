/**
 * Motion System (Enterprise)
 * - IntersectionObserver for reveal animations
 * - Navbar scroll behavior
 * - Button hover effects (if JS needed, mostly CSS)
 */

document.addEventListener('DOMContentLoaded', () => {
    initMotion();
    initNavbar();
});

/* =========================================
   1. Motion Reveal System
   ========================================= */
function initMotion() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Force all elements to visible immediately
        document.querySelectorAll('.reveal-text, .card, .hero-content > *').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Animate based on element type or class
                // We'll use a simple CSS class toggle for performance
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';

                // Unobserve after reveal
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const elementsToAnimate = [
        ...document.querySelectorAll('.section h2'),
        ...document.querySelectorAll('.section p'),
        ...document.querySelectorAll('.card'),
        ...document.querySelectorAll('.hero-content > *') // Stagger hero children
    ];

    elementsToAnimate.forEach((el, index) => {
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';

        // Add subtle stagger to cards or lists if they are siblings
        // This is a simple logic; for complex staggers, use data-delay
        observer.observe(el);
    });
}

/* =========================================
   2. Navbar Scroll Behavior
   ========================================= */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}
