import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "export/offline");

const vite = resolve(root, "node_modules/.bin/vite");
const build = spawnSync(vite, ["build"], {
  cwd: root,
  env: { ...process.env, OFFLINE: "1" },
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);

const htmlPath = resolve(outDir, "index.html");
const cssPath = resolve(outDir, "assets/style.css");
const jsPath = resolve(outDir, "assets/keynote.js");
if (!existsSync(htmlPath) || !existsSync(cssPath) || !existsSync(jsPath)) {
  console.error("offline build missing index.html, style.css or keynote.js");
  process.exit(1);
}

let css = readFileSync(cssPath, "utf8");
css = css.replace(/url\((['"]?)(\.\/)?/g, "url($1./assets/");
css = css.replace(/<\/style/gi, "<\\/style");

let js = readFileSync(jsPath, "utf8");
js = js.replace(/<\/script/gi, "<\\/script");

const html = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="data:," />
    <title>Vizionář v době AI — Keynote</title>
    <style id="keynote-css">${css}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>${js}</script>
  </body>
</html>
`;
writeFileSync(htmlPath, html);
writeFileSync(resolve(outDir, "Spustit prezentaci.html"), html);

writeFileSync(
  resolve(outDir, "JAK OTEVRIT.txt"),
  [
    "1. Rozbal ZIP na Plochu.",
    "2. Dvojklik na Spustit prezentaci.html",
    "",
  ].join("\n"),
);

console.log(`offline keynote → ${outDir}`);
