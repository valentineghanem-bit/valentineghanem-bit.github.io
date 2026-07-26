(function () {
  'use strict';

  var root = document.querySelector('.about-v3');
  if (!root) return;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initialiseMatrix() {
    var workspace = root.querySelector('[data-about-matrix]');
    if (!workspace) return;
    var tabs = Array.prototype.slice.call(workspace.querySelectorAll('[role="tab"]'));
    var inspector = workspace.querySelector('[role="tabpanel"]');
    var number = workspace.querySelector('[data-matrix-number]');
    var title = workspace.querySelector('[data-matrix-title]');
    var remit = workspace.querySelector('[data-matrix-remit]');
    var methods = workspace.querySelector('[data-matrix-methods]');
    var evidence = workspace.querySelector('[data-matrix-evidence]');
    var output = workspace.querySelector('[data-matrix-output]');
    if (!tabs.length || !inspector) return;

    function activate(tab, focus) {
      tabs.forEach(function (candidate) {
        var selected = candidate === tab;
        candidate.classList.toggle('is-active', selected);
        candidate.setAttribute('aria-selected', selected ? 'true' : 'false');
        candidate.tabIndex = selected ? 0 : -1;
      });

      inspector.style.setProperty('--domain-colour', tab.style.getPropertyValue('--domain-colour'));
      inspector.setAttribute('aria-labelledby', tab.id);
      number.textContent = tab.dataset.domainNumber;
      title.textContent = tab.dataset.domainTitle;
      remit.textContent = tab.dataset.domainRemit;
      evidence.textContent = tab.dataset.domainEvidence;
      output.textContent = tab.dataset.domainOutput;
      methods.replaceChildren();
      (tab.dataset.domainMethods || '').split('||').filter(Boolean).forEach(function (method) {
        var item = document.createElement('span');
        item.textContent = method;
        methods.appendChild(item);
      });

      if (!reducedMotion) {
        inspector.classList.remove('is-switching');
        inspector.getBoundingClientRect();
        inspector.classList.add('is-switching');
      }
      if (focus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { activate(tab, false); });
      tab.addEventListener('keydown', function (event) {
        var next = index;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(tabs[next], true);
      });
    });
  }

  function initialiseCareerRecord() {
    var filters = Array.prototype.slice.call(root.querySelectorAll('[data-record-filter]'));
    var records = Array.prototype.slice.call(root.querySelectorAll('.about-record__item'));
    if (!records.length) return;

    filters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var category = filter.dataset.recordFilter;
        filters.forEach(function (candidate) {
          var active = candidate === filter;
          candidate.classList.toggle('is-active', active);
          candidate.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        records.forEach(function (record) {
          record.hidden = category !== 'all' && record.dataset.recordCategory !== category;
        });
      });
    });

    records.forEach(function (record) {
      var trigger = record.querySelector('button');
      var detail = record.querySelector('.about-record__detail');
      if (!trigger || !detail) return;
      trigger.addEventListener('click', function () {
        var opening = trigger.getAttribute('aria-expanded') !== 'true';
        records.forEach(function (other) {
          var otherTrigger = other.querySelector('button');
          var otherDetail = other.querySelector('.about-record__detail');
          if (otherTrigger && otherDetail && other !== record) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            otherDetail.hidden = true;
          }
        });
        trigger.setAttribute('aria-expanded', opening ? 'true' : 'false');
        detail.hidden = !opening;
      });
    });
  }

  initialiseMatrix();
  initialiseCareerRecord();
})();
