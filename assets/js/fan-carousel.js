// Fan carousel: cards arc out from a centered, enlarged active card (like a
// hand of playing cards), rather than a flat slide track. Ported from a
// React/Framer reference into vanilla JS/CSS transforms -- no dependency.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared lightbox: clicking the active/centered card pops it out of the
  // deck and grows it, uncropped, to a viewport-centered box sized to the
  // image's real aspect ratio. One instance serves every fan-carousel on
  // the page. Built lazily so pages with no fan-carousel pay nothing.
  var lightbox = null;
  function getLightbox() {
    if (lightbox) return lightbox;
    var backdrop = document.createElement('div');
    backdrop.className = 'fan-lightbox-backdrop';
    var flyer = document.createElement('div');
    flyer.className = 'fan-lightbox-flyer';
    var img = document.createElement('img');
    img.alt = '';
    flyer.appendChild(img);
    var caption = document.createElement('p');
    caption.className = 'fan-lightbox-caption';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'fan-lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close full-size photo');
    closeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    document.body.appendChild(backdrop);
    document.body.appendChild(flyer);
    document.body.appendChild(caption);
    document.body.appendChild(closeBtn);

    var originRect = null, isOpen = false;

    function fitBox(naturalW, naturalH) {
      var maxW = window.innerWidth * 0.9, maxH = window.innerHeight * 0.78;
      var ratio = Math.min(maxW / naturalW, maxH / naturalH, 1) || 1;
      var w = naturalW * ratio, h = naturalH * ratio;
      return { w: w, h: h, left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2 };
    }

    function close() {
      if (!isOpen || !originRect) return;
      isOpen = false;
      backdrop.classList.remove('is-open');
      caption.classList.remove('is-open');
      closeBtn.classList.remove('is-open');
      flyer.style.left = originRect.left + 'px';
      flyer.style.top = originRect.top + 'px';
      flyer.style.width = originRect.width + 'px';
      flyer.style.height = originRect.height + 'px';
      flyer.style.borderRadius = originRect.radius;
      img.style.objectFit = 'cover';
      document.removeEventListener('keydown', onKey);
      window.setTimeout(function () { flyer.style.visibility = 'hidden'; }, prefersReduced ? 0 : 560);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    backdrop.addEventListener('click', close);
    closeBtn.addEventListener('click', close);

    function open(card) {
      var srcImg = card.querySelector('img');
      if (!srcImg) return;
      var r = card.getBoundingClientRect();
      var cs = getComputedStyle(card);
      originRect = { left: r.left, top: r.top, width: r.width, height: r.height, radius: cs.borderRadius };

      img.src = srcImg.currentSrc || srcImg.src;
      img.alt = srcImg.alt || '';
      img.style.objectFit = 'cover';
      caption.textContent = card.getAttribute('data-caption') || '';

      flyer.style.visibility = 'visible';
      flyer.style.left = originRect.left + 'px';
      flyer.style.top = originRect.top + 'px';
      flyer.style.width = originRect.width + 'px';
      flyer.style.height = originRect.height + 'px';
      flyer.style.borderRadius = originRect.radius;

      isOpen = true;
      document.addEventListener('keydown', onKey);

      function grow() {
        var naturalW = srcImg.naturalWidth || originRect.width;
        var naturalH = srcImg.naturalHeight || originRect.height;
        var box = fitBox(naturalW, naturalH);
        backdrop.classList.add('is-open');
        // Force layout so the browser registers the origin rect before we
        // transition to the target box -- otherwise it can start "grown".
        // eslint-disable-next-line no-unused-expressions
        flyer.getBoundingClientRect();
        requestAnimationFrame(function () {
          flyer.style.left = box.left + 'px';
          flyer.style.top = box.top + 'px';
          flyer.style.width = box.w + 'px';
          flyer.style.height = box.h + 'px';
          flyer.style.borderRadius = '10px';
          img.style.objectFit = 'contain';
          caption.style.left = '50%';
          caption.style.top = Math.min(box.top + box.h + 18, window.innerHeight - 28) + 'px';
          closeBtn.style.left = Math.min(box.left + box.w - 20, window.innerWidth - 56) + 'px';
          closeBtn.style.top = Math.max(box.top - 20, 12) + 'px';
          caption.classList.add('is-open');
          closeBtn.classList.add('is-open');
        });
      }

      if (srcImg.complete && srcImg.naturalWidth) { grow(); }
      else { srcImg.addEventListener('load', grow, { once: true }); }
    }

    lightbox = { open: open, close: close };
    return lightbox;
  }

  function initFan(root) {
    var cards = Array.prototype.slice.call(root.querySelectorAll('.fan-carousel__card'));
    var dotsWrap = root.querySelector('.fan-carousel__dots');
    var captionEl = root.querySelector('.fan-carousel__caption');
    var prevBtn = root.querySelector('.fan-carousel__arrow--prev');
    var nextBtn = root.querySelector('.fan-carousel__arrow--next');
    if (!cards.length) return;

    var active = Math.floor(cards.length / 2);
    var VISIBLE_RANGE = 3;
    var SPACING = 74;
    var ANGLE = 10;

    cards.forEach(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fan-carousel__dot';
      dot.setAttribute('aria-label', 'Go to photo ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
      card.addEventListener('click', function () {
        if (i === active) { getLightbox().open(card); }
        else { goTo(i); }
      });
      card.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        if (i === active) { getLightbox().open(card); }
        else { goTo(i); }
      });
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function render() {
      cards.forEach(function (card, i) {
        var delta = i - active;
        var abs = Math.abs(delta);
        card.classList.toggle('is-active', delta === 0);
        if (abs > VISIBLE_RANGE) {
          card.style.opacity = '0';
          card.style.pointerEvents = 'none';
          card.style.zIndex = '0';
          return;
        }
        card.style.pointerEvents = 'auto';
        var x = delta * SPACING;
        var rot = delta * ANGLE;
        var scale = delta === 0 ? 1.18 : 1 - abs * 0.08;
        var y = abs * 10;
        card.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg) scale(' + scale + ')';
        card.style.opacity = String(1 - abs * 0.18);
        card.style.zIndex = String(20 - abs);
      });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === active); });
      if (captionEl) {
        captionEl.textContent = cards[active].getAttribute('data-caption') || '';
        captionEl.classList.add('is-visible');
      }
    }

    function goTo(i) {
      active = (i + cards.length) % cards.length;
      render();
    }
    function next() { goTo(active + 1); }
    function prev() { goTo(active - 1); }

    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    var touchStartX = null;
    root.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      touchStartX = null;
    }, { passive: true });

    if (!prefersReduced) {
      var autoplay = root.getAttribute('data-autoplay');
      if (autoplay) {
        var timer = setInterval(next, parseInt(autoplay, 10));
        root.addEventListener('mouseenter', function () { clearInterval(timer); });
        root.addEventListener('mouseleave', function () { timer = setInterval(next, parseInt(autoplay, 10)); });
      }
    }

    render();
  }

  document.querySelectorAll('.fan-carousel').forEach(initFan);
})();
