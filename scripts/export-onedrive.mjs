import {
  existsSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const exportDir = resolve(root, "export");
const outDir = resolve(exportDir, "Vizionar-do-slajdu-44");
const zipPath = resolve(exportDir, "Vizionar-do-slajdu-44.zip");
const vite = resolve(root, "node_modules/.bin/vite");

const build = spawnSync(vite, ["build"], {
  cwd: root,
  env: {
    ...process.env,
    OFFLINE: "1",
    ONEDRIVE: "1",
    VITE_DECK_CUTOFF_SCENE: "human-ai",
  },
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);

const htmlPath = resolve(outDir, "index.html");
if (!existsSync(htmlPath)) {
  console.error("OneDrive build missing index.html");
  process.exit(1);
}

let html = readFileSync(htmlPath, "utf8");
html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, "");
html = html.replace(
  /<script[^>]*src="([^"]+)"[^>]*><\/script>/,
  `<script defer src="$1"></script>`,
);
html = html.replace(/\scrossorigin(="[^"]*")?/g, "");
writeFileSync(htmlPath, html);

writeFileSync(
  resolve(outDir, "JAK OTEVRIT.txt"),
  [
    "Vizionář v době AI — slajdy 1–44",
    "",
    "1. Stáhni a rozbal celý ZIP.",
    "2. Otevři index.html v Chrome nebo Edge.",
    "3. F = fullscreen, šipky / mezerník = další slajd.",
    "",
    "Prezentace končí slajdem 44.",
    "Složku assets neodděluj od index.html.",
    "V náhledu OneDrive se prezentace nespustí — nejdřív ji stáhni.",
    "",
  ].join("\n"),
);

rmSync(zipPath, { force: true });
const zip = spawnSync(
  "/usr/bin/zip",
  ["-r", "-q", zipPath, basename(outDir)],
  { cwd: exportDir, stdio: "inherit" },
);
if (zip.status !== 0) process.exit(zip.status ?? 1);

console.log(`OneDrive package → ${zipPath}`);
