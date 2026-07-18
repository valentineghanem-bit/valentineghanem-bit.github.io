(function () {
  var saved = localStorage.getItem('vg-theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

// Ambient audio: a synthesized pad (a few detuned oscillators through a
// slow-breathing lowpass filter) plus short blips on key hover targets --
// no audio files to fetch, everything is generated. Always starts muted
// on load: browsers block autoplay before a gesture anyway, and unannounced
// sound has no place on a first visit to a clinical/scientific site. The
// toolbar button is the only thing that can turn it on, and only for the
// current page view.
var vgAudio = (function () {
  var ctx = null, masterGain = null, padNodes = null, isOn = false, button = null;

  function ensureContext() {
    if (ctx) return ctx;
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function startPad() {
    var c = ensureContext();
    if (!c || padNodes) return;
    if (c.state === 'suspended') c.resume();
    var freqs = [110, 164.81, 220, 277.18];
    var filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.connect(masterGain);
    var oscs = freqs.map(function (f, i) {
      var osc = c.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      var oscGain = c.createGain();
      oscGain.gain.value = 0.9 / freqs.length;
      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start();
      return osc;
    });
    var lfo = c.createOscillator();
    lfo.frequency.value = 0.045;
    var lfoGain = c.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    padNodes = { oscs: oscs, filter: filter, lfo: lfo };
    masterGain.gain.cancelScheduledValues(c.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, c.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.045, c.currentTime + 1.4);
  }

  function stopPad() {
    if (!ctx || !masterGain) return;
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    var nodes = padNodes;
    padNodes = null;
    setTimeout(function () {
      if (!nodes) return;
      nodes.oscs.forEach(function (o) { try { o.stop(); } catch (e) {} });
      try { nodes.lfo.stop(); } catch (e) {}
    }, 700);
  }

  function blip() {
    if (!isOn) return;
    var c = ensureContext();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = 640;
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, c.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.16);
    osc.connect(gain);
    gain.connect(masterGain || c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.18);
  }

  function syncButton() {
    if (!button) return;
    button.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    button.classList.toggle('is-audio-on', isOn);
    var onIcon = button.querySelector('.icon-audio-on');
    var offIcon = button.querySelector('.icon-audio-off');
    if (onIcon) onIcon.hidden = !isOn;
    if (offIcon) offIcon.hidden = isOn;
  }

  function toggle() {
    isOn = !isOn;
    if (isOn) startPad(); else stopPad();
    syncButton();
  }

  return { toggle: toggle, blip: blip, setButton: function (btn) { button = btn; syncButton(); } };
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

  // Hero title kinetic reveal: wrap each word so CSS can stagger it in on
  // load (a purposeful first-impression moment on the one piece of text
  // that matters most -- the name -- not decoration elsewhere).
  if (!prefersReduced) {
    var heroTitle = document.querySelector('.hero__title');
    if (heroTitle) {
      var words = heroTitle.textContent.trim().split(/\s+/);
      heroTitle.innerHTML = words.map(function (w, i) {
        return '<span class="word-reveal"><span class="word-reveal__inner" style="--i:' + i + '">' + w + '</span></span>';
      }).join(' ');
    }
  }

  // Custom cursor: a spring-lagged ring trails an instant dot, and grows
  // over interactive elements -- only on fine-pointer, motion-ok devices
  // (touch screens and reduced-motion users keep the native cursor
  // untouched; nothing here ever blocks a click, it's purely decorative
  // and sits at pointer-events: none).
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    var dot = document.createElement('div');
    dot.className = 'cursor-dot is-hidden';
    var ring = document.createElement('div');
    ring.className = 'cursor-ring is-hidden';
    var label = document.createElement('div');
    label.className = 'cursor-label';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.appendChild(label);
    document.body.classList.add('has-custom-cursor');

    // Short verb labels shown inside the difference-blob cursor over
    // specific target families -- a quiet hint of what a hover will do,
    // without adding any visible markup to the elements themselves.
    var CURSOR_LABELS = [
      { selector: '.toc-card', text: 'View' },
      { selector: '.event-media__video__play', text: 'Play' },
      { selector: '.event-media__item, .carousel__slide img', text: 'Zoom' },
      { selector: '.carousel__arrow, .carousel__dot', text: '' },
      { selector: '.carousel__slide, .carousel', text: 'Drag' },
      { selector: '.event-card', text: '' },
      { selector: '.card', text: '' },
      { selector: 'a[target="_blank"]', text: 'Open' },
      { selector: '.geo-pin', text: 'View' },
      { selector: '.site-toolbar__btn--theme', text: '' },
      { selector: '.site-toolbar__btn--top', text: 'Top' },
      { selector: '.site-toolbar__btn--audio', text: '' }
    ];
    function cursorLabelFor(target) {
      for (var i = 0; i < CURSOR_LABELS.length; i++) {
        if (target.closest && target.closest(CURSOR_LABELS[i].selector)) return CURSOR_LABELS[i].text;
      }
      return '';
    }

    var ringX = { value: 0, velocity: 0, target: 0 };
    var ringY = { value: 0, velocity: 0, target: 0 };
    var shown = false;
    function stepCursorAxis(axis, dt) {
      var accel = -220 * (axis.value - axis.target) - 18 * axis.velocity;
      axis.velocity += accel * dt;
      axis.value += axis.velocity * dt;
    }
    var lastCursorTs = null;
    function cursorLoop(ts) {
      if (!lastCursorTs) lastCursorTs = ts;
      var dt = Math.min((ts - lastCursorTs) / 1000, 0.032);
      lastCursorTs = ts;
      stepCursorAxis(ringX, dt);
      stepCursorAxis(ringY, dt);
      ring.style.transform = 'translate(' + ringX.value + 'px, ' + ringY.value + 'px) translate(-50%, -50%)';
      requestAnimationFrame(cursorLoop);
    }
    requestAnimationFrame(cursorLoop);

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      if (!shown) { shown = true; dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); }
      dot.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
      label.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px) translate(-50%, -50%)';
      ringX.target = e.clientX;
      ringY.target = e.clientY;
    }, { passive: true });

    document.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'touch') dot.classList.add('is-hidden'); });
    document.addEventListener('pointerup', function (e) { if (e.pointerType !== 'touch') dot.classList.remove('is-hidden'); });

    var interactiveSelector = 'a, button, .btn, .card, .toc-card, .event-card, input, select, summary, .geo-pin';
    document.addEventListener('pointerover', function (e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        ring.classList.add('is-interactive');
        var text = cursorLabelFor(e.target);
        label.textContent = text;
        label.classList.toggle('is-visible', !!text);
      }
    });
    document.addEventListener('pointerout', function (e) {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        ring.classList.remove('is-interactive');
        label.classList.remove('is-visible');
      }
    });
    document.addEventListener('mouseleave', function () {
      dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); label.classList.remove('is-visible');
    });
  }

  // Kinetic hover arrow for the home "Explore" tiles -- injected once here
  // so every toc-card gets it without touching index.md's markup.
  document.querySelectorAll('.toc-card').forEach(function (card) {
    var arrow = document.createElement('span');
    arrow.className = 'toc-card__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    card.appendChild(arrow);
  });

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
    '<button type="button" class="site-toolbar__btn site-toolbar__btn--audio" aria-label="Toggle ambient sound" title="Toggle ambient sound" aria-pressed="false">' +
      '<svg class="icon-audio-off" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 9l4 6M22 9l-4 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '<svg class="icon-audio-on" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" hidden><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
    '</button>' +
    '<button type="button" class="site-toolbar__btn site-toolbar__btn--theme" aria-label="Toggle dark mode" title="Toggle dark mode">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36A5.5 5.5 0 0 1 12 3z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
    '</button>' +
    '<button type="button" class="site-toolbar__btn site-toolbar__btn--top" aria-label="Back to top" title="Back to top">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>';
  document.body.appendChild(toolbar);
  var themeBtn = toolbar.querySelector('.site-toolbar__btn--theme');
  var topBtn = toolbar.querySelector('.site-toolbar__btn--top');
  var audioBtn = toolbar.querySelector('.site-toolbar__btn--audio');
  vgAudio.setButton(audioBtn);
  audioBtn.addEventListener('click', function () { vgAudio.toggle(); });

  // Quiet hover blips on primary interactive affordances -- silent unless
  // the ambient toggle above is on, so this never surprises anyone.
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    var BLIP_SELECTOR = '.btn, .toc-card, .site-nav > a, .carousel__arrow, .filter-chip, .site-toolbar__btn';
    var lastBlipTarget = null;
    document.addEventListener('pointerover', function (e) {
      if (e.pointerType === 'touch') return;
      var match = e.target.closest && e.target.closest(BLIP_SELECTOR);
      if (match && match !== lastBlipTarget) { lastBlipTarget = match; vgAudio.blip(); }
      else if (!match) { lastBlipTarget = null; }
    });
  }
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

  // Kinetic word-split heading reveal: every .section__title and
  // .page-title gets the same masked word-rise treatment the hero title
  // gets on load, except triggered on scroll-into-view. Walks text nodes
  // only, so existing child markup (e.g. <span class="section__index">)
  // is left completely alone.
  function splitHeadingWords(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    var n;
    while ((n = walker.nextNode())) nodes.push(n);
    var i = 0;
    nodes.forEach(function (node) {
      if (!node.nodeValue.trim()) return;
      var parts = node.nodeValue.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (part === '') return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var outer = document.createElement('span');
        outer.className = 'kinetic-word';
        outer.style.setProperty('--i', i++);
        var inner = document.createElement('span');
        inner.className = 'kinetic-word__inner';
        inner.textContent = part;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }
  var headingEls = document.querySelectorAll('.section__title, .page-title');
  if (!prefersReduced && headingEls.length && 'IntersectionObserver' in window) {
    headingEls.forEach(splitHeadingWords);
    var headingIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-kinetic-visible'); headingIo.unobserve(entry.target); }
      });
    }, { threshold: 0.2 });
    headingEls.forEach(function (el) { headingIo.observe(el); });
  }

  // Text scramble: cycles random glyphs into place, left to right, before
  // settling on the exact original text. Purely a hover flourish -- final
  // state always equals the starting textContent, gated to fine-pointer/
  // motion-ok so it never touches touch devices or reduced-motion users.
  var SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=-/\\';
  function scrambleInto(el, finalText) {
    if (el._scrambleRaf) cancelAnimationFrame(el._scrambleRaf);
    var duration = 420;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var revealCount = Math.floor(progress * finalText.length);
      var out = '';
      for (var i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') { out += ' '; continue; }
        out += i < revealCount ? finalText[i] : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      el.textContent = out;
      if (progress < 1) { el._scrambleRaf = requestAnimationFrame(frame); }
      else { el.textContent = finalText; el._scrambleRaf = null; }
    }
    el._scrambleRaf = requestAnimationFrame(frame);
  }
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    // .nav-dropdown__trigger is deliberately excluded: it has a non-text
    // SVG chevron child, and scrambleInto's el.textContent assignment
    // would silently delete it.
    var scrambleTargets = document.querySelectorAll(
      '.hero__title .word-reveal__inner, .site-nav > a, .toc-card__title'
    );
    scrambleTargets.forEach(function (el) {
      var original = el.textContent;
      el.addEventListener('pointerenter', function (e) {
        if (e.pointerType === 'touch') return;
        scrambleInto(el, original);
      });
    });
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

  // Hero exit + mouse tilt: --hero-scroll drives the CSS shrink/fade/blur
  // as the visitor scrolls past the first screen; --hero-tilt-x/-y is a
  // spring-damped response to cursor position, applied only to
  // .hero__content (the portrait keeps its own parallax transform above
  // untouched -- this never writes a transform to it).
  var heroEl = document.querySelector('.hero');
  if (heroEl && !prefersReduced) {
    var heroScrollTicking = false;
    function updateHeroScroll() {
      var progress = Math.min(Math.max(window.scrollY / (heroEl.offsetHeight * 0.6), 0), 1);
      heroEl.style.setProperty('--hero-scroll', progress.toFixed(4));
      heroScrollTicking = false;
    }
    window.addEventListener('scroll', function () {
      if (!heroScrollTicking) { requestAnimationFrame(updateHeroScroll); heroScrollTicking = true; }
    }, { passive: true });
    updateHeroScroll();

    if (window.matchMedia('(pointer: fine)').matches) {
      var heroContent = heroEl.querySelector('.hero__content');
      var tiltX = { value: 0, velocity: 0, target: 0 };
      var tiltY = { value: 0, velocity: 0, target: 0 };
      var heroTiltRunning = false;
      var heroTiltLastTs = null;
      function stepHeroTilt(axis, dt) {
        var accel = -180 * (axis.value - axis.target) - 16 * axis.velocity;
        axis.velocity += accel * dt;
        axis.value += axis.velocity * dt;
      }
      function heroTiltLoop(ts) {
        if (!heroTiltLastTs) heroTiltLastTs = ts;
        var dt = Math.min((ts - heroTiltLastTs) / 1000, 0.032);
        heroTiltLastTs = ts;
        stepHeroTilt(tiltX, dt);
        stepHeroTilt(tiltY, dt);
        heroContent.style.setProperty('--hero-tilt-x', tiltX.value.toFixed(3) + 'deg');
        heroContent.style.setProperty('--hero-tilt-y', tiltY.value.toFixed(3) + 'deg');
        var atRestX = Math.abs(tiltX.value - tiltX.target) < 0.01 && Math.abs(tiltX.velocity) < 0.01;
        var atRestY = Math.abs(tiltY.value - tiltY.target) < 0.01 && Math.abs(tiltY.velocity) < 0.01;
        if (!(atRestX && atRestY)) { requestAnimationFrame(heroTiltLoop); }
        else { heroTiltRunning = false; heroTiltLastTs = null; }
      }
      if (heroContent) {
        heroEl.addEventListener('pointermove', function (e) {
          var r = heroEl.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          tiltY.target = px * 2.4;
          tiltX.target = py * -2.4;
          if (!heroTiltRunning) { heroTiltRunning = true; requestAnimationFrame(heroTiltLoop); }
        }, { passive: true });
        heroEl.addEventListener('pointerleave', function () {
          tiltX.target = 0; tiltY.target = 0;
          if (!heroTiltRunning) { heroTiltRunning = true; requestAnimationFrame(heroTiltLoop); }
        });
      }
    }
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

  // Full-scale photo lightbox: click any Community event photo (or any
  // Gallery carousel slide) to open it full-size, with prev/next through
  // the rest of that same event's/carousel's photo set.
  var lightboxImgSelector = '.event-media__item img, .carousel__slide img';
  var lightboxImgs = Array.prototype.slice.call(document.querySelectorAll(lightboxImgSelector));
  if (lightboxImgs.length) {
    var lbOverlay = document.createElement('div');
    lbOverlay.className = 'lightbox';
    lbOverlay.innerHTML =
      '<button type="button" class="lightbox__close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox__arrow lightbox__arrow--prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="lightbox__arrow lightbox__arrow--next" aria-label="Next photo">&#8250;</button>' +
      '<figure class="lightbox__figure"><img class="lightbox__img" alt=""><figcaption class="lightbox__caption"></figcaption></figure>';
    document.body.appendChild(lbOverlay);

    var lbImgEl = lbOverlay.querySelector('.lightbox__img');
    var lbCaptionEl = lbOverlay.querySelector('.lightbox__caption');
    var lbCloseBtn = lbOverlay.querySelector('.lightbox__close');
    var lbPrevBtn = lbOverlay.querySelector('.lightbox__arrow--prev');
    var lbNextBtn = lbOverlay.querySelector('.lightbox__arrow--next');
    var lbGroup = [];
    var lbIndex = 0;
    var lbLastFocused = null;

    function lbGroupFor(img) {
      var scope = img.closest('.event-card') || img.closest('.carousel');
      if (!scope) return [img];
      return Array.prototype.slice.call(scope.querySelectorAll(lightboxImgSelector));
    }
    function lbRender() {
      var img = lbGroup[lbIndex];
      lbImgEl.src = img.currentSrc || img.src;
      lbImgEl.alt = img.alt || '';
      var caption = img.closest('figure');
      var capEl = caption ? caption.querySelector('figcaption') : null;
      lbCaptionEl.textContent = capEl ? capEl.textContent : (img.alt || '');
      var multi = lbGroup.length > 1;
      lbPrevBtn.hidden = !multi;
      lbNextBtn.hidden = !multi;
    }
    function lbOpen(img) {
      lbGroup = lbGroupFor(img);
      lbIndex = Math.max(0, lbGroup.indexOf(img));
      lbRender();
      lbLastFocused = document.activeElement;
      lbOverlay.classList.add('is-open');
      document.body.classList.add('lightbox-open');
      lbCloseBtn.focus();
    }
    function lbClose() {
      lbOverlay.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      if (lbLastFocused && lbLastFocused.focus) lbLastFocused.focus();
    }
    function lbNext() { lbIndex = (lbIndex + 1) % lbGroup.length; lbRender(); }
    function lbPrev() { lbIndex = (lbIndex - 1 + lbGroup.length) % lbGroup.length; lbRender(); }

    lightboxImgs.forEach(function (img) {
      img.addEventListener('click', function () { lbOpen(img); });
    });
    lbCloseBtn.addEventListener('click', lbClose);
    lbNextBtn.addEventListener('click', lbNext);
    lbPrevBtn.addEventListener('click', lbPrev);
    lbOverlay.addEventListener('click', function (e) { if (e.target === lbOverlay) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (!lbOverlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') lbClose();
      if (e.key === 'ArrowRight') lbNext();
      if (e.key === 'ArrowLeft') lbPrev();
    });
  }

  // Play-to-fullscreen overlay for Community event videos: a dedicated
  // button (not a click handler on the <video> itself, which would also
  // fire -- and force fullscreen -- every time someone touches the native
  // scrub bar or volume control).
  document.querySelectorAll('.event-media__video').forEach(function (wrap) {
    var video = wrap.querySelector('video');
    if (!video) return;
    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.className = 'event-media__video__play';
    playBtn.setAttribute('aria-label', 'Play video full screen');
    playBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    wrap.appendChild(playBtn);
    playBtn.addEventListener('click', function () {
      video.play();
      var rf = video.requestFullscreen || video.webkitRequestFullscreen || video.webkitEnterFullscreen;
      if (rf) { try { rf.call(video); } catch (e) {} }
      playBtn.hidden = true;
    });
    video.addEventListener('play', function () { playBtn.hidden = true; });
    video.addEventListener('pause', function () { playBtn.hidden = false; });
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) playBtn.hidden = !video.paused;
    });
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
  var EVENT_MIN_COL_WIDTH = 260; // narrower than this and photo grids get cramped

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

  // Field map scrollytelling: as each event card scrolls through the
  // vertical center of the viewport, activate its matching pin on the
  // sticky map (and vice versa -- the pin's own border highlights the
  // active card). Falls back to nothing but a static map if JS/IO is
  // unavailable; every card and pin is still fully readable either way.
  var geoMap = document.querySelector('[data-geo-map]');
  if (geoMap && 'IntersectionObserver' in window) {
    var geoPins = {};
    geoMap.querySelectorAll('[data-geo-pin]').forEach(function (pin) {
      geoPins[pin.getAttribute('data-target')] = pin;
    });
    var geoCards = document.querySelectorAll('[data-geo-card]');
    var activeCard = null;
    function setActiveGeoCard(card) {
      if (activeCard === card) return;
      if (activeCard) {
        activeCard.classList.remove('is-active');
        var prevPin = geoPins[activeCard.id];
        if (prevPin) prevPin.classList.remove('is-active');
      }
      activeCard = card;
      if (card) {
        card.classList.add('is-active');
        var pin = geoPins[card.id];
        if (pin) pin.classList.add('is-active');
      }
    }
    var geoIo = new IntersectionObserver(function (entries) {
      var best = null;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
      });
      if (best) setActiveGeoCard(best.target);
    }, { threshold: [0.3, 0.5, 0.7], rootMargin: '-20% 0px -20% 0px' });
    geoCards.forEach(function (c) { geoIo.observe(c); });
  }

  // Map pin hover/focus preview: a floating box with the event's photo,
  // title and location, positioned beside whichever pin is currently
  // hovered or focused -- so "is this worth a click" is answered before
  // the click. The pin itself is a real SVG <a>, so clicking it (or
  // pressing Enter while focused) is a plain navigation to that event's
  // card on /community/, no JS required for that part.
  var geoPins = document.querySelectorAll('.geo-pin[data-preview-title]');
  if (geoPins.length) {
    var geoPreview = document.createElement('div');
    geoPreview.className = 'geo-preview';
    geoPreview.innerHTML =
      '<img class="geo-preview__photo" alt="" loading="lazy">' +
      '<div class="geo-preview__body">' +
        '<p class="geo-preview__title"></p>' +
        '<span class="geo-preview__meta"></span>' +
        '<p class="geo-preview__cue">View record &rarr;</p>' +
      '</div>';
    document.body.appendChild(geoPreview);
    var geoPreviewImg = geoPreview.querySelector('.geo-preview__photo');
    var geoPreviewTitle = geoPreview.querySelector('.geo-preview__title');
    var geoPreviewMeta = geoPreview.querySelector('.geo-preview__meta');

    function showGeoPreview(pin) {
      var photo = pin.getAttribute('data-preview-photo');
      geoPreviewImg.style.display = photo ? '' : 'none';
      if (photo) geoPreviewImg.src = photo;
      geoPreviewTitle.textContent = pin.getAttribute('data-preview-title') || '';
      geoPreviewMeta.textContent = pin.getAttribute('data-preview-meta') || '';
      var rect = pin.getBoundingClientRect();
      var boxWidth = 220;
      var left = rect.right + 14;
      if (left + boxWidth > window.innerWidth - 12) left = rect.left - boxWidth - 14;
      if (left < 12) left = 12;
      var top = Math.min(Math.max(rect.top - 20, 12), window.innerHeight - 220);
      geoPreview.style.left = left + 'px';
      geoPreview.style.top = top + 'px';
      geoPreview.classList.add('is-visible');
    }
    function hideGeoPreview() { geoPreview.classList.remove('is-visible'); }

    geoPins.forEach(function (pin) {
      pin.addEventListener('pointerenter', function () { showGeoPreview(pin); });
      pin.addEventListener('pointerleave', hideGeoPreview);
      pin.addEventListener('focus', function () { showGeoPreview(pin); });
      pin.addEventListener('blur', hideGeoPreview);
    });
  }

  // Field map chrome: zoom/pan (buttons, Ctrl/Cmd+wheel, drag), a scale
  // bar that recomputes against the real projection (SCALE=100 viewBox
  // units per degree of longitude, ~110.5 km per degree at Ghana's
  // latitude), and a legend that doubles as a category filter.
  var geoSvg = document.querySelector('[data-geo-map]');
  if (geoSvg) {
    var geoWrap = geoSvg.closest('.geo-map-wrap');
    var baseViewBox = (geoSvg.getAttribute('data-viewbox') || geoSvg.getAttribute('viewBox')).split(' ').map(Number);
    var vb = { x: baseViewBox[0], y: baseViewBox[1], w: baseViewBox[2], h: baseViewBox[3] };
    var GEO_MIN_W = baseViewBox[2] / 4;
    var GEO_MAX_W = baseViewBox[2];
    var geoAspect = baseViewBox[3] / baseViewBox[2];

    function geoClamp() {
      vb.w = Math.max(GEO_MIN_W, Math.min(GEO_MAX_W, vb.w));
      vb.h = vb.w * geoAspect;
      vb.x = Math.max(0, Math.min(baseViewBox[2] - vb.w, vb.x));
      vb.y = Math.max(0, Math.min(baseViewBox[3] - vb.h, vb.y));
    }
    function geoUpdateScaleBar() {
      var bar = geoWrap.querySelector('[data-geo-scale-bar]');
      var label = geoWrap.querySelector('[data-geo-scale-label]');
      if (!bar || !label) return;
      var rect = geoSvg.getBoundingClientRect();
      if (!rect.width) return;
      var pxPerUnit = rect.width / vb.w;
      var kmPerUnit = 1.105; // (1 / SCALE) degree per unit * ~110.5 km/degree
      var pxPerKm = pxPerUnit / kmPerUnit;
      var niceKms = [1, 2, 5, 10, 20, 25, 50, 100, 150, 200, 250, 500];
      var target = 64, best = niceKms[0], bestDiff = Infinity;
      niceKms.forEach(function (km) {
        var w = km * pxPerKm;
        if (w >= 28 && w <= 130) {
          var diff = Math.abs(w - target);
          if (diff < bestDiff) { bestDiff = diff; best = km; }
        }
      });
      bar.style.width = Math.max(20, best * pxPerKm) + 'px';
      label.textContent = best + ' km';
    }
    function geoSetViewBox() {
      geoSvg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
      geoUpdateScaleBar();
    }
    function geoZoomBy(factor, cx, cy) {
      if (cx == null) cx = vb.x + vb.w / 2;
      if (cy == null) cy = vb.y + vb.h / 2;
      var relX = (cx - vb.x) / vb.w;
      var relY = (cy - vb.y) / vb.h;
      vb.w = vb.w / factor;
      geoClamp();
      vb.x = cx - relX * vb.w;
      vb.y = cy - relY * vb.h;
      geoClamp();
      geoSetViewBox();
    }
    function geoResetView() {
      vb = { x: baseViewBox[0], y: baseViewBox[1], w: baseViewBox[2], h: baseViewBox[3] };
      geoSetViewBox();
    }

    var geoZoomIn = geoWrap.querySelector('[data-geo-zoom-in]');
    var geoZoomOut = geoWrap.querySelector('[data-geo-zoom-out]');
    var geoZoomReset = geoWrap.querySelector('[data-geo-zoom-reset]');
    if (geoZoomIn) geoZoomIn.addEventListener('click', function () { geoZoomBy(1.5); });
    if (geoZoomOut) geoZoomOut.addEventListener('click', function () { geoZoomBy(1 / 1.5); });
    if (geoZoomReset) geoZoomReset.addEventListener('click', geoResetView);

    // Plain scroll over the map still scrolls the page -- only Ctrl/Cmd+
    // wheel zooms it, so the map never hijacks the page. A brief hint
    // explains the modifier the first couple of times someone tries it.
    var geoHint = geoWrap.querySelector('[data-geo-hint]');
    geoSvg.addEventListener('wheel', function (e) {
      if (!(e.ctrlKey || e.metaKey)) {
        if (geoHint) {
          geoHint.classList.add('is-visible');
          clearTimeout(geoHint._t);
          geoHint._t = setTimeout(function () { geoHint.classList.remove('is-visible'); }, 1600);
        }
        return;
      }
      e.preventDefault();
      var rect = geoSvg.getBoundingClientRect();
      var px = vb.x + ((e.clientX - rect.left) / rect.width) * vb.w;
      var py = vb.y + ((e.clientY - rect.top) / rect.height) * vb.h;
      geoZoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, px, py);
    }, { passive: false });

    var geoDragging = false, geoDragStart = null, geoVbStart = null;
    geoSvg.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch' || (e.target.closest && e.target.closest('.geo-pin'))) return;
      geoDragging = true;
      geoDragStart = { x: e.clientX, y: e.clientY };
      geoVbStart = { x: vb.x, y: vb.y };
      geoSvg.classList.add('is-panning');
      geoSvg.setPointerCapture(e.pointerId);
    });
    geoSvg.addEventListener('pointermove', function (e) {
      if (!geoDragging) return;
      var rect = geoSvg.getBoundingClientRect();
      var scale = vb.w / rect.width;
      vb.x = geoVbStart.x - (e.clientX - geoDragStart.x) * scale;
      vb.y = geoVbStart.y - (e.clientY - geoDragStart.y) * scale;
      geoClamp();
      geoSetViewBox();
    });
    function geoEndDrag() { geoDragging = false; geoSvg.classList.remove('is-panning'); }
    geoSvg.addEventListener('pointerup', geoEndDrag);
    geoSvg.addEventListener('pointercancel', geoEndDrag);

    window.addEventListener('resize', geoUpdateScaleBar, { passive: true });
    geoUpdateScaleBar();

    // Legend doubles as a filter: click a category to isolate it (click
    // again to release). With nothing active, every pin shows.
    var geoLegendItems = Array.prototype.slice.call(geoWrap.querySelectorAll('[data-geo-filter]'));
    var geoActiveFilters = [];
    function geoApplyFilter() {
      var any = geoActiveFilters.length > 0;
      geoSvg.classList.toggle('has-category-filter', any);
      geoSvg.querySelectorAll('.geo-pin').forEach(function (pin) {
        var match = !any || geoActiveFilters.indexOf(pin.getAttribute('data-category')) !== -1;
        pin.classList.toggle('is-filter-match', match);
      });
      geoLegendItems.forEach(function (item) {
        var cat = item.getAttribute('data-geo-filter');
        item.classList.toggle('is-dimmed', any && geoActiveFilters.indexOf(cat) === -1);
      });
    }
    geoLegendItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var cat = item.getAttribute('data-geo-filter');
        var idx = geoActiveFilters.indexOf(cat);
        if (idx === -1) geoActiveFilters.push(cat); else geoActiveFilters.splice(idx, 1);
        geoApplyFilter();
      });
    });
  }

  // Marquee scroll-skew: a quick flick of the wheel racks every .marquee
  // band over briefly (scroll-velocity driven), easing back to level once
  // scrolling settles. The steady horizontal scroll itself is a plain CSS
  // keyframe animation on .marquee__track, so the band keeps moving even
  // if this never runs.
  var marquees = document.querySelectorAll('.marquee');
  if (marquees.length && !prefersReduced) {
    var lastMarqueeScrollY = window.scrollY;
    var marqueeSkew = 0;
    var marqueeDecayRaf = null;
    function applyMarqueeSkew() {
      marquees.forEach(function (m) { m.style.setProperty('--marquee-skew', marqueeSkew.toFixed(2) + 'deg'); });
    }
    function decayMarqueeSkew() {
      marqueeSkew *= 0.85;
      if (Math.abs(marqueeSkew) < 0.05) { marqueeSkew = 0; applyMarqueeSkew(); marqueeDecayRaf = null; return; }
      applyMarqueeSkew();
      marqueeDecayRaf = requestAnimationFrame(decayMarqueeSkew);
    }
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var delta = y - lastMarqueeScrollY;
      lastMarqueeScrollY = y;
      marqueeSkew = Math.max(-14, Math.min(14, marqueeSkew + delta * 0.6));
      applyMarqueeSkew();
      if (!marqueeDecayRaf) marqueeDecayRaf = requestAnimationFrame(decayMarqueeSkew);
    }, { passive: true });
  }
});
