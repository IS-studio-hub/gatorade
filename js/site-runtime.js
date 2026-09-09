/**
 * Site runtime: breakpoints, a11y helpers, soft content deterrents.
 *
 * IMPORTANT: Browser-delivered HTML/CSS/JS cannot be made uncopyable.
 * View Source, DevTools, and network tabs always expose assets.
 * This file only:
 *  - marks mobile / tablet / desktop tiers
 *  - improves keyboard / reduced-motion behavior
 *  - deters casual image drag/save (not real DRM)
 * Aggressive anti-copy (block select, right-click, DevTools) breaks WCAG AA
 * and is intentionally omitted.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var MQ_MOBILE = '(max-width: 768px)';
  var MQ_TABLET = '(min-width: 769px) and (max-width: 1280px)';
  var MQ_DESKTOP = '(min-width: 1281px)';
  var MQ_REDUCED = '(prefers-reduced-motion: reduce)';

  function applyBreakpoint() {
    var mobile = false;
    var tablet = false;
    var desktop = false;
    try {
      mobile = window.matchMedia(MQ_MOBILE).matches;
      tablet = window.matchMedia(MQ_TABLET).matches;
      desktop = window.matchMedia(MQ_DESKTOP).matches;
    } catch (e) {
      desktop = window.innerWidth >= 1281;
      tablet = !desktop && window.innerWidth >= 769;
      mobile = !desktop && !tablet;
    }

    root.classList.toggle('is-mobile', mobile);
    root.classList.toggle('is-tablet', tablet);
    root.classList.toggle('is-desktop', desktop);
    root.dataset.breakpoint = mobile ? 'mobile' : tablet ? 'tablet' : 'desktop';

    // Keep legacy flags used by existing scripts
    if (typeof window.isMobile !== 'undefined') window.isMobile = mobile;
    if (typeof window.isPad !== 'undefined') window.isPad = tablet;
  }

  function applyReducedMotion() {
    var reduced = false;
    try {
      reduced = window.matchMedia(MQ_REDUCED).matches;
    } catch (e) {}
    root.classList.toggle('prefers-reduced-motion', reduced);
    if (reduced && window.Lenis) {
      try {
        // Soft-disable smooth scroll helpers if present
        root.classList.remove('lenis-smooth');
      } catch (e) {}
    }
  }

  function enhanceSkipLink() {
    var skip = document.getElementById('skip-to-content');
    if (!skip) return;
    skip.classList.add('skip-link');
    skip.setAttribute('href', '#skip-to-start');
    if (!skip.textContent.trim()) {
      skip.textContent = 'Skip to main content';
    }
    skip.removeAttribute('title');
  }

  function enhanceMenuToggle() {
    var btn = document.querySelector('.js-menu-toggle, .menu-trigger');
    if (!btn) return;
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', 'Open menu');
    }
    if (!btn.getAttribute('aria-expanded')) {
      btn.setAttribute('aria-expanded', 'false');
    }
    var observer = new MutationObserver(function () {
      var open = document.body.getAttribute('data-menu-active') === 'true';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-menu-active'] });
  }

  function softMediaGuard() {
    // Soft deterrent only — does not block View Source or DevTools
    document.addEventListener('dragstart', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'IMG' || t.closest && t.closest('svg.media-holder__item'))) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('contextmenu', function (e) {
      var t = e.target;
      if (t && (t.tagName === 'IMG' || t.tagName === 'CANVAS' || (t.closest && t.closest('canvas, .three-hero, #hero3d, #storeMap iframe')))) {
        e.preventDefault();
      }
    });
  }

  function copyrightNotice() {
    try {
      if (window.console && console.info) {
        console.info('%cGatorade site — © content. Source is delivered to the browser and cannot be fully locked.', 'color:#1468a2;font-weight:bold;');
      }
    } catch (e) {}
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  applyBreakpoint();
  applyReducedMotion();
  window.addEventListener('resize', applyBreakpoint, { passive: true });

  try {
    window.matchMedia(MQ_MOBILE).addEventListener('change', applyBreakpoint);
    window.matchMedia(MQ_TABLET).addEventListener('change', applyBreakpoint);
    window.matchMedia(MQ_REDUCED).addEventListener('change', applyReducedMotion);
  } catch (e) {}

  onReady(function () {
    enhanceSkipLink();
    enhanceMenuToggle();
    softMediaGuard();
    copyrightNotice();
  });
})();
