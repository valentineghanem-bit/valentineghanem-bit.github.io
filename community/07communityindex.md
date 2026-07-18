---
layout: default
permalink: /community/
title: "Community"
description: "Community outreach, medical screening programs and public engagement by Valentine Golden Ghanem in Ghana."
---

<section class="section wrap wrap--wide">
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Community</p>
  <h1 class="page-title">Community &amp; outreach</h1>
  <p class="section__intro">
    Medical screening, conferences and public engagement beyond the laboratory
    bench.
  </p>

  <div class="community-layout">
    <aside class="community-sidebar">
      <p class="pull-quote">"Screening services delivered to over 5,000 individuals in underserved populations."</p>
      <nav class="community-nav" aria-label="Section jump links">
        <a href="#medical-screening">01 Medical screening</a>
        <a href="#conferences">02 Conferences &amp; seminars</a>
        <a href="#outreach">03 Community outreach</a>
      </nav>
    </aside>

    <div class="community-main">
      {%- assign geo_i = 0 -%}
      <h2 class="section__title section__title--sub" id="medical-screening"><span class="section__index">01</span> Medical screening</h2>
      <div class="event-grid">
        {% for e in site.data.community_activities.medical_screening %}
        <article class="event-card" id="community-event-{{ geo_i }}">
        {%- assign geo_i = geo_i | plus: 1 -%}
          <div class="event-card__head">
            <p class="feed-item__title">🩺 {{ e.title }}</p>
          </div>
          <span class="feed-item__meta">{{ e.provider }} · {{ e.date }} · {{ e.location }}</span>
          <p class="feed-item__summary">{{ e.description }}</p>
          {% if e.photos %}
          <div class="event-media">
            {% for p in e.photos limit:6 %}
            <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy"></figure>
            {% endfor %}
            {% if e.photos.size > 6 %}
            <details class="event-media__more">
              <summary>+{{ e.photos.size | minus: 6 }} more photos</summary>
              <div class="event-media">
                {% for p in e.photos offset:6 %}
                <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy"></figure>
                {% endfor %}
              </div>
            </details>
            {% endif %}
          </div>
          {% endif %}
          {% if e.video %}
          <div class="event-media__video"><video src="{{ e.video | relative_url }}" controls preload="metadata"></video></div>
          {% endif %}
        </article>
        {% endfor %}
      </div>

      <h2 class="section__title section__title--sub" id="conferences"><span class="section__index">02</span> Conferences &amp; seminars</h2>
      <div class="event-grid">
        {% for e in site.data.community_activities.conferences %}
        <article class="event-card" id="community-event-{{ geo_i }}">
        {%- assign geo_i = geo_i | plus: 1 -%}
          <div class="event-card__head">
            <p class="feed-item__title">🧬 {{ e.title }}</p>
          </div>
          <span class="feed-item__meta">{{ e.provider }} · {{ e.date }}</span>
          <p class="feed-item__summary">{{ e.description }}</p>
          {% if e.photos %}
          <div class="event-media">
            {% for p in e.photos limit:6 %}
            <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy"></figure>
            {% endfor %}
            {% if e.photos.size > 6 %}
            <details class="event-media__more">
              <summary>+{{ e.photos.size | minus: 6 }} more photos</summary>
              <div class="event-media">
                {% for p in e.photos offset:6 %}
                <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy"></figure>
                {% endfor %}
              </div>
            </details>
            {% endif %}
          </div>
          {% endif %}
        </article>
        {% endfor %}
      </div>

      <h2 class="section__title section__title--sub" id="outreach"><span class="section__index">03</span> Community outreach</h2>
      <div class="event-grid">
        {% for e in site.data.community_activities.outreach %}
        <article class="event-card" id="community-event-{{ geo_i }}">
        {%- assign geo_i = geo_i | plus: 1 -%}
          <div class="event-card__head">
            <p class="feed-item__title">⚕️ {{ e.title }}</p>
          </div>
          <span class="feed-item__meta">{{ e.provider }} · {{ e.date }}</span>
          <p class="feed-item__summary">{{ e.description }}</p>
          {% if e.photos %}
          <div class="event-media">
            {% for p in e.photos limit:6 %}
            <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy"></figure>
            {% endfor %}
            {% if e.photos.size > 6 %}
            <details class="event-media__more">
              <summary>+{{ e.photos.size | minus: 6 }} more photos</summary>
              <div class="event-media">
                {% for p in e.photos offset:6 %}
                <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy"></figure>
                {% endfor %}
              </div>
            </details>
            {% endif %}
          </div>
          {% endif %}
        </article>
        {% endfor %}
      </div>

    </div>
  </div>
</section>
