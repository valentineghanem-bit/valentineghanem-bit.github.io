// Custom cursor -- a field-reticle (four ticks + a ring), not a plain
// dot-and-circle: ties into the site's own surveillance/field-record
// visual language instead of a generic shape. Site-wide, desktop/fine-
// pointer only, fully inert under prefers-reduced-motion or touch.
// Five reactions beyond the resting state: hover (ticks open), press (an
// aperture-close snap + a spawned ripple), drag (directional stretch),
// zoom (ticks pulse +/- with ctrl+wheel/pinch direction -- new), and
// text-entry (collapses to a thin bar). See cursor.css for the visual
// side of each.
// Round 21 overhaul: kept the reticle's five reactions (they work, and a
// prior direct ask specifically wanted THIS shape kept, not reinvented)
// but added a genuinely new always-on layer -- a fading particle trail
// behind the cursor, cycling through all 6 palette colours as it moves.
// The old cursor only reacted on interaction; this one carries constant
// ambient motion even at rest-in-transit, which is the actual "hyperkinetic"
// gap a fifth reticle redesign wouldn't have closed.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReduced || !hasFinePointer) return;

  function build() {
    var dot = document.createElement('div');
    dot.className = 'v2-cursor-dot';

    var reticle = document.createElement('div');
    reticle.className = 'v2-cursor-reticle';
    ['n', 'e', 's', 'w'].forEach(function (dir) {
      var tick = document.createElement('span');
      tick.className = 'v2-cursor-tick v2-cursor-tick--' + dir;
      reticle.appendChild(tick);
    });
    var glyph = document.createElement('span');
    glyph.className = 'v2-cursor-glyph';
    reticle.appendChild(glyph);
    var bar = document.createElement('span');
    bar.className = 'v2-cursor-bar';
    reticle.appendChild(bar);

    // Trail: a small pool of reused dot elements (not created/destroyed
    // per-frame) repositioned and re-triggered as the pointer moves, each
    // cycling to the next palette colour and playing a one-shot CSS
    // fade+shrink. Pool-and-recycle keeps this cheap regardless of how
    // long the pointer keeps moving.
    var TRAIL_COLORS = ['--v2-violet', '--v2-crimson', '--v2-cyan', '--v2-yellow', '--v2-mint', '--v2-ink'];
    var TRAIL_COUNT = 16;
    var TRAIL_INTERVAL = 40;
    var trailContainer = document.createElement('div');
    trailContainer.className = 'v2-cursor-trail';
    var trailDots = [];
    for (var ti = 0; ti < TRAIL_COUNT; ti++) {
      var td = document.createElement('span');
      td.className = 'v2-cursor-trail-dot';
      trailContainer.appendChild(td);
      trailDots.push(td);
    }
    document.body.appendChild(trailContainer);
    var trailIndex = 0, trailColorIndex = 0, lastTrailSpawn = 0;
    function spawnTrailDot(x, y) {
      var el = trailDots[trailIndex];
      trailIndex = (trailIndex + 1) % TRAIL_COUNT;
      var color = TRAIL_COLORS[trailColorIndex % TRAIL_COLORS.length];
      trailColorIndex++;
      el.style.setProperty('--tx', x + 'px');
      el.style.setProperty('--ty', y + 'px');
      el.style.background = 'var(' + color + ')';
      el.classList.remove('is-fading');
      void el.offsetWidth;
      el.classList.add('is-fading');
    }

    document.body.appendChild(dot);
    document.body.appendChild(reticle);
    document.documentElement.classList.add('has-custom-cursor');

    function spawnRipple(x, y) {
      var ripple = document.createElement('div');
      ripple.className = 'v2-cursor-ripple';
      ripple.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
      window.setTimeout(function () { if (ripple.parentNode) ripple.remove(); }, 700);
    }

    var mx = 0, my = 0, rx = 0, ry = 0, active = false;
    var pointerIsDown = false, isDragging = false, dragAngle = 0;
    var downX = 0, downY = 0;
    var DRAG_THRESHOLD = 6;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      if (!active) { active = true; dot.classList.add('is-active'); reticle.classList.add('is-active'); }
      var now = performance.now();
      if (now - lastTrailSpawn > TRAIL_INTERVAL) {
        lastTrailSpawn = now;
        spawnTrailDot(mx, my);
      }
      if (pointerIsDown) {
        var dx = mx - downX, dy = my - downY;
        if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          isDragging = true;
          reticle.classList.remove('is-pressed');
          reticle.classList.add('is-dragging');
        }
        if (isDragging) dragAngle = Math.atan2(dy, dx);
      }
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
      pointerIsDown = true; downX = e.clientX; downY = e.clientY;
      reticle.classList.add('is-pressed');
      spawnRipple(e.clientX, e.clientY);
    });
    function releasePointer() {
      pointerIsDown = false; isDragging = false;
      reticle.classList.remove('is-pressed');
      reticle.classList.remove('is-dragging');
    }
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    document.addEventListener('mouseleave', function () {
      dot.classList.remove('is-active'); reticle.classList.remove('is-active'); active = false; releasePointer();
    });

    // Text-input personality: thin vertical bar, distinct from the
    // generic button/link hover-expand -- opposite treatment (collapse,
    // not expand), checked first since it needs to win over HOVER_SELECTOR
    // for the same element in edge cases.
    var TEXT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable="true"], [contenteditable=""]';
    var HOVER_SELECTOR = 'a, button, [role="button"], select, summary, .toc-card, .fan-carousel__card, .about-v2__pill, .about-v2__record-card';
    document.addEventListener('pointerover', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest(TEXT_SELECTOR)) { reticle.classList.add('is-texting'); return; }
      if (e.target.closest(HOVER_SELECTOR)) reticle.classList.add('is-hovering');
    });
    document.addEventListener('pointerout', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest(TEXT_SELECTOR)) reticle.classList.remove('is-texting');
      if (e.target.closest(HOVER_SELECTOR)) reticle.classList.remove('is-hovering');
    });

    // Zoom personality: ctrl+wheel is how browsers report trackpad pinch-
    // zoom (and how ctrl/cmd+scroll-to-zoom is actually driven on pages
    // like the Field Map) -- detected globally, so it reacts correctly
    // there without any page-specific wiring. Wheel fires repeatedly
    // through a gesture, not as a clean start/end pair, so the "zooming"
    // state is just re-armed on every qualifying event and left to expire
    // on its own shortly after the gesture stops.
    var zoomTimer = null;
    window.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      reticle.classList.add('is-zooming');
      reticle.classList.toggle('is-zooming-in', e.deltaY < 0);
      reticle.classList.toggle('is-zooming-out', e.deltaY > 0);
      glyph.textContent = e.deltaY < 0 ? '+' : '−';
      clearTimeout(zoomTimer);
      zoomTimer = setTimeout(function () {
        reticle.classList.remove('is-zooming', 'is-zooming-in', 'is-zooming-out');
        glyph.textContent = '';
      }, 350);
    }, { passive: true });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      var t = 'translate(' + rx + 'px,' + ry + 'px)';
      if (isDragging) t += ' rotate(' + dragAngle + 'rad) scale(1.4, 0.75)';
      reticle.style.transform = t;
      requestAnimationFrame(loop);
    }
    loop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
