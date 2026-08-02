---
layout: v3
permalink: /community/
title: "Community"
browser_title: "Community Health | Valentine Ghanem"
description: "A documented record of medical screening, technical training, scientific conferences and community health education by Valentine Golden Ghanem across Ghana."
jsonld: community
extra_css: ["community-v2.css"]
extra_js: ["community-fx.js"]
---
{% include nav-v3.html %}
{%- assign community_activity_count = 0 -%}
{%- assign community_photo_count = 0 -%}
{%- assign community_video_count = 0 -%}
{%- for activity_group in site.data.community_activities -%}
  {%- assign community_activity_count = community_activity_count | plus: activity_group[1].size -%}
  {%- for activity in activity_group[1] -%}
    {%- assign community_photo_count = community_photo_count | plus: activity.photos.size -%}
    {%- if activity.video -%}{%- assign community_video_count = community_video_count | plus: 1 -%}{%- endif -%}
  {%- endfor -%}
{%- endfor -%}

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
        <h1 id="community-title">Public health practice <span>in Ghanaian communities.</span></h1>
        <p class="community-hero__summary">
          Valentine Golden Ghanem's community record documents medical screening,
          technical training, scientific conferences and health education across Ghana.
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
          <div><dt>{{ community_activity_count }}</dt><dd>documented activities</dd></div>
          <div><dt>{{ community_photo_count }}</dt><dd>field photographs</dd></div>
          <div><dt>{{ community_video_count }}</dt><dd>video records</dd></div>
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
        <button type="button" data-community-filter="learning" aria-pressed="false">Conferences &amp; training <span>2</span></button>
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
        <p class="community-eyebrow">Medical screening</p>
        <h2 id="screening-title">Medical screening in community settings</h2>
        <p>Three programmes document diagnostic assessment, preventive services and health advice for cocoa-farming and workplace communities.</p>
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
        <p class="community-eyebrow">Scientific conferences and technical training</p>
        <h2 id="learning-title">Standards, microscopy and infectious-disease response</h2>
        <p>The records cover a national scientific congress and practical tuberculosis diagnostic training, including microscopy and laboratory workflow.</p>
      </header>
      <div class="community-ledger">
        {% for event in site.data.community_activities.conferences %}
          {% include community-event.html event=event index=event_index filter="learning" category="Conference or technical training" accent="#FBBF24" icon="fa-solid fa-microscope" open=forloop.first %}
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
        <h2 id="engagement-title">Community health education and outreach</h2>
        <p>These records document health education and community engagement outside formal clinical settings.</p>
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
