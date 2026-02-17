// Flip Words Animation Component (Vanilla JS)
// Animates through an array of words with smooth transitions

class FlipWords {
  constructor(element, words, options = {}) {
    this.element = element;
    this.words = words;
    this.currentIndex = 0;
    this.options = {
      interval: options.interval || 3000,
      className: options.className || 'flip-word'
    };
    
    this.init();
  }
  
  init() {
    this.element.style.position = 'relative';
    this.element.style.display = 'inline-block';
    this.element.style.minWidth = '150px';
    this.element.style.textAlign = 'center';
    
    this.wordElement = document.createElement('span');
    this.wordElement.className = this.options.className;
    this.wordElement.textContent = this.words[0];
    this.wordElement.style.cssText = `
      display: inline-block;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    this.element.appendChild(this.wordElement);
    
    // Add keyframes for flip animation
    this.addKeyframes();
    
    // Start animation
    setInterval(() => this.flip(), this.options.interval);
  }
  
  flip() {
    this.wordElement.style.transform = 'rotateX(90deg)';
    this.wordElement.style.opacity = '0';
    
    setTimeout(() => {
      this.currentIndex = (this.currentIndex + 1) % this.words.length;
      this.wordElement.textContent = this.words[this.currentIndex];
      this.wordElement.style.transform = 'rotateX(0deg)';
      this.wordElement.style.opacity = '1';
    }, 250);
  }
  
  addKeyframes() {
    if (!document.getElementById('flip-words-styles')) {
      const style = document.createElement('style');
      style.id = 'flip-words-styles';
      style.textContent = `
        .flip-word {
          font-weight: 700;
          color: var(--accent);
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-flip-words]').forEach(el => {
    const words = el.dataset.flipWords.split(',');
    new FlipWords(el, words);
  });
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlipWords;
}
