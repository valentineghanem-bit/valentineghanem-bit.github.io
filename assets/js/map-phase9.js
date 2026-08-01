(function () {
  'use strict';

  var root = document.querySelector('[data-map9-root]');
  if (!root) return;

  var selectedName = root.querySelector('[data-map9-selected-name]');
  var selectedContext = root.querySelector('[data-map9-selected-context]');
  var selectedValue = root.querySelector('[data-map9-selected-value]');
  var rangeMarker = root.querySelector('[data-map9-range-marker]');
  var rangeMin = root.querySelector('[data-map9-range-min]');
  var rangeMax = root.querySelector('[data-map9-range-max]');
  var selectedRank = root.querySelector('[data-map9-selected-rank]');
  var selectedNote = root.querySelector('[data-map9-selected-note]');
  var rankingTitle = root.querySelector('[data-map9-ranking-title]');
  var rankingScope = root.querySelector('[data-map9-ranking-scope]');
  var rankingList = root.querySelector('[data-map9-ranking-list]');
  var returnSelected = root.querySelector('[data-map9-return-selected]');
  var currentSelectionId = '';

  function validNumber(value) {
    return typeof value === 'number' && Number.isFinite(value);
  }

  function format(value, suffix) {
    if (!validNumber(value)) return 'Not available';
    return new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1 }).format(value) + (suffix || '');
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function selectGeography(id) {
    var selector = document.getElementById('districtSelector');
    if (!selector) return;
    selector.value = id;
    selector.dispatchEvent(new Event('change', { bubbles: true }));
    var atlas = document.getElementById('national-atlas');
    if (atlas) atlas.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function render(event) {
    var detail = event.detail;
    if (!detail || !detail.metric || !detail.selected || !Array.isArray(detail.items)) return;

    var items = detail.items.filter(function (item) { return validNumber(item.value); });
    if (!items.length) return;
    var ascending = items.slice().sort(function (a, b) { return a.value - b.value; });
    var descending = ascending.slice().reverse();
    var min = ascending[0].value;
    var max = ascending[ascending.length - 1].value;
    var selectedIndex = ascending.findIndex(function (item) { return item.id === detail.selected.id; });
    var selectedPosition = selectedIndex < 0 ? 0 : selectedIndex;
    var percentile = items.length > 1 ? selectedPosition / (items.length - 1) * 100 : 50;
    var rankFromHigh = items.length - selectedPosition;
    var levelLabel = detail.geography === 'regions' ? 'regional' : 'district';

    selectedName.textContent = detail.selected.name;
    currentSelectionId = detail.selected.id;
    selectedContext.textContent = detail.metric.label + ' at ' + levelLabel + ' level';
    selectedValue.textContent = format(detail.metric.value, detail.metric.suffix);
    rangeMarker.style.left = Math.max(0, Math.min(100, percentile)).toFixed(1) + '%';
    rangeMin.textContent = format(min, detail.metric.suffix);
    rangeMax.textContent = format(max, detail.metric.suffix);
    selectedRank.textContent = rankFromHigh + ' of ' + items.length + ' by value';
    selectedNote.textContent = 'This position compares ' + detail.selected.name + ' with the other ' +
      (detail.geography === 'regions' ? 'regions' : 'districts') +
      ' for the active indicator. It is descriptive and is not a clinical threshold.';
    rankingTitle.textContent = 'Highest ' + detail.metric.label.toLowerCase() + ' values';
    rankingScope.textContent = items.length + ' ' + (detail.geography === 'regions' ? 'regions' : 'districts');

    var leaders = detail.geography === 'regions' ? descending : descending.slice(0, 12);
    if (!leaders.some(function (item) { return item.id === detail.selected.id; })) {
      var selectedItem = items.find(function (item) { return item.id === detail.selected.id; });
      if (selectedItem) leaders.push(selectedItem);
    }

    rankingList.innerHTML = leaders.map(function (item, index) {
      var width = max === min ? 100 : (item.value - min) / (max - min) * 100;
      var active = item.id === detail.selected.id;
      var position = descending.findIndex(function (candidate) { return candidate.id === item.id; }) + 1;
      return '<li' + (active ? ' class="is-active"' : '') + '>' +
        '<button type="button" data-map9-select="' + escapeHtml(item.id) + '"' +
        ' aria-label="Select ' + escapeHtml(item.name) + ' in the atlas">' +
        '<span class="map9-ranking__position">' + String(position).padStart(2, '0') + '</span>' +
        '<span class="map9-ranking__label"><strong>' + escapeHtml(item.name) + '</strong>' +
        '<small>' + escapeHtml(detail.geography === 'regions' ? 'Regional summary' : item.region) + '</small></span>' +
        '<span class="map9-ranking__bar" aria-hidden="true"><i style="width:' + Math.max(3, width).toFixed(1) + '%"></i></span>' +
        '<b>' + format(item.value, detail.metric.suffix) + '</b>' +
        '<span class="map9-ranking__action">View on map <i class="fa-solid fa-arrow-up" aria-hidden="true"></i></span>' +
        '</button></li>';
    }).join('');
  }

  window.addEventListener('vgg:atlas-selection', render);

  if (rankingList) {
    rankingList.addEventListener('click', function (event) {
      var button = event.target.closest('[data-map9-select]');
      if (button) selectGeography(button.getAttribute('data-map9-select'));
    });
  }

  if (returnSelected) {
    returnSelected.addEventListener('click', function () {
      if (currentSelectionId) selectGeography(currentSelectionId);
    });
  }
})();
