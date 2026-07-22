---
layout: default
permalink: /gallery/
title: "Gallery"
description: "Photography of Valentine Golden Ghanem, Ghanaian medical scientist and epidemiologist, in the laboratory and in the field."
---

{%- assign morph_pairs = "" | split: "," -%}
{%- for item in site.data.gallery_portraits -%}
  {%- assign parts = item.url | split: "/" -%}
  {%- assign fname = parts | last | replace: ".jpg", "" -%}
  {%- assign pair = fname | append: "|||" | append: item.caption -%}
  {%- assign morph_pairs = morph_pairs | push: pair -%}
{%- endfor -%}

<section class="gallery-morph v2-scope" aria-label="Photographic introduction">
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
<script src="{{ '/assets/js/gallery-morph.js' | relative_url }}" defer></script>

<section class="gallery-v2 v2-scope wrap wrap--wide">
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Gallery</p>
  <h1 class="page-title">Gallery</h1>
  <p class="section__intro v2-corner-frame">A visual record spanning the laboratory, the field and professional life.</p>

  <h2 class="section__title section__title--sub">Portraits &amp; professional photography</h2>
  <div class="fan-carousel" data-autoplay="5500">
    <div class="fan-carousel__deck">
      {% for p in site.data.gallery_portraits %}
      <div class="fan-carousel__card" data-caption="{{ p.caption | escape }}" role="button" tabindex="0" aria-label="{{ p.caption | escape }} — view full size">
        <img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy">
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

  <h2 class="section__title section__title--sub">Community &amp; field work</h2>
  <div class="fan-carousel" data-autoplay="6000">
    <div class="fan-carousel__deck">
      {% for p in site.data.gallery_photos %}
      <div class="fan-carousel__card" data-caption="{{ p.caption | escape }}" role="button" tabindex="0" aria-label="{{ p.caption | escape }} — view full size">
        <img src="{{ p.url }}" alt="{{ p.caption }}" loading="lazy">
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
</section>

<script src="{{ '/assets/js/gallery-fx.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/fan-carousel.js' | relative_url }}" defer></script>
