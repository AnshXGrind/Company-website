// Auth Modal Handler - Signup/Login functionality

class AuthModal {
  constructor() {
    this.modal = document.getElementById('auth-modal');
    this.closeBtn = document.getElementById('auth-close');
    this.tabs = document.querySelectorAll('.auth-tab');
    this.signupForm = document.getElementById('signup-form');
    this.loginForm = document.getElementById('login-form');

    if (!this.modal) return;

    this.init();
  }

  init() {
    // Close button
    this.closeBtn?.addEventListener('click', () => this.close());

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });

    // Form submissions
    this.signupForm?.addEventListener('submit', (e) => this.handleSignup(e));
    this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));

    // Social button handlers
    document.querySelectorAll('.social-btn').forEach(btn => {
      btn.addEventListener('click', () => this.handleSocialAuth(btn.dataset.provider));
    });

    // Trigger buttons (add data-auth="open" to any element)
    document.querySelectorAll('[data-auth="open"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });
  }

  open(tab = 'signup') {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.switchTab(tab);
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  switchTab(tabName) {
    // Update tab buttons
    this.tabs.forEach(tab => {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Show/hide forms
    if (tabName === 'signup') {
      this.signupForm.style.display = 'flex';
      this.loginForm.style.display = 'none';
    } else {
      this.signupForm.style.display = 'none';
      this.loginForm.style.display = 'flex';
    }
  }

  handleSignup(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'Creating Account...';
    }

    const data = {
      firstname: document.getElementById('firstname')?.value,
      lastname: document.getElementById('lastname')?.value,
      email: document.getElementById('signup-email')?.value,
      password: document.getElementById('signup-password')?.value
    };

    console.log('Signup data:', data);

    // Simulate API call
    setTimeout(() => {
      alert('Account created successfully! (Demo - no backend connected)');
      this.close();
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Sign Up';
      }
      e.target.reset();
    }, 1000);
  }

  handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) {
      if (btn.disabled) return;
      btn.disabled = true;
      btn.textContent = 'Logging in...';
    }

    const data = {
      email: document.getElementById('login-email')?.value,
      password: document.getElementById('login-password')?.value
    };

    console.log('Login data:', data);

    // Simulate API
    setTimeout(() => {
      alert('Login successful! (Demo - no backend connected)');
      this.close();
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Log In';
      }
      e.target.reset();
    }, 1000);
  }

  handleSocialAuth(provider) {
    console.log('Social auth with:', provider);
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} authentication (Demo - not connected)`);

    // Here you would normally redirect to OAuth flow
    // Example: window.location.href = `/api/auth/${provider}`
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new AuthModal());
} else {
  new AuthModal();
}
