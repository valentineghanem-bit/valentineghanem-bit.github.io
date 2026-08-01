---
layout: v3
permalink: /portfolio/
title: "Research Systems and Applied Projects"
browser_title: "Research Portfolio | Valentine Ghanem"
description: "Research repositories, dashboards, models, analytical pipelines and applied projects by Valentine Golden Ghanem."
jsonld: portfolio
extra_css: ["portfolio-v2.css"]
extra_js: ["portfolio-fx.js"]
---
{% include nav-v3.html %}
{% assign repositories = site.data.portfolio.repositories %}
{% assign dashboard_count = 0 %}
{% assign poster_count = 0 %}
{% for project in repositories %}
  {% if project.dashboard_path %}{% assign dashboard_count = dashboard_count | plus: 1 %}{% endif %}
  {% if project.poster_path %}{% assign poster_count = poster_count | plus: 1 %}{% endif %}
{% endfor %}
{% assign infectious_count = repositories | where: "domain", "infectious-disease" | size %}
{% assign maternal_count = repositories | where: "domain", "maternal-child" | size %}
{% assign systems_count = repositories | where: "domain", "health-systems" | size %}
{% assign ncd_count = repositories | where: "domain", "forecasting-ncd" | size %}
{% assign synthesis_count = repositories | where: "domain", "evidence-synthesis" | size %}
{% assign initial_project = repositories | first %}

<main class="portfolio-v3" id="main-content" data-portfolio-v3>
  <section class="portfolio-hero"
           data-nav-marker="00"
           data-nav-label="Systems"
           data-nav-colour="#FBBF24"
           aria-labelledby="portfolioHeroTitle">
    <img class="portfolio-hero__background"
         src="{{ '/assets/img/gallery/portraits/cocoa-clinic-locations-map.jpg' | relative_url }}"
         alt="Valentine Golden Ghanem at a desk with public health policy and health systems research books"
         width="1536"
         height="1024"
         fetchpriority="high">
    <div class="portfolio-v3__inner portfolio-hero__inner">
      <div class="portfolio-hero__copy">
        <p class="portfolio-v3__breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Portfolio</p>
      <p class="portfolio-v3__eyebrow">Repositories / dashboards / models / reproducible analysis</p>
      <h1 id="portfolioHeroTitle">Research repositories built for <span>inspection and reuse.</span></h1>
        <p class="portfolio-hero__lede">
          Valentine Golden Ghanem's portfolio documents the progression from an
          epidemiological question to its dataset, reproducible analysis, spatial
          methods, model, dashboard and public code repository. Peer-reviewed
          articles and preprints are catalogued separately in the
          <a href="{{ '/publications/' | relative_url }}">academic repository</a>.
        </p>
        <div class="portfolio-hero__actions">
          <a href="#repository-observatory">
            <i class="fa-brands fa-github" aria-hidden="true"></i>
            Inspect repositories
          </a>
          <a href="#practice-archive" class="portfolio-hero__action--secondary">
            <i class="fa-solid fa-box-archive" aria-hidden="true"></i>
            View additional research
          </a>
        </div>
        <dl class="portfolio-hero__metrics" aria-label="Portfolio artifact summary">
          <div><dt>{{ repositories.size }}</dt><dd>research repositories</dd></div>
          <div><dt>{{ dashboard_count }}</dt><dd>interactive dashboards</dd></div>
          <div><dt>{{ poster_count }}</dt><dd>research posters</dd></div>
          <div><dt>{{ site.data.portfolio.practice_archive.size }}</dt><dd>additional research records</dd></div>
        </dl>
      </div>

      <aside class="portfolio-hero__domains" aria-labelledby="portfolioDomainsTitle">
        <header>
          <p>Research domains</p>
          <h2 id="portfolioDomainsTitle">Browse the portfolio by health question.</h2>
        </header>
        <div>
          <button type="button" data-portfolio-domain-jump="infectious-disease" style="--domain-accent:#F87171">
            <span>01</span><strong>Infectious disease</strong><small>{{ infectious_count }} repositories</small><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          <button type="button" data-portfolio-domain-jump="maternal-child" style="--domain-accent:#34D399">
            <span>02</span><strong>Maternal &amp; child health</strong><small>{{ maternal_count }} repositories</small><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          <button type="button" data-portfolio-domain-jump="health-systems" style="--domain-accent:#22D3EE">
            <span>03</span><strong>Health systems &amp; equity</strong><small>{{ systems_count }} repositories</small><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          <button type="button" data-portfolio-domain-jump="forecasting-ncd" style="--domain-accent:#FBBF24">
            <span>04</span><strong>Forecasting &amp; NCDs</strong><small>{{ ncd_count }} repositories</small><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          <button type="button" data-portfolio-domain-jump="evidence-synthesis" style="--domain-accent:#A78BFA">
            <span>05</span><strong>Evidence synthesis</strong><small>{{ synthesis_count }} repositor{% if synthesis_count == 1 %}y{% else %}ies{% endif %}</small><i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
        <p>Counts refer to public repositories, not publications.</p>
      </aside>
    </div>
  </section>

  <section id="repository-observatory"
           class="portfolio-observatory"
           data-nav-marker="01"
           data-nav-label="Repositories"
           data-nav-colour="#34D399"
           aria-labelledby="portfolioObservatoryTitle">
    <div class="portfolio-v3__inner">
      <header class="portfolio-v3__section-header">
        <span aria-hidden="true">01</span>
        <p>01 - Public repository index</p>
        <h2 id="portfolioObservatoryTitle">Repositories, models and decision-support outputs</h2>
        <em>
          Search the public research-repository inventory. Select a record to review
          its methods and open the repository, dashboard or poster.
        </em>
      </header>

      <div class="portfolio-observatory__controls">
        <label for="portfolioSearch">Search repositories</label>
        <div class="portfolio-observatory__search">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          <input id="portfolioSearch" type="search" placeholder="Search HIV, LISA, forecasting, equity..." autocomplete="off">
          <button type="button" data-portfolio-reset aria-label="Clear portfolio search" title="Clear search">
            <i class="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
        </div>
        <div class="portfolio-observatory__filters" role="group" aria-label="Project domain">
          <button type="button" data-portfolio-domain="all" aria-pressed="true">All domains</button>
          <button type="button" data-portfolio-domain="infectious-disease" aria-pressed="false">Infectious disease</button>
          <button type="button" data-portfolio-domain="maternal-child" aria-pressed="false">Maternal &amp; child</button>
          <button type="button" data-portfolio-domain="health-systems" aria-pressed="false">Systems &amp; equity</button>
          <button type="button" data-portfolio-domain="forecasting-ncd" aria-pressed="false">Forecasting &amp; NCDs</button>
          <button type="button" data-portfolio-domain="evidence-synthesis" aria-pressed="false">Evidence synthesis</button>
        </div>
        <div class="portfolio-observatory__artifacts" role="group" aria-label="Available artifact">
          <button type="button" data-portfolio-artifact="all" aria-pressed="true">All artifacts</button>
          <button type="button" data-portfolio-artifact="dashboard" aria-pressed="false">Dashboard</button>
          <button type="button" data-portfolio-artifact="poster" aria-pressed="false">Poster</button>
          <button type="button" data-portfolio-artifact="repository" aria-pressed="false">Repository</button>
        </div>
        <p data-portfolio-status aria-live="polite">{{ repositories.size }} repositories shown</p>
      </div>

      <div class="portfolio-observatory__workspace">
        <div class="portfolio-observatory__ledger" role="list" aria-label="Research repositories">
          {% for project in repositories %}
          <button type="button"
                  role="listitem"
                  class="portfolio-project{% if forloop.first %} is-active{% endif %}"
                  data-portfolio-project
                  data-project-title="{{ project.title | escape }}"
                  data-project-repo="{{ project.repo }}"
                  data-project-domain="{{ project.domain }}"
                  data-project-domain-label="{{ project.domain_label | escape }}"
                  data-project-scale="{{ project.scale | escape }}"
                  data-project-summary="{{ project.summary | escape }}"
                  data-project-methods="{{ project.methods | join: ' | ' | escape }}"
                  data-project-dashboard="{{ project.dashboard_path | default: '' }}"
                  data-project-poster="{{ project.poster_path | default: '' }}"
                  aria-pressed="{% if forloop.first %}true{% else %}false{% endif %}">
            <span class="portfolio-project__index">{{ forloop.index | prepend: "0" | slice: -2, 2 }}</span>
            <span class="portfolio-project__body">
              <strong>{{ project.title }}</strong>
              <small>{{ project.domain_label }} / {{ project.scale }}</small>
            </span>
            <span class="portfolio-project__artifacts" aria-label="Available artifacts">
              <i class="fa-brands fa-github" title="Repository"></i>
              {% if project.dashboard_path %}<i class="fa-solid fa-chart-line" title="Dashboard"></i>{% endif %}
              {% if project.poster_path %}<i class="fa-regular fa-image" title="Poster"></i>{% endif %}
            </span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          {% endfor %}
        </div>

        <aside class="portfolio-inspector" aria-live="polite" aria-labelledby="portfolioInspectorTitle">
          <p>Selected repository</p>
          <div class="portfolio-inspector__number" data-project-number>01</div>
          <span data-project-domain-label>{{ initial_project.domain_label }}</span>
          <h3 id="portfolioInspectorTitle" data-project-title>{{ initial_project.title }}</h3>
          <p data-project-summary>{{ initial_project.summary }}</p>
          <dl>
            <div><dt>Geographic or analytical scale</dt><dd data-project-scale>{{ initial_project.scale }}</dd></div>
            <div><dt>Methods</dt><dd data-project-methods>{{ initial_project.methods | join: " / " }}</dd></div>
            <div><dt>Repository</dt><dd data-project-repo>{{ initial_project.repo }}</dd></div>
          </dl>
          <div class="portfolio-inspector__actions">
            <a href="https://github.com/valentineghanem-bit/{{ initial_project.repo }}" data-project-repository target="_blank" rel="noopener noreferrer">
              <i class="fa-brands fa-github" aria-hidden="true"></i> Open repository
            </a>
            <a href="https://htmlpreview.github.io/?https://github.com/valentineghanem-bit/{{ initial_project.repo }}/blob/main/{{ initial_project.dashboard_path }}"
               data-project-dashboard target="_blank" rel="noopener noreferrer">
              <i class="fa-solid fa-chart-line" aria-hidden="true"></i> Launch dashboard
            </a>
            <a href="https://htmlpreview.github.io/?https://github.com/valentineghanem-bit/{{ initial_project.repo }}/blob/main/{{ initial_project.poster_path }}"
               data-project-poster target="_blank" rel="noopener noreferrer">
              <i class="fa-regular fa-image" aria-hidden="true"></i> View research poster
            </a>
          </div>
          <p class="portfolio-inspector__note">
            Code and visual outputs should be read alongside the methods, limitations
            and interpretation reported in the associated scholarly record.
          </p>
        </aside>
      </div>
      <p class="portfolio-observatory__empty" data-portfolio-empty hidden>No repositories match the current search and filters.</p>
    </div>
  </section>

  <section id="practice-archive"
           class="portfolio-archive"
           data-nav-marker="02"
           data-nav-label="Archive"
           data-nav-colour="#A78BFA"
           aria-labelledby="portfolioArchiveTitle">
    <div class="portfolio-v3__inner">
      <header class="portfolio-v3__section-header portfolio-v3__section-header--dark">
        <span aria-hidden="true">02</span>
        <p>02 - Additional research</p>
        <h2 id="portfolioArchiveTitle">Capstone and laboratory research</h2>
        <em>
          These projects predate the current repository structure or fall outside
          the Ghana district-research series. They remain part of the professional record.
        </em>
      </header>
      <div class="portfolio-archive__grid">
        {% for project in site.data.portfolio.practice_archive %}
        <article>
          <p>{{ project.category }}</p>
          <h3>{{ project.title }}</h3>
          <span>{{ project.context }}</span>
          <p>{{ project.summary }}</p>
          <div>
            {% for link in project.links %}
            <a href="{{ link.url }}" {% if link.url contains "http" %}target="_blank" rel="noopener noreferrer"{% endif %}>
              {{ link.label }} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </a>
            {% endfor %}
          </div>
        </article>
        {% endfor %}
      </div>
    </div>
  </section>
</main>

{% include footer-v3.html %}
