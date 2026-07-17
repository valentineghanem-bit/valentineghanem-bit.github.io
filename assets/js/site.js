(function () {
  var saved = localStorage.getItem('vg-theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

function vgShowToast(msg) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
}

document.addEventListener('DOMContentLoaded', function () {
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar
  var progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  function updateProgress() {
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var height = h.scrollHeight - h.clientHeight;
    progress.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Floating toolbar: dark-mode toggle + back-to-top
  var toolbar = document.createElement('div');
  toolbar.className = 'site-toolbar';
  toolbar.innerHTML =
    '<button type="button" class="site-toolbar__btn site-toolbar__btn--theme" aria-label="Toggle dark mode" title="Toggle dark mode">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.5 5.5 0 0 1 12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
    '</button>' +
    '<button type="button" class="site-toolbar__btn site-toolbar__btn--top" aria-label="Back to top" title="Back to top">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>';
  document.body.appendChild(toolbar);
  var themeBtn = toolbar.querySelector('.site-toolbar__btn--theme');
  var topBtn = toolbar.querySelector('.site-toolbar__btn--top');
  function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  themeBtn.addEventListener('click', function () {
    if (isDark()) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('vg-theme', 'light'); }
    else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('vg-theme', 'dark'); }
  });
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('is-visible', window.scrollY > 480);
  }, { passive: true });

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Dropdown ("Explore") menu
  document.querySelectorAll('.nav-dropdown').forEach(function (dd) {
    var trigger = dd.querySelector('.nav-dropdown__trigger');
    if (!trigger) return;
    function close() { dd.classList.remove('is-open'); trigger.setAttribute('aria-expanded', 'false'); }
    function open() { dd.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.contains('is-open') ? close() : open();
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    dd.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (!prefersReduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Stat counters (count up when scrolled into view)
  var stats = document.querySelectorAll('.stat__number[data-target]');
  function animateStat(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var start = null, duration = 1100;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(target * eased);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (stats.length && 'IntersectionObserver' in window) {
    var statIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateStat(entry.target); statIo.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { statIo.observe(el); });
  } else {
    stats.forEach(function (el) { el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix') || ''); });
  }

  // Hero portrait parallax
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !prefersReduced) {
    var ticking = false;
    function updateParallax() {
      var y = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translateY(' + Math.min(y * speed, 60) + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
  }

  // Skills toolkit filter (category select + domain select + live search)
  var skillsRoot = document.querySelector('[data-skills-root]');
  if (skillsRoot) {
    var catSelect = skillsRoot.querySelector('#skills-category');
    var domSelect = skillsRoot.querySelector('#skills-domain');
    var searchInput = skillsRoot.querySelector('#skills-search');
    var resetBtn = skillsRoot.querySelector('.filter-toolbar__reset');
    var emptyMsg = skillsRoot.querySelector('.filter-empty');
    var sections = Array.prototype.slice.call(skillsRoot.querySelectorAll('.skills-section'));

    function applyFilters() {
      var cat = catSelect.value;
      var dom = domSelect.value;
      var q = searchInput.value.trim().toLowerCase();
      var anySectionVisible = false;
      sections.forEach(function (sec) {
        var secCat = sec.getAttribute('data-category');
        var catMatch = (cat === 'all' || cat === secCat);
        var anyCardVisible = false;
        sec.querySelectorAll('.card').forEach(function (card) {
          var cardDom = card.getAttribute('data-domain');
          var domMatch = (dom === 'all' || dom === cardDom);
          var anyItemVisible = false;
          card.querySelectorAll('.card__list li').forEach(function (li) {
            var text = li.textContent.toLowerCase();
            var visible = catMatch && domMatch && (!q || text.indexOf(q) !== -1);
            li.hidden = !visible;
            if (visible) anyItemVisible = true;
          });
          card.hidden = !(catMatch && domMatch && anyItemVisible);
          if (!card.hidden) anyCardVisible = true;
        });
        sec.hidden = !anyCardVisible;
        if (!sec.hidden) anySectionVisible = true;
      });
      if (emptyMsg) emptyMsg.classList.toggle('is-visible', !anySectionVisible);
      skillsRoot.querySelectorAll('.skills-matrix__cell').forEach(function (btn) {
        var match = btn.getAttribute('data-category') === cat && btn.getAttribute('data-domain') === dom;
        btn.classList.toggle('is-active', match && cat !== 'all' && dom !== 'all');
      });
    }

    if (catSelect) catSelect.addEventListener('change', applyFilters);
    if (domSelect) domSelect.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', function () {
      catSelect.value = 'all'; domSelect.value = 'all'; searchInput.value = '';
      applyFilters();
    });
    skillsRoot.querySelectorAll('.skills-matrix__cell').forEach(function (btn) {
      btn.addEventListener('click', function () {
        catSelect.value = btn.getAttribute('data-category');
        domSelect.value = btn.getAttribute('data-domain');
        applyFilters();
      });
    });
  }

  // Publications filter (year select + live search across title/journal/summary)
  var pubsRoot = document.querySelector('[data-pubs-root]');
  if (pubsRoot) {
    var pubYear = pubsRoot.querySelector('#pubs-year');
    var pubSearch = pubsRoot.querySelector('#pubs-search');
    var pubReset = pubsRoot.querySelector('.filter-toolbar__reset');
    var pubEmpty = pubsRoot.querySelector('.filter-empty');
    var pubItems = Array.prototype.slice.call(pubsRoot.querySelectorAll('.feed-item[data-year]'));
    function applyPubFilters() {
      var yr = pubYear.value;
      var q = pubSearch.value.trim().toLowerCase();
      var anyVisible = false;
      pubItems.forEach(function (item) {
        var yrMatch = (yr === 'all' || item.getAttribute('data-year') === yr);
        var qMatch = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
        var visible = yrMatch && qMatch;
        item.hidden = !visible;
        if (visible) anyVisible = true;
      });
      if (pubEmpty) pubEmpty.classList.toggle('is-visible', !anyVisible);
    }
    if (pubYear) pubYear.addEventListener('change', applyPubFilters);
    if (pubSearch) pubSearch.addEventListener('input', applyPubFilters);
    if (pubReset) pubReset.addEventListener('click', function () { pubYear.value = 'all'; pubSearch.value = ''; applyPubFilters(); });

    var pubSort = pubsRoot.querySelector('#pubs-sort');
    var pubList = pubsRoot.querySelector('[data-pub-list]');
    if (pubSort && pubList) {
      pubSort.addEventListener('change', function () {
        var mode = pubSort.value;
        var items = Array.prototype.slice.call(pubList.querySelectorAll('.feed-item[data-year]'));
        items.sort(function (a, b) {
          if (mode === 'title') return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
          var ya = parseInt(a.getAttribute('data-year'), 10), yb = parseInt(b.getAttribute('data-year'), 10);
          return mode === 'oldest' ? ya - yb : yb - ya;
        });
        items.forEach(function (it) { pubList.appendChild(it); });
      });
    }
    pubsRoot.querySelectorAll('.copy-btn[data-citation]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-citation');
        var done = function () {
          btn.classList.add('is-copied');
          vgShowToast('Citation copied to clipboard');
          setTimeout(function () { btn.classList.remove('is-copied'); }, 1600);
        };
        if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, done); }
        else { done(); }
      });
    });
  }

  // Portfolio category filter chips
  var portfolioRoot = document.querySelector('[data-portfolio-root]');
  if (portfolioRoot) {
    var pfChips = Array.prototype.slice.call(portfolioRoot.querySelectorAll('.filter-chip'));
    var pfSections = Array.prototype.slice.call(portfolioRoot.querySelectorAll('[data-portfolio-section]'));
    pfChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        pfChips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var cat = chip.getAttribute('data-filter');
        pfSections.forEach(function (sec) {
          sec.hidden = !(cat === 'all' || sec.getAttribute('data-portfolio-section') === cat);
        });
      });
    });
  }

  // CPD log filter (year select)
  var cpdRoot = document.querySelector('[data-cpd-root]');
  if (cpdRoot) {
    var cpdYear = cpdRoot.querySelector('#cpd-year');
    var cpdGroups = Array.prototype.slice.call(cpdRoot.querySelectorAll('.cpd-year-group'));
    if (cpdYear) cpdYear.addEventListener('change', function () {
      var yr = cpdYear.value;
      cpdGroups.forEach(function (g) { g.hidden = (yr !== 'all' && g.getAttribute('data-year') !== yr); });
    });
  }

  // Carousels
  document.querySelectorAll('.carousel').forEach(function (root) {
    var track = root.querySelector('.carousel__track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
    var prevBtn = root.querySelector('.carousel__arrow--prev');
    var nextBtn = root.querySelector('.carousel__arrow--next');
    var dotsWrap = root.querySelector('.carousel__dots');
    if (!track || !slides.length) return;
    var index = 0;
    var autoplayMs = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
    var timer = null;

    slides.forEach(function (slide, i) {
      var img = slide.querySelector('img');
      if (img) {
        img.addEventListener('error', function () {
          if (slide.classList.contains('carousel__slide--broken')) return;
          slide.classList.add('carousel__slide--broken');
          img.style.display = 'none';
          var msg = document.createElement('div');
          msg.className = 'carousel__broken-inner';
          msg.innerHTML = '<span class="empty-state__mark">Photo pending upload</span>';
          slide.insertBefore(msg, slide.firstChild);
        }, { once: true });
      }
      if (dotsWrap) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetAutoplay(); });
        dotsWrap.appendChild(dot);
      }
    });

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); });
      if (dotsWrap) {
        Array.prototype.forEach.call(dotsWrap.children, function (d, i) { d.classList.toggle('is-active', i === index); });
      }
    }
    function goTo(i) { index = (i + slides.length) % slides.length; render(); }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }
    function resetAutoplay() {
      if (!autoplayMs) return;
      clearInterval(timer);
      timer = setInterval(next, autoplayMs);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAutoplay(); });
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); resetAutoplay(); }
      if (e.key === 'ArrowLeft') { prev(); resetAutoplay(); }
    });

    var touchStartX = null;
    track.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetAutoplay(); }
      touchStartX = null;
    }, { passive: true });

    if (autoplayMs && !prefersReduced) {
      timer = setInterval(next, autoplayMs);
      root.addEventListener('mouseenter', function () { clearInterval(timer); });
      root.addEventListener('mouseleave', resetAutoplay);
    }
    render();
  });

  // Tactile bento micro-interactions: a real mass-spring-damper simulation
  // (not a CSS easing curve) drives tilt/lift/press on .card, .toc-card and
  // .event-card. Reads pointer position, writes --tilt-x/--tilt-y/--lift/
  // --press-scale custom properties that the CSS transform already composes
  // from -- so with JS disabled or reduced-motion requested, cards simply
  // keep their plain CSS :hover lift and remain fully usable either way.
  if (!prefersReduced) {
    var STIFFNESS = 300;
    var DAMPING = 20;
    var springs = [];

    function makeAxis() { return { value: 0, velocity: 0, target: 0 }; }
    function stepAxis(axis, dt) {
      var accel = -STIFFNESS * (axis.value - axis.target) - DAMPING * axis.velocity;
      axis.velocity += accel * dt;
      axis.value += axis.velocity * dt;
    }
    function atRest(axis) {
      return Math.abs(axis.value - axis.target) < 0.001 && Math.abs(axis.velocity) < 0.001;
    }

    var loopRunning = false;
    var lastTs = null;
    function loop(ts) {
      if (!lastTs) lastTs = ts;
      var dt = Math.min((ts - lastTs) / 1000, 0.032);
      lastTs = ts;
      var anyActive = false;
      springs.forEach(function (s) {
        stepAxis(s.tiltX, dt); stepAxis(s.tiltY, dt); stepAxis(s.scale, dt);
        if (!(atRest(s.tiltX) && atRest(s.tiltY) && atRest(s.scale))) anyActive = true;
        s.el.style.setProperty('--tilt-x', s.tiltX.value.toFixed(3) + 'deg');
        s.el.style.setProperty('--tilt-y', s.tiltY.value.toFixed(3) + 'deg');
        s.el.style.setProperty('--press-scale', (1 + s.scale.value).toFixed(4));
      });
      if (anyActive) {
        requestAnimationFrame(loop);
      } else {
        loopRunning = false;
        lastTs = null;
      }
    }
    function ensureLoop() {
      if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); }
    }

    document.querySelectorAll('.card, .toc-card, .event-card').forEach(function (el) {
      var s = { el: el, tiltX: makeAxis(), tiltY: makeAxis(), scale: makeAxis() };
      springs.push(s);
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        s.tiltY.target = px * 6;
        s.tiltX.target = py * -6;
        ensureLoop();
      });
      el.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        s.scale.target = 0.018;
        ensureLoop();
      });
      el.addEventListener('pointerleave', function () {
        s.tiltX.target = 0; s.tiltY.target = 0; s.scale.target = 0;
        ensureLoop();
      });
      el.addEventListener('pointerdown', function (e) {
        if (e.pointerType === 'touch') return;
        s.scale.target = -0.02; // Z-axis compression on press
        ensureLoop();
      });
      el.addEventListener('pointerup', function (e) {
        if (e.pointerType === 'touch') return;
        s.scale.target = 0.018;
        ensureLoop();
      });
    });

    // Magnetic buttons: CTAs and toolbar buttons drift toward a nearby cursor
    // within a small radius, using the same spring engine as the cards.
    // Composes with each button's existing --btn-lift hover state via CSS
    // custom properties, so hover/press styling is unchanged, just layered.
    var MAGNET_RADIUS = 80;
    var MAGNET_STRENGTH = 0.4;
    var MAGNET_MAX = 10;
    var magnets = [];
    document.querySelectorAll('.btn, .site-toolbar__btn').forEach(function (el) {
      magnets.push({ el: el, x: makeAxis(), y: makeAxis() });
    });

    var magnetLoopRunning = false;
    var magnetLastTs = null;
    function magnetLoop(ts) {
      if (!magnetLastTs) magnetLastTs = ts;
      var dt = Math.min((ts - magnetLastTs) / 1000, 0.032);
      magnetLastTs = ts;
      var anyActive = false;
      magnets.forEach(function (m) {
        stepAxis(m.x, dt); stepAxis(m.y, dt);
        if (!(atRest(m.x) && atRest(m.y))) anyActive = true;
        m.el.style.setProperty('--magnet-x', m.x.value.toFixed(2) + 'px');
        m.el.style.setProperty('--magnet-y', m.y.value.toFixed(2) + 'px');
      });
      if (anyActive) { requestAnimationFrame(magnetLoop); }
      else { magnetLoopRunning = false; magnetLastTs = null; }
    }
    function ensureMagnetLoop() {
      if (!magnetLoopRunning) { magnetLoopRunning = true; requestAnimationFrame(magnetLoop); }
    }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      magnets.forEach(function (m) {
        var r = m.el.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = e.clientX - cx, dy = e.clientY - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAGNET_RADIUS) {
          var pull = (1 - dist / MAGNET_RADIUS) * MAGNET_STRENGTH;
          m.x.target = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, dx * pull));
          m.y.target = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, dy * pull));
        } else {
          m.x.target = 0; m.y.target = 0;
        }
      });
      ensureMagnetLoop();
    }, { passive: true });
  }

  // True masonry for .event-grid: measure each card's real rendered height
  // and greedily place it into whichever column currently totals the
  // least height, so cards pack tight with no leftover space -- unlike a
  // row-based grid, an odd card never leaves a gap beside it either.
  var EVENT_MIN_COL_WIDTH = 300; // narrower than this and photo grids get cramped

  // Largest-first bin packing: assigning the tallest cards before the
  // shorter ones balances the columns far better than DOM-order greedy
  // does. Returns the resulting per-column index lists plus how balanced
  // they came out (max - min column height), so the caller can compare
  // a couple of candidate column counts and keep whichever is tighter.
  function binPack(heights, numCols) {
    var order = heights.map(function (_, i) { return i; });
    order.sort(function (a, b) { return heights[b] - heights[a]; });
    var cols = [];
    var colSums = [];
    for (var i = 0; i < numCols; i++) { cols.push([]); colSums.push(0); }
    order.forEach(function (i) {
      var shortest = 0;
      for (var j = 1; j < numCols; j++) {
        if (colSums[j] < colSums[shortest]) shortest = j;
      }
      cols[shortest].push(i);
      colSums[shortest] += heights[i] + 22;
    });
    return { cols: cols, imbalance: Math.max.apply(null, colSums) - Math.min.apply(null, colSums) };
  }

  function packEventGrids() {
    document.querySelectorAll('.event-grid').forEach(function (grid) {
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.event-card'));
      if (!cards.length) return;

      var gridWidth = grid.getBoundingClientRect().width;
      var byWidth = Math.max(1, Math.min(3, Math.round(gridWidth / 460)));
      var heights = cards.map(function (c) { return c.getBoundingClientRect().height; });

      grid.querySelectorAll('.event-grid__col').forEach(function (col) { col.remove(); });

      if (byWidth === 1) {
        cards.forEach(function (c) { grid.appendChild(c); });
        return;
      }

      // Try the width-implied column count and one more (if it still
      // leaves each column wide enough for a readable photo grid), and
      // keep whichever packs tighter -- an extra column sometimes turns
      // an unavoidable 2-column gap (one tall card vs. two short ones)
      // into a perfectly even split.
      var candidates = [byWidth];
      var extra = byWidth + 1;
      if (extra <= cards.length && gridWidth / extra >= EVENT_MIN_COL_WIDTH) candidates.push(extra);

      var best = null;
      candidates.forEach(function (n) {
        var result = binPack(heights, n);
        if (!best || result.imbalance < best.imbalance) best = { numCols: n, cols: result.cols };
      });

      var colEls = [];
      for (var i = 0; i < best.numCols; i++) {
        var col = document.createElement('div');
        col.className = 'event-grid__col';
        colEls.push(col);
        grid.appendChild(col);
      }
      best.cols.forEach(function (indices, colIndex) {
        indices.forEach(function (cardIndex) { colEls[colIndex].appendChild(cards[cardIndex]); });
      });
    });
  }

  if (document.querySelector('.event-grid')) {
    packEventGrids();
    var packResizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(packResizeTimer);
      packResizeTimer = setTimeout(packEventGrids, 150);
    }, { passive: true });
  }
});
