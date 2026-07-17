---
layout: default
permalink: /press/
title: "Press"
description: "Media coverage, interviews and public recognition of Valentine Golden Ghanem."
---

<section class="section wrap wrap--centered">
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Press</p>
  <h1 class="page-title">Press &amp; recognition</h1>
  <p class="section__intro">
    Media coverage and public engagements focusing on research, expert commentary,
    and contributions to public health and epidemiology. All entries link to the
    original publication.
  </p>

  <ul class="feed-list">
    {% for a in site.data.press %}
    <li class="feed-item">
      <p class="feed-item__title">{{ a.headline }}</p>
      <span class="feed-item__meta">{{ a.outlet }} · {{ a.date }}{% if a.byline %} · {{ a.byline }}{% endif %}</span>
      <p class="feed-item__summary">{{ a.summary }}</p>
      <div class="link-row" style="margin: 12px 0 0;">
        <a href="{{ a.url }}" target="_blank" rel="noopener">Read full article</a>
      </div>
    </li>
    {% endfor %}
  </ul>

  <h2 class="section__title section__title--sub">Verified profiles</h2>
  <p class="section__intro">His identity and record are also independently verifiable via:</p>
  <div class="link-row">
    <a href="https://www.wikidata.org/wiki/Q137962236" target="_blank" rel="noopener">Wikidata</a>
    <a href="https://isni.org/isni/000000052967791X" target="_blank" rel="noopener">ISNI</a>
    <a href="https://commons.wikimedia.org/wiki/Category:Valentine_Golden_Ghanem" target="_blank" rel="noopener">Wikimedia Commons</a>
  </div>
</section>
