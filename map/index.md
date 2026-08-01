---
layout: v3
permalink: /map/
title: "Ghana Health Map"
browser_title: "Ghana Health Atlas | Valentine Ghanem"
description: "Valentine Golden Ghanem's interactive atlas of population context, social determinants, health services and selected outcomes across Ghana's 16 regions and 261 districts."
jsonld: map
extra_css: ["map-phase9.css"]
extra_js: ["vendor/echarts.min.js", "home-district-engine.js", "field-map.js", "map-phase9.js"]
---
{% include nav-v3.html %}

<main class="map9" data-map9-root>
  <section class="map9-hero" data-nav-marker="00" data-nav-label="Atlas" data-nav-colour="#63D2FF" aria-labelledby="map9-title">
    <img
      class="map9-hero__image"
      src="{{ '/assets/img/community/goaso-2024/with-ceo.jpg' | relative_url }}"
      alt="Valentine Golden Ghanem with the Cocoa Clinic medical team and cocoa-sector community members during the 2024 Goaso health screening"
      width="1080"
      height="1350"
      fetchpriority="high">
    <div class="map9-hero__veil" aria-hidden="true"></div>
    <div class="map9-shell map9-hero__content">
      <p class="map9-breadcrumb"><a href="{{ '/' | relative_url }}">Home</a><span aria-hidden="true">/</span>Ghana Health Map</p>
      <p class="map9-hero__eyebrow">Spatial epidemiology / health equity / district evidence</p>
      <h1 id="map9-title">Ghana's health evidence, resolved from <span>region to district.</span></h1>
      <p class="map9-hero__lede">
        Valentine Golden Ghanem's national atlas brings population context, social determinants, service coverage and selected health outcomes into a single geographic record that readers can examine directly.
      </p>
      <div class="map9-hero__actions">
        <a class="map9-button map9-button--primary" href="#national-atlas">
          <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
          Open atlas
        </a>
        <a class="map9-button map9-button--secondary" href="#evidence-provenance">
          <i class="fa-solid fa-database" aria-hidden="true"></i>
          View sources
        </a>
      </div>
      <dl class="map9-hero__metrics" aria-label="Ghana health atlas coverage">
        <div><dt>261</dt><dd>district profiles</dd></div>
        <div><dt>5</dt><dd>comparison indicators</dd></div>
        <div><dt>3</dt><dd>medical-screening sites</dd></div>
        <div><dt>7</dt><dd>geolocated field records</dd></div>
      </dl>
    </div>
    <div class="map9-hero__caption">
      <span>Cocoa-farmers medical screening</span>
      <strong>Valentine Golden Ghanem</strong>
      <small>Goaso / 6 November 2024</small>
    </div>
  </section>

  <section id="national-atlas" class="map9-atlas district-intelligence-section" data-nav-marker="01" data-nav-label="Explore" data-nav-colour="#9766E1" aria-labelledby="map9-atlas-title">
    <div class="map9-shell">
      <header class="map9-heading">
        <span class="map9-heading__number" aria-hidden="true">01</span>
        <div>
          <p class="map9-heading__kicker">01 &mdash; Interactive Atlas</p>
          <h2 id="map9-atlas-title">National health geography at two scales</h2>
          <p>Compare Ghana's 16 regions, then move to any of its 261 districts. Every selection updates the adjacent evidence card without leaving the map.</p>
        </div>
      </header>

      <div id="ghanaDistrictExplorer"
           class="district-explorer map9-explorer"
           data-geo-url="{{ '/assets/data/ghana-districts.geojson' | relative_url }}"
           data-region-geo-url="{{ '/assets/data/ghana-regions.geojson' | relative_url }}"
           data-facts-url="{{ '/assets/data/ghana-district-facts.json' | relative_url }}"
           aria-busy="true">
        <div class="district-map-panel">
          <div class="district-map-toolbar">
            <div class="district-geography-control">
              <span>Map view</span>
              <div role="group" aria-label="Geographic level">
                <button type="button" class="is-active" data-geography-view="regions" aria-pressed="true">Regions</button>
                <button type="button" data-geography-view="districts" aria-pressed="false">Districts</button>
              </div>
            </div>
            <div class="district-selector-control">
              <label for="districtSelector" id="geographySelectorLabel">Region selector</label>
              <select id="districtSelector">
                <option value="">Loading regional atlas...</option>
              </select>
            </div>
            <div class="district-metric-control" role="group" aria-label="Map colour indicator">
              <span>Map colour</span>
              <div>
                <button type="button" class="is-active" data-district-metric="health" aria-pressed="true">Health score</button>
                <button type="button" data-district-metric="poverty" aria-pressed="false">Poverty</button>
                <button type="button" data-district-metric="insurance" aria-pressed="false">Insurance</button>
                <button type="button" data-district-metric="illiteracy" aria-pressed="false">Illiteracy</button>
                <button type="button" data-district-metric="sanitation" aria-pressed="false">Sanitation</button>
              </div>
            </div>
          </div>

          <div class="district-map-caption">
            <div>
              <span class="district-map-kicker">Bespoke HI-EI atlas engine &middot; ECharts SVG</span>
              <strong id="districtMapMetricLabel">Regional SDG health score</strong>
            </div>
            <div class="district-map-caption__actions">
              <span id="districtMapCoverage">Aggregating 16 regional summaries...</span>
              <button type="button" id="districtMapReset" title="Reset map to Greater Accra">
                <i class="fa-solid fa-location-crosshairs" aria-hidden="true"></i>
                <span>Reset to Greater Accra</span>
              </button>
            </div>
          </div>

          <div class="district-map-frame">
            <div id="ghanaDistrictMap"
                 class="district-map-echarts"
                 role="img"
                 aria-label="Interactive choropleth atlas of Ghana's 16 regions and 261 districts. Use the selector or click a boundary to update the evidence card."
                 tabindex="0"></div>
            <div id="districtMapLoading" class="district-map-loading">
              <i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i>
              <span>Preparing Ghana's regional and district boundaries</span>
            </div>
          </div>

          <div id="districtMapLegend" class="district-map-legend" aria-label="Map legend"></div>
          <p class="district-map-source">Colours show quintiles for the selected indicator. They support comparison; they do not represent clinical thresholds or formal local-cluster tests.</p>
        </div>

        <aside class="district-inspector" aria-labelledby="inspectorDistrictName">
          <header>
            <div class="district-inspector-heading">
              <span class="district-map-kicker" id="inspectorKicker"><i class="fa-solid fa-layer-group" aria-hidden="true"></i> Regional evidence card</span>
              <span class="district-signal-badge" id="inspectorSignal">Assessing regional signal</span>
            </div>
            <h3 id="inspectorDistrictName">Loading regional atlas</h3>
            <p id="inspectorRegion">Aggregating district records by region</p>
          </header>

          <dl class="district-identity">
            <div><dt id="inspectorPopulationLabel">Population</dt><dd id="inspectorPopulation">--</dd></div>
            <div><dt id="inspectorClassLabel">Districts in region</dt><dd id="inspectorClass">--</dd></div>
            <div><dt id="inspectorCoordinatesLabel">Atlas level</dt><dd id="inspectorCoordinates">Region overview</dd></div>
          </dl>

          <div class="district-inspector-tabs" role="tablist" aria-label="Geographic evidence view">
            <button type="button" class="is-active" role="tab" aria-selected="true" data-district-view="social">Determinants</button>
            <button type="button" role="tab" aria-selected="false" data-district-view="services">Services</button>
            <button type="button" role="tab" aria-selected="false" data-district-view="outcomes">Outcomes</button>
          </div>

          <div id="districtInspectorPanel" class="district-inspector-panel" role="tabpanel" aria-live="polite"></div>

          <div class="district-inspector-note">
            <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
            <p id="inspectorNote">Regional summaries are population-weighted from district records and should not be interpreted as individual risk or causal effects.</p>
          </div>

          <div class="district-inspector-actions">
            <a href="#comparative-context">Compare selected geography <i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a>
            <button type="button" id="districtCopySummary"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copy regional summary</button>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section id="comparative-context" class="map9-comparison" data-nav-marker="02" data-nav-label="Compare" data-nav-colour="#FFE87A" aria-labelledby="map9-comparison-title">
    <div class="map9-shell">
      <header class="map9-heading map9-heading--dark">
        <span class="map9-heading__number" aria-hidden="true">02</span>
        <div>
          <p class="map9-heading__kicker">02 &mdash; Comparative Context</p>
          <h2 id="map9-comparison-title">Place each selection within the national distribution</h2>
          <p>Select any region or district below to return to the atlas above and open its evidence card. The comparison follows the active map indicator and geographic level.</p>
        </div>
      </header>

      <div class="map9-comparison__workspace" aria-live="polite">
        <article class="map9-selected">
          <p class="map9-micro">Current selection</p>
          <h3 data-map9-selected-name>Greater Accra</h3>
          <p data-map9-selected-context>Regional SDG health score</p>
          <strong data-map9-selected-value>Preparing comparison...</strong>
          <div class="map9-range" aria-label="Position in the current geographic distribution">
            <span class="map9-range__track"><i data-map9-range-marker></i></span>
            <div><span data-map9-range-min>Minimum</span><b data-map9-selected-rank>--</b><span data-map9-range-max>Maximum</span></div>
          </div>
          <p class="map9-selected__note" data-map9-selected-note>Waiting for the atlas engine.</p>
          <button type="button" class="map9-selected__return" data-map9-return-selected>
            <i class="fa-solid fa-map-location-dot" aria-hidden="true"></i>
            View selected place on map
          </button>
        </article>

        <div class="map9-ranking">
          <div class="map9-ranking__header">
            <div>
              <p class="map9-micro">Ranked geography</p>
              <h3 data-map9-ranking-title>Highest indicator values</h3>
            </div>
            <span data-map9-ranking-scope>16 regions</span>
          </div>
          <ol data-map9-ranking-list>
            <li class="map9-ranking__loading">Preparing the national distribution...</li>
          </ol>
        </div>
      </div>
    </div>
  </section>

  <section id="field-evidence" class="map9-field" data-nav-marker="03" data-nav-label="Field" data-nav-colour="#FF5964" aria-labelledby="map9-field-title">
    <div class="map9-shell">
      <header class="map9-heading map9-heading--dark">
        <span class="map9-heading__number" aria-hidden="true">03</span>
        <div>
          <p class="map9-heading__kicker">03 &mdash; Geolocated Field Evidence</p>
          <h2 id="map9-field-title">Seven documented activities at their recorded coordinates</h2>
          <p>Screening, technical learning and public engagement are mapped as dated field records. Hover or focus a marker for its image; select it to update the permanent record card.</p>
        </div>
      </header>

      <div class="map9-field__workspace">
        <div class="map9-field__map-column">
          <div class="geo-map-frame map9-field__map-frame">
            <div class="geo-map-hint" data-geo-hint>Drag to pan &middot; Ctrl/&#8984; + scroll to zoom</div>
            <div class="geo-compass" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 9-3 3-3-3 3-9z" fill="currentColor"/><path d="M12 22V13M4 12h16M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="0.75" opacity="0.4"/></svg>
              <span>N</span>
            </div>
            <div id="geo-map-echarts"
                 class="geo-map-echarts"
                 role="img"
                 aria-label="Map of Ghana's 261 district boundaries with seven documented screening, learning and outreach locations"
                 data-geojson-url="{{ '/assets/data/ghana-districts.geojson' | relative_url }}"></div>
            <script type="application/json" id="geo-map-data">
              {
                "screening": {{ site.data.community_activities.medical_screening | jsonify }},
                "conference": {{ site.data.community_activities.conferences | jsonify }},
                "outreach": {{ site.data.community_activities.outreach | jsonify }}
              }
            </script>
            <div class="geo-scale" data-geo-scale aria-hidden="true">
              <span class="geo-scale__bar" data-geo-scale-bar style="width:64px"></span>
              <span class="geo-scale__label" data-geo-scale-label>50 km</span>
            </div>
            <div class="geo-zoom" data-geo-zoom>
              <button type="button" class="geo-zoom__btn" data-geo-zoom-in aria-label="Zoom in">+</button>
              <button type="button" class="geo-zoom__btn" data-geo-zoom-out aria-label="Zoom out">&minus;</button>
              <button type="button" class="geo-zoom__btn geo-zoom__btn--reset" data-geo-zoom-reset aria-label="Reset field map">&#8634;</button>
            </div>
          </div>
          <p class="map9-field__map-note">Real district boundaries &middot; animated markers identify verified field coordinates &middot; marker images open in the adjacent record card.</p>

          <div class="geo-legend map9-field__filters" data-geo-legend role="group" aria-label="Filter mapped field records by activity type">
            <button type="button" class="geo-legend__item geo-legend__item--screening" data-geo-filter="screening" aria-pressed="false"><i class="geo-legend__swatch"></i>Medical screening</button>
            <button type="button" class="geo-legend__item geo-legend__item--conference" data-geo-filter="conference" aria-pressed="false"><i class="geo-legend__swatch"></i>Conferences &amp; seminars</button>
            <button type="button" class="geo-legend__item geo-legend__item--outreach" data-geo-filter="outreach" aria-pressed="false"><i class="geo-legend__swatch"></i>Community outreach</button>
            <span class="geo-legend__item"><i class="geo-legend__swatch geo-legend__swatch--district"></i>District boundary</span>
          </div>

          <div class="map9-field__timeline">
            <p>Scrub by year</p>
            <div data-geo-timeline></div>
          </div>
        </div>

        <aside class="map9-field-card" data-map9-field-inspector aria-live="polite" aria-labelledby="map9-field-record-title">
          <figure>
            <img data-map9-field-image
                 src="{{ '/assets/img/community/goaso-2024/with-ceo.jpg' | relative_url }}"
                 alt="Valentine Golden Ghanem with the Cocoa Clinic medical team during the 2024 Goaso medical screening">
            <figcaption data-map9-field-category>Medical screening</figcaption>
          </figure>
          <div class="map9-field-card__body">
            <p class="map9-micro" data-map9-field-coordinate>6.80&deg; N / 2.51&deg; W</p>
            <h3 id="map9-field-record-title" data-map9-field-title>2024 Medical Screening &ndash; Goaso</h3>
            <p class="map9-field-card__meta" data-map9-field-meta>Goaso, Ahafo / 6 November 2024</p>
            <p data-map9-field-description>Valentine Golden Ghanem worked with the Cocoa Clinic medical team during a health-screening outreach for cocoa farmers in Goaso.</p>
            <a data-map9-field-link href="{{ '/community/' | relative_url }}#community-event-0">Open complete field record <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
          <div class="map9-field-card__records">
            <label for="map9FieldRecordSelect">Choose a mapped record</label>
            <select id="map9FieldRecordSelect" data-map9-field-list aria-label="Choose a mapped field record"></select>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section id="evidence-provenance" class="map9-provenance" data-nav-marker="04" data-nav-label="Sources" data-nav-colour="#34D399" aria-labelledby="map9-provenance-title">
    <div class="map9-shell map9-provenance__layout">
      <div class="map9-provenance__summary">
        <header class="map9-heading">
          <span class="map9-heading__number" aria-hidden="true">04</span>
          <div>
            <p class="map9-heading__kicker">04 &mdash; Evidence Provenance</p>
            <h2 id="map9-provenance-title">Three source layers, seven canonical tables</h2>
          </div>
        </header>
        <p>The atlas combines administrative geography, district and regional health evidence, and a separate dated field-record layer. Seven complete 261-row analytical tables were selected after review of 53 local master CSV files; incomplete fields are not presented as national measures.</p>
        <dl>
          <div><dt>261</dt><dd>district records joined</dd></div>
          <div><dt>7</dt><dd>canonical tables in the live card</dd></div>
          <div><dt>53</dt><dd>master CSV files retained in the provenance inventory</dd></div>
        </dl>
        <div class="map9-source-layers" aria-label="Atlas source layers">
          <article>
            <span>01</span>
            <div><strong>Administrative boundaries</strong><p>District polygons come from Ghana administrative boundary GeoJSON documented in the contributing repositories as Ghana Statistical Service-derived or OCHA HDX public geography. The same geometry supplies district perimeters, representative coordinates and the 16-region aggregation.</p></div>
          </article>
          <article>
            <span>02</span>
            <div><strong>Population and health evidence</strong><p>District determinants draw chiefly from the 2021 Population and Housing Census. Ghana DHS 2019 and 2022 indicators remain identified as regional estimates assigned to districts within each survey region; NHIA and study-derived indices retain their stated analytical resolution.</p></div>
          </article>
          <article>
            <span>03</span>
            <div><strong>Dated field records</strong><p>The seven event markers come from the site's documented activity register, with recorded dates, locations, coordinates, descriptions and local image paths. They are a professional field archive, not a national facility registry or epidemiological sample.</p></div>
          </article>
        </div>
        <p class="map9-provenance__caveat"><strong>Interpretation boundary:</strong> indicators describe geographic context. Regional summaries are population-weighted. The atlas does not estimate individual risk, test causal effects or replace source-study methods.</p>
      </div>

      <ol class="map9-domain-register" aria-label="Evidence domains represented in the map">
        <li><span>01</span><div><strong>Demography and structural determinants</strong><p>GSS PHC 2021 population, poverty, literacy, employment, insurance and dependency measures at district level.</p></div></li>
        <li><span>02</span><div><strong>Insurance and women's education</strong><p>PHC district context combined with DHS 2019/2022 regional insurance, education and facility-delivery estimates; regional proxies are disclosed in the source repositories.</p></div></li>
        <li><span>03</span><div><strong>SDG, WASH, services and outcomes</strong><p>Census context, regional service indicators and derived health scores. Regional DHIMS2 measures remain uniform within their source region.</p></div></li>
        <li><span>04</span><div><strong>Nutrition, anaemia and child health</strong><p>DHS 2022 regional outcomes modelled to district surfaces with PHC 2021 covariates; estimates are model-based, not direct district observations.</p></div></li>
        <li><span>05</span><div><strong>Maternal and reproductive health</strong><p>DHS 2022 service indicators, PHC 2021 determinants and NHIA summaries assembled as an ecological district dataset.</p></div></li>
        <li><span>06</span><div><strong>Immunisation coverage</strong><p>DHS 2022 regional immunisation estimates linked to district-varying PHC 2021 socioeconomic context; geographic resolution is retained in interpretation.</p></div></li>
        <li><span>07</span><div><strong>Ranked structural vulnerability</strong><p>A reproducible index derived from six PHC 2021 structural determinants and ranked across 261 districts.</p></div></li>
      </ol>
    </div>
  </section>
</main>

{% include footer-v3.html %}
