/**
 * utils.js — Shared helpers
 * Mcmoren Multiservices Limited
 */

/**
 * Throttle a function to run at most once per `limit` ms
 * @param {Function} fn
 * @param {number} limit - ms
 */
export function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Debounce a function to only fire after `delay` ms of silence
 * @param {Function} fn
 * @param {number} delay - ms
 */
export function debounce(fn, delay = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Return scroll progress as a value 0–100
 */
export function getScrollPercent() {
  const el = document.documentElement;
  const scrollTop = el.scrollTop || document.body.scrollTop;
  const scrollHeight = el.scrollHeight - el.clientHeight;
  return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
}

/**
 * Check if an element is in the viewport
 * @param {Element} el
 * @param {number} offset - px offset from bottom of viewport
 */
export function isInViewport(el, offset = 0) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.top <= window.innerHeight - offset && rect.bottom >= 0;
}

/**
 * Ease-out cubic function for counter animation
 * @param {number} t - 0 to 1
 */
export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
