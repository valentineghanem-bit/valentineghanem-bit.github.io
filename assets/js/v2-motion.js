// Shared v2 motion helpers -- small, reusable building blocks so each
// page's own -fx.js file stays a short list of "wire this selector to
// that effect" calls instead of re-implementing the same observer/spotlight
// boilerplate every time. Exposed as window.v2Motion.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function attachSpotlight(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  function attachMagnetic(selector) {
    if (prefersReduced || !window.gsap || !window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll(selector).forEach(function (el) {
      var xTo = gsap.quickTo(el, '--mx', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
      var yTo = gsap.quickTo(el, '--my', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.18);
        yTo((e.clientY - r.top - r.height / 2) * 0.18);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  // Stagger-reveal a NodeList once its container scrolls into view.
  // Falls back to instantly-visible if reduced-motion or no IO support.
  function revealStagger(containerSelector, itemSelector, delayMs) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    var items = container.querySelectorAll(itemSelector);
    if (!items.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      if (done || !entries[0].isIntersecting) return;
      done = true;
      items.forEach(function (el, i) {
        el.style.transitionDelay = el.style.animationDelay = (i * (delayMs || 40)) + 'ms';
        el.classList.add('is-visible');
      });
      io.disconnect();
    }, { threshold: 0.15 });
    io.observe(container);
  }

  // Reveal each element independently (not container-gated) -- for grids
  // where items enter the viewport at different scroll times.
  function revealEach(selector) {
    var items = document.querySelectorAll(selector);
    if (!items.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.2 });
    items.forEach(function (el) { io.observe(el); });
  }

  function scanOnReveal(selector) {
    var items = document.querySelectorAll(selector);
    if (!items.length) return;
    if (prefersReduced || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-scanned'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    items.forEach(function (el) { io.observe(el); });
  }

  function timelineRailScrub(containerSelector, railFillSelector) {
    if (prefersReduced || !window.gsap || !window.ScrollTrigger) return;
    var fill = document.querySelector(railFillSelector);
    if (!fill) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(fill, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: containerSelector, start: 'top 75%', end: 'bottom 75%', scrub: true }
    });
  }

  window.v2Motion = {
    prefersReduced: prefersReduced,
    attachSpotlight: attachSpotlight,
    attachMagnetic: attachMagnetic,
    revealStagger: revealStagger,
    revealEach: revealEach,
    scanOnReveal: scanOnReveal,
    timelineRailScrub: timelineRailScrub
  };
})();
