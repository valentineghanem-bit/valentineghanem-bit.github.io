---
layout: v3
permalink: /publications/
title: "Publications"
description: "Peer-reviewed research and publication record of Valentine Golden Ghanem, including spatial epidemiology of HIV/AIDS and health insurance coverage in Ghana."
jsonld: publications
extra_js: ["publications-fx.js"]
---
{% include nav-v3.html %}
<section class="publications-v2 pt-40 pb-24 px-6" data-pubs-root>
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Publications</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Publications</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      Published research, academic contributions and independent writings spanning public health, biomedical science, infectious disease epidemiology and data-driven healthcare insights.
    </p>

    {% assign pub_years = site.data.publications | map: "year" | uniq | sort | reverse %}
    <div class="glass-card rounded-2xl border p-5 mb-14 flex flex-wrap items-end gap-5">
      <div class="flex flex-col gap-1.5">
        <label for="pubs-year" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Year</label>
        <select id="pubs-year" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
          <option value="all">All years</option>
          {% for y in pub_years %}<option value="{{ y }}">{{ y }}</option>{% endfor %}
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="pubs-sort" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Sort</label>
        <select id="pubs-sort" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A&ndash;Z</option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5 flex-1 min-w-[180px]">
        <label for="pubs-search" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Search</label>
        <input type="search" id="pubs-search" placeholder="Search title, journal, topic&hellip;" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 w-full">
      </div>
      <button type="button" class="filter-toolbar__reset px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wide">Reset</button>
    </div>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">01</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">01</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Peer-reviewed publications</h3>
    </div>
    <p class="filter-empty hidden text-center py-10 text-slate-400 font-mono text-sm">No publications match that search.</p>
    <ul class="grid gap-5 mb-20 list-none p-0" data-pub-list>
      {% for pub in site.data.publications %}
      <li class="feed-item v2-spotlight relative rounded-2xl py-6 pl-6 sm:pl-24 pr-6" data-year="{{ pub.year }}" data-title="{{ pub.title }}">
        <span class="feed-item__record-id block sm:absolute static sm:left-5 sm:top-6 mb-3 sm:mb-0 w-fit font-mono text-[0.7rem] text-slate-400 border border-slate-300 dark:border-slate-600 rounded px-1.5 py-0.5 tracking-wide">PUB-{{ forloop.index | prepend: "00" | slice: -2, 2 }}</span>
        <p class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-1.5">{{ pub.title }}</p>
        <span class="block font-mono text-xs text-slate-400 mb-3">{{ pub.journal }} &middot; {{ pub.year }} &middot; {{ pub.status }}</span>
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ pub.summary }}</p>
        <div class="link-row flex flex-wrap gap-2.5 mt-4">
          <a href="{{ pub.doi_url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors">DOI</a>
          {% for l in pub.links %}
          <a href="{{ l.url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors">{{ l.label }}</a>
          {% endfor %}
          <button type="button" class="copy-btn px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors" onclick="copyToClipboard('{{ pub.citation | escape }}', 'Citation copied to clipboard')">Copy citation</button>
        </div>
      </li>
      {% endfor %}
    </ul>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">02</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2">02</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Academic positions</h3>
    </div>
    <ul class="grid gap-5 mb-20 list-none p-0">
      {% for r in site.data.peer_review %}
      <li class="feed-item v2-spotlight relative rounded-2xl p-6">
        <p class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-1.5">Peer Reviewer &mdash; {{ r.journal }}</p>
        <span class="block font-mono text-xs text-slate-400 mb-3">{{ r.institution }} &middot; {{ r.status }}</span>
        <div class="link-row flex flex-wrap gap-2.5">
          <a href="{{ r.profile_url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-violet-500 hover:text-violet-500 transition-colors">Reviewer profile</a>
          {% if r.certificate_url %}<a href="{{ r.certificate_url | relative_url }}" target="_blank" rel="noopener" class="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-violet-500 hover:text-violet-500 transition-colors">View certificate</a>{% endif %}
        </div>
      </li>
      {% endfor %}
    </ul>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">03</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-2">03</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Browse the full record</h3>
    </div>
    <div class="link-row flex flex-wrap gap-2.5">
      <a href="https://scholar.google.com/citations?user=06JdyxMAAAAJ" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">Google Scholar</a>
      <a href="https://orcid.org/0009-0002-8332-0220" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">ORCID</a>
      <a href="https://www.webofscience.com/wos/author/record/NRA-8276-2025" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">Web of Science</a>
      <a href="https://www.semanticscholar.org/author/Valentine-Golden-Ghanem/2368956236" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">Semantic Scholar</a>
      <a href="https://www.researchgate.net/profile/Valentine-Ghanem" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">ResearchGate</a>
      <a href="https://www.lens.org/lens/profile/692738672/scholar" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">Lens.org</a>
      <a href="https://papers.ssrn.com/Sol3/Cf_Dev/AbsByAuth.cfm?per_id=10047916" target="_blank" rel="noopener" class="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-amber-500 hover:text-amber-500 transition-colors">SSRN</a>
    </div>
  </div>
</section>

{% include footer-v3.html %}
