---
layout: v3
permalink: /press/
title: "Press"
browser_title: "Press and Media | Valentine Ghanem"
description: "Publisher-verified media coverage of Valentine Golden Ghanem's research, public-health work and professional practice."
jsonld: press
extra_css: ["press-v2.css"]
extra_js: ["press-fx.js"]
---
{% include nav-v3.html %}
{%- assign press_outlets = site.data.press | map: "outlet" | uniq -%}
{%- assign press_types = site.data.press | map: "type_key" | uniq -%}

<main class="press-v2" data-press-root>
  <section class="press-hero" data-nav-marker="00" data-nav-label="Press" data-nav-colour="#FBBF24" aria-labelledby="press-title">
    <img
      class="press-hero__image"
      src="{{ '/assets/img/gallery/portraits/studio-tuxedo-portrait.jpg' | relative_url }}"
      alt="Valentine Golden Ghanem at an event venue"
      width="1086"
      height="1448"
      fetchpriority="high">
    <div class="press-hero__veil" aria-hidden="true"></div>
    <div class="press-shell press-hero__content">
      <p class="press-breadcrumb"><a href="{{ '/' | relative_url }}">Home</a><span aria-hidden="true">/</span>Press</p>
      <p class="press-hero__eyebrow">Research coverage / professional profiles / commentary</p>
      <h1 id="press-title">Research and practice in the <span>public record.</span></h1>
      <p class="press-hero__lede">
        This archive contains reporting and commentary on Valentine Golden Ghanem's research, clinical practice and public health work. Each entry links to the publisher's website.
      </p>
      <div class="press-hero__actions">
        <a class="press-button press-button--primary" href="#coverage-register">
          <i class="fa-solid fa-newspaper" aria-hidden="true"></i>
          Browse coverage
        </a>
        <a class="press-button press-button--secondary" href="{{ '/publications/' | relative_url }}">
          <i class="fa-solid fa-book-open" aria-hidden="true"></i>
          View publications
        </a>
      </div>
      <dl class="press-hero__metrics" aria-label="Press archive summary">
        <div><dt>{{ site.data.press.size }}</dt><dd>published features</dd></div>
        <div><dt>{{ press_outlets.size }}</dt><dd>media outlets</dd></div>
        <div><dt>{{ press_types.size }}</dt><dd>record categories</dd></div>
      </dl>
    </div>
    <div class="press-hero__source">
      <span>Public profile</span>
      <strong>Valentine Golden Ghanem</strong>
      <small>Event venue</small>
    </div>
    <div class="press-hero__outlets" aria-label="Publishers represented in the archive">
      <span class="press-hero__outlets-label">Publisher register</span>
      {% for outlet in press_outlets %}
      <span class="press-hero__outlet">{{ outlet }}</span>
      {% endfor %}
    </div>
  </section>

  <section id="coverage-register" class="press-register" data-nav-marker="01" data-nav-label="Archive" data-nav-colour="#34D399" aria-labelledby="coverage-title">
    <div class="press-shell">
      <header class="press-section-heading">
        <span class="press-section-heading__number" aria-hidden="true">01</span>
        <div>
          <p class="press-section-heading__kicker">Media archive</p>
          <h2 id="coverage-title">Coverage, commentary and profiles</h2>
          <p>Browse seven articles by coverage type.</p>
        </div>
      </header>

      <div class="press-controls" aria-label="Filter media records">
        <div class="press-filter-group" aria-label="Coverage type">
          <button type="button" class="is-active" data-press-filter="all" aria-pressed="true">All records</button>
          <button type="button" data-press-filter="research" aria-pressed="false">Research</button>
          <button type="button" data-press-filter="profile" aria-pressed="false">Profiles</button>
          <button type="button" data-press-filter="commentary" aria-pressed="false">Commentary</button>
        </div>
        <p class="press-result-count" role="status" aria-live="polite"><strong data-press-count>{{ site.data.press.size }}</strong> records</p>
      </div>

      <div class="press-workspace">
        <div class="press-ledger" aria-label="Media records">
          <div class="press-ledger__header" aria-hidden="true">
            <span>Record</span><span>Publisher / date</span>
          </div>
          <div class="press-records" role="listbox" aria-label="Select a media record">
            {% for article in site.data.press %}
            <button
              type="button"
              class="press-record{% if forloop.first %} is-active{% endif %}"
              role="option"
              aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
              tabindex="{% if forloop.first %}0{% else %}-1{% endif %}"
              data-press-record
              data-id="{{ article.id }}"
              data-type="{{ article.type_key }}"
              data-search="{{ article.headline | append: ' ' | append: article.outlet | append: ' ' | append: article.subject | downcase | escape }}">
              <span class="press-record__index">{{ forloop.index | prepend: "0" | slice: -2, 2 }}</span>
              <span class="press-record__copy">
                <span class="press-record__type">{{ article.type }}</span>
                <strong>{{ article.headline }}</strong>
                <span class="press-record__meta">{{ article.outlet }} <b aria-hidden="true">•</b> {{ article.date }}</span>
              </span>
              <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              <span class="press-record__data" hidden>
                <span data-value="headline">{{ article.headline }}</span>
                <span data-value="outlet">{{ article.outlet }}</span>
                <span data-value="date">{{ article.date }}</span>
                <span data-value="type">{{ article.type }}</span>
                <span data-value="subject">{{ article.subject }}</span>
                <span data-value="summary">{{ article.summary }}</span>
                <span data-value="source">{{ article.source_note }}</span>
                <span data-value="byline">{{ article.byline }}</span>
                <span data-value="url">{{ article.url }}</span>
              </span>
            </button>
            {% endfor %}
          </div>
          <div class="press-empty" data-press-empty hidden>
            <i class="fa-regular fa-newspaper" aria-hidden="true"></i>
            <strong>No matching records</strong>
            <p>Adjust the search or return to the complete archive.</p>
            <button type="button" data-press-reset>Reset archive</button>
          </div>
        </div>

        {% assign lead = site.data.press.first %}
        <article class="press-inspector" aria-live="polite" aria-labelledby="press-inspector-title">
          <div class="press-inspector__masthead">
            <p>Selected source</p>
            <span data-inspector-type>{{ lead.type }}</span>
          </div>
          <div class="press-inspector__body">
            <p class="press-inspector__subject" data-inspector-subject>{{ lead.subject }}</p>
            <h3 id="press-inspector-title" data-inspector-headline>{{ lead.headline }}</h3>
            <div class="press-inspector__source-line">
              <strong data-inspector-outlet>{{ lead.outlet }}</strong>
              <span data-inspector-date>{{ lead.date }}</span>
              <span data-inspector-byline{% unless lead.byline %} hidden{% endunless %}>{% if lead.byline %}By {{ lead.byline }}{% endif %}</span>
            </div>
            <p class="press-inspector__summary" data-inspector-summary>{{ lead.summary }}</p>
            <div class="press-inspector__context">
              <span><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Source context</span>
              <p data-inspector-source>{{ lead.source_note }}</p>
            </div>
          </div>
          <div class="press-inspector__footer">
            <p>Publisher pages open in a new tab.</p>
            <a href="{{ lead.url }}" target="_blank" rel="noopener noreferrer" data-inspector-link>
              Read at <span data-inspector-link-outlet>{{ lead.outlet }}</span>
              <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</main>

{% include footer-v3.html %}
