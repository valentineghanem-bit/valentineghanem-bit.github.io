---
layout: v3
permalink: /gallery/
title: "Gallery"
browser_title: "Photographic Archive | Valentine Ghanem"
description: "A 50-image photographic archive of Valentine Golden Ghanem across clinical laboratory practice, public-health field work and professional life."
jsonld: gallery
extra_css: ["gallery-phase10.css"]
extra_js: ["gallery-morph.js", "fan-carousel.js"]
---
{% include nav-v3.html %}

<main class="gallery10" data-gallery10-root>
  <section class="gallery-morph"
           aria-labelledby="gallery10-title"
           data-nav-marker="00"
           data-nav-label="Archive"
           data-nav-colour="#9766E1">
    <div class="gallery-morph__scroller">
      <div class="gallery-morph__stage">
        <div class="gallery-morph__collage" aria-hidden="true">
          {% for p in site.data.gallery_portraits limit: 6 %}
          <img src="{{ p.thumbnail_url | relative_url }}"
               alt="Valentine Golden Ghanem - {{ p.caption }}"
               width="{{ p.width }}"
               height="{{ p.height }}"
               loading="{% if forloop.index <= 3 %}eager{% else %}lazy{% endif %}"
               {% if forloop.first %}fetchpriority="high"{% else %}fetchpriority="low"{% endif %}
               decoding="async">
          {% endfor %}
          {% for p in site.data.gallery_photos limit: 6 %}
          <img src="{{ p.thumbnail_url | relative_url }}"
               alt="Valentine Golden Ghanem - {{ p.caption }}"
               width="{{ p.width }}"
               height="{{ p.height }}"
               loading="lazy"
               fetchpriority="low"
               decoding="async">
          {% endfor %}
        </div>
        <div class="gallery-morph__intro">
          <p class="gallery10-breadcrumb"><a href="{{ '/' | relative_url }}">Home</a><span aria-hidden="true">/</span>Gallery</p>
          <p class="gallery-morph__eyebrow">Photographic archive / 50 images</p>
          <h1 class="gallery-morph__title" id="gallery10-title">A visual record of <span>practice, people and place.</span></h1>
          <p class="gallery-morph__lede">Portraiture, clinical laboratory practice and public-health field work form one documented professional record.</p>
          <div class="gallery-morph__actions">
            <a href="#professional-portraits"><i class="fa-solid fa-user-tie" aria-hidden="true"></i>View portraits</a>
            <a href="#field-record"><i class="fa-solid fa-people-group" aria-hidden="true"></i>View field record</a>
          </div>
          <dl class="gallery-morph__metrics" aria-label="Photographic archive summary">
            <div><dt>50</dt><dd>archived images</dd></div>
            <div><dt>26</dt><dd>professional portraits</dd></div>
            <div><dt>24</dt><dd>field photographs</dd></div>
          </dl>
        </div>
      </div>
    </div>
  </section>

  <section class="gallery10-wheel"
           aria-labelledby="gallery10-wheel-title">
    <div class="gallery10-wheel__orbit" data-gallery-wheel>
      {% for p in site.data.gallery_portraits %}
      <figure class="gallery10-wheel__item" data-wheel-index="{{ forloop.index0 }}">
        <img src="{{ p.thumbnail_url | relative_url }}"
             alt="Valentine Golden Ghanem - {{ p.caption }}"
             width="{{ p.width }}"
             height="{{ p.height }}"
             loading="{% if forloop.index <= 8 %}eager{% else %}lazy{% endif %}"
             decoding="async">
      </figure>
      {% endfor %}
      <div class="gallery10-wheel__centre">
        <p>Accra, Ghana &middot; Field &amp; laboratory record</p>
        <h2 id="gallery10-wheel-title">A visual record of the work</h2>
        <a href="#professional-portraits">Explore the archive <i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a>
      </div>
    </div>
  </section>

  <section id="professional-portraits"
           class="gallery10-section gallery10-section--portraits"
           data-nav-marker="01"
           data-nav-label="Portraits"
           data-nav-colour="#63D2FF"
           aria-labelledby="gallery10-portraits-title">
    <div class="gallery10-shell">
      <header class="gallery10-heading">
        <span class="gallery10-heading__number" aria-hidden="true">01</span>
        <div>
          <p class="gallery10-heading__kicker">01 &mdash; Professional Portraits</p>
          <h2 id="gallery10-portraits-title">Portraiture across laboratory and professional settings</h2>
          <p>Use the fan deck, arrow keys or swipe gesture to examine 26 portraits. Select the centred photograph to open its complete, uncropped view.</p>
        </div>
      </header>

      <div class="fan-carousel gallery10-fan"
           data-autoplay="5500"
           data-gallery-label="Professional portraits of Valentine Golden Ghanem"
           aria-labelledby="gallery10-portraits-title">
        <div class="gallery10-fan__toolbar">
          <p><span data-fan-current>1</span><span aria-hidden="true">/</span><span data-fan-total>{{ site.data.gallery_portraits.size }}</span><small>portrait</small></p>
          <button type="button" data-fan-toggle aria-pressed="false" aria-label="Pause portrait carousel" title="Pause carousel">
            <i class="fa-solid fa-pause" aria-hidden="true"></i>
          </button>
        </div>
        <div class="fan-carousel__deck">
          {% for p in site.data.gallery_portraits %}
          <div class="fan-carousel__card{% if p.contain %} fan-carousel__card--contain{% endif %}{% if p.width > p.height %} fan-carousel__card--landscape{% endif %}"
               data-caption="{{ p.caption | escape }}"
               data-full-src="{{ p.url | relative_url }}"
               role="button"
               tabindex="-1"
               aria-label="{{ p.caption | escape }} - view full-size photograph of Valentine Golden Ghanem">
            <img src="{{ p.thumbnail_url | relative_url }}"
                 alt="Valentine Golden Ghanem - {{ p.caption }}"
                 width="{{ p.width }}"
                 height="{{ p.height }}"
                 loading="lazy"
                 decoding="async">
          </div>
          {% endfor %}
        </div>
        <button type="button" class="fan-carousel__arrow fan-carousel__arrow--prev" aria-label="Previous portrait">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="fan-carousel__arrow fan-carousel__arrow--next" aria-label="Next portrait">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
        <div class="fan-carousel__dots" role="group" aria-label="Choose a professional portrait"></div>
        <p class="fan-carousel__caption" aria-live="polite"></p>
      </div>
    </div>
  </section>

  <section id="field-record"
           class="gallery10-section gallery10-section--field"
           data-nav-marker="02"
           data-nav-label="Field"
           data-nav-colour="#FF5964"
           aria-labelledby="gallery10-field-title">
    <div class="gallery10-shell">
      <header class="gallery10-heading gallery10-heading--dark">
        <span class="gallery10-heading__number" aria-hidden="true">02</span>
        <div>
          <p class="gallery10-heading__kicker">02 &mdash; Field &amp; Community Record</p>
          <h2 id="gallery10-field-title">Screening, scientific learning and public engagement</h2>
          <p>Twenty-four dated photographs document medical screening, diagnostic training, scientific meetings and community health education in Ghana.</p>
        </div>
      </header>

      <div class="fan-carousel gallery10-fan gallery10-fan--dark"
           data-autoplay="6000"
           data-gallery-label="Field and community photographs of Valentine Golden Ghanem"
           aria-labelledby="gallery10-field-title">
        <div class="gallery10-fan__toolbar">
          <p><span data-fan-current>1</span><span aria-hidden="true">/</span><span data-fan-total>{{ site.data.gallery_photos.size }}</span><small>field image</small></p>
          <button type="button" data-fan-toggle aria-pressed="false" aria-label="Pause field carousel" title="Pause carousel">
            <i class="fa-solid fa-pause" aria-hidden="true"></i>
          </button>
        </div>
        <div class="fan-carousel__deck">
          {% for p in site.data.gallery_photos %}
          <div class="fan-carousel__card{% if p.contain %} fan-carousel__card--contain{% endif %}{% if p.width > p.height %} fan-carousel__card--landscape{% endif %}"
               data-caption="{{ p.caption | escape }}"
               data-full-src="{{ p.url | relative_url }}"
               role="button"
               tabindex="-1"
               aria-label="{{ p.caption | escape }} - view full-size photograph of Valentine Golden Ghanem">
            <img src="{{ p.thumbnail_url | relative_url }}"
                 alt="Valentine Golden Ghanem - {{ p.caption }}"
                 width="{{ p.width }}"
                 height="{{ p.height }}"
                 loading="lazy"
                 decoding="async">
          </div>
          {% endfor %}
        </div>
        <button type="button" class="fan-carousel__arrow fan-carousel__arrow--prev" aria-label="Previous field photograph">
          <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button type="button" class="fan-carousel__arrow fan-carousel__arrow--next" aria-label="Next field photograph">
          <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
        <div class="fan-carousel__dots" role="group" aria-label="Choose a field photograph"></div>
        <p class="fan-carousel__caption" aria-live="polite"></p>
      </div>
    </div>
  </section>

<section class="gallery10-rights" id="image-licensing" aria-labelledby="gallery10-rights-title">
  <div class="gallery10-shell gallery10-rights__inner">
    <p class="gallery10-rights__eyebrow">Image rights</p>
    <h2 id="gallery10-rights-title">Photography, credit and reuse</h2>
    <p>
      Unless an image is identified as a Wikimedia Commons file with its own licence,
      photographs in this archive are part of Valentine Golden Ghanem's professional
      record and remain all rights reserved. For publication, reproduction or other
      reuse, request permission through the contact details in the site footer.
    </p>
  </div>
</section>
</main>

{% include footer-v3.html %}
