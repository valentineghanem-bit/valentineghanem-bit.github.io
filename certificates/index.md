---
layout: v3
permalink: /certificates/
title: "Certificates & CPDs"
description: "Academic qualifications, licensure, professional memberships and continuing professional development of Valentine Golden Ghanem."
jsonld: certificates
extra_js: ["certificates-fx.js"]
---
{% include nav-v3.html %}
<section class="certificates-v2 pt-40 pb-24 px-6">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Certificates</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Certificates &amp; CPDs</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      Formal academic qualifications, professional certifications and continuing professional development (CPD), reflecting a commitment to lifelong learning, laboratory excellence, data science innovation and public health leadership.
    </p>

    <nav class="flex flex-wrap gap-2 mb-16" aria-label="Section jump links">
      <a href="#academic-qualifications" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors">01 Academic</a>
      <a href="#licensure" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-violet-500 hover:border-violet-500 transition-colors">02 Licensure</a>
      <a href="#memberships" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:border-amber-500 transition-colors">03 Memberships</a>
      <a href="#in-progress" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-crimson hover:border-crimson transition-colors">04 In progress</a>
      <a href="#cpd" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition-colors">05 CPD log</a>
    </nav>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">01</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-2" id="academic-qualifications">01</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Academic qualifications</h3>
    </div>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 list-none p-0">
      {% for c in site.data.profile.credentials %}
      <li class="tag v2-spotlight v2-bento-tint {% if c.status == 'in progress' %}tag--pending{% endif %} rounded-xl pl-4 pr-5 py-3.5">
        <span class="block font-bold font-heading text-sm text-slate-900 dark:text-white">{{ c.name }}</span>
        <span class="block font-mono text-xs text-slate-400 mt-1">{{ c.institution }}{% if c.year %} &middot; {{ c.year }}{% endif %}{% if c.note %} &middot; {{ c.note }}{% endif %}{% if c.status == 'in progress' %} &middot; in progress{% endif %}</span>
      </li>
      {% endfor %}
    </ul>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">02</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2" id="licensure">02</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Licensure &amp; registration</h3>
    </div>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 list-none p-0">
      {% for l in site.data.profile.licensure %}
      <li class="tag v2-spotlight v2-bento-tint rounded-xl pl-4 pr-5 py-3.5">
        <span class="block font-bold font-heading text-sm text-slate-900 dark:text-white">{{ l.credential }} &mdash; {{ l.jurisdiction }}</span>
        <span class="block font-mono text-xs text-slate-400 mt-1">{{ l.body }}{% if l.abbreviation %} ({{ l.abbreviation }}){% endif %}{% if l.reg_no %} &middot; Reg. No. {{ l.reg_no }}{% endif %}</span>
      </li>
      {% endfor %}
    </ul>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">03</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-2" id="memberships">03</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Professional memberships</h3>
    </div>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 list-none p-0">
      {% for m in site.data.profile.memberships %}
      <li class="tag v2-spotlight v2-bento-tint rounded-xl pl-4 pr-5 py-3.5">
        <span class="block font-bold font-heading text-sm text-slate-900 dark:text-white">{{ m.name }}{% if m.role %} &mdash; {{ m.role }}{% endif %}</span>
        <span class="block font-mono text-xs text-slate-400 mt-1">{% if m.abbreviation %}{{ m.abbreviation }}{% endif %}{% if m.reg_no %} &middot; No. {{ m.reg_no }}{% endif %}</span>
      </li>
      {% endfor %}
    </ul>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">04</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-crimson mb-2" id="in-progress">04</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Certifications in progress</h3>
    </div>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 list-none p-0">
      {% for c in site.data.profile.certifications_in_progress %}
      <li class="tag tag--pending v2-spotlight rounded-xl pl-4 pr-5 py-3.5">
        <span class="block font-bold font-heading text-sm text-slate-900 dark:text-white">{{ c.name }}</span>
        <span class="block font-mono text-xs text-slate-400 mt-1">{{ c.note }}</span>
      </li>
      {% endfor %}
    </ul>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">05</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-2" id="cpd">05</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Continuing professional development</h3>
    </div>
    <div data-cpd-root>
      <div class="glass-card rounded-2xl border p-5 mb-8 flex flex-wrap items-end gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="cpd-year" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Year</label>
          <select id="cpd-year" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
            <option value="all">All years</option>
            {% for yr in site.data.cpd %}<option value="{{ yr.year }}">{{ yr.year }}</option>{% endfor %}
          </select>
        </div>
      </div>
      {% for yr in site.data.cpd %}
      <div class="cpd-year-group mb-10" data-year="{{ yr.year }}">
        <h4 class="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">{{ yr.year }}</h4>
        <ul class="grid gap-4 list-none p-0">
          {% for e in yr.entries %}
          <li class="feed-item v2-spotlight relative rounded-2xl p-6">
            <p class="font-bold font-heading text-base text-slate-900 dark:text-white mb-1.5">{{ e.title }}</p>
            <span class="block font-mono text-xs text-slate-400 mb-2">{{ e.provider }}</span>
            {% if e.topics %}<p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ e.topics }}</p>{% endif %}
            {% if e.certificate_url %}<div class="link-row mt-3"><a href="{{ e.certificate_url | relative_url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-500 transition-colors inline-block">View certificate</a></div>{% endif %}
          </li>
          {% endfor %}
        </ul>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

{% include footer-v3.html %}
