---
layout: v3
permalink: /community/
title: "Community"
browser_title: "Community Health Practice | Valentine Ghanem"
description: "A documented record of community screening, professional learning and public-health engagement by Valentine Golden Ghanem across Ghana."
jsonld: community
extra_css: ["community-v2.css"]
extra_js: ["community-fx.js"]
---
{% include nav-v3.html %}

<main class="community-v2 v3-page-canvas v3-page-canvas--community">
  <section class="community-hero"
           id="community-top"
           data-nav-marker="00"
           data-nav-label="Community"
           data-nav-colour="#34D399"
           aria-labelledby="community-title">
    <div class="community-shell community-hero__layout">
      <div class="community-hero__copy">
        <p class="community-breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Community</p>
        <p class="community-eyebrow">Field practice / Ghana / 2016-2024</p>
        <h1 id="community-title">Public health, <span>practised with communities.</span></h1>
        <p class="community-hero__summary">
          Valentine Golden Ghanem's community record documents field screening,
          diagnostic education and professional learning undertaken across Ghana.
          Each entry is linked to a date, location and original photograph or video.
        </p>
        <div class="community-hero__actions">
          <a class="community-action community-action--primary" href="#community-evidence">
            <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
            Explore field record
          </a>
          <a class="community-action community-action--secondary" href="{{ '/map/' | relative_url }}">
            <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
            Open health atlas
          </a>
        </div>
        <dl class="community-hero__metrics" aria-label="Community record summary">
          <div><dt>7</dt><dd>documented activities</dd></div>
          <div><dt>40</dt><dd>field photographs</dd></div>
          <div><dt>2</dt><dd>video records</dd></div>
        </dl>
      </div>

      <div class="community-hero__media" aria-label="Selected field photographs">
        <figure class="community-hero__photo community-hero__photo--primary">
          <img src="{{ '/assets/img/community/kofikrom-2023/screening-exercise.jpg' | relative_url }}"
               alt="Community medical screening at Kofikrom documented in the field record of Valentine Golden Ghanem"
               fetchpriority="high">
          <figcaption><span>Kofikrom</span><strong>Field screening / 2023</strong></figcaption>
        </figure>
        <figure class="community-hero__photo community-hero__photo--secondary">
          <img src="{{ '/assets/img/community/agona-swedru-2024/group-pic.jpg' | relative_url }}"
               alt="Valentine Golden Ghanem with the Cocoa Clinic screening team at Agona Swedru"
               loading="eager">
          <figcaption><span>Agona Swedru</span><strong>Screening team / 2024</strong></figcaption>
        </figure>
        <figure class="community-hero__photo community-hero__photo--tertiary">
          <img src="{{ '/assets/img/community/gamls-congress-2021/group-picture.jpg' | relative_url }}"
               alt="Valentine Golden Ghanem with delegates at the GAMLS scientific conference in Bolgatanga"
               loading="eager">
          <figcaption><span>Bolgatanga</span><strong>Scientific congress / 2021</strong></figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section class="community-index"
           id="community-evidence"
           aria-labelledby="community-index-title">
    <div class="community-shell community-index__layout">
      <div>
        <p class="community-eyebrow">Evidence index</p>
        <h2 id="community-index-title">Browse the documented record</h2>
      </div>
      <div class="community-filter" role="group" aria-label="Filter community records by practice area">
        <button type="button" data-community-filter="all" aria-pressed="true">All <span>7</span></button>
        <button type="button" data-community-filter="screening" aria-pressed="false">Screening <span>3</span></button>
        <button type="button" data-community-filter="learning" aria-pressed="false">Professional learning <span>2</span></button>
        <button type="button" data-community-filter="engagement" aria-pressed="false">Public engagement <span>2</span></button>
      </div>
      <p class="community-filter__status" data-community-status aria-live="polite">Showing all 7 activities.</p>
    </div>
  </section>

  {%- assign event_index = 0 -%}
  <section class="community-section community-section--screening"
           id="medical-screening"
           data-community-section="screening"
           data-nav-marker="01"
           data-nav-label="Screening"
           data-nav-colour="#34D399"
           aria-labelledby="screening-title">
    <div class="community-shell community-section__layout">
      <header class="community-section__header">
        <span class="community-section__number" aria-hidden="true">01</span>
        <p class="community-eyebrow">Screening and field diagnostics</p>
        <h2 id="screening-title">Clinical evidence in community settings</h2>
        <p>Three field programmes document diagnostic assessment and preventive-health support for cocoa-farming and workplace communities.</p>
      </header>
      <div class="community-ledger">
        {% for event in site.data.community_activities.medical_screening %}
          {% include community-event.html event=event index=event_index filter="screening" category="Medical screening" accent="#34D399" icon="fa-solid fa-stethoscope" open=forloop.first %}
          {%- assign event_index = event_index | plus: 1 -%}
        {% endfor %}
      </div>
    </div>
  </section>

  <section class="community-section community-section--learning"
           id="conferences"
           data-community-section="learning"
           data-nav-marker="02"
           data-nav-label="Learning"
           data-nav-colour="#FBBF24"
           aria-labelledby="learning-title">
    <div class="community-shell community-section__layout">
      <header class="community-section__header">
        <span class="community-section__number" aria-hidden="true">02</span>
        <p class="community-eyebrow">Professional learning and diagnostic practice</p>
        <h2 id="learning-title">Standards, microscopy and infectious-disease response</h2>
        <p>Congress participation and technical training connect continuing professional development with laboratory quality and national disease-control practice.</p>
      </header>
      <div class="community-ledger">
        {% for event in site.data.community_activities.conferences %}
          {% include community-event.html event=event index=event_index filter="learning" category="Professional learning" accent="#FBBF24" icon="fa-solid fa-microscope" open=forloop.first %}
          {%- assign event_index = event_index | plus: 1 -%}
        {% endfor %}
      </div>
    </div>
  </section>

  <section class="community-section community-section--engagement"
           id="outreach"
           data-community-section="engagement"
           data-nav-marker="03"
           data-nav-label="Engagement"
           data-nav-colour="#A78BFA"
           aria-labelledby="engagement-title">
    <div class="community-shell community-section__layout">
      <header class="community-section__header">
        <span class="community-section__number" aria-hidden="true">03</span>
        <p class="community-eyebrow">Health education and public engagement</p>
        <h2 id="engagement-title">Health knowledge beyond formal clinical encounters</h2>
        <p>These records document preventive screening, health communication and youth engagement outside formal clinical settings.</p>
      </header>
      <div class="community-ledger">
        {% for event in site.data.community_activities.outreach %}
          {% include community-event.html event=event index=event_index filter="engagement" category="Public engagement" accent="#A78BFA" icon="fa-solid fa-people-group" open=forloop.first %}
          {%- assign event_index = event_index | plus: 1 -%}
        {% endfor %}
      </div>
    </div>
  </section>
</main>

{% include footer-v3.html %}
