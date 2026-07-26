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

  // ---------- Original Romantic-era piano miniature, synthesized locally.
  // No recording or third-party composition is used. A continuous 16-bar
  // score, damped piano partials, stereo register placement and a short room
  // response replace the old isolated oscillator taps. ----------
  var vgAudioV3 = (function () {
    var ctx = null, masterGain = null, roomNode = null, roomGain = null;
    var compressor = null, hammerNoise = null;
    var isOn = false, button = null, loopTimer = null, startedFromGestureAt = 0;
    var activeSources = [];
    var MUTE_KEY = 'vg-v2-audio-muted';
    var wantsOn = localStorage.getItem(MUTE_KEY) !== 'true';

    var BAR_SECONDS = 3.2;
    var LOOP_MILLISECONDS = 54000;
    var ROMANTIC_BARS = [
      [44, 56, 60, 63, 70], [43, 55, 58, 63, 67], [41, 53, 56, 60, 63], [37, 49, 53, 56, 60],
      [34, 46, 49, 53, 56], [39, 51, 55, 58, 61], [39, 51, 56, 60, 63], [42, 54, 57, 60, 63],
      [41, 53, 56, 60, 68], [39, 51, 55, 58, 63], [37, 49, 53, 56, 63], [39, 51, 55, 58, 65],
      [48, 55, 60, 63, 68], [37, 49, 53, 58, 65], [39, 51, 56, 58, 65], [44, 56, 60, 63, 70]
    ];
    var MELODY_PHRASES = [
      [[0.72, 72, 1.38, 0.066], [2.15, 75, 1.05, 0.074]],
      [[0.38, 74, 0.82, 0.064], [1.34, 70, 0.92, 0.070], [2.42, 67, 0.74, 0.058]],
      [[0.62, 68, 1.06, 0.064], [1.84, 72, 0.62, 0.072], [2.55, 77, 0.62, 0.076]],
      [[0.34, 75, 0.84, 0.068], [1.32, 73, 1.48, 0.073]],
      [[0.58, 70, 0.72, 0.062], [1.44, 73, 0.78, 0.069], [2.36, 77, 0.74, 0.076]],
      [[0.28, 79, 0.72, 0.078], [1.18, 77, 0.68, 0.070], [2.04, 75, 1.08, 0.067]],
      [[0.66, 72, 0.72, 0.064], [1.52, 75, 0.72, 0.070], [2.38, 80, 0.76, 0.080]],
      [[0.38, 78, 0.68, 0.074], [1.24, 75, 0.74, 0.067], [2.18, 72, 0.96, 0.064]],
      [[0.74, 72, 0.94, 0.066], [1.84, 68, 0.64, 0.060], [2.56, 72, 0.60, 0.068]],
      [[0.32, 79, 0.74, 0.078], [1.24, 75, 0.74, 0.069], [2.18, 74, 0.92, 0.065]],
      [[0.48, 73, 0.72, 0.066], [1.34, 77, 0.76, 0.074], [2.26, 80, 0.84, 0.080]],
      [[0.26, 82, 0.70, 0.082], [1.12, 79, 0.72, 0.074], [2.02, 75, 1.10, 0.068]],
      [[0.56, 80, 0.76, 0.078], [1.48, 79, 0.62, 0.071], [2.24, 77, 0.86, 0.068]],
      [[0.34, 75, 0.72, 0.067], [1.22, 73, 0.72, 0.064], [2.10, 70, 1.02, 0.061]],
      [[0.42, 68, 0.68, 0.060], [1.28, 70, 0.68, 0.064], [2.12, 71, 0.96, 0.066]],
      [[0.38, 72, 0.76, 0.068], [1.30, 75, 0.80, 0.074], [2.28, 68, 3.20, 0.079]]
    ];

    function noteToHz(midi) {
      return 440 * Math.pow(2, (midi - 69) / 12);
    }

    function trackSource(source) {
      activeSources.push(source);
      source.addEventListener('ended', function () {
        var index = activeSources.indexOf(source);
        if (index !== -1) activeSources.splice(index, 1);
      }, { once: true });
      return source;
    }

    function buildPianoMiniature() {
      var score = [];
      var pattern = [0, 1, 2, 3, 4, 2];
      ROMANTIC_BARS.forEach(function (bar, barIndex) {
        var barStart = barIndex * BAR_SECONDS;
        pattern.forEach(function (voiceIndex, step) {
          score.push({
            t: barStart + step * 0.52 + (barIndex % 3 === 1 ? 0.018 : 0),
            f: noteToHz(bar[voiceIndex]),
            v: step === 0 ? 0.068 : 0.033 + (step === 3 ? 0.005 : 0),
            d: step === 0 ? 4.6 : 2.85,
            k: step === 0 ? 'bass' : 'harmony'
          });
        });
        MELODY_PHRASES[barIndex].forEach(function (note) {
          score.push({
            t: barStart + note[0],
            f: noteToHz(note[1]),
            v: note[3],
            d: Math.max(2.6, note[2] + 2.1),
            k: 'melody'
          });
        });
      });
      return score.sort(function (a, b) { return a.t - b.t; });
    }

    var PIANO_MINIATURE = buildPianoMiniature();

    function createRoomImpulse(audioContext) {
      var length = Math.floor(audioContext.sampleRate * 2.7);
      var impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
      for (var channel = 0; channel < 2; channel++) {
        var data = impulse.getChannelData(channel);
        for (var i = 0; i < length; i++) {
          var envelope = Math.pow(1 - i / length, 2.8);
          data[i] = (Math.random() * 2 - 1) * envelope * 0.48;
        }
      }
      return impulse;
    }

    function ensureContext() {
      if (ctx) return ctx;
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      roomNode = ctx.createConvolver();
      roomNode.buffer = createRoomImpulse(ctx);
      roomGain = ctx.createGain();
      roomGain.gain.value = 0.17;
      compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 18;
      compressor.ratio.value = 3.2;
      compressor.attack.value = 0.012;
      compressor.release.value = 0.34;
      hammerNoise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.028), ctx.sampleRate);
      var noiseData = hammerNoise.getChannelData(0);
      for (var i = 0; i < noiseData.length; i++) {
        noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / noiseData.length, 3);
      }
      masterGain.connect(compressor);
      masterGain.connect(roomGain);
      roomGain.connect(roomNode);
      roomNode.connect(compressor);
      compressor.connect(ctx.destination);
      return ctx;
    }

    function pluck(freq, when, peak, decay, noteKind) {
      var voice = ctx.createGain();
      var filt = ctx.createBiquadFilter();
      var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
      var midiPosition = Math.max(-1, Math.min(1, Math.log(freq / 220) / Math.log(4)));
      var partialRatios = [1, 2.003, 3.011, 4.027, 5.052];
      var partialLevels = [1, 0.42, 0.20, 0.095, 0.042];
      filt.type = 'lowpass';
      filt.frequency.value = noteKind === 'melody' ? 4100 : (noteKind === 'bass' ? 1850 : 2850);
      filt.Q.value = 0.36;
      if (pan.pan) pan.pan.value = midiPosition * 0.32;
      partialRatios.forEach(function (ratio, index) {
        var oscillator = trackSource(ctx.createOscillator());
        var partialGain = ctx.createGain();
        var partialDecay = decay / (1 + index * 0.34);
        oscillator.type = 'sine';
        oscillator.frequency.value = freq * ratio;
        oscillator.detune.value = (index - 2) * 0.55;
        partialGain.gain.setValueAtTime(0.0001, when);
        partialGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak * partialLevels[index]), when + 0.009 + index * 0.0015);
        partialGain.gain.exponentialRampToValueAtTime(0.0001, when + partialDecay);
        oscillator.connect(partialGain);
        partialGain.connect(voice);
        oscillator.start(when);
        oscillator.stop(when + partialDecay + 0.08);
      });
      var hammer = trackSource(ctx.createBufferSource());
      var hammerGain = ctx.createGain();
      hammer.buffer = hammerNoise;
      hammerGain.gain.setValueAtTime(noteKind === 'melody' ? peak * 0.16 : peak * 0.09, when);
      hammerGain.gain.exponentialRampToValueAtTime(0.0001, when + 0.026);
      hammer.connect(hammerGain);
      hammerGain.connect(voice);
      hammer.start(when);
      voice.connect(filt);
      filt.connect(pan);
      pan.connect(masterGain);
    }

    function scheduleLoop() {
      if (!isOn || !ctx) return;
      var now = ctx.currentTime + 0.12;
      PIANO_MINIATURE.forEach(function (note) { pluck(note.f, now + note.t, note.v, note.d, note.k); });
      loopTimer = setTimeout(scheduleLoop, LOOP_MILLISECONDS);
    }

    function startLoop() {
      var c = ensureContext();
      if (!c) return;
      if (c.state === 'suspended') c.resume();
      masterGain.gain.cancelScheduledValues(c.currentTime);
      masterGain.gain.setValueAtTime(masterGain.gain.value, c.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.88, c.currentTime + 0.9);
      if (!loopTimer) scheduleLoop();
    }
    function stopLoop() {
      if (!ctx) return;
      clearTimeout(loopTimer);
      loopTimer = null;
      activeSources.splice(0).forEach(function (source) {
        try { source.stop(); } catch (error) { /* Source has already ended. */ }
      });
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

  // ---------- Logo top action + auto-hiding side navigation ----------
  window.scrollToTopV3 = function (event) {
    var path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (event && path === '/') event.preventDefault();
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    var target = document.querySelector('main h1, h1');
    if (target) {
      target.setAttribute('tabindex', '-1');
      window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
    }
  };
  (function initSideNavBehavior() {
    var nav = document.getElementById('site-nav');
    var panel = document.getElementById('sideNavPanel');
    var toggle = document.getElementById('sideNavToggle');
    var backdrop = document.getElementById('sideNavBackdrop');
    if (!nav || !panel || !toggle) return;
    var closeTimer = 0;
    var pinned = false;
    var mobileQuery = window.matchMedia('(max-width: 767px)');
    var sectionNumber = toggle.querySelector('[data-nav-section-number]');
    var sectionLabel = toggle.querySelector('[data-nav-section-label]');
    var sectionMarkers = Array.prototype.slice.call(document.querySelectorAll('[data-nav-marker]'));
    var markerTicking = false;

    function setOpen(open, pin) {
      window.clearTimeout(closeTimer);
      if (typeof pin === 'boolean') pinned = pin;
      nav.classList.toggle('is-open', open);
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');
      if (backdrop) backdrop.classList.toggle('is-open', open && mobileQuery.matches);
    }

    function scheduleClose() {
      if (pinned || mobileQuery.matches) return;
      window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        if (!nav.matches(':focus-within') && !nav.matches(':hover')) setOpen(false);
      }, 720);
    }

    function syncSectionMarker() {
      markerTicking = false;
      if (!sectionMarkers.length) return;
      var probe = window.innerHeight * 0.34;
      var active = sectionMarkers[0];
      sectionMarkers.forEach(function (section) {
        if (section.getBoundingClientRect().top <= probe) active = section;
      });
      var colour = active.dataset.navColour || '#22D3EE';
      toggle.style.setProperty('--section-colour', colour);
      if (sectionNumber) sectionNumber.textContent = active.dataset.navMarker || '00';
      if (sectionLabel) sectionLabel.textContent = active.dataset.navLabel || 'Section';
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open') && pinned) {
        setOpen(false, false);
      } else {
        setOpen(true, true);
      }
    });
    nav.addEventListener('pointerenter', function () {
      if (!mobileQuery.matches) setOpen(true);
    });
    nav.addEventListener('pointerleave', scheduleClose);
    nav.addEventListener('focusin', function () { setOpen(true); });
    nav.addEventListener('focusout', scheduleClose);
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (mobileQuery.matches) setOpen(false, false);
      });
    });
    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false, false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false, false);
        toggle.focus();
      }
    });
    mobileQuery.addEventListener('change', function () { setOpen(false, false); });
    window.addEventListener('scroll', function () {
      if (!markerTicking) {
        markerTicking = true;
        window.requestAnimationFrame(syncSectionMarker);
      }
    }, { passive: true });
    syncSectionMarker();
    window.toggleSideNavV3 = function () {
      var willOpen = !nav.classList.contains('is-open');
      setOpen(willOpen, willOpen);
    };
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

  function escapeMarkup(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function safeExternalUrl(value) {
    try {
      var parsed = new URL(value, window.location.origin);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.href : '#';
    } catch (_) {
      return '#';
    }
  }

  // ---------- Home academic repository ----------
  function initAcademicRepository() {
    var root = document.querySelector('[data-academic-repository]');
    var items = DATA.publications || [];
    if (!root || !items.length) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-academic-index]'));
    var title = document.getElementById('academicTitle');
    var status = document.getElementById('academicStatus');
    var source = document.getElementById('academicSource');
    var summary = document.getElementById('academicSummary');
    var methods = document.getElementById('academicMethods');
    var caveat = document.getElementById('academicCaveat');
    var links = document.getElementById('academicLinks');
    var copy = document.getElementById('academicCopyCitation');
    var activeIndex = 0;

    function statusLabel(type) {
      if (type === 'peer_reviewed') return 'Peer-reviewed';
      if (type === 'preprint') return 'Preprint';
      return 'Data and software';
    }

    function selectRecord(index, focusTab) {
      if (index < 0 || index >= items.length) return;
      activeIndex = index;
      var item = items[index];
      tabs.forEach(function (tab, tabIndex) {
        var selected = tabIndex === index;
        tab.classList.toggle('is-active', selected);
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
      });
      status.className = 'academic-status academic-status--' + escapeMarkup(item.record_type || 'repository');
      status.textContent = statusLabel(item.record_type);
      source.textContent = item.journal + ' · ' + item.year;
      title.textContent = item.title;
      summary.textContent = item.summary;
      caveat.textContent = item.caveat || 'Interpret this record within the stated study design and source limitations.';
      methods.innerHTML = (item.methods || []).map(function (method) {
        return '<span>' + escapeMarkup(method) + '</span>';
      }).join('');
      var actionLinks = [{
        label: item.record_type === 'repository' ? 'Open record' : 'Open DOI',
        url: item.doi_url,
        icon: item.record_type === 'repository' ? 'fa-box-archive' : 'fa-book-open'
      }].concat((item.links || []).map(function (entry) {
        return { label: entry.label, url: entry.url, icon: 'fa-arrow-up-right-from-square' };
      }));
      links.innerHTML = actionLinks.map(function (entry) {
        return '<a href="' + safeExternalUrl(entry.url) + '" target="_blank" rel="noopener">' +
          '<i class="fa-solid ' + entry.icon + '" aria-hidden="true"></i> ' + escapeMarkup(entry.label) + '</a>';
      }).join('') +
        '<button type="button" id="academicCopyCitation"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copy citation</button>';
      copy = document.getElementById('academicCopyCitation');
      copy.addEventListener('click', function () {
        copyToClipboard(items[activeIndex].citation, 'Citation copied to clipboard');
      });
      if (focusTab) tabs[index].focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { selectRecord(index, false); });
      tab.addEventListener('keydown', function (event) {
        var target = index;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') target = (index + 1) % tabs.length;
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') target = 0;
        else if (event.key === 'End') target = tabs.length - 1;
        else return;
        event.preventDefault();
        selectRecord(target, true);
      });
    });
    selectRecord(0, false);
  }

  // ---------- Home artifact workbench ----------
  function initArtifactWorkbench() {
    var root = document.querySelector('[data-artifact-workbench]');
    var catalogue = document.getElementById('artifactCatalogue');
    var items = DATA.artifacts || [];
    if (!root || !catalogue || !items.length) return;
    var activeId = items[0].id;
    var activeFilter = 'all';
    var domain = document.getElementById('artifactDomain');
    var status = document.getElementById('artifactStatus');
    var icon = document.getElementById('artifactIcon');
    var title = document.getElementById('artifactTitle');
    var summary = document.getElementById('artifactSummary');
    var evidence = document.getElementById('artifactEvidence');
    var methods = document.getElementById('artifactMethods');
    var actions = document.getElementById('artifactActions');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-artifact-filter]'));

    function visibleItems() {
      return items.filter(function (item) { return activeFilter === 'all' || item.domain === activeFilter; });
    }

    function selectArtifact(id) {
      var item = items.find(function (candidate) { return candidate.id === id; });
      if (!item) return;
      activeId = id;
      catalogue.querySelectorAll('[data-artifact-id]').forEach(function (button) {
        var selected = button.getAttribute('data-artifact-id') === id;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      domain.textContent = item.domain;
      status.textContent = item.status;
      icon.className = 'fa-solid ' + item.icon;
      title.textContent = item.title;
      summary.textContent = item.summary;
      evidence.textContent = item.evidence;
      methods.innerHTML = (item.methods || []).map(function (method) {
        return '<span>' + escapeMarkup(method) + '</span>';
      }).join('');
      var actionData = [
        { label: 'Open repository', url: item.repo_url, icon: 'fa-brands fa-github' },
        item.demo_url ? { label: 'Launch dashboard', url: item.demo_url, icon: 'fa-solid fa-chart-column' } : null,
        item.release_url ? { label: 'Open release DOI', url: item.release_url, icon: 'fa-solid fa-box-archive' } : null
      ].filter(Boolean);
      actions.innerHTML = actionData.map(function (entry) {
        return '<a href="' + safeExternalUrl(entry.url) + '" target="_blank" rel="noopener"><i class="' +
          entry.icon + '" aria-hidden="true"></i> ' + escapeMarkup(entry.label) + '</a>';
      }).join('');
    }

    function renderCatalogue() {
      var shown = visibleItems();
      if (!shown.some(function (item) { return item.id === activeId; })) activeId = shown[0] ? shown[0].id : '';
      catalogue.innerHTML = shown.map(function (item, index) {
        return '<button type="button" data-artifact-id="' + escapeMarkup(item.id) + '" aria-pressed="' +
          (item.id === activeId ? 'true' : 'false') + '" class="' + (item.id === activeId ? 'is-active' : '') + '">' +
          '<span>' + String(index + 1).padStart(2, '0') + '</span>' +
          '<i class="fa-solid ' + escapeMarkup(item.icon) + '" aria-hidden="true"></i>' +
          '<span><b>' + escapeMarkup(item.domain) + '</b><strong>' + escapeMarkup(item.title) + '</strong></span>' +
          '<i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>';
      }).join('');
      catalogue.querySelectorAll('[data-artifact-id]').forEach(function (button) {
        button.addEventListener('click', function () { selectArtifact(button.getAttribute('data-artifact-id')); });
      });
      if (activeId) selectArtifact(activeId);
    }

    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-artifact-filter') || 'all';
        filterButtons.forEach(function (candidate) {
          candidate.classList.toggle('is-active', candidate === button);
          candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
        });
        renderCatalogue();
      });
    });
    renderCatalogue();
  }

  // ---------- Modals ----------
  var modalReturnFocus = null;

  function showModal(modal) {
    if (!modal) return;
    modalReturnFocus = document.activeElement;
    modal.removeAttribute('inert');
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    window.setTimeout(function () {
      var closeButton = modal.querySelector('[aria-label^="Close"]');
      if (closeButton) closeButton.focus();
    }, 30);
  }

  function hideModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    modal.classList.add('opacity-0', 'pointer-events-none');
    if (modalReturnFocus && document.contains(modalReturnFocus)) modalReturnFocus.focus();
    modalReturnFocus = null;
  }

  window.openCvModal = function () {
    if (window.VGG_CV_DOWNLOAD_URL) {
      window.location.href = window.VGG_CV_DOWNLOAD_URL;
      return;
    }
    showModal(document.getElementById('cvModal'));
  };
  window.closeCvModal = function () {
    hideModal(document.getElementById('cvModal'));
  };
  window.openLightbox = function (img, title, desc) {
    var imgEl = document.getElementById('lightboxImg');
    imgEl.src = img;
    var altBase = (desc || title || 'Photo').replace(/[\s.,;:!?]+$/, '');
    imgEl.alt = altBase + ', Valentine Golden Ghanem';
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightboxDesc').textContent = desc;
    showModal(document.getElementById('lightboxModal'));
  };
  window.closeLightbox = function () {
    hideModal(document.getElementById('lightboxModal'));
  };

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var lightbox = document.getElementById('lightboxModal');
    var cvModal = document.getElementById('cvModal');
    if (lightbox && lightbox.getAttribute('aria-hidden') === 'false') {
      window.closeLightbox();
    } else if (cvModal && cvModal.getAttribute('aria-hidden') === 'false') {
      window.closeCvModal();
    }
  });

  function initOperationLightboxes() {
    document.querySelectorAll('[data-operation-lightbox]').forEach(function (button) {
      button.addEventListener('click', function () {
        window.openLightbox(
          button.getAttribute('data-lightbox-img') || '',
          button.getAttribute('data-lightbox-title') || 'Field and diagnostic operations',
          button.getAttribute('data-lightbox-desc') || ''
        );
      });
    });
  }

  window.toggleMobileNav = function () {
    if (window.toggleSideNavV3) window.toggleSideNavV3();
  };


  // ---------- Radar chart (real skills data) ----------
  function initRadarChart() {
    var ctx = document.getElementById('radarChart');
    if (!ctx || typeof Chart === 'undefined') return;
    var radar = DATA.radar || { labels: [], values: [] };
    var radarPointColors = ['#22D3EE', '#34D399', '#FBBF24', '#8B5CF6', '#EF4444', '#14B8A6', '#A78BFA'];
    var components = radar.components || radar.labels.map(function (label, index) {
      return { label: label, score: radar.values[index], domain: 'Expertise component', engine: 'HI-EI Component ' + String(index + 1).padStart(2, '0'), interpretation: label + ' emphasis within the professional matrix.', evidence: 'Evidence available in the portfolio record.', output: 'Applied output shown across the site.' };
    });
    var activeIndex = 0;
    var inspector = {
      root: document.getElementById('radarInspector'),
      engine: document.getElementById('radarInspectorEngine'),
      title: document.getElementById('radarInspectorTitle'),
      body: document.getElementById('radarInspectorBody'),
      score: document.getElementById('radarInspectorScore'),
      domain: document.getElementById('radarInspectorDomain'),
      evidence: document.getElementById('radarInspectorEvidence'),
      output: document.getElementById('radarInspectorOutput')
    };
    function rgba(hex, alpha) {
      var h = hex.replace('#', '');
      var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    }
    function pointSizes(index, activeSize, inactiveSize) {
      return radar.labels.map(function (_, i) { return i === index ? activeSize : inactiveSize; });
    }
    var chart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: radar.labels,
        datasets: [{
          label: 'Relative expertise emphasis',
          data: radar.values,
          backgroundColor: rgba(radarPointColors[0], 0.16),
          borderColor: radarPointColors[0],
          pointBackgroundColor: radarPointColors,
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#FFFFFF',
          pointHoverBorderColor: radarPointColors,
          pointRadius: pointSizes(0, 7, 4),
          pointHoverRadius: 8,
          pointBorderWidth: pointSizes(0, 3, 2),
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        animation: { duration: 1100, easing: 'easeOutQuart' },
        onClick: function (event) {
          var hits = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
          if (hits.length) setActiveComponent(hits[0].index);
        },
        onHover: function (event, hits) {
          event.native.target.style.cursor = hits.length ? 'pointer' : 'default';
        },
        layout: { padding: 12 },
        scales: {
          r: {
            grid: { color: 'rgba(148,163,184,0.25)' },
            angleLines: { color: 'rgba(148,163,184,0.25)' },
            ticks: { display: false, backdropColor: 'transparent' },
            pointLabels: { color: '#F8FAFC', padding: 18, font: { size: 12, weight: 'bold', family: 'Plus Jakarta Sans' } },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            onClick: function () {
              setActiveComponent(activeIndex);
            },
            labels: {
              color: '#CBD5E1',
              boxWidth: 12,
              boxHeight: 12,
              padding: 16,
              font: { size: 11, weight: 'bold', family: 'Plus Jakarta Sans' }
            }
          },
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

    function setActiveComponent(index) {
      if (index < 0 || index >= components.length) return;
      activeIndex = index;
      var component = components[index];
      var color = radarPointColors[index % radarPointColors.length];
      if (inspector.root) inspector.root.style.setProperty('--active-radar-color', color);
      document.querySelectorAll('[data-radar-index]').forEach(function (el) {
        var isActive = parseInt(el.getAttribute('data-radar-index'), 10) === index;
        el.classList.toggle('is-active', isActive);
        el.style.setProperty('--active-radar-color', color);
        if (el.matches('.home-radar-legend__item')) el.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
      if (inspector.engine) inspector.engine.textContent = component.engine || ('HI-EI Component ' + String(index + 1).padStart(2, '0'));
      if (inspector.title) inspector.title.textContent = component.label;
      if (inspector.body) inspector.body.textContent = component.interpretation || '';
      if (inspector.score) inspector.score.textContent = component.score || radar.values[index];
      if (inspector.domain) inspector.domain.textContent = component.domain || 'Expertise component';
      if (inspector.evidence) inspector.evidence.textContent = component.evidence || '';
      if (inspector.output) inspector.output.textContent = component.output || '';
      chart.data.datasets[0].borderColor = color;
      chart.data.datasets[0].backgroundColor = rgba(color, 0.17);
      chart.data.datasets[0].pointRadius = pointSizes(index, 7, 4);
      chart.data.datasets[0].pointBorderWidth = pointSizes(index, 3, 2);
      chart.setActiveElements([{ datasetIndex: 0, index: index }]);
      chart.update();
    }

    document.querySelectorAll('[data-radar-index]').forEach(function (el) {
      var select = function () { setActiveComponent(parseInt(el.getAttribute('data-radar-index'), 10)); };
      el.addEventListener('click', select);
      el.addEventListener('pointerenter', select);
      el.addEventListener('focus', select);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select();
        }
      });
    });
    setActiveComponent(0);
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
  // Dedicated Portfolio-page filter; independent of Home's artifact workbench.
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

  // ---------- Methods & Toolchain ----------
  // The paired rails are CSS-driven for smooth, low-cost motion. JavaScript
  // only handles filtering, deliberate pause/play and the evidence inspector.
  function initTechnicalStack() {
    var root = document.querySelector('[data-technical-stack]');
    if (!root) return;

    var filters = Array.prototype.slice.call(root.querySelectorAll('[data-stack-filter]'));
    var items = Array.prototype.slice.call(root.querySelectorAll('.technical-stack__item'));
    var rails = Array.prototype.slice.call(root.querySelectorAll('[data-stack-rail]'));
    var motionButton = root.querySelector('[data-stack-motion]');
    var inspectorName = root.querySelector('[data-stack-inspector-name]');
    var inspectorDetail = root.querySelector('[data-stack-inspector-detail]');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function inspect(item) {
      if (!item) return;
      var name = item.getAttribute('data-stack-name') || '';
      var detail = item.getAttribute('data-stack-detail') || '';
      if (inspectorName) inspectorName.textContent = name;
      if (inspectorDetail) inspectorDetail.textContent = detail;
      items.forEach(function (candidate) {
        candidate.classList.toggle('is-active', candidate.getAttribute('data-stack-name') === name);
        candidate.setAttribute('aria-pressed', candidate.getAttribute('data-stack-name') === name ? 'true' : 'false');
      });
    }

    function applyFilter(category) {
      filters.forEach(function (button) {
        button.setAttribute('aria-pressed', button.getAttribute('data-stack-filter') === category ? 'true' : 'false');
      });
      items.forEach(function (item) {
        item.hidden = category !== 'all' && item.getAttribute('data-stack-category') !== category;
      });
      rails.forEach(function (rail) {
        var primaryGroup = rail.querySelector('.technical-stack__group:not([aria-hidden="true"])');
        rail.hidden = !primaryGroup || !primaryGroup.querySelector('.technical-stack__item:not([hidden])');
      });
      inspect(items.find(function (item) {
        return !item.hidden && !item.closest('[aria-hidden="true"]');
      }));
    }

    filters.forEach(function (button) {
      button.addEventListener('click', function () {
        applyFilter(button.getAttribute('data-stack-filter') || 'all');
      });
    });

    items.forEach(function (item) {
      item.addEventListener('pointerenter', function () { inspect(item); });
      item.addEventListener('focus', function () { inspect(item); });
      item.addEventListener('click', function () { inspect(item); });
    });

    if (motionButton) {
      function syncMotionButton() {
        var isPaused = root.classList.contains('is-paused');
        motionButton.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
        motionButton.setAttribute('aria-label', isPaused ? 'Resume methods and toolchain motion' : 'Pause methods and toolchain motion');
        motionButton.setAttribute('title', isPaused ? 'Resume motion' : 'Pause motion');
        motionButton.innerHTML = '<i class="fa-solid ' + (isPaused ? 'fa-play' : 'fa-pause') + '" aria-hidden="true"></i>';
      }

      if (reducedMotion.matches) {
        root.classList.add('is-paused');
        motionButton.disabled = true;
        motionButton.setAttribute('aria-label', 'Motion disabled by reduced-motion preference');
        motionButton.setAttribute('title', 'Motion disabled by system preference');
      } else {
        motionButton.addEventListener('click', function () {
          root.classList.toggle('is-paused');
          syncMotionButton();
        });
      }
      syncMotionButton();
      if (reducedMotion.matches) {
        motionButton.setAttribute('aria-label', 'Motion disabled by reduced-motion preference');
        motionButton.setAttribute('title', 'Motion disabled by system preference');
      }
    }

    applyFilter('all');
  }

  var didBootV3 = false;
  function bootV3Template() {
    if (didBootV3) return;
    didBootV3 = true;
    window.switchJourneyTab('education');
    initAcademicRepository();
    initArtifactWorkbench();
    initOperationLightboxes();
    initRadarChart();
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
    initTechnicalStack();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootV3Template, { once: true });
  } else {
    bootV3Template();
  }
  window.addEventListener('load', bootV3Template, { once: true });
})();
