/**
 * Optimized Spline 3D Scene Loader
 * - Lazy loads only when in viewport
 * - Respects reduced motion preferences
 * - Skips on mobile (<768px)
 * - Uses dynamic import for performance
 */

(function initSplineLoader() {
  const CONTAINER_ID = 'spline-container';
  const SCENE_URL = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'; // Replace with your scene URL
  
  // Configuration
  const CONFIG = {
    mobileBreakpoint: 768,
    lazyLoadThreshold: 0.1, // Load when 10% visible
  };

  function shouldLoadSpline() {
    // 1. Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('Spline: Skipped due to reduced motion preference');
      return false;
    }

    // 2. Check screen width
    if (window.innerWidth < CONFIG.mobileBreakpoint) {
      console.log('Spline: Skipped on mobile');
      return false;
    }

    return true;
  }

  function loadSplineViewer() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector('script[src*="spline-viewer"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js';
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function injectSplineScene() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    // Create the viewer element
    // We use innerHTML to insert the custom element which might not be upgraded yet
    // but the script tag will upgrade it once loaded.
    const viewerHtml = `
      <spline-viewer 
        url="${SCENE_URL}"
        loading-anim-type="spinner-small-light"
        width="100%" 
        height="100%"
        class="spline-canvas">
      </spline-viewer>
    `;
    
    // Load script first, then inject HTML to ensure custom element is registered or ready
    // We use a container that sits *above* the fallback but *below* the content
    // The fallback is a separate element in HTML, so we don't need to overwrite it here.
    // However, if we put the <spline-viewer> inside #spline-container, we should clear it if it had placeholder content.
    
    loadSplineViewer().then(() => {
        container.innerHTML = viewerHtml;
        // Fade in smoothly using Tailwind classes
        container.classList.remove('opacity-0');
        container.classList.add('opacity-100'); 
        console.log('Spline: Scene injected');
    }).catch(err => {
      console.error('Spline: Failed to load viewer script', err);
    });
  }

  function initObserver() {
    const container = document.getElementById(CONTAINER_ID);
    if (!container) return;

    // cleanup existing observer if any
    if (window.splineObserver) {
      window.splineObserver.disconnect();
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is in viewport (or close to it)
          if (shouldLoadSpline()) {
            // Defer slightly to prioritize main thread for other critical render tasks
            // using requestIdleCallback if available, or setTimeout
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => injectSplineScene());
            } else {
              setTimeout(injectSplineScene, 200);
            }
          }
          // Stop observing once triggered
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading slightly before it comes into view
      threshold: CONFIG.lazyLoadThreshold
    });

    observer.observe(container);
    window.splineObserver = observer;
  }

  // Clean up on page unload/visibility change if needed (optional optimization)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // Pause resource usage if feasible (spline viewer might handle this internaly)
    }
  });

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }

})();
