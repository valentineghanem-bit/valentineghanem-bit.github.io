---
layout: default
permalink: /
jsonld: home
title: "Medical Scientist and Epidemiologist"
description: "Official website of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
---

{%- assign rep_img = site.data.images | where: "representative", true | first -%}
<section class="hero wrap">
  <div class="hero__content">
    <p class="hero__eyebrow">Accra, Ghana &nbsp;·&nbsp; 5.6037° N, 0.1870° W</p>
    <h1 class="hero__title">Valentine Golden Ghanem</h1>
    <p class="hero__role">Medical Scientist &nbsp;/&nbsp; Epidemiologist &nbsp;/&nbsp; Public Health Researcher</p>
    <div class="hero__rule" aria-hidden="true">
      <span class="hero__tick"></span><span class="hero__tick"></span><span class="hero__tick"></span>
      <span class="hero__tick hero__tick--major"></span><span class="hero__tick"></span><span class="hero__tick"></span>
    </div>
    <p class="hero__lede">
      I bridge the gap between high-throughput diagnostics and predictive analytics —
      integrating machine learning with spatial epidemiology to identify health
      inequities and forecast infectious disease trends across Ghana.
    </p>
    <div class="hero__ctas">
      <a class="btn btn--primary" href="{{ '/about/' | relative_url }}">About me</a>
      <a class="btn" href="{{ '/assets/files/valentine-golden-ghanem-resume.pdf' | relative_url }}" target="_blank" rel="noopener">Download CV</a>
    </div>
    <div class="stat-strip">
      <div class="stat"><span class="stat__number" data-target="10" data-suffix="+">0</span><span class="stat__label">Years in laboratory &amp; public health practice</span></div>
      <div class="stat"><span class="stat__number" data-target="1000" data-suffix="+">0</span><span class="stat__label">Diagnostic tests overseen daily</span></div>
      <div class="stat"><span class="stat__number" data-target="5000" data-suffix="+">0</span><span class="stat__label">Individuals screened in outreach</span></div>
    </div>
  </div>
  <figure class="hero__portrait" data-parallax="0.12">
    <img src="{{ rep_img.content_url }}" alt="{{ rep_img.name }}" loading="lazy" onerror="this.closest('figure').style.display='none'">
  </figure>
</section>

<section class="section wrap" data-reveal>
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

<section class="section section--inverted wrap section--credentials" data-reveal>
  <h2 class="section__title"><span class="section__index">02</span> Credentials</h2>
  <ul class="tag-list">
    {% for c in site.data.profile.credentials %}
    <li class="tag {% if c.status == 'in progress' %}tag--pending{% endif %}">
      <span class="tag__name">{{ c.name }}</span>
      <span class="tag__meta">{{ c.institution }}{% if c.note %} · {{ c.note }}{% endif %}{% if c.status == 'in progress' %} · in progress{% endif %}</span>
    </li>
    {% endfor %}
  </ul>
</section>

<section class="section wrap" data-reveal>
  <h2 class="section__title"><span class="section__index">03</span> Explore the record</h2>
  <p class="section__intro">A closer look at the work behind the snapshot above.</p>
  <div class="toc-grid">
    <a class="toc-card" href="{{ '/community/' | relative_url }}">
      <span class="toc-card__index">01</span>
      <span class="toc-card__title">Community</span>
      <span class="toc-card__desc">Outreach programs &amp; professional memberships</span>
    </a>
    <a class="toc-card" href="{{ '/skills/' | relative_url }}">
      <span class="toc-card__index">02</span>
      <span class="toc-card__title">Skills</span>
      <span class="toc-card__desc">Laboratory, epidemiology &amp; data science toolkit</span>
    </a>
    <a class="toc-card" href="{{ '/publications/' | relative_url }}">
      <span class="toc-card__index">03</span>
      <span class="toc-card__title">Publications</span>
      <span class="toc-card__desc">Peer-reviewed research record</span>
    </a>
    <a class="toc-card" href="{{ '/portfolio/' | relative_url }}">
      <span class="toc-card__index">04</span>
      <span class="toc-card__title">Portfolio</span>
      <span class="toc-card__desc">Applied work in health data science</span>
    </a>
    <a class="toc-card" href="{{ '/certificates/' | relative_url }}">
      <span class="toc-card__index">05</span>
      <span class="toc-card__title">Certificates</span>
      <span class="toc-card__desc">Licensure, registrations &amp; CPD</span>
    </a>
    <a class="toc-card" href="{{ '/gallery/' | relative_url }}">
      <span class="toc-card__index">06</span>
      <span class="toc-card__title">Gallery</span>
      <span class="toc-card__desc">Photography</span>
    </a>
    <a class="toc-card" href="{{ '/press/' | relative_url }}">
      <span class="toc-card__index">07</span>
      <span class="toc-card__title">Press</span>
      <span class="toc-card__desc">Media &amp; recognition</span>
    </a>
  </div>
</section>
