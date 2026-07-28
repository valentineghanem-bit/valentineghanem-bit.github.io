---
layout: v3
permalink: /press/
title: "Press"
description: "Media coverage, interviews and public recognition of Valentine Golden Ghanem."
jsonld: press
extra_js: ["press-fx.js"]
---
{% include nav-v3.html %}
{%- assign press_outlets = site.data.press | map: "outlet" | uniq -%}
<section class="press-v2 v3-page-canvas v3-page-canvas--press pt-40 pb-24 px-6" data-nav-marker="00" data-nav-label="Press" data-nav-colour="#FBBF24">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Press</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Press &amp; recognition</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      Media coverage of research, professional commentary and contributions to public health and epidemiology. Each entry links to the original publication.
    </p>

    <div class="glass-card rounded-2xl border pt-4 pb-5 mb-16" aria-hidden="true">
      <p class="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-slate-400 px-6 mb-2">As featured in</p>
      <div class="marquee">
        <div class="marquee__track">
          {% for o in press_outlets %}<span class="marquee__item px-6">{{ o }}</span>{% endfor %}
          {% for o in press_outlets %}<span class="marquee__item px-6">{{ o }}</span>{% endfor %}
        </div>
      </div>
    </div>

    <ul class="grid gap-5 mb-20 list-none p-0">
      {% for a in site.data.press %}
      <li class="feed-item v2-spotlight relative rounded-2xl p-6 md:p-7">
        <p class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-1.5">{{ a.headline }}</p>
        <span class="block font-mono text-xs text-slate-400 mb-3">{{ a.outlet }} &middot; {{ a.date }}{% if a.byline %} &middot; {{ a.byline }}{% endif %}</span>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ a.summary }}</p>
        <div class="link-row mt-4">
          <a href="{{ a.url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors inline-block">Read full article</a>
        </div>
      </li>
      {% endfor %}
    </ul>

    <aside class="glass-card rounded-xl border p-5 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="font-mono text-[0.65rem] uppercase text-amber-500 mb-1">Identity records</p>
        <p class="text-sm text-slate-600 dark:text-slate-300">Researcher identifiers and professional registrations are maintained on the About page.</p>
      </div>
      <a href="{{ '/about/#professional-verification' | relative_url }}" class="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">
        View verified record <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </a>
    </aside>
  </div>
</section>

{% include footer-v3.html %}
