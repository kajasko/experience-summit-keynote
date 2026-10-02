import { chromium } from "@playwright/test";
import { mkdirSync, rmSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { createServer } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/assets/thumbs");
const tmpDir = resolve(root, "validation/thumbs-raw");
const port = 4198;

// One thumbnail per visual slide (see `slides` in src/deck/deck.ts), captured
// in the slide's final built state and saved as thumbs/<first step id>.webp.

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
  const deck = await server.ssrLoadModule("/src/deck/deck.ts");
  const shots = deck.slides.map((slide) => {
    const last = deck.steps[slide.last];
    return { id: slide.id, no: slide.no, sceneId: slide.sceneId, local: last.local };
  });
  for (const file of readdirSync(outDir)) {
    if (/\.(jpg|webp)$/.test(file)) rmSync(resolve(outDir, file));
  }

  const browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || (existsSync("/Applications/Google Chrome.app") ? "chrome" : undefined),
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });

  await page.goto(`http://127.0.0.1:${port}/?thumbs=1#scene=${shots[0].sceneId}&step=0`);
  await page.locator("#stage").waitFor();
  await page.evaluate(() => document.fonts.ready);

  for (const shot of shots) {
    await page.evaluate(({ sceneId, local }) => {
      document.documentElement.classList.add("thumbs-capture");
      const next = `#scene=${sceneId}&step=${local}`;
      if (location.hash !== next) location.hash = next;
      window.dispatchEvent(new Event("resize"));
    }, shot);

    await page.waitForFunction(({ sceneId, local }) => {
      const scene = document.querySelector("[data-scene]");
      return scene?.getAttribute("data-scene") === sceneId
        && scene.getAttribute("data-local") === String(local)
        && scene.getAttribute("data-motion") === "settled";
    }, shot, { timeout: 20000 });

    await page.locator("#stage img").evaluateAll((imgs) =>
      Promise.all(imgs.map((img) => img.decode().catch(() => {}))),
    );
    await page.waitForTimeout(600);

    const png = resolve(tmpDir, `${shot.id}.png`);
    const webp = resolve(outDir, `${shot.id}.webp`);
    await page.locator("#stage").screenshot({ path: png, type: "png", animations: "disabled" });

    const py = [
      "from PIL import Image",
      `im = Image.open(${JSON.stringify(png)}).convert("RGB")`,
      "im = im.resize((640, 360), Image.Resampling.LANCZOS)",
      `im.save(${JSON.stringify(webp)}, "WEBP", quality=78, method=6)`,
    ].join("\n");
    const resize = spawnSync("python3", ["-c", py], { encoding: "utf8" });
    if (resize.status !== 0) {
      console.error(resize.stderr);
      throw new Error(`resize failed for ${shot.id}`);
    }
    console.log("thumb", String(shot.no).padStart(2, "0"), shot.id, `${shot.sceneId}@${shot.local}`);
  }

  writeFileSync(resolve(outDir, "manifest.json"), `${JSON.stringify(shots.map((shot) => shot.id), null, 2)}\n`);
  await browser.close();
  await server.close();
  rmSync(tmpDir, { recursive: true, force: true });
  console.log(`thumbs → ${outDir} (${shots.length})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
