# Published Work Signal Lab - Data Manifest

Verified: 2026-07-26

This manifest records the sources used by the Home page research console. Public records are separated by scholarly status. No unavailable raw dataset was fabricated.

| Work | Status | DOI / record | Source and download followed | Home representation | Caveat |
|---|---|---|---|---|---|
| Spatial and Machine Learning Analysis of District-Level Health Insurance Inequities in Ghana | Peer-reviewed article, Cureus (2026) | https://doi.org/10.7759/cureus.101984 | Cureus full-text PDF and PMC full text; related reproducible NHIS repository at https://github.com/valentineghanem-bit/nhis-oop-ghana-261districts | Article-reported metrics plus a separately labelled 261-district companion dataset | The related repository dataset is not presented as a reconstruction of the article data |
| HIV Prognosis in Sub-Saharan Africa | Peer-reviewed narrative review (2025) | https://doi.org/10.61424/ijmhr.v3i2.346 | Journal PDF at https://bluemarkpublishers.com/index.php/IJMHR/article/download/346/285/992 | Verified review scope and evidence domains | No fake quantitative model; raw study-level extraction was not publicly linked in site data |
| Socio-Behavioral and Spatial Determinants of HIV/AIDS Incidence in Ghana | Peer-reviewed article (2025); earlier preprint record retained | https://doi.org/10.4236/aid.2025.154050 | Journal full text and Research Square record https://doi.org/10.21203/rs.3.rs-6745789/v1 | Study design, methods, panel size and artifact links | Ecological ten-region panel; not individual-level inference |
| Forecasting HIV/AIDS Incidence in Ghana | Research Square preprint (2025) | https://doi.org/10.21203/rs.3.rs-6639193/v1 | Research Square PDF; Streamlit dashboard; GitHub code; Zenodo dataset | Forecasting workflow, model families and live artifacts | Preprint under scholarly review; not a clinical forecasting service |
| Analysis and Prediction of Infectious Disease Trends in Ghana | Zenodo data and software repository (2025) | https://doi.org/10.5281/zenodo.15616846 | Zenodo record, Streamlit dashboard and GitHub model repository | Code, model, data and deployment artifact view | Software/data record; not counted as a peer-reviewed journal article |

## Derived public-site data

`assets/data/published-work-derived/nhis-inequities.json`

- Source file inspected: `11. NHIS OOP Ghana 260 Districts/data/processed/spatial_results.csv`
- Public source repository: https://github.com/valentineghanem-bit/nhis-oop-ghana-261districts
- Rows used: 261
- Fields retained: district, region, centroid, population, uninsurance, poverty, illiteracy, LISA class and Gi* class
- Purpose: compact companion explorer for the Home portfolio
- Known limitation: the file belongs to a related reproducible NHIS pipeline. It is explicitly labelled as a companion source and is not used to recalculate the Cureus article findings.

## Repository catalogue

The console links twelve representative public repositories spanning maternal health, infectious disease, health systems, WASH, nutrition, immunisation, forecasting and clinical epidemiology. The GitHub profile remains the canonical catalogue: https://github.com/valentineghanem-bit
