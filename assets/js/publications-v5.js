(function () {
  "use strict";

  var root = document.querySelector("[data-publications-v5]");
  var dataNode = document.getElementById("publicationsData");
  if (!root || !dataNode) return;

  var records;
  try {
    records = JSON.parse(dataNode.textContent);
  } catch (error) {
    return;
  }

  var ledger = root.querySelector("[data-publication-list]");
  var recordButtons = Array.prototype.slice.call(root.querySelectorAll("[data-publication-index]"));
  var filterButtons = Array.prototype.slice.call(root.querySelectorAll("[data-publication-filter]"));
  var viewButtons = Array.prototype.slice.call(root.querySelectorAll("[data-publication-view]"));
  var searchInput = root.querySelector("#publicationSearch");
  var resetButton = root.querySelector("[data-publication-reset]");
  var sortSelect = root.querySelector("#publicationSort");
  var statusNode = root.querySelector("[data-publication-status]");
  var emptyNode = root.querySelector("[data-publications-empty]");
  var inspector = root.querySelector("#publicationInspector");
  var inspectorStatus = root.querySelector("[data-inspector-status]");
  var inspectorSource = root.querySelector("[data-inspector-source]");
  var inspectorRecord = root.querySelector("[data-inspector-record]");
  var inspectorTitle = root.querySelector("[data-inspector-title]");
  var inspectorPanel = root.querySelector("[data-inspector-panel]");
  var inspectorCitation = root.querySelector("[data-inspector-citation]");
  var inspectorActions = root.querySelector("[data-inspector-actions]");

  var state = {
    activeIndex: 0,
    filter: "all",
    query: "",
    sort: "newest",
    view: "evidence"
  };

  function showToast(message) {
    if (typeof window.vgShowToast === "function") {
      window.vgShowToast(message);
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        area.remove();
      }
    });
  }

  function iconClassForLabel(label) {
    var value = String(label || "").toLowerCase();
    if (value.indexOf("dashboard") !== -1) return "fa-solid fa-chart-line";
    if (value.indexOf("archived") !== -1 || value.indexOf("zenodo") !== -1) return "fa-solid fa-box-archive";
    if (value.indexOf("code") !== -1 || value.indexOf("repository") !== -1 || value.indexOf("model") !== -1) return "fa-brands fa-github";
    return "fa-solid fa-arrow-up-right-from-square";
  }

  function appendIcon(parent, className) {
    var icon = document.createElement("i");
    icon.className = className;
    icon.setAttribute("aria-hidden", "true");
    parent.appendChild(icon);
  }

  function renderEvidence(record) {
    var summary = document.createElement("p");
    summary.textContent = record.summary;
    inspectorPanel.appendChild(summary);

    var note = document.createElement("aside");
    appendIcon(note, "fa-solid fa-circle-info");
    var noteText = document.createElement("span");
    noteText.textContent = record.caveat;
    note.appendChild(noteText);
    inspectorPanel.appendChild(note);
  }

  function renderMethods(record) {
    var methods = document.createElement("div");
    methods.className = "publications-inspector__methods";
    (record.methods || []).forEach(function (method) {
      var item = document.createElement("span");
      item.textContent = method;
      methods.appendChild(item);
    });
    inspectorPanel.appendChild(methods);
  }

  function renderArtifacts(record) {
    var links = record.links || [];
    if (!links.length) {
      var empty = document.createElement("p");
      empty.className = "publications-inspector__empty-artifacts";
      empty.textContent = "No separate code, dashboard or software deposit is attached to this publication record.";
      inspectorPanel.appendChild(empty);
      return;
    }

    var artifacts = document.createElement("div");
    artifacts.className = "publications-inspector__artifacts";
    links.forEach(function (link) {
      var anchor = document.createElement("a");
      anchor.href = link.url;
      anchor.target = "_blank";
      anchor.rel = "noopener";
      appendIcon(anchor, iconClassForLabel(link.label));
      anchor.appendChild(document.createTextNode(link.label));
      artifacts.appendChild(anchor);
    });
    inspectorPanel.appendChild(artifacts);
  }

  function renderPanel(record) {
    inspectorPanel.replaceChildren();
    inspectorPanel.setAttribute("aria-labelledby", "publication-detail-" + state.view);

    if (state.view === "methods") {
      renderMethods(record);
    } else if (state.view === "artifacts") {
      renderArtifacts(record);
    } else {
      renderEvidence(record);
    }
  }

  function renderActions(record) {
    inspectorActions.replaceChildren();

    var doi = document.createElement("a");
    doi.href = record.doi_url;
    doi.target = "_blank";
    doi.rel = "noopener";
    appendIcon(doi, "fa-solid fa-arrow-up-right-from-square");
    doi.appendChild(document.createTextNode(record.record_type === "repository" ? "Open archived record" : "Open DOI"));
    inspectorActions.appendChild(doi);

    var copy = document.createElement("button");
    copy.type = "button";
    appendIcon(copy, "fa-regular fa-copy");
    copy.appendChild(document.createTextNode("Copy citation"));
    copy.addEventListener("click", function () {
      copyText(record.citation).then(function () {
        copy.classList.add("is-copied");
        copy.lastChild.nodeValue = " Citation copied";
        showToast("Citation copied to clipboard");
        window.setTimeout(function () {
          copy.classList.remove("is-copied");
          copy.lastChild.nodeValue = " Copy citation";
        }, 1600);
      });
    });
    inspectorActions.appendChild(copy);
  }

  function renderInspector() {
    var record = records[state.activeIndex];
    if (!record) return;

    inspectorStatus.textContent = record.status;
    inspectorStatus.className = "publications-record-status publications-record-status--" + record.record_type;
    inspectorSource.textContent = record.journal + " / " + record.year;
    inspectorRecord.textContent = "PUB-" + String(state.activeIndex + 1).padStart(2, "0");
    inspectorTitle.textContent = record.title;
    inspectorCitation.textContent = record.citation;
    inspector.setAttribute("aria-labelledby", "publication-tab-" + (state.activeIndex + 1));

    recordButtons.forEach(function (button) {
      var selected = Number(button.getAttribute("data-publication-index")) === state.activeIndex;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", selected ? "true" : "false");
      button.tabIndex = selected ? 0 : -1;
    });

    renderPanel(record);
    renderActions(record);
  }

  function selectRecord(index, moveFocus) {
    if (!records[index]) return;
    state.activeIndex = index;
    renderInspector();
    if (moveFocus) {
      var button = root.querySelector('[data-publication-index="' + index + '"]');
      if (button) button.focus();
    }
  }

  function visibleButtons() {
    return recordButtons.filter(function (button) {
      return !button.hidden;
    });
  }

  function recordMatches(button) {
    var filterMatch = state.filter === "all" || button.getAttribute("data-publication-type") === state.filter;
    var searchable = (button.getAttribute("data-publication-search") || "").toLowerCase();
    return filterMatch && (!state.query || searchable.indexOf(state.query) !== -1);
  }

  function compareButtons(a, b) {
    if (state.sort === "title") {
      return a.getAttribute("data-publication-title").localeCompare(b.getAttribute("data-publication-title"));
    }

    var yearA = Number(a.getAttribute("data-publication-year"));
    var yearB = Number(b.getAttribute("data-publication-year"));
    var yearResult = state.sort === "oldest" ? yearA - yearB : yearB - yearA;
    if (yearResult !== 0) return yearResult;
    return Number(a.getAttribute("data-publication-index")) - Number(b.getAttribute("data-publication-index"));
  }

  function applyFilters() {
    recordButtons.sort(compareButtons).forEach(function (button) {
      ledger.appendChild(button);
      button.hidden = !recordMatches(button);
    });

    var visible = visibleButtons();
    var activeVisible = visible.some(function (button) {
      return Number(button.getAttribute("data-publication-index")) === state.activeIndex;
    });

    if (visible.length && !activeVisible) {
      state.activeIndex = Number(visible[0].getAttribute("data-publication-index"));
      renderInspector();
    }

    if (emptyNode) emptyNode.hidden = visible.length !== 0;
    if (inspector) inspector.hidden = visible.length === 0;
    if (statusNode) {
      statusNode.textContent = visible.length === records.length
        ? "Showing all " + records.length + " records."
        : "Showing " + visible.length + " of " + records.length + " records.";
    }
  }

  recordButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectRecord(Number(button.getAttribute("data-publication-index")), false);
    });

    button.addEventListener("keydown", function (event) {
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var buttons = visibleButtons();
      var current = buttons.indexOf(button);
      var next = current;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (current + 1) % buttons.length;
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      selectRecord(Number(buttons[next].getAttribute("data-publication-index")), true);
    });
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.filter = button.getAttribute("data-publication-filter");
      filterButtons.forEach(function (item) {
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      applyFilters();
    });
  });

  viewButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      state.view = button.getAttribute("data-publication-view");
      viewButtons.forEach(function (item) {
        var selected = item === button;
        item.setAttribute("aria-selected", selected ? "true" : "false");
        item.tabIndex = selected ? 0 : -1;
      });
      renderPanel(records[state.activeIndex]);
    });

    button.addEventListener("keydown", function (event) {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      var current = viewButtons.indexOf(button);
      var next = current;
      if (event.key === "ArrowRight") next = (current + 1) % viewButtons.length;
      if (event.key === "ArrowLeft") next = (current - 1 + viewButtons.length) % viewButtons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = viewButtons.length - 1;
      viewButtons[next].click();
      viewButtons[next].focus();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value.trim().toLowerCase();
      applyFilters();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      applyFilters();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", function () {
      state.query = "";
      state.filter = "all";
      state.sort = "newest";
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "newest";
      filterButtons.forEach(function (button) {
        button.setAttribute("aria-pressed", button.getAttribute("data-publication-filter") === "all" ? "true" : "false");
      });
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  renderInspector();
  applyFilters();
})();
