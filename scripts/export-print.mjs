import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer } from "vite";
import { chromium } from "@playwright/test";

const SCENES = [
  ["opening", 1],
  ["history", 5],
  ["intent", 3],
  ["adoption", 3],
  ["value-gap", 1],
  ["twist", 2],
  ["visions", 6],
  ["challenges", 1],
  ["kdo", 1],
  ["trend1", 3],
  ["uxax", 3],
  ["understanding", 2],
  ["modes", 5],
  ["examples", 1],
  ["prd", 1],
  ["co-map", 1],
  ["co", 1],
  ["journey", 2],
  ["adapt", 2],
  ["funnel", 2],
  ["conversation", 1],
  ["chat", 1],
  ["uiai", 4],
  ["partner", 1],
  ["human-ai", 1],
  ["verit-map", 1],
  ["verit", 1],
  ["distrust", 4],
  ["prove", 16],
  ["principles", 6],
  ["bias", 3],
  ["trust", 8],
  ["jak-map", 1],
  ["jak", 1],
  ["orch", 4],
  ["channels", 8],
  ["bxcxex", 2],
  ["video", 1],
];

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "export/print");
const pagesDir = resolve(outDir, "pages");
const tmpDir = resolve(root, "validation/print-raw");
const pdfPath = resolve(root, "export/Vizionar-tisk-poznamky.pdf");
const port = 4197;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function capturePages() {
  rmSync(tmpDir, { recursive: true, force: true });
  rmSync(pagesDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });
  mkdirSync(pagesDir, { recursive: true });

  const server = await createServer({
    root,
    base: "./",
    server: { host: "127.0.0.1", port, strictPort: true },
  });
  await server.listen();

  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || (existsSync("/Applications/Google Chrome.app") ? "chrome" : undefined),
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });

  page.on("pageerror", (err) => console.log("pageerror", err.message));

  const boot = async (sceneId = "opening", local = 0) => {
    await page.goto(`http://127.0.0.1:${port}/?thumbs=1#scene=${sceneId}&step=${local}`);
    await page.locator("#stage").waitFor({ state: "attached", timeout: 15000 });
    await page.evaluate(() => {
      document.documentElement.classList.add("thumbs-capture");
      window.dispatchEvent(new Event("resize"));
    });
    await page.evaluate(() => document.fonts.ready);
  };

  await boot();

  const shots = [];
  let i = 0;

  for (const [sceneId, length] of SCENES) {
    for (let local = 0; local < length; local += 1) {
      i += 1;
      try {
        await page.evaluate(({ sceneId: id, local: step }) => {
          location.hash = `scene=${id}&step=${step}`;
        }, { sceneId, local });
      } catch {
        await boot(sceneId, local);
      }
      await page
        .locator(`[data-scene="${sceneId}"][data-local="${local}"]`)
        .waitFor({ state: "attached", timeout: 8000 })
        .catch(() => {});
      await page.locator("#stage img").evaluateAll((imgs) =>
        Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
      );
      await page.waitForTimeout(220);

      const meta = await page.evaluate(() => {
        const label = document.querySelector(".chrome-page")?.textContent ?? "";
        const match = label.match(/(\d+)\s*\/\s*\d+/);
        const cap = document.querySelector(".chrome-caption span:last-child")?.textContent?.trim() ?? "";
        const kick = document.querySelector(".chrome-kicker")?.textContent?.trim() ?? "";
        const hero = document.querySelector("[data-hero-title], .chapter-hero-t")?.innerText?.replace(/\s+/g, " ").trim() ?? "";
        const title = document.querySelector(".heading, .hero, .thought")?.textContent?.trim() ?? "";
        return {
          n: match ? Number(match[1]) : null,
          title: cap || hero || title || kick,
        };
      });

      const raw = resolve(tmpDir, `${String(i).padStart(3, "0")}.jpg`);
      try {
        await page.screenshot({
          path: raw,
          type: "jpeg",
          quality: 62,
          clip: { x: 0, y: 0, width: 1920, height: 1080 },
          animations: "disabled",
          timeout: 8000,
        });
      } catch {
        console.log("skip shot", sceneId, local);
        continue;
      }
      shots.push({ n: meta.n, title: meta.title || sceneId, path: raw, sceneId, local });
      console.log(String(i).padStart(3, "0"), sceneId, local, meta.n ?? "—", meta.title);
    }
  }

  await browser.close();
  await server.close();

  const placed = new Map();
  let lastLabeled = 0;
  const chapters = [];
  const leftovers = [];
  for (const shot of shots) {
    if (shot.n >= 1 && shot.n <= 75) {
      if (placed.has(shot.n)) leftovers.push({ ...placed.get(shot.n), from: shot.n });
      placed.set(shot.n, shot);
      lastLabeled = shot.n;
    } else {
      chapters.push({ ...shot, after: lastLabeled });
    }
  }
  for (const shot of chapters) {
    for (let n = shot.after + 1; n <= Math.min(75, shot.after + 4); n += 1) {
      if (!placed.has(n)) {
        placed.set(n, shot);
        break;
      }
    }
  }
  for (let n = 1; n <= 75; n += 1) {
    if (placed.has(n)) continue;
    const neighbor = leftovers.find((shot) => shot.from === n - 1)
      ?? leftovers.find((shot) => shot.from === n + 1);
    if (neighbor) {
      placed.set(n, neighbor);
      leftovers.splice(leftovers.indexOf(neighbor), 1);
      continue;
    }
    placed.set(n, placed.get(n - 1) ?? placed.get(n + 1));
  }

  const catalog = new Map();
  for (let n = 1; n <= 75; n += 1) {
    const shot = placed.get(n);
    if (!shot) continue;
    const dest = resolve(pagesDir, `${String(n).padStart(2, "0")}.jpg`);
    copyFileSync(shot.path, dest);
    catalog.set(n, shot.title || `Slajd ${n}`);
  }

  rmSync(tmpDir, { recursive: true, force: true });
  return catalog;
}

function buildHtml(catalog) {
  const items = Array.from({ length: 75 }, (_, i) => {
    const n = i + 1;
    const file = `${String(n).padStart(2, "0")}.jpg`;
    return {
      n,
      title: catalog.get(n) ?? "",
      src: existsSync(resolve(pagesDir, file)) ? `pages/${file}` : "",
    };
  });
  const sheets = [];
  for (let i = 0; i < items.length; i += 4) sheets.push(items.slice(i, i + 4));

  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>Vizionář v době AI — tisk 1–75</title>
  <style>
    @page { size: A4 portrait; margin: 9mm 10mm 10mm; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      background: #fff;
      color: #03383d;
      font-family: Montserrat, "Segoe UI", Arial, sans-serif;
    }
    .sheet {
      width: 190mm;
      height: 278mm;
      display: flex;
      flex-direction: column;
      page-break-after: always;
      break-after: page;
    }
    .sheet:last-child { page-break-after: auto; break-after: auto; }
    .head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex: 0 0 auto;
      margin-bottom: 3mm;
      padding-bottom: 2mm;
      border-bottom: 1.5pt solid #c3d552;
    }
    .head strong { font-size: 10.5pt; letter-spacing: -0.02em; }
    .head span {
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #005860;
    }
    .grid {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 4mm 6mm;
    }
    .card {
      min-width: 0;
      min-height: 0;
      display: flex;
      flex-direction: column;
    }
    .frame {
      aspect-ratio: 16 / 9;
      flex: 0 0 auto;
      overflow: hidden;
      border: 0.4pt solid #c5d0d2;
      background: #eef2f2;
    }
    .frame img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .frame.is-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #627779;
      font-size: 8pt;
    }
    .meta {
      display: flex;
      gap: 2mm;
      align-items: baseline;
      flex: 0 0 auto;
      margin: 1.5mm 0 1mm;
    }
    .n { font-size: 8pt; font-weight: 800; color: #98ad22; }
    .t { font-size: 8pt; font-weight: 700; line-height: 1.2; letter-spacing: -0.015em; }
    .notes {
      flex: 1;
      min-height: 0;
      overflow: hidden;
      padding-top: 0.8mm;
    }
    .notes i {
      display: block;
      height: 7mm;
      border-bottom: 0.45pt solid #b4c2c4;
    }
    @media screen {
      body { background: #e8eeef; padding: 16px 0 40px; }
      .sheet {
        width: 210mm;
        height: 297mm;
        background: #fff;
        margin: 0 auto 16px;
        padding: 9mm 10mm 10mm;
        box-shadow: 0 8px 28px rgba(3,56,61,.12);
      }
    }
  </style>
</head>
<body>
${sheets.map((group, pageIndex) => `
  <section class="sheet">
    <div class="head">
      <strong>Vizionář v době AI</strong>
      <span>Slajdy 1–75 · ${pageIndex + 1} / ${sheets.length}</span>
    </div>
    <div class="grid">
      ${[0, 1, 2, 3].map((slot) => {
        const item = group[slot];
        if (!item) return `<div class="card"></div>`;
        const num = String(item.n).padStart(2, "0");
        return `<article class="card">
          <div class="frame${item.src ? "" : " is-empty"}">${
            item.src
              ? `<img src="${item.src}" alt="${escapeHtml(item.title || num)}" />`
              : "Slajd v této verzi není"
          }</div>
          <div class="meta">
            <span class="n">${num}</span>
            <div class="t">${escapeHtml(item.title)}</div>
          </div>
          <div class="notes">${"<i></i>".repeat(16)}</div>
        </article>`;
      }).join("")}
    </div>
  </section>
`).join("")}
</body>
</html>`;
}

const catalog = process.argv.includes("--layout-only")
  ? new Map(JSON.parse(readFileSync(resolve(outDir, "pages.json"), "utf8")))
  : await capturePages();
const htmlPath = resolve(outDir, "index.html");
writeFileSync(htmlPath, buildHtml(catalog));
writeFileSync(resolve(outDir, "pages.json"), `${JSON.stringify([...catalog.entries()], null, 2)}\n`);

const browser = await chromium.launch({
  channel: existsSync("/Applications/Google Chrome.app") ? "chrome" : undefined,
});
const tab = await browser.newPage();
await tab.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
await tab.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

const missing = [];
for (let n = 1; n <= 75; n += 1) {
  if (!existsSync(resolve(pagesDir, `${String(n).padStart(2, "0")}.jpg`))) missing.push(n);
}
const downloads = resolve(process.env.HOME ?? "", "Downloads/Vizionar-tisk-poznamky.pdf");
if (process.env.HOME) copyFileSync(pdfPath, downloads);
console.log(`print pdf → ${pdfPath}`);
if (process.env.HOME) console.log(`copy → ${downloads}`);
console.log(`captured ${catalog.size}/75${missing.length ? `; missing ${missing.join(",")}` : ""}`);
