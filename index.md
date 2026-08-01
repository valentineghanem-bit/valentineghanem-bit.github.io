---
layout: v3
permalink: /
jsonld: home
title: "Valentine Ghanem"
browser_title: "Valentine Ghanem | Home"
description: "Official website of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
extra_js: ["vendor/echarts.min.js", "home-district-engine.js"]
---
{%- comment -%} Real content injected for the v3 template's JS (publications,
portfolio, radar chart, district-map teaser) -- built from the
real _data/*.yml files, not the reference template's fabricated arrays. {%- endcomment -%}
<script>
  window.SITE_DATA = {
    publications: [
      {% for p in site.data.publications %}
      {
        title: {{ p.title | jsonify }},
        journal: {{ p.journal | jsonify }},
        year: {{ p.year | jsonify }},
        record_type: {{ p.record_type | jsonify }},
        status: {{ p.status | jsonify }},
        doi_url: {{ p.doi_url | jsonify }},
        citation: {{ p.citation | jsonify }},
        summary: {{ p.summary | jsonify }},
        methods: {{ p.methods | jsonify }},
        caveat: {{ p.caveat | jsonify }},
        links: [{% for l in p.links %}{ label: {{ l.label | jsonify }}, url: {{ l.url | jsonify }} },{% endfor %}]
      },
      {% endfor %}
    ],
    artifacts: [
      {% for a in site.data.home_artifacts %}
      {
        id: {{ a.id | jsonify }},
        title: {{ a.title | jsonify }},
        domain: {{ a.domain | jsonify }},
        status: {{ a.status | jsonify }},
        icon: {{ a.icon | jsonify }},
        summary: {{ a.summary | jsonify }},
        evidence: {{ a.evidence | jsonify }},
        methods: {{ a.methods | jsonify }},
        repo_url: {{ a.repo_url | jsonify }},
        demo_url: {{ a.demo_url | jsonify }},
        release_url: {{ a.release_url | jsonify }}
      },
      {% endfor %}
    ],
    radar: {
      labels: ["Lab Quality", "Public Health", "Surveillance", "Spatial GIS", "Predictive ML", "Quality Systems", "Clinical Data"],
      values: [92, 90, 88, 88, 86, 89, 84],
      components: [
        {
          label: "Lab Quality",
          score: 92,
          domain: "Clinical laboratory operations",
          engine: "HI-EI Component 01",
          interpretation: "Diagnostic accuracy, workflow discipline, quality control and audit-ready laboratory practice anchor the clinical side of the portfolio.",
          evidence: "Clinical chemistry, haematology, microbiology-aware diagnostics, GeneXpert and real-time PCR workflows.",
          output: "Reliable laboratory evidence that can move into surveillance, programme decisions and quality-improvement cycles."
        },
        {
          label: "Public Health",
          score: 90,
          domain: "Population health practice",
          engine: "HI-EI Component 02",
          interpretation: "Public-health reasoning connects disease prevention, health-systems strengthening, service access and community-level implementation.",
          evidence: "Communicable-disease epidemiology, vaccination context, WASH exposure, outreach screening and health advisory work.",
          output: "Actionable programme intelligence for targeted outreach, prevention priorities and equity-aware service planning."
        },
        {
          label: "Surveillance",
          score: 88,
          domain: "Outbreak and signal intelligence",
          engine: "HI-EI Component 03",
          interpretation: "Surveillance work is treated as an early-warning discipline: signals are checked, contextualised and translated before action.",
          evidence: "Screening records, district patterns, clinical indicators, exposure signals and response-priority logic.",
          output: "Clear escalation cues for sampling, field verification, neighbouring-district review and public-health response."
        },
        {
          label: "Spatial GIS",
          score: 88,
          domain: "Ghana district intelligence",
          engine: "HI-EI Component 04",
          interpretation: "Spatial analysis treats place as evidence, especially when district patterns expose clustering, service gaps or inequity.",
          evidence: "Moran's I, bivariate LISA, choropleth mapping, district centroids, GeoJSON and Ghana's 261-district geography.",
          output: "District-level maps and spatial summaries that show where population risk, access and service signals concentrate."
        },
        {
          label: "Predictive ML",
          score: 86,
          domain: "Applied modelling",
          engine: "HI-EI Component 05",
          interpretation: "Machine-learning models are presented with their assumptions and interpretation, rather than as unexplained predictions.",
          evidence: "Random Forest, Ridge Regression, XGBoost, SVR, SHAP explainability and reproducible Python/R workflows.",
          output: "Forecasting and risk-stratification artifacts that can be inspected, explained and compared against public-health context."
        },
        {
          label: "Quality Systems",
          score: 89,
          domain: "Governance and reliability",
          engine: "HI-EI Component 06",
          interpretation: "Quality systems hold the work together: methods, documentation, reproducibility and laboratory governance must agree.",
          evidence: "ISO 15189 thinking, quality control, external quality assurance, biosafety awareness and data-quality checks.",
          output: "Auditable workflows that preserve trust from specimen handling through analysis, reporting and dashboard publication."
        },
        {
          label: "Clinical Data",
          score: 84,
          domain: "Clinical data science",
          engine: "HI-EI Component 07",
          interpretation: "Clinical data are used as a bridge between laboratory records, epidemiological meaning and decision-support tools.",
          evidence: "Clinical datasets, HIV/AIDS incidence forecasting, model files, Streamlit dashboards and reproducible scripts.",
          output: "Interfaces and summaries that help clinicians, public-health teams and researchers inspect the same evidence."
        }
      ]
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

{% include nav-v3.html %}

<main id="main-content">

<section id="hero" class="home-hero min-h-screen pt-36 pb-20 flex flex-col justify-center items-center px-6 relative overflow-hidden" data-nav-marker="00" data-nav-label="Top" data-nav-colour="#22D3EE">
  <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    <div class="absolute inset-0 graded-hero-overlay"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/90 dark:from-slate-950/95 dark:via-slate-950/75 dark:to-slate-950/95"></div>
  </div>

  <div class="home-hero__main max-w-[1800px] mx-auto w-full grid lg:grid-cols-12 gap-x-8 gap-y-12 items-center relative z-10 px-2 lg:px-4">
    <div class="home-hero__content lg:col-span-7 reveal text-left min-w-0 w-full">
      <div class="home-hero__availability inline-flex max-w-full flex-wrap items-center gap-2.5 px-4 py-1.5 border border-slate-300 dark:border-slate-700 rounded-full text-xs font-mono font-semibold tracking-wider mb-6 bg-white/70 dark:bg-slate-900/70 shadow-sm backdrop-blur-md">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold">OPEN TO RESEARCH COLLABORATION &amp; ADVISORY</span>
        <span class="text-slate-300 dark:text-slate-700">|</span>
        <span class="text-slate-600 dark:text-slate-300">ACCRA, GHANA</span>
      </div>

      <div class="home-hero__credentials flex flex-wrap items-center gap-3 mb-4 text-xs font-mono font-bold text-slate-300" aria-label="Professional registrations and memberships">
        <span class="home-hero__identity-label">{{ site.data.profile.name | upcase }}</span>
        <span>&bull;</span>
        <span class="px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">MLS (CORU)</span>
        <span class="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">ACSLM</span>
        <span class="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">AHPC</span>
        <span class="px-2.5 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">FRSPH</span>
        <span class="px-2.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">VvE</span>
      </div>

      <p class="home-hero__role home-hero__identity-label mb-4 break-words" aria-hidden="true">
        <span data-typed-text data-words="{{ site.data.profile.job_titles | jsonify | escape }}"></span><span class="typed-cursor"></span>
      </p>
      <span class="sr-only">Principal Biomedical Scientist, epidemiologist and public health researcher</span>

      <h1 class="home-hero__title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight leading-[1.05] mb-6 text-white max-w-full">
        I turn scattered field data into <br class="hidden sm:inline">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-400">the pattern that stops an outbreak</span>
      </h1>

      <p class="home-hero__summary text-lg sm:text-xl font-light text-slate-300 max-w-2xl leading-relaxed mb-8">
        {{ site.data.profile.description | strip_newlines }}
      </p>

      <div class="home-hero__actions flex flex-wrap items-center gap-4 mb-10">
        <a href="#fieldmap" class="magnetic-btn px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-lg hover:shadow-xl hover:shadow-cyan-500/25 transition-all hover:scale-105 flex items-center gap-2" style="transform: translate(var(--mx, 0px), var(--my, 0px))">
          <i class="fa-solid fa-chart-area text-sm"></i> Explore District Data
        </a>
        <a href="{{ '/map/' | relative_url }}" class="magnetic-btn px-7 py-3.5 glass-card text-slate-800 dark:text-slate-200 font-black text-xs uppercase tracking-widest rounded-lg hover:border-cyan-500 transition-all flex items-center gap-2" style="transform: translate(var(--mx, 0px), var(--my, 0px))">
          <i class="fa-solid fa-map-location-dot text-cyan-500"></i> Surveillance Map
        </a>
      </div>

      <div class="home-hero__profiles pt-6 border-t border-white/15 flex flex-wrap items-center gap-3 text-xs font-mono">
        <span class="text-slate-400 font-semibold uppercase text-[11px] tracking-wider">Research Profiles</span>
        <a href="{{ site.data.profile.identifiers[1].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-brands fa-orcid"></i> ORCID
        </a>
        <a href="{{ site.data.profile.identifiers[3].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-full hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-graduation-cap"></i> Google Scholar
        </a>
        <a href="{{ site.data.profile.identifiers[4].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full hover:bg-amber-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-magnifying-glass"></i> Web of Science
        </a>
        <a href="{{ site.data.profile.identifiers[5].url }}" target="_blank" rel="noopener" class="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 rounded-full hover:bg-violet-500/20 transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-id-card-clip"></i> SciProfiles
        </a>
      </div>
    </div>

    <div class="home-hero__portrait lg:col-span-5 reveal relative flex flex-col items-center lg:items-end lg:self-end h-[420px] sm:h-[600px] lg:h-[78vh] lg:min-h-[600px] lg:max-h-[860px] w-full min-w-0">
      <div class="home-hero__portrait-frame flex-1 min-h-0 w-full flex items-end justify-center lg:justify-end">
        <img src="{{ '/assets/img/gallery/portraits/hero-green-shirt-cutout.png' | relative_url }}"
             alt="Portrait of Valentine Golden Ghanem, Principal Biomedical Scientist, epidemiologist and public health researcher"
             class="h-full w-auto max-w-full lg:max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(6,182,212,0.25)]">
      </div>
      <div class="home-hero__workplace mt-4 flex items-center gap-2.5 px-4 py-2 glass-card rounded-full border border-cyan-500/30 text-xs font-mono backdrop-blur-xl shadow-2xl whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="text-slate-700 dark:text-slate-200 font-semibold">{{ site.data.organization.cocoa_clinic.name }}, {{ site.data.organization.cocoa_clinic.parent_organization.name }}</span>
      </div>
    </div>
  </div>

  <div class="w-full max-w-6xl mx-auto mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 reveal relative z-10">
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <div class="text-3xl lg:text-4xl font-black font-heading text-violet-500" data-target="3" data-suffix="">0</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Peer-Reviewed Publications</div>
      </div>
      <div class="p-4 glass-card rounded-2xl text-center">
        <div class="text-3xl lg:text-4xl font-black font-heading text-red-500" data-target="2" data-suffix="">0</div>
        <div class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">Preprints</div>
      </div>
    </div>
  </div>
</section>

<section id="about" class="py-32 px-6 relative" data-nav-marker="01" data-nav-label="Identity" data-nav-colour="#22D3EE">
  <div class="max-w-[1600px] mx-auto">
    <div class="reveal text-center max-w-3xl mx-auto mb-16">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">01</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-4">01 &mdash; Identity &amp; Evolution</h2>
        <h3 class="text-4xl sm:text-5xl font-black font-heading">Dual Precision: Clinical Lab + Data Science</h3>
      </div>
      <p class="text-slate-600 dark:text-slate-400 mt-4 text-base">Valentine Golden Ghanem combines quality-assured laboratory practice with spatial epidemiology and machine learning to strengthen disease surveillance. Further detail is available on the <a href="{{ '/about/' | relative_url }}" class="text-cyan-500 hover:underline">About page</a>.</p>
    </div>
    <div class="reveal glass-card home-identity-panel rounded-[32px] p-6 sm:p-10 border">
      <div class="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
        <div class="home-identity-rail rounded-[28px] p-6 sm:p-8 relative overflow-hidden">
          <div class="relative z-10">
            <p class="font-mono text-[10px] uppercase tracking-[0.34em] text-cyan-500 font-black mb-5">Clinical science. Public health intelligence.</p>
            <h4 class="text-2xl sm:text-3xl font-black font-heading text-slate-950 dark:text-white leading-tight">A medical scientist translating laboratory evidence into population action.</h4>
            <p class="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Valentine Golden Ghanem's work spans clinical laboratory leadership, field epidemiology, Ghana district analysis and applied data science. He applies diagnostic quality, infectious-disease surveillance, spatial analysis and machine-learning models to practical public-health decisions.</p>
            <div class="mt-7 grid gap-3">
              <div class="home-identity-chip" data-accent="cyan"><i class="fa-solid fa-vial-virus"></i><span>Clinical laboratory leadership</span></div>
              <div class="home-identity-chip" data-accent="emerald"><i class="fa-solid fa-people-group"></i><span>Public health epidemiology and surveillance</span></div>
              <div class="home-identity-chip" data-accent="violet"><i class="fa-solid fa-location-dot"></i><span>Spatial analytics, GIS, and machine learning</span></div>
            </div>
          </div>
        </div>
        <a href="{{ '/about/' | relative_url }}" class="inline-flex min-h-[48px] items-center justify-center gap-3 rounded-xl border border-cyan-400/40 px-6 py-3 text-xs font-black uppercase tracking-wider text-cyan-500 transition hover:border-cyan-400 hover:bg-cyan-400/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400">View professional profile <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
      </div>
    </div>
  </div>
</section>

<section id="research" class="home-expertise-section py-32 bg-slate-900 text-white relative overflow-hidden" data-nav-marker="02" data-nav-label="Expertise" data-nav-colour="#FBBF24">
  <div class="blob w-[500px] h-[500px] bg-amber-500/10 top-0 right-0 pointer-events-none"></div>
  <div class="home-expertise-section__inner max-w-[1600px] mx-auto px-6">
    <div class="home-expertise-section__header text-center mb-20 reveal">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">02</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-400 mb-4">02 &mdash; Expertise</h2>
        <h3 class="text-4xl sm:text-5xl font-black font-heading">Multidisciplinary Practice Matrix</h3>
      </div>
      <p class="text-slate-400 mt-3 text-sm">Relative emphasis across clinical practice, public-health work, spatial analytics and applied modelling. These values are not proficiency scores.</p>
      <details class="home-expertise-method mt-5 text-left text-xs text-slate-300">
        <summary class="cursor-pointer font-mono font-bold uppercase tracking-wider text-amber-300">How the portfolio-emphasis index is calculated</summary>
        <p class="mt-3 leading-relaxed">Each domain is coded against the documented portfolio: breadth of practice statements (40%), evidence of repeated application (35%) and publicly inspectable methods or artifacts (25%). The resulting 0&ndash;100 index describes the relative distribution of evidence within this website; it does not measure professional competence.</p>
      </details>
    </div>
    <div class="home-expertise-layout grid lg:grid-cols-12 gap-12 items-start">
      <div class="home-expertise-radar-column lg:col-span-6 reveal">
        <div class="home-radar-card glass-card bg-slate-800/60 p-6 rounded-3xl border border-slate-700 relative">
          <div class="home-radar-plot">
            <canvas id="radarChart" aria-label="Radar chart showing Valentine Golden Ghanem's relative emphasis across laboratory quality, public health, surveillance, spatial GIS, predictive modelling, quality systems and clinical data"></canvas>
          </div>
          <div id="radarLegend" class="home-radar-legend" aria-label="Interactive radar component legend">
            <button type="button" class="home-radar-legend__item is-active" data-radar-index="0" style="--legend-color:#22D3EE" aria-pressed="true"><i></i><b>01 Lab Quality</b><em>92</em></button>
            <button type="button" class="home-radar-legend__item" data-radar-index="1" style="--legend-color:#34D399" aria-pressed="false"><i></i><b>02 Public Health</b><em>90</em></button>
            <button type="button" class="home-radar-legend__item" data-radar-index="2" style="--legend-color:#FBBF24" aria-pressed="false"><i></i><b>03 Surveillance</b><em>88</em></button>
            <button type="button" class="home-radar-legend__item" data-radar-index="3" style="--legend-color:#8B5CF6" aria-pressed="false"><i></i><b>04 Spatial GIS</b><em>88</em></button>
            <button type="button" class="home-radar-legend__item" data-radar-index="4" style="--legend-color:#EF4444" aria-pressed="false"><i></i><b>05 Predictive ML</b><em>86</em></button>
            <button type="button" class="home-radar-legend__item" data-radar-index="5" style="--legend-color:#14B8A6" aria-pressed="false"><i></i><b>06 Quality Systems</b><em>89</em></button>
            <button type="button" class="home-radar-legend__item" data-radar-index="6" style="--legend-color:#A78BFA" aria-pressed="false"><i></i><b>07 Clinical Data</b><em>84</em></button>
          </div>
          <div class="home-radar-inspector" id="radarInspector" aria-live="polite">
            <div>
              <span class="home-radar-inspector__kicker" id="radarInspectorEngine">HI-EI Component 01</span>
              <h4 id="radarInspectorTitle">Lab Quality</h4>
              <p id="radarInspectorBody">Diagnostic accuracy, workflow discipline, quality control and audit-ready laboratory practice anchor the clinical side of the portfolio.</p>
            </div>
            <div class="home-radar-inspector__grid">
              <span><b id="radarInspectorScore">92</b><em>Relative emphasis</em></span>
              <span><b id="radarInspectorDomain">Clinical laboratory operations</b><em>Domain</em></span>
            </div>
            <p class="home-radar-inspector__note"><b>Evidence base:</b> <span id="radarInspectorEvidence">Clinical chemistry, haematology, microbiology-aware diagnostics, GeneXpert and real-time PCR workflows.</span></p>
            <p class="home-radar-inspector__note"><b>Output:</b> <span id="radarInspectorOutput">Reliable laboratory evidence that can move into surveillance, programme decisions and quality-improvement cycles.</span></p>
          </div>
          <p class="mt-4 text-[11px] leading-relaxed text-slate-400 font-mono">The radar shows relative emphasis across Valentine Golden Ghanem's current work. It is not a proficiency score.</p>
        </div>
      </div>
      <div class="home-expertise-cards lg:col-span-6 reveal grid sm:grid-cols-2 gap-5">
        <article class="home-expertise-card is-active p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-cyan-400 transition-all" data-radar-index="0" tabindex="0" role="button" aria-label="Inspect Clinical Laboratory and Quality Leadership in the radar">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">01</div>
            <h4 class="text-xl font-bold font-heading">Clinical Laboratory &amp; Quality Leadership</h4>
          </div>
          <p class="text-sm leading-relaxed text-slate-200 sm:pl-14">Clinical laboratory practice grounded in diagnostic accuracy, workflow discipline, and quality-managed service delivery.</p>
          <div class="home-expertise-card__body sm:pl-14">
            <span><b>Practice base</b> Clinical chemistry, haematology, microbiology-aware diagnostics, GeneXpert and real-time PCR workflows.</span>
            <span><b>Quality frame</b> ISO 15189 thinking, internal quality control, external quality assurance and audit-ready documentation.</span>
            <span><b>Operational output</b> High-throughput laboratory coordination, result integrity, biosafety awareness and service-improvement decisions.</span>
          </div>
        </article>
        <article class="home-expertise-card p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-emerald-400 transition-all" data-radar-index="1" tabindex="0" role="button" aria-label="Inspect Public Health Epidemiology and Surveillance in the radar">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">02</div>
            <h4 class="text-xl font-bold font-heading">Public Health Epidemiology &amp; Surveillance</h4>
          </div>
          <p class="text-sm leading-relaxed text-slate-200 sm:pl-14">Public-health work framed around disease prevention, early signal recognition, community reach and practical response planning.</p>
          <div class="home-expertise-card__body sm:pl-14">
            <span><b>Core domains</b> Communicable-disease epidemiology, screening outreach, outbreak intelligence and health-systems strengthening.</span>
            <span><b>Programme lens</b> Vaccination coverage, WASH context, service access, field realities and vulnerable-population considerations.</span>
            <span><b>Decision output</b> Surveillance summaries that help teams move from observation to targeted sampling, escalation or outreach.</span>
          </div>
        </article>
        <article class="home-expertise-card p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-violet-400 transition-all" data-radar-index="3" tabindex="0" role="button" aria-label="Inspect Spatial Epidemiology and Ghana District Analytics in the radar">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-lg">03</div>
            <h4 class="text-xl font-bold font-heading">Spatial Epidemiology &amp; Ghana District Analytics</h4>
          </div>
          <p class="text-sm leading-relaxed text-slate-200 sm:pl-14">Spatial intelligence that treats place as evidence, especially where district patterns reveal inequity, clustering or service gaps.</p>
          <div class="home-expertise-card__body sm:pl-14">
            <span><b>Methods</b> Moran's I, bivariate LISA, choropleth mapping, district centroids and field-activity geocoding.</span>
            <span><b>Geography</b> Ghana's 261-district administrative structure, regional comparisons and district-level public-health interpretation.</span>
            <span><b>Tools</b> ArcGIS, Folium, GeoJSON, Python mapping workflows and interactive map interfaces.</span>
          </div>
        </article>
        <article class="home-expertise-card p-6 glass-card bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-amber-400 transition-all" data-radar-index="4" tabindex="0" role="button" aria-label="Inspect Data Science, Modelling and Decision Dashboards in the radar">
          <div class="flex items-center gap-4 mb-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">04</div>
            <h4 class="text-xl font-bold font-heading">Data Science, Modelling &amp; Decision Dashboards</h4>
          </div>
          <p class="text-sm leading-relaxed text-slate-200 sm:pl-14">Applied modelling and dashboard design that produce interpretable, reproducible and inspectable health evidence.</p>
          <div class="home-expertise-card__body sm:pl-14">
            <span><b>Modelling stack</b> Python, R, Random Forest, Ridge Regression, XGBoost, SVR and SHAP explainability.</span>
            <span><b>Research signal</b> HIV/AIDS incidence forecasting, spatial risk interpretation and clinical/public-health data synthesis.</span>
            <span><b>Interface output</b> Streamlit dashboards, model files, reproducible scripts and interactive decision-support artifacts.</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>

<section id="fieldmap" class="district-intelligence-section py-32 px-6 relative" data-nav-marker="03" data-nav-label="Atlas" data-nav-colour="#A78BFA">
  <div class="max-w-[1600px] mx-auto">
    <div class="reveal text-center max-w-4xl mx-auto mb-12">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">03</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-4">03 &mdash; Spatial Intelligence</h2>
        <h3 class="text-4xl sm:text-5xl font-black font-heading">Ghana Health Intelligence Atlas</h3>
      </div>
      <p class="text-slate-600 dark:text-slate-400 mt-4">Move between Ghana's 16 regions and 261 districts to compare population context, social determinants, health-service coverage and selected outcomes represented in Valentine Golden Ghanem's research repositories. A map selection immediately updates the evidence card.</p>
    </div>

    <div id="ghanaDistrictExplorer"
         class="district-explorer reveal"
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
        <p class="district-map-source">Rendered by the site's bespoke HI-EI ECharts engine from 16 dissolved regional boundaries, 261 district boundaries and seven canonical 261-row tables selected from a 53-file master-CSV inventory. The live card separates demographics and structural determinants; insurance and education; SDG, WASH, services and outcomes; nutrition and anaemia; maternal health; immunisation; and ranked structural vulnerability. Regional values are population-weighted summaries and describe geographic context, not individual risk.</p>
      </div>

      <aside class="district-inspector" aria-labelledby="inspectorDistrictName">
        <header>
          <div class="district-inspector-heading">
            <span class="district-map-kicker" id="inspectorKicker"><i class="fa-solid fa-crosshairs" aria-hidden="true"></i> Regional evidence card</span>
            <span class="district-signal-badge" id="inspectorSignal">Assessing regional signal</span>
          </div>
          <h4 id="inspectorDistrictName">Loading regional atlas</h4>
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
          <a href="{{ '/map/' | relative_url }}">Open the full Field Map <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          <button type="button" id="districtCopySummary"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copy regional summary</button>
        </div>
      </aside>
    </div>
  </div>
</section>

<section id="publications" class="home-academic-section py-32 px-6 border-t" data-nav-marker="04" data-nav-label="Research" data-nav-colour="#F87171">
  <div class="max-w-[1600px] mx-auto">
    <header class="home-section-heading reveal">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">04</span>
        <h2>04 &mdash; Academic Repository</h2>
        <h3>Publications &amp; Preprints</h3>
      </div>
      <p>Six connected records: three peer-reviewed articles, two active preprints and one citable data-and-software deposit. Each record keeps its scholarly status, source and limitations visible.</p>
    </header>

    <dl class="academic-counts reveal" aria-label="Academic record summary">
      <div><dt>Peer-reviewed</dt><dd>3</dd><span>journal articles</span></div>
      <div><dt>Preprints</dt><dd>2</dd><span>under review or awaiting review</span></div>
      <div><dt>Data + software</dt><dd>1</dd><span>citable repository record</span></div>
    </dl>

    <div class="academic-repository reveal" data-academic-repository>
      <nav class="academic-record-list" role="tablist" aria-label="Select a scholarly record">
        <div class="academic-pane-label">Research record</div>
        {% for pub in site.data.publications %}
        <button type="button"
                role="tab"
                aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
                tabindex="{% if forloop.first %}0{% else %}-1{% endif %}"
                data-academic-index="{{ forloop.index0 }}"
                class="{% if forloop.first %}is-active{% endif %}">
          <span>{{ forloop.index | prepend: "0" | slice: -2, 2 }}</span>
          <b>{{ pub.status }}</b>
          <strong>{{ pub.title }}</strong>
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </button>
        {% endfor %}
      </nav>

      <article class="academic-record-detail" role="tabpanel" aria-live="polite">
        <div class="academic-record-meta">
          <span id="academicStatus" class="academic-status academic-status--peer_reviewed">Peer-reviewed</span>
          <span id="academicSource">Cureus &middot; 2026</span>
        </div>
        <h4 id="academicTitle">{{ site.data.publications[0].title }}</h4>
        <p id="academicSummary">{{ site.data.publications[0].summary }}</p>
        <div id="academicMethods" class="academic-methods" aria-label="Methods">
          {% for method in site.data.publications[0].methods %}<span>{{ method }}</span>{% endfor %}
        </div>
        <div class="academic-caveat">
          <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
          <p id="academicCaveat">{{ site.data.publications[0].caveat }}</p>
        </div>
        <div id="academicLinks" class="academic-actions">
          <a href="{{ site.data.publications[0].doi_url }}" target="_blank" rel="noopener"><i class="fa-solid fa-book-open" aria-hidden="true"></i> Open DOI</a>
          <button type="button" id="academicCopyCitation"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copy citation</button>
        </div>
      </article>

      <aside class="academic-provenance">
        <div class="academic-pane-label">Record interpretation</div>
        <div class="academic-provenance-mark" aria-hidden="true"><i class="fa-solid fa-fingerprint"></i></div>
        <h4>Paper, method and artifact remain distinct.</h4>
        <p>Peer review, preprint status and software deposits are not interchangeable. This reader preserves those boundaries while showing how the scholarly and technical records connect.</p>
        <a href="{{ '/publications/' | relative_url }}">Open the complete academic record <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
      </aside>
    </div>
  </div>
</section>

<section id="portfolio" class="home-portfolio-section py-32 px-6" data-nav-marker="05" data-nav-label="Portfolio" data-nav-colour="#34D399">
  <div class="max-w-[1600px] mx-auto">
    <header class="home-section-heading home-section-heading--split reveal">
      <div>
        <div class="section__ghost-wrap">
          <span class="section__ghost-num">05</span>
          <h2>05 &mdash; Portfolio</h2>
          <h3>Selected Projects &amp; Models</h3>
        </div>
        <p>Open the systems behind the research: reproducible pipelines, Ghana district models, source-provenance audits and interactive dashboards.</p>
      </div>
      <div class="artifact-filters" role="group" aria-label="Filter featured artifacts">
        <button type="button" class="is-active" data-artifact-filter="all">All systems</button>
        <button type="button" data-artifact-filter="Spatial epidemiology">Spatial</button>
        <button type="button" data-artifact-filter="Health equity">Equity</button>
        <button type="button" data-artifact-filter="Forecasting">Forecasting</button>
      </div>
    </header>

    <div class="artifact-workbench reveal" data-artifact-workbench>
      <div class="artifact-catalogue" id="artifactCatalogue" aria-live="polite"></div>
      <aside class="artifact-inspector" aria-live="polite">
        <div class="artifact-inspector__topline">
          <span id="artifactDomain">Maternal health</span>
          <span id="artifactStatus">Preprint and reproducible analysis</span>
        </div>
        <div class="artifact-inspector__icon"><i id="artifactIcon" class="fa-solid fa-person-pregnant" aria-hidden="true"></i></div>
        <h4 id="artifactTitle">Antenatal Care and Fertility Inequities</h4>
        <p id="artifactSummary">{{ site.data.home_artifacts[0].summary }}</p>
        <div class="artifact-evidence">
          <span>What the repository demonstrates</span>
          <p id="artifactEvidence">{{ site.data.home_artifacts[0].evidence }}</p>
        </div>
        <div id="artifactMethods" class="artifact-methods">
          {% for method in site.data.home_artifacts[0].methods %}<span>{{ method }}</span>{% endfor %}
        </div>
        <div id="artifactActions" class="artifact-actions"></div>
      </aside>
    </div>
    <a class="home-section-link reveal" href="{{ '/portfolio/' | relative_url }}">Browse the complete portfolio <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
  </div>
</section>

{% assign operation_lead = site.data.gallery_portraits[2] %}
{% assign operation_lis = site.data.gallery_portraits[4] %}
{% assign operation_biosafety = site.data.gallery_portraits[10] %}
{% assign operation_data = site.data.gallery_portraits[13] %}
<section id="gallery" class="home-operations-section py-32 px-6 border-t" data-nav-marker="06" data-nav-label="Fieldwork" data-nav-colour="#22D3EE">
  <div class="max-w-[1600px] mx-auto">
    <header class="home-section-heading home-section-heading--split reveal">
      <div>
        <div class="section__ghost-wrap">
          <span class="section__ghost-num">06</span>
          <h2>06 &mdash; Field &amp; Diagnostic Operations</h2>
          <h3>A Look Behind the Work</h3>
        </div>
        <p>Clinical evidence is built through people, instruments and disciplined workflows. These scenes connect outreach coordination, laboratory practice and data review without duplicating the full Gallery.</p>
      </div>
      <a href="{{ '/gallery/' | relative_url }}">Open all 26 photographs <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
    </header>

    <div class="operations-stage reveal">
      <button type="button"
              class="operations-lead"
              data-operation-lightbox
              data-lightbox-img="{{ operation_lead.url | relative_url }}"
              data-lightbox-title="Field coordination"
              data-lightbox-desc="{{ operation_lead.caption | escape }}"
              aria-label="Open field coordination photograph of Valentine Golden Ghanem">
        <img src="{{ operation_lead.url | relative_url }}" alt="{{ operation_lead.caption }} Valentine Golden Ghanem." loading="lazy">
        <span class="operations-image-label"><b>01</b> Field coordination</span>
      </button>
      <aside class="operations-brief">
        <span class="academic-pane-label">Operational continuum</span>
        <h4>From specimen quality to population response.</h4>
        <p>Valentine Golden Ghanem's work connects laboratory evidence with the practical decisions that follow: quality checks, team communication, surveillance interpretation and targeted public-health action.</p>
        <dl>
          <div><dt>Diagnostic practice</dt><dd>Quality-controlled workflows, biosafety and traceable laboratory records.</dd></div>
          <div><dt>Field coordination</dt><dd>Screening, outreach and clear communication across clinical and community teams.</dd></div>
          <div><dt>Data interpretation</dt><dd>Clinical and spatial signals presented as evidence that can be reviewed and acted upon.</dd></div>
        </dl>
      </aside>
    </div>

    <div class="operations-strip reveal">
      <button type="button" data-operation-lightbox data-lightbox-img="{{ operation_biosafety.url | relative_url }}" data-lightbox-title="Diagnostic practice" data-lightbox-desc="{{ operation_biosafety.caption | escape }}" aria-label="Open diagnostic practice photograph of Valentine Golden Ghanem">
        <span class="operations-image-wrap"><img src="{{ operation_biosafety.url | relative_url }}" alt="{{ operation_biosafety.caption }} Valentine Golden Ghanem." loading="lazy"></span>
        <span><b>02</b><strong>Diagnostic practice</strong><small>{{ operation_biosafety.caption }}</small></span>
      </button>
      <button type="button" data-operation-lightbox data-lightbox-img="{{ operation_lis.url | relative_url }}" data-lightbox-title="Laboratory information workflow" data-lightbox-desc="{{ operation_lis.caption | escape }}" aria-label="Open laboratory information workflow photograph of Valentine Golden Ghanem">
        <span class="operations-image-wrap"><img src="{{ operation_lis.url | relative_url }}" alt="{{ operation_lis.caption }} Valentine Golden Ghanem." loading="lazy"></span>
        <span><b>03</b><strong>Laboratory information workflow</strong><small>{{ operation_lis.caption }}</small></span>
      </button>
      <button type="button" data-operation-lightbox data-lightbox-img="{{ operation_data.url | relative_url }}" data-lightbox-title="Epidemiological data review" data-lightbox-desc="{{ operation_data.caption | escape }}" aria-label="Open epidemiological data review photograph of Valentine Golden Ghanem">
        <span class="operations-image-wrap"><img src="{{ operation_data.url | relative_url }}" alt="{{ operation_data.caption }} Valentine Golden Ghanem." loading="lazy"></span>
        <span><b>04</b><strong>Epidemiological data review</strong><small>{{ operation_data.caption }}</small></span>
      </button>
    </div>
  </div>
</section>

</main>

{% include footer-v3.html %}
