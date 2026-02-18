document.addEventListener('DOMContentLoaded', async () => {
    // Determine path prefix based on current location depth
    const pathDepth = window.location.pathname.split('/').filter(p => p).length;
    const isPagesDir = window.location.pathname.includes('/pages/');
    const basePath = isPagesDir ? '../' : './';
    
    // Function to load HTML components
    async function loadComponent(id, file) {
        const element = document.getElementById(id);
        if (!element) return;
        
        try {
            // Adjust path for fetch based on current location
            // If we are in /pages/, we need likely just /components/ if served from root
            // But if strictly relative file system opening, this might trick us.
            // Assuming served from root (localhost:3000), absolute paths /components/ work best.
            const response = await fetch('/components/' + file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            const html = await response.text();
            element.innerHTML = html;
            
            // Re-initialize specific scripts or listeners if needed
            if (id === 'navbar-container') initNavbar();
        } catch (error) {
            console.error(error);
        }
    }

    await Promise.all([
        loadComponent('navbar-container', 'navbar.html'),
        loadComponent('footer-container', 'footer.html')
    ]);

    function initNavbar() {
        // Highlight active link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });

        // Mobile Menu Toggle
        const toggle = document.querySelector('.nav-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('is-active');
                const isExpanded = menu.classList.contains('is-active');
                toggle.setAttribute('aria-expanded', isExpanded);
            });
        }
    }
});
