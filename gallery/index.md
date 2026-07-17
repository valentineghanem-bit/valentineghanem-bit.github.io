---
layout: default
permalink: /gallery/
title: "Gallery"
description: "Photography of Valentine Golden Ghanem, Ghanaian medical scientist and epidemiologist, in the laboratory and in the field."
---

<section class="section wrap wrap--wide wrap--centered">
  <p class="breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Gallery</p>
  <h1 class="page-title">Gallery</h1>
  <p class="section__intro">A visual record spanning the laboratory, the field and professional life.</p>

  <h2 class="section__title section__title--sub">Portraits &amp; professional photography</h2>
  <div class="carousel" data-autoplay="6500">
    <div class="carousel__viewport">
      <div class="carousel__track">
        {% for p in site.data.gallery_portraits %}
        <figure class="carousel__slide{% if p.contain %} carousel__slide--contain{% endif %}">
          <img src="{{ p.url | relative_url }}" alt="{{ p.caption }}" loading="lazy">
          <figcaption>{{ p.caption }}</figcaption>
        </figure>
        {% endfor %}
      </div>
    </div>
    <button type="button" class="carousel__arrow carousel__arrow--prev" aria-label="Previous photo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button type="button" class="carousel__arrow carousel__arrow--next" aria-label="Next photo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="carousel__dots"></div>
  </div>

  <h2 class="section__title section__title--sub">Community &amp; field work</h2>
  <div class="carousel" data-autoplay="6000">
    <div class="carousel__viewport">
      <div class="carousel__track">
        {% for p in site.data.gallery_photos %}
        <figure class="carousel__slide{% if p.contain %} carousel__slide--contain{% endif %}">
          <img src="{{ p.url }}" alt="{{ p.caption }}" loading="lazy">
          <figcaption>{{ p.caption }}</figcaption>
        </figure>
        {% endfor %}
      </div>
    </div>
    <button type="button" class="carousel__arrow carousel__arrow--prev" aria-label="Previous photo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button type="button" class="carousel__arrow carousel__arrow--next" aria-label="Next photo">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="carousel__dots"></div>
  </div>
</section>
