/**
 * include.js — Static component injection for Launcify
 * Fetches /components/navbar.html and /components/footer.html
 * and injects them into #navbar-container and #footer-container.
 * Runs before DOMContentLoaded is complete; deferred via <script defer>.
 */
(function () {
    'use strict';

    async function loadComponent(id, url) {
        const el = document.getElementById(id);
        if (!el) return;
        try {
            const res = await fetch(url);
            if (!res.ok) { console.error('[include.js] Failed to load', url, res.status); return; }
            el.outerHTML = await res.text();
        } catch (e) {
            console.error('[include.js] Network error loading', url, e);
        }
    }

    function highlightActiveLink() {
        const path = window.location.pathname;
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href') || '';
            // Exact match or path prefix match for sub-pages
            if (href === path || (href !== '/' && path.startsWith(href))) {
                link.classList.add('active');
            }
        });
    }

    function initMobileMenu() {
        const toggle = document.querySelector('.nav-toggle');
        const menu   = document.querySelector('.nav-menu');
        if (!toggle || !menu) return;
        toggle.addEventListener('click', () => {
            const open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', String(open));
        });
    }

    function initScrolledNavbar() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // run once on load
    }

    document.addEventListener('DOMContentLoaded', async () => {
        await Promise.all([
            loadComponent('navbar-container', '/components/navbar.html'),
            loadComponent('footer-container', '/components/footer.html'),
        ]);
        highlightActiveLink();
        initMobileMenu();
        initScrolledNavbar();
    });
}());
