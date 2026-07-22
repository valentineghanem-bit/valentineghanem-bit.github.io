// Skills page: an interconnected-domains network -- the real 15 domains
// from site.data.profile.knows_about (already used for this site's own
// JSON-LD), laid out as labelled nodes on a plain 2D canvas, connected by
// lines, reacting to the cursor. The cursor push-away/spring-back physics
// is the same technique built for the Home hero's helix nodes (itself
// ported from a "Woven Light" reference) -- applied here to text-label
// nodes instead of photos, a distinct visual from both the hero and this
// page's own skills-matrix heatmap.
(function () {
  var host = document.querySelector('[data-skills-network]');
  if (!host) return;
  var canvas = host.querySelector('.skills-v2__network-canvas');
  var dataEl = document.getElementById('skills-network-data');
  var domains = [];
  try { domains = JSON.parse(dataEl.textContent); } catch (e) {}
  if (!canvas || !domains.length) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Each node is a distinct labelled domain, not repeated chrome -- cycling
  // colour here marks real per-entity difference (same legitimate exception
  // the reference boards use for genuinely different data categories), unlike
  // the flat repeated cards/suffixes fixed elsewhere. --v2-blue was retired
  // in round 15 (renamed --v2-cyan) but this array kept the dead name, so
  // every 5th node silently inherited the previous fillStyle instead of an
  // accent -- fixed to the live token.
  var ACCENTS = ['--v2-violet', '--v2-crimson', '--v2-mint', '--v2-yellow', '--v2-cyan'];
  function accentColor(i) {
    return getComputedStyle(document.documentElement).getPropertyValue(ACCENTS[i % ACCENTS.length]).trim();
  }

  var width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    var r = host.getBoundingClientRect();
    width = r.width; height = r.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Base layout: an ellipse, evenly spaced -- reads as an organised "web"
  // rather than a random scatter.
  var nodes = domains.map(function (label, i) {
    var angle = (i / domains.length) * Math.PI * 2;
    return { label: label, angle: angle, baseX: 0, baseY: 0, x: 0, y: 0, vx: 0, vy: 0, color: accentColor(i) };
  });
  function layout() {
    var cx = width / 2, cy = height / 2;
    var rx = Math.max(width * 0.38, 40), ry = Math.max(height * 0.36, 30);
    nodes.forEach(function (n) {
      n.baseX = cx + rx * Math.cos(n.angle);
      n.baseY = cy + ry * Math.sin(n.angle);
      if (!n.laidOut) { n.x = n.baseX; n.y = n.baseY; n.laidOut = true; }
    });
  }
  layout();
  window.addEventListener('resize', layout, { passive: true });

  // Connect each node to its next two neighbours around the ellipse -- a
  // connected ring-with-chords web (~2x domains.length edges), not a full
  // mesh (which at 15 nodes would be 105 lines and read as visual noise).
  var edges = [];
  nodes.forEach(function (_, i) {
    edges.push([i, (i + 1) % nodes.length]);
    edges.push([i, (i + 2) % nodes.length]);
  });

  var mouse = { x: -9999, y: -9999 };
  host.addEventListener('pointermove', function (e) {
    var r = host.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  host.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });

  var REPEL_RADIUS = 70, REPEL_FORCE = 1.6, SPRING = 0.02, DAMPING = 0.88;

  function draw() {
    ctx.clearRect(0, 0, width, height);
    var lineColor = getComputedStyle(document.documentElement).getPropertyValue('--v2-glass-border').trim();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    edges.forEach(function (e) {
      var a = nodes[e[0]], b = nodes[e[1]];
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
    var inkSoft = getComputedStyle(document.documentElement).getPropertyValue('--v2-ink-soft').trim();
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.fill();
      ctx.font = '11px "Space Mono", ui-monospace, monospace';
      ctx.fillStyle = inkSoft;
      ctx.textAlign = n.x > width / 2 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x + (n.x > width / 2 ? 9 : -9), n.y);
    });
  }

  function step() {
    nodes.forEach(function (n) {
      var dx = n.x - mouse.x, dy = n.y - mouse.y;
      var dist = Math.hypot(dx, dy) || 0.001;
      if (dist < REPEL_RADIUS) {
        var force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_FORCE;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
      }
      n.vx += (n.baseX - n.x) * SPRING;
      n.vy += (n.baseY - n.y) * SPRING;
      n.vx *= DAMPING; n.vy *= DAMPING;
      n.x += n.vx; n.y += n.vy;
    });
  }

  if (prefersReduced) { draw(); return; }

  var visible = true, running = false;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !running) { running = true; requestAnimationFrame(frame); }
    }, { threshold: 0 }).observe(host);
  }
  function frame() {
    if (!visible) { running = false; return; }
    step();
    draw();
    requestAnimationFrame(frame);
  }
  running = true;
  frame();
})();
