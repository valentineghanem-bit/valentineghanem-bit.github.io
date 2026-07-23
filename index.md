---
layout: v3
permalink: /
jsonld: home
title: "Medical Scientist and Epidemiologist"
description: "Official website of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
---
{%- assign msph = site.data.profile.credentials | where_exp: "c", "c.name contains 'Public Health'" | first -%}
{%- assign mds = site.data.profile.credentials | where_exp: "c", "c.name contains 'Data Science'" | first -%}
{%- assign frsph = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'FRSPH'" | first -%}
{%- assign acslm = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'ACSLM'" | first -%}
{%- assign gamls = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'GAMLS'" | first -%}
{%- assign vve = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'VvE'" | first -%}

{%- comment -%} Real content injected for the v3 template's JS (journey tabs,
publications, portfolio, radar chart, district-map teaser) -- built from the
real _data/*.yml files, not the reference template's fabricated arrays. {%- endcomment -%}
<script>
  window.SITE_DATA = {
    journey: {
      education: [
        {% for t in site.data.timeline %}{% if t.title contains "Master of Science" or t.title contains "Bachelor of Science in Medical" %}
        { inst: {{ t.dates | jsonify }}, title: {{ t.title | jsonify }}, desc: {{ t.description | default: "" | jsonify }} },
        {% endif %}{% endfor %}
      ],
      appointments: [
        {% for t in site.data.timeline %}{% if t.title contains "Biomedical Scientist" or t.title contains "Screening" %}
        { inst: {{ t.dates | jsonify }}, title: {{ t.title | jsonify }}, desc: {{ t.description | default: "" | jsonify }} },
        {% endif %}{% endfor %}
      ],
      fellowships: [
        {% for t in site.data.timeline %}{% if t.title contains "Fellow" or t.title contains "CORU" or t.title contains "Licensure" %}
        { inst: {{ t.dates | jsonify }}, title: {{ t.title | jsonify }}, desc: {{ t.description | default: "" | jsonify }} },
        {% endif %}{% endfor %}
      ]
    },
    publications: [
      {% for p in site.data.publications %}
      {
        title: {{ p.title | jsonify }},
        year: {{ p.year | jsonify }},
        category: {% if p.title contains "Spatial" or p.title contains "District" %}"Epidemiology"{% elsif p.title contains "Machine Learning" or p.title contains "Ensemble" or p.title contains "Explainable" %}"Machine Learning"{% else %}"Clinical Science"{% endif %},
        status: {{ p.status | jsonify }},
        doi_url: {{ p.doi_url | jsonify }},
        summary: {{ p.summary | jsonify }}
      },
      {% endfor %}
    ],
    portfolio: [
      {% for p in site.data.portfolio.research_projects %}
      { title: {{ p.title | jsonify }}, category: {% if p.title contains "Antimicrobial" %}"Clinical"{% else %}"Machine Learning"{% endif %}, desc: {{ p.summary | jsonify }}, links: [{% for l in p.links %}{ label: {{ l.label | jsonify }}, url: {{ l.url | relative_url | jsonify }} },{% endfor %}] },
      {% endfor %}
      {% for p in site.data.portfolio.data_visualisations %}
      { title: {{ p.title | jsonify }}, category: "Spatial GIS", desc: {{ p.summary | jsonify }}, links: [{% for l in p.links %}{ label: {{ l.label | jsonify }}, url: {{ l.url | relative_url | jsonify }} },{% endfor %}] },
      {% endfor %}
      {% for p in site.data.portfolio.capstone_projects %}
      { title: {{ p.title | jsonify }}, category: "Machine Learning", desc: {{ p.summary | jsonify }}, links: [{% for l in p.links %}{ label: {{ l.label | jsonify }}, url: {{ l.url | relative_url | jsonify }} },{% endfor %}] },
      {% endfor %}
    ],
    radar: {
      labels: ["Spatial Epidemiology", "Clinical Diagnostics", "Data Science & ML", "Public Health Policy", "GIS & Mapping", "Lab Ops Leadership"],
      values: [88, 90, 86, 78, 82, 90]
    },
    districtSample: [
      { name: "Accra Metropolitan", region: "Greater Accra", lat: 5.6037, lon: -0.1870, risk: 62 },
      { name: "Kumasi Metropolitan", region: "Ashanti", lat: 6.6885, lon: -1.6244, risk: 55 },
      { name: "Tamale Metropolitan", region: "Northern", lat: 9.4008, lon: -0.8393, risk: 74 },
      { name: "Sekondi-Takoradi", region: "Western", lat: 4.8845, lon: -1.7554, risk: 48 },
      { name: "Cape Coast Metropolitan", region: "Central", lat: 5.1053, lon: -1.2466, risk: 51 },
      { name: "Tema Metropolitan", region: "Greater Accra", lat: 5.6698, lon: -0.0166, risk: 44 },
      { name: "Bolgatanga Municipal", region: "Upper East", lat: 10.7856, lon: -0.8514, risk: 80 },
      { name: "Wa Municipal", region: "Upper West", lat: 10.0601, lon: -2.5099, risk: 76 },
      { name: "Ho Municipal", region: "Volta", lat: 6.6111, lon: 0.4708, risk: 58 },
      { name: "Koforidua", region: "Eastern", lat: 6.0940, lon: -0.2591, risk: 53 }
    ]
  };
</script>

<canvas id="bg-canvas" aria-hidden="true"></canvas>
{% include nav-v3.html %}

<section id="hero" class="min-h-screen pt-36 pb-20 flex flex-col justify-center items-center px-6 relative overflow-hidden">
  <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <img src="https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1920&auto=format&fit=crop"
         alt="Fluorescence microscopy of bacterial rods and cocci chains"
         class="w-full h-full object-cover object-center opacity-30 dark:opacity-40 filter contrast-125 saturate-150 scale-105 transition-all duration-700 mix-blend-screen dark:mix-blend-lighten">
    <div class="absolute inset-0 graded-hero-overlay"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/90 dark:from-slate-950/95 dark:via-slate-950/75 dark:to-slate-950/95"></div>
  </div>

  <div class="blob w-[550px] h-[550px] bg-cyan-400/15 top-1/4 -left-32 pointer-events-none z-10"></div>
  <div class="blob w-[500px] h-[500px] bg-violet-500/15 bottom-10 -right-20 pointer-events-none z-10"></div>

  <div class="max-w-[1800px] mx-auto w-full grid lg:grid-cols-12 gap-x-8 gap-y-12 items-center relative z-10 px-2 lg:px-4">
    <div class="lg:col-span-7 reveal text-left">
      <div class="inline-flex items-center gap-2.5 px-4 py-1.5 border border-slate-300 dark:border-slate-700 rounded-full text-xs font-mono font-semibold tracking-wider mb-6 bg-white/70 dark:bg-slate-900/70 shadow-sm backdrop-blur-md">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">OPEN TO RESEARCH COLLABORATION &amp; ADVISORY</span>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <span class="text-slate-600 dark:text-slate-300">ACCRA, GHANA</span>
      </div>

      <div class="flex flex-wrap items-center gap-3 mb-4 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
        <span class="text-cyan-500 font-extrabold uppercase tracking-widest text-sm">{{ site.data.profile.name | upcase }}</span>
        <span>&bull;</span>
        <span class="px-2.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">MSc</span>
        <span class="px-2.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">MSPH</span>
        <span class="px-2.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">MLS (CORU, ACSLM)</span>
        <span class="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">FRSPH</span>
        <span class="px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">VvE</span>
      </div>

      <p class="text-sm sm:text-base font-mono font-semibold text-cyan-500 dark:text-cyan-400 mb-4 uppercase tracking-wide" aria-hidden="true">
        <span data-typed-text data-words="{{ site.data.profile.job_titles | jsonify | escape }}"></span><span class="typed-cursor"></span>
      </p>

      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-[1.05] mb-6 text-slate-900 dark:text-white">
        I turn scattered field data into <br class="hidden sm:inline">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">the pattern that stops an outbreak</span>
      </h1>

      <p class="text-lg sm:text-xl font-light text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-8">
        {{ site.data.profile.description | strip_newlines }}
      </p>

      <div class="flex flex-wrap items-center gap-4 mb-10">
        <a href="#simulator" class="magnetic-btn px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl hover:shadow-xl hover:shadow-cyan-500/25 transition-all hover:scale-105 flex items-center gap-2" style="transform: translate(var(--mx, 0px), var(--my, 0px))">
          <i class="fa-solid fa-flask text-sm"></i> Launch Outbreak Lab
        </a>
        <a href="{{ '/map/' | relative_url }}" class="magnetic-btn px-7 py-3.5 glass-card text-slate-800 dark:text-slate-200 font-black text-xs uppercase tracking-widest rounded-2xl hover:border-cyan-500 transition-all flex items-center gap-2" style="transform: translate(var(--mx, 0px), var(--my, 0px))">
          <i class="fa-solid fa-map-location-dot text-cyan-500"></i> Surveillance Map
        </a>
      </div>

      <div class="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
        <span class="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">Indexed In:</span>
        <a href="{{ site.data.profile.identifiers[1].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-brands fa-orcid"></i> ORCID
        </a>
        <a href="{{ site.data.profile.identifiers[3].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-full hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-graduation-cap"></i> Google Scholar
        </a>
        <a href="{{ site.data.profile.identifiers[4].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-magnifying-glass"></i> Web of Science
        </a>
      </div>
    </div>

    <div class="lg:col-span-5 reveal relative flex justify-center lg:justify-end lg:self-end h-[440px] sm:h-[560px] lg:h-[78vh] lg:min-h-[560px] lg:max-h-[820px]">
      <img src="{{ '/assets/img/gallery/portraits/hero-green-shirt-cutout.png' | relative_url }}"
           alt="{{ site.data.profile.name }}"
           class="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(6,182,212,0.25)]">
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 lg:left-auto lg:right-4 lg:translate-x-0 flex items-center gap-2.5 px-4 py-2 glass-card rounded-full border border-cyan-500/30 text-xs font-mono backdrop-blur-xl shadow-2xl whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-slate-700 dark:text-slate-200 font-semibold">{{ site.data.organization.cocoa_clinic.name }}, {{ site.data.organization.cocoa_clinic.parent_organization.name }}</span>
      </div>
    </div>
  </div>

  <div class="w-full max-w-5xl mx-auto mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 reveal relative z-10">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="p-4 glass-card rounded-2xl text-center">
        <div class="text-3xl lg:text-4xl font-black font-heading text-cyan-500" data-target="11" data-suffix="+">0</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Years in Clinical &amp; Public Health Practice</div>
      </div>
      <div class="p-4 glass-card rounded-2xl text-center">
        <div class="text-3xl lg:text-4xl font-black font-heading text-emerald-500" data-target="5000" data-suffix="+">0</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Individuals Screened in Outreach</div>
      </div>
      <div class="p-4 glass-card rounded-2xl text-center">
        <div class="text-3xl lg:text-4xl font-black font-heading text-amber-500" data-target="261" data-suffix="">0</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Ghana Districts in Spatial Models</div>
      </div>
      <div class="p-4 glass-card rounded-2xl text-center">
        <div class="text-3xl lg:text-4xl font-black font-heading text-violet-500" data-target="5" data-suffix="">0</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Peer-Reviewed Publications</div>
      </div>
    </div>
  </div>
</section>

<div class="marquee py-4 bg-slate-50/60 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800" aria-hidden="true">
  <div class="marquee__track">
    {% for topic in site.data.profile.knows_about %}<span class="marquee__item">{{ topic }}</span>{% endfor %}
    {% for topic in site.data.profile.knows_about %}<span class="marquee__item">{{ topic }}</span>{% endfor %}
  </div>
</div>

<section id="sub-hero" class="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800 relative">
  <div class="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
    <div class="lg:col-span-7 reveal">
      <div class="inline-flex items-center gap-2 text-xs font-mono font-bold text-red-500 tracking-widest uppercase mb-4">
        <i class="fa-solid fa-microscope"></i>
        <span>FIELD EPIDEMIOLOGY &amp; CLINICAL LABORATORY LEADERSHIP</span>
      </div>
      <h2 class="text-4xl sm:text-5xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight mb-6">
        Bridging Laboratory Diagnostics with <span class="text-cyan-500">Spatial Epidemiology.</span>
      </h2>
      <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        Currently serving as <strong class="text-slate-900 dark:text-white">{{ site.data.profile.job_titles[0] }} at {{ site.data.organization.cocoa_clinic.name }} ({{ site.data.organization.cocoa_clinic.parent_organization.alternate_name }})</strong>, Valentine leads diagnostic laboratory operations while applying spatial statistics and machine learning to HIV/AIDS surveillance and health-insurance access across Ghana's 261 districts.
      </p>
      <div class="relative pl-6 py-2 my-8 border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-2xl">
        <p class="text-lg sm:text-xl font-serif italic text-slate-800 dark:text-slate-200 leading-snug">
          &ldquo;{{ site.data.profile.aim | strip_newlines }}&rdquo;
        </p>
        <span class="text-xs font-mono text-slate-400 mt-2 block">&mdash; {{ site.data.profile.name }}, FRSPH</span>
      </div>
      <div class="flex flex-wrap gap-2.5 mb-8 text-xs font-mono font-semibold">
        <span class="px-3.5 py-1.5 glass-card rounded-lg flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <i class="fa-solid fa-award"></i> {{ frsph.abbreviation }} {{ frsph.reg_no }} (UK)
        </span>
        <span class="px-3.5 py-1.5 glass-card rounded-lg flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <i class="fa-solid fa-id-card"></i> {{ acslm.abbreviation }} / CORU {{ acslm.reg_no }} (Ireland)
        </span>
        <span class="px-3.5 py-1.5 glass-card rounded-lg flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
          <i class="fa-solid fa-shield-halved"></i> {{ gamls.abbreviation }} {{ gamls.reg_no }} (Ghana)
        </span>
        <span class="px-3.5 py-1.5 glass-card rounded-lg flex items-center gap-2 text-violet-600 dark:text-violet-400">
          <i class="fa-solid fa-globe"></i> {{ vve.abbreviation }} {{ vve.reg_no }} (Netherlands)
        </span>
      </div>
      <div class="flex flex-wrap gap-4">
        <a href="{{ '/publications/' | relative_url }}" class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-wider rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
          <i class="fa-solid fa-book-open"></i> Publications Index
        </a>
        <button onclick="openCvModal()" class="px-6 py-3 glass-card text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl hover:border-cyan-500 transition-all flex items-center gap-2">
          <i class="fa-solid fa-download text-red-500"></i> CV Summary
        </button>
      </div>
    </div>
    <div class="lg:col-span-5 relative flex justify-center lg:justify-end reveal">
      <div class="relative w-full max-w-md rounded-[32px] overflow-hidden glass-card p-3 border shadow-2xl group">
        <div class="absolute top-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2 shadow-lg">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>ACCRA, GHANA</span>
        </div>
        <img src="{{ '/assets/img/gallery/portraits/Valentine Golden Ghanem Portrait-18.webp' | relative_url }}"
             alt="{{ site.data.profile.name }}"
             class="w-full h-auto object-cover rounded-[24px] shadow-inner group-hover:scale-105 transition-transform duration-500">
        <div class="p-4 mt-2 text-center">
          <p class="font-bold text-sm text-slate-900 dark:text-white">{{ site.data.profile.name }}</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">MSc Data Science &middot; MSc Public Health</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="about" class="py-32 px-6 relative">
  <div class="max-w-7xl mx-auto">
    <div class="reveal text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-4">01 &mdash; Identity &amp; Evolution</h2>
      <h3 class="text-4xl sm:text-5xl font-black font-heading">Dual Precision: Clinical Lab + Data Science</h3>
      <p class="text-slate-600 dark:text-slate-400 mt-4 text-base">Combining rigorous wet-lab diagnostic accuracy with spatial epidemiology and machine learning to strengthen disease surveillance. Full detail on the <a href="{{ '/about/' | relative_url }}" class="text-cyan-500 hover:underline">About page</a>.</p>
    </div>
    <div class="reveal glass-card rounded-3xl p-6 sm:p-10 border">
      <div class="flex flex-wrap justify-center gap-3 mb-10 border-b border-slate-200 dark:border-slate-800 pb-6">
        <button onclick="switchJourneyTab('education', event)" class="journey-btn px-6 py-2.5 rounded-full text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all flex items-center gap-2">
          <i class="fa-solid fa-graduation-cap"></i> Education
        </button>
        <button onclick="switchJourneyTab('appointments', event)" class="journey-btn px-6 py-2.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all flex items-center gap-2">
          <i class="fa-solid fa-briefcase"></i> Clinical Appointments
        </button>
        <button onclick="switchJourneyTab('fellowships', event)" class="journey-btn px-6 py-2.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all flex items-center gap-2">
          <i class="fa-solid fa-certificate"></i> Councils &amp; Fellowships
        </button>
      </div>
      <div id="journey-content" class="grid md:grid-cols-2 gap-8"></div>
    </div>
  </div>
</section>

<section id="research" class="py-32 bg-slate-900 text-white relative overflow-hidden">
  <div class="blob w-[500px] h-[500px] bg-amber-500/10 top-0 right-0 pointer-events-none"></div>
  <div class="max-w-7xl mx-auto px-6">
    <div class="text-center mb-20 reveal">
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-400 mb-4">02 &mdash; Expertise</h2>
      <h3 class="text-4xl sm:text-5xl font-black font-heading">Multi-Disciplinary Technical Matrix</h3>
      <p class="text-slate-400 mt-3 text-sm">Relative emphasis across current work, not a measured proficiency score.</p>
    </div>
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 reveal">
        <div class="glass-card bg-slate-800/60 p-6 rounded-3xl border border-slate-700 h-[400px] relative">
          <canvas id="radarChart"></canvas>
        </div>
      </div>
      <div class="lg:col-span-6 reveal space-y-6">
        <div class="p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-cyan-400 transition-all">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">01</div>
            <h4 class="text-xl font-bold font-heading">Spatial Epidemiology &amp; GIS</h4>
          </div>
          <p class="text-sm text-slate-300 pl-14">Spatial autocorrelation (Moran's I, Bivariate LISA), disease and health-access mapping across Ghana's 261 districts, ArcGIS &amp; Folium choropleth mapping.</p>
        </div>
        <div class="p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-emerald-400 transition-all">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">02</div>
            <h4 class="text-xl font-bold font-heading">Clinical Diagnostic Leadership</h4>
          </div>
          <p class="text-sm text-slate-300 pl-14">High-complexity clinical chemistry &amp; haematology (Beckman AU5800, Sysmex XN-550, Mindray BS600, Roche), molecular diagnostics (GeneXpert, real-time PCR), ISO 15189 quality management.</p>
        </div>
        <div class="p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-violet-400 transition-all">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-lg">03</div>
            <h4 class="text-xl font-bold font-heading">Machine Learning &amp; Public Health Data</h4>
          </div>
          <p class="text-sm text-slate-300 pl-14">XGBoost, Random Forest, Ridge Regression and SHAP explainability for HIV/AIDS incidence forecasting; Python, R and Streamlit for reproducible dashboards.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="simulator" class="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
  <div class="max-w-7xl mx-auto">
    <div class="reveal text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-red-500 mb-4">03 &mdash; Interactive Demo</h2>
      <h3 class="text-4xl sm:text-5xl font-black font-heading">Spatial Autocorrelation Risk Simulator</h3>
      <p class="text-slate-600 dark:text-slate-400 mt-4">An illustrative demo of the spatial-autocorrelation concept (Moran's I) behind Valentine's real published work &mdash; not a validated predictive model. Adjust the sliders to see how the computed index responds.</p>
    </div>
    <div class="grid lg:grid-cols-12 gap-8 reveal">
      <div class="lg:col-span-5 glass-card p-8 rounded-3xl border">
        <h4 class="text-xl font-bold font-heading mb-6 flex items-center gap-2"><i class="fa-solid fa-sliders text-cyan-500"></i> Environmental &amp; Health Controls</h4>
        <div class="mb-6">
          <div class="flex justify-between text-xs font-bold mb-2"><span>Vector Density (Mosquito/Rodent Index)</span><span id="vectorVal" class="text-cyan-500">65%</span></div>
          <input type="range" id="vectorInput" min="10" max="100" value="65" oninput="calculateOutbreakRisk()" class="w-full accent-cyan-500 cursor-pointer">
        </div>
        <div class="mb-6">
          <div class="flex justify-between text-xs font-bold mb-2"><span>Water &amp; Sanitation Deficit Score</span><span id="sanitationVal" class="text-amber-500">45%</span></div>
          <input type="range" id="sanitationInput" min="0" max="100" value="45" oninput="calculateOutbreakRisk()" class="w-full accent-amber-500 cursor-pointer">
        </div>
        <div class="mb-6">
          <div class="flex justify-between text-xs font-bold mb-2"><span>Vaccination Coverage Rate</span><span id="vaccineVal" class="text-emerald-500">55%</span></div>
          <input type="range" id="vaccineInput" min="0" max="100" value="55" oninput="calculateOutbreakRisk()" class="w-full accent-emerald-500 cursor-pointer">
        </div>
        <div class="mb-6">
          <div class="flex justify-between text-xs font-bold mb-2"><span>Seasonal Rainfall Anomaly (mm)</span><span id="rainVal" class="text-violet-500">+120mm</span></div>
          <input type="range" id="rainInput" min="0" max="300" value="120" oninput="calculateOutbreakRisk()" class="w-full accent-violet-500 cursor-pointer">
        </div>
        <button onclick="resetSimulator()" class="w-full py-3 bg-slate-200 dark:bg-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-300 transition-colors">Reset Baseline Parameters</button>
      </div>
      <div class="lg:col-span-7 glass-card p-8 rounded-3xl border flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-slate-400">Illustrative Moran's I Index</span>
              <div id="moranIndexDisplay" class="text-5xl font-black font-heading text-cyan-500 mt-1">I = +0.72</div>
            </div>
            <div id="riskLevelBadge" class="px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30">HIGH CLUSTER RISK</div>
          </div>
          <div class="mb-8">
            <div class="flex justify-between text-xs font-bold text-slate-500 mb-2"><span>Outbreak Probability Score</span><span id="outbreakProbPercent">74%</span></div>
            <div class="w-full bg-slate-200 dark:bg-slate-800 h-4 rounded-full overflow-hidden p-0.5">
              <div id="outbreakProgressBar" class="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 rounded-full transition-all duration-300" style="width: 74%;"></div>
            </div>
          </div>
          <div class="p-5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h5 class="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-2"><i class="fa-solid fa-shield-virus text-cyan-500"></i> Illustrative Response Protocol</h5>
            <p id="interventionText" class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">Deploy targeted indoor residual spraying in hot-spot contiguous districts. Increase sentinel sampling frequency.</p>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>*Illustrative demo, not a validated model</span>
          <a href="{{ '/map/' | relative_url }}" class="text-cyan-500 font-bold hover:underline">Inspect the real Field Map &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="fieldmap" class="py-32 px-6 relative">
  <div class="max-w-7xl mx-auto">
    <div class="reveal text-center max-w-3xl mx-auto mb-16">
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-4">04 &mdash; Spatial Intelligence</h2>
      <h3 class="text-4xl sm:text-5xl font-black font-heading">Ghana District Sample</h3>
      <p class="text-slate-600 dark:text-slate-400 mt-4">A 10-city sample for this page &mdash; the <a href="{{ '/map/' | relative_url }}" class="text-violet-500 hover:underline">full Field Map</a> plots every real screening, conference and outreach activity across all 261 districts by true coordinates.</p>
    </div>
    <div class="grid lg:grid-cols-12 gap-8 reveal">
      <div class="lg:col-span-8 glass-card p-4 rounded-[32px] border">
        <div id="plotlyMap" class="w-full h-[550px] rounded-[24px] overflow-hidden"></div>
      </div>
      <div class="lg:col-span-4 glass-card p-6 rounded-[32px] border flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 text-xs font-mono font-bold text-violet-500 uppercase mb-4"><i class="fa-solid fa-crosshairs"></i> District Inspector</div>
          <h4 id="inspectorDistrictName" class="text-2xl font-black font-heading mb-1 text-slate-900 dark:text-white">Accra Metropolitan</h4>
          <p class="text-xs text-slate-500 mb-6" id="inspectorRegion">Greater Accra Region &middot; Lat: 5.6037, Lon: -0.1870</p>
          <p class="text-xs text-slate-500 leading-relaxed">This teaser uses 10 real major-city coordinates. Click a point to preview, then open the full Field Map for the complete real dataset with 261 districts.</p>
        </div>
        <div class="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
          <a href="{{ '/map/' | relative_url }}" class="text-xs font-bold text-violet-500 hover:underline">Open the full Field Map &rarr;</a>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="publications" class="py-32 px-6 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-7xl mx-auto">
    <div class="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
      <div>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-4">05 &mdash; Academic Repository</h2>
        <h3 class="text-4xl sm:text-5xl font-black font-heading">Publications &amp; Preprints</h3>
      </div>
      <div class="w-full md:w-auto flex flex-col sm:flex-row gap-3">
        <div class="relative">
          <input type="text" id="pubSearchInput" onkeyup="filterPublications()" placeholder="Search title, topic..." class="px-4 py-2.5 pl-10 glass-card rounded-full text-xs font-medium focus:outline-none focus:border-cyan-500 w-full sm:w-64">
          <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-slate-400 text-xs"></i>
        </div>
        <select id="pubCategoryFilter" onchange="filterPublications()" class="px-4 py-2.5 glass-card rounded-full text-xs font-bold focus:outline-none text-slate-700 dark:text-slate-300">
          <option value="all">All Domains</option>
          <option value="Epidemiology">Epidemiology</option>
          <option value="Clinical Science">Clinical Science</option>
          <option value="Machine Learning">Machine Learning</option>
        </select>
      </div>
    </div>
    <div id="publicationsContainer" class="space-y-4 reveal"></div>
  </div>
</section>

<section id="portfolio" class="py-32 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 reveal">
      <div>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-4">06 &mdash; Portfolio</h2>
        <h3 class="text-4xl sm:text-5xl font-black font-heading">Selected Projects &amp; Models</h3>
      </div>
      <div class="flex flex-wrap gap-2">
        <button onclick="filterPortfolio('all')" data-cat="all" class="filter-btn px-5 py-2 rounded-full text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 transition-all">All Projects</button>
        <button onclick="filterPortfolio('Spatial GIS')" data-cat="Spatial GIS" class="filter-btn px-5 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all">Spatial GIS</button>
        <button onclick="filterPortfolio('Machine Learning')" data-cat="Machine Learning" class="filter-btn px-5 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all">Machine Learning</button>
        <button onclick="filterPortfolio('Clinical')" data-cat="Clinical" class="filter-btn px-5 py-2 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-all">Clinical Ops</button>
      </div>
    </div>
    <div id="portfolio-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal"></div>
    <div class="text-center mt-10 reveal">
      <a href="{{ '/portfolio/' | relative_url }}" class="text-xs font-bold text-emerald-500 hover:underline">View the full Portfolio page &rarr;</a>
    </div>
  </div>
</section>

<section id="gallery" class="py-32 bg-slate-50/50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-7xl mx-auto px-6">
    <div class="reveal mb-12 flex items-end justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-4">07 &mdash; Field &amp; Diagnostic Operations</h2>
        <h3 class="text-4xl font-black font-heading">A Look Behind the Work</h3>
      </div>
      <a href="{{ '/gallery/' | relative_url }}" class="text-xs font-bold text-violet-500 hover:underline">Full Gallery (26 photos) &rarr;</a>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 reveal">
      {%- for item in site.data.gallery_portraits limit:4 -%}
      <div onclick="openLightbox('{{ item.url | relative_url }}', 'Field &amp; Diagnostic Operations', '{{ item.caption }}')"
           class="h-64 bg-slate-800 rounded-3xl overflow-hidden relative group cursor-pointer p-6 flex items-end {% if forloop.index == 2 %}sm:col-span-2{% endif %}">
        <img src="{{ item.url | relative_url }}" alt="{{ item.caption }}" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></div>
        <div class="relative z-10 text-xs font-black uppercase text-white tracking-widest bg-slate-900/80 px-3 py-1.5 rounded-lg">View in Gallery &rarr;</div>
      </div>
      {%- endfor -%}
    </div>
  </div>
</section>

{% include footer-v3.html %}
