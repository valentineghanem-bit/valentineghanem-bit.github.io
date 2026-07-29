---
layout: v3
permalink: /certificates/
title: "Professional Development Certificates"
browser_title: "Professional Development and CPD | Valentine Ghanem"
description: "Downloadable continuing professional development evidence for Valentine Golden Ghanem across laboratory medicine, public health and clinical practice."
extra_css: ["certificates-v2.css"]
extra_js: ["certificates-fx.js"]
jsonld: "certificates"
---
{% include nav-v3.html %}
{%- assign cpd_count = 0 -%}
{%- assign cpd_source_count = 0 -%}
{%- for year_group in site.data.cpd -%}
  {%- assign cpd_count = cpd_count | plus: year_group.entries.size -%}
  {%- for record in year_group.entries -%}
    {%- if record.certificate_url -%}
      {%- assign cpd_source_count = cpd_source_count | plus: 1 -%}
    {%- endif -%}
  {%- endfor -%}
{%- endfor -%}

<section class="certificates-v2 certificates-v3">
  <section class="certificates-hero"
           id="certificates-top"
           data-nav-marker="00"
           data-nav-label="CPD"
           data-nav-colour="#F87171"
           aria-labelledby="certificatesHeroTitle">
    <a class="certificates-hero__document"
       href="{{ '/assets/files/cpd/2021-annual-congress.pdf' | relative_url }}"
       target="_blank"
       rel="noopener"
       aria-label="Open the 2021 GAMLS Annual National Congress certificate awarded to Valentine Golden Ghanem">
      <img src="{{ '/assets/img/certificates/annual-congress-2021-certificate.webp' | relative_url }}"
           alt="Certificate of participation awarded to Valentine Golden Ghanem for the 2021 GAMLS Annual National Congress and Scientific Conference"
           width="1300"
           height="732"
           fetchpriority="high">
      <span class="certificates-hero__document-caption">
        <b>Source document</b>
        <span>GAMLS Annual National Congress / 2021 / 10 CPD credits</span>
      </span>
    </a>

    <div class="certificates-shell certificates-hero__inner">
      <div class="certificates-hero__copy">
        <p class="certificates-breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Professional development</p>
        <p class="certificates-eyebrow">Laboratory medicine / public health / professional learning</p>
        <h1 id="certificatesHeroTitle">Continuing professional <span>development.</span></h1>
        <p class="certificates-hero__summary">
          Valentine Golden Ghanem's archive records congresses, technical training
          and accredited professional learning completed from 2020 to 2025. Each
          entry identifies its provider, subject, date and available certificate.
        </p>
        <div class="certificates-hero__actions">
          <a href="#cpd-register">
            <i class="fa-solid fa-certificate" aria-hidden="true"></i>
            Browse {{ cpd_count }} records
          </a>
          <a class="certificates-action--secondary"
             href="{{ '/assets/files/cpd/2021-annual-congress.pdf' | relative_url }}"
             target="_blank"
             rel="noopener">
            <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
            Open source certificate
          </a>
        </div>
        <dl class="certificates-hero__metrics" aria-label="Professional development archive summary">
          <div><dt>{{ cpd_count }}</dt><dd>indexed CPD records</dd></div>
          <div><dt>{{ cpd_source_count }}</dt><dd>available source certificates</dd></div>
          <div><dt>{{ site.data.cpd | size }}</dt><dd>documented years</dd></div>
        </dl>
      </div>

      <nav class="certificates-year-index" aria-label="Browse CPD records by year">
        <p>Archive by year <span>{{ cpd_source_count }} source certificates</span></p>
        <div>
          <button type="button" data-cpd-year-jump="all" aria-controls="cpd-register">
            <span>All</span><b>{{ cpd_count }}</b>
          </button>
          {% for yr in site.data.cpd %}
          <button type="button" data-cpd-year-jump="{{ yr.year }}" aria-controls="cpd-register">
            <span>{{ yr.year }}</span><b>{{ yr.entries.size }}</b>
          </button>
          {% endfor %}
        </div>
      </nav>
    </div>
  </section>

  <section class="certificates-archive"
           id="cpd-register"
           data-nav-marker="01"
           data-nav-label="Archive"
           data-nav-colour="#A78BFA"
           aria-labelledby="cpdArchiveTitle">
    <div class="certificates-shell">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">01</span>
        <p class="certificates-section-kicker" id="cpd">01 - Evidence archive</p>
        <h2 id="cpdArchiveTitle">CPD records and source certificates</h2>
        <p class="certificates-section-summary">
          Search by subject, provider or year. Source certificates are distinguished
          from records whose supporting file has not yet been verified.
        </p>
      </div>

      <div class="cpd-register" data-cpd-register>
        <form class="cpd-register__controls" role="search" aria-label="Filter continuing professional development records">
          <div class="cpd-control cpd-control--search">
            <label for="cpd-search">Search archive</label>
            <div class="cpd-control__input">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
              <input id="cpd-search"
                     type="search"
                     autocomplete="off"
                     placeholder="Subject, provider or location">
            </div>
          </div>
          <div class="cpd-control">
            <label for="cpd-year">Year</label>
            <select id="cpd-year">
              <option value="all">All years</option>
              {% for yr in site.data.cpd %}<option value="{{ yr.year }}">{{ yr.year }}</option>{% endfor %}
            </select>
          </div>
          <div class="cpd-control">
            <label for="cpd-source">Evidence</label>
            <select id="cpd-source">
              <option value="all">All records</option>
              <option value="available">Source available</option>
              <option value="pending">Verification pending</option>
            </select>
          </div>
          <button class="cpd-register__reset" type="reset">
            <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
            Reset
          </button>
        </form>

        <div class="cpd-register__status">
          <p aria-live="polite" aria-atomic="true">
            <strong data-cpd-result-count>{{ cpd_count }}</strong>
            <span data-cpd-result-label>records shown</span>
          </p>
          <p>{{ cpd_source_count }} source certificates / {{ cpd_count }} indexed records</p>
        </div>

        <div class="cpd-register__workspace">
          <div class="cpd-register__index">
            <p class="cpd-register__column-label">Archive index</p>
            <ol aria-label="Continuing professional development records">
              {%- assign record_position = 0 -%}
              {% for yr in site.data.cpd %}
              <li class="cpd-year-group" data-year-group="{{ yr.year }}">
                <p class="cpd-year-group__label">{{ yr.year }} <span>{{ yr.entries.size }} records</span></p>
                <ol>
            {% for e in yr.entries %}
                {%- assign record_position = record_position | plus: 1 -%}
                {%- capture record_id -%}cpd-record-{{ yr.year }}-{{ forloop.index }}{%- endcapture -%}
                {%- capture record_search -%}{{ e.title }} {{ e.provider }} {{ e.issuing_body }} {{ e.topics }}{%- endcapture -%}
                <li data-cpd-record
                    data-year="{{ yr.year }}"
                    data-source="{% if e.certificate_url %}available{% else %}pending{% endif %}"
                    data-search="{{ record_search | strip_newlines | escape }}">
                  <button type="button"
                          data-cpd-record-trigger
                          data-cpd-target="{{ record_id }}"
                          aria-controls="{{ record_id }}"
                          aria-expanded="{% if record_position == 1 %}true{% else %}false{% endif %}">
                    <span class="cpd-record__sequence">{{ record_position | prepend: '0' | slice: -2, 2 }}</span>
                    <span class="cpd-record__summary">
                      <span class="cpd-record__meta">
                        <b>{{ yr.year }}</b>
                        <span>{{ e.delivery_mode }}</span>
                      </span>
                      <strong>{{ e.title }}</strong>
                      <span>{{ e.issuing_body }}</span>
                    </span>
                    <span class="cpd-record__source cpd-record__source--{% if e.certificate_url %}available{% else %}pending{% endif %}">
                      <i class="fa-solid {% if e.certificate_url %}fa-file-circle-check{% else %}fa-clock{% endif %}" aria-hidden="true"></i>
                      <span>{% if e.certificate_url %}Source{% else %}Pending{% endif %}</span>
                    </span>
                  </button>
                </li>
            {% endfor %}
                </ol>
              </li>
              {% endfor %}
            </ol>
          </div>

          <div class="cpd-register__inspector">
            <p class="cpd-register__column-label">Record inspector</p>
            {%- assign detail_position = 0 -%}
            {% for yr in site.data.cpd %}
              {% for e in yr.entries %}
                {%- assign detail_position = detail_position | plus: 1 -%}
                {%- capture detail_id -%}cpd-record-{{ yr.year }}-{{ forloop.index }}{%- endcapture -%}
                <article id="{{ detail_id }}"
                         data-cpd-detail
                         tabindex="-1"
                         {% unless detail_position == 1 %}hidden{% endunless %}>
                  <header class="cpd-detail__header">
                    <p>{{ yr.year }} / {{ e.delivery_mode }}</p>
                    <span class="cpd-detail__status cpd-detail__status--{% if e.certificate_url %}available{% else %}pending{% endif %}">
                      {% if e.certificate_url %}Source verified{% else %}Verification pending{% endif %}
                    </span>
                    <h3>{{ e.title }}</h3>
                  </header>

                  <dl class="cpd-detail__facts">
                    <div>
                      <dt>Issuing body</dt>
                      <dd>{{ e.issuing_body }}</dd>
                    </div>
                    <div>
                      <dt>Record detail</dt>
                      <dd>{{ e.provider }}</dd>
                    </div>
                  </dl>

                  {% if e.topics %}
                  <div class="cpd-detail__topics">
                    <p>Documented subject matter</p>
                    <p>{{ e.topics }}</p>
                  </div>
                  {% endif %}

                  <div class="cpd-detail__action">
                    {% if e.certificate_url %}
                    <a href="{{ e.certificate_url | relative_url }}" target="_blank" rel="noopener">
                      <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
                      Open certificate
                      <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                    </a>
                    <p>Opens the archived source document in a new tab.</p>
                    {% else %}
                    <p class="cpd-source-status">
                      <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
                      {{ e.source_status }}
                    </p>
                    <p>No source document is published for this record.</p>
                    {% endif %}
                  </div>
                </article>
              {% endfor %}
            {% endfor %}

            <div class="cpd-register__empty" data-cpd-empty hidden>
              <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
              <h3>No matching records</h3>
              <p>Change the search term or reset the archive filters.</p>
            </div>
          </div>
        </div>

        <aside class="cpd-register__provenance" aria-label="Archive provenance">
          <i class="fa-solid fa-shield-halved" aria-hidden="true"></i>
          <div>
            <strong>Archive provenance</strong>
            <p>
              Fifteen records link to locally preserved certificate files. The 2025
              entry remains indexed, but its source file is withheld until it can be
              matched to the correct certificate.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</section>

{% include footer-v3.html %}
