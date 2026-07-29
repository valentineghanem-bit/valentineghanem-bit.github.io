(function () {
  "use strict";

  var root = document.querySelector("[data-skills-v4]");
  if (!root) return;

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dataNode = document.getElementById("skillsPracticeData");
  var practiceData = [];

  try {
    practiceData = JSON.parse(dataNode ? dataNode.textContent : "[]");
  } catch (error) {
    practiceData = [];
  }

  var domainTabs = Array.prototype.slice.call(root.querySelectorAll("[data-practice-domain]"));
  var stageButtons = Array.prototype.slice.call(root.querySelectorAll("[data-practice-stage]"));
  var matrixButtons = Array.prototype.slice.call(root.querySelectorAll("[data-matrix-domain]"));
  var inspector = root.querySelector("#skillsPracticeInspector");
  var path = root.querySelector(".skills-practice__path");
  var practiceState = { domain: 0, stage: 0 };

  var domainMeta = {
    "Public Health": {
      accent: "#34D399",
      title: "Public-health",
      summary: "Laboratory-informed surveillance, community screening and interpretation of diagnostic evidence for population-health reporting.",
      route: "/community/",
      routeLabel: "View field-practice evidence"
    },
    "Data Science": {
      accent: "#A78BFA",
      title: "Data-science",
      summary: "Reproducible analysis, epidemiological modelling, spatial methods and interactive systems for research and public-health interpretation.",
      route: "/portfolio/",
      routeLabel: "Inspect models and analytical systems"
    },
    "Biomedical Science": {
      accent: "#F87171",
      title: "Biomedical-science",
      summary: "Cross-disciplinary diagnostic practice spanning clinical chemistry, haematology, immunoassay, microscopy, bacteriology, molecular diagnostics, histopathology and laboratory quality systems.",
      route: "/about/#career-record",
      routeLabel: "Review clinical-practice record"
    }
  };

  function text(node, value) {
    if (node) node.textContent = value;
  }

  function updateLinkLabel(link, label) {
    if (!link) return;
    var labelNode = Array.prototype.find.call(link.childNodes, function (node) {
      return node.nodeType === Node.TEXT_NODE;
    });
    if (labelNode) labelNode.textContent = label + " ";
  }

  function renderPractice(focusTarget) {
    var domain = practiceData[practiceState.domain];
    if (!domain) return;
    var stage = domain.stages[practiceState.stage];
    if (!stage) return;
    var meta = domainMeta[domain.name] || domainMeta["Public Health"];

    domainTabs.forEach(function (tab, index) {
      var active = index === practiceState.domain;
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
    });

    stageButtons.forEach(function (button, index) {
      button.setAttribute("aria-pressed", index === practiceState.stage ? "true" : "false");
    });

    matrixButtons.forEach(function (button) {
      button.classList.toggle(
        "is-active",
        button.dataset.matrixDomain === domain.name &&
          button.dataset.matrixStage === stage.category
      );
    });

    if (path) path.style.setProperty("--domain-accent", meta.accent);
    if (inspector) {
      inspector.style.setProperty("--domain-accent", meta.accent);
      inspector.setAttribute("aria-labelledby", domainTabs[practiceState.domain].id);
      text(inspector.querySelector("[data-practice-kicker]"), domain.name + " / " + stage.category);
      text(
        inspector.querySelector("[data-practice-count]"),
        stage.items.length + (stage.items.length === 1 ? " documented statement" : " documented statements")
      );
      text(
        inspector.querySelector("[data-practice-title]"),
        meta.title + " " + stage.category.toLowerCase() + " practice"
      );
      text(inspector.querySelector("[data-practice-summary]"), meta.summary);

      var list = inspector.querySelector("[data-practice-items]");
      if (list) {
        list.replaceChildren();
        stage.items.forEach(function (item) {
          var listItem = document.createElement("li");
          listItem.textContent = item;
          list.appendChild(listItem);
        });
      }

      var route = inspector.querySelector("[data-practice-route]");
      if (route) {
        route.href = meta.route;
        updateLinkLabel(route, meta.routeLabel);
      }

      if (!reducedMotion) {
        inspector.classList.remove("is-switching");
        inspector.getBoundingClientRect();
        inspector.classList.add("is-switching");
      }
    }

    if (focusTarget) focusTarget.focus();
  }

  function activateDomain(name, focusTarget) {
    var index = practiceData.findIndex(function (entry) { return entry.name === name; });
    if (index < 0) return;
    practiceState.domain = index;
    renderPractice(focusTarget);
  }

  function activateStage(name, focusTarget) {
    var domain = practiceData[practiceState.domain];
    if (!domain) return;
    var index = domain.stages.findIndex(function (entry) { return entry.category === name; });
    if (index < 0) return;
    practiceState.stage = index;
    renderPractice(focusTarget);
  }

  domainTabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () {
      practiceState.domain = index;
      renderPractice();
    });
    tab.addEventListener("keydown", function (event) {
      var next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % domainTabs.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + domainTabs.length) % domainTabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = domainTabs.length - 1;
      else return;
      event.preventDefault();
      practiceState.domain = next;
      renderPractice(domainTabs[next]);
    });
  });

  stageButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      practiceState.stage = index;
      renderPractice();
    });
    button.addEventListener("keydown", function (event) {
      var next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % stageButtons.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + stageButtons.length) % stageButtons.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = stageButtons.length - 1;
      else return;
      event.preventDefault();
      practiceState.stage = next;
      renderPractice(stageButtons[next]);
    });
  });

  matrixButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activateDomain(button.dataset.matrixDomain);
      activateStage(button.dataset.matrixStage);
      if (inspector) inspector.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    });
  });

  root.querySelectorAll("[data-hero-domain]").forEach(function (button) {
    button.addEventListener("click", function () {
      activateDomain(button.dataset.heroDomain);
      var section = document.getElementById("practice-architecture");
      if (section) section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    });
  });

  var registryItems = Array.prototype.slice.call(root.querySelectorAll("[data-registry-item]"));
  var railButtons = Array.prototype.slice.call(
    root.querySelectorAll(".skills-registry__segments [data-registry-rail]")
  );
  var categoryButtons = Array.prototype.slice.call(
    root.querySelectorAll(".skills-registry__filters [data-registry-category]")
  );
  var laboratoryGroup = root.querySelector("#skillsLaboratoryGroup");
  var registrySearch = root.querySelector("#skillsRegistrySearch");
  var registryReset = root.querySelector("[data-registry-reset]");
  var registryStatus = root.querySelector("[data-registry-status]");
  var registryEmpty = root.querySelector("[data-registry-empty]");
  var registryInspector = root.querySelector(".skills-registry__inspector");
  var registryState = { rail: "all", category: "all", group: "all", query: "" };

  var registryRoutes = {
    code: { url: "/portfolio/", label: "Inspect related project evidence" },
    modelling: { url: "/publications/", label: "Review related research methods" },
    spatial: { url: "/map/", label: "Open spatial evidence map" },
    "public-health": { url: "/community/", label: "View field-practice evidence" },
    laboratory: { url: "/about/#career-record", label: "Review clinical-practice record" }
  };

  function selectRegistryItem(item, focusTarget) {
    if (!item || !registryInspector) return;
    registryItems.forEach(function (candidate) {
      var active = candidate === item;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", active ? "true" : "false");
    });

    var markSource = item.querySelector(".skills-registry__mark");
    var markTarget = registryInspector.querySelector("[data-registry-inspector-mark]");
    if (markSource && markTarget) markTarget.innerHTML = markSource.innerHTML;
    text(registryInspector.querySelector("[data-registry-inspector-name]"), item.dataset.registryName);
    text(
      registryInspector.querySelector("[data-registry-inspector-category]"),
      item.dataset.registryGroup + " / " + item.dataset.registryScope
    );
    text(registryInspector.querySelector("[data-registry-inspector-detail]"), item.dataset.registryDetail);

    var routeData = registryRoutes[item.dataset.registryCategory] || registryRoutes.code;
    var route = registryInspector.querySelector("[data-registry-route]");
    if (route) {
      route.href = routeData.url;
      updateLinkLabel(route, routeData.label);
    }
    if (focusTarget) item.focus();
  }

  function applyRegistryFilters() {
    var query = registryState.query.toLowerCase();
    var visibleItems = registryItems.filter(function (item) {
      var railMatch = registryState.rail === "all" || item.dataset.registryRail === registryState.rail;
      var categoryMatch = registryState.category === "all" || item.dataset.registryCategory === registryState.category;
      var groupMatch = registryState.group === "all" || item.dataset.registryGroup === registryState.group;
      var textValue = (
        item.dataset.registryName + " " +
        item.dataset.registryDetail + " " +
        item.dataset.registryGroup + " " +
        item.dataset.registryScope
      ).toLowerCase();
      var queryMatch = !query || textValue.indexOf(query) !== -1;
      var visible = railMatch && categoryMatch && groupMatch && queryMatch;
      item.hidden = !visible;
      return visible;
    });

    text(
      registryStatus,
      visibleItems.length + (visibleItems.length === 1 ? " record shown" : " records shown")
    );
    if (registryEmpty) registryEmpty.hidden = visibleItems.length !== 0;

    var current = registryItems.find(function (item) { return item.classList.contains("is-active") && !item.hidden; });
    if (!current && visibleItems.length) selectRegistryItem(visibleItems[0]);
  }

  railButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      registryState.rail = button.dataset.registryRail;
      railButtons.forEach(function (candidate) {
        candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false");
      });
      applyRegistryFilters();
    });
  });

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      registryState.category = button.dataset.registryCategory;
      if (registryState.category !== "laboratory") {
        registryState.group = "all";
        if (laboratoryGroup) laboratoryGroup.value = "all";
      }
      categoryButtons.forEach(function (candidate) {
        candidate.setAttribute("aria-pressed", candidate === button ? "true" : "false");
      });
      applyRegistryFilters();
    });
  });

  if (laboratoryGroup) {
    laboratoryGroup.addEventListener("change", function () {
      registryState.group = laboratoryGroup.value;
      if (registryState.group !== "all") {
        registryState.category = "laboratory";
        categoryButtons.forEach(function (button) {
          button.setAttribute("aria-pressed", button.dataset.registryCategory === "laboratory" ? "true" : "false");
        });
      }
      applyRegistryFilters();
    });
  }

  if (registrySearch) {
    registrySearch.addEventListener("input", function () {
      registryState.query = registrySearch.value.trim();
      applyRegistryFilters();
    });
  }

  if (registryReset) {
    registryReset.addEventListener("click", function () {
      registryState = { rail: "all", category: "all", group: "all", query: "" };
      if (registrySearch) {
        registrySearch.value = "";
        registrySearch.focus();
      }
      if (laboratoryGroup) laboratoryGroup.value = "all";
      railButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", button.dataset.registryRail === "all" ? "true" : "false");
      });
      categoryButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", button.dataset.registryCategory === "all" ? "true" : "false");
      });
      applyRegistryFilters();
    });
  }

  registryItems.forEach(function (item) {
    item.addEventListener("click", function () { selectRegistryItem(item); });
  });

  renderPractice();
  if (registryItems.length) selectRegistryItem(registryItems[0]);
})();
