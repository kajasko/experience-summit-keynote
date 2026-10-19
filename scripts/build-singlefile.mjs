#!/usr/bin/env node
/**
 * export/offline (OFFLINE=1 vite build) → one self-contained HTML file.
 * CSS, fonts (woff2), JS (incl. encrypted Awards data) and every runtime image are inlined,
 * so the file works by double-click from anywhere (even copied alone, no server, no folder).
 * Usage: node scripts/build-singlefile.mjs [inDir] [outFile]
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const inDir = resolve(process.argv[2] ?? join(root, "export/offline"));
const outFile = resolve(process.argv[3] ?? join(root, "export/Prezentace_Experience_Summit.html"));
const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".gif": "image/gif", ".avif": "image/avif", ".woff2": "font/woff2", ".woff": "font/woff", ".mp4": "video/mp4", ".webm": "video/webm" };
const dataUri = (file) => `data:${MIME[extname(file).toLowerCase()]};base64,${readFileSync(file).toString("base64")}`;
const walk = (dir) => readdirSync(dir).flatMap((n) => { const f = join(dir, n); return statSync(f).isDirectory() ? walk(f) : [f]; });

// 1. CSS with fonts inlined (woff2 only; every target browser supports it).
let css = readFileSync(join(inDir, "assets/style.css"), "utf8");
css = css.replace(/,\s*url\(["']?\.\/[^)"']+\.woff["']?\)\s*format\(["']woff["']\)/g, "");
css = css.replace(/url\(["']?\.\/([^)"']+)["']?\)/g, (m, f) => {
  const file = join(inDir, "assets", f);
  try { return `url(${dataUri(file)})`; } catch { throw new Error(`CSS asset missing: ${f}`); }
});
if (/url\((?!data:|#)/.test(css)) throw new Error("CSS still references external files");

// 2. Runtime files (images, icons) as a path → data URI map.
const files = {};
for (const f of walk(inDir)) {
  const rel = relative(inDir, f).split("\\").join("/");
  const ext = extname(f).toLowerCase();
  if (!MIME[ext] || ext === ".woff" || ext === ".woff2") continue;
  if (rel === "og-image.jpg" || rel === "apple-touch-icon.png") continue;
  files[rel] = dataUri(f);
}

// 3. JS (classic IIFE bundle).
const js = readFileSync(join(inDir, "assets/keynote.js"), "utf8");
const safe = (s) => s.replace(/<\/(script)/gi, "<\\/$1").replace(/<!--/g, "<\\!--");

let html = readFileSync(join(inDir, "index.html"), "utf8");
html = html.replace(/<script[^>]*src="\.\/assets\/keynote\.js"[^>]*><\/script>\s*/, "");
html = html.replace(/<link rel="stylesheet"[^>]*>/, () => `<style>\n${css}\n</style>`);
html = html.replace(/<link rel="icon"[^>]*>/, () => `<link rel="icon" href="${dataUri(join(inDir, "favicon.svg"))}" />`);
html = html.replace(/\s*<link rel="apple-touch-icon"[^>]*>/, "");
html = html.replace("</body>", () => `<script>window.__KEYNOTE_FILES__=${safe(JSON.stringify(files))};</script>\n<script>\n${safe(js)}\n</script>\n</body>`);
if (/(src|href)="\.\//.test(html)) throw new Error("HTML still references local files");
writeFileSync(outFile, html);
console.log(`[singlefile] ${outFile} ${(Buffer.byteLength(html) / 1048576).toFixed(1)} MB, ${Object.keys(files).length} inlined files`);
