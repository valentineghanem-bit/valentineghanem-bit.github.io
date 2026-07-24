// v3 template behavior -- ported from the user-provided reference template
// almost verbatim. Real content comes from window.SITE_DATA (injected by a
// small inline script in index.md from the real _data/*.yml files) instead
// of the template's hardcoded placeholder arrays.
(function () {
  var DATA = window.SITE_DATA || {};

  // Bento-tint 6-colour cycle by true page-wide position, not CSS
  // :nth-child -- several pages (Skills, Portfolio) split .v2-bento-tint
  // cards across multiple .card-grid containers, and :nth-child only counts
  // same-parent siblings, so it silently restarts at 1 in every group
  // without this tagging pass. Ported from site.js (JS-only, no new DOM/
  // CSS needed) rather than loading that whole legacy file -- several of
  // its other features create new elements (scroll-progress bar, page-veil
  // transitions, lightbox) that need their own CSS carefully pulled out of
  // style.css first to avoid its broad body/a/h1-h3 rules leaking into the
  // Tailwind-based v3 pages; deferred rather than rushed.
  document.querySelectorAll('.v2-bento-tint').forEach(function (el, i) {
    el.setAttribute('data-tint-cycle', i % 6);
  });

  // Skills toolkit filter (category select + domain select + live search),
  // ported verbatim from site.js.
  var skillsRoot = document.querySelector('[data-skills-root]');
  if (skillsRoot) {
    var catSelect = skillsRoot.querySelector('#skills-category');
    var domSelect = skillsRoot.querySelector('#skills-domain');
    var searchInput = skillsRoot.querySelector('#skills-search');
    var resetBtn = skillsRoot.querySelector('.filter-toolbar__reset');
    var emptyMsg = skillsRoot.querySelector('.filter-empty');
    var sections = Array.prototype.slice.call(skillsRoot.querySelectorAll('.skills-section'));

    var applyFilters = function () {
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
    };

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

  // Hero/portrait parallax -- ported from site.js so About's
  // data-parallax="0.08" portrait (previously inert on v3, nothing read the
  // attribute) actually works.
  var parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var parallaxTicking = false;
    var updateParallax = function () {
      var y = window.scrollY;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        el.style.transform = 'translateY(' + Math.min(y * speed, 60) + 'px)';
      });
      parallaxTicking = false;
    };
    window.addEventListener('scroll', function () {
      if (!parallaxTicking) { requestAnimationFrame(updateParallax); parallaxTicking = true; }
    }, { passive: true });
  }

  // ---------- Explore dropdown (replaces the old nav's flat 7-link row --
  // matches the existing site-wide nav.html pattern: Home, About, Explore
  // (dropdown: Community/Skills/Publications/Portfolio/Certificates/Press/
  // Field Map), Gallery -- same 10 pages, same grouping). ----------
  window.toggleExploreDropdown = function () {
    var menu = document.getElementById('exploreMenu');
    var trigger = document.getElementById('exploreTrigger');
    if (!menu) return;
    var isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  };
  document.addEventListener('click', function (e) {
    var menu = document.getElementById('exploreMenu');
    var wrap = document.getElementById('exploreDropdown');
    if (!menu || menu.classList.contains('hidden')) return;
    if (wrap && !wrap.contains(e.target)) window.toggleExploreDropdown();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var menu = document.getElementById('exploreMenu');
      if (menu && !menu.classList.contains('hidden')) window.toggleExploreDropdown();
    }
  });

  // ---------- Typewriter: cycles through the real job titles one
  // character at a time. Deliberately independent of GSAP (a past bug had
  // this gated behind a GSAP timeline callback, so a slow/blocked GSAP
  // load silently killed it) -- runs off nothing but setTimeout. ----------
  function startTypewriter() {
    var el = document.querySelector('[data-typed-text]');
    if (!el) return;
    var words;
    try { words = JSON.parse(el.getAttribute('data-words')); } catch (e) { words = []; }
    if (!words || !words.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.textContent = words[0]; return; }
    var wordIndex = 0, charIndex = 0, deleting = false;
    function tick() {
      var word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) { deleting = true; setTimeout(tick, 1800); return; }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(tick, 400); return; }
        setTimeout(tick, 30);
      }
    }
    tick();
  }

  // ---------- Soft classical piano ambience -- synthesized locally.
  // No audio files, no third-party music, and the same mute key as v2 so the
  // visitor's preference stays consistent across templates. ----------
  var vgAudioV3 = (function () {
    var ctx = null, masterGain = null, delayNode = null, feedbackGain = null;
    var isOn = false, button = null, loopTimer = null, chordIndex = 0, startedFromGestureAt = 0;
    var MUTE_KEY = 'vg-v2-audio-muted';
    var wantsOn = localStorage.getItem(MUTE_KEY) !== 'true';
    var lastActivity = Date.now();
    ['scroll', 'mousemove', 'pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, function () { lastActivity = Date.now(); }, { passive: true });
    });
    var currentCutoff = 980;
    function updateEngagement() {
      if (!ctx || !isOn) return;
      var idleMs = Date.now() - lastActivity;
      var engagement = Math.max(0, 1 - idleMs / 18000);
      currentCutoff = 820 + engagement * 620;
      feedbackGain.gain.setTargetAtTime(0.38 - engagement * 0.08, ctx.currentTime, 3.8);
    }
    setInterval(updateEngagement, 2500);
    // Original 40-second miniature: Cadd9 -> G/B -> Am7 -> Fmaj7 -> Dm9
    // -> Em7 -> Fmaj7 -> Gsus -> C. Slower phrase, fuller harmony, and a
    // singable top line so it reads as piano ambience rather than alerts.
    var PIANO_MINIATURE = [
      { t: 0.00, f: 65.41, v: 0.108, d: 4.2, k: 'bass' },
      { t: 0.72, f: 130.81, v: 0.050, d: 3.4, k: 'harmony' },
      { t: 1.38, f: 196.00, v: 0.046, d: 3.1, k: 'harmony' },
      { t: 2.10, f: 293.66, v: 0.066, d: 2.9, k: 'melody' },
      { t: 3.08, f: 329.63, v: 0.074, d: 2.8, k: 'melody' },
      { t: 4.05, f: 392.00, v: 0.066, d: 3.2, k: 'melody' },
      { t: 5.00, f: 61.74, v: 0.100, d: 4.0, k: 'bass' },
      { t: 5.74, f: 123.47, v: 0.048, d: 3.4, k: 'harmony' },
      { t: 6.42, f: 196.00, v: 0.046, d: 3.0, k: 'harmony' },
      { t: 7.20, f: 369.99, v: 0.066, d: 3.0, k: 'melody' },
      { t: 8.18, f: 329.63, v: 0.062, d: 2.8, k: 'melody' },
      { t: 9.05, f: 293.66, v: 0.060, d: 3.3, k: 'melody' },
      { t: 10.00, f: 55.00, v: 0.104, d: 4.2, k: 'bass' },
      { t: 10.76, f: 110.00, v: 0.050, d: 3.4, k: 'harmony' },
      { t: 11.44, f: 164.81, v: 0.046, d: 3.0, k: 'harmony' },
      { t: 12.28, f: 261.63, v: 0.064, d: 3.0, k: 'melody' },
      { t: 13.28, f: 329.63, v: 0.070, d: 2.8, k: 'melody' },
      { t: 14.12, f: 392.00, v: 0.060, d: 3.4, k: 'melody' },
      { t: 15.00, f: 43.65, v: 0.102, d: 4.3, k: 'bass' },
      { t: 15.80, f: 130.81, v: 0.048, d: 3.4, k: 'harmony' },
      { t: 16.54, f: 174.61, v: 0.046, d: 3.0, k: 'harmony' },
      { t: 17.35, f: 349.23, v: 0.067, d: 3.0, k: 'melody' },
      { t: 18.28, f: 329.63, v: 0.060, d: 3.1, k: 'melody' },
      { t: 19.15, f: 261.63, v: 0.064, d: 3.6, k: 'melody' },
      { t: 20.00, f: 73.42, v: 0.104, d: 4.1, k: 'bass' },
      { t: 20.82, f: 146.83, v: 0.050, d: 3.4, k: 'harmony' },
      { t: 21.54, f: 220.00, v: 0.046, d: 3.0, k: 'harmony' },
      { t: 22.42, f: 349.23, v: 0.066, d: 3.0, k: 'melody' },
      { t: 23.38, f: 440.00, v: 0.070, d: 2.8, k: 'melody' },
      { t: 24.20, f: 392.00, v: 0.062, d: 3.3, k: 'melody' },
      { t: 25.00, f: 82.41, v: 0.100, d: 4.0, k: 'bass' },
      { t: 25.76, f: 164.81, v: 0.048, d: 3.3, k: 'harmony' },
      { t: 26.48, f: 246.94, v: 0.045, d: 3.0, k: 'harmony' },
      { t: 27.35, f: 392.00, v: 0.064, d: 3.0, k: 'melody' },
      { t: 28.24, f: 493.88, v: 0.066, d: 2.7, k: 'melody' },
      { t: 29.15, f: 440.00, v: 0.060, d: 3.5, k: 'melody' },
      { t: 30.00, f: 43.65, v: 0.102, d: 4.3, k: 'bass' },
      { t: 30.82, f: 130.81, v: 0.048, d: 3.4, k: 'harmony' },
      { t: 31.52, f: 174.61, v: 0.044, d: 3.0, k: 'harmony' },
      { t: 32.34, f: 349.23, v: 0.062, d: 3.0, k: 'melody' },
      { t: 33.26, f: 392.00, v: 0.066, d: 2.8, k: 'melody' },
      { t: 34.12, f: 329.63, v: 0.058, d: 3.4, k: 'melody' },
      { t: 35.00, f: 49.00, v: 0.106, d: 4.5, k: 'bass' },
      { t: 35.82, f: 146.83, v: 0.050, d: 3.5, k: 'harmony' },
      { t: 36.58, f: 196.00, v: 0.047, d: 3.2, k: 'harmony' },
      { t: 37.42, f: 293.66, v: 0.060, d: 3.1, k: 'melody' },
      { t: 38.34, f: 261.63, v: 0.058, d: 3.2, k: 'melody' },
      { t: 39.15, f: 329.63, v: 0.068, d: 4.6, k: 'melody' }
    ];
    function ensureContext() {
      if (ctx) return ctx;
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      delayNode = ctx.createDelay(2.4);
      delayNode.delayTime.value = 0.62;
      feedbackGain = ctx.createGain();
      feedbackGain.gain.value = 0.28;
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      masterGain.connect(delayNode);
      delayNode.connect(ctx.destination);
      masterGain.connect(ctx.destination);
      return ctx;
    }
    function pluck(freq, when, peak, decay, noteKind) {
      var osc = ctx.createOscillator();
      var octave = ctx.createOscillator();
      var felt = ctx.createOscillator();
      var octaveGain = ctx.createGain();
      var feltGain = ctx.createGain();
      var mix = ctx.createGain();
      var g = ctx.createGain();
      var filt = ctx.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = noteKind === 'melody' ? currentCutoff + 260 : currentCutoff - 140;
      filt.Q.value = 0.28;
      osc.type = 'triangle';
      octave.type = 'sine';
      felt.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.setValueAtTime(noteKind === 'melody' ? -2 : -5, when);
      octave.frequency.value = freq * 2.004;
      octave.detune.setValueAtTime(2, when);
      felt.frequency.value = freq * 0.502;
      felt.detune.setValueAtTime(-3, when);
      octaveGain.gain.value = noteKind === 'melody' ? 0.20 : 0.13;
      feltGain.gain.value = noteKind === 'bass' ? 0.22 : 0.08;
      mix.gain.value = 1;
      g.gain.setValueAtTime(0, when);
      g.gain.linearRampToValueAtTime(peak, when + (noteKind === 'bass' ? 0.032 : 0.020));
      g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak * 0.42), when + 0.52);
      g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
      osc.connect(mix);
      octave.connect(octaveGain); octaveGain.connect(mix);
      felt.connect(feltGain); feltGain.connect(mix);
      mix.connect(g); g.connect(filt); filt.connect(masterGain);
      osc.start(when); octave.start(when); felt.start(when);
      osc.stop(when + decay + 0.12); octave.stop(when + decay + 0.12); felt.stop(when + decay + 0.12);
    }
    function scheduleLoop() {
      if (!isOn || !ctx) return;
      var now = ctx.currentTime + 0.08;
      PIANO_MINIATURE.forEach(function (note) { pluck(note.f, now + note.t, note.v, note.d, note.k); });
      chordIndex++;
      loopTimer = setTimeout(scheduleLoop, 42000);
    }
    function startLoop() {
      var c = ensureContext();
      if (!c) return;
      if (c.state === 'suspended') c.resume();
      masterGain.gain.cancelScheduledValues(c.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, c.currentTime);
      masterGain.gain.linearRampToValueAtTime(3.15, c.currentTime + 0.45);
      updateEngagement();
      if (!loopTimer) scheduleLoop();
    }
    function stopLoop() {
      if (!ctx) return;
      clearTimeout(loopTimer);
      loopTimer = null;
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
    }
    function syncButton() {
      if (!button) return;
      button.setAttribute('aria-pressed', isOn ? 'true' : 'false');
      var onIcon = button.querySelector('.icon-audio-on');
      var offIcon = button.querySelector('.icon-audio-off');
      if (onIcon) onIcon.classList.toggle('hidden', !isOn);
      if (offIcon) offIcon.classList.toggle('hidden', isOn);
    }
    function setOn(next) {
      isOn = next;
      localStorage.setItem(MUTE_KEY, isOn ? 'false' : 'true');
      if (isOn) startLoop(); else stopLoop();
      syncButton();
    }
    function isWaitingForUnlock() {
      return isOn && (!ctx || ctx.state === 'suspended' || !loopTimer);
    }
    function toggle() {
      if (isWaitingForUnlock()) {
        startLoop();
        syncButton();
        return;
      }
      if (isOn && startedFromGestureAt && Date.now() - startedFromGestureAt < 650) {
        return;
      }
      setOn(!isOn);
    }
    if (wantsOn) {
      isOn = true;
      var startOnFirstGesture = function () {
        startedFromGestureAt = Date.now();
        startLoop();
        document.removeEventListener('pointerdown', startOnFirstGesture);
        document.removeEventListener('keydown', startOnFirstGesture);
        document.removeEventListener('touchstart', startOnFirstGesture);
      };
      document.addEventListener('pointerdown', startOnFirstGesture, { once: true });
      document.addEventListener('keydown', startOnFirstGesture, { once: true });
      document.addEventListener('touchstart', startOnFirstGesture, { once: true, passive: true });
    }
    return { toggle: toggle, setButton: function (btn) { button = btn; syncButton(); } };
  })();
  window.toggleAudioV3 = function () {
    vgAudioV3.toggle();
  };
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('audioToggleBtn');
    if (btn) vgAudioV3.setButton(btn);
  });

  // Tailwind's CDN build only reads a literal `.dark` class on <html> (its
  // darkMode:'class' strategy), but this site's existing theme cycle
  // (v2-toolbar.js) toggles a `data-v2-theme` attribute across 4 values,
  // not a class -- bridge the two so the pre-existing 4-way toggle keeps
  // working and the new template's `dark:` utility classes still respond.
  function syncDarkClass() {
    var theme = document.documentElement.getAttribute('data-v2-theme');
    var isDark = theme === 'dark' || theme === 'dim';
    document.documentElement.classList.toggle('dark', isDark);
  }
  syncDarkClass();
  new MutationObserver(syncDarkClass).observe(document.documentElement, { attributes: true, attributeFilter: ['data-v2-theme'] });

  // Same 4-way cycle/localStorage key as the existing v2-toolbar.js (used
  // on every other page), so the theme choice stays consistent if the
  // visitor navigates between this page and the rest of the site, without
  // loading that module's own self-built floating toolbar UI (this
  // template's nav already has its own theme button).
  var THEME_KEY = 'vg-v2-theme';
  var THEMES = ['light', 'bright', 'dim', 'dark'];
  var DEFAULT_THEME = 'light';
  window.cycleThemeV3 = function () {
    var current = document.documentElement.getAttribute('data-v2-theme') || DEFAULT_THEME;
    var next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    if (next === DEFAULT_THEME) document.documentElement.removeAttribute('data-v2-theme');
    else document.documentElement.setAttribute('data-v2-theme', next);
    localStorage.setItem(THEME_KEY, next);
    showToast(next.charAt(0).toUpperCase() + next.slice(1) + ' theme');
  };

  // ---------- Logo top action + auto-hide/reveal nav ----------
  // One scroll listener drives both: the nav slides out of view on scroll
  // DOWN past a small threshold (so it doesn't flicker on tiny scrolls) and
  // slides back in on any scroll UP, regardless of position -- the common
  // "get out of the way while reading, come back the moment you want it" pattern.
  window.scrollToTopV3 = function (event) {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (event && path === '/') event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  (function initNavScrollBehavior() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    var lastY = window.scrollY;
    var ticking = false;
    var REVEAL_THRESHOLD = 80;
    function onScroll() {
      var y = window.scrollY;
      if (y <= REVEAL_THRESHOLD) {
        nav.style.transform = '';
      } else if (y > lastY) {
        nav.style.transform = 'translateX(-50%) translateY(-140%)';
      } else if (y < lastY) {
        nav.style.transform = 'translateX(-50%) translateY(0)';
      }
      lastY = y;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; setTimeout(onScroll, 16); }
    }, { passive: true });
  })();

  // ---------- Footer icon tray: bounce, then open ----------
  // Delegated on document rather than a per-icon listener -- the tray is
  // fixed-content (server-rendered, not JS-created), but delegation means
  // this keeps working with zero extra wiring if the icon list ever grows.
  // preventDefault + a manual delayed window.open is what actually lets the
  // bounce play before the browser navigates away; letting the native click
  // through would leave the page (and cut the animation short) immediately.
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('.site-footer__icons a') : null;
    if (!link) return;
    e.preventDefault();
    if (link.classList.contains('is-bouncing')) return;
    link.classList.add('is-bouncing');
    var url = link.getAttribute('href');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(function () {
      link.classList.remove('is-bouncing');
      window.open(url, '_blank', 'noopener,noreferrer');
    }, reduced ? 0 : 420);
  });

  function showToast(message) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'pointer-events-auto px-5 py-3 rounded-2xl text-xs font-bold shadow-2xl transition-all duration-300 transform translate-y-4 flex items-center gap-3 bg-slate-900 text-white border border-slate-700';
    toast.innerHTML = '<i class="fa-solid fa-circle-check text-cyan-400"></i> <span></span>';
    toast.querySelector('span').textContent = message;
    container.appendChild(toast);
    setTimeout(function () { toast.classList.remove('translate-y-4'); }, 10);
    setTimeout(function () {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }
  window.showToast = showToast;

  window.copyToClipboard = function (text, msg) {
    navigator.clipboard.writeText(text);
    showToast(msg || 'Copied to clipboard!');
  };

  // ---------- Career journey tabs ----------
  window.switchJourneyTab = function (key, evt) {
    var container = document.getElementById('journey-content');
    if (!container) return;
    document.querySelectorAll('.journey-btn').forEach(function (btn) {
      btn.className = 'journey-btn px-6 py-2.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all flex items-center gap-2';
    });
    var e = evt || window.event;
    if (e && e.currentTarget) {
      e.currentTarget.className = 'journey-btn px-6 py-2.5 rounded-full text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all flex items-center gap-2';
    }
    var items = (DATA.journey && DATA.journey[key]) || [];
    var accents = ['#22D3EE', '#34D399', '#FBBF24', '#8B5CF6', '#EF4444'];
    var icons = {
      education: 'fa-graduation-cap',
      appointments: 'fa-briefcase-medical',
      fellowships: 'fa-id-card-clip'
    };
    container.innerHTML = items.map(function (item, index) {
      var accent = accents[index % accents.length];
      return '<div class="home-journey-card" style="--journey-accent:' + accent + '">' +
        '<div class="home-journey-meta"><i class="fa-solid ' + (icons[key] || 'fa-circle-nodes') + '"></i><span>' + item.inst + '</span></div>' +
        '<h4 class="text-lg font-bold font-heading text-slate-900 dark:text-white mt-3 mb-3 leading-snug">' + item.title + '</h4>' +
        '<p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">' + (item.desc || 'Credential record currently shown as a concise verified listing.') + '</p>' +
        '</div>';
    }).join('');
  };

  // ---------- Publications ----------
  function renderPublications(items) {
    var container = document.getElementById('publicationsContainer');
    if (!container) return;
    container.innerHTML = items.map(function (pub) {
      return '<div class="glass-card p-6 rounded-2xl border hover:border-cyan-500 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">' +
        '<div class="space-y-1">' +
        '<div class="flex items-center gap-2 flex-wrap">' +
        '<span class="text-[10px] font-bold font-mono px-2.5 py-0.5 bg-cyan-500/10 text-cyan-500 rounded-md uppercase">' + pub.year + ' &middot; ' + pub.category + '</span>' +
        '<span class="text-[10px] font-mono text-slate-400">' + pub.status + '</span>' +
        '</div>' +
        '<h4 class="text-base font-bold font-heading text-slate-900 dark:text-white">' + pub.title + '</h4>' +
        '<p class="text-xs text-slate-500 leading-relaxed">' + pub.summary + '</p>' +
        '</div>' +
        '<div class="flex items-center gap-2 whitespace-nowrap">' +
        '<a href="' + pub.doi_url + '" target="_blank" rel="noopener" class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">Read Paper &rarr;</a>' +
        '</div></div>';
    }).join('');
  }

  window.filterPublications = function () {
    var searchEl = document.getElementById('pubSearchInput');
    var catEl = document.getElementById('pubCategoryFilter');
    var search = (searchEl ? searchEl.value : '').toLowerCase();
    var cat = catEl ? catEl.value : 'all';
    var items = (DATA.publications || []).filter(function (p) {
      var matchesSearch = p.title.toLowerCase().indexOf(search) !== -1 || p.summary.toLowerCase().indexOf(search) !== -1;
      var matchesCat = cat === 'all' || p.category === cat;
      return matchesSearch && matchesCat;
    });
    renderPublications(items);
  };

  // ---------- Portfolio ----------
  window.filterPortfolio = function (cat) {
    var grid = document.getElementById('portfolio-grid');
    if (!grid) return;
    document.querySelectorAll('.filter-btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-cat') === cat;
      btn.className = isActive
        ? 'filter-btn px-5 py-2 rounded-full text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all'
        : 'filter-btn px-5 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all';
    });
    var items = (DATA.portfolio || []).filter(function (p) { return cat === 'all' || p.category === cat; });
    grid.innerHTML = items.map(function (p) {
      var linksHtml = (p.links || []).map(function (l) {
        return '<a href="' + l.url + '" target="_blank" rel="noopener" class="hover:underline">' + l.label + '</a>';
      }).join(' &middot; ');
      return '<div class="glass-card p-7 rounded-3xl border hover:-translate-y-2 transition-all group">' +
        '<span class="text-[10px] font-mono font-bold uppercase text-cyan-500 mb-2 block">' + p.category + '</span>' +
        '<h4 class="text-xl font-bold font-heading mb-3 group-hover:text-cyan-400 transition-colors">' + p.title + '</h4>' +
        '<p class="text-xs text-slate-500 leading-relaxed mb-4">' + p.desc + '</p>' +
        (linksHtml ? '<div class="flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 flex-wrap">' + linksHtml + '</div>' : '') +
        '</div>';
    }).join('');
  };

  // ---------- Modals ----------
  window.openCvModal = function () {
    if (window.VGG_CV_DOWNLOAD_URL) {
      window.location.href = window.VGG_CV_DOWNLOAD_URL;
      return;
    }
    document.getElementById('cvModal').classList.remove('opacity-0', 'pointer-events-none');
  };
  window.closeCvModal = function () {
    document.getElementById('cvModal').classList.add('opacity-0', 'pointer-events-none');
  };
  window.openLightbox = function (img, title, desc) {
    var imgEl = document.getElementById('lightboxImg');
    imgEl.src = img;
    imgEl.alt = (desc || title || 'Photo') + ', Valentine Golden Ghanem';
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightboxDesc').textContent = desc;
    document.getElementById('lightboxModal').classList.remove('opacity-0', 'pointer-events-none');
  };
  window.closeLightbox = function () {
    document.getElementById('lightboxModal').classList.add('opacity-0', 'pointer-events-none');
  };
  window.toggleMobileNav = function () {
    document.getElementById('mobileDrawer').classList.toggle('hidden');
  };


  // ---------- Outbreak risk simulator ----------
  // A transparent, simplified illustrative weighting (not a validated
  // clinical/epidemiological model) -- same simple formula the template
  // shipped with, kept because the interactive mechanic itself (sliders ->
  // computed score -> visual feedback) is a legitimate portfolio demo of
  // the underlying spatial-autocorrelation concept, as long as it isn't
  // presented as real predictive output.
  window.calculateOutbreakRisk = function () {
    var vecEl = document.getElementById('vectorInput');
    if (!vecEl) return;
    var vec = parseInt(vecEl.value, 10);
    var san = parseInt(document.getElementById('sanitationInput').value, 10);
    var vac = parseInt(document.getElementById('vaccineInput').value, 10);
    var rain = parseInt(document.getElementById('rainInput').value, 10);

    document.getElementById('vectorVal').textContent = vec + '%';
    document.getElementById('sanitationVal').textContent = san + '%';
    document.getElementById('vaccineVal').textContent = vac + '%';
    document.getElementById('rainVal').textContent = '+' + rain + 'mm';

    var riskVal = Math.min(99, Math.max(10, Math.round((vec * 0.35) + (san * 0.3) + (rain * 0.2) - (vac * 0.4) + 20)));
    var moranI = ((riskVal / 100) * 1.2 - 0.2).toFixed(2);

    document.getElementById('moranIndexDisplay').textContent = 'I = ' + (moranI > 0 ? '+' : '') + moranI;
    document.getElementById('outbreakProbPercent').textContent = riskVal + '%';
    document.getElementById('outbreakProgressBar').style.width = riskVal + '%';

    var badge = document.getElementById('riskLevelBadge');
    var text = document.getElementById('interventionText');
    if (riskVal > 70) {
      badge.className = 'px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30';
      badge.textContent = 'STRONG CLUSTERING SIGNAL (EXPLAINER)';
      text.textContent = 'Interpretation: this combination resembles a high-priority surveillance signal. A real programme would verify the data source, inspect neighbouring districts, and consider targeted sampling or outreach before action.';
    } else if (riskVal > 40) {
      badge.className = 'px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/30';
      badge.textContent = 'MODERATE CLUSTERING SIGNAL (EXPLAINER)';
      text.textContent = 'Interpretation: the signal is mixed. The sensible next step is not a prediction claim, but a closer look at coverage, local vulnerability and the neighbouring district pattern.';
    } else {
      badge.className = 'px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-500 border border-emerald-500/30';
      badge.textContent = 'LOW CLUSTERING SIGNAL (EXPLAINER)';
      text.textContent = 'Interpretation: the selected conditions do not create a strong clustering pattern in this concept explorer. Real surveillance would still depend on verified data and field context.';
    }
  };
  window.resetSimulator = function () {
    document.getElementById('vectorInput').value = 65;
    document.getElementById('sanitationInput').value = 45;
    document.getElementById('vaccineInput').value = 55;
    document.getElementById('rainInput').value = 120;
    window.calculateOutbreakRisk();
    showToast('Simulator parameters reset');
  };

  // ---------- Radar chart (real skills data) ----------
  function initRadarChart() {
    var ctx = document.getElementById('radarChart');
    if (!ctx || typeof Chart === 'undefined') return;
    var radar = DATA.radar || { labels: [], values: [] };
    var radarPointColors = ['#22D3EE', '#34D399', '#FBBF24', '#8B5CF6', '#EF4444', '#14B8A6', '#A78BFA'];
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: radar.labels,
        datasets: [{
          label: 'Focus area',
          data: radar.values,
          backgroundColor: 'rgba(34, 211, 238, 0.14)',
          borderColor: '#22D3EE',
          pointBackgroundColor: radarPointColors,
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: radarPointColors,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        animation: { duration: 1100, easing: 'easeOutQuart' },
        scales: {
          r: {
            grid: { color: 'rgba(148,163,184,0.25)' },
            angleLines: { color: 'rgba(148,163,184,0.25)' },
            ticks: { display: false },
            pointLabels: { color: '#CBD5E1', font: { size: 10, weight: 'bold', family: 'Plus Jakarta Sans' } },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                return context.label + ': relative emphasis ' + context.formattedValue + '/100';
              }
            }
          }
        }
      }
    });
  }

  // ---------- Ghana district map (real district list, real coordinates
  // where available; scatter-plotted since Plotly geo needs a real
  // GeoJSON boundary layer, already built separately for the dedicated
  // Field Map page -- this is a lightweight teaser, not a replacement) ----------
  function initPlotlyMap() {
    var el = document.getElementById('plotlyMap');
    if (!el || typeof Plotly === 'undefined') return;
    var selector = document.getElementById('districtSelector');

    function collectCoords(coords, out) {
      if (!Array.isArray(coords)) return out;
      if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
        out.push(coords);
        return out;
      }
      coords.forEach(function (child) { collectCoords(child, out); });
      return out;
    }

    function centroid(feature) {
      var pts = collectCoords(feature.geometry && feature.geometry.coordinates, []);
      if (!pts.length) return null;
      var sx = 0, sy = 0;
      pts.forEach(function (pt) { sx += pt[0]; sy += pt[1]; });
      return { lon: +(sx / pts.length).toFixed(4), lat: +(sy / pts.length).toFixed(4) };
    }

    function regionCode(region) {
      return (region || '--').split(/\s+/).map(function (part) { return part.charAt(0); }).join('').slice(0, 3);
    }

    function updateInspector(d, index, total) {
      if (!d) return;
      document.getElementById('inspectorDistrictName').textContent = d.name;
      document.getElementById('inspectorRegion').textContent = d.region + ' Region · Centroid: ' + d.lat + ', ' + d.lon;
      document.getElementById('inspectorCoverage').textContent = total + ' districts';
      document.getElementById('inspectorRegionShort').textContent = regionCode(d.region);
      document.getElementById('inspectorPopulation').textContent = d.population || 'Not in file';
      document.getElementById('inspectorYearCreated').textContent = d.year_created || 'Not in file';
      document.getElementById('inspectorNote').textContent = 'District ' + (index + 1) + ' of ' + total + ' in the homepage GeoJSON preview. This file currently exposes name, region and geometry; demographic attributes should be joined from a vetted district attribute table.';
      if (selector) selector.value = String(index);
    }

    function plotDistricts(districts) {
      if (!districts.length) return;
      var trace = {
        x: districts.map(function (d) { return d.lon; }),
        y: districts.map(function (d) { return d.lat; }),
        mode: 'markers',
        type: 'scatter',
        marker: {
          size: 7,
          color: districts.map(function (_, index) { return index; }),
          colorscale: [[0, '#34D399'], [0.33, '#22D3EE'], [0.66, '#8B5CF6'], [1, '#FBBF24']],
          opacity: 0.82,
          line: { width: 0.8, color: '#FFFFFF' }
        },
        text: districts.map(function (d) { return d.name + '<br>' + d.region + ' Region'; }),
        hoverinfo: 'text'
      };
      var layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 10, r: 10, b: 10, l: 10 },
        xaxis: { visible: false, scaleanchor: 'y' },
        yaxis: { visible: false },
        showlegend: false
      };
      Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
      if (selector) {
        selector.innerHTML = districts.map(function (d, index) {
          return '<option value="' + index + '">' + d.name + ' · ' + d.region + '</option>';
        }).join('');
        selector.addEventListener('change', function () {
          var index = parseInt(selector.value, 10);
          updateInspector(districts[index], index, districts.length);
        });
      }
      el.on('plotly_click', function (data) {
        if (!data.points.length) return;
        var index = data.points[0].pointNumber;
        var d = districts[index];
        updateInspector(d, index, districts.length);
        showToast('Loaded ' + d.name + ' from the 261-district GeoJSON preview');
      });
      var accraIndex = districts.findIndex(function (d) { return d.name.indexOf('ACCRA') !== -1; });
      updateInspector(districts[accraIndex >= 0 ? accraIndex : 0], accraIndex >= 0 ? accraIndex : 0, districts.length);
    }

    fetch('/assets/data/ghana-districts.geojson')
      .then(function (res) { return res.json(); })
      .then(function (geojson) {
        var districts = (geojson.features || []).map(function (feature) {
          var c = centroid(feature);
          var props = feature.properties || {};
          return c ? {
            name: props.name || 'Unnamed district',
            region: props.region || 'Unknown',
            lat: c.lat,
            lon: c.lon,
            population: props.population,
            year_created: props.year_created || props.yearCreated
          } : null;
        }).filter(Boolean);
        plotDistricts(districts);
      })
      .catch(function () {
        plotDistricts(DATA.districtSample || []);
        showToast('District GeoJSON preview could not load; showing fallback city sample');
      });
  }

  // ---------- Reveal-on-scroll + stat count-up ----------
  function animateCounter(counter) {
    if (!counter || counter.dataset.counted === 'true') return;
    counter.dataset.counted = 'true';
    var target = +counter.getAttribute('data-target');
    var suffix = counter.getAttribute('data-suffix') || '';
    var count = 0;
    var speed = Math.max(target / 40, 1);
    (function update() {
      count += speed;
      if (count < target) {
        counter.textContent = Math.ceil(count).toLocaleString('en-US') + suffix;
        setTimeout(update, 25);
      } else {
        counter.textContent = target.toLocaleString('en-US') + suffix;
      }
    })();
  }

  function activateReveal(el) {
    if (!el) return;
    el.classList.add('active');
    el.querySelectorAll('[data-target]').forEach(animateCounter);
  }

  var observer = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      activateReveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 }) : null;

  function forceInitialReveals() {
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('.v3-scope .reveal').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight * 1.15 && rect.bottom > -80) activateReveal(el);
    });
  }

  // ---------- Hero microscopic infection canvas (bacillus rods, cocci
  // chains, eukaryotic host cells) -- ported directly from the reference
  // template's initMicroscopicInfectionCanvas(). ----------
  function initMicroscopicInfectionCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    var biofieldAllowed = path === '/' || path === '/gallery';
    if (!biofieldAllowed) {
      document.documentElement.classList.add('no-biofield');
      canvas.remove();
      return;
    }
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    // Defensive re-run: on some load sequences the very first synchronous
    // call above lands before layout has settled and the size doesn't
    // stick, even though the exact same assignment works fine a moment
    // later (confirmed via the resize listener below) -- a single deferred
    // retry costs nothing and guarantees the canvas ends up sized either way.
    setTimeout(resize, 0);
    window.addEventListener('resize', resize);

    var hostCells = Array.from({ length: 4 }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 60 + 90,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        nucleusRadius: Math.random() * 18 + 22,
        infectionFoci: Array.from({ length: 5 }, function () {
          return { angle: Math.random() * Math.PI * 2, intensity: Math.random() * 0.8 + 0.2 };
        })
      };
    });

    var bacilli = Array.from({ length: 22 }, function () {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 12 + 18,
        width: Math.random() * 4 + 6,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.6 + 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        color: Math.random() > 0.4 ? '#34D399' : '#22D3EE'
      };
    });

    var cocciChains = Array.from({ length: 12 }, function () {
      var chainLength = Math.floor(Math.random() * 6) + 5;
      var startX = Math.random() * canvas.width;
      var startY = Math.random() * canvas.height;
      var radius = Math.random() * 2 + 4.5;
      var nodes = [];
      for (var i = 0; i < chainLength; i++) {
        nodes.push({ x: startX + i * (radius * 1.8), y: startY + Math.sin(i) * 3 });
      }
      return {
        nodes: nodes,
        radius: radius,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
      };
    });

    function animateInfection() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      hostCells.forEach(function (cell) {
        cell.x += cell.vx; cell.y += cell.vy;
        if (cell.x < -100) cell.x = canvas.width + 100;
        if (cell.x > canvas.width + 100) cell.x = -100;
        if (cell.y < -100) cell.y = canvas.height + 100;
        if (cell.y > canvas.height + 100) cell.y = -100;

        var grad = ctx.createRadialGradient(cell.x, cell.y, 10, cell.x, cell.y, cell.radius);
        grad.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
        grad.addColorStop(0.6, 'rgba(34, 211, 238, 0.08)');
        grad.addColorStop(0.95, 'rgba(239, 68, 68, 0.25)');
        grad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.beginPath();
        ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(cell.x + 8, cell.y - 5, cell.nucleusRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.fill();

        cell.infectionFoci.forEach(function (foci) {
          var fx = cell.x + Math.cos(foci.angle) * cell.radius;
          var fy = cell.y + Math.sin(foci.angle) * cell.radius;
          ctx.beginPath();
          ctx.arc(fx, fy, 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.shadowColor = '#EF4444';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      bacilli.forEach(function (b) {
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;
        b.angle += b.rotSpeed;
        if (b.x < 0) b.x = canvas.width;
        if (b.x > canvas.width) b.x = 0;
        if (b.y < 0) b.y = canvas.height;
        if (b.y > canvas.height) b.y = 0;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);

        ctx.beginPath();
        ctx.roundRect(-b.length / 2, -b.width / 2, b.length, b.width, b.width / 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-b.length / 2, 0);
        var wave = Math.sin(Date.now() * 0.01 + b.x) * 4;
        ctx.quadraticCurveTo(-b.length / 2 - 8, wave, -b.length / 2 - 16, -wave);
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      });

      cocciChains.forEach(function (chain) {
        var head = chain.nodes[0];
        head.x += chain.vx; head.y += chain.vy;
        if (head.x < 0) head.x = canvas.width;
        if (head.x > canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height;
        if (head.y > canvas.height) head.y = 0;

        for (var i = 1; i < chain.nodes.length; i++) {
          var prev = chain.nodes[i - 1];
          var curr = chain.nodes[i];
          var dx = prev.x - curr.x, dy = prev.y - curr.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var targetDist = chain.radius * 1.7;
          if (dist > targetDist) {
            var angle = Math.atan2(dy, dx);
            curr.x = prev.x - Math.cos(angle) * targetDist;
            curr.y = prev.y - Math.sin(angle) * targetDist;
          }
        }

        ctx.beginPath();
        ctx.moveTo(chain.nodes[0].x, chain.nodes[0].y);
        for (var j = 1; j < chain.nodes.length; j++) ctx.lineTo(chain.nodes[j].x, chain.nodes[j].y);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        chain.nodes.forEach(function (node, idx) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, chain.radius, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? '#FBBF24' : '#EF4444';
          ctx.shadowColor = '#FBBF24';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      });

      requestAnimationFrame(animateInfection);
    }
    animateInfection();
  }

  // ---------- Tilt-physics (mass-spring-damper tilt/press on hover) ----------
  // Ported from site.js's shared card-tilt engine -- reusable for any card
  // grid, not just Community's .event-card (kept as a named function so a
  // future page can call attachTiltPhysics('.card') the same way).
  function attachTiltPhysics(selector) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var STIFFNESS = 300, DAMPING = 20;
    var springs = [];
    function makeAxis() { return { value: 0, velocity: 0, target: 0 }; }
    function stepAxis(axis, dt) {
      var accel = -STIFFNESS * (axis.value - axis.target) - DAMPING * axis.velocity;
      axis.velocity += accel * dt;
      axis.value += axis.velocity * dt;
    }
    function atRest(axis) { return Math.abs(axis.value - axis.target) < 0.001 && Math.abs(axis.velocity) < 0.001; }
    var loopRunning = false, lastTs = null;
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
      if (anyActive) requestAnimationFrame(loop);
      else { loopRunning = false; lastTs = null; }
    }
    function ensureLoop() { if (!loopRunning) { loopRunning = true; requestAnimationFrame(loop); } }
    document.querySelectorAll(selector).forEach(function (el) {
      var s = { el: el, tiltX: makeAxis(), tiltY: makeAxis(), scale: makeAxis() };
      springs.push(s);
      el.addEventListener('pointermove', function (e) {
        if (e.pointerType === 'touch') return;
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        s.tiltY.target = px * 6; s.tiltX.target = py * -6;
        ensureLoop();
      });
      el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; s.scale.target = 0.018; ensureLoop(); });
      el.addEventListener('pointerleave', function () { s.tiltX.target = 0; s.tiltY.target = 0; s.scale.target = 0; ensureLoop(); });
      el.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') return; s.scale.target = -0.02; ensureLoop(); });
      el.addEventListener('pointerup', function (e) { if (e.pointerType === 'touch') return; s.scale.target = 0.018; ensureLoop(); });
    });
  }

  // ---------- Full-scale photo lightbox ----------
  // Page-agnostic: any .event-media__item img or .carousel__slide img
  // (Gallery, later) opens here, grouped with prev/next within its own
  // .event-card/.carousel ancestor.
  function initLightbox() {
    var selector = '.event-media__item img, .carousel__slide img';
    var imgs = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!imgs.length) return;
    var overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox__arrow lightbox__arrow--prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="lightbox__arrow lightbox__arrow--next" aria-label="Next photo">&#8250;</button>' +
      '<figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__caption"></figcaption></figure>';
    document.body.appendChild(overlay);
    var imgEl = overlay.querySelector('.lightbox__img');
    var captionEl = overlay.querySelector('.lightbox__caption');
    var closeBtn = overlay.querySelector('.lightbox__close');
    var prevBtn = overlay.querySelector('.lightbox__arrow--prev');
    var nextBtn = overlay.querySelector('.lightbox__arrow--next');
    var group = [], index = 0, lastFocused = null;
    function groupFor(img) {
      var scope = img.closest('.event-card') || img.closest('.carousel');
      if (!scope) return [img];
      return Array.prototype.slice.call(scope.querySelectorAll(selector));
    }
    function render() {
      var img = group[index];
      imgEl.src = img.currentSrc || img.src;
      imgEl.alt = img.alt || '';
      var figure = img.closest('figure');
      var capEl = figure ? figure.querySelector('figcaption') : null;
      captionEl.textContent = capEl ? capEl.textContent : (img.alt || '');
      var multi = group.length > 1;
      prevBtn.hidden = !multi;
      nextBtn.hidden = !multi;
    }
    function open(img) {
      group = groupFor(img);
      index = Math.max(0, group.indexOf(img));
      render();
      lastFocused = document.activeElement;
      overlay.classList.add('is-open');
      document.body.classList.add('lightbox-open');
      closeBtn.focus();
    }
    function close() {
      overlay.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
    function next() { index = (index + 1) % group.length; render(); }
    function prev() { index = (index - 1 + group.length) % group.length; render(); }
    imgs.forEach(function (img) { img.addEventListener('click', function () { open(img); }); });
    closeBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });
  }

  // ---------- Video play-to-fullscreen (CSS-only) ----------
  // Deliberately not the native Fullscreen API -- across several rounds it
  // kept flashing on then immediately exiting on desktop Firefox no matter
  // how gesture/promise timing was handled. A CSS overlay filling the
  // viewport sidesteps that permission model entirely, so it can't be
  // silently revoked.
  function initVideoFullscreen() {
    document.querySelectorAll('.event-media__video').forEach(function (wrap) {
      var video = wrap.querySelector('video');
      if (!video) return;
      var playBtn = document.createElement('button');
      playBtn.type = 'button';
      playBtn.className = 'event-media__video__play';
      playBtn.setAttribute('aria-label', 'Play video full screen');
      playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      wrap.appendChild(playBtn);
      var closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'event-media__video__close';
      closeBtn.setAttribute('aria-label', 'Exit full screen');
      closeBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      wrap.appendChild(closeBtn);
      var placeholder = document.createComment('video-fullscreen-anchor');
      function open() {
        // position:fixed only escapes to the real viewport if no ancestor has
        // a transform/filter/perspective -- .event-card does (tilt-physics),
        // which would trap a fixed child inside the card's own box. Move wrap
        // to a direct child of <body> while open, restore its exact spot on close.
        wrap.parentNode.insertBefore(placeholder, wrap);
        document.body.appendChild(wrap);
        wrap.classList.add('is-pseudo-fullscreen');
        document.documentElement.classList.add('has-pseudo-fullscreen');
        var playPromise = video.play();
        if (playPromise && playPromise.catch) playPromise.catch(function () {});
        playBtn.hidden = true;
        document.addEventListener('keydown', onKeydown);
      }
      function close() {
        wrap.classList.remove('is-pseudo-fullscreen');
        document.documentElement.classList.remove('has-pseudo-fullscreen');
        placeholder.parentNode.insertBefore(wrap, placeholder);
        placeholder.remove();
        playBtn.hidden = !video.paused;
        document.removeEventListener('keydown', onKeydown);
      }
      function onKeydown(e) { if (e.key === 'Escape') close(); }
      playBtn.addEventListener('click', open);
      closeBtn.addEventListener('click', close);
      video.addEventListener('play', function () { playBtn.hidden = true; });
      video.addEventListener('pause', function () { playBtn.hidden = false; });
    });
  }

  // ---------- Masonry packing for .event-grid ----------
  // True masonry: measure each card's real rendered height and greedily
  // place it into whichever column currently totals the least height, so
  // cards pack tight and an odd card never leaves a gap. Largest-first
  // ordering balances columns better than DOM-order greedy placement does.
  var EVENT_MIN_COL_WIDTH = 260;
  function binPack(heights, numCols) {
    var order = heights.map(function (_, i) { return i; });
    order.sort(function (a, b) { return heights[b] - heights[a]; });
    var cols = [], colSums = [];
    for (var i = 0; i < numCols; i++) { cols.push([]); colSums.push(0); }
    order.forEach(function (i) {
      var shortest = 0;
      for (var j = 1; j < numCols; j++) { if (colSums[j] < colSums[shortest]) shortest = j; }
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
      if (byWidth === 1) { cards.forEach(function (c) { grid.appendChild(c); }); return; }
      var candidates = [byWidth];
      var extra = byWidth + 1;
      if (extra <= cards.length && gridWidth / extra >= EVENT_MIN_COL_WIDTH) candidates.push(extra);
      var best = null;
      candidates.forEach(function (n) {
        var result = binPack(heights, n);
        if (!best || result.imbalance < best.imbalance) best = { numCols: n, cols: result.cols };
      });
      var colEls = [];
      for (var i = 0; i < best.numCols; i++) { var col = document.createElement('div'); col.className = 'event-grid__col'; colEls.push(col); grid.appendChild(col); }
      best.cols.forEach(function (indices, colIndex) { indices.forEach(function (cardIndex) { colEls[colIndex].appendChild(cards[cardIndex]); }); });
    });
  }

  // ---------- Publications filter (year select + live search + sort) ----------
  // Copy-citation reuses the sitewide copyToClipboard/showToast (see footer's
  // copy-email button) rather than a bespoke handler -- same convention, one
  // less thing to maintain. Ported from site.js's [data-pubs-root] block.
  function initPublicationsFilter() {
    var root = document.querySelector('[data-pubs-root]');
    if (!root) return;
    var yearSelect = root.querySelector('#pubs-year');
    var searchInput = root.querySelector('#pubs-search');
    var resetBtn = root.querySelector('.filter-toolbar__reset');
    var emptyMsg = root.querySelector('.filter-empty');
    var items = Array.prototype.slice.call(root.querySelectorAll('.feed-item[data-year]'));
    function applyFilters() {
      var yr = yearSelect ? yearSelect.value : 'all';
      var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var anyVisible = false;
      items.forEach(function (item) {
        var yrMatch = (yr === 'all' || item.getAttribute('data-year') === yr);
        var qMatch = !q || item.textContent.toLowerCase().indexOf(q) !== -1;
        var visible = yrMatch && qMatch;
        item.hidden = !visible;
        if (visible) anyVisible = true;
      });
      if (emptyMsg) emptyMsg.classList.toggle('hidden', anyVisible);
    }
    if (yearSelect) yearSelect.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (resetBtn) resetBtn.addEventListener('click', function () {
      if (yearSelect) yearSelect.value = 'all';
      if (searchInput) searchInput.value = '';
      applyFilters();
    });
    var sortSelect = root.querySelector('#pubs-sort');
    var list = root.querySelector('[data-pub-list]');
    if (sortSelect && list) {
      sortSelect.addEventListener('change', function () {
        var mode = sortSelect.value;
        var sorted = Array.prototype.slice.call(list.querySelectorAll('.feed-item[data-year]'));
        sorted.sort(function (a, b) {
          if (mode === 'title') return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
          var ya = parseInt(a.getAttribute('data-year'), 10), yb = parseInt(b.getAttribute('data-year'), 10);
          return mode === 'oldest' ? ya - yb : yb - ya;
        });
        sorted.forEach(function (it) { list.appendChild(it); });
      });
    }
  }

  // ---------- Portfolio page category filter chips ----------
  // Distinct from window.filterPortfolio (Home's teaser grid, #portfolio-grid
  // + .filter-btn) -- this is the real Portfolio page's own filter, ported
  // from site.js's [data-portfolio-root] block unchanged.
  function initPortfolioCategoryFilter() {
    var root = document.querySelector('[data-portfolio-root]');
    if (!root) return;
    var chips = Array.prototype.slice.call(root.querySelectorAll('.filter-chip'));
    var sections = Array.prototype.slice.call(root.querySelectorAll('[data-portfolio-section]'));
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        var cat = chip.getAttribute('data-filter');
        sections.forEach(function (sec) {
          sec.hidden = !(cat === 'all' || sec.getAttribute('data-portfolio-section') === cat);
        });
      });
    });
  }

  // ---------- CPD log filter (year select) ----------
  function initCpdFilter() {
    var root = document.querySelector('[data-cpd-root]');
    if (!root) return;
    var yearSelect = root.querySelector('#cpd-year');
    var groups = Array.prototype.slice.call(root.querySelectorAll('.cpd-year-group'));
    if (!yearSelect) return;
    yearSelect.addEventListener('change', function () {
      var yr = yearSelect.value;
      groups.forEach(function (g) { g.hidden = (yr !== 'all' && g.getAttribute('data-year') !== yr); });
    });
  }

  var didBootV3 = false;
  function bootV3Template() {
    if (didBootV3) return;
    didBootV3 = true;
    window.switchJourneyTab('education');
    renderPublications(DATA.publications || []);
    window.filterPortfolio('all');
    initPlotlyMap();
    initRadarChart();
    window.calculateOutbreakRisk();
    initMicroscopicInfectionCanvas();
    startTypewriter();
    if (window.v2Motion) window.v2Motion.attachMagnetic('.magnetic-btn');
    document.querySelectorAll('.v3-scope .reveal').forEach(function (el) {
      if (observer) observer.observe(el);
    });
    forceInitialReveals();
    setTimeout(forceInitialReveals, 120);

    // .card/.event-card both get tilt-physics sitewide, matching site.js's
    // original unconditional `.card, .toc-card, .event-card` selector --
    // not a Community-only or Portfolio-only effect.
    if (document.querySelector('.card, .event-card')) attachTiltPhysics('.card, .event-card');
    initLightbox();
    initVideoFullscreen();
    if (document.querySelector('.event-grid')) {
      packEventGrids();
      var packResizeTimer = null;
      window.addEventListener('resize', function () {
        clearTimeout(packResizeTimer);
        packResizeTimer = setTimeout(packEventGrids, 150);
      }, { passive: true });
    }
    initPublicationsFilter();
    initPortfolioCategoryFilter();
    initCpdFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootV3Template, { once: true });
  } else {
    bootV3Template();
  }
  window.addEventListener('load', bootV3Template, { once: true });
})();
