---
layout: default
permalink: /map/
title: "Field Map"
description: "An interactive coordinate map of Valentine Golden Ghanem's medical screening, conference and community outreach activity across Ghana."
---

{%- assign geo_events = "" | split: "," -%}
{%- for e in site.data.community_activities.medical_screening -%}{%- assign geo_events = geo_events | push: e -%}{%- endfor -%}
{%- for e in site.data.community_activities.conferences -%}{%- assign geo_events = geo_events | push: e -%}{%- endfor -%}
{%- for e in site.data.community_activities.outreach -%}{%- assign geo_events = geo_events | push: e -%}{%- endfor -%}

<section class="section wrap wrap--wide" data-reveal>
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Field Map</p>
  <h1 class="page-title">Field map</h1>
  <p class="section__intro">
    Every medical screening, conference and community outreach activity on this site, plotted
    by its real coordinates across Ghana. Scroll through the record on the right; the map
    tracks along with it.
  </p>

  <div class="geo-layout">
    <div class="geo-map-wrap">
      <svg class="geo-map" viewBox="0 0 460 670" role="img" aria-label="Coordinate map of Ghana with activity locations marked" data-geo-map>
        <defs>
          <pattern id="geo-grid" width="46" height="67" patternUnits="userSpaceOnUse">
            <path d="M 46 0 L 0 0 0 67" fill="none" stroke="var(--line)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="460" height="670" fill="url(#geo-grid)" opacity="0.5"/>
        <path class="geo-map__silhouette"
          d="M40,20 L380,20 L390,170 L410,320 L430,470 L445,520 L450,540
             L360,590 L280,610 L200,630 L130,640 L50,630 L25,570
             L40,470 L45,370 L50,270 L45,170 L40,70 Z"
        />
        {%- for e in geo_events -%}
        {%- assign px = e.lng | plus: 3.3 | times: 100 -%}
        {%- assign py = 11.2 | minus: e.lat | times: 100 -%}
        <g class="geo-pin" data-geo-pin data-target="geo-event-{{ forloop.index0 }}" transform="translate({{ px }}, {{ py }})">
          <circle class="geo-pin__pulse" r="5"/>
          <circle class="geo-pin__dot" r="4.5"/>
        </g>
        {%- endfor -%}
      </svg>
      <p class="geo-map__caption">Stylized coordinate plot, not a survey-accurate boundary.</p>
    </div>

    <ol class="geo-scroll">
      {%- for e in geo_events -%}
      <li class="geo-card" id="geo-event-{{ forloop.index0 }}" data-reveal data-geo-card>
        <span class="geo-card__coord">{{ e.lat }}&deg; N, {{ e.lng }}&deg; W</span>
        <h2 class="geo-card__title">{{ e.title }}</h2>
        <span class="feed-item__meta">{{ e.provider }}{% if e.location %} · {{ e.location }}{% endif %}{% if e.format and e.format contains "In-Person," %} · {{ e.format | remove: "In-Person, " }}{% endif %} · {{ e.date }}</span>
        <p class="geo-card__desc">{{ e.description }}</p>
        <a class="btn btn--sm" href="{{ '/community/' | relative_url }}">See full record &rarr;</a>
      </li>
      {%- endfor -%}
    </ol>
  </div>
</section>
