---
layout: default
permalink: /publications/
title: "Publications"
description: "Peer-reviewed research and publication record of Valentine Golden Ghanem, including spatial epidemiology of HIV/AIDS and health insurance coverage in Ghana."
---

<section class="publications-v2 v2-scope wrap wrap--wide" data-pubs-root>
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Publications</p>
  <h1 class="page-title">Publications</h1>
  <p class="section__intro">
    Published research, academic contributions and independent writings spanning
    public health, biomedical science, infectious disease epidemiology and
    data-driven healthcare insights.
  </p>

  {% assign pub_years = site.data.publications | map: "year" | uniq | sort | reverse %}
  <div class="filter-toolbar">
    <div class="filter-toolbar__field">
      <label for="pubs-year">Year</label>
      <select id="pubs-year">
        <option value="all">All years</option>
        {% for y in pub_years %}
        <option value="{{ y }}">{{ y }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="filter-toolbar__field">
      <label for="pubs-sort">Sort</label>
      <select id="pubs-sort">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="title">Title A–Z</option>
      </select>
    </div>
    <div class="filter-toolbar__field filter-toolbar__field--search">
      <label for="pubs-search">Search</label>
      <input type="search" id="pubs-search" placeholder="Search title, journal, topic…">
    </div>
    <button type="button" class="filter-toolbar__reset">Reset</button>
  </div>

  <h2 class="section__title section__title--sub">Peer-reviewed publications</h2>
  <p class="filter-empty">No publications match that search.</p>
  <ul class="feed-list" data-pub-list>
    {% for pub in site.data.publications %}
    <li class="feed-item v2-spotlight" data-year="{{ pub.year }}" data-title="{{ pub.title }}">
      <span class="feed-item__record-id" aria-hidden="true">PUB-{{ forloop.index | prepend: "00" | slice: -2, 2 }}</span>
      <p class="feed-item__title">{{ pub.title }}</p>
      <span class="feed-item__meta">{{ pub.journal }} · {{ pub.year }} · {{ pub.status }}</span>
      <p class="feed-item__summary">{{ pub.summary }}</p>
      <div class="link-row" style="margin: 12px 0 0;">
        <a href="{{ pub.doi_url }}" target="_blank" rel="noopener">DOI</a>
        {% for l in pub.links %}
        <a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.label }}</a>
        {% endfor %}
        <button type="button" class="copy-btn" data-citation="{{ pub.citation | escape }}">Copy citation</button>
      </div>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub">Academic positions</h2>
  <ul class="feed-list">
    {% for r in site.data.peer_review %}
    <li class="feed-item v2-spotlight">
      <p class="feed-item__title">Peer Reviewer — {{ r.journal }}</p>
      <span class="feed-item__meta">{{ r.institution }} · {{ r.status }}</span>
      <div class="link-row" style="margin: 10px 0 0;">
        <a href="{{ r.profile_url }}" target="_blank" rel="noopener">Reviewer profile</a>
        {% if r.certificate_url %}<a href="{{ r.certificate_url }}" target="_blank" rel="noopener">View certificate</a>{% endif %}
      </div>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub">Browse the full record</h2>
  <div class="link-row">
    <a href="https://scholar.google.com/citations?user=06JdyxMAAAAJ" target="_blank" rel="noopener">Google Scholar</a>
    <a href="https://orcid.org/0009-0002-8332-0220" target="_blank" rel="noopener">ORCID</a>
    <a href="https://www.webofscience.com/wos/author/record/NRA-8276-2025" target="_blank" rel="noopener">Web of Science</a>
    <a href="https://www.semanticscholar.org/author/Valentine-Golden-Ghanem/2368956236" target="_blank" rel="noopener">Semantic Scholar</a>
    <a href="https://www.researchgate.net/profile/Valentine-Ghanem" target="_blank" rel="noopener">ResearchGate</a>
    <a href="https://www.lens.org/lens/profile/692738672/scholar" target="_blank" rel="noopener">Lens.org</a>
    <a href="https://papers.ssrn.com/Sol3/Cf_Dev/AbsByAuth.cfm?per_id=10047916" target="_blank" rel="noopener">SSRN</a>
  </div>
</section>

<script src="{{ '/assets/js/publications-fx.js' | relative_url }}" defer></script>
