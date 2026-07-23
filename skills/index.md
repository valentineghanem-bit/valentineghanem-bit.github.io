---
layout: v3
permalink: /skills/
title: "Skills"
description: "Technical, analytical and leadership skills of Valentine Golden Ghanem across public health, data science and biomedical science."
extra_js: ["skills-network.js"]
---
{% include nav-v3.html %}
<section class="pt-40 pb-24 px-6" data-skills-root>
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Skills</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Skills &amp; toolkit</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-10">
      A working toolkit built across the laboratory bench, the field, and the analysis pipeline. Filter by category, by domain, or search directly for a tool, method or platform.
    </p>

    <div class="relative h-72 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-900 mb-10" data-skills-network aria-hidden="true">
      <canvas class="skills-v2__network-canvas absolute inset-0 w-full h-full"></canvas>
    </div>
    <script type="application/json" id="skills-network-data">{{ site.data.profile.knows_about | jsonify }}</script>

    <div class="glass-card rounded-2xl border p-5 mb-10 flex flex-wrap items-end gap-5">
      <div class="flex flex-col gap-1.5">
        <label for="skills-category" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Category</label>
        <select id="skills-category" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
          <option value="all">All categories</option>
          {% for section in site.data.skills %}<option value="{{ section.category }}">{{ section.category }}</option>{% endfor %}
        </select>
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="skills-domain" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Domain</label>
        <select id="skills-domain" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500">
          <option value="all">All domains</option>
          {% for g in site.data.skills[0].groups %}<option value="{{ g.name }}">{{ g.icon }} {{ g.name }}</option>{% endfor %}
        </select>
      </div>
      <div class="flex flex-col gap-1.5 flex-1 min-w-[180px]">
        <label for="skills-search" class="text-[11px] font-mono uppercase tracking-wide text-slate-400">Search</label>
        <input type="search" id="skills-search" placeholder="e.g. Python, GeneXpert, SOP&hellip;" class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 w-full">
      </div>
      <button type="button" class="filter-toolbar__reset px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wide">Reset</button>
    </div>

    <div class="overflow-x-auto mb-4 glass-card rounded-2xl border p-4">
      <p class="font-mono text-xs text-slate-400 mb-3">Toolkit at a glance &mdash; item count by domain and category</p>
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-700">
            <th class="text-left py-2 pr-4"></th>
            {% for section in site.data.skills %}<th class="text-left py-2 px-3 font-mono text-xs uppercase text-slate-400">{{ section.category }}</th>{% endfor %}
          </tr>
        </thead>
        <tbody>
          {% for g in site.data.skills[0].groups %}
          <tr class="border-b border-slate-100 dark:border-slate-800">
            <th class="text-left py-2 pr-4 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{{ g.icon }} {{ g.name }}</th>
            {% for section in site.data.skills %}
            {% assign match = section.groups | where: "name", g.name | first %}
            {% assign n = match.items.size %}
            {% assign heatClass = "bg-slate-100 dark:bg-slate-800 text-slate-500" %}
            {% if n >= 5 %}{% assign heatClass = "bg-cyan-500 text-white" %}{% elsif n >= 2 %}{% assign heatClass = "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300" %}{% endif %}
            <td class="p-1.5"><button type="button" class="skills-matrix__cell w-10 h-10 rounded-lg font-bold text-sm transition-transform hover:scale-110 {{ heatClass }}" data-category="{{ section.category }}" data-domain="{{ g.name }}">{{ n }}</button></td>
            {% endfor %}
          </tr>
          {% endfor %}
        </tbody>
      </table>
    </div>

    <p class="filter-empty hidden text-center py-10 text-slate-400 font-mono text-sm">No skills match that combination &mdash; try Reset.</p>

    {%- assign skills_section_colors = "cyan,amber,crimson,mint" | split: "," -%}
    {% for section in site.data.skills %}
    {%- assign sec_color = skills_section_colors[forloop.index0] -%}
    <div class="skills-section mt-14" data-category="{{ section.category }}">
      <div class="section__ghost-wrap">
        <span class="section__ghost-num">0{{ forloop.index }}</span>
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-{{ sec_color }}{% if sec_color != 'mint' and sec_color != 'crimson' %}-500{% endif %} mb-2">0{{ forloop.index }}</h2>
        <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">{{ section.category }}</h3>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {% for g in section.groups %}
        <div class="card v2-bento-tint relative overflow-hidden glass-card rounded-2xl border p-6" data-domain="{{ g.name }}">
          <h4 class="font-bold font-heading text-lg text-slate-900 dark:text-white mb-3">{{ g.icon }} {{ g.name }}</h4>
          <ul class="card__list space-y-2 text-sm text-slate-600 dark:text-slate-300 list-disc pl-4">
            {% for item in g.items %}<li>{{ item }}</li>{% endfor %}
          </ul>
        </div>
        {% endfor %}
      </div>
    </div>
    {% endfor %}

    <div class="section__ghost-wrap mt-16">
      <span class="section__ghost-num">04</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2">04</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">R&eacute;sum&eacute;</h3>
    </div>
    <details class="glass-card rounded-2xl border p-6">
      <summary class="cursor-pointer font-semibold text-slate-700 dark:text-slate-200">View embedded r&eacute;sum&eacute; (PDF)</summary>
      <iframe src="{{ '/assets/files/valentine-golden-ghanem-resume.pdf' | relative_url }}" title="Valentine Golden Ghanem &mdash; R&eacute;sum&eacute;" loading="lazy" class="w-full h-[600px] mt-4 rounded-xl border border-slate-200 dark:border-slate-700"></iframe>
    </details>
    <p class="mt-3"><a href="{{ '/assets/files/valentine-golden-ghanem-resume.pdf' | relative_url }}" target="_blank" rel="noopener" class="text-cyan-500 hover:underline text-sm font-semibold">Open r&eacute;sum&eacute; in a new tab &#8599;</a></p>
  </div>
</section>

{% include footer-v3.html %}
