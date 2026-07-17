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
});
