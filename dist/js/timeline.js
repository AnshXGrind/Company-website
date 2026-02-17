// Timeline Component (Vanilla JS)
// Creates a beautiful vertical timeline with content sections

class Timeline {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.init();
  }
  
  init() {
    this.container.innerHTML = '';
    this.container.style.cssText = `
      position: relative;
      max-width: 1100px;
      margin: 0 auto;
      padding: 60px 20px;
    `;
    
    // Timeline line
    const line = document.createElement('div');
    line.className = 'timeline-line';
    line.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 2px;
      height: 100%;
      background: linear-gradient(to bottom, transparent, var(--lavender), transparent);
      z-index: 0;
    `;
    this.container.appendChild(line);
    
    // Timeline items
    this.data.forEach((item, index) => {
      const itemEl = this.createTimelineItem(item, index);
      this.container.appendChild(itemEl);
    });
    
    this.addStyles();
  }
  
  createTimelineItem(item, index) {
    const isLeft = index % 2 === 0;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'timeline-item reveal-up';
    wrapper.style.cssText = `
      position: relative;
      margin-bottom: 80px;
      display: flex;
      justify-content: ${isLeft ? 'flex-start' : 'flex-end'};
      align-items: center;
    `;
    
    // Dot
    const dot = document.createElement('div');
    dot.className = 'timeline-dot';
    dot.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--tangerine), var(--bubblegum));
      box-shadow: 0 0 20px rgba(255, 122, 45, 0.5);
      z-index: 2;
      border: 4px solid var(--bg);
    `;
    
    // Content
    const content = document.createElement('div');
    content.className = 'timeline-content';
    content.style.cssText = `
      width: 45%;
      background: var(--panel-bg);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      padding: 32px;
      backdrop-filter: blur(12px);
      transition: all 0.3s ease;
    `;
    
    content.innerHTML = `
      <div style="font-size: 28px; font-weight: 700; background: linear-gradient(135deg, var(--tangerine), var(--bubblegum)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px;">
        ${item.title}
      </div>
      <div style="color: var(--muted); line-height: 1.7; font-size: 15px;">
        ${item.content}
      </div>
    `;
    
    wrapper.appendChild(dot);
    wrapper.appendChild(content);
    
    return wrapper;
  }
  
  addStyles() {
    if (!document.getElementById('timeline-styles')) {
      const style = document.createElement('style');
      style.id = 'timeline-styles';
      style.textContent = `
        .timeline-content:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        @media (max-width: 768px) {
          .timeline-line {
            left: 20px !important;
          }
          .timeline-item {
            justify-content: flex-start !important;
            padding-left: 50px;
          }
          .timeline-dot {
            left: 20px !important;
          }
          .timeline-content {
            width: 100% !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
  const timelineContainer = document.querySelector('[data-timeline]');
  if (timelineContainer && window.timelineData) {
    new Timeline(timelineContainer, window.timelineData);
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Timeline;
}
