// Custom cursor -- round 24 total redesign, replacing the field-reticle
// entirely (direct feedback: "i dislike mouse and cursor style... change
// this to something unique"). New concept: a small cluster of 4 palette-
// coloured particles in continuous orbit around the pointer, not a
// targeting-reticle shape -- "unique" and "multicoloured" are the same
// requirement here, not two separate asks, so the cursor's own resting
// state carries colour and motion simultaneously rather than only on
// interaction. Site-wide, desktop/fine-pointer only, fully inert under
// prefers-reduced-motion or touch. Same five reactions as before, all
// re-expressed through the orbit instead of ticks: hover (orbit widens +
// speeds up), press (orbit collapses inward, then a ripple), drag (orbit
// flattens into a comet-like trail behind the movement), zoom (orbit
// pulses out/in with direction), text-entry (collapses to a thin bar).
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReduced || !hasFinePointer) return;

  function build() {
    var dot = document.createElement('div');
    dot.className = 'v2-cursor-dot';

    var cluster = document.createElement('div');
    cluster.className = 'v2-cursor-cluster';
    var PARTICLE_COLORS = ['--v2-violet', '--v2-crimson', '--v2-cyan', '--v2-mint'];
    var particles = PARTICLE_COLORS.map(function (colorVar, i) {
      var p = document.createElement('span');
      p.className = 'v2-cursor-particle';
      p.style.background = 'var(' + colorVar + ')';
      cluster.appendChild(p);
      return { el: p, baseAngle: (Math.PI * 2 * i) / PARTICLE_COLORS.length };
    });
    var bar = document.createElement('span');
    bar.className = 'v2-cursor-bar';
    cluster.appendChild(bar);

    document.body.appendChild(dot);
    document.body.appendChild(cluster);
    document.documentElement.classList.add('has-custom-cursor');

    function spawnRipple(x, y) {
      var ripple = document.createElement('div');
      ripple.className = 'v2-cursor-ripple';
      ripple.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', function () { ripple.remove(); });
      window.setTimeout(function () { if (ripple.parentNode) ripple.remove(); }, 700);
    }

    var mx = 0, my = 0, cx = 0, cy = 0, active = false;
    var pointerIsDown = false, isDragging = false, dragAngle = 0;
    var downX = 0, downY = 0;
    var DRAG_THRESHOLD = 6;

    // Orbit state: RADIUS/SPEED are targets the render loop eases toward,
    // not snapped-to instantly, so state changes (hover, press, zoom) read
    // as a genuine motion response rather than a hard cut.
    var orbitAngle = 0;
    var radius = 13, radiusTarget = 13;
    var speed = 0.045, speedTarget = 0.045;
    var HOVER_RADIUS = 20, PRESS_RADIUS = 4, BASE_RADIUS = 13;
    var HOVER_SPEED = 0.09, PRESS_SPEED = 0.14, BASE_SPEED = 0.045;

    window.addEventListener('pointermove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      if (!active) { active = true; dot.classList.add('is-active'); cluster.classList.add('is-active'); }
      if (pointerIsDown) {
        var dx = mx - downX, dy = my - downY;
        if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          isDragging = true;
          cluster.classList.remove('is-pressed');
          cluster.classList.add('is-dragging');
        }
        if (isDragging) dragAngle = Math.atan2(dy, dx);
      }
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
      pointerIsDown = true; downX = e.clientX; downY = e.clientY;
      cluster.classList.add('is-pressed');
      radiusTarget = PRESS_RADIUS; speedTarget = PRESS_SPEED;
      spawnRipple(e.clientX, e.clientY);
    });
    function releasePointer() {
      pointerIsDown = false; isDragging = false;
      cluster.classList.remove('is-pressed');
      cluster.classList.remove('is-dragging');
      radiusTarget = BASE_RADIUS; speedTarget = BASE_SPEED;
    }
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    document.addEventListener('mouseleave', function () {
      dot.classList.remove('is-active'); cluster.classList.remove('is-active'); active = false; releasePointer();
    });

    // Text-input personality: thin vertical bar, distinct from the generic
    // button/link hover-widen -- checked first since it needs to win over
    // HOVER_SELECTOR for the same element in edge cases.
    var TEXT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable="true"], [contenteditable=""]';
    var HOVER_SELECTOR = 'a, button, [role="button"], select, summary, .toc-card, .fan-carousel__card, .about-v2__pill, .about-v2__record-card';
    document.addEventListener('pointerover', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest(TEXT_SELECTOR)) {
        cluster.classList.add('is-texting');
        return;
      }
      if (e.target.closest(HOVER_SELECTOR)) {
        cluster.classList.add('is-hovering');
        if (!pointerIsDown) { radiusTarget = HOVER_RADIUS; speedTarget = HOVER_SPEED; }
      }
    });
    document.addEventListener('pointerout', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest(TEXT_SELECTOR)) cluster.classList.remove('is-texting');
      if (e.target.closest(HOVER_SELECTOR)) {
        cluster.classList.remove('is-hovering');
        if (!pointerIsDown) { radiusTarget = BASE_RADIUS; speedTarget = BASE_SPEED; }
      }
    });

    // Zoom personality: ctrl+wheel is how browsers report trackpad pinch-
    // zoom (and how ctrl/cmd+scroll-to-zoom is actually driven on pages
    // like the Field Map) -- detected globally. Wheel fires repeatedly
    // through a gesture, not as a clean start/end pair, so the "zooming"
    // state is re-armed on every qualifying event and left to expire on
    // its own shortly after the gesture stops. Orbit radius pulses out for
    // zoom-in, in for zoom-out -- direction reads from the motion itself,
    // no glyph needed the way the old reticle used one.
    var zoomTimer = null;
    window.addEventListener('wheel', function (e) {
      if (!e.ctrlKey) return;
      cluster.classList.add('is-zooming');
      var zoomingIn = e.deltaY < 0;
      cluster.classList.toggle('is-zooming-in', zoomingIn);
      cluster.classList.toggle('is-zooming-out', !zoomingIn);
      radiusTarget = zoomingIn ? HOVER_RADIUS + 6 : PRESS_RADIUS + 2;
      speedTarget = 0.16;
      clearTimeout(zoomTimer);
      zoomTimer = setTimeout(function () {
        cluster.classList.remove('is-zooming', 'is-zooming-in', 'is-zooming-out');
        radiusTarget = pointerIsDown ? PRESS_RADIUS : BASE_RADIUS;
        speedTarget = pointerIsDown ? PRESS_SPEED : BASE_SPEED;
      }, 350);
    }, { passive: true });

    function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      radius += (radiusTarget - radius) * 0.14;
      speed += (speedTarget - speed) * 0.1;
      orbitAngle += speed;

      particles.forEach(function (particle, i) {
        var angle = orbitAngle + particle.baseAngle;
        var rx = radius, ry = radius;
        if (isDragging) {
          // Flatten the orbit into an ellipse aligned with the drag
          // direction -- reads as a comet stretching behind the motion
          // rather than a circle simply moving.
          rx = radius * 1.9; ry = radius * 0.45;
        }
        var px = Math.cos(angle) * rx, py = Math.sin(angle) * ry;
        if (isDragging) {
          var cos = Math.cos(dragAngle), sin = Math.sin(dragAngle);
          var rpx = px * cos - py * sin, rpy = px * sin + py * cos;
          px = rpx; py = rpy;
        }
        particle.el.style.transform = 'translate(' + (cx + px) + 'px,' + (cy + py) + 'px)';
      });
      bar.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';

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
