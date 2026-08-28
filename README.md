# TPRS Glass — Static Rebuild

A pixel-faithful static rebuild of [tprsglass.com](https://tprsglass.com), originally WordPress + Elementor + Slider Revolution. This project is a hand-authored HTML/CSS/JS site built with [Eleventy](https://www.11ty.dev/) so the header, footer, mega menu, and card layouts live in one place instead of being copy-pasted across 60+ pages — the **compiled output** is plain static HTML/CSS/JS with no framework, WordPress artifact, or third-party runtime dependency.

See [DESIGN-TOKENS.md](DESIGN-TOKENS.md) for how the design tokens (colors, type scale, breakpoints, motion) were extracted from the live site's source.

## Local development

```bash
npm install
npm run dev      # starts a dev server at http://localhost:8080 with live reload
npm run build     # compiles src/ → dist/ (production build)
npm run clean     # removes dist/
```

Requires Node 18+. No other runtime dependencies — the compiled site in `dist/` is deployable to any static host with zero server-side code.

## Folder map

```
src/
├── _includes/
│   ├── layouts/       base.njk (site chrome), page.njk (generic inner page),
│   │                   solution.njk, industry.njk, post.njk, project.njk
│   │                   (each of the last four is data-driven — see below)
│   └── partials/       header, mega-menu, mobile-nav, footer, floating-cta,
│                        newsletter, breadcrumb, page-hero, accordion,
│                        applications-carousel, project-card, client-logos,
│                        cert-badges, stat-counters, timeline, bg-image-set
├── _data/               site.json, nav.json, home.json, solutions.json,
│                        industries.json, projects.json, posts.json,
│                        faqCategories.json, applications.json, env.js
├── assets/
│   ├── css/             tokens.css (design tokens) → reset/base/layout →
│   │                    components/*.css (shared UI) → pages/*.css (page-
│   │                    specific). main.css is a BUILD OUTPUT — see below.
│   ├── js/               one small file per concern (nav.js, forms.js,
│   │                    accordion.js, reveal.js, hero.js, counters.js,
│   │                    carousel.js, lightbox.js, share.js, site.js).
│   │                    main.js is a BUILD OUTPUT — see below.
│   ├── img/, fonts/, downloads/
├── <page-slug>/index.njk   one folder per URL (e.g. src/about-us/ →
│                            /about-us/), so URLs match the live site exactly
├── portfolio/<slug>/index.njk
├── robots.txt, sitemap.njk, 404.njk
dist/                      build output — do not edit directly
```

### Important: `main.css` / `main.js` are generated, not source

`scripts/bundle-css.js` and `scripts/bundle-js.js` run automatically after every build (wired via the `eleventy.after` hook in `.eleventy.js`) and concatenate+minify the sitewide "always-on" stylesheets/scripts into `dist/assets/css/main.css` and `dist/assets/js/main.js`. This was added during the performance pass to cut ~16 render-blocking CSS requests down to one. **Always edit the individual files under `src/assets/css/`/`src/assets/js/`** — never edit the bundle output directly, it's overwritten on every build. If you add a new sitewide (loaded-on-every-page) stylesheet or script, add it to the `CORE_FILES` list in the relevant `scripts/bundle-*.js` file.

Page-specific CSS/JS (e.g. `pages/home.css`, `pages/inner-page.css`) is **not** bundled — it's loaded per-page via each page's `extraCss`/`extraJs` front-matter array, only where needed.

## How to add content

**A blog post** — add an entry to `src/_data/posts.json` (slug, url, title, date, category, image, excerpt, body — body is an array of HTML paragraph strings), then create `src/<slug>/index.njk` with:
```yaml
---
layout: layouts/post.njk
postSlug: <slug>
title: "..."
description: "..."
extraCss: [/assets/css/pages/inner-page.css, /assets/css/pages/blog.css]
---
```
The listing at `/blogs/` reads `posts.json` automatically — no separate step needed there.

**A portfolio project** — same pattern: add to `src/_data/projects.json`, create `src/portfolio/<slug>/index.njk` with `layout: layouts/project.njk` and `projectKey: <slug>`. The `/portfolio/` listing picks it up automatically.

**A solution or industry page** — these are fully data-driven; add the entry to `src/_data/solutions.json` or `src/_data/industries.json` (see existing entries for the schema — highlights/specs/faqs for solutions; glance/applications/faqs for industries) and create the matching `src/<slug>/index.njk` pointing at `layouts/solution.njk`/`layouts/industry.njk` with `solutionKey`/`industryKey` set.

**Images**: convert to WebP alongside the original (`ffmpeg -i in.jpg -c:v libwebp -quality 82 out.webp`) — every image-rendering partial (`bg-image-set.njk`, `project-card.njk`, `mega-menu.njk`, etc.) automatically prefers the `.webp` sibling via the `webp` Nunjucks filter (`.eleventy.js`) and falls back to the original for browsers that don't support it. Keep card/thumbnail-role images ≤1280px wide and full-bleed hero images ≤1920px wide — oversized originals were a real Lighthouse finding during the performance pass.

## Navigation

The mega menu, mobile drawer, and footer nav columns all read from `src/_data/nav.json` — edit it once, it updates everywhere. `site.json` holds sitewide constants (phone, WhatsApp number, email as a `[user, domain]` pair for JS-assembled mailto links, social URLs).

## Forms

Contact, careers, and newsletter forms are wired client-side (`src/assets/js/forms.js`) with honeypot fields, inline validation, and loading/success/error states, but need a real submission endpoint:

1. Copy `.env.example` to `.env`.
2. Set `CONTACT_FORM_ENDPOINT` (a [Web3Forms](https://web3forms.com), [Formspree](https://formspree.io), or [Basin](https://usebasin.com) endpoint URL) and `NEWSLETTER_FORM_ENDPOINT` (your Mailchimp embedded-form action URL).
3. Rebuild — `src/_data/env.js` reads these at build time and injects them into each form's `data-endpoint` attribute.

Without real values, forms render and validate correctly but show "This form isn't connected to an endpoint yet." on submit — safe, no dead requests.

## Deployment

`dist/` is the entire deployable artifact — upload it as-is to Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3+CloudFront, or any Nginx/Apache host. No build step is required on the host if you commit `dist/` yourself; otherwise point the host's build command at `npm run build` with publish directory `dist`.

**Enable compression on your host.** Netlify, Vercel, and Cloudflare Pages do this automatically. If you're self-hosting on Nginx/Apache, turn on gzip or brotli for `.html/.css/.js/.svg` — this was the single biggest lever in local Lighthouse testing (a 20KB CSS bundle drops to ~4.7KB gzipped) and this repo's dev server does **not** compress, so local performance numbers should be re-checked against the live deployed URL rather than trusted as final.

Set reasonable `Cache-Control` headers for `/assets/` (immutable, long max-age — filenames don't change on edit, so cache-busting isn't handled by this build; if you need it, add content-hashing to the bundle scripts).

## Known scope notes

- **`/en-gb/`**: the language switcher UI exists and links here, but the actual `en-gb` page tree was scoped as a later phase per the original brief.
- **`/our-clients/`**: referenced by a few industry pages' "View All" client links (found live on tprsglass.com) but wasn't in the original page inventory — build it the same way as `/portfolio/` if wanted.
- **Blog**: the live site has ~120+ posts across 13 archive pages; this rebuild includes the template plus 18 real, fully-written posts (the most recent ones, plus every post already linked from elsewhere on the site) rather than all of them — add more via `posts.json` following the pattern above.
- **Privacy Policy**: reproduced verbatim from the live site, which is unedited Shopify e-commerce boilerplate (mentions "purchases," shipping, Shopify's own privacy page) that doesn't reflect how TPRS actually operates. Flagged inline on the page itself — replace with real policy text when available.
#   t p r s  
 