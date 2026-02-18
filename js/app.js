// Common UI interactions (Mobile Toggle, FAQ, etc.)
document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Nav Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      // Simple toggle implementation
      const isHidden = navMenu.style.display === 'none' || window.getComputedStyle(navMenu).display === 'none';
      
      if (isHidden) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = '#0B0F14';
        navMenu.style.padding = '24px';
        navMenu.style.borderBottom = '1px solid var(--color-border)';
      } else {
        navMenu.style.display = ''; // Revert to CSS default (hidden on mobile, flex on desktop)
      }
    });
  }

  // --- FAQ Accordion (if present) ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        // Toggle active class
        const isActive = item.classList.contains('active');
        
        // Close others (optional - good for focus)
        faqItems.forEach(other => other.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

});
