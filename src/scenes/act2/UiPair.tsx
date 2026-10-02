import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";

const PROMPT = "Pomoz mi vybrat nejlepší.";

const BEATS = [
  {
    title: ["Lidé milují", "přehledné rozhraní"],
    sub: "Ale nechtějí klikat, než se k výsledku dostanou.",
  },
  {
    title: ["AI řeší vstup.", "Výstup už ne."],
    sub: "Rozumí jazyku. Vrací zeď textu.",
  },
  {
    title: ["To nejlepší", "z obou světů"],
    sub: "Vstup rozumí záměru. Výstup dává přehled.",
  },
] as const;

const CARDS = {
    left: [
    { kicker: "Výstup · silný", head: "Přehledný výsledek", note: "Vidím televize, které dávají smysl." },
    { kicker: "Vstup · silný", head: "Přirozený jazyk", note: "Řeknu, co chci." },
    { kicker: "Vstup, který rozumí", head: "Řeknu to lidsky", note: "Psaný i mluvený jazyk." },
  ],
  right: [
    { kicker: "Vstup · slabý", head: "Peklo klikání", note: "Než se dostanu k výsledku, musím projít příliš mnoho voleb." },
    { kicker: "Výstup · slabý", head: "Zeď textu", note: "Neumím se v tom vyznat." },
    { kicker: "Výstup, který máme rádi", head: "Vidím výsledek", note: "Karty, video, přehled." },
  ],
} as const;

const TVS = [
  { brand: "LG OLED", name: "LG OLED evo C4 55\"", spec: "OLED · 4K · 120 Hz\nWebOS · Dolby Atmos", price: "24 990,-", score: "4,8 (172)", badge: "Doporučujeme", tone: "lg" },
  { brand: "SAMSUNG\nQLED", name: "Samsung QLED Q60D 55\"", spec: "QLED · 4K · 120 Hz\nTizen · HDR10+", price: "17 990,-", score: "4,6 (89)", tone: "sam" },
  { brand: "TCL", name: "TCL Mini LED C805 55\"", spec: "Mini LED · 4K · 144 Hz\nGoogle TV · Dolby Vision", price: "18 990,-", score: "4,6 (64)", tone: "tcl" },
  { brand: "SONY\nBRAVIA", name: "Sony Bravia 7 65\"", spec: "Mini LED · 4K · 120 Hz\nGoogle TV · Dolby Atmos", price: "32 990,-", score: "4,9 (112)", tone: "sony" },
  { brand: "PHILIPS", name: "Philips The One 55\"", spec: "OLED · 4K · 144 Hz\nAmbilight · Google TV", price: "16 990,-", score: "4,5 (58)", tone: "phi" },
  { brand: "Hisense", name: "Hisense U7NQ 55\"", spec: "Mini LED · 4K · 144 Hz\nVIDAA · Dolby Vision", price: "15 990,-", score: "4,4 (41)", tone: "his" },
] as const;

function ProductGrid() {
  return (
    <div className="ui-shop" data-ui-grid>
      {TVS.map((tv) => (
        <article key={tv.name} data-ui-tile className={`ui-tv is-${tv.tone}`}>
          {"badge" in tv && tv.badge ? <em className="ui-tv-badge">{tv.badge}</em> : <em className="ui-tv-heart" aria-hidden="true" />}
          <span className="ui-tv-screen">{tv.brand}</span>
          <b className="ui-tv-score">★★★★★ {tv.score}</b>
          <strong>{tv.name}</strong>
          <small>{tv.spec}</small>
          <footer>
            <b>{tv.price}</b>
            <button type="button">Do košíku</button>
          </footer>
        </article>
      ))}
    </div>
  );
}

const FILTER_COLS = [
  [
    { name: "Výrobce", opts: [["Samsung (427)", false], ["LG (396)", true], ["Sony (222)", false], ["TCL (180)", false], ["Philips (154)", false], ["Zobrazit další (12)", false]] },
    { name: "Rozlišení", opts: [["8K Ultra HD (10)", false], ["4K Ultra HD (711)", true], ["QHD (58)", false], ["Full HD (42)", false], ["HD Ready (154)", false]] },
    { name: "Úhlopříčka displeje", opts: [["32\" až 43\" (120)", false], ["44\" až 55\" (427)", true], ["56\" až 65\" (232)", false], ["66\" a více (58)", false]] },
  ],
  [
    { name: "Obnovovací frekvence", opts: [["50 / 60 Hz (396)", false], ["100 / 120 Hz (427)", true], ["144 Hz (222)", false], ["165 Hz (91)", false], ["240 Hz (14)", false]] },
    { name: "Technologie panelu", opts: [["OLED (114)", false], ["Mini LED (232)", false], ["QLED (192)", true], ["LED (91)", false], ["RGB Mini LED (33)", false]] },
    { name: "Modelový rok", opts: [["2025 (294)", false], ["2024 (222)", true], ["2023 (222)", false], ["2022 (96)", false]] },
  ],
  [
    { name: "Chytré funkce", opts: [["Google TV (70)", false], ["Tizen (427)", true], ["WebOS (396)", false], ["VIDAA (120)", false], ["Titan OS (58)", false]] },
    { name: "Bezdrátové připojení", opts: [["WiFi (653)", true], ["Bluetooth (746)", false], ["Chromecast (453)", false], ["Apple AirPlay (465)", false], ["DLNA (504)", false]] },
  ],
] as const;

function FilterList() {
  return (
    <div className="ui-hell">
      <div className="ui-hell-cols">
        {FILTER_COLS.map((col) => (
          <div key={col[0].name} className="ui-hell-col">
            {col.map((group) => (
              <div key={group.name} data-ui-row className="ui-hell-group">
                <b>{group.name}</b>
                {group.opts.map(([label, on]) => (
                  <label key={label} className={on ? "is-on" : undefined}>
                    <i />
                    {label}
                  </label>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="ui-hell-price">
        <b>Cena</b>
        <span><i /></span>
        <em>5 000,-</em>
        <em>80 000,-</em>
      </div>
      <button type="button" className="ui-hell-go">Zobrazit 711 produktů</button>
      <button type="button" className="ui-hell-clear">Zrušit všechny filtry</button>
      <span data-ui-cursor className="ui-cursor" />
    </div>
  );
}

function SearchFace() {
  return (
    <div className="ui-search">
      <div className="ui-search-pill">
        <span data-ui-typed />
        <span data-ui-caret className="caret is-scripted" aria-hidden="true" />
      </div>
    </div>
  );
}

function MixFace() {
  return (
    <div className="ui-mix">
      <div data-ui-mix="chart" className="ui-mix-card is-chart">
        <div className="ui-bars">
          {[18, 32, 24, 40, 28].map((h) => (
            <span key={h} style={{ height: h }} />
          ))}
        </div>
      </div>
      <div data-ui-mix="chat" className="ui-mix-card is-chat">
        <em />
        <em className="is-me" />
        <em />
      </div>
      <div data-ui-mix="play" className="ui-mix-card is-play">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M8 6.5v11l10-5.5Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

const ALZA_FILTERS = [
  { name: "Značka", opts: ["Samsung", "Apple", "Xiaomi", "Motorola", "Google"] },
  { name: "Cena", opts: ["do 8 000", "8–15 000", "15–25 000", "nad 25 000"] },
  { name: "Úhlopříčka", opts: ["do 6,1\"", "6,1–6,5\"", "6,5–6,8\"", "nad 6,8\""] },
  { name: "RAM", opts: ["6 GB", "8 GB", "12 GB", "16 GB"] },
  { name: "Úložiště", opts: ["128 GB", "256 GB", "512 GB", "1 TB"] },
  { name: "Fotoaparát", opts: ["do 50 Mpx", "50–108 Mpx", "200 Mpx+", "periscope"] },
  { name: "Baterie", opts: ["do 4 500", "4 500–5 000", "5 000–5 500", "nad 5 500"] },
  { name: "Další", opts: ["5G", "Dual SIM", "IP68", "bezdrátové", "eSIM"] },
] as const;

function AlzaShot() {
  return (
    <div className="ui-alza">
      <div className="ui-alza-chrome">
        <i /><i /><i />
        <span>alza.cz/mobily · 48 filtrů · 1 284 položek</span>
      </div>
      <div className="ui-alza-body">
        <aside className="ui-alza-filters">
          {ALZA_FILTERS.map((group) => (
            <div key={group.name} className="ui-alza-group">
              <b>{group.name}</b>
              {group.opts.map((opt) => (
                <label key={opt}>
                  <em />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </aside>
        <div className="ui-alza-grid">
          {["A", "B", "C", "D", "E", "F"].map((id) => (
            <div key={id} className="ui-alza-item">
              <span>{id}</span>
              <i />
              <i />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RealChat() {
  return (
    <div className="ui-gpt">
      <div className="ui-gpt-bar">
        <b />
        ChatGPT
        <em>GPT-4o</em>
      </div>
      <div className="ui-gpt-log">
        <div className="ui-gpt-me">
          Pomoz mi vybrat nejlepší telefon do 15 tisíc, ať slušně fotí a vydrží baterka. Ideálně ne úplně velký.
        </div>
        <div className="ui-gpt-bot">
          Jasně — i když „nejlepší“ je vždycky trochu ošidné, protože záleží, jestli ti víc vadí velikost, výdrž, foto, nebo to, jak dlouho dostaneš aktualizace, a u 15 000 Kč stejně skoro vždycky něco obětuješ. Obecně bych se teď díval spíš na střední Android než na starší iPhone, protože za ty peníze často dostaneš lepší baterku a nabíjení, ale iPhone zase drží cenu a ekosystém, takže pokud už máš AirPods a Mac, dává to jiný smysl, a naopak pokud fotíš hodně večer, řeš spíš zpracování a optiku než megapixely na papíře.
          <br /><br />
          1) Něco jako Pixel / čistší Android — fajn foto a čistý systém, ale ověř dostupnost a cenu u nás, někdy to skočí přes budget.
          <br />
          2) Samsung A / S FE řada — většinou bezpečná volba, hodně výbavy, ale One UI je hutnější a telefony bývají větší, což jsi nechtěl.
          <br />
          3) Xiaomi / Motorola — poměr cena/výkon, pozor na bloat, aktualizace a konkrétní recenze baterie, ne na tabulku mAh.
          <br /><br />
          Když to zúžím bez toho, abych viděl, co už máš: ber střední třídu s 8 GB RAM, 256 GB, analogovým 50+ Mpx a baterií nad 5 000 mAh, ideálně do 6,4". Pokud chceš, můžu ti udělat tabulku podle toho, jestli víc řešíš foto, velikost, nebo výdrž — ale stejně ti neřeknu jednu pravdu, spíš tři kompromisy a ty si vybereš, který ti nejmíň vadí.
        </div>
      </div>
    </div>
  );
}

function RealOut() {
  return (
    <div className="ui-real">
      <article data-ui-real="phones" className="ui-real-pane">
        <div className="ui-real-head">Chat · Telefony</div>
        <div className="ui-real-phones">
          {["Pixel 9a", "Galaxy A56", "moto g86"].map((name, i) => (
            <div key={name} className="ui-real-phone">
              <span style={{ background: ["#03383d", "#005860", "#7eb8bc"][i] }} />
              <b>{name}</b>
              <em>{["12 990 Kč", "11 490 Kč", "8 990 Kč"][i]}</em>
            </div>
          ))}
        </div>
      </article>
      <article data-ui-real="dash" className="ui-real-pane">
        <div className="ui-real-head">Chat · Přehled</div>
        <div className="ui-real-dash">
          <div className="ui-bars is-real">
            {[22, 36, 28, 44, 30, 18].map((h) => (
              <span key={h} style={{ height: h }} />
            ))}
          </div>
          <div className="ui-real-kpis">
            <b>Foto 8.4</b>
            <b>Baterie 9.1</b>
            <b>Velikost 7.6</b>
          </div>
        </div>
      </article>
      <article data-ui-real="video" className="ui-real-pane">
        <div className="ui-real-head">Chat · Výklad</div>
        <div className="ui-real-video">
          <button type="button" aria-label="Přehrát">▶</button>
          <span>Jak číst recenzi fotoaparátu</span>
        </div>
      </article>
    </div>
  );
}

const ROW_Y = [18, 62, 118, 174];
const beatOf = (step: number) => (step <= 1 ? 0 : step === 2 ? 1 : 2);

export function UiPair({ step, reduced }: { step: number; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);

  useLayoutEffect(() => {
    const last = prev.current;
    prev.current = step;
    const el = root.current;
    if (!el) return;

    const titles = gsap.utils.toArray<HTMLElement>("[data-ui-title]", el);
    const subs = gsap.utils.toArray<HTMLElement>("[data-ui-sub]", el);
    const leftCopy = gsap.utils.toArray<HTMLElement>("[data-ui-left]", el);
    const rightCopy = gsap.utils.toArray<HTMLElement>("[data-ui-right]", el);
    const beat = beatOf(step);
    const gridFace = el.querySelector<HTMLElement>('[data-face="ui-out"]');
    const searchFace = el.querySelector<HTMLElement>('[data-face="ai-in"]');
    const filterFace = el.querySelector<HTMLElement>('[data-face="ui-in"]');
    const alzaFace = el.querySelector<HTMLElement>('[data-face="alza-in"]');
    const wallFace = el.querySelector<HTMLElement>('[data-face="ai-out"]');
    const mixFace = el.querySelector<HTMLElement>('[data-face="future-out"]');
    const realFace = el.querySelector<HTMLElement>('[data-face="real-out"]');
    const realBits = gsap.utils.toArray<HTMLElement>("[data-ui-real]", el);
    const leftCard = el.querySelector<HTMLElement>('[data-ui-card="left"]');
    const rightCard = el.querySelector<HTMLElement>('[data-ui-card="right"]');
    const cards = [leftCard, rightCard].filter(Boolean) as HTMLElement[];
    const link = el.querySelector<HTMLElement>("[data-ui-link]");
    const linkPath = link?.querySelector("path") as unknown as SVGPathElement | null;
    const typed = el.querySelector<HTMLElement>("[data-ui-typed]");
    const caret = el.querySelector<HTMLElement>("[data-ui-caret]");
    const cursor = el.querySelector<HTMLElement>("[data-ui-cursor]");
    const tiles = gsap.utils.toArray<HTMLElement>("[data-ui-tile]", el);
    const rows = gsap.utils.toArray<HTMLElement>("[data-ui-row]", el);
    const lines = gsap.utils.toArray<HTMLElement>("[data-ui-line]", el);
    const mix = gsap.utils.toArray<HTMLElement>("[data-ui-mix]", el);
    const titleLines = (beat: number) => ({
      a: titles[beat]?.querySelector<HTMLElement>('[data-t="a"]'),
      b: titles[beat]?.querySelector<HTMLElement>('[data-t="b"]'),
    });

    const morph = !reduced && last !== null && last !== step && Math.abs(last - step) === 1;
    const enter = !reduced && step === 0 && (last === null || last === 0);

    const setActiveRow = (index: number) => {
      rows.forEach((row, i) => row.classList.toggle("is-on", i === index));
    };

    const setGlow = (on: boolean) => {
      cards.forEach((card) => card.classList.toggle("is-future", on));
    };

    const hideCopy = (nodes: HTMLElement[]) => {
      gsap.set(nodes, { autoAlpha: 0, y: 8 });
    };

    const settle = () => {
      titles.forEach((node, i) => {
        gsap.set(node, { autoAlpha: i === beat ? 1 : 0, y: 0 });
        node.querySelectorAll<HTMLElement>("[data-t]").forEach((line) => gsap.set(line, { autoAlpha: 1, y: 0 }));
      });
      subs.forEach((node, i) => gsap.set(node, { autoAlpha: i === beat ? 1 : 0, y: 0 }));
      leftCopy.forEach((node, i) => gsap.set(node, { autoAlpha: i === beat ? 1 : 0, y: 0 }));
      rightCopy.forEach((node, i) => gsap.set(node, { autoAlpha: i === beat ? 1 : 0, y: 0 }));
      gsap.set(cards, { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(gridFace, { autoAlpha: beat === 0 ? 1 : 0, y: 0 });
      gsap.set(searchFace, { autoAlpha: beat >= 1 ? 1 : 0, y: 0 });
      gsap.set(filterFace, { autoAlpha: step === 0 ? 1 : 0, y: 0 });
      gsap.set(alzaFace, { autoAlpha: step === 1 ? 1 : 0, y: 0 });
      gsap.set(wallFace, { autoAlpha: step === 2 ? 1 : 0, y: 0 });
      gsap.set(mixFace, { autoAlpha: step === 3 ? 1 : 0, y: 0 });
      gsap.set(realFace, { autoAlpha: step === 4 ? 1 : 0, y: 0 });
      gsap.set(tiles, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(rows, { autoAlpha: 1, x: 0 });
      gsap.set(lines, { autoAlpha: 0, scaleX: 1, transformOrigin: "0% 50%" });
      gsap.set(mix, { autoAlpha: step === 3 ? 1 : 0, y: 0, scale: 1 });
      gsap.set(realBits, { autoAlpha: step === 4 ? 1 : 0, y: 0 });
      if (typed) typed.textContent = beat >= 1 ? PROMPT : "";
      if (caret) gsap.set(caret, { autoAlpha: step === 2 ? 1 : 0, opacity: step === 2 ? 1 : 0 });
      if (cursor) gsap.set(cursor, { top: ROW_Y[2], autoAlpha: step === 0 ? 1 : 0, scale: 1 });
      setActiveRow(step === 0 ? 2 : -1);
      setGlow(step >= 3);
      if (link) gsap.set(link, { autoAlpha: step >= 3 ? 1 : 0 });
      if (linkPath) {
        const length = linkPath.getTotalLength();
        gsap.set(linkPath, { strokeDasharray: length, strokeDashoffset: step >= 3 ? 0 : length });
      }
    };

    const swapTitle = (tl: gsap.core.Timeline, at: number, holdSecond = false) => {
      titles.forEach((node, i) => {
        tl.to(node, { autoAlpha: i === beat ? 1 : 0, y: i === beat ? 0 : -8, duration: 0.36, ease: EASE.move }, at);
      });
      const { a, b } = titleLines(beat);
      if (a) gsap.set(a, { autoAlpha: 1, y: 0 });
      if (b) gsap.set(b, holdSecond ? { autoAlpha: 0, y: 8 } : { autoAlpha: 1, y: 0 });
    };

    const hideSubs = (tl: gsap.core.Timeline, at: number) => {
      subs.forEach((node) => tl.to(node, { autoAlpha: 0, y: 6, duration: 0.22, ease: EASE.exit }, at));
    };

    const showSub = (tl: gsap.core.Timeline, at: number) => {
      const node = subs[beat];
      if (!node) return;
      tl.fromTo(node, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, at);
    };

    const showNode = (tl: gsap.core.Timeline, node: HTMLElement | null, at: number, extra: gsap.TweenVars = {}) => {
      if (!node) return;
      tl.to(node, { autoAlpha: 1, x: 0, y: 0, duration: 0.42, ease: EASE.enter, ...extra }, at);
    };

    const hideNode = (tl: gsap.core.Timeline, node: HTMLElement | null, at: number) => {
      if (!node) return;
      tl.to(node, { autoAlpha: 0, y: 10, duration: 0.28, ease: EASE.exit }, at);
    };

    if (!morph) {
      if (!enter) {
        settle();
        return;
      }

      gsap.set(titles, { autoAlpha: 0, y: 0 });
      gsap.set(titles[0], { autoAlpha: 0, y: T.y });
      titles[0]?.querySelectorAll<HTMLElement>("[data-t]").forEach((line) => gsap.set(line, { autoAlpha: 1, y: 0 }));
      hideCopy(subs);
      hideCopy(leftCopy);
      hideCopy(rightCopy);
      gsap.set(leftCard, { autoAlpha: 0, x: -28, y: 18 });
      gsap.set(rightCard, { autoAlpha: 0, x: 28, y: 18 });
      gsap.set([gridFace, filterFace, searchFace, wallFace, mixFace, alzaFace, realFace], { autoAlpha: 0, y: 0 });
      gsap.set(realBits, { autoAlpha: 0, y: 12 });
      gsap.set(tiles, { autoAlpha: 0, y: 14, scale: 0.9 });
      gsap.set(rows, { autoAlpha: 0, x: 16 });
      gsap.set(cursor, { autoAlpha: 0, top: ROW_Y[0], scale: 1 });
      gsap.set(lines, { autoAlpha: 0, scaleX: 1 });
      gsap.set(mix, { autoAlpha: 0 });
      if (typed) typed.textContent = "";
      if (caret) gsap.set(caret, { autoAlpha: 0 });
      if (link) gsap.set(link, { autoAlpha: 0 });
      setActiveRow(-1);
      setGlow(false);

      const tl = gsap.timeline();
      tl.to(titles[0], { autoAlpha: 1, y: 0, duration: T.enter, ease: EASE.enter }, 0);

      tl.to(leftCard, { autoAlpha: 1, x: 0, y: 0, duration: 0.52, ease: EASE.enter }, 0.72);
      showNode(tl, leftCopy[0], 0.92);
      showNode(tl, gridFace, 1.05);
      tl.to(tiles, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, stagger: 0.08, ease: EASE.enter }, 1.12);

      showSub(tl, 2.05);
      tl.to(rightCard, { autoAlpha: 1, x: 0, y: 0, duration: 0.52, ease: EASE.enter }, 2.28);
      showNode(tl, rightCopy[0], 2.48);
      showNode(tl, filterFace, 2.58);
      tl.to(rows, { autoAlpha: 1, x: 0, duration: 0.26, stagger: 0.06, ease: EASE.enter }, 2.66);
      tl.to(cursor, { autoAlpha: 1, duration: 0.18 }, 3.12);
      ROW_Y.forEach((top, i) => {
        const at = 3.22 + i * 0.34;
        tl.to(cursor, { top, duration: 0.22, ease: EASE.move }, at);
        tl.to(cursor, { scale: 0.72, duration: 0.08, yoyo: true, repeat: 1 }, at + 0.14);
        tl.call(() => setActiveRow(i), undefined, at + 0.14);
      });
      return () => { tl.kill(); };
    }

    const tl = gsap.timeline();
    tl.to(cards, { autoAlpha: 1, x: 0, y: 0, duration: 0.28, ease: EASE.enter }, 0);

    if (step === 1 && last === 0) {
      hideNode(tl, filterFace, 0);
      if (cursor) tl.to(cursor, { autoAlpha: 0, duration: 0.16 }, 0);
      gsap.set(alzaFace, { autoAlpha: 0, y: 12 });
      showNode(tl, alzaFace, 0.16);
      return () => { tl.kill(); };
    }

    if (step === 0 && last === 1) {
      hideNode(tl, alzaFace, 0);
      showNode(tl, filterFace, 0.16);
      if (cursor) tl.to(cursor, { autoAlpha: 1, top: ROW_Y[2], scale: 1, duration: 0.24 }, 0.2);
      tl.call(() => setActiveRow(2), undefined, 0.2);
      return () => { tl.kill(); };
    }

    if (step === 4 && last === 3) {
      hideNode(tl, mixFace, 0);
      gsap.set(realFace, { autoAlpha: 0 });
      gsap.set(realBits, { autoAlpha: 0, y: 16 });
      showNode(tl, realFace, 0.18);
      tl.to(realBits, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12, ease: EASE.enter }, 0.28);
      return () => { tl.kill(); };
    }

    if (step === 3 && last === 4) {
      hideNode(tl, realFace, 0);
      tl.to(realBits, { autoAlpha: 0, y: 8, duration: 0.2, ease: EASE.exit }, 0);
      gsap.set(mix, { autoAlpha: 0, y: 12, scale: 0.94 });
      showNode(tl, mixFace, 0.16);
      tl.to(mix, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, stagger: 0.08, ease: EASE.enter }, 0.22);
      return () => { tl.kill(); };
    }

    hideSubs(tl, 0);

    if (step === 2 && last === 3) {
      swapTitle(tl, 0);
      setGlow(false);
      if (link) tl.to(link, { autoAlpha: 0, duration: 0.2 }, 0);
      hideNode(tl, mixFace, 0.06);
      hideNode(tl, realFace, 0.06);
      hideNode(tl, leftCopy[2], 0);
      hideNode(tl, rightCopy[2], 0.04);
      if (typed) typed.textContent = PROMPT;
      caret?.classList.add("is-scripted");
      gsap.set(caret, { autoAlpha: 1, opacity: 1 });
      gsap.set(wallFace, { autoAlpha: 0, y: 12 });
      showNode(tl, wallFace, 0.22);
      showNode(tl, leftCopy[1], 0.32);
      showNode(tl, rightCopy[1], 0.48);
      showSub(tl, 0.62);
    } else if (step === 2) {
      swapTitle(tl, 0, true);
      hideNode(tl, leftCopy[0], 0);
      if (cursor) tl.to(cursor, { autoAlpha: 0, duration: 0.16 }, 0);

      hideNode(tl, gridFace, 0.18);
      hideNode(tl, alzaFace, 0.12);
      gsap.set(searchFace, { autoAlpha: 0, y: 12 });
      showNode(tl, searchFace, 0.42);
      if (typed) typed.textContent = "";
      caret?.classList.add("is-scripted");
      gsap.set(caret, { autoAlpha: 1, opacity: 1 });
      const typeAt = 0.62;
      const typeDur = 1.85;
      const typedObj = { n: 0 };
      tl.to(typedObj, {
        n: PROMPT.length,
        duration: typeDur,
        ease: "none",
        onUpdate: () => {
          if (typed) typed.textContent = PROMPT.slice(0, Math.round(typedObj.n));
        },
      }, typeAt);
      showNode(tl, leftCopy[1], 0.86);

      const afterType = typeAt + typeDur + 0.5;
      const { b } = titleLines(1);
      if (b) tl.to(b, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, afterType);
      hideNode(tl, rightCopy[0], afterType);
      hideNode(tl, filterFace, afterType);
      hideNode(tl, alzaFace, afterType);
      gsap.set(wallFace, { autoAlpha: 0, y: 12 });
      showNode(tl, wallFace, afterType + 0.2);
      showNode(tl, rightCopy[1], afterType + 0.92);
      showSub(tl, afterType + 1.18);
    }

    if (step === 3) {
      swapTitle(tl, 0);
      if (typed) typed.textContent = PROMPT;
      if (caret) tl.to(caret, { autoAlpha: 0, duration: 0.16 }, 0);
      hideNode(tl, leftCopy[1], 0);
      hideNode(tl, rightCopy[1], 0.04);
      hideNode(tl, wallFace, 0.12);

      gsap.set(mixFace, { autoAlpha: 0 });
      gsap.set(mix, { autoAlpha: 0, y: 18, scale: 0.88 });
      showNode(tl, mixFace, 0.42);
      tl.to(mix, { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.24, ease: EASE.enter }, 0.5);

      if (link && linkPath) {
        const length = linkPath.getTotalLength();
        gsap.set(link, { autoAlpha: 1 });
        gsap.set(linkPath, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(linkPath, { strokeDashoffset: 0, duration: T.line, ease: EASE.move }, 1.28);
      }
      tl.call(() => setGlow(true), undefined, 1.36);
      showNode(tl, leftCopy[2], 1.58);
      showNode(tl, rightCopy[2], 1.7);
      showSub(tl, 1.95);
    }

    if (step === 1 && last === 2) {
      swapTitle(tl, 0);
      if (typed) typed.textContent = "";
      if (caret) tl.to(caret, { autoAlpha: 0, duration: 0.14 }, 0);
      hideNode(tl, searchFace, 0.06);
      hideNode(tl, wallFace, 0.08);
      hideNode(tl, leftCopy[1], 0);
      hideNode(tl, rightCopy[1], 0.04);
      showNode(tl, gridFace, 0.2);
      showNode(tl, leftCopy[0], 0.28);
      showNode(tl, rightCopy[0], 0.32);
      gsap.set(alzaFace, { autoAlpha: 0, y: 12 });
      showNode(tl, alzaFace, 0.28);
      showSub(tl, 0.46);
    }

    if (step === 0 && last !== 1) {
      swapTitle(tl, 0);
      setGlow(false);
      if (typed) typed.textContent = "";
      if (caret) tl.to(caret, { autoAlpha: 0, duration: 0.14 }, 0);
      if (link) tl.to(link, { autoAlpha: 0, duration: 0.18 }, 0);
      hideNode(tl, searchFace, 0.06);
      hideNode(tl, wallFace, 0.08);
      hideNode(tl, mixFace, 0.08);
      hideNode(tl, alzaFace, 0.08);
      hideNode(tl, realFace, 0.08);
      hideNode(tl, leftCopy[last ?? 1], 0);
      hideNode(tl, rightCopy[last ?? 1], 0.04);
      gsap.set(tiles, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(rows, { autoAlpha: 1, x: 0 });
      showNode(tl, gridFace, 0.22);
      showNode(tl, filterFace, 0.28);
      showNode(tl, leftCopy[0], 0.32);
      showNode(tl, rightCopy[0], 0.38);
      if (cursor) tl.to(cursor, { autoAlpha: 1, top: ROW_Y[2], scale: 1, duration: 0.28 }, 0.4);
      tl.call(() => setActiveRow(2), undefined, 0.4);
      showSub(tl, 0.52);
    }

    return () => { tl.kill(); };
  }, [step, reduced]);

  return (
    <div ref={root} className={`ui-pair is-beat-${step}`}>
      <div className="ui-copy">
        {BEATS.map((beat) => (
          <div key={beat.title.join(" ")} data-ui-title className="ui-title">
            <span data-t="a">{beat.title[0]}</span>
            <br />
            <span data-t="b">{beat.title[1]}</span>
          </div>
        ))}
        {BEATS.map((beat) => (
          <div key={beat.sub} data-ui-sub className="ui-sub">{beat.sub}</div>
        ))}
      </div>

      <div className="ui-stage">
        <svg className="ui-link" data-ui-link viewBox="0 0 1760 80" aria-hidden="true">
          <path d="M820 40 C 860 40, 900 40, 940 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
        </svg>

        <article data-ui-card="left" className="ui-card">
          {CARDS.left.map((copy) => (
            <div key={copy.head} data-ui-left className="ui-card-copy">
              <div className="ui-kicker">{copy.kicker}</div>
              <div className="ui-head">{copy.head}</div>
              <div className="ui-note">{copy.note}</div>
            </div>
          ))}
          <div className="ui-screen">
            <div data-face="ui-out" className="ui-face"><ProductGrid /></div>
            <div data-face="ai-in" className="ui-face"><SearchFace /></div>
          </div>
        </article>

        <article data-ui-card="right" className="ui-card">
          {CARDS.right.map((copy, i) => (
            <div key={copy.head} data-ui-right className={`ui-card-copy${i < 2 ? " is-weak" : ""}`}>
              <div className="ui-kicker">{copy.kicker}</div>
              <div className="ui-head">{copy.head}</div>
              <div className="ui-note">{copy.note}</div>
            </div>
          ))}
          <div className="ui-screen">
            <div data-face="ui-in" className="ui-face"><FilterList /></div>
            <div data-face="alza-in" className="ui-face"><AlzaShot /></div>
            <div data-face="ai-out" className="ui-face"><RealChat /></div>
            <div data-face="future-out" className="ui-face"><MixFace /></div>
            <div data-face="real-out" className="ui-face"><RealOut /></div>
          </div>
        </article>
      </div>
    </div>
  );
}
