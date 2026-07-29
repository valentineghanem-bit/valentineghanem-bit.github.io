(function () {
  var page = document.querySelector('.certificates-v2');
  if (!page) return;

  var yearIndex = page.querySelector('.certificates-year-index');
  var yearButtons = Array.prototype.slice.call(
    page.querySelectorAll('[data-cpd-year-jump]')
  );
  var register = page.querySelector('[data-cpd-register]');
  var yearSelect = register && register.querySelector('#cpd-year');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var compactRegister = window.matchMedia('(max-width: 980px)');
  var applyFilters = function () {};

  if (yearIndex) {
    window.requestAnimationFrame(function () {
      yearIndex.classList.add('is-ready');
    });
  }

  function setCurrentYear(year) {
    yearButtons.forEach(function (button) {
      var isCurrent = button.getAttribute('data-cpd-year-jump') === year;
      if (isCurrent) {
        button.setAttribute('aria-current', 'true');
      } else {
        button.removeAttribute('aria-current');
      }
    });
  }

  if (register) {
    var form = register.querySelector('.cpd-register__controls');
    var searchInput = register.querySelector('#cpd-search');
    var sourceSelect = register.querySelector('#cpd-source');
    var resultCount = register.querySelector('[data-cpd-result-count]');
    var resultLabel = register.querySelector('[data-cpd-result-label]');
    var emptyState = register.querySelector('[data-cpd-empty]');
    var inspector = register.querySelector('.cpd-register__inspector');
    var records = Array.prototype.slice.call(
      register.querySelectorAll('[data-cpd-record]')
    );
    var groups = Array.prototype.slice.call(
      register.querySelectorAll('[data-year-group]')
    );
    var details = Array.prototype.slice.call(
      register.querySelectorAll('[data-cpd-detail]')
    );
    var triggers = records.map(function (record) {
      return record.querySelector('[data-cpd-record-trigger]');
    });

    function normalize(value) {
      return String(value || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
    }

    function detailFor(targetId) {
      return details.find(function (detail) {
        return detail.id === targetId;
      });
    }

    function selectRecord(trigger, moveFocus) {
      if (!trigger) return;
      var targetId = trigger.getAttribute('data-cpd-target');
      var selectedDetail = detailFor(targetId);

      triggers.forEach(function (candidate) {
        candidate.setAttribute(
          'aria-expanded',
          candidate === trigger ? 'true' : 'false'
        );
      });

      details.forEach(function (detail) {
        detail.hidden = detail !== selectedDetail;
      });

      if (emptyState) emptyState.hidden = true;

      if (moveFocus && selectedDetail) {
        selectedDetail.focus({ preventScroll: true });
      }
    }

    function visibleTriggers() {
      return records
        .filter(function (record) { return !record.hidden; })
        .map(function (record) {
          return record.querySelector('[data-cpd-record-trigger]');
        });
    }

    applyFilters = function () {
      var query = normalize(searchInput && searchInput.value);
      var year = yearSelect ? yearSelect.value : 'all';
      var source = sourceSelect ? sourceSelect.value : 'all';
      var visibleCount = 0;

      records.forEach(function (record) {
        var trigger = record.querySelector('[data-cpd-record-trigger]');
        var haystack = normalize(
          record.getAttribute('data-search') ||
          (trigger && trigger.textContent)
        );
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesYear =
          year === 'all' || record.getAttribute('data-year') === year;
        var matchesSource =
          source === 'all' || record.getAttribute('data-source') === source;
        var isVisible = matchesQuery && matchesYear && matchesSource;

        record.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      groups.forEach(function (group) {
        group.hidden = !group.querySelector('[data-cpd-record]:not([hidden])');
      });

      if (resultCount) resultCount.textContent = String(visibleCount);
      if (resultLabel) {
        resultLabel.textContent =
          visibleCount === 1 ? 'record shown' : 'records shown';
      }

      setCurrentYear(year);

      var currentTrigger = triggers.find(function (trigger) {
        return trigger.getAttribute('aria-expanded') === 'true';
      });
      var currentRecord =
        currentTrigger && currentTrigger.closest('[data-cpd-record]');
      var firstVisible = visibleTriggers()[0];

      if (!visibleCount) {
        triggers.forEach(function (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        });
        details.forEach(function (detail) { detail.hidden = true; });
        if (emptyState) emptyState.hidden = false;
      } else if (!currentRecord || currentRecord.hidden) {
        selectRecord(firstVisible, false);
      } else if (emptyState) {
        emptyState.hidden = true;
      }
    };

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        selectRecord(trigger, false);
        if (compactRegister.matches && inspector) {
          inspector.scrollIntoView({
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });

      trigger.addEventListener('keydown', function (event) {
        if (
          event.key !== 'ArrowDown' &&
          event.key !== 'ArrowUp' &&
          event.key !== 'Home' &&
          event.key !== 'End'
        ) return;

        var available = visibleTriggers();
        var currentIndex = available.indexOf(trigger);
        var nextIndex = currentIndex;

        if (event.key === 'ArrowDown') {
          nextIndex = Math.min(currentIndex + 1, available.length - 1);
        } else if (event.key === 'ArrowUp') {
          nextIndex = Math.max(currentIndex - 1, 0);
        } else if (event.key === 'Home') {
          nextIndex = 0;
        } else if (event.key === 'End') {
          nextIndex = available.length - 1;
        }

        event.preventDefault();
        available[nextIndex].focus();
        selectRecord(available[nextIndex], false);
      });
    });

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (yearSelect) yearSelect.addEventListener('change', applyFilters);
    if (sourceSelect) sourceSelect.addEventListener('change', applyFilters);
    if (form) {
      form.addEventListener('reset', function () {
        window.setTimeout(applyFilters, 0);
      });
    }

    applyFilters();
  }

  yearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var year = button.getAttribute('data-cpd-year-jump') || 'all';

      if (yearSelect) yearSelect.value = year;
      applyFilters();

      var target = document.querySelector('#cpd-register');
      if (target) {
        target.scrollIntoView({
          behavior: reducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  });

  var hero = page.querySelector('.certificates-hero');
  var documentLink = page.querySelector('.certificates-hero__document');
  var precisePointer = window.matchMedia('(pointer: fine)');
  var frame = 0;

  if (hero && documentLink && precisePointer.matches && !reducedMotion.matches) {
    hero.addEventListener('pointermove', function (event) {
      if (frame) return;
      frame = window.requestAnimationFrame(function () {
        var bounds = hero.getBoundingClientRect();
        var x = (event.clientX - bounds.left) / bounds.width - 0.5;
        var y = (event.clientY - bounds.top) / bounds.height - 0.5;
        documentLink.style.setProperty('--document-rx', (-y * 2.4).toFixed(2) + 'deg');
        documentLink.style.setProperty('--document-ry', (-5 + x * 3).toFixed(2) + 'deg');
        frame = 0;
      });
    });

    hero.addEventListener('pointerleave', function () {
      documentLink.style.removeProperty('--document-rx');
      documentLink.style.removeProperty('--document-ry');
    });
  }

  if (window.v2Motion) {
    v2Motion.attachMagnetic('.cpd-detail__action a');
  }
})();
