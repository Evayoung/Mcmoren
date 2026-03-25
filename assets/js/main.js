/**
 * main.js — Entry point. Imports and initialises all modules.
 * Mcmoren Multiservices Limited
 */

import nav from './nav.js';
import animations from './animations.js';
import form from './form.js';

// Accordion (FAQ) — inline IIFE, no separate module needed for brevity
const accordion = (() => {
  function init() {
    const items = document.querySelectorAll('.accordion__item');
    items.forEach((item) => {
      const trigger = item.querySelector('.accordion__trigger');
      const body    = item.querySelector('.accordion__body');
      if (!trigger || !body) return;

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('accordion__item--open');

        // Close all others
        items.forEach((i) => {
          i.classList.remove('accordion__item--open');
          const b = i.querySelector('.accordion__body');
          if (b) b.style.maxHeight = '0';
          const t = i.querySelector('.accordion__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        // Open clicked (unless it was already open)
        if (!isOpen) {
          item.classList.add('accordion__item--open');
          body.style.maxHeight = body.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
  return { init };
})();

// Page loader skipped on return visits
const loader = (() => {
  function init() {
    const loaderEl = document.querySelector('.page-loader');
    if (!loaderEl) return;

    const key = 'mcmoren_loaded';
    if (sessionStorage.getItem(key)) {
      loaderEl.style.display = 'none';
    } else {
      sessionStorage.setItem(key, '1');
      // Loader auto-fades via CSS animation — nothing else needed
    }
  }
  return { init };
})();

// Initialise all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loader.init();
  nav.init();
  animations.init();
  form.init();
  accordion.init();
});
