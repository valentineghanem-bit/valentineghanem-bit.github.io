---
layout: v3
permalink: /map/
title: "Field Map"
description: "An interactive coordinate map of Valentine Golden Ghanem's medical screening, conference and community outreach activity across Ghana."
jsonld: map
extra_js: ["vendor/echarts.min.js", "field-map.js"]
---
{% include nav-v3.html %}
{%- assign geo_events = "" | split: "," -%}
{%- for e in site.data.community_activities.medical_screening -%}{%- assign geo_events = geo_events | push: e -%}{%- endfor -%}
{%- for e in site.data.community_activities.conferences -%}{%- assign geo_events = geo_events | push: e -%}{%- endfor -%}
{%- for e in site.data.community_activities.outreach -%}{%- assign geo_events = geo_events | push: e -%}{%- endfor -%}
<section class="map-v2 pt-40 pb-24 px-6">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Field Map</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Surveillance field map</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      Every medical screening, conference and community outreach activity on this site, plotted by its real coordinates against the real boundaries of Ghana's 261 administrative districts. Hover a pin for a preview, click through to its full record, scrub by year below, or scroll the list on the right &mdash; the map pans and zooms to follow it either way.
    </p>

    <div class="lg:grid lg:grid-cols-[minmax(260px,420px)_minmax(0,1fr)] gap-8 lg:gap-14 items-start">
      <div class="lg:sticky lg:top-24 mb-10 lg:mb-0">
        <div class="geo-map-frame glass-card rounded-2xl border shadow-lg">
          <div class="geo-map-hint" data-geo-hint>Drag to pan &middot; Ctrl/&#8984; + scroll to zoom</div>
          <div class="geo-compass" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 9-3 3-3-3 3-9z" fill="currentColor"/><path d="M12 22V13M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="0.75" opacity="0.4"/></svg>
            <span>N</span>
          </div>
          <div id="geo-map-echarts" class="geo-map-echarts" role="img" aria-label="Map of Ghana's 261 administrative districts with activity locations marked" data-geojson-url="{{ '/assets/data/ghana-districts.geojson' | relative_url }}"></div>
          <script type="application/json" id="geo-map-data">
            {
              "screening": {{ site.data.community_activities.medical_screening | jsonify }},
              "conference": {{ site.data.community_activities.conferences | jsonify }},
              "outreach": {{ site.data.community_activities.outreach | jsonify }}
            }
          </script>
          <div class="geo-scale" data-geo-scale aria-hidden="true">
            <span class="geo-scale__bar" data-geo-scale-bar style="width: 64px;"></span>
            <span class="geo-scale__label" data-geo-scale-label>50 km</span>
          </div>
          <div class="geo-zoom" data-geo-zoom>
            <button type="button" class="geo-zoom__btn" data-geo-zoom-in aria-label="Zoom in">+</button>
            <button type="button" class="geo-zoom__btn" data-geo-zoom-out aria-label="Zoom out">&minus;</button>
            <button type="button" class="geo-zoom__btn geo-zoom__btn--reset" data-geo-zoom-reset aria-label="Reset map view">&#8634;</button>
          </div>
        </div>
        <p class="font-mono text-xs text-slate-400 text-center mt-2">Real district boundaries (261 districts) &middot; hover a pin for a preview, click to open its record.</p>

        <div class="geo-legend flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs text-slate-500 dark:text-slate-400 mt-5" data-geo-legend>
          <button type="button" class="geo-legend__item geo-legend__item--screening" data-geo-filter="screening"><i class="geo-legend__swatch"></i>Medical screening</button>
          <button type="button" class="geo-legend__item geo-legend__item--conference" data-geo-filter="conference"><i class="geo-legend__swatch"></i>Conferences &amp; seminars</button>
          <button type="button" class="geo-legend__item geo-legend__item--outreach" data-geo-filter="outreach"><i class="geo-legend__swatch"></i>Community outreach</button>
          <span class="geo-legend__item"><i class="geo-legend__swatch geo-legend__swatch--district"></i>District boundary</span>
        </div>

        <div class="mt-8">
          <p class="font-mono text-[0.68rem] uppercase tracking-widest text-slate-400 mb-3.5">Scrub by year</p>
          <div data-geo-timeline></div>
        </div>
      </div>

      <ol class="grid gap-6 list-none p-0">
        {%- for e in geo_events -%}
        <li class="geo-card" id="geo-event-{{ forloop.index0 }}" data-geo-card>
          <span class="block font-mono text-xs text-violet-500">{{ e.lat }}&deg; N, {{ e.lng }}&deg; W</span>
          <h2 class="font-bold font-heading text-lg text-slate-900 dark:text-white mt-1.5 mb-1.5">{{ e.title }}</h2>
          <span class="block font-mono text-xs text-slate-400 mb-2.5">{{ e.provider }}{% if e.location %} &middot; {{ e.location }}{% endif %}{% if e.format and e.format contains "In-Person," %} &middot; {{ e.format | remove: "In-Person, " }}{% endif %} &middot; {{ e.date }}</span>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-[60ch] mb-4">{{ e.description }}</p>
          <a href="{{ '/community/' | relative_url }}#community-event-{{ forloop.index0 }}" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors inline-block">See full record &rarr;</a>
        </li>
        {%- endfor -%}
      </ol>
    </div>
  </div>
</section>

{% include footer-v3.html %}
