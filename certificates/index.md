---
layout: default
permalink: /certificates/
title: "Certificates & CPDs"
description: "Academic qualifications, licensure, professional memberships and continuing professional development of Valentine Golden Ghanem."
---

<section class="section wrap wrap--wide wrap--centered">
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Certificates</p>
  <h1 class="page-title">Certificates &amp; CPDs</h1>
  <p class="section__intro">
    Formal academic qualifications, professional certifications and continuing
    professional development (CPD), reflecting a commitment to lifelong learning,
    laboratory excellence, data science innovation and public health leadership.
  </p>

  <nav class="community-nav" aria-label="Section jump links">
    <a href="#academic-qualifications">01 Academic qualifications</a>
    <a href="#licensure">02 Licensure &amp; registration</a>
    <a href="#memberships">03 Memberships</a>
    <a href="#in-progress">04 In progress</a>
    <a href="#cpd">05 CPD log</a>
  </nav>

  <h2 class="section__title section__title--sub" id="academic-qualifications"><span class="section__index">01</span> Academic qualifications</h2>
  <ul class="tag-list">
    {% for c in site.data.profile.credentials %}
    <li class="tag {% if c.status == 'in progress' %}tag--pending{% endif %}">
      <span class="tag__name">{{ c.name }}</span>
      <span class="tag__meta">{{ c.institution }}{% if c.year %} · {{ c.year }}{% endif %}{% if c.note %} · {{ c.note }}{% endif %}{% if c.status == 'in progress' %} · in progress{% endif %}</span>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub" id="licensure"><span class="section__index">02</span> Licensure &amp; registration</h2>
  <ul class="tag-list">
    {% for l in site.data.profile.licensure %}
    <li class="tag">
      <span class="tag__name">{{ l.credential }} — {{ l.jurisdiction }}</span>
      <span class="tag__meta">{{ l.body }}{% if l.abbreviation %} ({{ l.abbreviation }}){% endif %}{% if l.reg_no %} · Reg. No. {{ l.reg_no }}{% endif %}</span>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub" id="memberships"><span class="section__index">03</span> Professional memberships</h2>
  <ul class="tag-list">
    {% for m in site.data.profile.memberships %}
    <li class="tag">
      <span class="tag__name">{{ m.name }}{% if m.role %} — {{ m.role }}{% endif %}</span>
      <span class="tag__meta">{% if m.abbreviation %}{{ m.abbreviation }}{% endif %}{% if m.reg_no %} · No. {{ m.reg_no }}{% endif %}</span>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub" id="in-progress"><span class="section__index">04</span> Certifications in progress</h2>
  <ul class="tag-list">
    {% for c in site.data.profile.certifications_in_progress %}
    <li class="tag tag--pending">
      <span class="tag__name">{{ c.name }}</span>
      <span class="tag__meta">{{ c.note }}</span>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub" id="cpd"><span class="section__index">05</span> Continuing professional development</h2>
  <div data-cpd-root>
    <div class="filter-toolbar">
      <div class="filter-toolbar__field">
        <label for="cpd-year">Year</label>
        <select id="cpd-year">
          <option value="all">All years</option>
          {% for yr in site.data.cpd %}
          <option value="{{ yr.year }}">{{ yr.year }}</option>
          {% endfor %}
        </select>
      </div>
    </div>
    {% for yr in site.data.cpd %}
    <div class="cpd-year-group" data-year="{{ yr.year }}">
      <h3 style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--ink-soft); margin: 28px 0 10px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--line); padding-bottom: 6px;">{{ yr.year }}</h3>
      <ul class="feed-list">
        {% for e in yr.entries %}
        <li class="feed-item">
          <p class="feed-item__title">{{ e.title }}</p>
          <span class="feed-item__meta">{{ e.provider }}</span>
          {% if e.topics %}<p class="feed-item__summary">{{ e.topics }}</p>{% endif %}
          {% if e.certificate_url %}<div class="link-row" style="margin: 10px 0 0;"><a href="{{ e.certificate_url }}" target="_blank" rel="noopener">View certificate</a></div>{% endif %}
        </li>
        {% endfor %}
      </ul>
    </div>
    {% endfor %}
  </div>
</section>
