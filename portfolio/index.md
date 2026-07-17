---
layout: default
permalink: /portfolio/
title: "Portfolio"
description: "Applied academic and professional projects by Valentine Golden Ghanem in biomedical research, public health data analytics, dashboard development and machine learning."
---

<section class="section wrap wrap--wide" data-portfolio-root>
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Portfolio</p>
  <h1 class="page-title">Portfolio</h1>
  <p class="section__intro">
    A curated selection of major academic and professional projects at the
    intersection of laboratory science, data science and public health innovation.
  </p>

  <div class="filter-chips">
    <button type="button" class="filter-chip is-active" data-filter="all">All projects</button>
    <button type="button" class="filter-chip" data-filter="capstone">Capstone</button>
    <button type="button" class="filter-chip" data-filter="dataviz">Data visualisations</button>
    <button type="button" class="filter-chip" data-filter="research">Research</button>
  </div>

  <div data-portfolio-section="capstone">
  <h2 class="section__title section__title--sub">Capstone projects</h2>
  <div class="card-grid">
    {% for p in site.data.portfolio.capstone_projects %}
    <div class="card">
      <h3 class="card__title">{{ p.title }}</h3>
      <p class="card__body">{{ p.context }}</p>
      <p class="card__body" style="margin-top: 8px;">{{ p.summary }}</p>
      <div class="link-row" style="margin: 12px 0 0;">
        {% for l in p.links %}<a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.label }}</a>{% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>
  </div>

  <div data-portfolio-section="dataviz">
  <h2 class="section__title section__title--sub">Data visualisations</h2>
  <div class="card-grid">
    {% for p in site.data.portfolio.data_visualisations %}
    <div class="card">
      <h3 class="card__title">{{ p.title }}</h3>
      <p class="card__body">{{ p.summary }}</p>
      <div class="link-row" style="margin: 12px 0 0;">
        {% if p.doi_url %}<a href="{{ p.doi_url }}" target="_blank" rel="noopener">DOI</a>{% endif %}
        {% for l in p.links %}<a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.label }}</a>{% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>
  </div>

  <div data-portfolio-section="research">
  <h2 class="section__title section__title--sub">Research projects</h2>
  <div class="card-grid">
    {% for p in site.data.portfolio.research_projects %}
    <div class="card">
      <h3 class="card__title">{{ p.title }}</h3>
      <p class="card__body">{{ p.context }}</p>
      <p class="card__body" style="margin-top: 8px;">{{ p.summary }}</p>
      <div class="link-row" style="margin: 12px 0 0;">
        {% for l in p.links %}<a href="{{ l.url }}" target="_blank" rel="noopener">{{ l.label }}</a>{% endfor %}
      </div>
    </div>
    {% endfor %}
  </div>
  </div>
</section>
