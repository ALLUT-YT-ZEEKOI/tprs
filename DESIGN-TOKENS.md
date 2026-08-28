# TPRS Glass — Design Tokens (Phase 1 Audit)

Source: tprsglass.com, audited 2026-08-27.

## How these were extracted

No browser/DevTools/screenshot tool was available in this environment, so tokens
below were pulled directly from the **live, served CSS source** (curl'd theme
files, Elementor's inline global-kit `<style>` block, and the WP global-styles
`<style>` block) rather than from screenshots or eyeballed computed styles.
This is generally *more* exact than reading DevTools for literal values (colors,
font stacks, breakpoints, container widths), but it means:

- Anything driven by **JS at runtime** (Slider Revolution timing, ElementsKit
  mega-menu open/close behavior, scroll-triggered reveal thresholds) is
  inferred from the plugin's known defaults + CSS transition values, not
  measured from an actual rendered animation. Flagged below where relevant.
- Per-widget font sizes are set via thousands of auto-generated Elementor
  element IDs (e.g. `.elementor-element-1071cf3`), not global rules. Rather
  than dump all of those speculatively, I'll pull the exact rule for each
  section/component **as I build it** (same method: fetch that page's
  `elementor-post-<id>` inline CSS and read the real values), and note it in
  the component's CSS file. Treat this file as the sitewide system tokens;
  page-specific numbers get confirmed at build time per page.

The site runs on the **ThemeREX "Planty"** WordPress theme + `trx_addons` +
Elementor + ElementsKit (mega menu) + Slider Revolution — not a hand-built
theme, which is why the raw CSS is full of unrelated demo boilerplate (15
unused color "schemes" etc). Values below are filtered down to what TPRS
actually uses (`scheme_co-default` + `elementor-kit-15`).

---

## 1. Color palette

Two overlapping systems are live: Elementor's **global kit colors** (used by
almost all page content, since Elementor builds it) and the theme's
**`co-default` scheme** (used by chrome/structural elements — blog cards,
portfolio grid, some widget furniture). Both are captured; component code
should reference the semantic token names on the right.

| Token | Hex | Source | Usage |
|---|---|---|---|
| `--color-navy` | `#0F4C81` | Elementor global color `61c01e98` | Primary brand navy — buttons, logo mark, primary CTA bg |
| `--color-gold` | `#FFBF01` | Elementor global color `13ed1179` | Accent gold — matches trx `text_link` `#FCAF17` (near-identical, treat as one accent) |
| `--color-sky` | `#4CC3F2` | Elementor global color `69bf31ed` | Light-blue accent — nav link hover color |
| `--color-blue-mid` | `#2E95CE` | Elementor global color `7a1ccbe5` | Secondary blue accent |
| `--color-bg` | `#F6F6F6` | trx scheme `co-default` `bg_color` | Page background |
| `--color-surface` | `#FFFFFF` | trx scheme `co-default` `alter_bg_color` | Card / panel background |
| `--color-text` | `#5E5E5E` | trx scheme `co-default` `text` | Body copy |
| `--color-text-dark` | `#1A1919` | trx scheme `co-default` `text_dark` | Headings, dark text |
| `--color-text-light` | `#9C9C9C` | trx scheme `co-default` `text_light` | Muted/secondary text |
| `--color-border` | `#E7E7E7` | trx scheme `co-default` `bd_color` | Hairline borders |
| `--color-dark-surface` | `#1A1919` | trx scheme `co-default` `extra_bg_color` | Dark section background (footer-adjacent bands) |

`elementor-kit-15` also carries Elementor's **stock default** colors
(`primary:#6EC1E4`, `secondary:#54595F`, `accent:#61CE70`, `text:#7A7A7A`) —
these are the unmodified Elementor starter-kit defaults and do not appear to
be used anywhere in actual page content (no custom color IDs point to them).
Excluded from the token set as noise; flag me if any component turns out to
use them.

**Confirmed against the actual logo file** (`assets/img/logo/tprs-logo-navy.png`,
downloaded from `wp-content/uploads/2022/03/TPRS-Glass-logo.png`): the wordmark
color visually matches `#0F4C81` exactly — high confidence this is the correct
"TPRS Navy."

---

## 2. Typography

Two font families are in play, split by content type:

| Context | Font | Source | Weights loaded |
|---|---|---|---|
| Elementor-built content (h1–h6, body, links, buttons — i.e. **almost the entire site**, since every page is built in Elementor) | **Outfit** | `--e-global-typography-*-font-family:"Outfit"` in `elementor-kit-15`; also linked directly at `wp-content/uploads/elementor/google-fonts/css/outfit.css` | 400 (text), 500 (accent), 600 (primary/headings) |
| Theme-native chrome (blog post typography, some `trx_addons` widgets) | **DM Sans** (body) / **Stölzl** (h1) | WP global-styles vars `--wp--preset--font-family--p-font: "DM Sans"`, `--h-1-font: stolzl` | Not confirmed — inherited from WP defaults |

**⚠️ Licensing flag:** "Stölzl" is served via **Adobe Fonts / Typekit**
(`use.typekit.net/pjg1ebb.css`), a paid, domain-locked kit (weights 300/400/500/700).
It is *not* freely redistributable — I should not download and self-host those
`.woff2` files without your Adobe Fonts license permitting self-hosted export,
which Adobe generally does not allow for Typekit-served kits. Since Stölzl only
shows up in theme boilerplate selectors (not confirmed in actual rendered
homepage content — the homepage's real heading font is Outfit via the Elementor
kit), **recommend building the whole design system on Outfit only** (free,
Google Fonts, self-hostable) and dropping Stölzl unless you find a page where
it's actually visibly used. Will confirm per-page as I build; ask me to
re-check a specific page if you know one uses it visibly.

- **Outfit**: available free on Google Fonts, self-hostable as `.woff2` —
  will download and add `@font-face` with `font-display: swap`, no CDN call.
- **DM Sans**: also free on Google Fonts, self-hostable — same treatment,
  used for theme-native body text contexts if any survive into the rebuild.

Exact per-element font-size / line-height / letter-spacing for h1–h6, body,
small, buttons, nav — not globally declared (Elementor sets these per-widget
via generated element IDs). Will pull the literal value for each heading/type
style the first time it's used while building the corresponding template, and
log it into `tokens.css` as a named scale (e.g. `--fs-h1`, `--fs-h2`...) rather
than duplicating the raw per-element rules.

---

## 3. Layout

| Token | Value | Source |
|---|---|---|
| `--container-max` | `1290px` | `.elementor-section.elementor-section-boxed > .elementor-container{max-width:1290px}` (custom Elementor kit setting — not Elementor's stock 1140px) |
| Header height | `80px` | `.elementskit-menu-container{height:80px}` (element `dd8ba39`, header template `elementor-18644`) |
| Logo max-height | `73px` | `.logo_image{max-height:73px}` (element `c5227f1`) |
| Header nav link color (default/transparent state) | `#FFFFFF` | header template CSS |
| Header nav link hover color | `#4CC3F2` (`--color-sky`) | header template CSS |
| Header background transition | `background 0.3s, border 0.3s, border-radius 0.3s, box-shadow 0.3s` | header wrapper element `9d88a98` — confirms the transparent→solid scroll transition duration is **0.3s** |

## 4. Breakpoints

The theme's own responsive CSS (`__responsive.css`) is written against a wide,
somewhat redundant device matrix (480, 600, 768, 782 [WP admin-bar-specific,
irrelevant to us], 1024, 1200, 1280, 1366, 1440, 1680, 1920, 2160, 2400).
Elementor's own breakpoints in this kit are the standard **767px / 1024px**
mobile/tablet split.

For the rebuild, collapsing this to a clean scale that covers everything
meaningful (and matches the 5 breakpoints you asked me to audit at):

```css
--bp-xs: 390px;   /* small phone */
--bp-sm: 768px;   /* tablet portrait — Elementor's mobile/tablet line */
--bp-md: 1024px;  /* tablet landscape — Elementor's tablet/desktop line */
--bp-lg: 1440px;  /* laptop/desktop */
--bp-xl: 1920px;  /* large desktop */
```

## 5. Motion

| Token | Value | Source |
|---|---|---|
| `--ease-default` | `ease` | overwhelming majority of theme transitions |
| `--dur-fast` | `0.2s` | secondary transitions (linear) |
| `--dur-base` | `0.3s` | dominant transition duration sitewide (color, background, border, opacity, transform — all consistently 0.3s) |
| Header scroll transition | `0.3s` (background/border/border-radius/box-shadow) | confirmed above |

Slider Revolution (hero slider) and ElementsKit mega-menu open/close timing
run on **plugin defaults** driven by JS options embedded per-slide in the page
JSON config, not global CSS — I'll read the actual per-slide JSON (transition
type, duration, easing) when I fetch the homepage's slider config while
building the hero component, rather than guess here.

`prefers-reduced-motion` is **not** currently respected by the live site
(neither Slider Revolution nor the theme's scroll-reveal JS check for it) —
this is something we should *improve on* per your Step 6 accessibility bar,
not replicate.

## 6. Structural inventory confirmed from source (not guessed)

- **Nav**: 4 top-level items exactly as your inventory (TPRS Solutions, TPRS
  for Industry, About TPRS, TPRS Seed), each a full-width mega-panel with a
  left link list; "TPRS Seed" additionally nests **Resources** (Blogs, FAQs,
  Catalogues) and **News & Media** (Featured Stories) as two sub-groups —
  matches your "nested Resources / News & Media" spec exactly. Every link
  target matches your page inventory 1:1 — no slug surprises.
- **Language switcher**: literally `en` → `/` and `en-gb` → `/en-gb/`, confirmed
  in the header markup.
- **Footer**: 4 columns (TPRS Solutions, TPRS for Industry, About Us/Quality/
  Life at TPRS/Contact/Catalogues as Quick Links, Socials) + logo + newsletter,
  matches spec. Copyright row links `Zeekoi Enterprise Solutions` to
  `www.zeekoi.com`.
- **Homepage sections**, in DOM order, matches your 10-section spec including
  the "Glass Hub" social grid with the exact taglines: LinkedIn "Showcasing
  our expertise.", Instagram "An experience shaped for you.", Facebook
  "Stories that connect.", YouTube "Expert talks for you.", X "Updates that
  matter."
- **Portfolio** category confirmed as "Construction" for all 4 sampled
  projects (Prestige Trade Tower, Hotel Conrad Bangalore, TAJ Bengaluru, VR
  Mall Chennai) — matches your inventory exactly, no extra/missing projects
  found in the footer/homepage links sampled so far (full portfolio archive
  not yet crawled — will confirm full list when building `/portfolio/`).
- **SEO baseline** (homepage): `<title>TPRS Glass - Glass Processing Company
  in India</title>`, meta description "TPRS is a top-of-the-line Glass
  Processing Company in India and a manufacturer of diverse glass solutions
  and applications of exceptional quality.", canonical `https://tprsglass.com/`.

## 7. Assets pulled so far

- `src/assets/img/logo/tprs-logo-navy.png` — full-res navy wordmark (source:
  `TPRS-Glass-logo.png`, 2152×975)
- `src/assets/img/logo/tprs-logo-white.png` — white wordmark for transparent
  header state
- `src/assets/img/favicon/favicon-192.png`, `apple-touch-icon-180.png`

Still to pull once we start building: full image set per page, Outfit +
DM Sans `.woff2` self-hosted subsets, all icon assets, certification badges.

## 8. Decisions confirmed with client

1. **Stölzl font — dropped.** Standardizing the whole type system on
   **Outfit** (headings + body), self-hosted as `.woff2`, no Adobe Typekit
   dependency. If a page turns out to visibly use Stölzl during build, it'll
   be flagged and addressed on that page specifically rather than assumed
   sitewide.
2. **Gold accent**: `#FFBF01` (Elementor) vs `#FCAF17` (theme scheme) are two
   very close but distinct golds — treating them as one `--color-gold` token
   using `#FFBF01` (the one actually wired to Elementor global colors, which
   is what real page content uses) unless a brand guide says otherwise.
3. Form endpoints (Web3Forms/Formspree/Basin + Mailchimp) need real
   account IDs before Step 4 — `.env.example` will be stubbed and the
   client-side logic wired in the meantime.
