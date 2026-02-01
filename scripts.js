// Common scripts: mobile nav toggle and contact modal wiring
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.classList.toggle('active');
    });
  }

  // Contact modal wiring: elements with data-contact="open" open #contact-modal if present
  const modal = document.getElementById('contact-modal');
  const backdrop = document.getElementById('contact-backdrop');
  const form = document.getElementById('contact-form');
  const closeBtn = document.getElementById('contact-close');
  
  const openModal = (ev) => {
    if (!modal) return;
    try { ev.preventDefault(); } catch(e){}
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (form) form.setAttribute('aria-hidden','false');
    const nameField = document.getElementById('cf-name');
    if (nameField) nameField.focus();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    if (form) form.setAttribute('aria-hidden','true');
  };

  // Attach to contact triggers
  document.querySelectorAll('[data-contact="open"]').forEach(el => {
    el.addEventListener('click', openModal);
  });

  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  
  // Escape key to close modal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('flex')) {
      closeModal();
    }
  });

  // Contact form submission if form exists
  if (form) {
    const submitBtn = document.getElementById('cf-submit');
    const status = document.getElementById('cf-status');
    const FORM_ENDPOINT = 'https://formspree.io/f/mjgwlokv';

    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (status) status.textContent = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const fd = new FormData(form);
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: fd });
        if (res.ok) {
          if (status) status.textContent = 'Message sent — thank you.';
          if (submitBtn) submitBtn.textContent = 'Sent';
          setTimeout(() => {
            closeModal();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Contact me now';
            }
            form.reset();
            if (status) status.textContent = '';
          }, 1200);
        } else {
          if (status) status.textContent = 'Error sending message.';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Contact me now';
          }
        }
      } catch (err) {
        if (status) status.textContent = 'Network error.';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Contact me now';
        }
        console.error(err);
      }
    });
  }

  // Reveal-up observer fallback if not already present
  if (!window.__revealObserverAttached) {
    const els = document.querySelectorAll('.reveal-up');
    if (els.length) {
      const obs = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting) e.target.classList.add('active');})},{threshold:0.08});
      els.forEach(el=>obs.observe(el));
      window.__revealObserverAttached = true;
    }
  }
});
