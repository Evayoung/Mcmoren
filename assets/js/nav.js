/**
 * nav.js — Sticky nav, mobile menu, dropdown, active link
 * Mcmoren Multiservices Limited
 */

import { throttle } from './utils.js';

const nav = (() => {
  // 1. Private variables
  const SCROLL_THRESHOLD = 60;
  let isMenuOpen = false;
  let staggerDelay = 80;

  // 2. DOM cache
  let elNav, elHamburger, elOverlay, elPanel, elBackdrop,
      elMobileLinks, elDropdownTrigger, elNavLinks;

  function cacheDom() {
    elNav            = document.querySelector('.nav');
    elHamburger      = document.querySelector('.nav__hamburger');
    elOverlay        = document.querySelector('.nav__mobile-overlay');
    elPanel          = document.querySelector('.nav__mobile-panel');
    elBackdrop       = document.querySelector('.nav__mobile-backdrop');
    elMobileLinks    = document.querySelectorAll('.nav__mobile-link, .nav__mobile-cta');
    elDropdownTrigger = document.querySelector('.nav__dropdown-trigger');
    elNavLinks       = document.querySelectorAll('.nav__link');
  }

  // 3. Bind events
  function bindEvents() {
    // Scroll → sticky nav
    window.addEventListener('scroll', throttle(handleScroll, 30), { passive: true });

    // Hamburger toggle
    if (elHamburger) {
      elHamburger.addEventListener('click', toggleMenu);
    }

    // Backdrop click → close
    if (elBackdrop) {
      elBackdrop.addEventListener('click', closeMenu);
    }

    // Escape key → close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) closeMenu();
    });

    // Mobile link clicks → close menu
    elMobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Dropdown — also open on click for touch devices
    if (elDropdownTrigger) {
      elDropdownTrigger.addEventListener('click', (e) => {
        const dropdown = elDropdownTrigger.closest('.nav__dropdown');
        if (dropdown) {
          dropdown.classList.toggle('nav__dropdown--open');
          const expanded = dropdown.classList.contains('nav__dropdown--open');
          elDropdownTrigger.setAttribute('aria-expanded', expanded.toString());
          e.preventDefault();
        }
      });

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__dropdown')) {
          document.querySelectorAll('.nav__dropdown--open').forEach(d => {
            d.classList.remove('nav__dropdown--open');
          });
        }
      });
    }
  }

  // 4. Handlers
  function handleScroll() {
    if (!elNav) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      elNav.classList.add('nav--scrolled');
    } else {
      elNav.classList.remove('nav--scrolled');
    }
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    isMenuOpen = true;
    elHamburger.classList.add('nav__hamburger--open');
    elHamburger.setAttribute('aria-expanded', 'true');
    elOverlay.classList.add('nav__mobile-overlay--open');
    document.body.style.overflow = 'hidden';

    // Staggered cascade for links
    elMobileLinks.forEach((link, i) => {
      link.style.transitionDelay = `${i * staggerDelay + 80}ms`;
    });
  }

  function closeMenu() {
    isMenuOpen = false;
    elHamburger.classList.remove('nav__hamburger--open');
    elHamburger.setAttribute('aria-expanded', 'false');
    elOverlay.classList.remove('nav__mobile-overlay--open');
    document.body.style.overflow = '';

    elMobileLinks.forEach((link) => {
      link.style.transitionDelay = '0ms';
    });
  }

  function setActiveLink() {
    const currentPath = window.location.pathname;
    elNavLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      // Normalise paths
      const linkPath = new URL(href, window.location.href).pathname;
      if (linkPath === currentPath ||
          (currentPath === '/' && href.includes('index.html')) ||
          (currentPath.endsWith('/') && href.includes('index.html'))) {
        link.classList.add('nav__link--active');
      }
    });
  }

  // 5. Init
  function init() {
    cacheDom();
    bindEvents();
    handleScroll(); // initialise scroll state on load
    setActiveLink();
  }

  return { init };
})();

export default nav;
