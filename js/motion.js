document.addEventListener("DOMContentLoaded", () => {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // =========================================
    // HERO ENTRANCE
    // =========================================
    const heroTimeline = gsap.timeline();

    // Text Reveal Stagger
    // Targets direct children of .reveal-text (the text nodes)
    // We animate from y: 100% to y: 0% inside the overflow:hidden wrapper
    const revealElements = document.querySelectorAll(".hero-content .reveal-text > *");
    
    heroTimeline
        .from(revealElements, {
            y: "110%",
            autoAlpha: 0, 
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out"
        })
        .from(".hero-visual", {
            opacity: 0,
            x: 20,
            duration: 1.5,
            ease: "power2.out"
        }, "-=1.0"); // Start slightly before text finishes

    // Hero Visual Animation (Continuous)
    // subtle float effect for the svg
    gsap.to(".hero-visual svg", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // =========================================
    // SECTION REVEALS
    // =========================================
    gsap.utils.toArray(".section").forEach((section) => {
        // Find children to animate (exclude already animated hero elements if section is hero)
        const children = section.querySelectorAll("h2, p, .card, .btn");
        
        if(children.length > 0 && !section.classList.contains("hero-section")) {
            gsap.from(children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 30,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out"
            });
        }
    });

    // =========================================
    // NAVBAR SCROLL BEHAVIOR
    // =========================================
    const navbar = document.querySelector(".navbar");

    if(navbar) {
        ScrollTrigger.create({
            start: 50,
            onUpdate: (self) => {
                if (self.scroll() > 50) {
                    navbar.classList.add("scrolled");
                } else {
                    navbar.classList.remove("scrolled");
                }
            }
        });
    }

    // =========================================
    // CARD HOVER (Additional JS Polish)
    // =========================================
    // Although mostly CSS, we can add a subtle scale on icon
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const icon = card.querySelector('.card-icon');
        if(icon) {
            card.addEventListener('mouseenter', () => {
                gsap.to(icon, { scale: 1.1, duration: 0.3, ease: "back.out(1.7)" });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(icon, { scale: 1, duration: 0.3, ease: "power2.out" });
            });
        }
    });
});
