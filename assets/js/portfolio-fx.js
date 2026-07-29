(function () {
  'use strict';

  var root = document.querySelector('[data-portfolio-v3]');
  if (!root) return;

  var projects = Array.prototype.slice.call(root.querySelectorAll('[data-portfolio-project]'));
  var domainButtons = Array.prototype.slice.call(root.querySelectorAll('[data-portfolio-domain]'));
  var artifactButtons = Array.prototype.slice.call(root.querySelectorAll('[data-portfolio-artifact]'));
  var domainJumps = Array.prototype.slice.call(root.querySelectorAll('[data-portfolio-domain-jump]'));
  var search = root.querySelector('#portfolioSearch');
  var reset = root.querySelector('[data-portfolio-reset]');
  var status = root.querySelector('[data-portfolio-status]');
  var empty = root.querySelector('[data-portfolio-empty]');
  var observatory = root.querySelector('#repository-observatory');
  var inspectorRoot = root.querySelector('.portfolio-inspector');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var state = { domain: 'all', artifact: 'all', query: '' };

  var inspector = {
    number: inspectorRoot.querySelector('[data-project-number]'),
    domain: inspectorRoot.querySelector('[data-project-domain-label]'),
    title: inspectorRoot.querySelector('[data-project-title]'),
    summary: inspectorRoot.querySelector('[data-project-summary]'),
    scale: inspectorRoot.querySelector('[data-project-scale]'),
    methods: inspectorRoot.querySelector('[data-project-methods]'),
    repoName: inspectorRoot.querySelector('[data-project-repo]'),
    repository: inspectorRoot.querySelector('[data-project-repository]'),
    dashboard: inspectorRoot.querySelector('[data-project-dashboard]'),
    poster: inspectorRoot.querySelector('[data-project-poster]')
  };

  function clean(value) {
    return (value || '').toLowerCase().trim();
  }

  function projectText(project) {
    return [
      project.dataset.projectTitle,
      project.dataset.projectRepo,
      project.dataset.projectDomainLabel,
      project.dataset.projectScale,
      project.dataset.projectSummary,
      project.dataset.projectMethods
    ].join(' ').toLowerCase();
  }

  function hasArtifact(project, artifact) {
    if (artifact === 'dashboard') return Boolean(project.dataset.projectDashboard);
    if (artifact === 'poster') return Boolean(project.dataset.projectPoster);
    return true;
  }

  function matches(project) {
    var domainMatch = state.domain === 'all' || project.dataset.projectDomain === state.domain;
    var artifactMatch = state.artifact === 'all' || hasArtifact(project, state.artifact);
    var queryMatch = !state.query || projectText(project).indexOf(state.query) !== -1;
    return domainMatch && artifactMatch && queryMatch;
  }

  function visibleProjects() {
    return projects.filter(function (project) {
      return !project.hidden;
    });
  }

  function setPressed(buttons, key, value) {
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.dataset[key] === value ? 'true' : 'false');
    });
  }

  function previewUrl(repo, path) {
    return 'https://htmlpreview.github.io/?https://github.com/valentineghanem-bit/' +
      encodeURIComponent(repo) + '/blob/main/' + path.split('/').map(encodeURIComponent).join('/');
  }

  function toggleArtifactLink(link, repo, path) {
    if (!link) return;
    if (!path) {
      link.hidden = true;
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      return;
    }
    link.hidden = false;
    link.href = previewUrl(repo, path);
    link.removeAttribute('aria-disabled');
  }

  function selectProject(project, options) {
    if (!project) return;
    var settings = options || {};
    var repo = project.dataset.projectRepo;
    var visible = visibleProjects();
    var sequence = projects.indexOf(project) + 1;

    projects.forEach(function (item) {
      var selected = item === project;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', selected ? 'true' : 'false');
    });

    inspector.number.textContent = String(sequence).padStart(2, '0');
    inspector.domain.textContent = project.dataset.projectDomainLabel;
    inspector.title.textContent = project.dataset.projectTitle;
    inspector.summary.textContent = project.dataset.projectSummary;
    inspector.scale.textContent = project.dataset.projectScale;
    inspector.methods.textContent = project.dataset.projectMethods.split(' | ').join(' / ');
    inspector.repoName.textContent = repo;
    inspector.repository.href = 'https://github.com/valentineghanem-bit/' + encodeURIComponent(repo);
    toggleArtifactLink(inspector.dashboard, repo, project.dataset.projectDashboard);
    toggleArtifactLink(inspector.poster, repo, project.dataset.projectPoster);

    if (settings.focus) project.focus({ preventScroll: true });
    if (settings.announce && status) {
      status.textContent = visible.length + (visible.length === 1 ? ' repository shown. ' : ' repositories shown. ') +
        project.dataset.projectTitle + ' selected.';
    }
  }

  function applyFilters(options) {
    var visible = [];
    projects.forEach(function (project) {
      project.hidden = !matches(project);
      if (!project.hidden) visible.push(project);
    });

    setPressed(domainButtons, 'portfolioDomain', state.domain);
    setPressed(artifactButtons, 'portfolioArtifact', state.artifact);
    empty.hidden = visible.length !== 0;
    status.textContent = visible.length + (visible.length === 1 ? ' repository shown' : ' repositories shown');

    var active = projects.find(function (project) {
      return project.classList.contains('is-active') && !project.hidden;
    });
    if (!active && visible.length) selectProject(visible[0], options);
  }

  function setDomain(domain, fromHero) {
    state.domain = domain;
    applyFilters({ announce: true });
    if (fromHero && observatory) {
      observatory.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }
  }

  domainButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      setDomain(button.dataset.portfolioDomain, false);
    });
  });

  artifactButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      state.artifact = button.dataset.portfolioArtifact;
      applyFilters({ announce: true });
    });
  });

  domainJumps.forEach(function (button) {
    button.addEventListener('click', function () {
      setDomain(button.dataset.portfolioDomainJump, true);
    });
  });

  projects.forEach(function (project) {
    project.addEventListener('click', function () {
      selectProject(project, { announce: true });
    });

    project.addEventListener('keydown', function (event) {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      var visible = visibleProjects();
      if (!visible.length) return;
      var index = visible.indexOf(project);
      if (event.key === 'ArrowDown') index = Math.min(index + 1, visible.length - 1);
      if (event.key === 'ArrowUp') index = Math.max(index - 1, 0);
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = visible.length - 1;
      event.preventDefault();
      selectProject(visible[index], { focus: true, announce: true });
    });
  });

  if (search) {
    search.addEventListener('input', function () {
      state.query = clean(search.value);
      applyFilters({ announce: false });
    });
  }

  if (reset) {
    reset.addEventListener('click', function () {
      state = { domain: 'all', artifact: 'all', query: '' };
      if (search) {
        search.value = '';
        search.focus();
      }
      applyFilters({ announce: true });
    });
  }

  if (window.v2Motion && !reducedMotion.matches) {
    window.v2Motion.revealEach('.portfolio-v3__section-header, .portfolio-archive article');
    window.v2Motion.attachSpotlight('.portfolio-archive article');
  }

  applyFilters({ announce: false });
})();
