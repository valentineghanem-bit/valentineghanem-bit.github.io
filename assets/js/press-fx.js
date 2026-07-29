(function () {
  "use strict";

  var root = document.querySelector("[data-press-root]");
  if (!root) return;

  var records = Array.prototype.slice.call(root.querySelectorAll("[data-press-record]"));
  var search = root.querySelector("[data-press-search]");
  var filters = Array.prototype.slice.call(root.querySelectorAll("[data-press-filter]"));
  var count = root.querySelector("[data-press-count]");
  var empty = root.querySelector("[data-press-empty]");
  var reset = root.querySelector("[data-press-reset]");
  var activeFilter = "all";

  function value(record, key) {
    var node = record.querySelector('[data-value="' + key + '"]');
    return node ? node.textContent.trim() : "";
  }

  function setText(selector, text) {
    var node = root.querySelector(selector);
    if (node) node.textContent = text;
  }

  function selectRecord(record, moveFocus) {
    if (!record || record.hidden) return;

    records.forEach(function (item) {
      var selected = item === record;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.tabIndex = selected ? 0 : -1;
    });

    setText("[data-inspector-type]", value(record, "type"));
    setText("[data-inspector-subject]", value(record, "subject"));
    setText("[data-inspector-headline]", value(record, "headline"));
    setText("[data-inspector-outlet]", value(record, "outlet"));
    setText("[data-inspector-date]", value(record, "date"));
    setText("[data-inspector-summary]", value(record, "summary"));
    setText("[data-inspector-source]", value(record, "source"));
    setText("[data-inspector-link-outlet]", value(record, "outlet"));

    var byline = root.querySelector("[data-inspector-byline]");
    var bylineText = value(record, "byline");
    if (byline) {
      byline.hidden = !bylineText;
      byline.textContent = bylineText ? "By " + bylineText : "";
    }

    var link = root.querySelector("[data-inspector-link]");
    if (link) link.href = value(record, "url");
    if (moveFocus) record.focus();
  }

  function visibleRecords() {
    return records.filter(function (record) { return !record.hidden; });
  }

  function applyFilters() {
    var query = search ? search.value.trim().toLowerCase() : "";

    records.forEach(function (record) {
      var typeMatch = activeFilter === "all" || record.dataset.type === activeFilter;
      var searchMatch = !query || record.dataset.search.indexOf(query) !== -1;
      record.hidden = !(typeMatch && searchMatch);
    });

    var visible = visibleRecords();
    if (count) count.textContent = String(visible.length);
    if (empty) empty.hidden = visible.length !== 0;

    var current = records.filter(function (record) {
      return record.classList.contains("is-active") && !record.hidden;
    })[0];
    if (!current && visible.length) selectRecord(visible[0], false);
  }

  records.forEach(function (record) {
    record.addEventListener("click", function () {
      selectRecord(record, false);
    });

    record.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
      event.preventDefault();
      var visible = visibleRecords();
      var currentIndex = visible.indexOf(record);
      var nextIndex = currentIndex;
      if (event.key === "ArrowDown") nextIndex = Math.min(visible.length - 1, currentIndex + 1);
      if (event.key === "ArrowUp") nextIndex = Math.max(0, currentIndex - 1);
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = visible.length - 1;
      selectRecord(visible[nextIndex], true);
    });
  });

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      activeFilter = button.dataset.pressFilter;
      filters.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyFilters();
    });
  });

  if (search) search.addEventListener("input", applyFilters);
  if (reset) {
    reset.addEventListener("click", function () {
      activeFilter = "all";
      if (search) search.value = "";
      filters.forEach(function (button) {
        var active = button.dataset.pressFilter === "all";
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
      });
      applyFilters();
      if (search) search.focus();
    });
  }

  if (records.length) selectRecord(records[0], false);
})();
