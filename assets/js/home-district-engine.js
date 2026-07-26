(function () {
  'use strict';

  var root = document.getElementById('ghanaDistrictExplorer');
  var mapElement = document.getElementById('ghanaDistrictMap');
  if (!root || !mapElement) return;

  var DISTRICT_MAP_NAME = 'vgg-ghana-districts';
  var REGION_MAP_NAME = 'vgg-ghana-regions';
  var BRAND_COLORS = ['#A7FFCD', '#63D2FF', '#FFE87A', '#9766E1', '#FF5964'];
  var METRICS = {
    health: {
      label: 'SDG health score',
      suffix: '',
      positive: true,
      read: function (fact) { return fact.health_outcomes.sdg_health_score; }
    },
    poverty: {
      label: 'Poverty incidence',
      suffix: '%',
      positive: false,
      read: function (fact) { return fact.social_determinants.poverty_incidence_pct; }
    },
    insurance: {
      label: 'Health-insurance coverage',
      suffix: '%',
      positive: true,
      read: function (fact) { return 100 - fact.social_determinants.uninsured_pct; }
    },
    illiteracy: {
      label: 'Adult illiteracy',
      suffix: '%',
      positive: false,
      read: function (fact) { return fact.social_determinants.illiteracy_pct; }
    },
    sanitation: {
      label: 'Improved sanitation',
      suffix: '%',
      positive: true,
      read: function (fact) { return fact.environment.improved_sanitation_pct; }
    }
  };

  var VIEW_ROWS = {
    social: [
      ['Poverty incidence', 'social_determinants.poverty_incidence_pct', '%', 100],
      ['Poverty intensity', 'social_determinants.poverty_intensity_pct', '%', 100],
      ['Adult illiteracy', 'social_determinants.illiteracy_pct', '%', 100],
      ['Women with no education', 'insurance_education.female_no_education_pct', '%', 100],
      ['Health-insurance gap', 'social_determinants.uninsured_pct', '%', 100],
      ['Unemployment', 'social_determinants.unemployment_pct', '%', 100],
      ['Youth dependency ratio', 'social_determinants.youth_dependency_ratio', '', 100]
    ],
    services: [
      ['Improved water', 'environment.improved_water_pct', '%', 100],
      ['Improved sanitation', 'environment.improved_sanitation_pct', '%', 100],
      ['Skilled birth attendance', 'health_services.skilled_birth_attendance_pct', '%', 100],
      ['Four or more ANC visits', 'health_services.anc4_pct', '%', 100],
      ['Postnatal-care coverage', 'maternal_health.postnatal_care_pct', '%', 100],
      ['Family-planning demand met', 'maternal_health.family_planning_demand_satisfied_pct', '%', 100],
      ['Fully vaccinated children', 'immunisation.fully_vaccinated_pct', '%', 100]
    ],
    outcomes: [
      ['Under-five mortality', 'health_outcomes.under5_mortality_per_1000', ' per 1,000', 100],
      ['Neonatal mortality', 'health_outcomes.neonatal_mortality_per_1000', ' per 1,000', 50],
      ['Childhood stunting', 'nutrition.stunting_pct', '%', 50],
      ['Childhood anaemia', 'nutrition.anaemia_pct', '%', 100],
      ['Childhood diarrhoea', 'nutrition.diarrhoea_pct', '%', 50],
      ['SDG health score', 'health_outcomes.sdg_health_score', '', 100],
      ['Structural vulnerability rank', 'structural_vulnerability.rank_of_261', ' of 261', 261]
    ]
  };
  var REGION_OUTCOME_ROWS = [
    ['Under-five mortality', 'health_outcomes.under5_mortality_per_1000', ' per 1,000', 100, 0],
    ['Neonatal mortality', 'health_outcomes.neonatal_mortality_per_1000', ' per 1,000', 50, 0],
    ['Childhood stunting', 'nutrition.stunting_pct', '%', 50, 0],
    ['Childhood anaemia', 'nutrition.anaemia_pct', '%', 100, 0],
    ['Childhood diarrhoea', 'nutrition.diarrhoea_pct', '%', 50, 0],
    ['SDG health score', 'health_outcomes.sdg_health_score', '', 100, 0],
    ['Mean vulnerability index', 'structural_vulnerability.index', '', 6, -6]
  ];

  var chart = null;
  var facts = [];
  var factById = {};
  var regions = [];
  var regionById = {};
  var activeFact = null;
  var activeMetric = 'health';
  var activeView = 'social';
  var activeGeography = 'regions';
  var selectedMapName = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function valueAt(object, path) {
    return path.split('.').reduce(function (value, key) {
      return value == null ? undefined : value[key];
    }, object);
  }

  function validNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function formatNumber(value, maximumFractionDigits) {
    if (!validNumber(value)) return 'Not available';
    return new Intl.NumberFormat('en-GB', {
      maximumFractionDigits: maximumFractionDigits == null ? 1 : maximumFractionDigits
    }).format(value);
  }

  function currentRecords() {
    return activeGeography === 'regions' ? regions : facts;
  }

  function currentRecord(id) {
    return activeGeography === 'regions' ? regionById[id] : factById[id];
  }

  function weightedMean(records, path) {
    var weightedTotal = 0;
    var populationTotal = 0;
    records.forEach(function (record) {
      var value = valueAt(record, path);
      if (!validNumber(value) || !validNumber(record.population)) return;
      weightedTotal += value * record.population;
      populationTotal += record.population;
    });
    return populationTotal ? +(weightedTotal / populationTotal).toFixed(2) : null;
  }

  function buildRegionSummaries() {
    var grouped = {};
    facts.forEach(function (fact) {
      if (!grouped[fact.region]) grouped[fact.region] = [];
      grouped[fact.region].push(fact);
    });

    return Object.keys(grouped).sort().map(function (regionName) {
      var records = grouped[regionName];
      var population = records.reduce(function (total, fact) { return total + fact.population; }, 0);
      return {
        id: regionName,
        name: regionName,
        region: regionName,
        is_region: true,
        district_count: records.length,
        district_class: 'Regional summary',
        population: population,
        coordinates: {
          latitude: weightedMean(records, 'coordinates.latitude'),
          longitude: weightedMean(records, 'coordinates.longitude')
        },
        social_determinants: {
          poverty_incidence_pct: weightedMean(records, 'social_determinants.poverty_incidence_pct'),
          poverty_intensity_pct: weightedMean(records, 'social_determinants.poverty_intensity_pct'),
          illiteracy_pct: weightedMean(records, 'social_determinants.illiteracy_pct'),
          uninsured_pct: weightedMean(records, 'social_determinants.uninsured_pct'),
          unemployment_pct: weightedMean(records, 'social_determinants.unemployment_pct'),
          youth_dependency_ratio: weightedMean(records, 'social_determinants.youth_dependency_ratio')
        },
        environment: {
          improved_water_pct: weightedMean(records, 'environment.improved_water_pct'),
          improved_sanitation_pct: weightedMean(records, 'environment.improved_sanitation_pct')
        },
        health_services: {
          skilled_birth_attendance_pct: weightedMean(records, 'health_services.skilled_birth_attendance_pct'),
          anc4_pct: weightedMean(records, 'health_services.anc4_pct'),
          dpt3_pct: weightedMean(records, 'health_services.dpt3_pct'),
          family_planning_pct: weightedMean(records, 'health_services.family_planning_pct')
        },
        health_outcomes: {
          under5_mortality_per_1000: weightedMean(records, 'health_outcomes.under5_mortality_per_1000'),
          neonatal_mortality_per_1000: weightedMean(records, 'health_outcomes.neonatal_mortality_per_1000'),
          stunting_pct: weightedMean(records, 'health_outcomes.stunting_pct'),
          sdg_health_score: weightedMean(records, 'health_outcomes.sdg_health_score'),
          sdg_progress_score: weightedMean(records, 'health_outcomes.sdg_progress_score')
        },
        insurance_education: {
          women_insured_2019_pct: weightedMean(records, 'insurance_education.women_insured_2019_pct'),
          women_uninsured_2022_pct: weightedMean(records, 'insurance_education.women_uninsured_2022_pct'),
          female_literate_pct: weightedMean(records, 'insurance_education.female_literate_pct'),
          female_no_education_pct: weightedMean(records, 'insurance_education.female_no_education_pct'),
          female_secondary_plus_pct: weightedMean(records, 'insurance_education.female_secondary_plus_pct'),
          facility_delivery_pct: weightedMean(records, 'insurance_education.facility_delivery_pct')
        },
        nutrition: {
          anaemia_pct: weightedMean(records, 'nutrition.anaemia_pct'),
          minimum_diet_pct: weightedMean(records, 'nutrition.minimum_diet_pct'),
          diarrhoea_pct: weightedMean(records, 'nutrition.diarrhoea_pct'),
          stunting_pct: weightedMean(records, 'nutrition.stunting_pct')
        },
        maternal_health: {
          maternal_health_index: weightedMean(records, 'maternal_health.maternal_health_index'),
          postnatal_care_pct: weightedMean(records, 'maternal_health.postnatal_care_pct'),
          modern_contraceptive_pct: weightedMean(records, 'maternal_health.modern_contraceptive_pct'),
          unmet_family_planning_need_pct: weightedMean(records, 'maternal_health.unmet_family_planning_need_pct'),
          family_planning_demand_satisfied_pct: weightedMean(records, 'maternal_health.family_planning_demand_satisfied_pct')
        },
        immunisation: {
          bcg_pct: weightedMean(records, 'immunisation.bcg_pct'),
          measles_pct: weightedMean(records, 'immunisation.measles_pct'),
          fully_vaccinated_pct: weightedMean(records, 'immunisation.fully_vaccinated_pct'),
          no_vaccination_pct: weightedMean(records, 'immunisation.no_vaccination_pct'),
          dpt_dropout_pct: weightedMean(records, 'immunisation.dpt_dropout_pct'),
          coverage_composite: weightedMean(records, 'immunisation.coverage_composite')
        },
        structural_vulnerability: {
          index: weightedMean(records, 'structural_vulnerability.index'),
          rank_of_261: null
        }
      };
    });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function quantile(sorted, probability) {
    if (!sorted.length) return 0;
    var position = (sorted.length - 1) * probability;
    var base = Math.floor(position);
    var remainder = position - base;
    return sorted[base + 1] === undefined
      ? sorted[base]
      : sorted[base] + remainder * (sorted[base + 1] - sorted[base]);
  }

  function metricScale(metricKey) {
    var metric = METRICS[metricKey];
    var values = currentRecords().map(metric.read).filter(validNumber).sort(function (a, b) { return a - b; });
    var thresholds = [0, 0.2, 0.4, 0.6, 0.8, 1].map(function (q) { return quantile(values, q); });
    var colors = metric.positive ? BRAND_COLORS.slice().reverse() : BRAND_COLORS.slice();
    var pieces = [];
    for (var index = 0; index < 5; index += 1) {
      pieces.push({
        min: index === 0 ? thresholds[index] - 0.0001 : thresholds[index],
        max: thresholds[index + 1],
        color: colors[index]
      });
    }
    return { values: values, thresholds: thresholds, colors: colors, pieces: pieces };
  }

  function regionalSignal(fact) {
    var metric = METRICS[activeMetric];
    var values = regions.map(metric.read).filter(validNumber).sort(function (a, b) { return a - b; });
    var value = metric.read(fact);
    var lower = quantile(values, 0.2);
    var upper = quantile(values, 0.8);
    var hotspot = metric.positive ? value <= lower : value >= upper;
    var coldspot = metric.positive ? value >= upper : value <= lower;
    if (hotspot) return { className: 'is-hotspot', label: 'Relative hotspot' };
    if (coldspot) return { className: 'is-coldspot', label: 'Relative cold spot' };
    return { className: 'is-middle', label: 'Middle range' };
  }

  function buildMapData() {
    return currentRecords().map(function (fact) {
      return {
        name: fact.id,
        value: METRICS[activeMetric].read(fact)
      };
    });
  }

  function renderLegend(scale) {
    var legend = byId('districtMapLegend');
    if (!legend) return;
    var metric = METRICS[activeMetric];
    legend.innerHTML = scale.pieces.map(function (piece, index) {
      var low = formatNumber(Math.max(scale.thresholds[index], scale.values[0] || 0), 1);
      var high = formatNumber(scale.thresholds[index + 1], 1);
      return '<span class="district-map-legend__item">' +
        '<i style="--legend-colour:' + scale.colors[index] + '"></i>' +
        '<b>' + low + '&ndash;' + high + metric.suffix + '</b>' +
        '</span>';
    }).join('');
  }

  function chartOption() {
    var scale = metricScale(activeMetric);
    var theme = document.documentElement.getAttribute('data-v2-theme');
    var isDark = theme === 'dark' || theme === 'dim';
    renderLegend(scale);
    return {
      animationDuration: 420,
      animationDurationUpdate: 340,
      animationEasing: 'cubicOut',
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: isDark ? '#111827' : '#FFFFFF',
        borderColor: isDark ? '#334155' : '#CBD5E1',
        textStyle: { color: isDark ? '#F8FAFC' : '#0F172A', fontFamily: 'Plus Jakarta Sans' },
        extraCssText: 'border-radius:8px;box-shadow:0 16px 36px rgba(15,23,42,.18);',
        formatter: function (params) {
          var fact = currentRecord(params.name);
          if (!fact) return escapeHtml(params.name);
          var metric = METRICS[activeMetric];
          var context = fact.is_region
            ? fact.district_count + ' districts \u00b7 regional summary'
            : fact.region + ' \u00b7 ' + fact.district_class + ' assembly';
          return '<div class="district-echarts-tooltip">' +
            '<strong>' + escapeHtml(fact.name) + '</strong>' +
            '<span>' + escapeHtml(context) + '</span>' +
            '<b>' + escapeHtml(metric.label) + ': ' + formatNumber(metric.read(fact), 1) + metric.suffix + '</b>' +
            '<small>Click to update the evidence card</small>' +
            '</div>';
        }
      },
      visualMap: {
        show: false,
        type: 'piecewise',
        pieces: scale.pieces,
        seriesIndex: 0
      },
      series: [{
        id: 'health-atlas-choropleth',
        name: METRICS[activeMetric].label,
        type: 'map',
        map: activeGeography === 'regions' ? REGION_MAP_NAME : DISTRICT_MAP_NAME,
        roam: false,
        selectedMode: 'single',
        nameProperty: 'name',
        data: buildMapData(),
        itemStyle: {
          borderColor: isDark ? '#0F172A' : '#FFFFFF',
          borderWidth: 0.7,
          areaColor: isDark ? '#1E293B' : '#E2E8F0'
        },
        emphasis: {
          label: { show: false },
          itemStyle: {
            borderColor: '#0F172A',
            borderWidth: 1.8,
            shadowBlur: 12,
            shadowColor: 'rgba(15,23,42,.28)'
          }
        },
        select: {
          label: { show: false },
          itemStyle: {
            areaColor: '#FFE87A',
            borderColor: '#0F172A',
            borderWidth: 2.2,
            shadowBlur: 14,
            shadowColor: 'rgba(255,232,122,.5)'
          }
        }
      }]
    };
  }

  function renderIndicators() {
    var panel = byId('districtInspectorPanel');
    if (!panel || !activeFact) return;
    var rows = activeGeography === 'regions' && activeView === 'outcomes'
      ? REGION_OUTCOME_ROWS
      : VIEW_ROWS[activeView];
    panel.innerHTML = rows.map(function (row) {
      var value = valueAt(activeFact, row[1]);
      var minimum = row[4] == null ? 0 : row[4];
      var width = validNumber(value)
        ? Math.max(2, Math.min(100, (value - minimum) / (row[3] - minimum) * 100))
        : 0;
      return '<div class="district-indicator-row">' +
        '<div><span>' + escapeHtml(row[0]) + '</span><strong>' +
        (validNumber(value) ? formatNumber(value, 1) + row[2] : 'Not available') +
        '</strong></div>' +
        '<span class="district-indicator-track" aria-hidden="true"><i style="width:' + width.toFixed(1) + '%"></i></span>' +
        '</div>';
    }).join('');
  }

  function districtSummary(fact) {
    var place = fact.is_region ? fact.name + ' regional summary' : fact.name + ', ' + fact.region;
    return place + ': population ' + formatNumber(fact.population, 0) +
      '; poverty incidence ' + formatNumber(fact.social_determinants.poverty_incidence_pct, 1) +
      '%; insured population ' + formatNumber(100 - fact.social_determinants.uninsured_pct, 1) +
      '%; improved sanitation ' + formatNumber(fact.environment.improved_sanitation_pct, 1) +
      '%; SDG health score ' + formatNumber(fact.health_outcomes.sdg_health_score, 1) + '.';
  }

  function updateInspector(fact, announce) {
    if (!fact) return;
    activeFact = fact;
    var inspector = root.querySelector('.district-inspector');
    var signal = byId('inspectorSignal');
    var copyButton = byId('districtCopySummary');
    if (inspector) inspector.classList.remove('is-hotspot', 'is-middle', 'is-coldspot');
    byId('inspectorDistrictName').textContent = fact.name;
    byId('inspectorPopulation').textContent = formatNumber(fact.population, 0);
    if (activeGeography === 'regions') {
      var regionalClassification = regionalSignal(fact);
      if (inspector) inspector.classList.add(regionalClassification.className);
      if (signal) {
        signal.hidden = false;
        signal.textContent = regionalClassification.label + ' · ' + METRICS[activeMetric].label;
      }
      byId('inspectorKicker').innerHTML =
        '<i class="fa-solid fa-layer-group" aria-hidden="true"></i> Regional evidence card';
      byId('inspectorRegion').textContent =
        fact.district_count + ' districts \u00b7 population-weighted regional summary';
      byId('inspectorClassLabel').textContent = 'Districts in region';
      byId('inspectorClass').textContent = formatNumber(fact.district_count, 0) + ' districts';
      byId('inspectorCoordinatesLabel').textContent = 'Atlas level';
      byId('inspectorCoordinates').textContent = 'Region overview';
      byId('inspectorNote').textContent =
        regionalClassification.label + ' is a descriptive comparison with the other 16 regions for ' +
        METRICS[activeMetric].label.toLowerCase() +
        '. It uses the upper or lower regional quintile, not a formal spatial hotspot test. Regional values are population-weighted and do not estimate individual risk or causation.';
      if (copyButton) copyButton.innerHTML =
        '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copy regional summary';
    } else {
      if (signal) signal.hidden = true;
      byId('inspectorKicker').innerHTML =
        '<i class="fa-solid fa-crosshairs" aria-hidden="true"></i> District evidence card';
      byId('inspectorRegion').textContent = fact.region + ' \u00b7 ' + fact.district_class + ' assembly';
      byId('inspectorClassLabel').textContent = 'Assembly class';
      byId('inspectorClass').textContent = fact.district_class;
      byId('inspectorCoordinatesLabel').textContent = 'Coordinates';
      byId('inspectorCoordinates').textContent =
        formatNumber(fact.coordinates.latitude, 4) + ', ' + formatNumber(fact.coordinates.longitude, 4);
      byId('inspectorNote').textContent =
        'District-level indicators describe geographic context. They are not individual risk estimates and do not establish causal effects.';
      if (copyButton) copyButton.innerHTML =
        '<i class="fa-regular fa-copy" aria-hidden="true"></i> Copy district summary';
    }
    var selector = byId('districtSelector');
    if (selector) selector.value = fact.id;
    renderIndicators();

    if (chart) {
      if (selectedMapName) chart.dispatchAction({ type: 'unselect', seriesIndex: 0, name: selectedMapName });
      selectedMapName = fact.id;
      chart.dispatchAction({ type: 'select', seriesIndex: 0, name: selectedMapName });
    }
    mapElement.setAttribute('aria-label', 'Interactive map of Ghana ' + activeGeography +
      '. Selected ' + (activeGeography === 'regions' ? 'region: ' : 'district: ') + fact.name + '.');
    if (announce && window.showToast) window.showToast('Loaded ' + fact.name + ' geographic indicators');
  }

  function setMetric(metricKey) {
    if (!METRICS[metricKey]) return;
    activeMetric = metricKey;
    document.querySelectorAll('[data-district-metric]').forEach(function (button) {
      var active = button.getAttribute('data-district-metric') === metricKey;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    byId('districtMapMetricLabel').textContent =
      (activeGeography === 'regions' ? 'Regional ' : 'District ') + METRICS[metricKey].label;
    if (chart) {
      chart.setOption(chartOption(), true);
      selectedMapName = null;
      updateInspector(activeFact, false);
    }
  }

  function populateSelector() {
    var selector = byId('districtSelector');
    var records = currentRecords();
    byId('geographySelectorLabel').textContent =
      activeGeography === 'regions' ? 'Region selector' : 'District selector';
    selector.innerHTML = records.map(function (record) {
      var context = activeGeography === 'regions'
        ? record.district_count + ' districts'
        : record.region;
      return '<option value="' + escapeHtml(record.id) + '">' +
        escapeHtml(record.name) + ' \u00b7 ' + escapeHtml(context) +
        '</option>';
    }).join('');
  }

  function setGeography(geography, selectionId, announce) {
    if (geography !== 'regions' && geography !== 'districts') return;
    activeGeography = geography;
    document.querySelectorAll('[data-geography-view]').forEach(function (button) {
      var active = button.getAttribute('data-geography-view') === geography;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    populateSelector();
    selectedMapName = null;
    if (chart) chart.setOption(chartOption(), true);
    byId('districtMapCoverage').textContent = geography === 'regions'
      ? '16 regional summaries aggregated from 261 districts'
      : '261 of 261 district records joined';
    byId('districtMapMetricLabel').textContent =
      (geography === 'regions' ? 'Regional ' : 'District ') + METRICS[activeMetric].label;

    var fallbackId = geography === 'regions' ? 'Greater Accra' : 'ACCRA METROPOLIS';
    var record = currentRecord(selectionId) || currentRecord(fallbackId) || currentRecords()[0];
    updateInspector(record, announce);
  }

  function bindControls() {
    var selector = byId('districtSelector');
    selector.addEventListener('change', function () {
      updateInspector(currentRecord(selector.value), true);
    });

    document.querySelectorAll('[data-geography-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        setGeography(button.getAttribute('data-geography-view'), null, true);
      });
    });

    document.querySelectorAll('[data-district-metric]').forEach(function (button) {
      button.addEventListener('click', function () {
        setMetric(button.getAttribute('data-district-metric'));
      });
    });

    document.querySelectorAll('[data-district-view]').forEach(function (button) {
      button.addEventListener('click', function () {
        activeView = button.getAttribute('data-district-view');
        document.querySelectorAll('[data-district-view]').forEach(function (candidate) {
          var active = candidate === button;
          candidate.classList.toggle('is-active', active);
          candidate.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderIndicators();
      });
    });

    byId('districtCopySummary').addEventListener('click', function () {
      if (!activeFact) return;
      if (window.copyToClipboard) {
        window.copyToClipboard(districtSummary(activeFact), 'Geographic summary copied');
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(districtSummary(activeFact));
      }
    });

    byId('districtMapReset').addEventListener('click', function () {
      activeView = 'social';
      document.querySelectorAll('[data-district-view]').forEach(function (button) {
        var active = button.getAttribute('data-district-view') === activeView;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      setMetric('health');
      setGeography('regions', 'Greater Accra', true);
    });
  }

  function initialiseMap(districtGeojson, regionGeojson) {
    echarts.registerMap(DISTRICT_MAP_NAME, districtGeojson);
    echarts.registerMap(REGION_MAP_NAME, regionGeojson);
    chart = echarts.init(mapElement, null, { renderer: 'svg' });
    chart.setOption(chartOption());
    chart.on('click', function (params) {
      if (params.componentType === 'series' && currentRecord(params.name)) {
        updateInspector(currentRecord(params.name), true);
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { if (chart) chart.resize(); }, 120);
    }, { passive: true });

    new MutationObserver(function (mutations) {
      if (mutations.some(function (mutation) { return mutation.attributeName === 'data-v2-theme'; })) {
        chart.setOption(chartOption(), true);
        selectedMapName = null;
        updateInspector(activeFact, false);
      }
    }).observe(document.documentElement, { attributes: true });
  }

  function fail(message) {
    root.setAttribute('aria-busy', 'false');
    var loading = byId('districtMapLoading');
    if (loading) {
      loading.classList.add('is-error');
      loading.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><span>' +
        escapeHtml(message) + '</span>';
    }
  }

  if (typeof echarts === 'undefined') {
    fail('The district map engine could not start.');
    return;
  }

  Promise.all([
    fetch(root.getAttribute('data-geo-url')).then(function (response) {
      if (!response.ok) throw new Error('District boundaries did not load');
      return response.json();
    }),
    fetch(root.getAttribute('data-region-geo-url')).then(function (response) {
      if (!response.ok) throw new Error('Regional boundaries did not load');
      return response.json();
    }),
    fetch(root.getAttribute('data-facts-url')).then(function (response) {
      if (!response.ok) throw new Error('District facts did not load');
      return response.json();
    })
  ]).then(function (payload) {
    var districtGeojson = payload[0];
    var regionGeojson = payload[1];
    var factPayload = payload[2];
    facts = (factPayload.districts || factPayload).slice().sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    facts.forEach(function (fact) { factById[fact.id] = fact; });
    regions = buildRegionSummaries();
    regions.forEach(function (region) { regionById[region.id] = region; });
    if (facts.length !== 261 || !districtGeojson.features || districtGeojson.features.length !== 261 ||
        regions.length !== 16 || !regionGeojson.features || regionGeojson.features.length !== 16) {
      throw new Error('The complete regional and district atlas is unavailable');
    }

    bindControls();
    initialiseMap(districtGeojson, regionGeojson);
    var loading = byId('districtMapLoading');
    if (loading) loading.hidden = true;
    root.setAttribute('aria-busy', 'false');

    setGeography('regions', 'Greater Accra', false);
  }).catch(function (error) {
    fail(error.message || 'District intelligence data could not load.');
  });
})();
