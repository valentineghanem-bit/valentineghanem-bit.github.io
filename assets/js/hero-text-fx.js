// Home hero: entrance choreography, cursor-proximity name distortion, and
// spotlight-glow credential panels. Loaded only on the page that has a
// .hero-v2 -- guards itself if absent, but not meant to run site-wide.
(function () {
  const heroEl = document.querySelector('.hero-v2');
  if (!heroEl) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typewriter: cycles through the real job titles, one character at a
  // time -- referenced by the GSAP timeline below (hoisted, so the forward
  // reference is safe).
  function startTypewriter() {
    var el = document.querySelector('[data-typed-text]');
    if (!el) return;
    var words;
    try { words = JSON.parse(el.getAttribute('data-words')); } catch (e) { words = []; }
    if (!words || !words.length) return;
    var wordIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      var word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) { deleting = true; setTimeout(tick, 1800); return; }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 30);
      }
    }
    tick();
  }

  document.querySelectorAll('.hero-v2__name [data-word]').forEach((word) => {
    const text = word.textContent;
    word.textContent = '';
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? ' ' : ch;
      word.appendChild(span);
    });
  });

  if (prefersReduced) {
    // Reduced-motion: a constantly-rewriting typewriter IS the kind of
    // motion this preference asks to skip, so it stays a single static
    // word here deliberately -- unlike the GSAP-missing branch below,
    // this one is intentional, not a fallback for a failure.
    heroEl.querySelectorAll(
      '.hero-v2__eyebrow, .hero-v2__name .rise, .hero-v2__typed, .hero-v2__mission-frame, .hero-v2__role, .hero-v2__panels, .hero-v2__ctas, .hero-v2__a11y-link, .hero-v2__portrait, .hero-v2__badge, .hero-v2__scroll-cue'
    ).forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    var typedFallback = document.querySelector('[data-typed-text]');
    if (typedFallback) {
      try { typedFallback.textContent = JSON.parse(typedFallback.getAttribute('data-words'))[0] || ''; } catch (e) {}
    }
    return;
  }

  if (typeof gsap === 'undefined') {
    // GSAP failing to load (slow connection, blocked script, CDN hiccup)
    // used to mean the typewriter never started at all -- it was wired
    // to fire only via a GSAP timeline's onStart callback, so a missing
    // library silently killed an unrelated, GSAP-free feature along with
    // it. The typewriter itself only needs setTimeout; run it regardless
    // of whether GSAP came up, same as the reveal opacities below.
    heroEl.querySelectorAll(
      '.hero-v2__eyebrow, .hero-v2__name .rise, .hero-v2__typed, .hero-v2__mission-frame, .hero-v2__role, .hero-v2__panels, .hero-v2__ctas, .hero-v2__a11y-link, .hero-v2__portrait, .hero-v2__badge, .hero-v2__scroll-cue'
    ).forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    startTypewriter();
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.hero-v2__eyebrow', { opacity: 1, duration: 0.6 }, 0.1)
    .from('.hero-v2__name .rise', { yPercent: 120, rotate: 3, stagger: 0.1, duration: 0.9 }, 0.15)
    .to('.hero-v2__typed', { opacity: 1, duration: 0.5, onStart: startTypewriter }, 0.55)
    .to('.hero-v2__mission-frame', { opacity: 1, duration: 0.6 }, 0.7)
    .to('.hero-v2__role', { opacity: 1, duration: 0.6 }, 0.85)
    .to('.hero-v2__panels', { opacity: 1, duration: 0.6 }, 0.9)
    .to('.hero-v2__ctas', { opacity: 1, duration: 0.6 }, 1.0)
    .to('.hero-v2__a11y-link', { opacity: 1, duration: 0.6 }, 1.1)
    .to('.hero-v2__portrait', { opacity: 1, rotateX: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, 1.05)
    .to('.hero-v2__badge', { opacity: 1, duration: 0.5 }, 1.7)
    .to('.hero-v2__scroll-cue', { opacity: 1, duration: 0.5 }, 1.9);

  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.hero-v2__scroll-cue', {
      opacity: 0, scrollTrigger: { trigger: '.hero-v2', start: 'top top', end: '20% top', scrub: true }
    });
  }

  if (window.matchMedia('(pointer: fine)').matches) {
    const chars = heroEl.querySelectorAll('.hero-v2__name .char');
    const RADIUS = 140;
    window.addEventListener('pointermove', (e) => {
      chars.forEach((el) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const t = Math.max(0, 1 - dist / RADIUS);
        el.style.transform = 'scale(' + (1 + t * 0.14).toFixed(3) + ')';
        el.style.color = t > 0.05 ? 'color-mix(in oklch, var(--hv2-ink), var(--hv2-gold) ' + Math.round(t * 100) + '%)' : '';
      });
    }, { passive: true });
  }

  heroEl.querySelectorAll('.hero-v2__panel').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  if (window.v2Motion) v2Motion.attachMagnetic('.hero-v2__btn');
})();
