---
layout: v3
permalink: /publications/
title: "Publications and Preprints"
browser_title: "Publications and Preprints | Valentine Ghanem"
description: "Peer-reviewed articles, preprints and reproducible research records by Valentine Golden Ghanem in public health, spatial epidemiology and health-data science."
jsonld: publications
extra_css: ["publications-v2.css"]
extra_js: ["publications-v5.js"]
---
{% include nav-v3.html %}
{%- assign peer_reviewed = site.data.publications | where: "record_type", "peer_reviewed" -%}
{%- assign preprints = site.data.publications | where: "record_type", "preprint" -%}
{%- assign repositories = site.data.publications | where: "record_type", "repository" -%}
{%- assign connected_count = 0 -%}
{%- for pub in site.data.publications -%}
  {%- if pub.links and pub.links.size > 0 -%}
    {%- assign connected_count = connected_count | plus: 1 -%}
  {%- endif -%}
{%- endfor -%}

<main class="publications-v5" id="main-content" data-publications-v5>
  <section class="publications-hero"
           data-nav-marker="00"
           data-nav-label="Top"
           data-nav-colour="#A78BFA"
           aria-labelledby="publicationsHeroTitle">
    <img class="publications-hero__background"
         src="{{ '/assets/img/gallery/portraits/medical-team-dispensing.jpg' | relative_url }}"
         alt="Valentine Golden Ghanem reviewing epidemiological trends and a Ghana disease map during a public-health policy workshop"
         width="1536"
         height="1024"
         fetchpriority="high">
    <div class="publications-shell publications-hero__inner">
      <div class="publications-hero__copy">
        <p class="publications-breadcrumb"><a href="{{ '/' | relative_url }}">Home</a> / Publications</p>
        <p class="publications-eyebrow">Scholarly record / evidence / reproducibility</p>
        <h1 id="publicationsHeroTitle">Publications, preprints <span>and reproducible research.</span></h1>
        <p class="publications-hero__summary">
          Valentine Golden Ghanem's academic record covers health equity, infectious-disease
          epidemiology, spatial analysis and machine learning. Each entry states its
          publication status, methods, limitations and associated analytical outputs.
        </p>
        <div class="publications-hero__actions">
          <a href="#scholarly-record">
            <i class="fa-solid fa-book-open" aria-hidden="true"></i>
            Browse scholarly record
          </a>
          <a href="#research-identifiers" class="publications-action--secondary">
            <i class="fa-solid fa-fingerprint" aria-hidden="true"></i>
            Open researcher profiles
          </a>
        </div>
        <dl class="publications-hero__metrics" aria-label="Scholarly record summary">
          <div><dt>{{ peer_reviewed.size }}</dt><dd>peer-reviewed articles</dd></div>
          <div><dt>{{ preprints.size }}</dt><dd>preprints</dd></div>
          <div><dt>{{ repositories.size }}</dt><dd>data and software deposit{% if repositories.size != 1 %}s{% endif %}</dd></div>
          <div><dt>{{ connected_count }}</dt><dd>records with associated outputs</dd></div>
        </dl>
      </div>
    </div>
  </section>

  <section class="publications-record"
           id="scholarly-record"
           data-nav-marker="01"
           data-nav-label="Record"
           data-nav-colour="#22D3EE"
           aria-labelledby="scholarlyRecordTitle">
    <div class="publications-shell">
      <header class="publications-section__header">
        <span class="publications-section__number" aria-hidden="true">01</span>
        <p>01 - Scholarly record</p>
        <h2 id="scholarlyRecordTitle">Peer-reviewed articles, preprints and research deposits</h2>
        <span>
          Search by title, journal or method, then review the evidence, methods and
          supporting material for each record. Preprints and repository deposits are
          identified separately from peer-reviewed articles.
        </span>
      </header>

      <div class="publications-controls" aria-label="Filter scholarly records">
        <div class="publications-search">
          <label for="publicationSearch">Search title, journal or method</label>
          <div>
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <input type="search"
                   id="publicationSearch"
                   placeholder="Search HIV, NHIS, LISA, XGBoost..."
                   autocomplete="off">
            <button type="button" data-publication-reset aria-label="Clear publication search" title="Clear search">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <div class="publications-status-filter" role="group" aria-label="Publication status">
          <button type="button" data-publication-filter="all" aria-pressed="true">All <span>{{ site.data.publications.size }}</span></button>
          <button type="button" data-publication-filter="peer_reviewed" aria-pressed="false">Peer-reviewed <span>{{ peer_reviewed.size }}</span></button>
          <button type="button" data-publication-filter="preprint" aria-pressed="false">Preprints <span>{{ preprints.size }}</span></button>
          <button type="button" data-publication-filter="repository" aria-pressed="false">Repository <span>{{ repositories.size }}</span></button>
        </div>
        <label class="publications-sort" for="publicationSort">
          <span>Sort records</span>
          <select id="publicationSort">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A-Z</option>
          </select>
        </label>
        <p class="publications-controls__status" data-publication-status aria-live="polite">
          Showing all {{ site.data.publications.size }} records.
        </p>
      </div>

      <div class="publications-workspace">
        <nav class="publications-ledger" role="tablist" aria-label="Select a scholarly record" data-publication-list>
          {% for pub in site.data.publications %}
          <button type="button"
                  id="publication-tab-{{ forloop.index }}"
                  role="tab"
                  aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
                  aria-controls="publicationInspector"
                  tabindex="{% if forloop.first %}0{% else %}-1{% endif %}"
                  class="publications-ledger__record{% if forloop.first %} is-active{% endif %}"
                  data-publication-index="{{ forloop.index0 }}"
                  data-publication-type="{{ pub.record_type }}"
                  data-publication-year="{{ pub.year }}"
                  data-publication-title="{{ pub.title | escape }}"
                  data-publication-search="{{ pub.title | append: ' ' | append: pub.journal | append: ' ' | append: pub.summary | append: ' ' | append: pub.methods | escape }}">
            <span class="publications-ledger__number">PUB-{{ forloop.index | prepend: "00" | slice: -2, 2 }}</span>
            <span class="publications-ledger__meta">
              <b>{{ pub.status }}</b>
              <small>{{ pub.journal }} / {{ pub.year }}</small>
            </span>
            <strong>{{ pub.title }}</strong>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          {% endfor %}
        </nav>

        <article id="publicationInspector"
                 class="publications-inspector"
                 role="tabpanel"
                 aria-labelledby="publication-tab-1"
                 aria-live="polite">
          <header class="publications-inspector__header">
            <div>
              <span class="publications-record-status publications-record-status--{{ site.data.publications[0].record_type }}" data-inspector-status>{{ site.data.publications[0].status }}</span>
              <span data-inspector-source>{{ site.data.publications[0].journal }} / {{ site.data.publications[0].year }}</span>
            </div>
            <span data-inspector-record>PUB-01</span>
          </header>
          <h3 data-inspector-title>{{ site.data.publications[0].title }}</h3>

          <div class="publications-inspector__tabs" role="tablist" aria-label="Selected record details">
            <button type="button" id="publication-detail-evidence" role="tab" aria-selected="true" aria-controls="publicationDetailPanel" data-publication-view="evidence">Evidence</button>
            <button type="button" id="publication-detail-methods" role="tab" aria-selected="false" aria-controls="publicationDetailPanel" tabindex="-1" data-publication-view="methods">Methods</button>
            <button type="button" id="publication-detail-artifacts" role="tab" aria-selected="false" aria-controls="publicationDetailPanel" tabindex="-1" data-publication-view="artifacts">Artifacts</button>
          </div>

          <div id="publicationDetailPanel"
               class="publications-inspector__panel"
               role="tabpanel"
               aria-labelledby="publication-detail-evidence"
               data-inspector-panel>
            <p>{{ site.data.publications[0].summary }}</p>
            <aside>
              <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
              <span>{{ site.data.publications[0].caveat }}</span>
            </aside>
          </div>

          <div class="publications-inspector__citation">
            <span>Recommended citation</span>
            <p data-inspector-citation>{{ site.data.publications[0].citation }}</p>
          </div>

          <div class="publications-inspector__actions" data-inspector-actions>
            <a href="{{ site.data.publications[0].doi_url }}" target="_blank" rel="noopener">
              <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              Open DOI
            </a>
            <button type="button" data-copy-selected-citation>
              <i class="fa-regular fa-copy" aria-hidden="true"></i>
              Copy citation
            </button>
          </div>
        </article>
      </div>
      <p class="publications-empty" data-publications-empty hidden>No records match the current search and status filter.</p>
    </div>
  </section>

  <section class="publications-connections"
           id="research-connections"
           data-nav-marker="02"
           data-nav-label="Artifacts"
           data-nav-colour="#34D399"
           aria-labelledby="researchConnectionsTitle">
    <div class="publications-shell">
      <header class="publications-section__header publications-section__header--dark">
        <span class="publications-section__number" aria-hidden="true">02</span>
        <p>02 - Related research outputs</p>
        <h2 id="researchConnectionsTitle">Code, models and dashboards associated with the research</h2>
        <span>
          Where available, each record links to its code, dashboard, model or archived
          software. These materials accompany the research and are not counted as
          separate publications.
        </span>
      </header>

      <div class="publications-connections__list">
        {% assign connection_index = 0 %}
        {% for pub in site.data.publications %}
          {% if pub.links and pub.links.size > 0 %}
            {% assign connection_index = connection_index | plus: 1 %}
            <article class="publication-connection">
              <header>
                <span>{{ connection_index | prepend: "0" | slice: -2, 2 }}</span>
                <div>
                  <p>{{ pub.status }} / {{ pub.year }}</p>
                  <h3>{{ pub.title }}</h3>
                </div>
              </header>
              <div class="publication-connection__flow" aria-label="Research connection">
                <div><i class="fa-solid fa-book-open" aria-hidden="true"></i><span>Research record</span></div>
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                <div><i class="fa-solid fa-diagram-project" aria-hidden="true"></i><span>{{ pub.methods | join: ", " }}</span></div>
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                <div><i class="fa-brands fa-github" aria-hidden="true"></i><span>{{ pub.links.size }} connected artifact{% if pub.links.size != 1 %}s{% endif %}</span></div>
              </div>
              <nav aria-label="Technical artifacts connected to {{ pub.title }}">
                {% for link in pub.links %}
                <a href="{{ link.url }}" target="_blank" rel="noopener">
                  {% if link.label contains "dashboard" or link.label contains "Dashboard" %}
                    <i class="fa-solid fa-chart-line" aria-hidden="true"></i>
                  {% elsif link.label contains "Archived" %}
                    <i class="fa-solid fa-box-archive" aria-hidden="true"></i>
                  {% else %}
                    <i class="fa-brands fa-github" aria-hidden="true"></i>
                  {% endif %}
                  {{ link.label }}
                </a>
                {% endfor %}
              </nav>
            </article>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </section>

  <section class="publications-service"
           id="academic-service"
           data-nav-marker="03"
           data-nav-label="Service"
           data-nav-colour="#FBBF24"
           aria-labelledby="academicServiceTitle">
    <div class="publications-shell">
      <header class="publications-section__header">
        <span class="publications-section__number" aria-hidden="true">03</span>
        <p>03 - Academic service</p>
        <h2 id="academicServiceTitle">Peer-review appointments</h2>
        <span>
          Active reviewer records are shown separately from authored publications.
          Supporting certificates remain available where they have been documented.
        </span>
      </header>
      <div class="publications-service__list">
        {% for role in site.data.peer_review %}
        <article class="publication-service-card">
          <span class="publication-service-card__mark"><i class="fa-solid fa-file-circle-check" aria-hidden="true"></i></span>
          <div>
            <p>{{ role.status }} / Peer reviewer</p>
            <h3>{{ role.journal }}</h3>
            <span>{{ role.institution }}</span>
          </div>
          <nav aria-label="Evidence for peer-review appointment at {{ role.journal }}">
            <a href="{{ role.profile_url }}" target="_blank" rel="noopener">Reviewer profile</a>
            {% if role.certificate_url %}<a href="{{ role.certificate_url | relative_url }}" target="_blank" rel="noopener">Certificate</a>{% endif %}
          </nav>
        </article>
        {% endfor %}
      </div>
    </div>
  </section>

  <section class="publications-identifiers"
           id="research-identifiers"
           data-nav-marker="04"
           data-nav-label="Profiles"
           data-nav-colour="#A78BFA"
           aria-labelledby="researchIdentifiersTitle">
    <div class="publications-shell publications-identifiers__layout">
      <header class="publications-section__header publications-section__header--dark">
        <span class="publications-section__number" aria-hidden="true">04</span>
        <p>04 - Researcher identifiers</p>
        <h2 id="researchIdentifiersTitle">Verify the scholarly record at source</h2>
        <span>
          Persistent identifiers and external research profiles support author
          disambiguation, citation discovery and independent verification.
        </span>
      </header>
      <nav class="publications-profile-list" aria-label="Research profiles of Valentine Golden Ghanem">
        <a href="https://orcid.org/0009-0002-8332-0220" target="_blank" rel="noopener" style="--profile-accent:#34D399"><i class="fa-brands fa-orcid" aria-hidden="true"></i><span><strong>ORCID</strong><small>0009-0002-8332-0220</small></span></a>
        <a href="https://scholar.google.com/citations?user=06JdyxMAAAAJ" target="_blank" rel="noopener" style="--profile-accent:#22D3EE"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i><span><strong>Google Scholar</strong><small>Author profile and citations</small></span></a>
        <a href="https://www.webofscience.com/wos/author/record/NRA-8276-2025" target="_blank" rel="noopener" style="--profile-accent:#FBBF24"><i class="fa-solid fa-magnifying-glass-chart" aria-hidden="true"></i><span><strong>Web of Science</strong><small>Researcher record NRA-8276-2025</small></span></a>
        <a href="https://www.semanticscholar.org/author/Valentine-Golden-Ghanem/2368956236" target="_blank" rel="noopener" style="--profile-accent:#A78BFA"><i class="fa-solid fa-book-open-reader" aria-hidden="true"></i><span><strong>Semantic Scholar</strong><small>Author and topic index</small></span></a>
        <a href="https://www.researchgate.net/profile/Valentine-Ghanem" target="_blank" rel="noopener" style="--profile-accent:#F87171"><i class="fa-brands fa-researchgate" aria-hidden="true"></i><span><strong>ResearchGate</strong><small>Research profile</small></span></a>
        <a href="https://sciprofiles.com/profile/valentineghanem" target="_blank" rel="noopener" style="--profile-accent:#34D399"><i class="fa-solid fa-id-card-clip" aria-hidden="true"></i><span><strong>SciProfiles</strong><small>Author profile and publication record</small></span></a>
        <a href="https://www.lens.org/lens/profile/692738672/scholar" target="_blank" rel="noopener" style="--profile-accent:#63D2FF"><i class="fa-solid fa-database" aria-hidden="true"></i><span><strong>Lens</strong><small>Scholarly works profile</small></span></a>
        <a href="https://papers.ssrn.com/Sol3/Cf_Dev/AbsByAuth.cfm?per_id=10047916" target="_blank" rel="noopener" style="--profile-accent:#FFE87A"><i class="fa-solid fa-file-lines" aria-hidden="true"></i><span><strong>SSRN</strong><small>Author abstract page</small></span></a>
      </nav>
    </div>
  </section>

  <script type="application/json" id="publicationsData">{{ site.data.publications | jsonify }}</script>
</main>

{% include footer-v3.html %}
