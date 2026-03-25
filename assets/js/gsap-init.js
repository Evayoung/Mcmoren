/**
 * gsap-init.js — GSAP + ScrollTrigger animations
 * Mcmoren Multiservices Limited
 * Requires GSAP 3 + ScrollTrigger loaded before this module.
 */

/* -----------------------------------------------------------------------
   UTILITY — safely resolve a gsap target, returns null if not found
   ----------------------------------------------------------------------- */
function q(selector) {
  return document.querySelector(selector);
}
function qa(selector) {
  return document.querySelectorAll(selector);
}

/* -----------------------------------------------------------------------
   HERO SEQUENCE  (index.html only)
   ----------------------------------------------------------------------- */
function initHeroGSAP() {
  const heroLines   = qa('.hero-line');
  const heroSub     = q('.hero__subheadline');
  const heroCtas    = q('.hero__ctas');
  const heroBadge   = q('.hero__badge');

  if (!heroLines.length) return; // not the home page

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Pre-set hidden state
  gsap.set([heroLines, heroSub, heroCtas, heroBadge], {
    opacity: 0,
    y: 40,
  });

  // Badge
  if (heroBadge) {
    tl.to(heroBadge, { opacity: 1, y: 0, duration: 0.6 }, 0);
  }

  // Headline lines — stagger by line
  tl.to(heroLines, {
    opacity: 1,
    y: 0,
    duration: 1.4,
    stagger: 0.18,
    ease: 'expo.out',
  }, 0.25);

  // Subtext
  if (heroSub) {
    tl.to(heroSub, { opacity: 1, y: 0, duration: 0.9 }, '-=0.35');
  }

  // CTA buttons
  if (heroCtas) {
    tl.to(heroCtas, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
  }
}

/* -----------------------------------------------------------------------
   SECTION SCROLL REVEALS  (all pages)
   ----------------------------------------------------------------------- */
function initSectionReveals() {
  // Generic .reveal elements — use ScrollTrigger instead of IntersectionObserver
  qa('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50, filter: 'blur(8px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power4.out',
        delay: el.dataset.delay ? parseInt(el.dataset.delay, 10) / 1000 : 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Left reveals
  qa('.reveal--left').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: -60, filter: 'blur(8px)' },
      {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });

  // Right reveals
  qa('.reveal--right').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, x: 60, filter: 'blur(8px)' },
      {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* -----------------------------------------------------------------------
   SERVICE CARD STAGGER  (services.html)
   ----------------------------------------------------------------------- */
function initServiceCards() {
  const sections = qa('.services-category');
  sections.forEach((section) => {
    const cards = section.querySelectorAll('.card--service');
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* -----------------------------------------------------------------------
   TEAM CARD STAGGER  (teams.html)
   ----------------------------------------------------------------------- */
function initTeamCards() {
  const grid = q('.team-grid');
  if (!grid) return;

  // Cards are injected by JS so use a MutationObserver trigger
  const obs = new MutationObserver(() => {
    const cards = grid.querySelectorAll('.team-card');
    if (!cards.length) return;
    obs.disconnect();

    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
  obs.observe(grid, { childList: true });

  // Also trigger immediately in case cards already exist
  const existing = grid.querySelectorAll('.team-card');
  if (existing.length) {
    obs.disconnect();
    gsap.fromTo(
      existing,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2,
      }
    );
  }
}

/* -----------------------------------------------------------------------
   TRICE VALUES STAGGER  (about.html)
   ----------------------------------------------------------------------- */
function initTriceCards() {
  const cards = qa('.trice-card');
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.75,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: q('.trice-grid'),
        start: 'top 84%',
        toggleActions: 'play none none none',
      },
    }
  );

  // Hover emphasis
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, boxShadow: '0 20px 50px rgba(10,37,64,0.14)', duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, boxShadow: '0 12px 32px rgba(10,37,64,0.08)', duration: 0.35, ease: 'power2.inOut' });
    });
  });
}

/* -----------------------------------------------------------------------
   MEDIA THUMBNAILS STAGGER  (media.html)
   ----------------------------------------------------------------------- */
function initMediaCards() {
  const categories = qa('.media-category');
  categories.forEach((cat) => {
    const cards = cat.querySelectorAll('.media-card');
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.94 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cat,
          start: 'top 86%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

/* -----------------------------------------------------------------------
   INIT — dispatched after DOM ready
   ----------------------------------------------------------------------- */
export function initGSAP() {
  // Register ScrollTrigger plugin
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initHeroGSAP();
  initSectionReveals();
  initServiceCards();
  initTeamCards();
  initTriceCards();
  initMediaCards();
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initGSAP);
