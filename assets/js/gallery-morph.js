// Gallery morph-hero: scatter -> line -> circle intro (timed), then a
// scroll-pinned circle -> arc morph + shuffle (GSAP ScrollTrigger, scrub).
// Real photos + real captions from window.VG_GALLERY_MORPH (set inline by
// gallery/index.md from _data/gallery_portraits.yml).
(function () {
  var root = document.querySelector('.gallery-morph');
  if (!root) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return; // CSS fallback renders a plain static grid

  var stage = root.querySelector('.gallery-morph__stage');
  var items = window.VG_GALLERY_MORPH || [];
  if (!items.length) return;

  var cards = items.map(function (item) {
    var card = document.createElement('div');
    card.className = 'gallery-morph__card';
    card.innerHTML = '<img src="' + item.src + '" alt="' + item.caption.replace(/"/g, '&quot;') + '" loading="lazy">';
    card.title = item.caption;
    stage.appendChild(card);
    return card;
  });

  var lerp = function (a, b, t) { return a + (b - a) * t; };

  function scatterTarget() {
    return {
      x: (Math.random() - 0.5) * Math.min(window.innerWidth * 0.9, 1100),
      y: (Math.random() - 0.5) * Math.min(window.innerHeight * 0.7, 700),
      rotation: (Math.random() - 0.5) * 140,
      scale: 0.6,
      opacity: 0
    };
  }
  var scatterPositions = cards.map(scatterTarget);

  function apply(card, t) {
    card.style.transform = 'translate(' + t.x.toFixed(1) + 'px,' + t.y.toFixed(1) + 'px) rotate(' + t.rotation.toFixed(2) + 'deg) scale(' + t.scale.toFixed(3) + ')';
    card.style.opacity = String(t.opacity);
  }

  function animateTo(card, target, duration) {
    var start = null;
    var from = card._current || { x: 0, y: 0, rotation: 0, scale: 0.6, opacity: 0 };
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var t = {
        x: lerp(from.x, target.x, eased), y: lerp(from.y, target.y, eased),
        rotation: lerp(from.rotation, target.rotation, eased), scale: lerp(from.scale, target.scale, eased),
        opacity: lerp(from.opacity, target.opacity, eased)
      };
      apply(card, t);
      if (p < 1) requestAnimationFrame(frame);
      else card._current = target;
    }
    requestAnimationFrame(frame);
  }

  // --- Phase 1: scatter (immediate) ---
  cards.forEach(function (card, i) { card._current = scatterPositions[i]; apply(card, scatterPositions[i]); });

  // --- Phase 2: line (500ms in) ---
  setTimeout(function () {
    var spacing = window.innerWidth < 720 ? 46 : 62;
    var total = cards.length * spacing;
    cards.forEach(function (card, i) {
      animateTo(card, { x: i * spacing - total / 2, y: 0, rotation: 0, scale: 1, opacity: 1 }, 900);
    });
  }, 500);

  // --- Phase 3: circle (2500ms in) ---
  var circlePositions = [];
  function computeCircle() {
    // Radius driven primarily by viewport WIDTH (not the shorter of width/
    // height) so the circle reads edge-to-edge with small side gutters on
    // wide screens, instead of staying capped to a small centered medallion.
    // -90 accounts for the card's own half-width (39px) plus a small margin.
    var radius = Math.min(window.innerWidth * 0.5 - 90, window.innerHeight * 0.42, 520);
    radius = Math.max(radius, 140);
    circlePositions = cards.map(function (_, i) {
      var angle = (i / cards.length) * Math.PI * 2;
      return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, rotation: (angle * 180 / Math.PI) + 90, scale: 1, opacity: 1 };
    });
  }
  computeCircle();
  setTimeout(function () {
    cards.forEach(function (card, i) { animateTo(card, circlePositions[i], 1000); });
  }, 2500);

  // --- Phase 4: scroll-pinned circle -> arc morph + shuffle ---
  function computeArc(rotationOffsetDeg) {
    var isMobile = window.innerWidth < 720;
    var arcRadius = Math.min(window.innerWidth, window.innerHeight * 1.4) * (isMobile ? 1.3 : 1.05);
    var apexY = window.innerHeight * (isMobile ? 0.32 : 0.24);
    var centerY = apexY + arcRadius - window.innerHeight / 2;
    var spread = isMobile ? 95 : 125;
    var start = -90 - spread / 2;
    var step = spread / Math.max(cards.length - 1, 1);
    return cards.map(function (_, i) {
      var angleDeg = start + i * step + rotationOffsetDeg;
      var rad = angleDeg * Math.PI / 180;
      return {
        x: Math.cos(rad) * arcRadius, y: Math.sin(rad) * arcRadius + centerY,
        rotation: angleDeg + 90, scale: isMobile ? 1.25 : 1.5, opacity: 1
      };
    });
  }

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    var state = { morph: 0, rotate: 0 };
    ScrollTrigger.create({
      trigger: root.querySelector('.gallery-morph__scroller'),
      start: 'top top',
      end: 'bottom bottom',
      pin: stage,
      scrub: 0.4,
      onUpdate: function (self) {
        var p = self.progress;
        state.morph = Math.min(p / 0.35, 1);
        state.rotate = p > 0.35 ? (p - 0.35) / 0.65 : 0;
        if (state.morph <= 0) return; // still in the timed intro phases
        var arc = computeArc(-state.rotate * 90);
        cards.forEach(function (card, i) {
          var c = circlePositions[i], a = arc[i];
          var t = {
            x: lerp(c.x, a.x, state.morph), y: lerp(c.y, a.y, state.morph),
            rotation: lerp(c.rotation, a.rotation, state.morph), scale: lerp(1, a.scale, state.morph), opacity: 1
          };
          card._current = t;
          apply(card, t);
        });
      }
    });
  }

  window.addEventListener('resize', function () { computeCircle(); }, { passive: true });
})();
