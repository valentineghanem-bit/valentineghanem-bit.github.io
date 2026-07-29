---
layout: v3
permalink: /skills/
title: "Skills, Methods and Technical Practice"
description: "Applied public-health, data-science and cross-disciplinary medical-laboratory practice of Valentine Golden Ghanem, supported by documented methods, platforms and professional evidence."
jsonld: skills
extra_css: ["skills-v2.css"]
extra_js: ["skills-v4.js"]
---
{% include nav-v3.html %}
{%- assign practice_count = 0 -%}
{%- for section in site.data.skills -%}
  {%- for group in section.groups -%}
    {%- assign practice_count = practice_count | plus: group.items.size -%}
  {%- endfor -%}
{%- endfor -%}

<main class="skills-v4" id="main-content" data-skills-v4>
  <section class="skills-hero"
           data-nav-marker="00"
           data-nav-label="Top"
           data-nav-colour="#22D3EE"
           aria-labelledby="skillsHeroTitle">
    <img class="skills-hero__background"
         src="{{ '/assets/img/gallery/portraits/outdoor-portrait-green-pattern.jpg' | relative_url }}"
         alt="Valentine Golden Ghanem reviewing laboratory information on a tablet beside a clinical analyser"
         width="1448"
         height="1086"
         fetchpriority="high">
    <div class="skills-hero__inner">
      <div class="skills-hero__copy">
        <p class="skills-v4__breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Skills</p>
        <p class="skills-v4__eyebrow">Applied practice / evidence / methods</p>
        <h1 id="skillsHeroTitle">Skills, methods and <span>technical practice.</span></h1>
        <p class="skills-hero__lede">
          Valentine Golden Ghanem works across medical laboratory science,
          public-health epidemiology and reproducible data analysis. This record
          covers routine and specialist laboratory workflows, analytical methods,
          professional applications and the evidence routes that support them.
        </p>
        <div class="skills-hero__actions">
          <a href="#practice-architecture">
            <i class="fa-solid fa-route" aria-hidden="true"></i>
            Explore practice architecture
          </a>
          <a href="#methods-registry" class="skills-hero__action--secondary">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            Search methods registry
          </a>
        </div>
        <dl class="skills-hero__metrics" aria-label="Skills evidence summary">
          <div><dt>3</dt><dd>practice domains</dd></div>
          <div><dt>9</dt><dd>evidence cells</dd></div>
          <div><dt>{{ practice_count }}</dt><dd>practice statements</dd></div>
          <div><dt>{{ site.data.technical_stack.size }}</dt><dd>methods and platforms</dd></div>
        </dl>
      </div>

      <aside class="skills-hero__lattice" aria-label="Select a practice domain">
        <header>
          <p>Practice domains</p>
          <span>Methods are linked to interpretation and professional application.</span>
        </header>
        <div class="skills-hero__lanes">
          <button type="button" data-hero-domain="Public Health" style="--domain-accent:#34D399">
            <span class="skills-hero__lane-mark"><i class="fa-solid fa-people-group" aria-hidden="true"></i></span>
            <span><strong>Public Health</strong><small>Surveillance, screening and programme interpretation</small></span>
            <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </button>
          <button type="button" data-hero-domain="Data Science" style="--domain-accent:#A78BFA">
            <span class="skills-hero__lane-mark"><i class="fa-solid fa-code" aria-hidden="true"></i></span>
            <span><strong>Data Science</strong><small>Modelling, spatial analysis and reproducible systems</small></span>
            <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </button>
          <button type="button" data-hero-domain="Biomedical Science" style="--domain-accent:#F87171">
            <span class="skills-hero__lane-mark"><i class="fa-solid fa-flask-vial" aria-hidden="true"></i></span>
            <span><strong>Biomedical Science</strong><small>Chemistry, haematology, immunoassay, microscopy, microbiology and quality systems</small></span>
            <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
          </button>
        </div>
        <p class="skills-hero__disclosure">
          Counts describe documented inventory items. They are not proficiency scores.
        </p>
      </aside>
    </div>
  </section>

  <section id="practice-architecture"
           class="skills-practice"
           data-nav-marker="01"
           data-nav-label="Practice"
           data-nav-colour="#34D399"
           aria-labelledby="skillsPracticeTitle">
    <div class="skills-v4__inner">
      <header class="skills-v4__section-header">
        <span class="skills-v4__ghost" aria-hidden="true">01</span>
        <p>01 - Practice architecture</p>
        <h2 id="skillsPracticeTitle">Three domains of applied professional practice</h2>
        <span>
          Select a domain and stage to inspect the documented practice behind it.
          The pathway describes how work is applied; it does not rank ability.
        </span>
      </header>

      <div class="skills-practice__workspace">
        <div class="skills-practice__domains" role="tablist" aria-label="Practice domains">
          <button type="button" id="skills-domain-public-health" role="tab" aria-selected="true" aria-controls="skillsPracticeInspector" tabindex="0" data-practice-domain="Public Health" style="--domain-accent:#34D399">
            <span>01</span><strong>Public Health</strong><small>Population evidence</small>
          </button>
          <button type="button" id="skills-domain-data-science" role="tab" aria-selected="false" aria-controls="skillsPracticeInspector" tabindex="-1" data-practice-domain="Data Science" style="--domain-accent:#A78BFA">
            <span>02</span><strong>Data Science</strong><small>Analytical systems</small>
          </button>
          <button type="button" id="skills-domain-biomedical-science" role="tab" aria-selected="false" aria-controls="skillsPracticeInspector" tabindex="-1" data-practice-domain="Biomedical Science" style="--domain-accent:#F87171">
            <span>03</span><strong>Biomedical Science</strong><small>Diagnostic evidence</small>
          </button>
        </div>

        <div class="skills-practice__path" aria-label="Practice stages">
          <div class="skills-practice__path-line" aria-hidden="true"><i></i></div>
          <button type="button" data-practice-stage="Technical" aria-pressed="true">
            <span>01</span><strong>Technical</strong><small>Methods and systems</small>
          </button>
          <button type="button" data-practice-stage="Analytical" aria-pressed="false">
            <span>02</span><strong>Analytical</strong><small>Interpretation and validation</small>
          </button>
          <button type="button" data-practice-stage="Leadership" aria-pressed="false">
            <span>03</span><strong>Leadership</strong><small>Coordination and application</small>
          </button>
        </div>

        <article id="skillsPracticeInspector"
                 class="skills-practice__inspector"
                 role="tabpanel"
                 aria-labelledby="skills-domain-public-health"
                 aria-live="polite">
          <header>
            <p data-practice-kicker>Public Health / Technical</p>
            <span data-practice-count>3 documented statements</span>
          </header>
          <h3 data-practice-title>Public-health technical practice</h3>
          <p data-practice-summary>
            Laboratory-informed surveillance, community screening and interpretation
            of diagnostic evidence for population-health reporting.
          </p>
          <ul data-practice-items>
            {% assign initial_group = site.data.skills[0].groups | where: "name", "Public Health" | first %}
            {% for item in initial_group.items %}<li>{{ item }}</li>{% endfor %}
          </ul>
          <a href="{{ '/community/' | relative_url }}" data-practice-route>
            View field-practice evidence <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </a>
        </article>
      </div>

      <div class="skills-matrix-v4" aria-labelledby="skillsMatrixTitle">
        <div class="skills-matrix-v4__intro">
          <p>Evidence matrix</p>
          <h3 id="skillsMatrixTitle">Select a practice domain and evidence stage</h3>
          <span>Each number is the count of documented statements in that cell.</span>
        </div>
        <div class="skills-matrix-v4__table" role="group" aria-label="Skills evidence matrix">
          <div class="skills-matrix-v4__corner" aria-hidden="true">Stage / Domain</div>
          {% for domain_group in site.data.skills[0].groups %}
          <div class="skills-matrix-v4__column">{{ domain_group.name }}</div>
          {% endfor %}
          {% for section in site.data.skills %}
          <div class="skills-matrix-v4__row">{{ section.category }}</div>
            {% for domain_group in section.groups %}
            <button type="button"
                    data-matrix-domain="{{ domain_group.name }}"
                    data-matrix-stage="{{ section.category }}"
                    aria-label="{{ domain_group.name }}, {{ section.category }}: {{ domain_group.items.size }} documented statements">
              <strong>{{ domain_group.items.size }}</strong>
              <span>Open evidence</span>
            </button>
            {% endfor %}
          {% endfor %}
        </div>
      </div>
    </div>
  </section>

  <section id="methods-registry"
           class="skills-registry"
           data-nav-marker="02"
           data-nav-label="Methods"
           data-nav-colour="#A78BFA"
           aria-labelledby="skillsRegistryTitle">
    <div class="skills-v4__inner">
      <header class="skills-v4__section-header skills-v4__section-header--light">
        <span class="skills-v4__ghost" aria-hidden="true">02</span>
        <p>02 - Methods registry</p>
        <h2 id="skillsRegistryTitle">Methods, platforms and analytical systems</h2>
        <span>
          Search the complete technical inventory. Selecting a record explains
          its role in Valentine Golden Ghanem's work and points to related evidence.
        </span>
      </header>

      <div class="skills-registry__controls">
        <div class="skills-registry__search">
          <label for="skillsRegistrySearch">Search the registry</label>
          <div>
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input type="search" id="skillsRegistrySearch" placeholder="Search Python, microscopy, immunoassay..." autocomplete="off">
            <button type="button" data-registry-reset aria-label="Clear registry search" title="Clear search">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="skills-registry__segments" role="group" aria-label="Registry type">
          <button type="button" data-registry-rail="all" aria-pressed="true">All</button>
          <button type="button" data-registry-rail="tools" aria-pressed="false">Tools</button>
          <button type="button" data-registry-rail="methods" aria-pressed="false">Methods</button>
        </div>
        <div class="skills-registry__filters" role="group" aria-label="Registry category">
          <button type="button" data-registry-category="all" aria-pressed="true">All fields</button>
          <button type="button" data-registry-category="code" aria-pressed="false">Code</button>
          <button type="button" data-registry-category="spatial" aria-pressed="false">Spatial</button>
          <button type="button" data-registry-category="modelling" aria-pressed="false">Models</button>
          <button type="button" data-registry-category="public-health" aria-pressed="false">Epidemiology</button>
          <button type="button" data-registry-category="laboratory" aria-pressed="false">Laboratory disciplines</button>
        </div>
        {% assign laboratory_items = site.data.technical_stack | where: "category", "laboratory" %}
        {% assign laboratory_groups = laboratory_items | group_by: "group" | sort: "name" %}
        <div class="skills-registry__discipline">
          <label for="skillsLaboratoryGroup">Laboratory discipline</label>
          <select id="skillsLaboratoryGroup">
            <option value="all">All laboratory disciplines</option>
            {% for group in laboratory_groups %}
              {% if group.name != "" %}<option value="{{ group.name | escape }}">{{ group.name }}</option>{% endif %}
            {% endfor %}
          </select>
        </div>
        <p class="skills-registry__status" data-registry-status aria-live="polite">{{ site.data.technical_stack.size }} records shown</p>
      </div>

      <p class="skills-registry__disclosure">
        Laboratory records distinguish applied platform practice, documented
        operational methods, quality leadership, and academic or continuing
        professional development foundations. Inventory counts are not proficiency scores.
      </p>

      <div class="skills-registry__workspace">
        <div class="skills-registry__list" data-registry-list>
          {% for item in site.data.technical_stack %}
          <button type="button"
                  class="skills-registry__item{% if forloop.first %} is-active{% endif %}"
                  data-registry-item
                  data-registry-name="{{ item.name | escape }}"
                  data-registry-detail="{{ item.detail | escape }}"
                  data-registry-category="{{ item.category }}"
                  data-registry-rail="{{ item.rail }}"
                  data-registry-group="{{ item.group | default: item.category | escape }}"
                  data-registry-scope="{{ item.scope | default: item.rail | escape }}"
                  aria-pressed="{% if forloop.first %}true{% else %}false{% endif %}">
            <span class="skills-registry__mark" aria-hidden="true">
              {% if item.icon %}<i class="{{ item.icon }}"></i>{% else %}{{ item.mark }}{% endif %}
            </span>
            <span><strong>{{ item.name }}</strong><small>{{ item.group | default: item.category | replace: "-", " " }}</small></span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          {% endfor %}
        </div>

        <aside class="skills-registry__inspector" aria-live="polite">
          <p>Selected registry record</p>
          <span class="skills-registry__inspector-mark" data-registry-inspector-mark aria-hidden="true"><i class="fa-brands fa-python"></i></span>
          <h3 data-registry-inspector-name>Python</h3>
          <span data-registry-inspector-category>Code / Tool</span>
          <p data-registry-inspector-detail>Disease modelling, spatial analysis, reproducible pipelines and dashboard engineering.</p>
          <a href="{{ '/portfolio/' | relative_url }}" data-registry-route>
            Inspect related project evidence <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </a>
        </aside>
      </div>
      <p class="skills-registry__empty" data-registry-empty hidden>No registry records match the current search and filters.</p>

      <aside class="skills-registry__standards" aria-labelledby="skillsStandardsTitle">
        <div>
          <p>Standards basis</p>
          <h3 id="skillsStandardsTitle">Laboratory practice is organised by the complete path of workflow.</h3>
        </div>
        <p>
          The registry follows the pre-examination, examination and post-examination
          sequence used in laboratory quality management. Microscopy records include
          specimen preparation, optical examination, morphology, reporting and quality
          control rather than treating microscopy as one isolated technique.
        </p>
        <nav aria-label="Laboratory practice references">
          <a href="https://www.who.int/publications/i/item/9789241548274" rel="noopener noreferrer">WHO laboratory quality handbook</a>
          <a href="https://clsi.org/resources/insights-blog/implementing-a-quality-management-system-in-the-laboratory/" rel="noopener noreferrer">CLSI quality-system essentials</a>
          <a href="https://www.cdc.gov/lab-quality/php/ppmp/index.html" rel="noopener noreferrer">CDC microscopy guidance</a>
        </nav>
      </aside>
    </div>
  </section>

  <script type="application/json" id="skillsPracticeData">
  [
    {% for domain_group in site.data.skills[0].groups %}
    {
      "name": {{ domain_group.name | jsonify }},
      "stages": [
        {% for section in site.data.skills %}
        {% assign matched_group = section.groups | where: "name", domain_group.name | first %}
        {
          "category": {{ section.category | jsonify }},
          "items": {{ matched_group.items | jsonify }}
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
      ]
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
  </script>
</main>

{% include footer-v3.html %}
