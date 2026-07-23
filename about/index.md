---
layout: v3
permalink: /about/
jsonld: about
title: "About"
description: "Biography, biodata and professional profile of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
extra_js: ["canvas-field.js", "about-fx.js"]
---
{% include nav-v3.html %}
{%- assign rep_img = site.data.images | where: "representative", true | first -%}
{%- assign frsph = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'FRSPH'" | first -%}
{%- assign acslm = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'ACSLM'" | first -%}
{%- assign gamls = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'GAMLS'" | first -%}
{%- assign vve = site.data.profile.memberships | where_exp: "m", "m.abbreviation == 'VvE'" | first -%}
<div class="about-v2">

<section class="relative overflow-hidden pt-40 pb-20 px-6">
  <div class="canvas-field absolute inset-0 z-0 opacity-40" data-canvas-field data-palette="v2" data-intensity="0.5" aria-hidden="true"></div>
  <div class="blob w-[500px] h-[500px] bg-cyan-400/10 -top-32 -left-32 pointer-events-none"></div>
  <div class="max-w-[1800px] mx-auto relative z-10">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / About</p>
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-7">
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-6">About {{ site.data.profile.name }}</h1>
        <blockquote class="spotlight-glow relative pl-6 py-2 mb-6 border-l-4 border-cyan-500 bg-cyan-500/5 rounded-r-2xl">
          <p class="text-lg sm:text-xl italic text-slate-800 dark:text-slate-200 leading-snug">{{ site.data.profile.disambiguating_description }}</p>
        </blockquote>
        <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{{ site.data.profile.description }}</p>
      </div>
      <div class="lg:col-span-5 flex justify-center lg:justify-end">
        <figure class="relative w-full max-w-sm glass-card rounded-[28px] p-3 border shadow-2xl" data-parallax="0.08">
          <div class="absolute top-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-3 py-1.5 rounded-full border border-slate-700">Dual-licensed &middot; Ghana &amp; Ireland</div>
          <img src="{{ rep_img.content_url }}" alt="{{ rep_img.name }}" width="{{ rep_img.width }}" height="{{ rep_img.height }}" loading="lazy" class="w-full h-auto object-cover rounded-[20px]" onerror="this.closest('figure').style.display='none'">
          <figcaption class="text-xs font-mono text-slate-400 text-center mt-2 pb-1">{{ rep_img.caption }}</figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>

<section class="py-24 px-6 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-[1800px] mx-auto">
    <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-4">01 &mdash; Identity</h2>
    <h3 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-10">Biodata &amp; languages</h3>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="specimen relative overflow-hidden glass-card rounded-2xl p-7 border">
        <div class="specimen-scan" aria-hidden="true"></div>
        <p class="font-mono text-xs uppercase tracking-widest text-cyan-500 mb-4">Personal biodata</p>
        <div class="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-700 py-2.5 text-sm"><span class="font-mono text-[11px] uppercase text-slate-400">Date of birth</span><span class="text-slate-800 dark:text-slate-200">25 April 1987</span></div>
        <div class="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-700 py-2.5 text-sm"><span class="font-mono text-[11px] uppercase text-slate-400">Place of birth</span><span class="text-slate-800 dark:text-slate-200">{{ site.data.profile.birth_place }}</span></div>
        <div class="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-700 py-2.5 text-sm"><span class="font-mono text-[11px] uppercase text-slate-400">Nationality</span><span class="text-slate-800 dark:text-slate-200">{{ site.data.profile.nationality }}</span></div>
        <div class="flex justify-between py-2.5 text-sm"><span class="font-mono text-[11px] uppercase text-slate-400">Religion</span><span class="text-slate-800 dark:text-slate-200">{{ site.data.profile.religion }}</span></div>
      </div>
      <div class="specimen relative overflow-hidden glass-card rounded-2xl p-7 border">
        <div class="specimen-scan" aria-hidden="true"></div>
        <p class="font-mono text-xs uppercase tracking-widest text-cyan-500 mb-4">Languages</p>
        {% for lang in site.data.profile.languages %}
        <div class="py-2.5 text-sm border-b border-dashed border-slate-200 dark:border-slate-700 last:border-0 text-slate-800 dark:text-slate-200">{{ lang.name }}</div>
        {% endfor %}
      </div>
    </div>
  </div>
</section>

<section class="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-[1800px] mx-auto">
    <h2 class="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-4">02 &mdash; Purpose</h2>
    <h3 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-10">Vision &amp; objectives</h3>
    <div class="relative pl-6 mb-10" data-manifesto>
      <div class="absolute left-0 top-1 bottom-1 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
      <div class="manifesto-rail-fill absolute left-0 top-1 w-0.5"></div>
      <p class="text-lg sm:text-xl italic text-slate-800 dark:text-slate-200 leading-relaxed">{{ site.data.profile.statement_of_purpose }}</p>
    </div>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="glass-card rounded-2xl p-7 border">
        <h4 class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-3">Career vision</h4>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ site.data.profile.career_vision }}</p>
      </div>
      <div class="glass-card rounded-2xl p-7 border">
        <h4 class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-3">Aim &amp; objectives</h4>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{{ site.data.profile.aim }}</p>
        <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300 list-disc pl-4">
          {% for o in site.data.profile.objectives %}<li>{{ o }}</li>{% endfor %}
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-24 px-6 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-[1800px] mx-auto">
    <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-4">03 &mdash; Expertise</h2>
    <h3 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-10">Areas of expertise</h3>
    <div class="flex flex-wrap gap-2.5" data-pills>
      {% for topic in site.data.profile.knows_about %}
      <span class="reveal-pill px-4 py-2 glass-card rounded-full text-sm font-mono text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-slate-900 dark:hover:text-white transition-colors">{{ topic }}</span>
      {% endfor %}
    </div>
  </div>
</section>

<section class="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-[1800px] mx-auto">
    <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-4">04 &mdash; Verification</h2>
    <h3 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-10">Identifiers</h3>
    <div class="grid sm:grid-cols-2 gap-x-10" data-idents>
      {% for ident in site.data.profile.identifiers %}
      <div class="reveal-ident flex justify-between items-center border-b border-dashed border-slate-200 dark:border-slate-700 py-3 font-mono text-sm">
        <span class="text-[11px] uppercase tracking-wide text-slate-400">{{ ident.property_id }}</span>
        <a href="{{ ident.url }}" target="_blank" rel="noopener" class="text-cyan-600 dark:text-cyan-400 hover:underline">{{ ident.value }}<span class="ident-cursor" aria-hidden="true"></span></a>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="py-24 px-6 relative overflow-hidden border-t border-slate-200 dark:border-slate-800">
  <div class="canvas-field absolute inset-0 z-0 opacity-30" data-canvas-field data-palette="v2" data-intensity="0.35" aria-hidden="true"></div>
  <div class="max-w-[1800px] mx-auto relative z-10">
    <h2 class="text-xs font-black uppercase tracking-[0.4em] text-crimson mb-4">05 &mdash; Credentials</h2>
    <h3 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-10">Fellowships &amp; registrations</h3>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {% for c in site.data.profile.credentials %}
      <div class="spotlight-glow glass-card rounded-2xl p-5 border {% if c.status == 'in progress' %}border-l-4 border-l-violet-500{% else %}border-l-4 border-l-amber-500{% endif %}">
        <p class="font-bold text-slate-900 dark:text-white text-sm mb-1">{{ c.name }}</p>
        <p class="font-mono text-xs text-slate-500 dark:text-slate-400">{{ c.institution }}{% if c.year %} &middot; {{ c.year }}{% endif %}{% if c.note %} &middot; {{ c.note }}{% endif %}{% if c.status == 'in progress' %} &middot; in progress{% endif %}</p>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<section class="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800">
  <div class="max-w-[1800px] mx-auto">
    <div class="flex items-baseline justify-between flex-wrap gap-4 mb-2">
      <div>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-emerald-500 mb-4">06 &mdash; Journey</h2>
        <h3 class="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white">Academic &amp; professional timeline</h3>
      </div>
    </div>
    <p class="font-mono text-xs text-slate-400 mb-8">{{ site.data.timeline | size }} entries, reverse-chronological &mdash; tap any record for the full detail.</p>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" data-record-grid>
      {% for t in site.data.timeline %}
      <button type="button" class="record-card reveal-record relative text-left glass-card rounded-2xl p-4 border min-h-[112px] flex flex-col gap-1 hover:-translate-y-1 hover:shadow-xl transition-all cursor-pointer"
        data-record-icon="{{ t.icon | escape }}"
        data-record-dates="{{ t.dates | escape }}"
        data-record-title="{{ t.title | escape }}"
        data-record-desc="{{ t.description | escape }}">
        <span class="record-card-icon text-xl" aria-hidden="true">{{ t.icon }}</span>
        <span class="record-card-dates font-mono text-[10px] text-slate-400">{{ t.dates }}</span>
        <span class="record-card-title font-heading font-semibold text-sm text-slate-900 dark:text-white leading-snug line-clamp-3">{{ t.title }}</span>
        {% if t.description %}<span class="absolute top-3 right-3 font-mono text-sm text-cyan-500">+</span>{% endif %}
      </button>
      {% endfor %}
    </div>
  </div>
</section>

</div>

{% include footer-v3.html %}
