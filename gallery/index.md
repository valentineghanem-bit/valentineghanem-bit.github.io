---
layout: v3
permalink: /gallery/
title: "Gallery"
description: "Photography of Valentine Golden Ghanem, Ghanaian medical scientist and epidemiologist, in the laboratory and in the field."
jsonld: gallery
extra_js: ["gallery-morph.js", "fan-carousel.js"]
---
{% include nav-v3.html %}
{%- assign morph_pairs = "" | split: "," -%}
{%- for item in site.data.gallery_portraits -%}
  {%- assign parts = item.url | split: "/" -%}
  {%- assign fname = parts | last | replace: ".jpg", "" -%}
  {%- assign pair = fname | append: "|||" | append: item.caption -%}
  {%- assign morph_pairs = morph_pairs | push: pair -%}
{%- endfor -%}

<section class="gallery-morph" aria-label="Photographic introduction">
  <div class="gallery-morph__scroller">
    <div class="gallery-morph__stage">
      <div class="gallery-morph__intro">
        <p class="gallery-morph__eyebrow">Accra, Ghana &middot; Field &amp; laboratory record</p>
        <h2 class="gallery-morph__title">A visual record of the work</h2>
        <p class="gallery-morph__hint">Scroll</p>
      </div>
    </div>
  </div>
</section>
<script>
  window.VG_GALLERY_MORPH = (function () {
    var pairs = {{ morph_pairs | jsonify }};
    return pairs.map(function (p) {
      var i = p.indexOf('|||');
      var file = p.slice(0, i);
      return { src: '{{ "/assets/img/hero-nodes/" | relative_url }}' + file + '.webp', caption: p.slice(i + 3) };
    });
  })();
</script>

<section class="gallery-v2 pt-24 pb-24 px-6">
  <div class="max-w-[1800px] mx-auto">
    <p class="font-mono text-xs text-slate-400 mb-6"><a href="{{ '/' | relative_url }}" class="hover:text-cyan-500">Home</a> / Gallery</p>
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-5">Gallery</h1>
    <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-16">
      A visual record spanning the laboratory, the field and professional life.
    </p>

    <div class="section__ghost-wrap">
      <span class="section__ghost-num">01</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-cyan-500 mb-2">01</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Portraits &amp; professional photography</h3>
    </div>
    <div class="fan-carousel" data-autoplay="5500">
      <div class="fan-carousel__deck">
        {% for p in site.data.gallery_portraits %}
        <div class="fan-carousel__card" data-caption="{{ p.caption | escape }}" role="button" tabindex="0" aria-label="{{ p.caption | escape }} — view full size">
          <img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">
        </div>
        {% endfor %}
      </div>
      <button type="button" class="fan-carousel__arrow fan-carousel__arrow--prev" aria-label="Previous photo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="fan-carousel__arrow fan-carousel__arrow--next" aria-label="Next photo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="fan-carousel__dots"></div>
      <p class="fan-carousel__caption"></p>
    </div>

    <div class="section__ghost-wrap mt-10">
      <span class="section__ghost-num">02</span>
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-violet-500 mb-2">02</h2>
      <h3 class="text-2xl font-black font-heading text-slate-900 dark:text-white mb-6">Community &amp; field work</h3>
    </div>
    <div class="fan-carousel" data-autoplay="6000">
      <div class="fan-carousel__deck">
        {% for p in site.data.gallery_photos %}
        <div class="fan-carousel__card" data-caption="{{ p.caption | escape }}" role="button" tabindex="0" aria-label="{{ p.caption | escape }} — view full size">
          <img src="{{ p.url | relative_url }}" alt="{{ p.caption }}, Valentine Golden Ghanem" loading="lazy">
        </div>
        {% endfor %}
      </div>
      <button type="button" class="fan-carousel__arrow fan-carousel__arrow--prev" aria-label="Previous photo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button type="button" class="fan-carousel__arrow fan-carousel__arrow--next" aria-label="Next photo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="fan-carousel__dots"></div>
      <p class="fan-carousel__caption"></p>
    </div>
  </div>
</section>

{% include footer-v3.html %}
