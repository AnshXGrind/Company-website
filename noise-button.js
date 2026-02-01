// Noise Background Button Component (Vanilla JS)
// Animated gradient button with noise texture

class NoiseButton {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      gradientColors: options.gradientColors || [
        'rgb(255, 100, 150)',
        'rgb(100, 150, 255)',
        'rgb(255, 200, 100)'
      ],
      animationSpeed: options.animationSpeed || 3,
      noiseOpacity: options.noiseOpacity || 0.15
    };
    
    this.init();
  }
  
  init() {
    // Wrap button in noise container
    const wrapper = document.createElement('div');
    wrapper.className = 'noise-button-wrapper';
    wrapper.style.cssText = `
      position: relative;
      display: inline-block;
      padding: 2px;
      border-radius: 9999px;
      overflow: hidden;
    `;
    
    // Create animated gradient background
    const gradient = document.createElement('div');
    gradient.className = 'noise-button-gradient';
    gradient.style.cssText = `
      position: absolute;
      inset: -100%;
      background: linear-gradient(45deg, ${this.options.gradientColors.join(', ')});
      animation: rotate-gradient ${this.options.animationSpeed}s linear infinite;
    `;
    
    // Create noise overlay
    const noise = document.createElement('canvas');
    noise.className = 'noise-button-noise';
    noise.width = 200;
    noise.height = 200;
    noise.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: ${this.options.noiseOpacity};
      pointer-events: none;
      mix-blend-mode: overlay;
    `;
    
    this.generateNoise(noise);
    
    // Style the button
    this.element.style.cssText = `
      position: relative;
      z-index: 10;
      display: inline-block;
      padding: 12px 24px;
      border-radius: 9999px;
      background: linear-gradient(to right, #fafafa, #f5f5f5, #ffffff);
      color: #000;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.1s;
      box-shadow: 0px 2px 0px 0px rgba(250, 250, 250, 0.5) inset, 0px 0.5px 1px 0px rgba(163, 163, 163, 1);
    `;
    
    // Add dark mode support
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.element.style.background = 'linear-gradient(to right, #000, #0a0a0a, #171717)';
      this.element.style.color = '#fff';
      this.element.style.boxShadow = '0px 1px 0px 0px rgba(3, 7, 18, 1) inset, 0px 1px 0px 0px rgba(38, 38, 38, 1)';
    }
    
    // Active state
    this.element.addEventListener('mousedown', () => {
      this.element.style.transform = 'scale(0.98)';
    });
    
    this.element.addEventListener('mouseup', () => {
      this.element.style.transform = 'scale(1)';
    });
    
    // Wrap everything
    this.element.parentNode.insertBefore(wrapper, this.element);
    wrapper.appendChild(gradient);
    wrapper.appendChild(noise);
    wrapper.appendChild(this.element);
    
    // Add keyframes
    this.addKeyframes();
  }
  
  generateNoise(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer = new Uint32Array(imageData.data.buffer);
    
    for (let i = 0; i < buffer.length; i++) {
      const gray = Math.random() * 255;
      buffer[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Animate noise
    setInterval(() => {
      for (let i = 0; i < buffer.length; i++) {
        const gray = Math.random() * 255;
        buffer[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
      }
      ctx.putImageData(imageData, 0, 0);
    }, 100);
  }
  
  addKeyframes() {
    if (!document.getElementById('noise-button-keyframes')) {
      const style = document.createElement('style');
      style.id = 'noise-button-keyframes';
      style.textContent = `
        @keyframes rotate-gradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Auto-initialize buttons with data-noise-button attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-noise-button]').forEach(button => {
    new NoiseButton(button, {
      gradientColors: button.dataset.gradientColors 
        ? button.dataset.gradientColors.split(',') 
        : undefined
    });
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NoiseButton;
}
