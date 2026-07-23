---
layout: v3
permalink: /portfolio/
title: "Portfolio"
description: "Applied academic and professional projects by Valentine Golden Ghanem in biomedical research, public health data analytics, dashboard development and machine learning."
jsonld: portfolio
extra_js: ["portfolio-fx.js"]
---
{% include nav-v3.html %}
<section class="portfolio-v2 pt-40 pb-24 px-6" data-portfolio-root>
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Portfolio</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Portfolio</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      A curated selection of major academic and professional projects at the intersection of laboratory science, data science and public health innovation.
    </p>

    <div class="filter-chips flex flex-wrap gap-2.5 mb-14">
      <button type="button" class="filter-chip is-active px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 transition-colors" data-filter="all">All projects</button>
      <button type="button" class="filter-chip px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 transition-colors" data-filter="capstone">Capstone</button>
      <button type="button" class="filter-chip px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 transition-colors" data-filter="dataviz">Data visualisations</button>
      <button type="button" class="filter-chip px-5 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300 transition-colors" data-filter="research">Research</button>
    </div>

    <div data-portfolio-section="capstone">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">01</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">01</h2>
        <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Capstone projects</h3>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {% for p in site.data.portfolio.capstone_projects %}
        <div class="card v2-spotlight v2-bento-tint relative overflow-hidden rounded-2xl p-6">
          <h4 class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-2">{{ p.title }}</h4>
          <p class="text-xs font-mono text-slate-400 mb-3">{{ p.context }}</p>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.summary }}</p>
          <div class="link-row flex flex-wrap gap-2.5 mt-4">
            {% for l in p.links %}<a href="{{ l.url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors">{{ l.label }}</a>{% endfor %}
          </div>
        </div>
        {% endfor %}
      </div>
    </div>

    <div data-portfolio-section="dataviz">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">02</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2">02</h2>
        <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Data visualisations</h3>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {% for p in site.data.portfolio.data_visualisations %}
        <div class="card v2-spotlight v2-bento-tint relative overflow-hidden rounded-2xl p-6">
          <h4 class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-3">{{ p.title }}</h4>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.summary }}</p>
          <div class="link-row flex flex-wrap gap-2.5 mt-4">
            {% if p.doi_url %}<a href="{{ p.doi_url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-violet-500 hover:text-violet-500 transition-colors">DOI</a>{% endif %}
            {% for l in p.links %}<a href="{{ l.url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-violet-500 hover:text-violet-500 transition-colors">{{ l.label }}</a>{% endfor %}
          </div>
        </div>
        {% endfor %}
      </div>
    </div>

    <div data-portfolio-section="research">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">03</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-2">03</h2>
        <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Research projects</h3>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {% for p in site.data.portfolio.research_projects %}
        <div class="card v2-spotlight v2-bento-tint relative overflow-hidden rounded-2xl p-6">
          <h4 class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-2">{{ p.title }}</h4>
          <p class="text-xs font-mono text-slate-400 mb-3">{{ p.context }}</p>
          <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ p.summary }}</p>
          <div class="link-row flex flex-wrap gap-2.5 mt-4">
            {% for l in p.links %}<a href="{{ l.url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">{{ l.label }}</a>{% endfor %}
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
  </div>
</section>

{% include footer-v3.html %}
