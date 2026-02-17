// Border Beam Animation Component (Vanilla JS)
// Creates an animated beam that travels around element borders

class BorderBeam {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      duration: options.duration || 8,
      size: options.size || 100,
      color: options.color || 'linear-gradient(135deg, var(--tangerine), var(--bubblegum), var(--lavender))',
      delay: options.delay || 0
    };
    
    this.init();
  }
  
  init() {
    // Ensure element has relative positioning
    const position = window.getComputedStyle(this.element).position;
    if (position === 'static') {
      this.element.style.position = 'relative';
    }
    
    // Ensure overflow hidden
    this.element.style.overflow = 'hidden';
    
    // Create beam element
    this.beam = document.createElement('div');
    this.beam.className = 'border-beam';
    this.beam.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: ${this.options.size}px;
      height: 2px;
      background: ${this.options.color};
      box-shadow: 0 0 20px rgba(255, 122, 45, 0.8), 0 0 40px rgba(255, 111, 163, 0.6);
      border-radius: 2px;
      animation: borderBeamAnimation ${this.options.duration}s linear infinite;
      animation-delay: ${this.options.delay}s;
      z-index: 10;
      pointer-events: none;
    `;
    
    this.element.appendChild(this.beam);
    this.addKeyframes();
  }
  
  addKeyframes() {
    if (!document.getElementById('border-beam-keyframes')) {
      const style = document.createElement('style');
      style.id = 'border-beam-keyframes';
      style.textContent = `
        @keyframes borderBeamAnimation {
          0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          25% {
            transform: translate(calc(100vw - 100px), 0) rotate(0deg);
          }
          26% {
            transform: translate(calc(100vw - 100px), 0) rotate(90deg);
          }
          50% {
            transform: translate(calc(100vw - 100px), calc(100vh - 100px)) rotate(90deg);
          }
          51% {
            transform: translate(calc(100vw - 100px), calc(100vh - 100px)) rotate(180deg);
          }
          75% {
            transform: translate(0, calc(100vh - 100px)) rotate(180deg);
          }
          76% {
            transform: translate(0, calc(100vh - 100px)) rotate(270deg);
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) rotate(270deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  destroy() {
    if (this.beam && this.beam.parentNode) {
      this.beam.parentNode.removeChild(this.beam);
    }
  }
}

// Auto-initialize on elements with data-border-beam attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-border-beam]').forEach((el, index) => {
    const duration = el.dataset.beamDuration || 8;
    const size = el.dataset.beamSize || 100;
    const delay = index * 0.5; // Stagger animations
    new BorderBeam(el, { duration: parseInt(duration), size: parseInt(size), delay });
  });
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BorderBeam;
}
