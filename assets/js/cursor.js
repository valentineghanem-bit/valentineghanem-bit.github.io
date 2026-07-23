// Faceted VGG cursor: brand arrow plus distinct gestures for hover, clicks,
// double-click, context click, scroll, drag, text entry, and zoom.
(function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReduced || !hasFinePointer) return;

  function build() {
    var dot = document.createElement('div');
    dot.className = 'v2-cursor-dot';

    var arrow = document.createElement('div');
    arrow.className = 'v2-cursor-arrow';
    var mark = document.createElement('span');
    mark.className = 'v2-cursor-mark';
    arrow.appendChild(mark);

    var cluster = document.createElement('div');
    cluster.className = 'v2-cursor-cluster';
    var PARTICLES = [
      { color: '#22D3EE', angle: 0 },
      { color: '#34D399', angle: Math.PI * 0.4 },
      { color: '#FBBF24', angle: Math.PI * 0.8 },
      { color: '#EF4444', angle: Math.PI * 1.2 },
      { color: '#8B5CF6', angle: Math.PI * 1.6 }
    ].map(function (config) {
      var p = document.createElement('span');
      p.className = 'v2-cursor-particle';
      p.style.background = config.color;
      p.style.color = config.color;
      cluster.appendChild(p);
      return { el: p, baseAngle: config.angle };
    });

    var bar = document.createElement('span');
    bar.className = 'v2-cursor-bar';
    cluster.appendChild(bar);

    document.body.appendChild(dot);
    document.body.appendChild(arrow);
    document.body.appendChild(cluster);
    document.documentElement.classList.add('has-custom-cursor');

    var mx = 0, my = 0, cx = 0, cy = 0, active = false;
    var pointerIsDown = false, isDragging = false, dragAngle = 0;
    var downX = 0, downY = 0;
    var orbitAngle = 0;
    var radius = 14, radiusTarget = 14;
    var speed = 0.048, speedTarget = 0.048;
    var HOVER_RADIUS = 23, PRESS_RADIUS = 5, BASE_RADIUS = 14;
    var HOVER_SPEED = 0.095, PRESS_SPEED = 0.16, BASE_SPEED = 0.048;
    var DRAG_THRESHOLD = 6;
    var rightClickTimer = null;
    var scrollTimer = null;
    var zoomTimer = null;
    var idleTimer = null;
    var lastLeftClick = { time: 0, x: 0, y: 0 };
    var nativeEdge = false;
    var soundHaptics = (function () {
      var ctx = null, out = null;
      var last = {};
      var MUTE_KEY = 'vg-v2-cursor-haptics-muted';
      function allowed() {
        return localStorage.getItem(MUTE_KEY) !== 'true';
      }
      function ensure() {
        if (!allowed()) return null;
        var AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!ctx) {
          ctx = new AudioCtx();
          out = ctx.createGain();
          out.gain.value = 1.05;
          out.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      }
      function throttled(name, gap) {
        var now = window.performance.now();
        if (last[name] && now - last[name] < gap) return true;
        last[name] = now;
        return false;
      }
      function tone(freq, duration, peak, type, when) {
        var c = ensure();
        if (!c) return;
        var start = c.currentTime + (when || 0);
        var osc = c.createOscillator();
        var g = c.createGain();
        var filt = c.createBiquadFilter();
        osc.type = type || 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        filt.type = 'lowpass';
        filt.frequency.setValueAtTime(1500, start);
        filt.Q.value = 0.28;
        g.gain.setValueAtTime(0.0001, start);
        g.gain.linearRampToValueAtTime(peak, start + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        osc.connect(g);
        g.connect(filt);
        filt.connect(out);
        osc.start(start);
        osc.stop(start + duration + 0.04);
      }
      function play(kind) {
        if (navigator.vibrate && kind !== 'hover' && kind !== 'text') {
          var patterns = {
            click: 18,
            double: [14, 30, 18],
            context: [24, 35, 24],
            scroll: 10,
            drag: 22
          };
          if (patterns[kind]) navigator.vibrate(patterns[kind]);
        }
        if (kind === 'hover') {
          if (throttled(kind, 180)) return;
          tone(680, 0.070, 0.130, 'sine');
        } else if (kind === 'click') {
          tone(180, 0.115, 0.250, 'triangle');
          tone(360, 0.090, 0.160, 'sine', 0.012);
        } else if (kind === 'double') {
          tone(293.66, 0.100, 0.210, 'triangle');
          tone(440.00, 0.128, 0.185, 'triangle', 0.080);
        } else if (kind === 'context') {
          tone(130.81, 0.155, 0.270, 'triangle');
        } else if (kind === 'scroll') {
          if (throttled(kind, 220)) return;
          tone(220.00, 0.086, 0.170, 'sine');
        } else if (kind === 'drag') {
          if (throttled(kind, 320)) return;
          tone(146.83, 0.135, 0.220, 'triangle');
        } else if (kind === 'text') {
          if (throttled(kind, 260)) return;
          tone(493.88, 0.065, 0.125, 'sine');
        }
      }
      return { play: play };
    })();

    function isScrollbarEdge(x, y) {
      var doc = document.documentElement;
      var hasVerticalScroll = doc.scrollHeight > doc.clientHeight + 2;
      var hasHorizontalScroll = doc.scrollWidth > doc.clientWidth + 2;
      var edgeWidth = Math.max(20, window.innerWidth - doc.clientWidth + 16);
      var bottomHeight = Math.max(20, window.innerHeight - doc.clientHeight + 16);
      return (hasVerticalScroll && x >= doc.clientWidth - edgeWidth) ||
        (hasHorizontalScroll && y >= doc.clientHeight - bottomHeight);
    }

    function setNativeEdge(on) {
      if (nativeEdge === on) return;
      nativeEdge = on;
      document.documentElement.classList.toggle('cursor-native-edge', on);
      if (on) {
        active = false;
        clearIdleState();
        dot.classList.remove('is-active');
        arrow.classList.remove('is-active');
        cluster.classList.remove('is-active');
        releasePointer();
      }
    }

    function activate(x, y) {
      if (isScrollbarEdge(x, y)) {
        setNativeEdge(true);
        return;
      }
      setNativeEdge(false);
      mx = x;
      my = y;
      if (!active) {
        cx = x;
        cy = y;
        active = true;
        dot.classList.add('is-active');
        arrow.classList.add('is-active');
        cluster.classList.add('is-active');
      }
    }

    function clearIdleState() {
      window.clearTimeout(idleTimer);
      cluster.classList.remove('is-idle');
    }

    function scheduleIdleState() {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(function () {
        if (active && !nativeEdge && !pointerIsDown && !cluster.classList.contains('is-texting')) {
          cluster.classList.add('is-idle');
          radiusTarget = cluster.classList.contains('is-hovering') ? HOVER_RADIUS : 18;
          speedTarget = cluster.classList.contains('is-hovering') ? HOVER_SPEED : 0.075;
        }
      }, 520);
    }

    function spawnAction(x, y, className) {
      var action = document.createElement('div');
      action.className = 'v2-cursor-action ' + className;
      action.style.left = x + 'px';
      action.style.top = y + 'px';
      document.body.appendChild(action);
      action.addEventListener('animationend', function () { action.remove(); });
      window.setTimeout(function () { if (action.parentNode) action.remove(); }, 800);
    }

    function applyTemporaryState(name, duration) {
      arrow.classList.add(name);
      cluster.classList.add(name);
      window.setTimeout(function () {
        arrow.classList.remove(name);
        cluster.classList.remove(name);
      }, duration || 240);
    }

    window.addEventListener('pointermove', function (e) {
      if (isScrollbarEdge(e.clientX, e.clientY)) {
        setNativeEdge(true);
        return;
      }
      setNativeEdge(false);
      activate(e.clientX, e.clientY);
      clearIdleState();
      scheduleIdleState();
      if (pointerIsDown) {
        var dx = mx - downX, dy = my - downY;
        if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
          isDragging = true;
          cluster.classList.remove('is-left-click');
          cluster.classList.add('is-dragging');
          soundHaptics.play('drag');
        }
        if (isDragging) dragAngle = Math.atan2(dy, dx);
      }
    }, { passive: true });

    window.addEventListener('pointerdown', function (e) {
      if (isScrollbarEdge(e.clientX, e.clientY)) {
        setNativeEdge(true);
        return;
      }
      activate(e.clientX, e.clientY);
      pointerIsDown = true;
      clearIdleState();
      downX = e.clientX;
      downY = e.clientY;
      if (e.button === 2) {
        clearTimeout(rightClickTimer);
        arrow.classList.add('is-right-click');
        cluster.classList.add('is-right-click');
        spawnAction(e.clientX, e.clientY, 'v2-cursor-context');
        soundHaptics.play('context');
        radiusTarget = HOVER_RADIUS + 4;
        speedTarget = PRESS_SPEED;
        rightClickTimer = setTimeout(function () {
          arrow.classList.remove('is-right-click');
          cluster.classList.remove('is-right-click');
          if (!pointerIsDown) {
            radiusTarget = BASE_RADIUS;
            speedTarget = BASE_SPEED;
          }
        }, 360);
      } else {
        var now = window.performance.now();
        if (now - lastLeftClick.time < 320 && Math.hypot(e.clientX - lastLeftClick.x, e.clientY - lastLeftClick.y) < 28) {
          spawnAction(e.clientX, e.clientY, 'v2-cursor-burst');
          soundHaptics.play('double');
          radiusTarget = HOVER_RADIUS + 8;
          speedTarget = 0.2;
        }
        lastLeftClick = { time: now, x: e.clientX, y: e.clientY };
        applyTemporaryState('is-left-click', 220);
        spawnAction(e.clientX, e.clientY, 'v2-cursor-ripple');
        soundHaptics.play('click');
        radiusTarget = PRESS_RADIUS;
        speedTarget = PRESS_SPEED;
      }
    });

    function releasePointer() {
      pointerIsDown = false;
      isDragging = false;
      cluster.classList.remove('is-dragging');
      if (!cluster.classList.contains('is-hovering')) {
        radiusTarget = BASE_RADIUS;
        speedTarget = BASE_SPEED;
      }
      if (active && !nativeEdge) scheduleIdleState();
    }

    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);
    window.addEventListener('dblclick', function (e) {
      if (nativeEdge || isScrollbarEdge(e.clientX, e.clientY)) return;
      activate(e.clientX, e.clientY);
      spawnAction(e.clientX, e.clientY, 'v2-cursor-burst');
      soundHaptics.play('double');
      radiusTarget = HOVER_RADIUS + 8;
      speedTarget = 0.2;
      setTimeout(function () {
        radiusTarget = cluster.classList.contains('is-hovering') ? HOVER_RADIUS : BASE_RADIUS;
        speedTarget = cluster.classList.contains('is-hovering') ? HOVER_SPEED : BASE_SPEED;
      }, 260);
    });

    document.addEventListener('mouseleave', function () {
      active = false;
      clearIdleState();
      dot.classList.remove('is-active');
      arrow.classList.remove('is-active');
      cluster.classList.remove('is-active');
      releasePointer();
    });

    var TEXT_SELECTOR = 'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, [contenteditable="true"], [contenteditable=""]';
    var HOVER_SELECTOR = 'a, button, [role="button"], select, summary, label, .toc-card, .fan-carousel__card, .about-v2__pill, .about-v2__record-card, .card, .event-card, .glass-card';
    document.addEventListener('pointerover', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest(TEXT_SELECTOR)) {
        arrow.classList.add('is-texting');
        cluster.classList.add('is-texting');
        soundHaptics.play('text');
        return;
      }
      if (e.target.closest(HOVER_SELECTOR)) {
        arrow.classList.add('is-hovering');
        cluster.classList.add('is-hovering');
        cluster.classList.add('is-idle');
        soundHaptics.play('hover');
        if (!pointerIsDown) {
          radiusTarget = HOVER_RADIUS;
          speedTarget = HOVER_SPEED;
        }
      }
    });
    document.addEventListener('pointerout', function (e) {
      if (!e.target.closest) return;
      if (e.target.closest(TEXT_SELECTOR)) {
        arrow.classList.remove('is-texting');
        cluster.classList.remove('is-texting');
      }
      if (e.target.closest(HOVER_SELECTOR)) {
        arrow.classList.remove('is-hovering');
        cluster.classList.remove('is-hovering');
        cluster.classList.remove('is-idle');
        if (!pointerIsDown) {
          radiusTarget = BASE_RADIUS;
          speedTarget = BASE_SPEED;
        }
      }
    });

    window.addEventListener('wheel', function (e) {
      if (!active || nativeEdge) return;
      clearIdleState();
      if (e.ctrlKey) {
        cluster.classList.add('is-zooming');
        radiusTarget = e.deltaY < 0 ? HOVER_RADIUS + 7 : PRESS_RADIUS + 2;
        speedTarget = 0.18;
        clearTimeout(zoomTimer);
        zoomTimer = setTimeout(function () {
          cluster.classList.remove('is-zooming');
          radiusTarget = cluster.classList.contains('is-hovering') ? HOVER_RADIUS : BASE_RADIUS;
          speedTarget = cluster.classList.contains('is-hovering') ? HOVER_SPEED : BASE_SPEED;
        }, 330);
        return;
      }
      spawnAction(mx, my, 'v2-cursor-scroll');
      cluster.classList.add('is-scrolling');
      soundHaptics.play('scroll');
      radiusTarget = HOVER_RADIUS + 2;
      speedTarget = 0.12;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        cluster.classList.remove('is-scrolling');
        radiusTarget = cluster.classList.contains('is-hovering') ? HOVER_RADIUS : BASE_RADIUS;
        speedTarget = cluster.classList.contains('is-hovering') ? HOVER_SPEED : BASE_SPEED;
      }, 220);
    }, { passive: true });

    function loop() {
      cx += (mx - cx) * 0.46;
      cy += (my - cy) * 0.46;
      radius += (radiusTarget - radius) * 0.22;
      speed += (speedTarget - speed) * 0.16;
      orbitAngle += speed;

      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      arrow.style.transform = 'translate3d(' + (mx + 4) + 'px,' + (my + 5) + 'px,0) rotate(-7deg)';

      var particlesVisible = cluster.classList.contains('is-idle') ||
        cluster.classList.contains('is-hovering') ||
        cluster.classList.contains('is-left-click') ||
        cluster.classList.contains('is-right-click') ||
        cluster.classList.contains('is-dragging') ||
        cluster.classList.contains('is-scrolling') ||
        cluster.classList.contains('is-zooming');
      var anchorX = particlesVisible ? mx + 10 : cx;
      var anchorY = particlesVisible ? my + 12 : cy;

      PARTICLES.forEach(function (particle) {
        var angle = orbitAngle + particle.baseAngle;
        var rx = radius, ry = radius;
        if (isDragging) {
          rx = radius * 2;
          ry = radius * 0.42;
        }
        var px = Math.cos(angle) * rx;
        var py = Math.sin(angle) * ry;
        if (isDragging) {
          var cos = Math.cos(dragAngle), sin = Math.sin(dragAngle);
          var rpx = px * cos - py * sin;
          var rpy = px * sin + py * cos;
          px = rpx;
          py = rpy;
        }
        particle.el.style.transform = 'translate3d(' + (anchorX + px) + 'px,' + (anchorY + py) + 'px,0)';
      });
      bar.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
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
