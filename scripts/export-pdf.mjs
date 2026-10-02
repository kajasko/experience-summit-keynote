import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const html = resolve(root, "export/offline/index.html");
if (!existsSync(html)) {
  console.error("Nejdřív spusť: npm run export:offline");
  process.exit(1);
}

const outDir = resolve(root, "export");
mkdirSync(outDir, { recursive: true });
const pdfPath = resolve(outDir, "Vizionar-v-dobe-AI.pdf");

const browser = await chromium.launch({
  channel: existsSync("/Applications/Google Chrome.app") ? "chrome" : undefined,
});
const page = await browser.newPage({
  viewport: { width: 1920, height: 1080 },
  reducedMotion: "reduce",
});

await page.goto(pathToFileURL(html).href, { waitUntil: "domcontentloaded" });
await page.locator("#stage").waitFor({ timeout: 20000 });
await page.evaluate(() => document.fonts.ready);

const pdf = await PDFDocument.create();
pdf.setTitle("Vizionář v době AI");
pdf.setAuthor("Clientology");

let i = 0;
while (i < 200) {
  i += 1;
  await page.locator("[data-state]").waitFor({ timeout: 15000 });
  await page.locator('[data-motion="settled"]').waitFor({ timeout: 15000 });
  await page.locator("#stage img").evaluateAll((imgs) =>
    Promise.all(imgs.map((img) => (img.complete ? null : img.decode().catch(() => {})))),
  );
  await page.waitForTimeout(120);
  const state = await page.getAttribute("[data-state]", "data-state");
  const bytes = await page.screenshot({ type: "jpeg", quality: 84 });
  const image = await pdf.embedJpg(bytes);
  const leaf = pdf.addPage([1920, 1080]);
  leaf.drawImage(image, { x: 0, y: 0, width: 1920, height: 1080 });
  console.log(`pdf ${String(i).padStart(2, "0")} ${state ?? "?"}`);

  const url = page.url();
  await page.keyboard.press("ArrowRight");
  const moved = await page
    .waitForFunction((previous) => location.href !== previous, url, { timeout: 1800 })
    .then(() => true)
    .catch(() => false);
  if (!moved) break;
}

const saved = await pdf.save();
writeFileSync(pdfPath, saved);
await browser.close();
console.log(`pdf → ${pdfPath}`);
