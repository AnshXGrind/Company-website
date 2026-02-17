/**
 * spline-loader.js
 * Lazy-loads a Spline 3D scene as a hero background element.
 *
 * Guarantees:
 *  - Zero render-blocking: deferred IIFE, runs after DOMContentLoaded
 *  - IntersectionObserver: only loads when #spline-container enters viewport
 *  - Skips entirely on mobile (<768px) and prefers-reduced-motion
 *  - requestIdleCallback: yields to main thread before injecting the module script
 *  - Smooth CSS fade-in via `.spline-loaded` class after scene is ready
 *  - Cleans up observer on trigger to prevent memory leaks
 */
(function () {
  'use strict';
  var CONTAINER_ID = 'spline-container';
  var SCENE_URL    = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';
  var VIEWER_SRC   = 'https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js';

  /* ---- Guards ---- */
  function shouldSkip() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    if (window.innerWidth < 768) return true;
    return false;
  }

  /* ---- Build the <spline-viewer> element ---- */
  function buildElement(container) {
    if (container.querySelector('spline-viewer')) return;

    var viewer = document.createElement('spline-viewer');
    viewer.setAttribute('url', SCENE_URL);
    viewer.setAttribute('loading-anim-type', 'none');
    viewer.setAttribute('aria-hidden', 'true');
    viewer.style.cssText = 'width:100%;height:100%;display:block;pointer-events:none;';

    function reveal() {
      container.classList.add('spline-loaded');
    }
    viewer.addEventListener('load', reveal, { once: true });
    var fallbackTimer = setTimeout(reveal, 5000);
    viewer.addEventListener('load', function () { clearTimeout(fallbackTimer); }, { once: true });

    container.appendChild(viewer);
  }

  /* ---- Inject the viewer module script, then build element ---- */
  function injectViewer(container) {
    var existing = document.querySelector('script[data-spline-viewer]');
    if (existing) {
      buildElement(container);
      return;
    }
    var script = document.createElement('script');
    script.type = 'module';
    script.src = VIEWER_SRC;
    script.setAttribute('data-spline-viewer', '1');
    script.onload = function () { buildElement(container); };
    script.onerror = function () {
      console.warn('[spline-loader] Viewer failed to load — fallback gradient shown.');
    };
    document.head.appendChild(script);
  }

  /* ---- Init: observe container, load only when visible ---- */
  function init() {
    var container = document.getElementById(CONTAINER_ID);
    if (!container || shouldSkip()) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if ('requestIdleCallback' in window) {
          requestIdleCallback(function () { injectViewer(container); }, { timeout: 2000 });
        } else {
          setTimeout(function () { injectViewer(container); }, 150);
        }
      });
    }, {
      rootMargin: '0px 0px 200px 0px',
      threshold: 0
    });

    observer.observe(container);
  }

  /* ---- Entry point ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

})();
