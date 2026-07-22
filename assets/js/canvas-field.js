// Ambient WebGL field for the hero section -- a lightweight, dependency-free
// fluid-gradient shader that drifts and ripples toward the cursor/touch
// position. Purely decorative: if WebGL is unavailable, reduced motion is
// requested, or anything throws, the hero simply keeps its flat paper
// background. No existing markup, state, or interactivity depends on this.
(function () {
  function initHost(host) {
    var intensity = parseFloat(host.getAttribute('data-intensity'));
    if (isNaN(intensity)) intensity = 1;

    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'canvas-field__surface';
    host.appendChild(canvas);

    var gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false })
      || canvas.getContext('experimental-webgl');
    if (!gl) { canvas.remove(); return; }

    var vertSrc =
      'attribute vec2 aPos;' +
      'void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }';

    var fragSrc =
      'precision mediump float;' +
      'uniform vec2 uResolution;' +
      'uniform vec2 uPointer;' +
      'uniform float uTime;' +
      'uniform vec3 uColorA;' +
      'uniform vec3 uColorB;' +
      'uniform float uDark;' +
      'uniform float uIntensity;' +
      'float wave(vec2 p, float t){' +
      '  float a = sin(p.x * 2.2 + t) * 0.5;' +
      '  float b = sin((p.x * 1.3 - p.y * 1.7) + t * 0.8) * 0.5;' +
      '  float c = sin((p.y * 2.4 + p.x * 0.6) - t * 1.1) * 0.5;' +
      '  return a + b + c;' +
      '}' +
      // Drifting soft-edged orbs -- distinct moving objects (not just a
      // flat gradient), each following its own slow Lissajous path so the
      // field reads as a scene with depth rather than a static wash.
      'float orb(vec2 p, vec2 center, float radius){' +
      '  return smoothstep(radius, 0.0, length(p - center));' +
      '}' +
      'void main(){' +
      '  vec2 uv = gl_FragCoord.xy / uResolution.xy;' +
      '  vec2 p = uv * 2.0 - 1.0;' +
      '  float aspect = uResolution.x / uResolution.y;' +
      '  p.x *= aspect;' +
      '  float t = uTime * 0.16;' +
      '  float n = wave(p * 1.15, t);' +
      '  vec2 toPointer = p - uPointer;' +
      '  float d = length(toPointer);' +
      '  float ripple = sin(d * 9.0 - uTime * 1.6) * exp(-d * 2.6) * 0.6;' +
      '  float field = n * 0.5 + 0.5 + ripple;' +
      '  field = clamp(field, 0.0, 1.0);' +
      '  vec3 col = mix(uColorA, uColorB, field);' +
      '  float glow = 0.0;' +
      '  vec3 glowCol = vec3(0.0);' +
      '  for (int i = 0; i < 5; i++) {' +
      '    float fi = float(i);' +
      '    float speed = 0.05 + fi * 0.017;' +
      '    float phase = fi * 2.4;' +
      '    vec2 c = vec2(sin(uTime * speed + phase) * aspect * 0.65,' +
      '                  cos(uTime * (speed * 0.8) + phase * 1.3) * 0.7);' +
      '    float parallax = 1.0 + fi * 0.35;' +
      '    vec2 pull = (uPointer - c) * 0.05 / parallax;' +
      '    float r = mix(0.10, 0.22, fract(fi * 0.61803));' +
      '    float g = orb(p, c + pull, r) * (0.5 / parallax + 0.15);' +
      '    glow += g;' +
      '    glowCol += g * mix(uColorA, uColorB, fract(fi * 0.37));' +
      '  }' +
      '  col = mix(col, glowCol / max(glow, 0.001), clamp(glow, 0.0, 1.0));' +
      '  float alpha = (0.16 + ripple * 0.14 + glow * 0.22) * mix(1.0, 0.7, uDark) * uIntensity;' +
      '  gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.55));' +
      '}';

    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    var vs = compile(gl.VERTEX_SHADER, vertSrc);
    var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) { canvas.remove(); return; }

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { canvas.remove(); return; }
    gl.useProgram(program);

    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uResolution = gl.getUniformLocation(program, 'uResolution');
    var uPointer = gl.getUniformLocation(program, 'uPointer');
    var uTime = gl.getUniformLocation(program, 'uTime');
    var uColorA = gl.getUniformLocation(program, 'uColorA');
    var uColorB = gl.getUniformLocation(program, 'uColorB');
    var uDark = gl.getUniformLocation(program, 'uDark');
    var uIntensity = gl.getUniformLocation(program, 'uIntensity');

    // Approximate RGB reads of the site's teal/gold tokens (raw WebGL has no
    // oklch()); kept in sync by eye with assets/css/style.css's palette.
    // Hand-tuned, not a literal oklch->sRGB conversion: the mathematically
    // "correct" gold read as near-pure saturated orange once spread across
    // a large wash rather than used as small text/button accents, so these
    // stay a notch more restrained than the CSS custom properties.
    var LIGHT_A = [0.08, 0.28, 0.27]; // teal-dark (palette v2)
    var LIGHT_B = [0.74, 0.55, 0.20]; // gold (palette v2)
    var DARK_A = [0.10, 0.46, 0.44];
    var DARK_B = [0.85, 0.62, 0.24];
    // "v2" palette: the new hero/map/about design system (near-black +
    // gold/cyan) -- always used regardless of the site's light/dark toggle,
    // since v2 pages have no light mode. Opt-in via data-palette="v2" so
    // every page not yet rebuilt keeps its existing teal/gold behavior.
    var V2_A = [0.04, 0.04, 0.05];
    var V2_B = [0.91, 0.64, 0.24];
    var isV2 = host.getAttribute('data-palette') === 'v2';

    var pointer = { x: 0, y: 0 };
    var targetPointer = { x: 0, y: 0 };
    var running = true;
    var raf = null;
    var startTime = null;

    function resize() {
      var rect = host.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function setPointerFromClient(clientX, clientY) {
      var rect = host.getBoundingClientRect();
      var x = (clientX - rect.left) / rect.width;
      var y = 1 - (clientY - rect.top) / rect.height;
      targetPointer.x = x * 2 - 1;
      targetPointer.y = y * 2 - 1;
    }

    host.addEventListener('pointermove', function (e) { setPointerFromClient(e.clientX, e.clientY); }, { passive: true });
    host.addEventListener('pointerleave', function () { targetPointer.x = 0; targetPointer.y = 0; });

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running && !raf) raf = requestAnimationFrame(frame);
      }, { threshold: 0.01 });
      io.observe(host);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    function frame(ts) {
      raf = null;
      if (!running) return;
      if (!startTime) startTime = ts;
      var elapsed = (ts - startTime) / 1000;

      pointer.x += (targetPointer.x - pointer.x) * 0.06;
      pointer.y += (targetPointer.y - pointer.y) * 0.06;

      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      var a = isV2 ? V2_A : (isDark ? DARK_A : LIGHT_A);
      var b = isV2 ? V2_B : (isDark ? DARK_B : LIGHT_B);

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uPointer, pointer.x, pointer.y);
      gl.uniform1f(uTime, elapsed);
      gl.uniform3f(uColorA, a[0], a[1], a[2]);
      gl.uniform3f(uColorB, b[0], b[1], b[2]);
      gl.uniform1f(uDark, isDark ? 1.0 : 0.0);
      gl.uniform1f(uIntensity, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
  }

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll('[data-canvas-field]').forEach(initHost);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
