---
layout: v3
permalink: /about/
jsonld: about
title: "About"
description: "Biography, biodata and professional profile of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
extra_css: ["about-v2.css"]
extra_js: ["canvas-field.js", "about-fx.js"]
---
{% include nav-v3.html %}
{%- assign rep_img = site.data.images | where: "representative", true | first -%}
<div class="about-v2 v2-scope pt-32">

<section class="about-v2__hero">
  <div class="canvas-field" data-canvas-field data-palette="v2" data-intensity="0.5" aria-hidden="true"></div>
  <div class="about-v2__hero-inner">
    <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / About</p>
    <h1 class="about-v2__page-title">About {{ site.data.profile.name }}</h1>
    <p class="about-v2__quote">{{ site.data.profile.disambiguating_description }}</p>

    <div class="about-v2__layout">
      <div class="about-v2__body">
        <p>{{ site.data.profile.description }}</p>
      </div>
      <figure class="about-v2__portrait" data-parallax="0.08">
        <div class="about-v2__portrait-badge">Dual-licensed &middot; Ghana &amp; Ireland</div>
        <img src="{{ rep_img.content_url }}" alt="{{ rep_img.name }}" width="{{ rep_img.width }}" height="{{ rep_img.height }}" loading="lazy" onerror="this.closest('figure').style.display='none'">
        <figcaption>{{ rep_img.caption }}</figcaption>
      </figure>
    </div>
  </div>
</section>

<section class="about-v2__section">
  <span class="section__ghost-num" aria-hidden="true">01</span>
  <h2 class="about-v2__title"><span class="about-v2__index">01</span> Biodata &amp; languages</h2>
  <div class="about-v2__specimens">
    <div class="about-v2__specimen">
      <div class="about-v2__specimen-scan" aria-hidden="true"></div>
      <p class="about-v2__specimen-title">Personal biodata</p>
      <div class="about-v2__field"><span class="about-v2__field-label">Date of birth</span><span class="about-v2__field-value">25 April 1987</span></div>
      <div class="about-v2__field"><span class="about-v2__field-label">Place of birth</span><span class="about-v2__field-value">{{ site.data.profile.birth_place }}</span></div>
      <div class="about-v2__field"><span class="about-v2__field-label">Nationality</span><span class="about-v2__field-value">{{ site.data.profile.nationality }}</span></div>
      <div class="about-v2__field"><span class="about-v2__field-label">Religion</span><span class="about-v2__field-value">{{ site.data.profile.religion }}</span></div>
    </div>
    <div class="about-v2__specimen">
      <div class="about-v2__specimen-scan" aria-hidden="true"></div>
      <p class="about-v2__specimen-title">Languages</p>
      {% for lang in site.data.profile.languages %}
      <div class="about-v2__field"><span class="about-v2__field-value">{{ lang.name }}</span></div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="about-v2__section">
  <span class="section__ghost-num" aria-hidden="true">02</span>
  <h2 class="about-v2__title"><span class="about-v2__index">02</span> Purpose, vision &amp; objectives</h2>
  <div class="about-v2__manifesto">
    <div class="about-v2__manifesto-rail"><div class="about-v2__manifesto-rail-fill"></div></div>
    <p class="about-v2__manifesto-text">{{ site.data.profile.statement_of_purpose }}</p>
  </div>
  <div class="about-v2__cards">
    <div class="about-v2__card">
      <h3 class="about-v2__card-title">Career vision</h3>
      <p class="about-v2__card-body">{{ site.data.profile.career_vision }}</p>
    </div>
    <div class="about-v2__card">
      <h3 class="about-v2__card-title">Aim &amp; objectives</h3>
      <p class="about-v2__card-body">{{ site.data.profile.aim }}</p>
      <ul>
        {% for o in site.data.profile.objectives %}
        <li>{{ o }}</li>
        {% endfor %}
      </ul>
    </div>
  </div>
</section>

<section class="about-v2__section">
  <span class="section__ghost-num" aria-hidden="true">03</span>
  <h2 class="about-v2__title"><span class="about-v2__index">03</span> Areas of expertise</h2>
  <div class="about-v2__pills">
    {% for topic in site.data.profile.knows_about %}
    <span class="about-v2__pill">{{ topic }}</span>
    {% endfor %}
  </div>
</section>

<section class="about-v2__section">
  <span class="section__ghost-num" aria-hidden="true">04</span>
  <h2 class="about-v2__title"><span class="about-v2__index">04</span> Identifiers</h2>
  <div class="about-v2__ident-list">
    {% for ident in site.data.profile.identifiers %}
    <div class="about-v2__ident">
      <span class="about-v2__ident-label">{{ ident.property_id }}</span>
      <a class="about-v2__ident-value" href="{{ ident.url }}" target="_blank" rel="noopener">{{ ident.value }}<span class="about-v2__ident-cursor" aria-hidden="true"></span></a>
    </div>
    {% endfor %}
  </div>
</section>

<section class="about-v2__section">
  <div class="canvas-field" data-canvas-field data-palette="v2" data-intensity="0.35" aria-hidden="true" style="position:absolute; inset:0; z-index:0;"></div>
  <div style="position:relative; z-index:1;">
    <span class="section__ghost-num" aria-hidden="true">05</span>
  <h2 class="about-v2__title"><span class="about-v2__index">05</span> Credentials</h2>
    <ul class="about-v2__creds">
      {% for c in site.data.profile.credentials %}
      <li class="about-v2__cred {% if c.status == 'in progress' %}about-v2__cred--pending{% endif %}">
        <span class="about-v2__cred-name">{{ c.name }}</span><br>
        <span class="about-v2__cred-meta">{{ c.institution }}{% if c.year %} &middot; {{ c.year }}{% endif %}{% if c.note %} &middot; {{ c.note }}{% endif %}{% if c.status == 'in progress' %} &middot; in progress{% endif %}</span>
      </li>
      {% endfor %}
    </ul>
  </div>
</section>

<section class="about-v2__section">
  <span class="section__ghost-num" aria-hidden="true">06</span>
  <div class="about-v2__title-row">
    <h2 class="about-v2__title"><span class="about-v2__index">06</span> Academic &amp; professional timeline</h2>
  </div>
  <p class="about-v2__timeline-hint">{{ site.data.timeline | size }} entries, reverse-chronological &mdash; tap any record for the full detail.</p>
  <div class="about-v2__record-grid" data-record-grid>
    {% for t in site.data.timeline %}
    <button type="button" class="about-v2__record-card v2-bento-tint"
      data-record-icon="{{ t.icon | escape }}"
      data-record-dates="{{ t.dates | escape }}"
      data-record-title="{{ t.title | escape }}"
      data-record-desc="{{ t.description | escape }}">
      <span class="about-v2__record-card-icon" aria-hidden="true">{{ t.icon }}</span>
      <span class="about-v2__record-card-dates">{{ t.dates }}</span>
      <span class="about-v2__record-card-title">{{ t.title }}</span>
      {% if t.description %}<span class="about-v2__record-card-flag" aria-hidden="true">+</span>{% endif %}
    </button>
    {% endfor %}
  </div>
</section>

</div>

{% include footer-v3.html %}
