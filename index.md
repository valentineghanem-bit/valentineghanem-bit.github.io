---
layout: default
permalink: /
jsonld: home
title: "Medical Scientist and Epidemiologist"
description: "Official website of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
---

{%- assign msph = site.data.profile.credentials | where_exp: "c", "c.name contains 'Public Health'" | first -%}
{%- assign mds = site.data.profile.credentials | where_exp: "c", "c.name contains 'Data Science'" | first -%}
{%- assign hero_caption_pairs = "" | split: "," -%}
{%- for item in site.data.gallery_portraits -%}
  {%- assign parts = item.url | split: "/" -%}
  {%- assign fname = parts | last | replace: ".jpg", "" -%}
  {%- assign pair = fname | append: "|||" | append: item.caption | append: "|||" | append: item.year | append: "|||" | append: item.location | append: "|||" | append: item.url -%}
  {%- assign hero_caption_pairs = hero_caption_pairs | push: pair -%}
{%- endfor -%}

<section class="hero-v2">
  <div class="hero-v2__photo-caption" id="hero-v2-photo-caption" aria-hidden="true">
    <div class="hero-v2__photo-caption-imgwrap"><img class="hero-v2__photo-caption-img" alt=""></div>
    <p class="hero-v2__photo-caption-text"></p>
    <p class="hero-v2__photo-caption-meta"></p>
  </div>

  <!-- Full-bleed ambient layers (back to front): the helix "data-node web"
       canvas spans the whole hero now, not just a bounded frame -- the
       kinetic/geometric motif the alternate-hero brief asked for on the
       left, where the text sits. A theme-adaptive scrim (uses --v2-void,
       so it holds across all 4 themes) sits between the canvas and the
       real content row to guarantee text contrast regardless of what the
       canvas is doing behind it -- the same non-negotiable this hero's
       text/photo overlap fix already established, just re-applied to a
       new layer. -->
  <canvas class="hero-v2__canvas" aria-hidden="true"></canvas>
  <div class="hero-v2__scrim" aria-hidden="true"></div>
  <div class="hero-v2__block" aria-hidden="true"></div>
  <span class="hero-v2__spark hero-v2__spark--a" aria-hidden="true"></span>
  <span class="hero-v2__spark hero-v2__spark--b" aria-hidden="true"></span>
  <span class="hero-v2__spark hero-v2__spark--c" aria-hidden="true"></span>
  <span class="hero-v2__spark hero-v2__spark--d" aria-hidden="true"></span>
  <span class="hero-v2__spark hero-v2__spark--e" aria-hidden="true"></span>
  <span class="hero-v2__spark hero-v2__spark--f" aria-hidden="true"></span>
  <span class="hero-v2__spark hero-v2__spark--g" aria-hidden="true"></span>

  <div class="hero-v2__row">
  <div class="hero-v2__content">
    <p class="hero-v2__eyebrow">Accra, Ghana &nbsp;·&nbsp; 5.6037° N, 0.1870° W — Field Epidemiology</p>

    <h1 class="hero-v2__name">
      {%- assign name_words = site.data.profile.name | split: " " -%}
      {%- for w in name_words -%}
      <span class="ln"><span class="rise" data-word>{{ w }}</span></span>
      {%- endfor -%}
    </h1>

    <p class="hero-v2__typed" aria-hidden="true"><span class="hero-v2__typed-text" data-typed-text data-words="{{ site.data.profile.job_titles | jsonify | escape }}"></span><span class="hero-v2__typed-cursor"></span></p>

    <blockquote class="hero-v2__mission-frame">
      <p class="hero-v2__mission">I turn scattered field data into <span class="accent">the pattern that stops an outbreak</span> before it spreads.</p>
    </blockquote>

    <p class="hero-v2__role"><strong>{{ site.data.profile.job_titles[0] }}</strong> — {{ site.data.organization.cocoa_clinic.name }}, {{ site.data.organization.cocoa_clinic.parent_organization.name }}</p>

    <div class="hero-v2__panels">
      {%- for m in site.data.profile.memberships -%}
        {%- if m.reg_no -%}
        <div class="hero-v2__panel"><span class="dot"></span><strong>{{ m.abbreviation }}</strong>&nbsp;{{ m.reg_no }}</div>
        {%- endif -%}
      {%- endfor -%}
      <div class="hero-v2__panel"><span class="dot"></span>{{ msph.name | replace: "Master of Science in ", "M.S. " }} · {{ mds.name | replace: "Master of Science in ", "M.S. " }}</div>
    </div>

    <div class="hero-v2__ctas">
      <a class="hero-v2__btn hero-v2__btn--primary" href="{{ '/map/' | relative_url }}">See the Surveillance Map →</a>
      <a class="hero-v2__btn hero-v2__btn--ghost" href="{{ '/publications/' | relative_url }}">Read the Publications</a>
      <span class="hero-v2__blink" aria-hidden="true"></span>
    </div>

    <a href="{{ '/gallery/' | relative_url }}" class="hero-v2__a11y-link">The {{ site.data.gallery_portraits | size }} photographs behind this scene — view the full story in Gallery →</a>
  </div>

  <!-- The alternate hero: a real portrait, right-anchored, shown at full
       opacity against the hero's own gradient (round 20: removed the
       earlier left-edge fade into the helix canvas per direct feedback) --
       replacing the even earlier bounded photo-network frame the user
       found "distasteful". Background genuinely removed (rembg) and
       colour-enhanced, kept in full colour. A hard flex-gap keeps this
       clear of the text column at every width. Hidden below 960px -- the
       ambient canvas alone carries the motif on narrow screens, where
       there's no safe room for a side portrait. -->
  <div class="hero-v2__portrait">
    <img class="hero-v2__portrait-img" src="{{ '/assets/img/gallery/portraits/hero-portrait-isolated.png' | relative_url }}" alt="{{ site.data.profile.name }}">
    <div class="hero-v2__badge">Field record since 2013</div>
  </div>
  </div>

  <div class="hero-v2__scroll-cue" aria-hidden="true"><div class="track"></div>Scroll</div>
</section>

<script>
  window.VG_HERO_CAPTIONS = (function () {
    var pairs = {{ hero_caption_pairs | jsonify }};
    // Each entry: { caption, year, location, src } -- year/location are
    // deliberately blank until real per-photo data is supplied (no EXIF date/
    // GPS survives in these files, and the data source has no such fields
    // yet -- not guessing at real biographical facts). The caption card
    // renders them only when present, so this fills in later with zero
    // template changes.
    var out = {
      "portrait-cocobod-square": { caption: "Ghana COCOBOD anniversary portrait.", year: "", location: "", src: "/assets/img/knowledge-panel/portrait-cocobod-square.jpg" },
      "portrait-desk-square": { caption: "At his desk.", year: "", location: "", src: "/assets/img/knowledge-panel/portrait-desk-square.jpg" },
      "portrait-studio-square": { caption: "Studio portrait.", year: "", location: "", src: "/assets/img/knowledge-panel/portrait-studio-square.jpg" },
      "portrait-venue-square": { caption: "Portrait at a professional venue.", year: "", location: "", src: "/assets/img/knowledge-panel/portrait-venue-square.jpg" }
    };
    pairs.forEach(function (p) {
      var parts = p.split('|||');
      out[parts[0]] = { caption: parts[1] || "", year: parts[2] || "", location: parts[3] || "", src: parts[4] || "" };
    });
    return out;
  })();
</script>
<script type="module" src="{{ '/assets/js/hero-scene.js' | relative_url }}"></script>
<script src="{{ '/assets/js/hero-text-fx.js' | relative_url }}" defer></script>

<div class="home-v2 v2-scope">
<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    {% for topic in site.data.profile.knows_about %}<span class="marquee__item">{{ topic }}</span>{% endfor %}
    {% for topic in site.data.profile.knows_about %}<span class="marquee__item">{{ topic }}</span>{% endfor %}
  </div>
</div>

<section class="home-v2__stat-band wrap" data-reveal aria-label="Career highlights in numbers">
  <div class="stat-strip">
    <div class="stat">
      <span class="stat__number" data-target="11" data-suffix="+">0</span>
      <span class="stat__label">Years in clinical &amp; public health practice</span>
    </div>
    <div class="stat">
      <span class="stat__number" data-target="5000" data-suffix="+">0</span>
      <span class="stat__label">Individuals screened in community outreach</span>
    </div>
    <div class="stat">
      <span class="stat__number" data-target="1000" data-suffix="+">0</span>
      <span class="stat__label">Diagnostic tests overseen daily</span>
    </div>
    <div class="stat">
      <span class="stat__number" data-target="5" data-suffix="">0</span>
      <span class="stat__label">Peer-reviewed publications</span>
    </div>
  </div>
</section>

<section class="section wrap home-v2__prose" data-reveal>
  <span class="section__ghost-num" aria-hidden="true">01</span>
  <h2 class="section__title"><span class="section__index">01</span> Professional snapshot</h2>
  <p class="section__subtitle">Valentine Golden Ghanem, MSc, MSPH, MLS (CORU), FRSPH</p>

  <p>
    <strong>Clinical leadership &amp; public health impact.</strong>
    Valentine Golden Ghanem is a Principal Medical Scientist with over a decade of
    experience spanning clinical diagnostics and public health systems. He leads
    high-volume laboratory operations at Cocoa Clinic, overseeing more than 1,000
    diagnostic tests daily across multiple disciplines. His work extends beyond the
    laboratory into community health, where he has coordinated large-scale outreach
    initiatives, delivering screening services to over 5,000 individuals in
    underserved populations and contributing to the surveillance and control of
    conditions such as malaria and hypertension.
  </p>

  <p>
    <strong>Academic &amp; interdisciplinary expertise.</strong>
    He holds a Master of Science in Data Science from the University of East London
    and a Master of Public Health from the University of Suffolk. Building on this
    interdisciplinary foundation, he is currently pursuing a Master of Laws (LL.M.)
    in International Law at Liverpool John Moores University, integrating legal
    frameworks with epidemiology, data science, and global health governance.
  </p>

  <p>
    <strong>Data science &amp; health systems innovation.</strong>
    Valentine's work sits at the intersection of laboratory medicine and advanced
    analytics. He applies machine learning techniques, including XGBoost, Random
    Forest, and explainable AI tools such as SHAP, alongside geospatial analysis
    methods using QGIS and spatial statistics (LISA) to model disease patterns,
    forecast health trends, and strengthen data-driven decision-making within
    national health systems.
  </p>

  <p>
    <strong>Professional recognition &amp; contributions.</strong>
    He is dual-licensed as a Medical Scientist in Ghana and Ireland, registered with
    the Allied Health Professions Council (AHPC) and CORU. He is a Fellow of the
    Royal Society for Public Health (FRSPH) and an active member of the Academy of
    Clinical Science and Laboratory Medicine (ACSLM), the Ghana Association of
    Biomedical Laboratory Scientists (GABMLS), and the Dutch Epidemiology Society
    (VvE). He also contributes to the scientific community as a peer reviewer for
    international journals, including the Cureus Journal of Medical Science.
  </p>

  <p>
    <strong>Research &amp; global health focus.</strong>
    As a published researcher, his work explores the spatial epidemiology of
    HIV/AIDS and disparities in health insurance coverage in Ghana. He is committed
    to translating complex biomedical and population health data into actionable
    insights, supporting evidence-based policy and advancing global health equity.
  </p>
</section>

<section class="section section--credentials" data-reveal>
  <div class="canvas-field" data-canvas-field data-palette="v2" data-intensity="0.4" aria-hidden="true"></div>
  <span class="section__ghost-num" aria-hidden="true">02</span>
  <h2 class="section__title"><span class="section__index">02</span> Credentials</h2>
  <ul class="tag-list">
    {% for c in site.data.profile.credentials %}
    <li class="tag v2-spotlight {% if c.status == 'in progress' %}tag--pending{% endif %}">
      <span class="tag__name">{{ c.name }}</span>
      <span class="tag__meta">{{ c.institution }}{% if c.note %} · {{ c.note }}{% endif %}{% if c.status == 'in progress' %} · in progress{% endif %}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="section wrap" data-reveal>
  <span class="section__ghost-num" aria-hidden="true">03</span>
  <h2 class="section__title"><span class="section__index">03</span> Explore the record</h2>
  <p class="section__intro">A closer look at the work behind the snapshot above.</p>
  <div class="toc-grid">
    <a class="toc-card v2-spotlight" href="{{ '/community/' | relative_url }}">
      <span class="toc-card__index">01</span>
      <span class="toc-card__title">Community</span>
      <span class="toc-card__desc">Outreach programs &amp; professional memberships</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/skills/' | relative_url }}">
      <span class="toc-card__index">02</span>
      <span class="toc-card__title">Skills</span>
      <span class="toc-card__desc">Laboratory, epidemiology &amp; data science toolkit</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/publications/' | relative_url }}">
      <span class="toc-card__index">03</span>
      <span class="toc-card__title">Publications</span>
      <span class="toc-card__desc">Peer-reviewed research record</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/portfolio/' | relative_url }}">
      <span class="toc-card__index">04</span>
      <span class="toc-card__title">Portfolio</span>
      <span class="toc-card__desc">Applied work in health data science</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/certificates/' | relative_url }}">
      <span class="toc-card__index">05</span>
      <span class="toc-card__title">Certificates</span>
      <span class="toc-card__desc">Licensure, registrations &amp; CPD</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/gallery/' | relative_url }}">
      <span class="toc-card__index">06</span>
      <span class="toc-card__title">Gallery</span>
      <span class="toc-card__desc">Photography</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/press/' | relative_url }}">
      <span class="toc-card__index">07</span>
      <span class="toc-card__title">Press</span>
      <span class="toc-card__desc">Media &amp; recognition</span>
    </a>
    <a class="toc-card v2-spotlight" href="{{ '/map/' | relative_url }}">
      <span class="toc-card__index">08</span>
      <span class="toc-card__title">Field Map</span>
      <span class="toc-card__desc">Outreach activity plotted across Ghana</span>
    </a>
  </div>
</section>
</div>

<script src="{{ '/assets/js/home-fx.js' | relative_url }}" defer></script>
