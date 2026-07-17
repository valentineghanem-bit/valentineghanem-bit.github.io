# valentineghanem.com — Jekyll + GitHub Pages

This replaces the Google Sites version. Same domain, same look-and-feel
direction, but the JSON-LD now lives directly in each page's real `<head>` —
no embed widget, no iframe sandbox. It's already been built and validated
locally (see "What's already been verified" below).

Currently migrated: **Home** and **About**. The other six pages
(Community Activities, Skills, Publications, Portfolio, Certificates & CPDs,
Gallery, Press) follow the exact same recipe — see "Adding the remaining
pages" at the bottom.

---

## Step 1 — Create the repository

1. Go to https://github.com/new (signed in as `valentineghanem-bit`).
2. Repository name: **`valentineghanem-bit.github.io`**
   (this exact name is what makes it your GitHub Pages *user site* —
   GitHub auto-recognizes it and serves it at `https://valentineghanem-bit.github.io`,
   which you'll then point your custom domain at).
3. Public, no README/license/gitignore (you already have those here).
4. Create it.

## Step 2 — Push this scaffold

From this folder on your machine:

```bash
git init
git add -A
git commit -m "Initial Jekyll site: home + about, real JSON-LD, GitHub Actions deploy"
git branch -M main
git remote add origin https://github.com/valentineghanem-bit/valentineghanem-bit.github.io.git
git push -u origin main
```

## Step 3 — Turn on GitHub Pages via Actions

1. In the repo: **Settings → Pages**.
2. Under "Build and deployment" → **Source: GitHub Actions.**
   (Not "Deploy from a branch" — that older path uses GitHub's own limited
   Jekyll plugin whitelist. The workflow already included at
   `.github/workflows/jekyll.yml` builds with full control instead.)
3. Go to the **Actions** tab. Pushing to `main` should already have triggered
   the "Deploy Jekyll site to GitHub Pages" workflow. Watch it go green.
4. Once it's green, the **Settings → Pages** page will show your live URL
   (`https://valentineghanem-bit.github.io`).

## Step 4 — Point your domain at it

The `CNAME` file in this repo already contains `www.valentineghanem.com`,
so GitHub knows which custom domain to expect. You still need to tell
your **domain registrar/DNS provider** to point at GitHub:

At your DNS provider, add:

| Type  | Host / Name | Value                     |
|-------|-------------|----------------------------|
| CNAME | `www`       | `valentineghanem-bit.github.io` |
| A     | `@`         | `185.199.108.153`          |
| A     | `@`         | `185.199.109.153`          |
| A     | `@`         | `185.199.110.153`          |
| A     | `@`         | `185.199.111.153`          |

The four `A` records let the bare `valentineghanem.com` (no `www`) resolve
too, so people who type it without `www` still land on the site.

Then back in **Settings → Pages**, under "Custom domain," enter
`www.valentineghanem.com` and save. Check **Enforce HTTPS** once GitHub
shows the certificate as issued (can take up to ~24h after DNS propagates).

> DNS records and exact propagation timing can change — if anything here
> looks off when you get to this step, check GitHub's current custom-domain
> docs (`docs.github.com` → Pages → "Managing a custom domain") before
> entering records, since I can't verify your registrar's panel directly.

## What's already been verified

Before handing this over, I:
- Installed Jekyll 4.4.1 and ran `bundle exec jekyll build` on this exact
  scaffold — it builds cleanly with no errors.
- Parsed the **compiled output** (not the template source) with a JSON
  parser: both `index.html` and `about/index.html` produce syntactically
  valid `application/ld+json` with the correct graph nodes (7 nodes each:
  WebSite/WebPage/Person/3×ImageObject/Organization on Home;
  ProfilePage/BreadcrumbList/Person/3×ImageObject/Organization on About).
- Checked the built HTML for any leftover unrendered `{{ }}` or `{% %}` —
  none found.

Once it's live, re-run Google's Rich Results Test and the Schema Markup
Validator against the real URL to confirm Google's own fetch agrees.

## Local preview (optional, before pushing)

```bash
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```

## How the data-driven JSON-LD works

Everything person-specific lives in `_data/*.yml`, not hardcoded in
templates:

- `_data/profile.yml` — name, bio, job titles, credentials, identifiers
- `_data/social.yml` — the `sameAs` list and footer icons
- `_data/images.yml` — Wikimedia Commons image references
- `_data/organization.yml` — Cocoa Clinic / COCOBOD

`_includes/jsonld/*.html` reads these files and outputs the actual
`@graph` nodes, using Liquid's `jsonify` filter on every value so text is
safely escaped (no manual comma/quote bugs). `_includes/head.html` decides
which page-level graph to include based on each page's front matter
(`jsonld: home` or `jsonld: about`).

**To update your bio, credentials, or socials: edit the YAML files in
`_data/`, not the HTML.** Both the visible page content and the JSON-LD
pull from the same source, so they can't drift out of sync the way the
old Google Sites setup did (remember the Suffolk "Merit vs Distinction"
mismatch between pages).

## Adding the remaining pages

For each new page (e.g. Publications):

1. Create `publications/index.md` with front matter:
   ```yaml
   ---
   layout: default
   permalink: /publications/
   title: "Publications"
   description: "..."
   ---
   ```
2. If it needs its own JSON-LD node (e.g. a `CollectionPage` listing
   `ScholarlyArticle` entries), add `_includes/jsonld/publications.html`
   following the same pattern as `about.html`, then wire it into
   `_includes/head.html` with another `{% elsif page.jsonld == "publications" %}`
   branch.
3. Add the nav link in `_includes/nav.html`.
4. Commit and push — the Actions workflow rebuilds and deploys automatically.

Your `_data/publications.yml` isn't built out yet in this pass; when you're
ready to migrate the Publications page, that's the natural place to list
DOIs/titles/journals as structured entries so both the visible list and the
JSON-LD generate from one source, same as everything else here.
