// Home hero: a Three.js "double-helix photo strand" built from Valentine's
// own field/lab/portrait photographs (rendered as circular sprite nodes
// wound around two DNA-style strands, with cross "rungs" between paired
// nodes) -- a literal genetic-data motif, rendered full-bleed across the
// whole hero as ambient atmosphere behind the text (left) and the fading
// portrait (right). Captions come from window.VG_HERO_CAPTIONS, set inline
// by index.md from _data/gallery_portraits.yml -- single source of truth.
import * as THREE from '/assets/js/vendor/three.module.min.js';

(function () {
  const heroEl = document.querySelector('.hero-v2');
  if (!heroEl) return;
  // The canvas is now a full-bleed ambient layer across the whole hero
  // (not a bounded side frame) -- it sizes/rotates/raycasts against the
  // section itself.
  const visualEl = heroEl;

  const canvas = visualEl.querySelector('.hero-v2__canvas');
  const gridFloor = visualEl.querySelector('.hero-v2__grid-floor');
  const captionEl = document.getElementById('hero-v2-photo-caption');
  const captionImgEl = captionEl ? captionEl.querySelector('.hero-v2__photo-caption-img') : null;
  const captionTextEl = captionEl ? captionEl.querySelector('.hero-v2__photo-caption-text') : null;
  const captionMetaEl = captionEl ? captionEl.querySelector('.hero-v2__photo-caption-meta') : null;
  const CAPTIONS = window.VG_HERO_CAPTIONS || {};
  const ALL_FILES = Object.keys(CAPTIONS);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmall = window.innerWidth < 720;
  const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
  const isSlowConn = !!(conn && (conn.saveData || /2g/.test(conn.effectiveType || '')));
  const skipWebGL = prefersReduced || isSlowConn || !ALL_FILES.length;

  // No hardcoded fallback colour here -- .hero-v2__canvas's own CSS
  // background (var(--v2-void-raised)) already adapts to whichever of the
  // 4 themes is active; a fixed dark navy would look like a broken blob
  // against the light/bright themes' cream void.
  if (skipWebGL) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(visualEl.clientWidth, visualEl.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, visualEl.clientWidth / visualEl.clientHeight, 0.1, 100);
  camera.position.z = 11;
  // The canvas now spans the whole hero, not a bounded side frame -- shift
  // the helix left of center so it reads as sitting behind the text
  // column (the "kinetic data-node web on the left" the alternate hero
  // asked for) instead of dead-center of a much wider frame. Pulled the
  // offset in (-3.4 -> -2.1) on direct feedback to extend the web further
  // toward the portrait instead of stopping short of it -- it now reaches
  // into the gap and under the portrait's own left-fade zone, where it
  // shows through, rather than staying confined to strictly the text side.
  const isWide = visualEl.clientWidth > 960;
  scene.position.x = isWide ? -2.1 : 0;

  const files = isSmall ? ALL_FILES.filter((_, i) => i % 2 === 0) : ALL_FILES;
  const loader = new THREE.TextureLoader();
  const nodes = [];
  const nodeMeta = [];
  const sprites = [];

  // Two strands wound around a shared vertical axis, 180 degrees out of
  // phase, like a double helix -- an actual genetic-data motif rather than
  // an undirected cloud.
  const HELIX_RADIUS = 3.6;
  const HELIX_HEIGHT = 10.5;
  const HELIX_TURNS = 2.6;
  const totalPairs = Math.max(Math.ceil(files.length / 2), 1);

  files.forEach((file, i) => {
    const strand = i % 2;
    const pairIndex = Math.floor(i / 2);
    const t = totalPairs > 1 ? pairIndex / (totalPairs - 1) : 0.5;
    const angle = t * Math.PI * 2 * HELIX_TURNS + strand * Math.PI;
    const x = HELIX_RADIUS * Math.cos(angle);
    const y = (t - 0.5) * HELIX_HEIGHT;
    const z = HELIX_RADIUS * Math.sin(angle);
    const pos = new THREE.Vector3(x, y, z);
    nodes.push(pos);
    nodeMeta.push({ strand: strand, pairIndex: pairIndex });

    const tex = loader.load('/assets/img/hero-nodes/' + file + '.webp');
    tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0.94 });
    const sprite = new THREE.Sprite(mat);
    const scale = 0.6 + Math.random() * 0.26;
    sprite.scale.set(scale, scale, 1);
    sprite.position.copy(pos);
    sprite.userData.file = file;
    sprite.userData.baseScale = scale;
    scene.add(sprite);
    sprites.push(sprite);
  });

  const DUST_COUNT = isSmall ? 50 : 120;
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = HELIX_RADIUS * 1.7 + Math.random() * 1.4;
    dustPos[i * 3] = r * Math.cos(angle);
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * (HELIX_HEIGHT + 3);
    dustPos[i * 3 + 2] = r * Math.sin(angle) - 1;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0x8b4a42, size: 0.035, transparent: true, opacity: 0.45 });
  scene.add(new THREE.Points(dustGeo, dustMat));

  // Sequential same-strand connections (each strand reads as one continuous
  // spiral) plus cross "rungs" between the two strands' paired nodes (the
  // DNA base-pair look) -- explicit pairing, not proximity-based, since
  // opposite-strand nodes at the same height sit on opposite sides of the
  // cylinder and would never trigger a distance-based link. Tracked by
  // SPRITE INDEX (not a static Vector3 snapshot) so the line buffer can be
  // rebuilt from each sprite's current (possibly cursor-repelled) position
  // every frame -- see the repulsion physics below.
  const strandNodes = [[], []];
  nodes.forEach((pos, i) => { strandNodes[nodeMeta[i].strand].push({ index: i, pairIndex: nodeMeta[i].pairIndex }); });
  const lineConnections = [];
  [0, 1].forEach((s) => {
    strandNodes[s].sort((a, b) => a.pairIndex - b.pairIndex);
    for (let k = 0; k < strandNodes[s].length - 1; k++) {
      lineConnections.push([strandNodes[s][k].index, strandNodes[s][k + 1].index]);
    }
  });
  for (let p = 0; p < totalPairs; p++) {
    var nA = strandNodes[0].filter(function (n) { return n.pairIndex === p; })[0];
    var nB = strandNodes[1].filter(function (n) { return n.pairIndex === p; })[0];
    if (nA && nB) lineConnections.push([nA.index, nB.index]);
  }
  const linePositions = new Float32Array(lineConnections.length * 6);
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: 0x5c3330, transparent: true, opacity: 0.35 });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));
  function syncLinePositions() {
    for (let k = 0; k < lineConnections.length; k++) {
      const a = sprites[lineConnections[k][0]].position;
      const b = sprites[lineConnections[k][1]].position;
      const o = k * 6;
      linePositions[o] = a.x; linePositions[o + 1] = a.y; linePositions[o + 2] = a.z;
      linePositions[o + 3] = b.x; linePositions[o + 4] = b.y; linePositions[o + 5] = b.z;
    }
    lineGeo.attributes.position.needsUpdate = true;
  }
  syncLinePositions();

  // Cursor-repulsion physics: nodes push away from the cursor and spring
  // back to their base helix position when released -- ported from a
  // reference particle-hero's proximity-repel technique, applied to these
  // ~15-30 real-photo nodes instead of 50,000 abstract particles (which
  // would cost a fresh Vector3 allocation per particle per frame; at this
  // node count the per-frame math below is negligible). mouseWorld is a
  // rough screen-to-world approximation (matches the reference's own
  // simplified projection), not a full raycast unprojection -- precise
  // enough for a proximity effect, much cheaper than one.
  const REPEL_RADIUS = 2.2, REPEL_FORCE = 0.05, SPRING = 0.02, DAMPING = 0.9;
  const velocities = nodes.map(() => new THREE.Vector3());
  const mouseWorld = new THREE.Vector3(9999, 9999, 9999);

  let targetRotY = 0, targetRotX = 0, curRotY = 0, curRotX = 0;
  visualEl.addEventListener('pointermove', (e) => {
    const r = visualEl.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    targetRotY = nx * 0.4;
    targetRotX = ny * 0.2;
    mouseWorld.set(nx * HELIX_RADIUS * 2.4, ny * -HELIX_HEIGHT * 0.9, 0);
  });
  visualEl.addEventListener('pointerleave', () => { mouseWorld.set(9999, 9999, 9999); });

  let scrollProgress = 0;
  window.addEventListener('scroll', () => {
    scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
    if (gridFloor) gridFloor.style.opacity = (0.22 * (1 - Math.min(window.scrollY / (window.innerHeight * 0.6), 1))).toFixed(3);
  }, { passive: true });

  let heroVisible = true;
  let rafRunning = true;
  const heroObserver = new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && !rafRunning) { rafRunning = true; requestAnimationFrame(animate); }
  }, { threshold: 0 });
  heroObserver.observe(visualEl);

  const raycaster = new THREE.Raycaster();
  const pointerVec = new THREE.Vector2();
  let hovered = null;
  function updateHover(clientX, clientY) {
    const r = visualEl.getBoundingClientRect();
    pointerVec.x = ((clientX - r.left) / r.width) * 2 - 1;
    pointerVec.y = -((clientY - r.top) / r.height) * 2 + 1;
    raycaster.setFromCamera(pointerVec, camera);
    const hits = raycaster.intersectObjects(sprites);
    const hit = hits[0] ? hits[0].object : null;
    if (hit !== hovered) {
      if (hovered) {
        const b = hovered.userData.baseScale;
        window.gsap ? gsap.to(hovered.scale, { x: b, y: b, duration: 0.3 }) : hovered.scale.set(b, b, 1);
      }
      hovered = hit;
      if (hovered && captionEl) {
        const s = hovered.userData.baseScale * 1.16;
        window.gsap ? gsap.to(hovered.scale, { x: s, y: s, duration: 0.3, ease: 'back.out(2)' }) : hovered.scale.set(s, s, 1);
        const meta = CAPTIONS[hovered.userData.file] || {};
        if (captionImgEl) captionImgEl.src = meta.src || '';
        if (captionTextEl) captionTextEl.textContent = meta.caption || '';
        if (captionMetaEl) {
          var metaBits = [meta.year, meta.location].filter(Boolean);
          captionMetaEl.textContent = metaBits.join(' · ');
        }
        captionEl.classList.add('is-visible');
      } else if (captionEl) {
        captionEl.classList.remove('is-visible');
      }
    }
    if (hovered && captionEl) {
      captionEl.style.left = clientX + 'px';
      captionEl.style.top = clientY + 'px';
    }
  }
  visualEl.addEventListener('pointermove', (e) => updateHover(e.clientX, e.clientY), { passive: true });
  visualEl.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (t) updateHover(t.clientX, t.clientY);
  }, { passive: true });

  const _repelDir = new THREE.Vector3();
  const _springDir = new THREE.Vector3();
  function updateRepulsion() {
    for (let i = 0; i < sprites.length; i++) {
      const pos = sprites[i].position;
      const base = nodes[i];
      const vel = velocities[i];
      const dist = pos.distanceTo(mouseWorld);
      if (dist < REPEL_RADIUS) {
        _repelDir.copy(pos).sub(mouseWorld).normalize();
        vel.addScaledVector(_repelDir, (REPEL_RADIUS - dist) * REPEL_FORCE);
      }
      _springDir.copy(base).sub(pos);
      vel.addScaledVector(_springDir, SPRING);
      vel.multiplyScalar(DAMPING);
      pos.add(vel);
    }
    syncLinePositions();
  }

  function animate() {
    if (!heroVisible) { rafRunning = false; return; }
    curRotY += (targetRotY - curRotY) * 0.04;
    curRotX += (targetRotX - curRotX) * 0.04;
    scene.rotation.y = curRotY + performance.now() * 0.00003;
    scene.rotation.x = curRotX;
    camera.position.z = 11 - scrollProgress * 3;
    camera.position.y = scrollProgress * -1.5;
    updateRepulsion();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = visualEl.clientWidth / visualEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(visualEl.clientWidth, visualEl.clientHeight);
  });
})();
