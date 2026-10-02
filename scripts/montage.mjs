import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const shots = resolve(root, "validation/screenshots");
mkdirSync(shots, { recursive: true });

const names = readdirSync(shots)
  .filter((name) => name.endsWith(".png"))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const figures = names
  .map((name) => `<figure><img src="${name}"><figcaption>${name.replace(".png", "")}</figcaption></figure>`)
  .join("");

const html = `<!doctype html>
<html lang="cs">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Vizionář keynote — contact sheet</title>
<style>
  body{margin:24px;background:#101717;color:#eef3ef;font:14px Montserrat,Arial,sans-serif}
  h1{margin:0 0 8px}.meta{color:#9ca7a7;margin-bottom:24px}
  #grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
  figure{margin:0;background:#1a2424;border:1px solid #2e3939;border-radius:10px;overflow:hidden}
  img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}
  figcaption{padding:10px 12px;color:#c3d552;font-weight:700}
</style>
<h1>Vizionář v době AI</h1>
<div class="meta">${names.length} významových odhalení · contact sheet</div>
<div id="grid">${figures}</div>
</html>`;

writeFileSync(resolve(shots, "index.html"), html);
console.log(`montage index written for ${names.length} frames`);
