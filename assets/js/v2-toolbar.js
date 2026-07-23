// Floating toolbar: four-way theme cycle (dark/dim/light/bright),
// soft classical piano ambient audio with mute, and scroll-to-top. Replaces
// the old dark/light-only toggle + jazz-chord ambient audio in the pre-v2 site.js.
(function () {
  // "light" is the default/no-attribute theme (bright, vibrant seasonal
  // palette on a cream background) -- dark/dim/bright are all explicit
  // [data-v2-theme] overrides now, dark included.
  var THEME_KEY = 'vg-v2-theme';
  var THEMES = ['light', 'bright', 'dim', 'dark'];
  var DEFAULT_THEME = 'light';
  var THEME_LABELS = { dark: 'Dark', dim: 'Dim', light: 'Light', bright: 'Bright' };
  var saved = localStorage.getItem(THEME_KEY);
  var currentTheme = THEMES.indexOf(saved) !== -1 ? saved : DEFAULT_THEME;
  if (currentTheme !== DEFAULT_THEME) document.documentElement.setAttribute('data-v2-theme', currentTheme);

  // ---------------------------------------------------------------
  // Soft classical piano ambient audio -- synthesized (no audio file to
  // fetch or license), with lower-register voicings played as slow
  // arpeggiated piano taps through a soft feedback delay. Browsers block real
  // autoplay before a gesture regardless of what a site wants, so playback
  // begins on this page's first click/keydown/touch -- as close to "plays
  // automatically" as the platform allows.
  // ---------------------------------------------------------------
  var vgAudioV2 = (function () {
    var ctx = null, masterGain = null, delayNode = null, feedbackGain = null;
    var isOn = false, button = null, loopTimer = null, chordIndex = 0, startedFromGestureAt = 0;
    var MUTE_KEY = 'vg-v2-audio-muted';
    var wantsOn = localStorage.getItem(MUTE_KEY) !== 'true';

    // Engagement-reactive timbre: recent scroll/click/keyboard activity
    // keeps the tone a touch brighter and tighter; a long idle stretch
    // lets it settle warmer and more spacious -- a slow, continuous drift,
    // not a per-click sound effect (the "classical/subtle" mandate this
    // whole audio system already follows). Filter cutoff is baked into
    // each pluck() at note-trigger time (a per-note filter node is
    // short-lived, nothing persistent to automate there); the shared
    // delay feedback IS a persistent node, so it ramps smoothly via
    // setTargetAtTime instead of snapping.
    var lastActivity = Date.now();
    ['scroll', 'mousemove', 'pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
      window.addEventListener(evt, function () { lastActivity = Date.now(); }, { passive: true });
    });
    var currentCutoff = 980;
    function updateEngagement() {
      if (!ctx || !isOn) return;
      var idleMs = Date.now() - lastActivity;
      var engagement = Math.max(0, 1 - idleMs / 18000); // 1 = just active, 0 = idle 18s+
      currentCutoff = 820 + engagement * 620;            // 820Hz idle .. 1440Hz active
      feedbackGain.gain.setTargetAtTime(0.38 - engagement * 0.08, ctx.currentTime, 3.8);
    }
    setInterval(updateEngagement, 2500);

    // Original 32-second miniature: A minor -> Fmaj7 -> C/G -> Gsus -> Dm9
    // -> Am/E -> Fmaj7 -> Gsus/C cadence. It is through-composed enough to
    // feel like a small piano piece, not a ringtone loop.
    var PIANO_MINIATURE = [
      { t: 0.00, f: 110.00, v: 0.116, d: 2.9, k: 'bass' },
      { t: 0.54, f: 164.81, v: 0.055, d: 2.3, k: 'harmony' },
      { t: 1.08, f: 220.00, v: 0.052, d: 2.2, k: 'harmony' },
      { t: 1.72, f: 261.63, v: 0.074, d: 2.6, k: 'melody' },
      { t: 2.46, f: 329.63, v: 0.079, d: 2.2, k: 'melody' },
      { t: 3.20, f: 392.00, v: 0.071, d: 2.4, k: 'melody' },
      { t: 4.00, f: 87.31, v: 0.104, d: 3.0, k: 'bass' },
      { t: 4.58, f: 174.61, v: 0.052, d: 2.4, k: 'harmony' },
      { t: 5.16, f: 220.00, v: 0.048, d: 2.3, k: 'harmony' },
      { t: 5.84, f: 349.23, v: 0.073, d: 2.5, k: 'melody' },
      { t: 6.62, f: 329.63, v: 0.064, d: 2.2, k: 'melody' },
      { t: 7.34, f: 293.66, v: 0.067, d: 2.6, k: 'melody' },
      { t: 8.00, f: 98.00, v: 0.110, d: 3.0, k: 'bass' },
      { t: 8.50, f: 196.00, v: 0.050, d: 2.2, k: 'harmony' },
      { t: 9.06, f: 261.63, v: 0.048, d: 2.3, k: 'harmony' },
      { t: 9.78, f: 392.00, v: 0.074, d: 2.5, k: 'melody' },
      { t: 10.58, f: 440.00, v: 0.080, d: 2.1, k: 'melody' },
      { t: 11.30, f: 392.00, v: 0.067, d: 2.4, k: 'melody' },
      { t: 12.00, f: 98.00, v: 0.106, d: 2.9, k: 'bass' },
      { t: 12.52, f: 196.00, v: 0.049, d: 2.2, k: 'harmony' },
      { t: 13.08, f: 246.94, v: 0.048, d: 2.3, k: 'harmony' },
      { t: 13.78, f: 349.23, v: 0.072, d: 2.4, k: 'melody' },
      { t: 14.55, f: 329.63, v: 0.066, d: 2.4, k: 'melody' },
      { t: 15.34, f: 293.66, v: 0.064, d: 2.7, k: 'melody' },
      { t: 16.00, f: 73.42, v: 0.106, d: 3.2, k: 'bass' },
      { t: 16.62, f: 146.83, v: 0.049, d: 2.5, k: 'harmony' },
      { t: 17.20, f: 220.00, v: 0.048, d: 2.5, k: 'harmony' },
      { t: 18.02, f: 261.63, v: 0.066, d: 2.5, k: 'melody' },
      { t: 18.82, f: 293.66, v: 0.071, d: 2.2, k: 'melody' },
      { t: 19.54, f: 349.23, v: 0.067, d: 2.6, k: 'melody' },
      { t: 20.00, f: 82.41, v: 0.100, d: 3.1, k: 'bass' },
      { t: 20.58, f: 164.81, v: 0.047, d: 2.4, k: 'harmony' },
      { t: 21.14, f: 246.94, v: 0.048, d: 2.3, k: 'harmony' },
      { t: 21.92, f: 392.00, v: 0.070, d: 2.4, k: 'melody' },
      { t: 22.72, f: 329.63, v: 0.066, d: 2.5, k: 'melody' },
      { t: 23.48, f: 261.63, v: 0.062, d: 2.8, k: 'melody' },
      { t: 24.00, f: 87.31, v: 0.100, d: 3.0, k: 'bass' },
      { t: 24.55, f: 174.61, v: 0.046, d: 2.4, k: 'harmony' },
      { t: 25.08, f: 220.00, v: 0.046, d: 2.4, k: 'harmony' },
      { t: 25.86, f: 293.66, v: 0.064, d: 2.4, k: 'melody' },
      { t: 26.66, f: 349.23, v: 0.068, d: 2.3, k: 'melody' },
      { t: 27.42, f: 440.00, v: 0.060, d: 2.7, k: 'melody' },
      { t: 28.00, f: 98.00, v: 0.112, d: 4.0, k: 'bass' },
      { t: 28.66, f: 196.00, v: 0.052, d: 3.3, k: 'harmony' },
      { t: 29.28, f: 246.94, v: 0.050, d: 3.0, k: 'harmony' },
      { t: 30.10, f: 392.00, v: 0.062, d: 2.7, k: 'melody' },
      { t: 30.88, f: 329.63, v: 0.058, d: 2.8, k: 'melody' },
      { t: 31.56, f: 261.63, v: 0.070, d: 4.4, k: 'melody' }
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
      loopTimer = setTimeout(scheduleLoop, 34500);
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
      button.classList.toggle('is-on', isOn);
      var onIcon = button.querySelector('.icon-audio-on');
      var offIcon = button.querySelector('.icon-audio-off');
      if (onIcon) onIcon.hidden = !isOn;
      if (offIcon) offIcon.hidden = isOn;
      var label = button.querySelector('.v2-toolbar__label');
      if (label) label.textContent = isOn ? 'Mute piano' : 'Play piano';
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

  function buildToolbar() {
    var toolbar = document.createElement('div');
    toolbar.className = 'v2-toolbar';
    toolbar.innerHTML =
      '<button type="button" class="v2-toolbar__btn v2-toolbar__btn--audio" aria-label="Toggle piano audio" aria-pressed="false">' +
        '<span class="v2-toolbar__label">Play piano</span>' +
        '<svg class="icon-audio-off" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18 9l4 6M22 9l-4 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
        '<svg class="icon-audio-on" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" hidden><path d="M4 9v6h4l5 4V5L8 9H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<button type="button" class="v2-toolbar__btn v2-toolbar__btn--theme" aria-label="Cycle theme">' +
        '<span class="v2-toolbar__label" data-theme-label></span>' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4l-1.4-1.4M7 7 5.6 5.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
      '</button>' +
      '<button type="button" class="v2-toolbar__btn v2-toolbar__btn--top" aria-label="Back to top">' +
        '<span class="v2-toolbar__label">Top</span>' +
        '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</button>';
    document.body.appendChild(toolbar);

    var audioBtn = toolbar.querySelector('.v2-toolbar__btn--audio');
    var themeBtn = toolbar.querySelector('.v2-toolbar__btn--theme');
    var topBtn = toolbar.querySelector('.v2-toolbar__btn--top');
    var themeLabel = toolbar.querySelector('[data-theme-label]');

    vgAudioV2.setButton(audioBtn);
    audioBtn.addEventListener('click', function () { vgAudioV2.toggle(); });

    function updateThemeLabel() { themeLabel.textContent = THEME_LABELS[currentTheme] + ' theme'; }
    updateThemeLabel();
    themeBtn.addEventListener('click', function () {
      var idx = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
      currentTheme = THEMES[idx];
      if (currentTheme === DEFAULT_THEME) document.documentElement.removeAttribute('data-v2-theme');
      else document.documentElement.setAttribute('data-v2-theme', currentTheme);
      localStorage.setItem(THEME_KEY, currentTheme);
      updateThemeLabel();
    });

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });

    // Dock the toolbar above the footer instead of letting a fixed
    // bottom-right position sit permanently on top of it -- once the
    // footer's top edge scrolls above the toolbar's resting spot, lift
    // the toolbar by exactly how much of the footer is now showing.
    var footer = document.querySelector('.site-footer');
    function updateToolbarPosition() {
      topBtn.classList.toggle('is-visible', window.scrollY > 480);
      if (!footer) return;
      var baseGap = window.innerWidth <= 640 ? 14 : 20;
      var footerVisible = window.innerHeight - footer.getBoundingClientRect().top;
      toolbar.style.bottom = (footerVisible > 0 ? footerVisible + baseGap : baseGap) + 'px';
    }
    window.addEventListener('scroll', updateToolbarPosition, { passive: true });
    window.addEventListener('resize', updateToolbarPosition);
    updateToolbarPosition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildToolbar);
  } else {
    buildToolbar();
  }
})();
