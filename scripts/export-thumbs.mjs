import { chromium } from "@playwright/test";
import { mkdirSync, rmSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/assets/thumbs");
const tmpDir = resolve(root, "validation/thumbs-raw");
const port = 4198;

const sceneIds = [...readFileSync(resolve(root, "src/deck/deck.ts"), "utf8")
  .matchAll(/id: "([^"]+)", act:/g)]
  .map((match) => match[1]);

async function main() {
  mkdirSync(outDir, { recursive: true });
  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });

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

  await page.goto(`http://127.0.0.1:${port}/?thumbs=1#scene=${sceneIds[0]}&step=0`);
  await page.locator("#stage").waitFor();
  await page.evaluate(() => document.fonts.ready);

  for (const sceneId of sceneIds) {
    await page.evaluate((id) => {
      document.documentElement.classList.add("thumbs-capture");
      const next = `#scene=${id}&step=0`;
      if (location.hash !== next) location.hash = next;
      window.dispatchEvent(new Event("resize"));
    }, sceneId);

    await page.waitForFunction((id) => {
      const scene = document.querySelector("[data-scene]");
      return scene?.getAttribute("data-scene") === id
        && scene.getAttribute("data-local") === "0"
        && scene.getAttribute("data-motion") === "settled";
    }, sceneId, { timeout: 20000 });

    await page.locator("#stage img").evaluateAll((imgs) =>
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
    );
    await page.waitForTimeout(480);

    const png = resolve(tmpDir, `${sceneId}.png`);
    const jpg = resolve(outDir, `${sceneId}.jpg`);
    await page.locator("#stage").screenshot({ path: png, type: "png", animations: "disabled" });

    const py = [
      "from PIL import Image",
      `im = Image.open(${JSON.stringify(png)}).convert("RGB")`,
      "im = im.resize((640, 360), Image.Resampling.LANCZOS)",
      `im.save(${JSON.stringify(jpg)}, "JPEG", quality=72, optimize=True)`,
    ].join("\n");
    const resize = spawnSync("python3", ["-c", py], { encoding: "utf8" });
    if (resize.status !== 0) {
      console.error(resize.stderr);
      throw new Error(`resize failed for ${sceneId}`);
    }
    console.log("thumb", sceneId);
  }

  writeFileSync(resolve(outDir, "manifest.json"), `${JSON.stringify(sceneIds, null, 2)}\n`);
  await browser.close();
  await server.close();
  rmSync(tmpDir, { recursive: true, force: true });
  console.log(`thumbs → ${outDir} (${sceneIds.length})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
