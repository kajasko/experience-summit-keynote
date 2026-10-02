import { chromium } from "@playwright/test";
import { mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function frameName(index, url) {
  const hash = new URL(url).hash.slice(1);
  const state = new URLSearchParams(hash);
  const scene = state.get("scene") ?? "opening";
  const step = state.get("step") ?? "0";
  return `${String(index + 1).padStart(2, "0")}-${scene}-${step}.png`;
}

async function main() {
  const server = await createServer({
    root,
    base: "./",
    server: { host: "127.0.0.1", port: 4177, strictPort: true },
  });
  await server.listen();

  const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || (existsSync("/Applications/Google Chrome.app") ? "chrome" : undefined) });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, reducedMotion: process.env.REDUCED_MOTION === "1" ? "reduce" : "no-preference" });
  const out = resolve(root, "validation/screenshots");
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });

  await page.goto("http://127.0.0.1:4177/");
  await page.locator("#stage").waitFor();
  await page.evaluate(() => document.fonts.ready);

  for (let index = 0; index < 76; index += 1) {
    await page.locator('[data-motion="settled"]').waitFor();
    if (await page.locator('[data-scene="history"]').count()) await page.waitForTimeout(1100);
    await page.locator("#stage img").evaluateAll(imgs => Promise.all(imgs.map(img => img.decode().catch(() => {}))));
    const currentUrl = page.url();
    const name = frameName(index, currentUrl);
    await page.screenshot({ path: resolve(out, name) });
    console.log("frame", name);

    if (index < 74) {
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(previous => location.href !== previous, currentUrl);
    }
  }

  await browser.close();
  await server.close();
}

main();
