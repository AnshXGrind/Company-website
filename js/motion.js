document.addEventListener("DOMContentLoaded", () => {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // =========================================
    // HERO ENTRANCE
    // =========================================
    const heroTimeline = gsap.timeline();

    heroTimeline
        .from(".badge", {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out"
        })
        .from(".text-hero", { // Targeting .text-hero class from index.html
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: "power3.out"
        }, "-=0.4")
        .from(".text-body", { // Targeting .text-body class from index.html
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.4")
        .from(".btn", { // Targeting .btn class from index.html (there are two in hero)
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.3");

    // =========================================
    // SECTION REVEALS
    // =========================================
    gsap.utils.toArray(".section").forEach((section) => {
        // Find children to animate (exclude already animated hero elements if section is hero)
        const children = section.querySelectorAll("h2, h3, p, .card, .btn");
        
        if(children.length > 0) {
            gsap.from(children, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 40,
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
    // SUBTLE PARALLAX FOR HERO BG
    // =========================================
    gsap.to(".hero-bg", {
        y: 40,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-section", // Corrected selector to match index.html class
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });
});
