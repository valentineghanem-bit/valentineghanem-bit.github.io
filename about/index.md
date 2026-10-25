---
layout: v3
permalink: /about/
jsonld: about
title: "Biography — Valentine Golden Ghanem"
browser_title: "Valentine Golden Ghanem | Biography"
description: "Valentine Golden Ghanem is an Accra-based Ghanaian medical laboratory scientist, epidemiologist and public-health researcher."
social_image: "/assets/img/knowledge-panel/valentine-golden-ghanem-official-portrait.jpg"
social_image_width: 810
social_image_height: 810
social_image_type: "image/jpeg"
social_image_alt: "Official professional portrait of Valentine Golden Ghanem"
extra_css: ["about-v3.css"]
extra_js: ["about-fx.js"]
---
{% include nav-v3.html %}
{%- assign rep_img = site.data.images | where: "representative", true | first -%}
{%- assign first_credential = site.data.profile.credentials | first -%}

<main class="about-v3" id="main-content">
  <section class="about-profile-hero" aria-labelledby="aboutTitle" data-nav-marker="00" data-nav-label="Top" data-nav-colour="#22D3EE">
    <div class="about-profile-hero__grid">
      <div class="about-profile-hero__copy reveal">
        <p class="about-v3__breadcrumb"><a href="{{ '/' | relative_url }}">Home</a><span>/</span>About</p>
        <p class="about-v3__eyebrow">Medical science <b>&bull;</b> Epidemiology <b>&bull;</b> Public health</p>
        <h1 id="aboutTitle"><span>Valentine</span> <span>Golden Ghanem</span></h1>
        <p class="about-profile-hero__role">{{ site.data.profile.job_titles | join: " / " }}</p>
        <p class="about-profile-hero__summary">{{ site.data.profile.about_hero_description | strip_newlines }}</p>
        <div class="about-profile-hero__actions" aria-label="About page actions">
          <a href="#professional-remit"><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> View professional practice</a>
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

  <section id="biography" class="about-v3__section about-biography" aria-labelledby="biographyTitle">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">VG</span>
        <p>Professional biography</p>
        <h2 id="biographyTitle">Biography — Valentine Golden Ghanem</h2>
        <span>A concise account of clinical practice, public-health research and professional recognition.</span>
      </header>
      <div class="about-biography__copy reveal">
        <h3 class="about-biography__subheading">Professional Profile</h3>
        <p>Valentine Golden Ghanem was born in Accra, Ghana, on 25 April 1987. He is a Ghanaian medical laboratory scientist, epidemiologist and public-health researcher whose work spans clinical laboratory science, epidemiology, data science and health-systems research. As Principal Biomedical Scientist at Cocoa Clinic, Ghana Cocoa Board, in Accra, he connects quality-assured diagnostic services and laboratory quality management with evidence-informed improvements in healthcare.</p>
        <h3 class="about-biography__subheading">Education and Current Legal Studies</h3>
        <p>Valentine holds a Bachelor of Science in Medical Laboratory Science from the University of Ghana (2013), an MSc in Public Health with Merit from the University of Suffolk, and an MSc in Data Science with Distinction from the University of East London. He is pursuing a Master of Laws (LLM) in International Law at Liverpool John Moores University. The LLM is in progress; his research examines pathogen-data sovereignty, One Health surveillance and international health-security law, with attention to Ghana’s and other countries’ responsibilities in global pathogen-data governance.</p>
        <h3 class="about-biography__subheading">Research Focus and Publications</h3>
        <p>This training in biomedical science, public health, computational methods and law informs his interdisciplinary approach to health challenges and evidence-based responses. His research focuses on machine learning, explainable artificial intelligence, spatial epidemiology and routinely collected health data. He applies these methods to infectious-disease trends, geographical health inequalities, health-insurance access and public-health surveillance, particularly in Ghana and other resource-constrained settings.</p>
        <p>His peer-reviewed research includes studies of district-level inequities in Ghana’s National Health Insurance Scheme, the spatial and socio-behavioural determinants of HIV/AIDS incidence, and HIV prognosis in sub-Saharan Africa. His methods include ensemble machine learning, classification and regression trees, spatial statistics, geographic information systems, and model-interpretation techniques such as SHapley Additive exPlanations (SHAP). His scholarly record includes three peer-reviewed journal articles, two preprints and a data-and-software repository deposit. His <a href="{{ '/publications/' | relative_url }}">publications and research record</a> and <a href="{{ '/portfolio/' | relative_url }}">research portfolio</a> provide access to code, analytical workflows, dashboards and related outputs for scrutiny and reuse.</p>
        <p>This work aims to strengthen computational epidemiology and the use of routine clinical and public-health data for disease forecasting, early warning, surveillance and equitable healthcare planning across African health systems.</p>
        <h3 class="about-biography__subheading">Clinical and Laboratory Experience</h3>
        <p>Valentine has more than a decade of experience in clinical laboratory practice, diagnostic quality management, laboratory operations and public-health activities. After completing his clinical laboratory training at Korle-Bu Teaching Hospital, he joined Cocoa Clinic in 2015. He progressed from biomedical scientist to senior biomedical scientist, then became Principal Biomedical Scientist in October 2024.</p>
        <p>His responsibilities have included supervising diagnostic workflows, overseeing quality assurance and equipment management, validating results, developing standard operating procedures and supporting continuous improvement in an ISO 15189-accredited laboratory. This experience informs his interpretation of laboratory evidence and his understanding of how diagnostic services support public-health decisions.</p>
        <h3 class="about-biography__subheading">Community Health and Surveillance</h3>
        <p>He has contributed to community health screening and to the use of routine laboratory information in surveillance and health-information systems, including Ghana’s District Health Information Management System. His work connects diagnostic evidence with analyses that identify disease patterns, assess health inequalities and inform service planning.</p>
        <h3 class="about-biography__subheading">Awards and Professional Recognition</h3>
        <p>His honours include the Unicaf Africa Prize for Academic Excellence, associated with his public-health studies. At the University of East London’s 2026 Alumni Achievement Awards, he received <a href="https://www.uel.ac.uk/about-uel/news/2026/october/uel-honours-inspiring-graduates-alumni-achievement-awards" target="_blank" rel="noopener noreferrer">The Industry of the Future Award</a>. UEL’s official announcement lists Valentine among the recipients in that category. He is a Fellow of the Royal Society for Public Health and holds medical-scientist registrations with Ghana’s Allied Health Professions Council and Ireland’s Medical Scientists Registration Board at CORU. He is also registered as an Epidemiologist A with the Vereniging voor Epidemiologie (VvE), the Netherlands Society for Epidemiology. Further evidence appears in his <a href="{{ '/certificates/#academic-awards' | relative_url }}">academic awards and professional certificates</a> and <a href="{{ '/press/#coverage-register' | relative_url }}">press coverage</a>.</p>
        <h3 class="about-biography__subheading">Media Coverage</h3>
        <p>His work has been covered by GhanaWeb, MyJoyOnline, Citi Newsroom and <a href="https://yen.com.gh/ghana/313764-ghanaian-scientist-valentine-ghanem-registered-epidemiologist-a-netherlands/" target="_blank" rel="noopener noreferrer">YEN.COM.GH</a>. Coverage has highlighted his use of data science to examine health equity and national health insurance, as well as his public-health research and professional development. A record of his media features and professional commentary is available in the <a href="{{ '/press/#coverage-register' | relative_url }}">press and media archive</a>.</p>
        <h3 class="about-biography__subheading">Future Direction</h3>
        <p>Looking ahead, Valentine aims to strengthen the capacity of the Ghana Health Service and allied institutions to apply data science, epidemiology and laboratory intelligence to public-health challenges. Through research, professional practice and collaboration, he seeks to advance reproducible public-health analytics, strengthen infectious-disease surveillance and support evidence-informed policies that improve health outcomes and equity in Ghana and across sub-Saharan Africa.</p>
        <p class="about-biography__actions"><a href="{{ site.data.profile.cv_download_url | relative_url }}" target="_blank" rel="noopener">Download current CV</a><a href="{{ '/press/' | relative_url }}">View media coverage</a></p>
      </div>
    </div>
  </section>

  <section id="professional-remit" class="about-v3__section about-identity" aria-labelledby="aboutRemitTitle" data-nav-marker="01" data-nav-label="Identity" data-nav-colour="#34D399">
    <div class="about-v3__inner">
      <header class="about-identity__header reveal">
        <span class="about-v3__ghost" aria-hidden="true">01</span>
        <div>
          <p>01 - Professional identity</p>
          <h2 id="aboutRemitTitle">From laboratory evidence to population health decisions</h2>
        </div>
        <p>{{ site.data.profile.statement_of_purpose }}</p>
      </header>

      <div class="about-identity__pathway reveal" data-identity-pathway>
        <div class="about-identity__tabs" role="tablist" aria-label="Professional identity pathway">
          <button id="identity-step-evidence" type="button" role="tab" aria-selected="true" aria-controls="identityInspector" tabindex="0"
                  class="about-identity__tab is-active" style="--identity-colour:#22D3EE"
                  data-identity-number="01" data-identity-kicker="Clinical foundation"
                  data-identity-title="Diagnostic evidence"
                  data-identity-copy="Clinical laboratory services produce quality-assured evidence for clinical and public health decision-making."
                  data-identity-output="Validated results, accountable laboratory operations and interpretation grounded in clinical practice.">
            <span>01</span><i class="fa-solid fa-flask-vial" aria-hidden="true"></i><strong>Evidence</strong>
          </button>
          <button id="identity-step-population" type="button" role="tab" aria-selected="false" aria-controls="identityInspector" tabindex="-1"
                  class="about-identity__tab" style="--identity-colour:#34D399"
                  data-identity-number="02" data-identity-kicker="Population health context"
                  data-identity-title="Epidemiology and surveillance"
                  data-identity-copy="Epidemiological and field data place clinical findings within patterns of population exposure, service access and disease distribution."
                  data-identity-output="Population evidence that identifies affected groups, persistent service gaps and priorities for response.">
            <span>02</span><i class="fa-solid fa-people-group" aria-hidden="true"></i><strong>Population</strong>
          </button>
          <button id="identity-step-decisions" type="button" role="tab" aria-selected="false" aria-controls="identityInspector" tabindex="-1"
                  class="about-identity__tab" style="--identity-colour:#A78BFA"
                  data-identity-number="03" data-identity-kicker="Analytical methods"
                  data-identity-title="Spatial and data science"
                  data-identity-copy="Spatial analysis, statistical modelling and interactive systems support the interpretation of population-level patterns."
                  data-identity-output="Reproducible maps, models and dashboards whose assumptions and findings can be examined and reused.">
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
          <p data-identity-copy>Clinical laboratory services produce quality-assured evidence for clinical and public health decision-making.</p>
          <div class="about-identity__output">
          <span>Professional application</span>
            <p data-identity-output>Validated results, accountable laboratory operations and interpretation grounded in clinical practice.</p>
          </div>
        </article>

        <aside class="about-identity__context">
          <p>Practice objective</p>
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

  <section id="professional-verification" class="about-v3__section about-verification" aria-labelledby="aboutVerificationTitle" data-nav-marker="02" data-nav-label="Verified" data-nav-colour="#FBBF24">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">02</span>
        <p>02 - Professional verification</p>
        <h2 id="aboutVerificationTitle">Registrations, memberships and researcher identifiers</h2>
        <span>Professional status is presented with the relevant jurisdiction, organisation and reference number. Credentials still in progress are identified separately.</span>
      </header>

      <div class="about-home-panel about-verification__workspace reveal" data-verification-workspace>
        <aside class="home-identity-rail about-verification__rail">
          <p class="about-home-panel__eyebrow">Verified professional record</p>
          <h3>Professional standing and current credential status</h3>
          <p>Each record names the responsible organisation, jurisdiction and reference number. Pending credentials remain clearly separated from completed registration.</p>
          <div class="about-verification__summary" aria-label="Professional verification summary">
            <span><strong>{{ site.data.profile.licensure | size }}</strong> medical-scientist registrations</span>
            <span><strong>{{ site.data.profile.professional_registrations | size }}</strong> professional registrations</span>
            <span><strong>{{ site.data.profile.memberships | size }}</strong> memberships</span>
            <span><strong>{{ site.data.profile.certifications_in_progress | size }}</strong> in progress</span>
          </div>
          <div class="about-home-panel__controls" role="group" aria-label="Filter professional verification records">
            <button type="button" class="is-active" data-verify-filter="all" aria-pressed="true">All evidence</button>
            <button type="button" data-verify-filter="licensure" aria-pressed="false">Medical-scientist licences</button>
            <button type="button" data-verify-filter="professional-registration" aria-pressed="false">Professional registrations</button>
            <button type="button" data-verify-filter="membership" aria-pressed="false">Memberships</button>
            <button type="button" data-verify-filter="pending" aria-pressed="false">In progress</button>
            <button type="button" data-verify-filter="identifiers" aria-pressed="false">Identifiers</button>
          </div>
          <a class="about-verification__archive-link" href="{{ '/certificates/' | relative_url }}">
            <i class="fa-solid fa-file-shield" aria-hidden="true"></i>
            <span>Open CPD evidence archive</span>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </a>
        </aside>

        <div class="about-verification__content">
          <div class="about-verification__groups">
            <section class="about-verification__group about-verification__group--licensure" data-verify-group="licensure" aria-labelledby="licensureHeading">
              <header>
                <p>Licensure</p>
                <h3 id="licensureHeading">Medical scientist registrations</h3>
                <span>Active professional registration in Ghana and Ireland.</span>
              </header>
              <div>
                {% for licence in site.data.profile.licensure %}
                <article class="about-verification__entry home-journey-card" style="--journey-accent: var(--about-cyan);">
                  <span class="about-verification__state">Registered</span>
                  <p>{{ licence.jurisdiction }}</p>
                  <h4>{{ licence.credential }}</h4>
                  <strong>{{ licence.body }} ({{ licence.abbreviation }})</strong>
                  <code>{{ licence.reg_no }}</code>
                </article>
                {% endfor %}
              </div>
            </section>

            <section class="about-verification__group" data-verify-group="professional-registration" aria-labelledby="professionalRegistrationHeading">
              <header>
                <p>Professional registration</p>
                <h3 id="professionalRegistrationHeading">Epidemiologist A registration</h3>
                <span>Professional epidemiology registration; separate from medical-scientist licensure.</span>
              </header>
              <div>
                {% for registration in site.data.profile.professional_registrations %}
                <article class="about-verification__entry home-journey-card" style="--journey-accent: var(--about-violet);">
                  <div class="about-verification__meta">
                    <p>{{ registration.abbreviation }}</p>
                    <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ registration.country }}</span>
                  </div>
                  <span class="about-verification__state">Registered {{ registration.registered_on_display }}</span>
                  <h4>{{ registration.name }}</h4>
                  <strong>{{ registration.body }} ({{ registration.abbreviation }})</strong>
                  <code>Reference {{ registration.reg_no }}</code>
                </article>
                {% endfor %}
              </div>
            </section>

            <section class="about-verification__group about-verification__group--membership" data-verify-group="membership" aria-labelledby="membershipHeading">
              <header>
                <p>Professional bodies</p>
                <h3 id="membershipHeading">Fellowship and professional memberships</h3>
                <span>Public health, laboratory medicine and epidemiology organisations.</span>
              </header>
              <div>
                {% for membership in site.data.profile.memberships %}
                <article class="about-verification__entry home-journey-card" style="--journey-accent: var(--about-mint);">
                  <div class="about-verification__meta">
                    <p>{{ membership.abbreviation }}</p>
                    <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ membership.country }}</span>
                  </div>
                  <h4>{% if membership.role %}{{ membership.role }}, {% endif %}{{ membership.name }}</h4>
                  {% if membership.note %}<strong>{{ membership.note }}</strong>{% endif %}
                  <code>{{ membership.reg_no }}</code>
                </article>
                {% endfor %}
              </div>
            </section>

            <section class="about-verification__group about-verification__group--pending" data-verify-group="pending" aria-labelledby="pendingHeading">
              <header>
                <p>Status disclosure</p>
                <h3 id="pendingHeading">Credentials in progress</h3>
                <span>These credentials are not presented as completed or awarded.</span>
              </header>
              <div>
                {% for pending in site.data.profile.certifications_in_progress %}
                <article class="about-verification__entry home-journey-card" style="--journey-accent: var(--about-amber);">
                  <div class="about-verification__meta">
                    <span class="about-verification__state">In progress</span>
                    <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>{{ pending.country }}</span>
                  </div>
                  <h4>{{ pending.name }}</h4>
                  {% if pending.body %}<strong>{{ pending.body }}{% if pending.abbreviation %} ({{ pending.abbreviation }}){% endif %}</strong>{% endif %}
                  <strong>{{ pending.note }}</strong>
                </article>
                {% endfor %}
              </div>
            </section>
          </div>

          <section class="about-identifiers" data-verify-group="identifiers" aria-label="Researcher profiles and identifiers">
            <header>
              <p>Research identity</p>
              <h3>Researcher profiles and persistent identifiers</h3>
            </header>
            <div>
              {% for ident in site.data.profile.identifiers %}
              <a href="{{ ident.url }}" target="_blank" rel="noopener">
                <span>{{ ident.property_id }}</span><code>{{ ident.value }}</code><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
              </a>
              {% endfor %}
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>

  <section id="academic-formation" class="about-v3__section about-education" aria-labelledby="aboutEducationTitle" data-nav-marker="03" data-nav-label="Education" data-nav-colour="#F87171">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">03</span>
        <p>03 - Education and training</p>
        <h2 id="aboutEducationTitle">Education in biomedical science, public health, data science and law</h2>
        <span>Completed and current degree programmes are identified separately, with the principal academic focus stated for each record.</span>
      </header>

      <div class="about-home-panel about-education__workspace reveal" data-education-pathway>
        <article class="home-identity-rail about-education__inspector" role="tabpanel" id="education-inspector" aria-labelledby="education-tab-1" style="--education-colour: var(--about-cyan);">
          <p class="about-home-panel__eyebrow" data-education-status>{% if first_credential.status == "in progress" %}In progress{% else %}Completed qualification{% endif %}</p>
          <span class="about-education__inspector-number" data-education-number>01</span>
          <h3 data-education-title>{{ first_credential.name }}</h3>
          <strong data-education-institution>{{ first_credential.institution }}</strong>
          <p data-education-focus>{{ first_credential.focus }}</p>
          <footer data-education-meta>
            {% if first_credential.year %}<span>{{ first_credential.year }}</span>{% endif %}
            {% if first_credential.note %}<span>{{ first_credential.note }}</span>{% endif %}
          </footer>
        </article>

        <div class="about-education__grid" role="tablist" aria-label="Academic qualifications">
          {% for credential in site.data.profile.credentials %}
          {%- case forloop.index -%}
            {%- when 1 -%}{%- assign education_colour = "var(--about-cyan)" -%}
            {%- when 2 -%}{%- assign education_colour = "var(--about-mint)" -%}
            {%- when 3 -%}{%- assign education_colour = "var(--about-amber)" -%}
            {%- else -%}{%- assign education_colour = "var(--about-violet)" -%}
          {%- endcase -%}
          <button type="button"
                  class="about-education__record home-journey-card{% if credential.status == 'in progress' %} is-current{% endif %}{% if forloop.first %} is-active{% endif %}"
                  id="education-tab-{{ forloop.index }}"
                  role="tab"
                  aria-selected="{% if forloop.first %}true{% else %}false{% endif %}"
                  aria-controls="education-inspector"
                  tabindex="{% if forloop.first %}0{% else %}-1{% endif %}"
                  style="--education-colour: {{ education_colour }}; --journey-accent: {{ education_colour }};"
                  data-education-number="{{ forloop.index | prepend: '0' | slice: -2, 2 }}"
                  data-education-status="{% if credential.status == 'in progress' %}In progress{% else %}Completed qualification{% endif %}"
                  data-education-title="{{ credential.name | escape }}"
                  data-education-institution="{{ credential.institution | escape }}"
                  data-education-focus="{{ credential.focus | escape }}"
                  data-education-year="{{ credential.year }}"
                  data-education-note="{{ credential.note | escape }}">
            <header>
              <span>{{ forloop.index | prepend: "0" | slice: -2, 2 }}</span>
              <p>{% if credential.status == "in progress" %}In progress{% else %}Completed{% endif %}</p>
            </header>
            <h3>{{ credential.name }}</h3>
            <strong>{{ credential.institution }}</strong>
            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
          {% endfor %}
        </div>
      </div>
    </div>
  </section>

  <section id="career-record" class="about-v3__section about-record" aria-labelledby="aboutRecordTitle" data-nav-marker="04" data-nav-label="Career" data-nav-colour="#22D3EE">
    <div class="about-v3__inner">
      <header class="about-v3__section-header reveal">
        <span class="about-v3__ghost" aria-hidden="true">04</span>
        <p>04 - Career record</p>
        <h2 id="aboutRecordTitle">Clinical appointments and public health fieldwork</h2>
        <span>A chronological record of laboratory leadership, diagnostic practice and community screening in Ghana.</span>
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
          <button type="button" aria-expanded="false" aria-controls="career-detail-{{ forloop.index }}">
            <span class="about-record__meta">
              <b>{{ record.dates }}</b>
              <small>{% if record.category == "practice" %}Clinical appointment{% else %}Field practice{% endif %}</small>
            </span>
            <strong>{{ record.title }}</strong>
            <i class="fa-solid fa-plus" aria-hidden="true"></i>
          </button>
          <div id="career-detail-{{ forloop.index }}" class="about-record__detail" hidden>
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
