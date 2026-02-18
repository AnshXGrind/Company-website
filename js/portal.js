/**
 * Portal Logic (MVP Mock)
 * Handles simulated authentication and data display.
 */

const Portal = {
    // Mock Data
    project: {
        name: "MetricFlow AI Integration",
        status: "Development",
        progress: 65,
        nextMilestone: "User Acceptance Testing (UAT)",
        dueDate: "March 15, 2026"
    },

    init: function () {
        this.checkAuth();
        this.setupLogout();

        // Only render dashboard data if we are ON the dashboard
        if (window.location.pathname.includes('dashboard')) {
            this.renderDashboard();
        }
    },

    checkAuth: function () {
        // Simple mock auth check
        const isAuth = localStorage.getItem('launcify_auth');
        const path = window.location.pathname;

        if (!isAuth && !path.includes('login.html')) {
            window.location.href = '/portal/login.html';
        } else if (isAuth && path.includes('login.html')) {
            window.location.href = '/portal/dashboard.html';
        }
    },

    login: function (email) {
        // Simulate login
        if (email) {
            localStorage.setItem('launcify_auth', 'true');
            localStorage.setItem('launcify_user', email);
            window.location.href = '/portal/dashboard.html';
        }
    },

    logout: function () {
        localStorage.removeItem('launcify_auth');
        window.location.href = '/portal/login.html';
    },

    setupLogout: function () {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // Login form handler
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                this.login(email);
            });
        }
    },

    renderDashboard: function () {
        // Inject mock data into DOM
        try {
            document.getElementById('proj-status').textContent = this.project.status;
            document.getElementById('proj-next').textContent = this.project.nextMilestone;
            document.getElementById('proj-date').textContent = this.project.dueDate;
            document.getElementById('user-email').textContent = localStorage.getItem('launcify_user') || 'Client';

            // Progress bar
            const bar = document.getElementById('progress-bar');
            if (bar) bar.style.width = this.project.progress + '%';
        } catch (e) {
            console.log("Not on dashboard or missing elements");
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Portal.init();
});
