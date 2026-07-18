---
layout: default
permalink: /about/
jsonld: about
title: "About"
description: "Biography, biodata and professional profile of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
---

{%- assign rep_img = site.data.images | where: "representative", true | first -%}
<section class="section section--field wrap" data-reveal>
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / About</p>
  <div class="canvas-field" data-canvas-field data-intensity="0.5" aria-hidden="true"></div>
  <h1 class="page-title">About {{ site.data.profile.name }}</h1>
  <p class="pull-quote">{{ site.data.profile.disambiguating_description }}</p>

  <div class="about-layout">
    <div class="about-layout__body">
      <p>{{ site.data.profile.description }}</p>
    </div>
    <figure class="about-portrait" data-parallax="0.08">
      <img src="{{ rep_img.content_url }}" alt="{{ rep_img.name }}" width="{{ rep_img.width }}" height="{{ rep_img.height }}" loading="lazy" onerror="this.closest('figure').style.display='none'">
      <figcaption>{{ rep_img.caption }}</figcaption>
    </figure>
  </div>
</section>

<section class="section wrap" data-reveal>
  <h2 class="section__title"><span class="section__index">01</span> Biodata &amp; languages</h2>
  <div class="card-grid">
    <div class="card">
      <h3 class="card__title">Personal biodata</h3>
      <ul class="specimen-list">
        <li class="specimen"><span class="specimen__label">Date of birth</span><span>25 April 1987</span></li>
        <li class="specimen"><span class="specimen__label">Place of birth</span><span>{{ site.data.profile.birth_place }}</span></li>
        <li class="specimen"><span class="specimen__label">Nationality</span><span>{{ site.data.profile.nationality }}</span></li>
        <li class="specimen"><span class="specimen__label">Religion</span><span>{{ site.data.profile.religion }}</span></li>
      </ul>
    </div>
    <div class="card">
      <h3 class="card__title">Languages</h3>
      <ul class="card__list">
        {% for lang in site.data.profile.languages %}
        <li>{{ lang.name }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</section>

<section class="section wrap" data-reveal>
  <h2 class="section__title"><span class="section__index">02</span> Purpose, vision &amp; objectives</h2>
  <p class="pull-quote">{{ site.data.profile.statement_of_purpose }}</p>
  <div class="card-grid">
    <div class="card">
      <h3 class="card__title">Career vision</h3>
      <p class="card__body">{{ site.data.profile.career_vision }}</p>
    </div>
    <div class="card">
      <h3 class="card__title">Aim &amp; objectives</h3>
      <p class="card__body">{{ site.data.profile.aim }}</p>
      <ul class="card__list">
        {% for o in site.data.profile.objectives %}
        <li>{{ o }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</section>

<section class="section wrap" data-reveal>
  <h2 class="section__title"><span class="section__index">03</span> Areas of expertise</h2>
  <ul class="tag-list tag-list--pill">
    {% for topic in site.data.profile.knows_about %}
    <li class="pill">{{ topic }}</li>
    {% endfor %}
  </ul>
</section>

<section class="section wrap" data-reveal>
  <h2 class="section__title"><span class="section__index">04</span> Identifiers</h2>
  <ul class="specimen-list specimen-list--grid">
    {% for ident in site.data.profile.identifiers %}
    <li class="specimen">
      <span class="specimen__label">{{ ident.property_id }}</span>
      <a class="specimen__value" href="{{ ident.url }}" target="_blank" rel="noopener">{{ ident.value }}</a>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="section section--inverted wrap" data-reveal>
  <div class="canvas-field" data-canvas-field data-intensity="0.4" aria-hidden="true"></div>
  <h2 class="section__title"><span class="section__index">05</span> Credentials</h2>
  <ul class="tag-list">
    {% for c in site.data.profile.credentials %}
    <li class="tag {% if c.status == 'in progress' %}tag--pending{% endif %}">
      <span class="tag__name">{{ c.name }}</span>
      <span class="tag__meta">{{ c.institution }}{% if c.year %} · {{ c.year }}{% endif %}{% if c.note %} · {{ c.note }}{% endif %}{% if c.status == 'in progress' %} · in progress{% endif %}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="section wrap" data-reveal>
  <h2 class="section__title"><span class="section__index">06</span> Academic &amp; professional timeline</h2>
  <ul class="timeline">
    {% for t in site.data.timeline %}
    <li class="timeline-item">
      <span class="timeline-item__dates">{{ t.dates }}</span>
      <span class="timeline-item__title">{{ t.icon }} {{ t.title }}</span>
      {% if t.description %}<p class="timeline-item__desc">{{ t.description }}</p>{% endif %}
    </li>
    {% endfor %}
  </ul>
</section>
