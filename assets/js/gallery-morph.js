// Gallery hero: selected photographs remain a quiet background collage.
// The only circular motion on the opening sequence belongs to the white archive wheel below.
(function () {
  var hero = document.querySelector('.gallery-morph');
  if (!hero) return;

  window.requestAnimationFrame(function () {
    hero.classList.add('gallery-morph--ready');
  });
})();

// White archive wheel: photographs assemble into the circle with scroll,
// then continue the original visibility-gated orbit. Scrolling upward reverses
// the composition without creating a second carousel in the hero.
(function () {
  var wheel = document.querySelector('[data-gallery-wheel]');
  if (!wheel) return;

  var section = wheel.closest('.gallery10-wheel');
  var wheelItems = Array.prototype.slice.call(
    wheel.querySelectorAll('.gallery10-wheel__item')
  );
  if (!section || !wheelItems.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var spin = 0;
  var frame = null;
  var composeFrame = null;
  var last = 0;
  var visible = false;
  var dragging = false;
  var startX = 0;
  var startSpin = 0;

  function deterministicUnit(index, salt) {
    var value = Math.sin((index + 1) * (12.9898 + salt * 7.233)) * 43758.5453;
    return value - Math.floor(value);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function ease(value) {
    return value * value * (3 - 2 * value);
  }

  function wheelRadius() {
    return window.innerWidth < 720
      ? -Math.min(window.innerWidth * .43, 172)
      : -Math.min(window.innerWidth * .4, 430);
  }

  wheelItems.forEach(function (item, index) {
    var angle = (index / wheelItems.length) * 360;
    item.style.setProperty('--wheel-angle', angle.toFixed(3) + 'deg');
    item.style.setProperty('--wheel-angle-inverse', (-angle).toFixed(3) + 'deg');
    item._wheelScatter = {
      x: deterministicUnit(index, 1) * 2 - 1,
      y: deterministicUnit(index, 2) * 2 - 1
    };
  });

  function paintSpin() {
    wheel.style.setProperty('--wheel-spin', spin.toFixed(2) + 'deg');
    wheel.style.setProperty('--wheel-spin-inverse', (-spin).toFixed(2) + 'deg');
  }

  function paintComposition(progress) {
    var composed = reduced ? 1 : ease(clamp(progress, 0, 1));
    var remaining = 1 - composed;
    var radius = wheelRadius() * composed;
    var spreadX = Math.min(window.innerWidth * .58, 680);
    var spreadY = Math.min(window.innerHeight * .34, 320);

    wheelItems.forEach(function (item) {
      var scatter = item._wheelScatter;
      item.style.setProperty('--wheel-scatter-x', (scatter.x * spreadX * remaining).toFixed(1) + 'px');
      item.style.setProperty('--wheel-scatter-y', (scatter.y * spreadY * remaining).toFixed(1) + 'px');
      item.style.setProperty('--wheel-live-radius', radius.toFixed(1) + 'px');
      item.style.setProperty('--wheel-compose-scale', (.7 + composed * .3).toFixed(3));
      item.style.setProperty('--wheel-compose-opacity', (.16 + composed * .84).toFixed(3));
    });
  }

  function updateComposition() {
    composeFrame = null;
    if (reduced) {
      paintComposition(1);
      return;
    }
    var rect = section.getBoundingClientRect();
    var start = window.innerHeight * .96;
    var finish = window.innerHeight * .2;
    paintComposition((start - rect.top) / Math.max(start - finish, 1));
  }

  function requestComposition() {
    if (composeFrame !== null) return;
    composeFrame = window.requestAnimationFrame(updateComposition);
  }

  function tick(timestamp) {
    if (!visible || reduced || dragging) {
      frame = null;
      return;
    }
    if (!last) last = timestamp;
    var elapsed = Math.min(48, timestamp - last);
    last = timestamp;
    spin = (spin + elapsed * .0028) % 360;
    paintSpin();
    frame = window.requestAnimationFrame(tick);
  }

  function start() {
    if (frame || reduced || !visible || dragging) return;
    last = 0;
    frame = window.requestAnimationFrame(tick);
  }

  function stop() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = null;
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: .08 });
    observer.observe(wheel);
  } else {
    visible = true;
    start();
  }

  wheel.addEventListener('pointerdown', function (event) {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startSpin = spin;
    stop();
    wheel.setPointerCapture(event.pointerId);
  });

  wheel.addEventListener('pointermove', function (event) {
    if (!dragging) return;
    spin = startSpin + (event.clientX - startX) * .18;
    paintSpin();
  });

  function release(event) {
    if (!dragging) return;
    dragging = false;
    if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
    start();
  }

  wheel.addEventListener('pointerup', release);
  wheel.addEventListener('pointercancel', release);
  wheel.addEventListener('mouseenter', stop);
  wheel.addEventListener('mouseleave', start);
  window.addEventListener('scroll', requestComposition, { passive: true });
  window.addEventListener('resize', requestComposition, { passive: true });
  window.addEventListener('pagehide', function () {
    stop();
    if (composeFrame !== null) window.cancelAnimationFrame(composeFrame);
  }, { once: true });

  paintSpin();
  updateComposition();
})();
