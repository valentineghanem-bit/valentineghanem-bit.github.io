(function () {
  'use strict';

  var root = document.querySelector('.community-v2');
  if (!root) return;

  var filters = Array.prototype.slice.call(root.querySelectorAll('[data-community-filter]'));
  var records = Array.prototype.slice.call(root.querySelectorAll('[data-community-record]'));
  var sections = Array.prototype.slice.call(root.querySelectorAll('[data-community-section]'));
  var status = root.querySelector('[data-community-status]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function statusText(count, filter) {
    if (filter === 'all') return 'Showing all ' + count + ' activities.';
    var labels = {
      screening: 'screening',
      learning: 'professional-learning',
      engagement: 'public-engagement'
    };
    return 'Showing ' + count + ' ' + labels[filter] + ' activities.';
  }

  function applyFilter(filter, announce) {
    var visibleCount = 0;
    filters.forEach(function (button) {
      var selected = button.dataset.communityFilter === filter;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.tabIndex = selected ? 0 : -1;
    });

    records.forEach(function (record) {
      var visible = filter === 'all' || record.dataset.communityRecord === filter;
      record.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    sections.forEach(function (section) {
      var visible = filter === 'all' || section.dataset.communitySection === filter;
      section.hidden = !visible;
    });

    if (status) status.textContent = statusText(visibleCount, filter);
    if (announce && !reducedMotion) {
      var firstVisible = records.find(function (record) { return !record.hidden; });
      if (firstVisible) firstVisible.classList.add('is-in-view');
    }
  }

  filters.forEach(function (button, index) {
    button.addEventListener('click', function () {
      applyFilter(button.dataset.communityFilter, true);
    });
    button.addEventListener('keydown', function (event) {
      var nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % filters.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + filters.length) % filters.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = filters.length - 1;
      else return;
      event.preventDefault();
      filters[nextIndex].focus();
      applyFilter(filters[nextIndex].dataset.communityFilter, true);
    });
  });

  root.querySelectorAll('.event-media__item img[role="button"]').forEach(function (image) {
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        image.click();
      }
    });
  });

  records.forEach(function (record) {
    record.addEventListener('toggle', function () {
      record.classList.toggle('is-open', record.open);
    });
  });

  if ('IntersectionObserver' in window) {
    var recordObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-in-view', entry.isIntersecting);
      });
    }, { rootMargin: '-20% 0px -58% 0px', threshold: 0 });
    records.forEach(function (record) { recordObserver.observe(record); });
  }

  var target = window.location.hash ? root.querySelector(window.location.hash) : null;
  if (target && target.matches('.community-record')) {
    target.open = true;
    applyFilter('all', false);
  } else {
    applyFilter('all', false);
  }
})();
