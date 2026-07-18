// Field map, powered by ECharts + the real ghana_districts_compact.geojson --
// replaces the earlier hand-simplified/hand-projected inline SVG. ECharts
// renders the actual district geometry natively (no simplification, no
// hand-rolled lon/lat -> pixel projection to get subtly wrong), and gives
// working roam/zoom, tooltips and click-through for free.
(function () {
  var container = document.getElementById('geo-map-echarts');
  if (!container || typeof echarts === 'undefined') return;

  var dataScript = document.getElementById('geo-map-data');
  if (!dataScript) return;
  var raw;
  try { raw = JSON.parse(dataScript.textContent); } catch (e) { return; }

  var CATS = ['screening', 'conference', 'outreach'];
  var CAT_LABELS = { screening: 'Medical screening', conference: 'Conference or seminar', outreach: 'Community outreach' };
  var events = [];
  var runningIndex = 0;
  CATS.forEach(function (cat) {
    (raw[cat] || []).forEach(function (e) {
      var photo = (e.photos && e.photos[0] && e.photos[0].url) || null;
      events.push({
        category: cat,
        lat: e.lat,
        lng: e.lng,
        title: e.title,
        meta: e.location || e.provider || '',
        photo: photo,
        href: '/community/#community-event-' + runningIndex
      });
      runningIndex++;
    });
  });

  function cssVar(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name);
    return v ? v.trim() : '';
  }

  function palette() {
    return {
      fill: cssVar('--teal-tint') || '#dff0ee',
      stroke: cssVar('--teal-dark') || '#2b5c58',
      hoverFill: cssVar('--gold-tint') || '#f6e6c8',
      ink: cssVar('--ink') || '#1b2733',
      inkSoft: cssVar('--ink-soft') || '#5a6b78',
      paperRaised: cssVar('--paper-raised') || '#fff',
      line: cssVar('--line') || '#ddd',
      shadow: cssVar('--shadow-lg') || '0 20px 44px -18px rgba(0,0,0,0.45)',
      screening: cssVar('--gold') || '#c9922a',
      conference: cssVar('--teal-dark') || '#2b5c58',
      outreach: cssVar('--clay') || '#a5502b'
    };
  }

  function pinSeries(cat, color, p) {
    return {
      id: cat,
      name: cat,
      type: 'scatter',
      coordinateSystem: 'geo',
      data: events.filter(function (e) { return e.category === cat; }).map(function (e) {
        return { name: e.title, value: [e.lng, e.lat], event: e };
      }),
      symbolSize: 20,
      itemStyle: { color: color, borderColor: p.paperRaised, borderWidth: 2, shadowBlur: 6, shadowColor: 'rgba(0,0,0,0.25)' },
      emphasis: { scale: 1.35, itemStyle: { color: color, borderColor: p.stroke, borderWidth: 2.5 } },
      zlevel: 2,
      cursor: 'pointer'
    };
  }

  function buildOption(prevZoom, prevCenter) {
    var p = palette();
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: function (params) {
          if (!params.data || !params.data.event) return params.name || '';
          var e = params.data.event;
          var img = e.photo ? '<img src="' + e.photo + '" alt="" style="width:200px;height:112px;object-fit:cover;border-radius:6px;display:block;margin-bottom:8px;">' : '';
          return '<div style="max-width:220px;">' + img +
            '<strong style="display:block;margin-bottom:3px;font-size:0.92em;">' + e.title + '</strong>' +
            '<span style="opacity:0.72;font-size:0.78em;">' + e.meta + '</span>' +
            '<div style="margin-top:6px;font-size:0.72em;text-transform:uppercase;letter-spacing:0.05em;opacity:0.75;">View record &rarr;</div></div>';
        },
        backgroundColor: p.paperRaised,
        borderColor: p.line,
        borderWidth: 1,
        textStyle: { color: p.ink, fontSize: 12 },
        extraCssText: 'box-shadow:' + p.shadow + '; border-radius:8px; padding:10px 12px;'
      },
      legend: { show: false, data: CATS },
      geo: {
        map: 'ghana',
        roam: 'move',
        aspectScale: 1,
        zoom: prevZoom || 1,
        center: prevCenter || undefined,
        scaleLimit: { min: 1, max: 10 },
        label: { show: false },
        itemStyle: { areaColor: p.fill, borderColor: p.stroke, borderWidth: 1.2 },
        emphasis: { itemStyle: { areaColor: p.hoverFill, borderColor: p.stroke, borderWidth: 1.5 }, label: { show: false } },
        select: { disabled: true }
      },
      series: CATS.map(function (cat) { return pinSeries(cat, p[cat], p); })
    };
  }

  var chart = null;

  function themeAndRedraw() {
    if (!chart) return;
    var zoom = chart.getOption().geo[0].zoom;
    var center = chart.getOption().geo[0].center;
    chart.setOption(buildOption(zoom, center), true);
  }

  fetch(container.getAttribute('data-geojson-url'))
    .then(function (r) { return r.json(); })
    .then(function (geo) {
      echarts.registerMap('ghana', geo);
      chart = echarts.init(container, null, { renderer: 'svg' });
      chart.setOption(buildOption());

      chart.on('click', function (params) {
        if (params.componentType === 'series' && params.data && params.data.event) {
          window.location.href = params.data.event.href;
        }
      });

      window.addEventListener('resize', function () { if (chart) chart.resize(); }, { passive: true });

      // Redraw on theme toggle so district/pin colours follow light/dark.
      var themeObserver = new MutationObserver(function (muts) {
        muts.forEach(function (m) { if (m.attributeName === 'data-theme') themeAndRedraw(); });
      });
      themeObserver.observe(document.documentElement, { attributes: true });

      // ---- Zoom buttons + Ctrl/Cmd+wheel zoom (plain scroll still scrolls the page) ----
      var hint = document.querySelector('[data-geo-hint]');
      function currentZoom() { return chart.getOption().geo[0].zoom || 1; }
      function zoomBy(factor, originX, originY) {
        chart.dispatchAction({ type: 'geoRoam', componentType: 'geo', zoom: factor, originX: originX, originY: originY });
      }
      var zoomInBtn = document.querySelector('[data-geo-zoom-in]');
      var zoomOutBtn = document.querySelector('[data-geo-zoom-out]');
      var zoomResetBtn = document.querySelector('[data-geo-zoom-reset]');
      var rect0 = container.getBoundingClientRect();
      if (zoomInBtn) zoomInBtn.addEventListener('click', function () {
        var r = container.getBoundingClientRect();
        zoomBy(1.5, r.width / 2, r.height / 2);
      });
      if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () {
        var r = container.getBoundingClientRect();
        zoomBy(1 / 1.5, r.width / 2, r.height / 2);
      });
      if (zoomResetBtn) zoomResetBtn.addEventListener('click', function () {
        chart.setOption(buildOption(), true);
      });
      container.addEventListener('wheel', function (e) {
        if (!(e.ctrlKey || e.metaKey)) {
          if (hint) {
            hint.classList.add('is-visible');
            clearTimeout(hint._t);
            hint._t = setTimeout(function () { hint.classList.remove('is-visible'); }, 1600);
          }
          return;
        }
        e.preventDefault();
        var r = container.getBoundingClientRect();
        zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, e.clientX - r.left, e.clientY - r.top);
      }, { passive: false });

      // ---- Scale bar: real km, derived from the geo coordinate system itself ----
      function updateScaleBar() {
        var bar = document.querySelector('[data-geo-scale-bar]');
        var label = document.querySelector('[data-geo-scale-label]');
        if (!bar || !label) return;
        var center = chart.getOption().geo[0].center;
        var lat = center ? center[1] : 7.9;
        var lng0 = center ? center[0] : -1.0;
        var p1 = chart.convertToPixel('geo', [lng0, lat]);
        var p2 = chart.convertToPixel('geo', [lng0 + 1, lat]);
        if (!p1 || !p2) return;
        var pxPerDegree = Math.abs(p2[0] - p1[0]);
        var kmPerDegree = 111.32 * Math.cos(lat * Math.PI / 180);
        var pxPerKm = pxPerDegree / kmPerDegree;
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
      chart.on('georoam', updateScaleBar);
      updateScaleBar();
      window.addEventListener('resize', updateScaleBar, { passive: true });

      // ---- Legend / category filter (custom HTML buttons drive echarts' legend model) ----
      var legendItems = Array.prototype.slice.call(document.querySelectorAll('[data-geo-filter]'));
      var activeFilters = [];
      function applyFilter() {
        var any = activeFilters.length > 0;
        CATS.forEach(function (cat) {
          var show = !any || activeFilters.indexOf(cat) !== -1;
          chart.dispatchAction({ type: show ? 'legendSelect' : 'legendUnSelect', name: cat });
        });
        legendItems.forEach(function (item) {
          var cat = item.getAttribute('data-geo-filter');
          item.classList.toggle('is-dimmed', any && activeFilters.indexOf(cat) === -1);
        });
      }
      legendItems.forEach(function (item) {
        item.addEventListener('click', function () {
          var cat = item.getAttribute('data-geo-filter');
          var idx = activeFilters.indexOf(cat);
          if (idx === -1) activeFilters.push(cat); else activeFilters.splice(idx, 1);
          applyFilter();
        });
      });

      // ---- Scrollytelling sync (community list <-> pins), same pattern as before ----
      var geoCards = document.querySelectorAll('[data-geo-card]');
      if (geoCards.length && 'IntersectionObserver' in window) {
        var activeIdx = -1;
        function setActive(idx) {
          if (idx === activeIdx) return;
          activeIdx = idx;
          chart.dispatchAction({ type: 'downplay' });
          if (idx >= 0) {
            var cat = events[idx].category;
            var within = events.filter(function (e) { return e.category === cat; });
            var dataIndex = within.indexOf(events[idx]);
            chart.dispatchAction({ type: 'highlight', seriesId: cat, dataIndex: dataIndex });
          }
        }
        var geoIo = new IntersectionObserver(function (entries) {
          var best = null;
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
          });
          if (best) {
            var idx = Array.prototype.indexOf.call(geoCards, best.target);
            setActive(idx);
          }
        }, { threshold: [0.3, 0.5, 0.7], rootMargin: '-20% 0px -20% 0px' });
        geoCards.forEach(function (c) { geoIo.observe(c); });
      }
    });
})();
