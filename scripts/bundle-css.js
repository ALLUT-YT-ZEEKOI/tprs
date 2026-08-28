const fs = require("fs");
const path = require("path");

const CSS_ROOT = path.join(__dirname, "..", "src", "assets", "css");
const OUT_DIR = path.join(__dirname, "..", "dist", "assets", "css");

// Sitewide core stylesheets, in cascade order — matches what every page
// previously linked individually. Page-specific extraCss stays separate.
const CORE_FILES = [
  "fonts.css",
  "tokens.css",
  "reset.css",
  "base.css",
  "layout.css",
  "components/header.css",
  "components/mobile-nav.css",
  "components/footer.css",
  "components/newsletter.css",
  "components/floating-cta.css",
  "components/accordion.css",
  "components/page-hero.css",
  "components/applications-carousel.css",
  "components/cards.css",
  "components/client-logos.css",
  "components/content-blocks.css",
];

function minify(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "") // comments
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

const bundled = CORE_FILES.map((f) => fs.readFileSync(path.join(CSS_ROOT, f), "utf8")).join("\n");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "main.css"), minify(bundled));

console.log(`[bundle-css] wrote main.css from ${CORE_FILES.length} files`);
