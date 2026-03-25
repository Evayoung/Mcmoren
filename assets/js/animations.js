/**
 * animations.js — Intersection Observer reveals, counters, parallax, loader
 * Mcmoren Multiservices Limited
 */

import { throttle, easeOutCubic } from './utils.js';

const animations = (() => {
  // 1. Private variables
  const COUNTER_DURATION = 2000; // ms
  let revealObserver, counterObserver;

  // 2. DOM cache
  let revealEls, counterEls, heroCanvas, pageBanners, parallaxEls;

  function cacheDom() {
    revealEls    = document.querySelectorAll('.reveal, .reveal--left, .reveal--right');
    counterEls   = document.querySelectorAll('.stat-counter[data-target]');
    heroCanvas   = document.getElementById('hero-canvas');
    pageBanners  = document.querySelectorAll('.page-banner');
    parallaxEls  = document.querySelectorAll('[data-parallax]');
  }

  // 3. Bind events
  function bindEvents() {
    initRevealObserver();
    initCounterObserver();
    initParallax();
    initPageBanner();
    initHeroAnimations();
  }

  // 4. Handlers

  /* --- Scroll Reveals --- */
  function initRevealObserver() {
    // Reveal observer logic removed to avoid conflict with gsap-init.js ScrollTrigger.
    // gsap-init.js handles .reveal elements exclusively for better performance and consistency.
  }

  /* --- Animated Counters --- */
  function initCounterObserver() {
    if (!counterEls.length) return;

    counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.target);
          const suffix = el.dataset.suffix || '';
          const baseDelay = parseInt(el.dataset.delay || 0, 10);

          setTimeout(() => {
            animateCounter(el, target, suffix);
          }, baseDelay);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach((el) => counterObserver.observe(el));
  }

  function animateCounter(el, target, suffix) {
    const valueEl = el.querySelector('.stat-counter__value');
    if (!valueEl) return;

    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / COUNTER_DURATION, 1);
      const eased = easeOutCubic(progress);
      const current = eased * target;

      const formatted = isDecimal ? current.toFixed(1) : Math.round(current);
      valueEl.innerHTML = formatted + (suffix ? `<span class="stat-counter__suffix">${suffix}</span>` : '');

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  /* --- Parallax --- */
  function initParallax() {
    if (!parallaxEls.length) return;

    window.addEventListener('scroll', throttle(handleParallax, 16), { passive: true });
    handleParallax(); // initial position
  }

  function handleParallax() {
    const scrollY = window.scrollY;

    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || 0.3);
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  /* --- Page Banner entrance --- */
  function initPageBanner() {
    pageBanners.forEach((banner) => {
      // Small delay ensures CSS is applied before class toggle
      requestAnimationFrame(() => {
        setTimeout(() => {
          banner.classList.add('loaded');
        }, 100);
      });
    });
  }

  /* --- Hero section — staggered word reveal + canvas --- */
  function initHeroAnimations() {
    // Staggered headline word reveal
    const heroWords = document.querySelectorAll('.hero-word');
    heroWords.forEach((word, i) => {
      setTimeout(() => {
        word.classList.add('hero-word--visible');
      }, 200 + i * 80);
    });

    // Fade in sub-elements after headline
    const fadeEls = document.querySelectorAll('.hero-fade');
    const baseDelay = 200 + heroWords.length * 80 + 200;
    fadeEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('hero-fade--visible');
      }, baseDelay + i * 150);
    });

    // Subheadline, CTAs, pills, scroll indicator
    setTimeout(() => {
      document.querySelector('.hero__subheadline')?.classList.add('hero__subheadline--visible');
    }, baseDelay);

    setTimeout(() => {
      document.querySelector('.hero__ctas')?.classList.add('hero__ctas--visible');
    }, baseDelay + 200);

    setTimeout(() => {
      document.querySelector('.hero__service-pills')?.classList.add('hero__service-pills--visible');
      document.querySelector('.hero__scroll')?.classList.add('hero__scroll--visible');
    }, baseDelay + 400);

    // Init canvas particles
    if (heroCanvas) {
      initParticleCanvas(heroCanvas);
    }
  }

  /* --- Particle Canvas Background --- */
  function initParticleCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', throttle(resize, 200), { passive: true });
    resize();

    // Build particles
    const PARTICLE_COUNT = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.15,
        color: Math.random() > 0.6 ? '#0EA5E9' : '#5B8AC7',
      });
    }

    const CONNECTION_DIST = 130;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animFrame = requestAnimationFrame(draw);
    }

    draw();
  }

  // 5. Init
  function init() {
    cacheDom();
    bindEvents();
  }

  return { init };
})();

export default animations;
