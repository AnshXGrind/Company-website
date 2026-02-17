// Animated Theme Toggler (Vanilla JS)
// Switches between dark and light themes with smooth animation

class ThemeToggler {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }
  
  init() {
    // Apply saved theme
    this.applyTheme(this.currentTheme, false);
    
    // Create toggle button
    this.createToggleButton();
  }
  
  createToggleButton() {
    const toggler = document.createElement('button');
    toggler.id = 'theme-toggler';
    toggler.setAttribute('aria-label', 'Toggle theme');
    toggler.style.cssText = `
      position: fixed !important;
      bottom: 20px !important;
      right: 20px !important;
      top: auto !important;
      left: auto !important;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: var(--panel-bg);
      border: 2px solid var(--panel-border);
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    `;
    
    toggler.innerHTML = this.currentTheme === 'dark' 
      ? '<svg width="24" height="24" fill="var(--text-main)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="24" height="24" fill="var(--text-main)" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    
    toggler.addEventListener('click', () => this.toggle());
    
    toggler.addEventListener('mouseenter', () => {
      toggler.style.transform = 'scale(1.1)';
      toggler.style.boxShadow = '0 4px 20px rgba(255, 122, 45, 0.3)';
    });
    
    toggler.addEventListener('mouseleave', () => {
      toggler.style.transform = 'scale(1)';
      toggler.style.boxShadow = 'none';
    });
    
    document.body.appendChild(toggler);
  }
  
  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme, true);
    localStorage.setItem('theme', this.currentTheme);
    
    // Update button icon
    const toggler = document.getElementById('theme-toggler');
    toggler.innerHTML = this.currentTheme === 'dark'
      ? '<svg width="24" height="24" fill="var(--text-main)" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="24" height="24" fill="var(--text-main)" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  
  applyTheme(theme, animate = true) {
    const root = document.documentElement;
    
    if (animate) {
      root.style.transition = 'all 0.5s ease';
      setTimeout(() => {
        root.style.transition = '';
      }, 500);
    }
    
    if (theme === 'light') {
      root.style.setProperty('--bg', '#ffffff');
      root.style.setProperty('--text-main', '#000000');
      root.style.setProperty('--muted', '#666666');
      root.style.setProperty('--panel-bg', 'rgba(0,0,0,0.03)');
      root.style.setProperty('--panel-border', 'rgba(0,0,0,0.1)');
      root.style.setProperty('--accent', '#000000');
      root.style.setProperty('--accent-hover', '#333333');
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      root.style.setProperty('--bg', '#000000');
      root.style.setProperty('--text-main', '#ffffff');
      root.style.setProperty('--muted', '#888888');
      root.style.setProperty('--panel-bg', 'rgba(255,255,255,0.03)');
      root.style.setProperty('--panel-border', 'rgba(255,255,255,0.1)');
      root.style.setProperty('--accent', '#FFFFFF');
      root.style.setProperty('--accent-hover', '#E0E0E0');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }
  }
}

// Initialize theme toggler
document.addEventListener('DOMContentLoaded', () => {
  new ThemeToggler();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeToggler;
}
