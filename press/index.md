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
<section class="press-v2 pt-40 pb-24 px-6">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Press</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Press &amp; recognition</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      Media coverage and public engagements focusing on research, expert commentary, and contributions to public health and epidemiology. All entries link to the original publication.
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

    <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-2">Verified profiles</h2>
    <p class="text-sm text-slate-600 dark:text-slate-300 mb-5">His identity and record are also independently verifiable via:</p>
    <div class="link-row flex flex-wrap gap-2.5">
      <a href="https://www.wikidata.org/wiki/Q137962236" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">Wikidata</a>
      <a href="https://isni.org/isni/000000052967791X" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">ISNI</a>
      <a href="https://commons.wikimedia.org/wiki/Category:Valentine_Golden_Ghanem" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">Wikimedia Commons</a>
    </div>
  </div>
</section>

{% include footer-v3.html %}
