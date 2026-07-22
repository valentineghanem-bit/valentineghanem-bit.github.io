// v3 template behavior -- ported from the user-provided reference template
// almost verbatim. Real content comes from window.SITE_DATA (injected by a
// small inline script in index.md from the real _data/*.yml files) instead
// of the template's hardcoded placeholder arrays.
(function () {
  var DATA = window.SITE_DATA || {};

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
    container.innerHTML = items.map(function (item) {
      return '<div class="p-6 bg-slate-100/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">' +
        '<span class="text-[10px] font-mono text-cyan-500 font-bold uppercase">' + item.inst + '</span>' +
        '<h4 class="text-lg font-bold font-heading text-slate-900 dark:text-white mt-1 mb-2">' + item.title + '</h4>' +
        '<p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">' + (item.desc || '') + '</p>' +
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
  window.toggleAiModal = function () {
    var modal = document.getElementById('aiModal');
    modal.classList.toggle('opacity-0');
    modal.classList.toggle('pointer-events-none');
  };
  window.openCvModal = function () {
    document.getElementById('cvModal').classList.remove('opacity-0', 'pointer-events-none');
  };
  window.closeCvModal = function () {
    document.getElementById('cvModal').classList.add('opacity-0', 'pointer-events-none');
  };
  window.openLightbox = function (img, title, desc) {
    document.getElementById('lightboxImg').src = img;
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

  // ---------- AI assistant panel ----------
  // No backend proxy exists for this static site, so a real API key can't
  // live here safely (anyone can view-source a public GitHub Pages repo).
  // The panel is fully functional UI-wise but answers from a small set of
  // real, honest canned responses about Valentine's actual work instead of
  // pretending to call a live model.
  var CANNED_TOPICS = [
    { match: /focus|research|about/i, reply: "Valentine's research centres on spatial epidemiology and machine learning for infectious disease surveillance in Ghana — particularly HIV/AIDS incidence forecasting, using tools like XGBoost, SHAP, and spatial LISA statistics across Ghana's 261 districts." },
    { match: /credential|qualif|degree/i, reply: "He holds an MSc in Data Science (University of East London, Distinction) and an MSc in Public Health (University of Suffolk, Merit), plus a BSc in Medical Laboratory Science (University of Ghana). He is a Fellow of the Royal Society for Public Health (FRSPH 140437) and holds registrations with ACSLM/CORU (Ireland), GAMLS (Ghana), and VvE (Netherlands)." },
    { match: /publicat|paper|journal/i, reply: "His most recent publication, in Cureus (2026), analyses NHIS non-enrolment inequities across Ghana's 261 districts using spatial LISA statistics and machine learning — see the Publications section below for the full list with DOIs." },
    { match: /cocoa|clinic|job|work/i, reply: "He currently serves as Principal Biomedical Scientist at Cocoa Clinic, the medical department of the Ghana Cocoa Board (COCOBOD), leading laboratory operations and ISO 15189 compliance." }
  ];
  function appendAiMessage(role, text) {
    var history = document.getElementById('aiChatHistory');
    var id = 'msg-' + history.children.length;
    var msg = document.createElement('div');
    msg.className = role === 'user'
      ? 'p-3 rounded-2xl bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 ml-auto max-w-[85%]'
      : 'p-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 max-w-[85%]';
    msg.id = id;
    msg.textContent = text;
    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
    return id;
  }
  window.sendAiMessage = function () {
    var input = document.getElementById('aiInput');
    var text = input.value.trim();
    if (!text) return;
    appendAiMessage('user', text);
    input.value = '';
    var hit = CANNED_TOPICS.filter(function (t) { return t.match.test(text); })[0];
    var reply = hit ? hit.reply : "That's a great question — for a full answer, browse the Publications and About sections below, or reach Valentine directly via the contact links in the footer.";
    setTimeout(function () { appendAiMessage('assistant', reply); }, 350);
  };
  window.sendSamplePrompt = function (prompt) {
    document.getElementById('aiInput').value = prompt;
    window.sendAiMessage();
  };
  window.handleAiKeyPress = function (e) {
    if (e.key === 'Enter') window.sendAiMessage();
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
      badge.textContent = 'CRITICAL HOTSPOT RISK (ILLUSTRATIVE)';
      text.textContent = 'Illustrative output: at this parameter mix, a real surveillance programme would typically prioritise indoor residual spraying and mobile diagnostic screening in contiguous districts.';
    } else if (riskVal > 40) {
      badge.className = 'px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-500 border border-amber-500/30';
      badge.textContent = 'MODERATE CLUSTER RISK (ILLUSTRATIVE)';
      text.textContent = 'Illustrative output: this parameter mix suggests increasing sentinel sampling frequency and vector-control distribution would be reasonable next steps.';
    } else {
      badge.className = 'px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-500 border border-emerald-500/30';
      badge.textContent = 'LOW OUTBREAK RISK (ILLUSTRATIVE)';
      text.textContent = 'Illustrative output: standard surveillance protocols would typically suffice at this parameter mix.';
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
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: radar.labels,
        datasets: [{
          label: 'Focus area',
          data: radar.values,
          backgroundColor: 'rgba(34, 211, 238, 0.2)',
          borderColor: '#22D3EE',
          pointBackgroundColor: '#FBBF24',
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: { color: 'rgba(148,163,184,0.25)' },
            angleLines: { color: 'rgba(148,163,184,0.25)' },
            ticks: { display: false },
            pointLabels: { color: '#94A3B8', font: { size: 10, weight: 'bold' } }
          }
        },
        plugins: { legend: { display: false } }
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
    var districts = DATA.districtSample || [];
    var trace = {
      x: districts.map(function (d) { return d.lon; }),
      y: districts.map(function (d) { return d.lat; }),
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: 11,
        color: districts.map(function (d) { return d.risk; }),
        colorscale: [[0, '#34D399'], [0.5, '#22D3EE'], [1, '#8B5CF6']],
        opacity: 0.85,
        line: { width: 1.5, color: '#FFFFFF' }
      },
      text: districts.map(function (d) { return d.name; }),
      hoverinfo: 'text'
    };
    var layout = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      margin: { t: 10, r: 10, b: 10, l: 10 },
      xaxis: { visible: false },
      yaxis: { visible: false },
      showlegend: false
    };
    Plotly.newPlot(el, [trace], layout, { responsive: true, displayModeBar: false });
    el.on('plotly_click', function (data) {
      if (!data.points.length) return;
      var d = districts[data.points[0].pointNumber];
      if (!d) return;
      document.getElementById('inspectorDistrictName').textContent = d.name;
      document.getElementById('inspectorRegion').textContent = d.region + ' Region · Lat: ' + d.lat + ', Lon: ' + d.lon;
      showToast('Loaded ' + d.name + ' from the sample set — open the full Field Map for real surveillance data');
    });
  }

  // ---------- Reveal-on-scroll + stat count-up ----------
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      entry.target.querySelectorAll('[data-target]').forEach(function (counter) {
        var target = +counter.getAttribute('data-target');
        var suffix = counter.getAttribute('data-suffix') || '';
        var count = 0;
        var speed = Math.max(target / 40, 1);
        (function update() {
          count += speed;
          if (count < target) {
            counter.textContent = Math.ceil(count) + suffix;
            setTimeout(update, 25);
          } else {
            counter.textContent = target + suffix;
          }
        })();
      });
    });
  }, { threshold: 0.1 });

  // ---------- Hero microscopic infection canvas (bacillus rods, cocci
  // chains, eukaryotic host cells) -- ported directly from the reference
  // template's initMicroscopicInfectionCanvas(). ----------
  function initMicroscopicInfectionCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
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

  window.addEventListener('load', function () {
    window.switchJourneyTab('education');
    renderPublications(DATA.publications || []);
    window.filterPortfolio('all');
    initPlotlyMap();
    initRadarChart();
    window.calculateOutbreakRisk();
    initMicroscopicInfectionCanvas();
    document.querySelectorAll('.v3-scope .reveal').forEach(function (el) { observer.observe(el); });
  });
})();
