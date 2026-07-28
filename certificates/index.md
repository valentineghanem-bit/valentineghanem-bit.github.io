---
layout: v3
permalink: /certificates/
title: "Professional Development Certificates"
description: "Downloadable continuing professional development evidence for Valentine Golden Ghanem across laboratory medicine, public health and clinical practice."
extra_js: ["certificates-fx.js"]
---
{% include nav-v3.html %}
{%- assign cpd_count = 0 -%}
{%- for year_group in site.data.cpd -%}
  {%- assign cpd_count = cpd_count | plus: year_group.entries.size -%}
{%- endfor -%}

<section class="certificates-v2 v3-page-canvas v3-page-canvas--certificates pt-40 pb-24 px-6"
         data-nav-marker="00"
         data-nav-label="CPD"
         data-nav-colour="#F87171">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Professional development</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Professional development archive</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-8">
      A dated archive of continuing professional development in laboratory medicine,
      diagnostic quality, biosafety, infectious-disease response and public health practice.
      Each listed record links to its supporting certificate.
    </p>

    <div class="grid sm:grid-cols-3 gap-3 mb-12" aria-label="Professional development archive summary">
      <div class="glass-card rounded-lg border p-5">
        <strong class="block text-3xl font-black font-heading text-cyan-500">{{ cpd_count }}</strong>
        <span class="font-mono text-[0.68rem] uppercase text-slate-500">downloadable records</span>
      </div>
      <div class="glass-card rounded-lg border p-5">
        <strong class="block text-3xl font-black font-heading text-emerald-500">{{ site.data.cpd | size }}</strong>
        <span class="font-mono text-[0.68rem] uppercase text-slate-500">documented years</span>
      </div>
      <div class="glass-card rounded-lg border p-5">
        <strong class="block text-3xl font-black font-heading text-violet-500">2020-2025</strong>
        <span class="font-mono text-[0.68rem] uppercase text-slate-500">archive coverage</span>
      </div>
    </div>

    <aside class="glass-card rounded-lg border p-5 mb-14 flex flex-wrap items-center justify-between gap-4">
      <p class="text-sm text-slate-600 dark:text-slate-300 max-w-3xl">
        Degrees, professional registrations, memberships and credentials in progress are
        maintained once, in the verified professional record.
      </p>
      <a href="{{ '/about/#professional-verification' | relative_url }}"
         class="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-crimson hover:text-crimson transition-colors">
        View professional standing <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </a>
    </aside>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">01</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-2" id="cpd">01 - Evidence archive</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Continuing professional development</h3>
    </div>

    <div data-cpd-root>
      <div class="glass-card rounded-lg border p-5 mb-8 flex flex-wrap items-end gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="cpd-year" class="text-[11px] font-mono uppercase text-slate-400">Year</label>
          <select id="cpd-year" class="min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
            <option value="all">All years</option>
            {% for yr in site.data.cpd %}<option value="{{ yr.year }}">{{ yr.year }}</option>{% endfor %}
          </select>
        </div>
      </div>

      {% for yr in site.data.cpd %}
      <section class="cpd-year-group mb-10" data-year="{{ yr.year }}" aria-labelledby="cpd-year-{{ yr.year }}">
        <h4 id="cpd-year-{{ yr.year }}" class="font-mono text-xs uppercase text-slate-400 mb-4">{{ yr.year }}</h4>
        <ul class="grid gap-4 list-none p-0">
          {% for e in yr.entries %}
          <li class="feed-item v2-spotlight relative rounded-lg p-6">
            <p class="font-bold font-heading text-base text-slate-900 dark:text-white mb-1.5">{{ e.title }}</p>
            <span class="block font-mono text-xs text-slate-400 mb-2">{{ e.provider }}</span>
            {% if e.topics %}<p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ e.topics }}</p>{% endif %}
            {% if e.certificate_url %}
            <div class="link-row mt-3">
              <a href="{{ e.certificate_url | relative_url }}" target="_blank" rel="noopener"
                 class="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                View certificate <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
            </div>
            {% endif %}
          </li>
          {% endfor %}
        </ul>
      </section>
      {% endfor %}
    </div>
  </div>
</section>

{% include footer-v3.html %}
