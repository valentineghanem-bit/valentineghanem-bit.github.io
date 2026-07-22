// About page: per-section bespoke motion (not one repeated "fade up" treatment).
(function () {
  var root = document.querySelector('.about-v2');
  if (!root) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Spotlight glow (quote card + credential tags) -- shared cursor-follow
  // technique already established on the hero and map.
  root.querySelectorAll('.about-v2__quote, .about-v2__cred').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--sx', ((e.clientX - r.left) / r.width * 100) + '%');
      el.style.setProperty('--sy', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  // 06: record-card lightbox -- click a compact card, it grows from its
  // own on-screen rect into a centered box showing the full description.
  // Wired unconditionally, ABOVE the reduced-motion early-return below:
  // this is a content-disclosure control (the description isn't shown
  // anywhere else), not decorative motion, and must keep working for
  // motion-sensitive users too -- only the CSS grow-transition easing is
  // what reduced-motion should remove (see about-v2.css).
  var recordCards = Array.prototype.slice.call(root.querySelectorAll('.about-v2__record-card'));
  if (recordCards.length) {
    var rlBackdrop, rlFlyer, rlIcon, rlDates, rlTitle, rlDesc, rlClose;
    var rlOpen = false, rlOrigin = null, rlTrigger = null;

    function buildRecordLightbox() {
      rlBackdrop = document.createElement('div');
      rlBackdrop.className = 'record-lightbox-backdrop';
      rlFlyer = document.createElement('div');
      rlFlyer.className = 'record-lightbox-flyer';
      rlFlyer.setAttribute('role', 'dialog');
      rlFlyer.setAttribute('aria-modal', 'true');
      rlIcon = document.createElement('span');
      rlIcon.className = 'about-v2__record-card-icon';
      rlIcon.setAttribute('aria-hidden', 'true');
      rlDates = document.createElement('span');
      rlDates.className = 'about-v2__record-card-dates';
      rlTitle = document.createElement('span');
      rlTitle.className = 'about-v2__record-card-title';
      rlDesc = document.createElement('p');
      rlDesc.className = 'record-lightbox-desc';
      rlFlyer.append(rlIcon, rlDates, rlTitle, rlDesc);
      rlClose = document.createElement('button');
      rlClose.type = 'button';
      rlClose.className = 'record-lightbox-close';
      rlClose.setAttribute('aria-label', 'Close record');
      rlClose.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      document.body.append(rlBackdrop, rlFlyer, rlClose);

      function closeRecord() {
        if (!rlOpen || !rlOrigin) return;
        rlOpen = false;
        rlBackdrop.classList.remove('is-open');
        rlClose.classList.remove('is-open');
        rlFlyer.classList.remove('is-grown');
        rlFlyer.style.left = rlOrigin.left + 'px';
        rlFlyer.style.top = rlOrigin.top + 'px';
        rlFlyer.style.width = rlOrigin.width + 'px';
        rlFlyer.style.height = rlOrigin.height + 'px';
        rlFlyer.style.borderRadius = rlOrigin.radius;
        document.removeEventListener('keydown', onRlKey);
        if (rlTrigger) rlTrigger.focus();
        window.setTimeout(function () { rlFlyer.style.visibility = 'hidden'; }, prefersReduced ? 0 : 560);
      }
      function onRlKey(e) { if (e.key === 'Escape') closeRecord(); }
      rlBackdrop.addEventListener('click', closeRecord);
      rlClose.addEventListener('click', closeRecord);

      function openRecord(card) {
        var r = card.getBoundingClientRect();
        var cs = getComputedStyle(card);
        rlOrigin = { left: r.left, top: r.top, width: r.width, height: r.height, radius: cs.borderRadius };
        rlTrigger = card;

        rlIcon.textContent = card.dataset.recordIcon || '';
        rlDates.textContent = card.dataset.recordDates || '';
        rlTitle.textContent = card.dataset.recordTitle || '';
        rlDesc.textContent = card.dataset.recordDesc || '';

        rlFlyer.style.visibility = 'visible';
        rlFlyer.style.left = rlOrigin.left + 'px';
        rlFlyer.style.top = rlOrigin.top + 'px';
        rlFlyer.style.width = rlOrigin.width + 'px';
        rlFlyer.style.height = rlOrigin.height + 'px';
        rlFlyer.style.borderRadius = rlOrigin.radius;
        rlFlyer.classList.remove('is-grown');

        rlOpen = true;
        document.addEventListener('keydown', onRlKey);
        rlBackdrop.classList.add('is-open');

        // Measure the natural height of the full description at the
        // target width (rendered off-screen for one synchronous instant,
        // never painted) so the height transition has a real end value --
        // text has no "naturalHeight" the way an <img> does.
        var targetW = Math.min(window.innerWidth * 0.92, 560);
        var prevLeft = rlFlyer.style.left, prevTop = rlFlyer.style.top, prevW = rlFlyer.style.width, prevH = rlFlyer.style.height;
        rlFlyer.style.transition = 'none';
        rlFlyer.style.left = '-9999px';
        rlFlyer.style.width = targetW + 'px';
        rlFlyer.style.height = 'auto';
        var measuredH = rlFlyer.getBoundingClientRect().height;
        rlFlyer.style.left = prevLeft; rlFlyer.style.top = prevTop; rlFlyer.style.width = prevW; rlFlyer.style.height = prevH;
        // eslint-disable-next-line no-unused-expressions
        rlFlyer.getBoundingClientRect();
        rlFlyer.style.transition = '';

        var targetH = Math.min(measuredH, window.innerHeight * 0.8);
        var targetLeft = (window.innerWidth - targetW) / 2;
        var targetTop = (window.innerHeight - targetH) / 2;

        requestAnimationFrame(function () {
          rlFlyer.style.left = targetLeft + 'px';
          rlFlyer.style.top = targetTop + 'px';
          rlFlyer.style.width = targetW + 'px';
          rlFlyer.style.height = targetH + 'px';
          rlFlyer.style.borderRadius = '10px';
          rlFlyer.classList.add('is-grown');
          rlClose.style.left = Math.min(targetLeft + targetW - 20, window.innerWidth - 56) + 'px';
          rlClose.style.top = Math.max(targetTop - 20, 12) + 'px';
          rlClose.classList.add('is-open');
          rlClose.focus();
        });
      }

      return { open: openRecord, close: closeRecord };
    }

    var recordLightbox = null;
    function getRecordLightbox() { return recordLightbox || (recordLightbox = buildRecordLightbox()); }

    recordCards.forEach(function (card) {
      card.addEventListener('click', function () { getRecordLightbox().open(card); });
    });
  }

  if (prefersReduced) return;

  // 01: specimen scan-line sweep, once, on reveal.
  var specimens = root.querySelectorAll('.about-v2__specimen');
  if (specimens.length && 'IntersectionObserver' in window) {
    var scanIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-scanned'); scanIo.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    specimens.forEach(function (el) { scanIo.observe(el); });
  }

  // 03: pills stagger in, magnetic hover.
  var pills = root.querySelectorAll('.about-v2__pill');
  if (pills.length && 'IntersectionObserver' in window) {
    var pillsRevealed = false;
    var pillIo = new IntersectionObserver(function (entries) {
      if (pillsRevealed || !entries[0].isIntersecting) return;
      pillsRevealed = true;
      pills.forEach(function (el, i) {
        el.style.animationDelay = (i * 35) + 'ms';
        el.classList.add('is-visible');
      });
    }, { threshold: 0.2 });
    pillIo.observe(root.querySelector('.about-v2__pills') || pills[0]);
  }
  if (window.gsap && window.matchMedia('(pointer: fine)').matches) {
    pills.forEach(function (el) {
      var xTo = gsap.quickTo(el, '--mx', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
      var yTo = gsap.quickTo(el, '--my', { duration: 0.4, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  // 04: identifiers stagger in, terminal-style.
  var idents = root.querySelectorAll('.about-v2__ident');
  if (idents.length && 'IntersectionObserver' in window) {
    var identRevealed = false;
    var identIo = new IntersectionObserver(function (entries) {
      if (identRevealed || !entries[0].isIntersecting) return;
      identRevealed = true;
      idents.forEach(function (el, i) {
        el.style.animationDelay = (i * 90) + 'ms';
        el.classList.add('is-visible');
      });
    }, { threshold: 0.2 });
    identIo.observe(root.querySelector('.about-v2__ident-list') || idents[0]);
  }

  // 06: record cards stagger in as the grid scrolls into view.
  if (recordCards.length && 'IntersectionObserver' in window) {
    var recordsRevealed = false;
    var recordIo = new IntersectionObserver(function (entries) {
      if (recordsRevealed || !entries[0].isIntersecting) return;
      recordsRevealed = true;
      recordCards.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i * 30, 400) + 'ms';
        el.classList.add('is-visible');
      });
    }, { threshold: 0.1 });
    recordIo.observe(root.querySelector('[data-record-grid]') || recordCards[0]);
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    var manifestoRail = root.querySelector('.about-v2__manifesto-rail-fill');
    if (manifestoRail) {
      gsap.to(manifestoRail, {
        height: '100%', ease: 'none',
        scrollTrigger: { trigger: '.about-v2__manifesto', start: 'top 80%', end: 'bottom 60%', scrub: true }
      });
    }
  }
})();
