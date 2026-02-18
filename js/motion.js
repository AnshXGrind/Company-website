/**
 * Launcify Motion System (Premium)
 * Handles sequential fade-ups and navbar interaction.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
});

// PHASE 7: NAVBAR
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

// PHASE 5: SECTION MOTION SYSTEM
function initScrollAnimations() {
    // Respect user preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.motion-fade-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;

                // Animation properites
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';

                // Delay logic if specified (for staggering)
                const delay = el.getAttribute('data-delay') || 0;
                if (delay) el.style.transitionDelay = `${delay}s`;

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all elements marked for animation
    // We add this class dynamically to key structural elements if they don't have it
    const targets = document.querySelectorAll('.section, .card, .motion-fade-up');
    targets.forEach(el => {
        if (!el.classList.contains('motion-fade-up')) {
            el.classList.add('motion-fade-up');
        }
        observer.observe(el);
    });

    // Stagger Hero Elements specifically
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.classList.add('motion-fade-up');
        el.style.transitionDelay = `${index * 0.1}s`; // 100ms stagger
        observer.observe(el);
    });
}
