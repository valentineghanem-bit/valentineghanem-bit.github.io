---
layout: default
permalink: /skills/
title: "Skills"
description: "Technical, analytical and leadership skills of Valentine Golden Ghanem across public health, data science and biomedical science."
---

<section class="skills-v2 v2-scope wrap wrap--wide" data-skills-root>
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Skills</p>
  <h1 class="page-title">Skills &amp; toolkit</h1>
  <p class="section__intro">
    A working toolkit built across the laboratory bench, the field, and the
    analysis pipeline. Filter by category, by domain, or search directly for a
    tool, method or platform.
  </p>

  <!-- Interconnected-domains network: a kinetic at-a-glance visual for the
       real 15 domains this site's own JSON-LD already declares
       (site.data.profile.knows_about), reusing the cursor-repulsion
       physics technique built for the Home hero's helix (ported from the
       "Woven Light" reference) -- applied here to plain labelled nodes
       instead of photos, a distinct visual from both the hero and the
       skills-matrix heatmap below. Hidden on narrow screens: 15 labels
       have no room to stay legible there, and the matrix/cards below
       already carry the same information. -->
  <div class="skills-v2__network" data-skills-network aria-hidden="true">
    <canvas class="skills-v2__network-canvas"></canvas>
  </div>
  <script type="application/json" id="skills-network-data">{{ site.data.profile.knows_about | jsonify }}</script>

  <div class="filter-toolbar">
    <div class="filter-toolbar__field">
      <label for="skills-category">Category</label>
      <select id="skills-category">
        <option value="all">All categories</option>
        {% for section in site.data.skills %}
        <option value="{{ section.category }}">{{ section.category }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="filter-toolbar__field">
      <label for="skills-domain">Domain</label>
      <select id="skills-domain">
        <option value="all">All domains</option>
        {% for g in site.data.skills[0].groups %}
        <option value="{{ g.name }}">{{ g.icon }} {{ g.name }}</option>
        {% endfor %}
      </select>
    </div>
    <div class="filter-toolbar__field filter-toolbar__field--search">
      <label for="skills-search">Search</label>
      <input type="search" id="skills-search" placeholder="e.g. Python, GeneXpert, SOP…">
    </div>
    <button type="button" class="filter-toolbar__reset">Reset</button>
  </div>

  <table class="skills-matrix">
    <caption>Toolkit at a glance — item count by domain and category</caption>
    <thead>
      <tr>
        <th scope="col"></th>
        {% for section in site.data.skills %}
        <th scope="col">{{ section.category }}</th>
        {% endfor %}
      </tr>
    </thead>
    <tbody>
      {% for g in site.data.skills[0].groups %}
      <tr>
        <th scope="row">{{ g.icon }} {{ g.name }}</th>
        {% for section in site.data.skills %}
        {% assign match = section.groups | where: "name", g.name | first %}
        {% assign n = match.items.size %}
        {% assign heat = "var(--v2-ink-soft)" %}
        {% if n >= 5 %}{% assign heat = "var(--v2-gold)" %}{% elsif n >= 2 %}{% assign heat = "var(--v2-blue)" %}{% endif %}
        <td><button type="button" class="skills-matrix__cell" style="--v2-heat: {{ heat }};" data-category="{{ section.category }}" data-domain="{{ g.name }}">{{ n }}</button></td>
        {% endfor %}
      </tr>
      {% endfor %}
    </tbody>
  </table>

  <p class="filter-empty">No skills match that combination — try Reset.</p>

  {% for section in site.data.skills %}
  <div class="skills-section" data-category="{{ section.category }}">
    <h2 class="section__title section__title--sub"><span class="section__index">0{{ forloop.index }}</span> {{ section.category }}</h2>
    <div class="card-grid">
      {% for g in section.groups %}
      <div class="card v2-scan-card v2-bento-tint" data-domain="{{ g.name }}">
        <div class="v2-scan-sweep" aria-hidden="true"></div>
        <h3 class="card__title">{{ g.icon }} {{ g.name }}</h3>
        <ul class="card__list">
          {% for item in g.items %}
          <li>{{ item }}</li>
          {% endfor %}
        </ul>
      </div>
      {% endfor %}
    </div>
  </div>
  {% endfor %}

  <h2 class="section__title section__title--sub" id="resume"><span class="section__index">04</span> Résumé</h2>
  <details class="resume-embed">
    <summary>View embedded résumé (PDF)</summary>
    <iframe src="{{ '/assets/files/valentine-golden-ghanem-resume.pdf' | relative_url }}" title="Valentine Golden Ghanem — Résumé" loading="lazy"></iframe>
  </details>
  <p><a href="{{ '/assets/files/valentine-golden-ghanem-resume.pdf' | relative_url }}" target="_blank" rel="noopener">Open résumé in a new tab ↗</a></p>
</section>

<script src="{{ '/assets/js/skills-fx.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/skills-network.js' | relative_url }}" defer></script>
