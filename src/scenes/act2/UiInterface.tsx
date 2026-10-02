import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";

/**
 * Slide 39 / 75 (uiai · ui1): "Lidé milují přehledné rozhraní".
 * Strong output (clear product grid) vs. weak input (filter hell), built in HTML/CSS.
 * Replaces the former static screenshot (ui-39.jpg). Rendered as a layer above UiPair
 * while active; fades out so UiPair's following beats keep their own transitions.
 */

type Tv = {
  brand: string[];
  tone: string;
  stars: number;
  score: string;
  count: string;
  name: string;
  spec: [string, string];
  price: string;
  badge?: string;
};

const TVS: Tv[] = [
  { brand: ["LG OLED"], tone: "lg", stars: 5, score: "4,8", count: "(172)", name: "LG OLED evo C4 55\"", spec: ["OLED · 4K · 120 Hz", "WebOS · Dolby Atmos"], price: "24 990,-", badge: "Doporučujeme" },
  { brand: ["SAMSUNG", "QLED"], tone: "sam", stars: 4.5, score: "4,6", count: "(89)", name: "Samsung QLED Q60D 55\"", spec: ["QLED · 4K · 120 Hz", "Tizen · HDR10+"], price: "17 990,-" },
  { brand: ["TCL"], tone: "tcl", stars: 4.5, score: "4,6", count: "(64)", name: "TCL Mini LED C805 55\"", spec: ["Mini LED · 4K · 144 Hz", "Google TV · Dolby Vision"], price: "18 990,-" },
  { brand: ["SONY", "BRAVIA"], tone: "sony", stars: 4.5, score: "4,9", count: "(112)", name: "Sony Bravia 7 65\"", spec: ["Mini LED · 4K · 120 Hz", "Google TV · Dolby Atmos"], price: "32 990,-" },
  { brand: ["PHILIPS"], tone: "phi", stars: 4.5, score: "4,5", count: "(58)", name: "Philips The One 55\"", spec: ["QLED · 4K · 120 Hz", "Ambilight · Google TV"], price: "16 990,-" },
  { brand: ["Hisense"], tone: "his", stars: 4.5, score: "4,5", count: "(58)", name: "Hisense U7NQ 55\"", spec: ["Mini LED · 4K · 144 Hz", "VIDAA · Dolby Vision"], price: "15 990,-" },
];

type Opt = [label: string, count: string, checked?: boolean];
type Group = { name: string; open: boolean; opts: Opt[]; more?: string };

const FILTERS: Group[][] = [
  [
    { name: "Výrobce", open: true, opts: [["Samsung", "(427)"], ["LG", "(396)"], ["Sony", "(222)"], ["TCL", "(180)"], ["Philips", "(154)"]], more: "Zobrazit další (12)" },
    { name: "Rozlišení", open: false, opts: [["8K Ultra HD", "(10)"], ["4K Ultra HD", "(711)", true], ["QHD", "(58)"], ["Full HD", "(42)"], ["HD Ready", "(154)"]] },
    { name: "Úhlopříčka displeje", open: true, opts: [["32\" až 43\"", "(120)"], ["44\" až 55\"", "(427)", true], ["56\" až 65\"", "(232)"], ["66\" a více", "(98)"]] },
  ],
  [
    { name: "Obnovovací frekvence", open: false, opts: [["50 / 60 Hz", "(396)"], ["100 / 120 Hz", "(427)", true], ["144 Hz", "(222)"], ["165 Hz", "(91)"], ["240 Hz", "(14)"]] },
    { name: "Technologie panelu", open: false, opts: [["OLED", "(114)"], ["Mini LED", "(232)"], ["QLED", "(192)", true], ["LED", "(91)"], ["RGB Mini LED", "(33)"]] },
    { name: "Modelový rok", open: false, opts: [["2025", "(294)"], ["2024", "(462)"], ["2023", "(222)"], ["2022", "(96)"]], more: "Zobrazit další (3)" },
  ],
  [
    { name: "Chytré funkce (aplikace)", open: false, opts: [["Google TV", "(701)"], ["Tizen", "(427)"], ["WebOS", "(396)"], ["VIDAA", "(120)"], ["Titan OS", "(58)"]] },
    { name: "Bezdrátové připojení", open: false, opts: [["WiFi", "(653)"], ["Bluetooth", "(746)"], ["Chromecast", "(453)"], ["Apple AirPlay", "(465)"], ["DLNA", "(504)"]] },
  ],
];

/** "Zobrazit N produktů" after 0…4 ticked filters. */
const COUNTS = ["2 418", "1 532", "1 164", "902", "711"];

function Stars({ value }: { value: number }) {
  return (
    <span className="uxui-stars" style={{ ["--fill" as string]: `${(value / 5) * 100}%` }} aria-hidden="true">
      ★★★★★
    </span>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
      <path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9.6" cy="19.4" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19.4" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Chevron({ up }: { up: boolean }) {
  return (
    <svg className="uxui-chev" viewBox="0 0 12 12" width="11" height="11" aria-hidden="true">
      <path d={up ? "M2.5 8 6 4.5 9.5 8" : "M2.5 4.5 6 8 9.5 4.5"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tile({ tv }: { tv: Tv }) {
  return (
    <article data-uxui-tile className={`uxui-tile is-${tv.tone}`}>
      {tv.badge ? <em className="uxui-badge">{tv.badge}</em> : null}
      <span className="uxui-heart"><HeartIcon /></span>
      <div className="uxui-tv">
        <div className="uxui-screen">
          <span className="uxui-brand">
            {tv.brand.map((line) => <span key={line}>{line}</span>)}
          </span>
        </div>
        <i className="uxui-stand" />
      </div>
      <div className="uxui-rating">
        <Stars value={tv.stars} />
        <span>{tv.score} <small>{tv.count}</small></span>
      </div>
      <strong className="uxui-name">{tv.name}</strong>
      <span className="uxui-spec">{tv.spec[0]}</span>
      <span className="uxui-spec">{tv.spec[1]}</span>
      <footer className="uxui-buy">
        <b>{tv.price}</b>
        <span className="uxui-cart"><CartIcon />Do košíku</span>
      </footer>
    </article>
  );
}

function FilterPanel() {
  return (
    <div className="uxui-filters">
      {FILTERS.map((col, ci) => (
        <div key={col[0].name} className="uxui-col">
          {col.map((group) => (
            <div key={group.name} data-uxui-group className="uxui-group">
              <b className="uxui-group-name">{group.name}<Chevron up={group.open} /></b>
              {group.opts.map(([label, count, on]) => (
                <span key={label} className="uxui-opt" data-uxui-pick={on ? "" : undefined}>
                  <i />
                  {label} <small>{count}</small>
                </span>
              ))}
              {group.more ? <span className="uxui-more">{group.more}</span> : null}
            </div>
          ))}
          {ci === 2 ? (
            <div data-uxui-group className="uxui-group is-price">
              <b className="uxui-group-name">Cena</b>
              <span className="uxui-range"><i /><i /></span>
              <span className="uxui-range-values">
                <em>5 000,-</em>
                <em>80 000,-</em>
              </span>
              <span data-uxui-go className="uxui-go">Zobrazit <span data-uxui-count>711</span> produktů</span>
              <span className="uxui-clear">Zrušit všechny filtry</span>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** Blurred e-shop results peeking out behind the filters. */
function PeekGrid() {
  return (
    <div className="uxui-peek" aria-hidden="true">
      <div className="uxui-peek-tabs"><i /><i /><i /></div>
      {["a", "b"].map((id) => (
        <div key={id} className={`uxui-peek-card is-${id}`}>
          <span className="uxui-peek-pill" />
          <span className="uxui-peek-sale" />
          <span className="uxui-peek-img" />
          <span className="uxui-peek-stars">★★★★★</span>
          <span className="uxui-peek-line" />
          <span className="uxui-peek-line is-short" />
          <span className="uxui-peek-price" />
          <span className="uxui-peek-btn" />
        </div>
      ))}
    </div>
  );
}

export function UiInterface({ active, clicking, reduced }: { active: boolean; clicking: boolean; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<{ active: boolean; clicking: boolean } | null>(null);

  useLayoutEffect(() => {
    const ui = root.current;
    if (!ui) return;
    const was = prev.current;
    prev.current = { active, clicking };
    const ctx = gsap.context(() => {
      const q = (s: string) => gsap.utils.toArray<HTMLElement>(s, ui);
      const picks = q("[data-uxui-pick]");
      const count = ui.querySelector<HTMLElement>("[data-uxui-count]");
      const cursor = ui.querySelector<HTMLElement>("[data-uxui-cursor]");
      const ripple = ui.querySelector<HTMLElement>(".uxui-ripple");
      const go = ui.querySelector<HTMLElement>("[data-uxui-go]");
      const card = ui.querySelector<HTMLElement>('[data-uxui-card="right"]');
      const setPicked = (n: number) => {
        picks.forEach((p, i) => p.classList.toggle("is-on", i < n));
        if (count) count.textContent = COUNTS[n] ?? COUNTS[COUNTS.length - 1];
      };

      if (!active) {
        if (was?.active && !reduced) {
          gsap.set(ui, { autoAlpha: 1 });
          gsap.to(ui, { autoAlpha: 0, duration: 0.42, ease: EASE.exit });
        } else {
          gsap.set(ui, { autoAlpha: 0 });
        }
        return;
      }

      gsap.set(ui, { autoAlpha: 1 });
      gsap.set(cursor, { autoAlpha: 0 });
      // Static end states: beat 0 = nothing ticked yet, beat 1 = four filters, 711 results.
      setPicked(clicking ? picks.length : 0);
      if (reduced) return;

      const tl = gsap.timeline();
      if (was && !was.active) {
        // Back from slide 40: cross-fade in, already settled.
        tl.fromTo(ui, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.42, ease: EASE.enter }, 0);
        return;
      }

      let clickAt = 0.2;
      if (was === null) {
        // Headline → strong output → "ale" + weak input.
        const title = q("[data-uxui-title]");
        const sub = q("[data-uxui-sub]");
        const left = q('[data-uxui-card="left"]');
        const right = q('[data-uxui-card="right"]');
        const copy = q("[data-uxui-copy]");
        const tiles = q("[data-uxui-tile]");
        const groups = q("[data-uxui-group]");
        gsap.set(title, { autoAlpha: 0, y: 24 });
        gsap.set(sub, { autoAlpha: 0, y: 12 });
        gsap.set([...left, ...right], { autoAlpha: 0, y: 28 });
        gsap.set(copy, { autoAlpha: 0, y: 10 });
        gsap.set(tiles, { autoAlpha: 0, y: 14, scale: 0.94 });
        gsap.set(groups, { autoAlpha: 0, x: 16 });
        tl.to(title, { autoAlpha: 1, y: 0, duration: T.enter, stagger: 0.1, ease: EASE.enter }, 0);
        tl.to(left, { autoAlpha: 1, y: 0, duration: 0.52, ease: EASE.enter }, 0.42);
        tl.to(copy[0], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.6);
        tl.to(tiles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, stagger: 0.07, ease: EASE.enter }, 0.72);
        tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 1.42);
        tl.to(right, { autoAlpha: 1, y: 0, duration: 0.52, ease: EASE.enter }, 1.62);
        tl.to(copy[1], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 1.8);
        tl.to(groups, { autoAlpha: 1, x: 0, duration: 0.26, stagger: 0.05, ease: EASE.enter }, 1.9);
        clickAt = 2.6;
      }

      // Clicking beat only runs on the speaker's click (beat 0 → 1, or a direct link to beat 1).
      const runClicks = clicking && (was === null || (was.active && !was.clicking));
      if (!runClicks || !cursor || !card) return;
      setPicked(0);
      const scale = card.getBoundingClientRect().width / card.offsetWidth || 1;
      const cr = card.getBoundingClientRect();
      const at = (node: Element | null, dx = 0, dy = 0) => {
        if (!node) return { x: 0, y: 0 };
        const r = node.getBoundingClientRect();
        return { x: (r.left - cr.left + r.width / 2) / scale + dx, y: (r.top - cr.top + r.height / 2) / scale + dy };
      };
      const opts = q(".uxui-opt");
      const more = ui.querySelector(".uxui-more");
      // Hesitation stops before each click: browse, reconsider, move on.
      const detours: (Element | null)[][] = [
        [opts[1], more],          // LG… "Zobrazit další (12)"… → 4K Ultra HD
        [opts[10], opts[12]],     // 32"… 56"… → 44" až 55"
        [opts[14], opts[17]],     // 50/60 Hz… 165 Hz… → 100/120 Hz
        [opts[19], opts[20]],     // OLED… Mini LED… → QLED
      ];
      const start = at(go, 160, 120);
      gsap.set(cursor, { autoAlpha: 0, x: start.x, y: start.y, scale: 1 });
      let t = clickAt;
      tl.to(cursor, { autoAlpha: 1, duration: 0.2 }, t);
      picks.forEach((pick, i) => {
        detours[i]?.forEach((node) => {
          const pt = at(node, -30, 4);
          tl.to(cursor, { x: pt.x, y: pt.y, duration: 0.5, ease: EASE.move }, t);
          t += 0.72;
        });
        const target = at(pick.querySelector("i"));
        tl.to(cursor, { x: target.x, y: target.y, duration: 0.42, ease: EASE.move }, t);
        t += 0.46;
        tl.to(cursor, { scale: 0.82, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut" }, t);
        tl.fromTo(ripple, { autoAlpha: 0.9, scale: 0.2 }, { autoAlpha: 0, scale: 1.6, duration: 0.42, ease: EASE.enter }, t);
        tl.call(() => setPicked(i + 1), undefined, t + 0.06);
        if (go) tl.fromTo(go, { scale: 1 }, { scale: 1.04, duration: 0.14, yoyo: true, repeat: 1, ease: "power1.inOut" }, t + 0.1);
        t += 0.5;
      });
      const end = at(go, 40, 6);
      tl.to(cursor, { x: end.x, y: end.y, duration: 0.6, ease: EASE.move }, t);
      tl.to(cursor, { scale: 0.86, duration: 0.1, yoyo: true, repeat: 1 }, t + 0.7);
    }, ui);
    return () => ctx.revert();
  }, [active, clicking, reduced]);

  return (
    <div ref={root} data-uxui className="uxui">
      <div className="uxui-copy">
        <h2 className="uxui-title">
          <span data-uxui-title>Lidé milují</span>
          <span data-uxui-title>přehledné rozhraní</span>
        </h2>
        <p data-uxui-sub className="uxui-sub">Ale nechtějí klikat, než se k výsledku dostanou.</p>
      </div>

      <section data-uxui-card="left" className="uxui-card">
        <div data-uxui-copy className="uxui-card-copy">
          <div className="uxui-kicker">Výstup · silný</div>
          <div className="uxui-head">Přehledný výsledek</div>
          <div className="uxui-note">Vidím televize, které dávají smysl.</div>
        </div>
        <div className="uxui-grid">
          {TVS.map((tv) => <Tile key={tv.name} tv={tv} />)}
        </div>
      </section>

      <section data-uxui-card="right" className="uxui-card is-weak">
        <PeekGrid />
        <div data-uxui-copy className="uxui-card-copy">
          <div className="uxui-kicker">Vstup · slabý</div>
          <div className="uxui-head">Peklo klikání</div>
          <div className="uxui-note">Než se dostanu k výsledku, musím projít příliš mnoho voleb.</div>
        </div>
        <FilterPanel />
        <span data-uxui-cursor className="uxui-cursor" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="34" height="34">
            <path d="M5 2.5v17.2l4.6-4.3 3 6.6 3-1.4-3-6.4h6.2Z" fill="#fff" stroke="#16264a" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <i className="uxui-ripple" />
        </span>
      </section>
    </div>
  );
}
