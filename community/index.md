---
layout: v3
permalink: /community/
title: "Community"
description: "Community outreach, medical screening programs and public engagement by Valentine Golden Ghanem in Ghana."
jsonld: community
extra_js: ["community-fx.js"]
---
{% include nav-v3.html %}
<section class="community-v2 pt-40 pb-24 px-6">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Community</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Community &amp; outreach</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-14">
      Medical screening, conferences and public engagement beyond the laboratory bench.
    </p>

    <div class="lg:grid lg:grid-cols-[236px_minmax(0,1fr)] gap-6 lg:gap-14 items-start">
      <aside class="community-sidebar lg:sticky lg:top-28 flex flex-col gap-6 mb-10 lg:mb-0">
        <p class="pull-quote v2-spotlight v2-corner-frame rounded-2xl p-5 font-heading text-base leading-relaxed text-slate-800 dark:text-slate-100 italic">
          &ldquo;Screening services delivered to over 5,000 individuals in underserved populations.&rdquo;
        </p>
        <nav class="community-nav flex flex-col gap-2" aria-label="Section jump links">
          <a href="#medical-screening" class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-mint hover:border-mint transition-colors">01 Medical screening</a>
          <a href="#conferences" class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-mint hover:border-mint transition-colors">02 Conferences &amp; seminars</a>
          <a href="#outreach" class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[0.7rem] uppercase tracking-wide text-slate-500 dark:text-slate-400 hover:text-mint hover:border-mint transition-colors">03 Community outreach</a>
        </nav>
      </aside>

      <div class="community-main min-w-0">
        {%- assign geo_i = 0 -%}
        <div class="section__ghost-wrap">
          <span class="section__ghost-num">01</span>
          <h2 class="text-xs font-black uppercase tracking-[0.4em] text-mint mb-2" id="medical-screening">01</h2>
          <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Medical screening</h3>
        </div>
        <div class="event-grid mb-6">
          {% for e in site.data.community_activities.medical_screening %}
          <article class="event-card v2-spotlight rounded-2xl p-6 md:p-7" id="community-event-{{ geo_i }}">
          {%- assign geo_i = geo_i | plus: 1 -%}
            <div class="event-card__head mb-1.5">
              <p class="font-bold font-heading text-lg text-slate-900 dark:text-white">🩺 {{ e.title }}</p>
            </div>
            <span class="block font-mono text-xs text-slate-400 mb-3">{{ e.provider }} &middot; {{ e.date }} &middot; {{ e.location }}</span>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ e.description }}</p>
            {% if e.photos %}
            <div class="event-media event-media--accordion">
              {% for p in e.photos limit:6 %}
              <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"{% if p.contain %} style="background-image:url('{{ p.url | relative_url }}');"{% endif %}><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">{% if p.caption %}<figcaption class="event-media__caption">{{ p.caption }}</figcaption>{% endif %}</figure>
              {% endfor %}
              {% if e.photos.size > 6 %}
              <details class="event-media__more group mt-1.5">
                <summary class="group-open:hidden">+{{ e.photos.size | minus: 6 }} more photos</summary>
                <div class="event-media">
                  {% for p in e.photos offset:6 %}
                  <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"{% if p.contain %} style="background-image:url('{{ p.url | relative_url }}');"{% endif %}><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">{% if p.caption %}<figcaption class="event-media__caption">{{ p.caption }}</figcaption>{% endif %}</figure>
                  {% endfor %}
                </div>
              </details>
              {% endif %}
            </div>
            {% endif %}
            {% if e.video %}
            <div class="event-media__video{% if e.video_landscape %} event-media__video--landscape{% endif %}"><video src="{{ e.video | relative_url }}"{% if e.photos.first.url %} poster="{{ e.photos.first.url | relative_url }}"{% endif %} controls preload="metadata" aria-label="{{ e.title | escape }}, Valentine Golden Ghanem"></video></div>
            {% endif %}
          </article>
          {% endfor %}
        </div>

        <div class="section__ghost-wrap mt-16">
          <span class="section__ghost-num">02</span>
          <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2" id="conferences">02</h2>
          <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Conferences &amp; seminars</h3>
        </div>
        <div class="event-grid mb-6">
          {% for e in site.data.community_activities.conferences %}
          <article class="event-card v2-spotlight rounded-2xl p-6 md:p-7" id="community-event-{{ geo_i }}">
          {%- assign geo_i = geo_i | plus: 1 -%}
            <div class="event-card__head mb-1.5">
              <p class="font-bold font-heading text-lg text-slate-900 dark:text-white">🧬 {{ e.title }}</p>
            </div>
            <span class="block font-mono text-xs text-slate-400 mb-3">{{ e.provider }} &middot; {{ e.date }}</span>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ e.description }}</p>
            {% if e.photos %}
            <div class="event-media event-media--accordion">
              {% for p in e.photos limit:6 %}
              <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"{% if p.contain %} style="background-image:url('{{ p.url | relative_url }}');"{% endif %}><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">{% if p.caption %}<figcaption class="event-media__caption">{{ p.caption }}</figcaption>{% endif %}</figure>
              {% endfor %}
              {% if e.photos.size > 6 %}
              <details class="event-media__more group mt-1.5">
                <summary class="group-open:hidden">+{{ e.photos.size | minus: 6 }} more photos</summary>
                <div class="event-media">
                  {% for p in e.photos offset:6 %}
                  <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"{% if p.contain %} style="background-image:url('{{ p.url | relative_url }}');"{% endif %}><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">{% if p.caption %}<figcaption class="event-media__caption">{{ p.caption }}</figcaption>{% endif %}</figure>
                  {% endfor %}
                </div>
              </details>
              {% endif %}
            </div>
            {% endif %}
          </article>
          {% endfor %}
        </div>

        <div class="section__ghost-wrap mt-16">
          <span class="section__ghost-num">03</span>
          <h2 class="text-xs font-black uppercase tracking-[0.4em] text-amber-500 mb-2" id="outreach">03</h2>
          <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Community outreach</h3>
        </div>
        <div class="event-grid mb-6">
          {% for e in site.data.community_activities.outreach %}
          <article class="event-card v2-spotlight rounded-2xl p-6 md:p-7" id="community-event-{{ geo_i }}">
          {%- assign geo_i = geo_i | plus: 1 -%}
            <div class="event-card__head mb-1.5">
              <p class="font-bold font-heading text-lg text-slate-900 dark:text-white">⚕️ {{ e.title }}</p>
            </div>
            <span class="block font-mono text-xs text-slate-400 mb-3">{{ e.provider }} &middot; {{ e.date }}</span>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{{ e.description }}</p>
            {% if e.photos %}
            <div class="event-media event-media--accordion">
              {% for p in e.photos limit:6 %}
              <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"{% if p.contain %} style="background-image:url('{{ p.url | relative_url }}');"{% endif %}><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">{% if p.caption %}<figcaption class="event-media__caption">{{ p.caption }}</figcaption>{% endif %}</figure>
              {% endfor %}
              {% if e.photos.size > 6 %}
              <details class="event-media__more group mt-1.5">
                <summary class="group-open:hidden">+{{ e.photos.size | minus: 6 }} more photos</summary>
                <div class="event-media">
                  {% for p in e.photos offset:6 %}
                  <figure class="event-media__item{% if p.contain %} event-media__item--contain{% endif %}"{% if p.contain %} style="background-image:url('{{ p.url | relative_url }}');"{% endif %}><img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">{% if p.caption %}<figcaption class="event-media__caption">{{ p.caption }}</figcaption>{% endif %}</figure>
                  {% endfor %}
                </div>
              </details>
              {% endif %}
            </div>
            {% endif %}
          </article>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</section>

{% include footer-v3.html %}
