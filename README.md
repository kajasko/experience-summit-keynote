# Vizionář v době AI — live keynote

Fullscreen 45-minute conference keynote for CX, product, design and C-level audiences. The 75 controlled reveals are distilled from `2026_09_06_Vizionář v době_key note2.pdf`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev
```

Open the local URL. Press **F** for fullscreen.

## Controls

| Key | Action |
|---|---|
| → · Space · PageDown | next step |
| ← · PageUp | previous step |
| click | next |
| right-click | previous |
| R | restart scene |
| F | fullscreen |
| N | presenter notes |
| S | citation emphasis |
| Esc | exit overlays / fullscreen |

URL state: `#act=0&scene=history&step=2`

Rehearsal: `?debug=1`

## Build / validate

```bash
npm run build
npm run preview
npm run validate:deck
npm run export:frames
```

Works offline after `npm run build` (relative `base: './'`).

## Principle

The speaker carries the explanation; the screen carries one image or one idea. Motion reveals meaning, not decoration. Every number remains tied to the source deck. No invented claims.

## Motion revize

`src/engine/choreography.ts` obsahuje samostatný score pro všech 75 speaker stavů. `SceneMotion.tsx` vlastní timelines a cleanup. Durations a easing jsou v `motion.ts`; změny stavu se nepouštějí automaticky. Přehled zásahů, pozornosti a návazností je v `MOTION_AUDIT.md`.

Ověření: `npm run build` a `npm run validate:deck`. Na macOS testy využijí nainstalovaný Chrome; jinde standardní Playwright Chromium (případně `PLAYWRIGHT_CHANNEL`). Testy vytvářejí 75 finálních snímků pro každý režim a 75 mezistavů do `validation/`. Kontrolují také rychlé šipky, návrat, přímé odkazy, restart, přepnutí reduced motion a stabilitu po skončení animace.

Hero pozice mají současné fotografie a grafické kompozice dle dodaného briefu. `EditorialHero` přijímá volitelný `imageSrc`, takže pozdější finální obraz zdědí stejné odhalení. Stav 75 stále vyžaduje dodání volitelného filmu.

## Vizuální směr

Aktuální preference Clientology a důvody světlé revize jsou v [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md). Historické slajdy zachovávají kompozici a používají plynulou časovou osu; stav DNES má nové odhalení výsledku.

## Deploy (GitHub Pages)

Live: https://kajasko.github.io/experience-summit-keynote/

- `.github/workflows/deploy.yml` builds on every push to `main` (or manually via *Run workflow*) and publishes `dist/` to GitHub Pages.
- In the repo settings set **Pages → Build and deployment → Source: GitHub Actions**.
- The production base path is `/experience-summit-keynote/` (see `vite.config.ts`; override with `PAGES_BASE=/other/ npm run build`). `npm run dev` keeps serving from `/`.
- Local check of the production build: `npm run build && npm run preview` → http://127.0.0.1:4173/experience-summit-keynote/

## Assets & mobile

- Large images are served as WebP from `public/assets/`; lossless originals live in `source-assets/png/` (not deployed).
- Images are preloaded only for the current, previous and next 3 scenes (`src/engine/preload.ts`, map in `src/engine/sceneImages.ts`).
- Phones: tap the right two thirds = next, left third = previous; swipe left/right also works. In landscape the dock sits on the right edge.
- Overview thumbnails: `npm run export:thumbs` writes one WebP per visual slide to `public/assets/thumbs/<first step id>.webp` (final built state of the slide).
- Slides vs steps: a step is one click; a slide is one visual composition (a scene's first step plus any `SLIDE_BREAKS` in `src/deck/deck.ts`). Slide numbers, the "NN / total" page counter, the dock counter and the overview tiles all derive from `slides` in `deck.ts`; the `page` prop on `SlideChrome` only toggles whether the counter is shown.
