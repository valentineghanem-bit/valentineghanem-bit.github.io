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
    by its real coordinates against the real boundaries of Ghana's 259 administrative districts.
    Hover a pin for a preview, click through to its full record, or scroll the list on the
    right -- the map tracks along with it either way.
  </p>

  <div class="geo-layout">
    <div class="geo-map-wrap">
      <div class="geo-map-hint" data-geo-hint>Drag to pan &middot; Ctrl/&#8984; + scroll to zoom</div>
      <div class="geo-compass" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 9-3 3-3-3 3-9z" fill="currentColor"/><path d="M12 22V13M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="0.75" opacity="0.4"/></svg>
        <span>N</span>
      </div>
      <svg class="geo-map" viewBox="0 0 490 690" role="img" aria-label="Map of Ghana's 259 administrative districts with activity locations marked" data-geo-map data-viewbox="0 0 490 690">
        <defs>
          <pattern id="geo-grid" width="49" height="69" patternUnits="userSpaceOnUse">
            <path d="M 49 0 L 0 0 0 69" fill="none" stroke="var(--line)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="490" height="690" fill="url(#geo-grid)" opacity="0.5"/>
        {% include ghana-districts.svg %}
        {%- assign pin_i = 0 -%}
        {%- for e in site.data.community_activities.medical_screening -%}
        {% include geo-pin.html event=e category="screening" category_label="Medical screening" index=pin_i %}
        {%- assign pin_i = pin_i | plus: 1 -%}
        {%- endfor -%}
        {%- for e in site.data.community_activities.conferences -%}
        {% include geo-pin.html event=e category="conference" category_label="Conference or seminar" index=pin_i %}
        {%- assign pin_i = pin_i | plus: 1 -%}
        {%- endfor -%}
        {%- for e in site.data.community_activities.outreach -%}
        {% include geo-pin.html event=e category="outreach" category_label="Community outreach" index=pin_i %}
        {%- assign pin_i = pin_i | plus: 1 -%}
        {%- endfor -%}
      </svg>
      <div class="geo-scale" data-geo-scale aria-hidden="true">
        <span class="geo-scale__bar" data-geo-scale-bar style="width: 64px;"></span>
        <span class="geo-scale__label" data-geo-scale-label>50 km</span>
      </div>
      <div class="geo-zoom" data-geo-zoom>
        <button type="button" class="geo-zoom__btn" data-geo-zoom-in aria-label="Zoom in">+</button>
        <button type="button" class="geo-zoom__btn" data-geo-zoom-out aria-label="Zoom out">&minus;</button>
        <button type="button" class="geo-zoom__btn geo-zoom__btn--reset" data-geo-zoom-reset aria-label="Reset map view">&#8634;</button>
      </div>
      <p class="geo-map__caption">Real district boundaries (259 districts) &middot; hover a pin for a preview, click to open its record.</p>
      <div class="geo-legend" data-geo-legend>
        <button type="button" class="geo-legend__item geo-legend__item--screening" data-geo-filter="screening"><i class="geo-legend__swatch"></i>Medical screening</button>
        <button type="button" class="geo-legend__item geo-legend__item--conference" data-geo-filter="conference"><i class="geo-legend__swatch"></i>Conferences &amp; seminars</button>
        <button type="button" class="geo-legend__item geo-legend__item--outreach" data-geo-filter="outreach"><i class="geo-legend__swatch"></i>Community outreach</button>
        <span class="geo-legend__item"><i class="geo-legend__swatch geo-legend__swatch--district"></i>District boundary</span>
      </div>
    </div>

    <ol class="geo-scroll">
      {%- for e in geo_events -%}
      <li class="geo-card" id="geo-event-{{ forloop.index0 }}" data-reveal data-geo-card>
        <span class="geo-card__coord">{{ e.lat }}&deg; N, {{ e.lng }}&deg; W</span>
        <h2 class="geo-card__title">{{ e.title }}</h2>
        <span class="feed-item__meta">{{ e.provider }}{% if e.location %} · {{ e.location }}{% endif %}{% if e.format and e.format contains "In-Person," %} · {{ e.format | remove: "In-Person, " }}{% endif %} · {{ e.date }}</span>
        <p class="geo-card__desc">{{ e.description }}</p>
        <a class="btn btn--sm" href="{{ '/community/' | relative_url }}#community-event-{{ forloop.index0 }}">See full record &rarr;</a>
      </li>
      {%- endfor -%}
    </ol>
  </div>
</section>
