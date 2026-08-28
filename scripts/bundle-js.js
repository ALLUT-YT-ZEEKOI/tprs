const fs = require("fs");
const path = require("path");

const JS_ROOT = path.join(__dirname, "..", "src", "assets", "js");
const OUT_DIR = path.join(__dirname, "..", "dist", "assets", "js");

// Sitewide core scripts, load-order sensitive (each is a self-contained IIFE).
const CORE_FILES = ["nav.js", "forms.js", "accordion.js", "reveal.js", "site.js"];

const bundled = CORE_FILES.map((f) => fs.readFileSync(path.join(JS_ROOT, f), "utf8")).join("\n");

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, "main.js"), bundled);

console.log(`[bundle-js] wrote main.js from ${CORE_FILES.length} files`);
