import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const offline = process.env.OFFLINE === "1";
const oneDrive = process.env.ONEDRIVE === "1";

// GitHub Pages serves the site from https://kajasko.github.io/experience-summit-keynote/.
// Dev server and offline/OneDrive exports keep relative paths.
const pagesBase = process.env.PAGES_BASE ?? "/experience-summit-keynote/";

export default defineConfig(({ command, isPreview }) => ({
  plugins: [react()],
  base: (command === "build" || isPreview) && !offline ? pagesBase : "./",
  server: {
    host: "127.0.0.1",
    port: 4188,
    strictPort: true,
    hmr: false,
  },
  build: offline
    ? {
        outDir: oneDrive ? "export/Vizionar-do-slajdu-44" : "export/offline",
        emptyOutDir: true,
        cssCodeSplit: false,
        modulePreload: false,
        rollupOptions: {
          output: {
            format: "iife",
            name: "VizionarKeynote",
            inlineDynamicImports: true,
            entryFileNames: "assets/keynote.js",
            chunkFileNames: "assets/[name].js",
            assetFileNames: "assets/[name][extname]",
          },
        },
      }
    : undefined,
}));
