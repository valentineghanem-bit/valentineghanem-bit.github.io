---
layout: v3
permalink: /about/
jsonld: about
title: "About Valentine Golden Ghanem"
description: "Professional profile of Valentine Golden Ghanem, a Ghanaian medical scientist, epidemiologist and public health researcher."
extra_css: ["about-v3.css"]
extra_js: ["about-fx.js"]
---
{% include nav-v3.html %}
{%- assign rep_img = site.data.images | where: "representative", true | first -%}
{%- assign first_domain = site.data.about_expertise | first -%}

<main class="about-v3" id="main-content">
  <section class="about-profile-hero" aria-labelledby="aboutTitle" data-nav-marker="00" data-nav-label="Top" data-nav-colour="#22D3EE">
    <div class="about-profile-hero__grid">
      <div class="about-profile-hero__copy reveal">
        <p class="about-v3__breadcrumb"><a href="{{ '/' | relative_url }}">Home</a><span>/</span>About</p>
        <p class="about-v3__eyebrow">Medical science <b>&bull;</b> Epidemiology <b>&bull;</b> Public health</p>
        <span class="about-profile-hero__index" aria-hidden="true">00 / PROFILE</span>
        <h1 id="aboutTitle"><span>Valentine</span><span>Golden Ghanem</span></h1>
        <p class="about-profile-hero__role">{{ site.data.profile.job_titles | join: " / " }}</p>
        <p class="about-profile-hero__summary">{{ site.data.profile.about_hero_description | strip_newlines }}</p>
        <div class="about-profile-hero__actions" aria-label="About page actions">
          <a href="#professional-remit"><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> Explore professional remit</a>
          <a href="#professional-verification"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> View verified credentials</a>
        </div>
        <div class="about-profile-hero__status" aria-label="Current professional scope">
          <span><i class="fa-solid fa-flask-vial" aria-hidden="true"></i> Principal Biomedical Scientist</span>
          <span><i class="fa-solid fa-earth-africa" aria-hidden="true"></i> Accra, Ghana</span>
          <span><i class="fa-solid fa-id-card-clip" aria-hidden="true"></i> Ghana, Ireland and Netherlands</span>
        </div>
      </div>

      <figure class="about-profile-hero__portrait reveal">
        <div class="about-profile-hero__image">
          <span class="about-profile-hero__ruler" aria-hidden="true"></span>
          <img src="{{ rep_img.content_url }}"
               alt="{{ rep_img.name }}"
               width="{{ rep_img.width }}"
               height="{{ rep_img.height }}"
               loading="eager"
               fetchpriority="high"
               onerror="this.closest('figure').style.display='none'">
        </div>
        <figcaption>
          <span>{{ rep_img.caption }}</span>
          <b>Cocoa Clinic, Ghana COCOBOD</b>
        </figcaption>
      </figure>
    </div>
  </section>

  <section id="professional-remit" class="about-v3__section about-identity" aria-labelledby="aboutRemitTitle" data-nav-marker="01" data-nav-label="Identity" data-nav-colour="#34D399">
    <div class="about-v3__inner">
      <header class="about-identity__header reveal">
        <span class="about-v3__ghost" aria-hidden="true">01</span>
        <div>
          <p>01 - Professional identity</p>
          <h2 id="aboutRemitTitle">Laboratory precision, interpreted at population scale</h2>
        </div>
        <p>{{ site.data.profile.statement_of_purpose }}</p>
      </header>

      <div class="about-identity__pathway reveal" data-identity-pathway>
        <div class="about-identity__tabs" role="tablist" aria-label="Professional identity pathway">
          <button id="identity-step-evidence" type="button" role="tab" aria-selected="true" aria-controls="identityInspector" tabindex="0"
                  class="about-identity__tab is-active" style="--identity-colour:#22D3EE"
                  data-identity-number="01" data-identity-kicker="Clinical foundation"
                  data-identity-title="Diagnostic evidence"
                  data-identity-copy="Clinical laboratory operations establish evidence that clinicians and public-health teams can trust."
                  data-identity-output="Quality-assured results, operational oversight and clinically grounded interpretation.">
            <span>01</span><i class="fa-solid fa-flask-vial" aria-hidden="true"></i><strong>Evidence</strong>
          </button>
          <button id="identity-step-population" type="button" role="tab" aria-selected="false" aria-controls="identityInspector" tabindex="-1"
                  class="about-identity__tab" style="--identity-colour:#34D399"
                  data-identity-number="02" data-identity-kicker="Population lens"
                  data-identity-title="Epidemiology and surveillance"
                  data-identity-copy="Field and surveillance data place individual results within communities, services and exposure patterns."
                  data-identity-output="Patterns that clarify who is affected, where gaps persist and what deserves attention.">
            <span>02</span><i class="fa-solid fa-people-group" aria-hidden="true"></i><strong>Population</strong>
          </button>
          <button id="identity-step-decisions" type="button" role="tab" aria-selected="false" aria-controls="identityInspector" tabindex="-1"
                  class="about-identity__tab" style="--identity-colour:#A78BFA"
                  data-identity-number="03" data-identity-kicker="Decision layer"
                  data-identity-title="Spatial and data science"
                  data-identity-copy="GIS, statistical modelling and interactive tools turn population patterns into inspectable decision support."
                  data-identity-output="Reproducible maps, models and dashboards designed for action, scrutiny and reuse.">
            <span>03</span><i class="fa-solid fa-chart-line" aria-hidden="true"></i><strong>Decisions</strong>
          </button>
        </div>

        <article id="identityInspector" class="about-identity__inspector" role="tabpanel" aria-labelledby="identity-step-evidence" tabindex="0" style="--identity-colour:#22D3EE">
          <div class="about-identity__signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
          <p data-identity-kicker>Clinical foundation</p>
          <div class="about-identity__inspector-title">
            <span data-identity-number>01</span>
            <h3 data-identity-title>Diagnostic evidence</h3>
          </div>
          <p data-identity-copy>Clinical laboratory operations establish evidence that clinicians and public-health teams can trust.</p>
          <div class="about-identity__output">
            <span>Professional output</span>
            <p data-identity-output>Quality-assured results, operational oversight and clinically grounded interpretation.</p>
          </div>
        </article>

        <aside class="about-identity__context">
          <p>Operating principle</p>
          <blockquote>{{ site.data.profile.aim }}</blockquote>
          <div class="about-identity__languages">
            <span>Working languages</span>
            {% for lang in site.data.profile.languages %}<b>{{ lang.name }}</b>{% endfor %}
          </div>
        </aside>
      </div>

      <div class="about-identity__vision reveal">
        <span>Career direction</span>
        <p>{{ site.data.profile.career_vision }}</p>
      </div>
    </div>
  </section>

  <section id="practice-matrix" class="about-v3__section about-matrix" aria-labelledby="aboutMatrixTitle" data-nav-marker="02" data-nav-label="Expertise" data-nav-colour="#A78BFA">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">02</span>
        <p>02 - Expertise</p>
        <h2 id="aboutMatrixTitle">Multi-Disciplinary Practice Matrix</h2>
        <span>Five connected domains, each tied to methods, professional evidence and a practical output.</span>
      </header>

      <div class="about-matrix__workspace reveal" data-about-matrix>
        <div class="about-matrix__tabs" role="tablist" aria-label="Professional expertise domains">
          {% for domain in site.data.about_expertise %}
          <button type="button"
                  id="about-domain-{{ domain.id }}"
                  role="tab"
                  aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
                  aria-controls="aboutMatrixInspector"
                  tabindex="{% if forloop.first %}0{% else %}-1{% endif %}"
                  class="about-matrix__tab{% if forloop.first %} is-active{% endif %}"
                  style="--domain-colour:{{ domain.colour }}"
                  data-domain-id="{{ domain.id }}"
                  data-domain-number="{{ domain.number }}"
                  data-domain-title="{{ domain.title | escape }}"
                  data-domain-remit="{{ domain.remit | escape }}"
                  data-domain-methods="{{ domain.methods | join: '||' | escape }}"
                  data-domain-evidence="{{ domain.evidence | escape }}"
                  data-domain-output="{{ domain.output | escape }}">
            <span>{{ domain.number }}</span>
            <strong>{{ domain.title }}</strong>
            <small>{{ domain.short }}</small>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          {% endfor %}
        </div>

        <article id="aboutMatrixInspector" class="about-matrix__inspector" role="tabpanel" aria-labelledby="about-domain-{{ first_domain.id }}" style="--domain-colour:{{ first_domain.colour }}">
          <header>
            <span data-matrix-number>{{ first_domain.number }}</span>
            <div>
              <p>Active practice domain</p>
              <h3 data-matrix-title>{{ first_domain.title }}</h3>
            </div>
          </header>
          <p class="about-matrix__remit" data-matrix-remit>{{ first_domain.remit }}</p>
          <div class="about-matrix__methods" data-matrix-methods aria-label="Methods">
            {% for method in first_domain.methods %}<span>{{ method }}</span>{% endfor %}
          </div>
          <div class="about-matrix__evidence">
            <section>
              <p>Professional evidence</p>
              <span data-matrix-evidence>{{ first_domain.evidence }}</span>
            </section>
            <section>
              <p>Practical output</p>
              <span data-matrix-output>{{ first_domain.output }}</span>
            </section>
          </div>
          <div class="about-matrix__signal" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        </article>
      </div>
    </div>
  </section>

  <section id="professional-verification" class="about-v3__section about-verification" aria-labelledby="aboutVerificationTitle" data-nav-marker="03" data-nav-label="Verified" data-nav-colour="#FBBF24">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">03</span>
        <p>03 - Professional verification</p>
        <h2 id="aboutVerificationTitle">Registrations, memberships and scholarly identifiers</h2>
      </header>

      <div class="about-verification__ledger reveal">
        {% for licence in site.data.profile.licensure %}
        <article class="about-verification__entry">
          <span class="about-verification__state">Registered</span>
          <p>{{ licence.jurisdiction }}</p>
          <h3>{{ licence.credential }}</h3>
          <strong>{{ licence.body }} ({{ licence.abbreviation }})</strong>
          <code>{{ licence.reg_no }}</code>
        </article>
        {% endfor %}
        {% for membership in site.data.profile.memberships %}
        <article class="about-verification__entry">
          <span class="about-verification__state">Current membership</span>
          <p>{{ membership.abbreviation }}</p>
          <h3>{% if membership.role %}{{ membership.role }}, {% endif %}{{ membership.name }}</h3>
          {% if membership.note %}<strong>{{ membership.note }}</strong>{% endif %}
          <code>{{ membership.reg_no }}</code>
        </article>
        {% endfor %}
        {% for pending in site.data.profile.certifications_in_progress %}
        <article class="about-verification__entry about-verification__entry--pending">
          <span class="about-verification__state">In progress</span>
          <p>Pending credential</p>
          <h3>{{ pending.name }}</h3>
          <strong>{{ pending.note }}</strong>
          <code>Not represented as completed</code>
        </article>
        {% endfor %}
      </div>

      <div class="about-identifiers reveal" aria-label="Scholarly identifiers">
        <p>Research identity</p>
        <div>
          {% for ident in site.data.profile.identifiers %}
          <a href="{{ ident.url }}" target="_blank" rel="noopener">
            <span>{{ ident.property_id }}</span><code>{{ ident.value }}</code><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </a>
          {% endfor %}
        </div>
      </div>
    </div>
  </section>

  <section id="academic-formation" class="about-v3__section about-education" aria-labelledby="aboutEducationTitle" data-nav-marker="04" data-nav-label="Education" data-nav-colour="#F87171">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">04</span>
        <p>04 - Academic formation</p>
        <h2 id="aboutEducationTitle">Education across laboratory science, public health, data and law</h2>
      </header>

      <div class="about-education__grid reveal">
        {% for credential in site.data.profile.credentials %}
        <article class="about-education__record{% if credential.status == 'in progress' %} is-current{% endif %}">
          <header>
            <span>{{ forloop.index | prepend: "0" | slice: -2, 2 }}</span>
            <p>{% if credential.status == "in progress" %}In progress{% else %}Completed{% endif %}</p>
          </header>
          <h3>{{ credential.name }}</h3>
          <strong>{{ credential.institution }}</strong>
          <div>
            {% if credential.year %}<span>{{ credential.year }}</span>{% endif %}
            {% if credential.note %}<span>{{ credential.note }}</span>{% endif %}
          </div>
        </article>
        {% endfor %}
      </div>
    </div>
  </section>

  <section id="career-record" class="about-v3__section about-record" aria-labelledby="aboutRecordTitle" data-nav-marker="05" data-nav-label="Career" data-nav-colour="#22D3EE">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">05</span>
        <p>05 - Career record</p>
        <h2 id="aboutRecordTitle">Clinical leadership and field practice</h2>
        <span>Filter the record, then open an entry for its professional context.</span>
      </header>

      <div class="about-record__filters reveal" role="group" aria-label="Filter career record">
        <button type="button" class="is-active" data-record-filter="all" aria-pressed="true">All practice</button>
        <button type="button" data-record-filter="practice" aria-pressed="false">Laboratory appointments</button>
        <button type="button" data-record-filter="field" aria-pressed="false">Field and outreach</button>
      </div>

      <div class="about-record__list reveal" data-about-records>
        {% for record in site.data.timeline %}
        {% if record.category == "practice" or record.category == "field" %}
        <article class="about-record__item" data-record-category="{{ record.category }}">
          <button type="button" aria-expanded="false">
            <span>{{ record.dates }}</span>
            <strong>{{ record.title }}</strong>
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
          <div class="about-record__detail" hidden>
            <p>{{ record.description }}</p>
          </div>
        </article>
        {% endif %}
        {% endfor %}
      </div>
    </div>
  </section>
</main>

{% include footer-v3.html %}
