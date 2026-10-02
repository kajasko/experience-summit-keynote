import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { HeroText } from "../../components/HeroText";
import { SlideChrome } from "../../components/SlideChrome";
import { GlassStats } from "../../components/GlassStats";
import { EASE, MOTION as T } from "../../engine/motion";
import { asset } from "../../engine/assets";
import { HitlCycle } from "./HitlCycle";

const ACT = "03 Proč věřit?";
const MOTION = (reduced: boolean) => reduced ? "none" : "none";

function Chrome({ page, caption, dark = false }: { page: string; caption: string; dark?: boolean }) {
  return (
    <div
      style={dark ? {
        "--text-deep": "#03383d",
        "--muted": "#617779",
      } as React.CSSProperties : undefined}
    >
      <SlideChrome kicker={ACT} page={`${page} / 75`} caption={caption} captionDot />
    </div>
  );
}

function Arrow({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="92" height="28" viewBox="0 0 92 28" aria-hidden="true" style={{ flex: "0 0 auto" }}>
      <path d="M1 14h84M72 2l13 12-13 12" fill="none" stroke={dark ? "var(--teal)" : "var(--text-deep)"} strokeWidth="3" />
    </svg>
  );
}

const DISTRUST_TITLE = [
  ["Pochybnost", "se", "stala"],
  ["zkušeností."],
];

const DISTRUST_STATS = [
  { id: "60", value: 60, unit: "%", cap: "více zpochybňuje autenticitu obsahu" },
  { id: "39", value: 39, unit: "%", cap: "narazilo na falešné recenze" },
  { id: "33", value: 33, unit: "%", cap: "zažilo deepfake útok nebo scam" },
] as const;

/* Slide 44 / 75 (distrust · d0): "Nedůvěra je nový default." — a social post under scrutiny. */
function ResortScene() {
  return (
    <svg className="dtp-scene" viewBox="0 0 490 414" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="dtpSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5aa9e6" />
          <stop offset="0.55" stopColor="#bfe3f5" />
          <stop offset="1" stopColor="#eaf6f8" />
        </linearGradient>
        <linearGradient id="dtpSea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2aa6c4" />
          <stop offset="1" stopColor="#5cc9d6" />
        </linearGradient>
        <linearGradient id="dtpPool" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3cc4d2" />
          <stop offset="0.5" stopColor="#1fa3b8" />
          <stop offset="1" stopColor="#0f7f96" />
        </linearGradient>
        <pattern id="dtpRipple" width="90" height="26" patternUnits="userSpaceOnUse">
          <path d="M0 13 C 15 8, 30 8, 45 13 S 75 18, 90 13" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="490" height="414" fill="url(#dtpSky)" />
      <path d="M0 70 C 60 60, 120 74, 170 64 S 260 58, 300 70" stroke="rgba(255,255,255,0.8)" strokeWidth="14" strokeLinecap="round" fill="none" opacity="0.5" />
      <rect y="176" width="490" height="34" fill="url(#dtpSea)" />
      <rect y="206" width="490" height="208" fill="url(#dtpPool)" />
      <rect y="206" width="490" height="208" fill="url(#dtpRipple)" />
      <ellipse cx="200" cy="300" rx="220" ry="60" fill="rgba(255,255,255,0.12)" />
      <path d="M0 206 H490" stroke="rgba(255,255,255,0.75)" strokeWidth="3" />
      {/* villa */}
      <g>
        <path d="M330 52 L490 30 V 240 H 330 Z" fill="#f2efe8" />
        <path d="M322 52 L490 26 V 38 L 322 62 Z" fill="#8a6a4c" />
        <rect x="346" y="78" width="54" height="60" fill="#5a7f92" opacity="0.85" />
        <rect x="414" y="70" width="60" height="68" fill="#4f7487" opacity="0.85" />
        <path d="M336 140 H490 V 148 H 336 Z" fill="#d8d2c6" />
        <g stroke="#ffffff" strokeWidth="2" opacity="0.9">
          <path d="M340 132 H490" />
          <path d="M350 132 V148 M372 132 V148 M394 132 V148 M416 132 V148 M438 132 V148 M460 132 V148 M482 132 V148" />
        </g>
        <rect x="346" y="160" width="128" height="62" fill="#3d6273" opacity="0.8" />
        <path d="M330 222 H490 V 240 H 330 Z" fill="#e6e0d4" />
        <g fill="#f7f5ef" stroke="#c9c1b2" strokeWidth="1.5">
          <path d="M392 246 h56 l10 -14 h-56 Z" />
          <path d="M430 262 h50 l10 -14 h-50 Z" />
        </g>
      </g>
      {/* palms */}
      <g fill="#1f4a2e">
        <path d="M120 210 C 122 160, 132 110, 150 70 L 156 72 C 140 112, 130 160, 128 210 Z" fill="#6b5640" />
        <path d="M152 70 C 120 50, 84 52, 56 70 C 90 60, 122 64, 152 74 Z" />
        <path d="M152 70 C 140 40, 112 20, 84 18 C 112 32, 134 50, 150 74 Z" />
        <path d="M152 70 C 172 38, 204 26, 232 30 C 204 40, 178 54, 156 76 Z" />
        <path d="M152 70 C 186 64, 220 76, 240 100 C 214 86, 184 80, 154 76 Z" />
        <path d="M150 72 C 126 80, 104 102, 98 128 C 112 104, 130 88, 154 78 Z" />
        <path d="M154 72 C 166 92, 170 118, 162 142 C 160 116, 156 96, 150 78 Z" />
      </g>
      <g fill="#24553a" transform="translate(150 -10) scale(0.82)">
        <path d="M150 260 C 152 190, 160 120, 176 74 L 182 76 C 168 122, 160 190, 158 260 Z" fill="#6b5640" />
        <path d="M178 74 C 146 54, 110 56, 82 74 C 116 64, 148 68, 178 78 Z" />
        <path d="M178 74 C 166 44, 138 24, 110 22 C 138 36, 160 54, 176 78 Z" />
        <path d="M178 74 C 198 42, 230 30, 258 34 C 230 44, 204 58, 182 80 Z" />
        <path d="M178 74 C 212 68, 246 80, 266 104 C 240 90, 210 84, 180 80 Z" />
        <path d="M176 76 C 152 84, 130 106, 124 132 C 138 108, 156 92, 180 82 Z" />
      </g>
      <path d="M-20 -10 C 30 40, 40 90, 20 150 C 10 100, -6 60, -20 30 Z" fill="#1d4a2c" opacity="0.92" />
      <path d="M-10 -14 C 60 10, 90 50, 96 96 C 70 60, 30 30, -10 16 Z" fill="#24573a" opacity="0.92" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function ChipIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 2.5v3M12 2.5v3M15 2.5v3M9 18.5v3M12 18.5v3M15 18.5v3M2.5 9h3M2.5 12h3M2.5 15h3M18.5 9h3M18.5 12h3M18.5 15h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <text x="12" y="14.6" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="currentColor" fontFamily="Montserrat, sans-serif">AI</text>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path d="M12 2.8 19.5 5.6v6c0 4.6-3.1 8.2-7.5 9.6-4.4-1.4-7.5-5-7.5-9.6v-6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="m8.6 12 2.4 2.4 4.4-4.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
      <path d="M12 2.5 22.5 20.5h-21Z" fill="#e5483b" stroke="#e5483b" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 9v5.6" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="17.6" r="1.4" fill="#fff" />
    </svg>
  );
}

function HeartOutline() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function DistrustDefault({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const scan = el.querySelector<HTMLElement>("[data-dtp-scan]");
      const frame = el.querySelector<HTMLElement>("[data-dtp-frame]");
      const ask = el.querySelector<HTMLElement>("[data-dtp-ask]");
      const chips = gsap.utils.toArray<HTMLElement>("[data-dtp-chip]", el);
      const warn = el.querySelector<HTMLElement>("[data-dtp-warn]");
      const ghosts = gsap.utils.toArray<HTMLElement>("[data-dtp-ghost]", el);
      const sub = el.querySelector<HTMLElement>("[data-dtp-sub]");
      if (reduced) return;
      // The scan sweeps the photo once, then rests on the question; nothing loops.
      gsap.set(scan, { top: "4%" });
      gsap.set(frame, { autoAlpha: 0, scale: 1.08 });
      gsap.set(ask, { autoAlpha: 0, y: 8 });
      gsap.set(chips, { autoAlpha: 0, x: 18 });
      gsap.set(warn, { autoAlpha: 0, x: -14, scale: 0.94 });
      gsap.set(ghosts, { autoAlpha: 0 });
      gsap.set(sub, { autoAlpha: 0, y: 12 });
      const tl = gsap.timeline();
      tl.to(ghosts, { autoAlpha: 1, duration: 0.6, stagger: 0.1, ease: EASE.enter }, 0.4);
      tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0.62);
      tl.to(scan, { top: "94%", duration: 1.0, ease: "sine.inOut" }, 0.9);
      tl.to(scan, { top: "50%", duration: 0.7, ease: EASE.move }, 1.9);
      tl.to(frame, { autoAlpha: 1, scale: 1, duration: 0.42, ease: EASE.enter }, 2.2);
      tl.to(ask, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 2.36);
      tl.to(chips, { autoAlpha: 1, x: 0, duration: 0.34, stagger: 0.14, ease: EASE.enter }, 2.5);
      tl.to(warn, { autoAlpha: 1, x: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, 3.0);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="scene is-distrust-post is-dtp">
      <Chrome page="44" caption="Výchozí nastavení" dark />
      <div className="dtp-copy">
        <div className="dtp-eyebrow">NOVÝ DEFAULT</div>
        <h2 data-hero-title className="dtp-title">Nedůvěra je<br />nový default.</h2>
        <p data-dtp-sub className="dtp-sub">Důvěra už není automatická.<br />Nejdřív ověřujeme.</p>
      </div>

      <div data-hero-visual className="dtp-stage" aria-hidden="true">
        <div data-dtp-ghost className="dtp-ghost is-left">
          <span className="dtp-ghost-head" />
          <img data-art src={asset("adapt-mesta.jpg")} alt="" />
          <span className="dtp-ghost-line" />
          <span className="dtp-ghost-line is-short" />
        </div>
        <div data-dtp-ghost className="dtp-ghost is-right">
          <span className="dtp-ghost-head" />
          <img data-art src={asset("adapt-plaze.jpg")} alt="" />
          <span className="dtp-ghost-line" />
          <span className="dtp-ghost-line is-short" />
        </div>

        <article className="dtp-post">
          <header>
            <span className="dtp-avatar">🌴</span>
            <div>
              <b>DreamStay Resort</b>
              <em>★★★★★</em>
            </div>
            <i>···</i>
          </header>
          <div className="dtp-photo">
            <ResortScene />
            <div data-dtp-frame className="dtp-frame">
              <span className="dtp-corner is-tl" />
              <span className="dtp-corner is-tr" />
              <span className="dtp-corner is-bl" />
              <span className="dtp-corner is-br" />
              <div data-dtp-ask className="dtp-ask">
                <strong>?</strong>
                <span>JE TO PRAVDA?</span>
              </div>
            </div>
            <div data-dtp-scan className="dtp-scan" />
          </div>
          <p>„Nejlepší dovolená v životě!“</p>
          <footer>
            <span className="dtp-lines"><i /><i /></span>
            <em><HeartOutline /> 12 tis.</em>
          </footer>
        </article>

        <div data-dtp-chip className="dtp-chip is-src"><i><SearchIcon /></i>Zdroj?</div>
        <div data-dtp-chip className="dtp-chip is-ai"><i><ChipIcon /></i>AI?</div>
        <div data-dtp-chip className="dtp-chip is-ok"><i><ShieldIcon /></i>Ověřeno?</div>
        <div data-dtp-warn className="dtp-warn"><WarnIcon />Může být falešné</div>
      </div>
    </div>
  );
}

export function Distrust({ step, reduced }: SceneProps) {
  if (step === 0) return <DistrustDefault reduced={reduced} />;
  return (
    <GlassStats
      step={step - 1}
      reduced={reduced}
      sceneClass="is-actors is-doubt"
      chrome={{
        kicker: "PROČ VĚŘIT / Pochybnost",
        page: "45 / 75",
        caption: "Pochybnost se stala zkušeností",
      }}
      title={DISTRUST_TITLE}
      stats={[DISTRUST_STATS[0], DISTRUST_STATS[1], DISTRUST_STATS[2]]}
    />
  );
}

export function Brand({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const frame = el.querySelector<HTMLElement>("[data-brand-frame]");
    const art = el.querySelector<HTMLElement>(".brand-shift-art");
    const photo = el.querySelector<HTMLElement>("[data-art]");
    const slib = el.querySelector<HTMLElement>("[data-brand-chip='slib']");
    const experience = el.querySelector<HTMLElement>("[data-brand-chip='zazitek']");
    const punchA = el.querySelector<HTMLElement>("[data-brand-a]");
    const punchB = el.querySelector<HTMLElement>("[data-brand-b]");
    if (!frame || !art || !photo) return;
    const origin = { transformOrigin: "0% 0%" as const };
    const fw = art.offsetWidth;
    const fh = art.offsetHeight;
    const iw = photo.offsetWidth;
    const ih = photo.offsetHeight;
    const fit = Math.min(fw / iw, fh / ih);
    const finalWidth = Math.round(iw * fit);
    const finalHeight = Math.round(ih * fit);
    const finalX = Math.round((fw - finalWidth) / 2);
    const finalY = Math.round((fh - finalHeight) / 2);
    const billboard = { x: 0, y: -fh * 0.08, scale: 1.28, ...origin };
    const living = { x: fw - iw * 1.18, y: -fh * 0.04, scale: 1.18, ...origin };
    const wide = { x: (fw - iw * fit) / 2, y: (fh - ih * fit) / 2, scale: fit, ...origin };
    const finalPhoto = {
      left: finalX,
      top: finalY,
      width: finalWidth,
      height: finalHeight,
      force3D: false,
      willChange: "auto",
      clearProps: "transform,transformOrigin",
    };
    const settle = () => {
      gsap.set(frame, { autoAlpha: 1, clearProps: "transform,transformOrigin" });
      gsap.set(photo, { ...finalPhoto });
      gsap.set([slib, experience], { autoAlpha: 0, y: 0 });
      gsap.set([punchA, punchB], { autoAlpha: 1, y: 0 });
    };
    if (reduced) {
      settle();
      return;
    }
    gsap.set(frame, { autoAlpha: 0, scale: 0.92, transformOrigin: "80% 50%" });
    gsap.set(photo, { ...billboard, willChange: "transform" });
    gsap.set([slib, experience, punchA, punchB], { autoAlpha: 0, y: 18 });
    const tl = gsap.timeline();
    tl.to(frame, { autoAlpha: 1, scale: 1, duration: 0.62, ease: "power3.out" }, 0);
    tl.set(frame, { clearProps: "transform,transformOrigin" }, 0.62);
    tl.to(slib, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0.28);
    tl.to(slib, { autoAlpha: 0, y: -12, duration: 0.32, ease: EASE.exit }, 2.05);
    tl.to(photo, { ...living, duration: 2.35, ease: "power1.inOut" }, 2.1);
    tl.to(experience, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 3.85);
    tl.to(experience, { autoAlpha: 0, y: -12, duration: 0.32, ease: EASE.exit }, 5.35);
    tl.to(photo, { ...wide, duration: 1.7, ease: EASE.move }, 5.4);
    tl.set(photo, finalPhoto, 7.1);
    tl.to(punchA, { autoAlpha: 1, y: 0, duration: 0.48, ease: EASE.enter }, 6.7);
    tl.to(punchB, { autoAlpha: 1, y: 0, duration: 0.48, ease: EASE.enter }, 7.25);
    return () => {
      tl.kill();
      settle();
    };
  }, [reduced]);

  return (
    <div ref={root} className="scene is-brand-shift">
      <SlideChrome
        kicker="PROČ VĚŘIT / ZNAČKA"
        page="46 / 75"
        caption="Od pozornosti k důvěře"
        captionDot
      />
      <div className="brand-shift-copy">
        <div data-brand-chip="slib" className="brand-shift-chip">Slib.</div>
        <div data-brand-chip="zazitek" className="brand-shift-chip">Zážitek.</div>
        <div className="brand-shift-punch">
          <div data-brand-a>Slib získává pozornost.</div>
          <div data-brand-b>Zkušenost buduje důvěru.</div>
        </div>
      </div>
      <div data-brand-frame className="brand-shift-frame">
        <div className="brand-shift-art">
          <img data-art src={asset("brand-shift.webp")} alt="" />
        </div>
      </div>
    </div>
  );
}

const CLAIM_QUOTE = "„Máme nejlepší zákaznickou péči.“";
const ASK_QUOTE = "„Proč bych vás měl doporučit?“";

function typeOn(
  tl: gsap.core.Timeline,
  typed: HTMLElement | null,
  caret: HTMLElement | null,
  text: string,
  at: number,
  duration: number,
) {
  const cursor = { n: 0 };
  if (typed) typed.textContent = "";
  if (caret) {
    tl.set(caret, { opacity: 1, autoAlpha: 1 }, at);
    caret.classList.add("is-scripted");
  }
  tl.to(cursor, {
    n: text.length,
    duration,
    ease: "none",
    onUpdate: () => {
      if (typed) typed.textContent = text.slice(0, Math.round(cursor.n));
    },
  }, at);
  if (caret) tl.set(caret, { opacity: 0, autoAlpha: 0 }, at + duration + 0.04);
}

const ASK_BOX = { left: 1340, top: 268, width: 500, height: 520, padding: 44 };
const HERO_BOX = { left: 940, top: 200, width: 900, height: 760, padding: 40 };
const ASK_EXIT = { left: -980, top: 200, width: 900, height: 760, padding: 40 };
const ROBOT_IDLE = { left: 648, width: 700, bottom: 48 };
const ROBOT_HERO = { left: 48, width: 760, bottom: 40 };
const ROBOT_EXIT = { left: -820, width: 760, bottom: 40 };
const REASON_PROOFS = [
  { id: "life", title: "Pobyty prodlužují život", sub: "brandový důvod, který jde ověřit", icon: "heart" },
  { id: "care", title: "Péče, která je poznat", sub: "stejný slib v každé stopě", icon: "headset" },
  { id: "reply", title: "Odpověď do 2 minut", sub: "v pracovní době", icon: "clock" },
  { id: "fix", title: "Řešení problému do 24 hodin", sub: "Garantovaný proces", icon: "wrench" },
] as const;

const FIND_PILLARS = [
  { id: "cons", title: "Konzistence", icon: "db" as const, labels: ["Web", "Wikipedia", "Recenze", "Katalogy"] },
  { id: "answer", title: "Odpověď-first obsah", icon: "page" as const, labels: ["FAQ", "Podmínky", "Nadpisy", "Ceny"] },
  { id: "trust", title: "Důvěryhodnost", icon: "people" as const, labels: ["PR", "Média", "Recenze", "Komunity"] },
];

function FindIcon({ name }: { name: (typeof FIND_PILLARS)[number]["icon"] }) {
  const props = {
    width: 36,
    height: 36,
    viewBox: "0 0 36 36",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "db") {
    return (
      <svg {...props}>
        <ellipse cx="18" cy="9" rx="11" ry="4.2" />
        <path d="M7 9v9c0 2.3 4.9 4.2 11 4.2s11-1.9 11-4.2V9" />
        <path d="M7 18v9c0 2.3 4.9 4.2 11 4.2s11-1.9 11-4.2v-9" />
      </svg>
    );
  }
  if (name === "page") {
    return (
      <svg {...props}>
        <path d="M11 6h10l6 6v16a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
        <path d="M21 6v6h6" />
        <path d="M14 18h8M14 23h6" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="13" cy="13" r="4" />
      <circle cx="24" cy="14" r="3.2" />
      <path d="M6 26.5c.8-4 3.6-6.2 7-6.2s6.2 2.2 7 6.2" />
      <path d="M20.5 24.5c.7-2.6 2.6-4.2 5-4.2 2.2 0 3.9 1.2 4.6 3.4" />
    </svg>
  );
}

function ReasonIcon({ name }: { name: (typeof REASON_PROOFS)[number]["icon"] | "doc" }) {
  const props = {
    width: 34,
    height: 34,
    viewBox: "0 0 36 36",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2.15,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "heart") {
    return (
      <svg {...props}>
        <path d="M18 29s-9.5-6.2-12.4-11.2C3.4 14.2 4.2 9.6 8 8c2.6-1.1 5.3.2 6.6 2.4C16 8.2 18.6 6.9 21.2 8c3.8 1.6 4.6 6.2 2.4 9.8C20.7 22.8 18 29 18 29Z" />
      </svg>
    );
  }
  if (name === "headset") {
    return (
      <svg {...props}>
        <path d="M7 20v-4a11 11 0 0 1 22 0v4" />
        <path d="M7 19h4v8H9a2 2 0 0 1-2-2v-6Z" />
        <path d="M29 19h-4v8h2a2 2 0 0 0 2-2v-6Z" />
        <path d="M25 27v1a5 5 0 0 1-5 5h-2" />
      </svg>
    );
  }
  if (name === "doc") {
    return (
      <svg {...props}>
        <path d="M11 6h10l6 6v16a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
        <path d="M21 6v6h6" />
        <path d="M14 18h8M14 23h8" />
      </svg>
    );
  }
  if (name === "clock") {
    return (
      <svg {...props}>
        <circle cx="18" cy="19" r="11" />
        <path d="M18 13v6l4 2" />
        <path d="M12 7h12" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M20 8.5 27.5 16l-3 3-7.5-7.5 3-3Z" />
      <path d="m15.5 13.5-7 7a3 3 0 0 0 0 4.2l3.8 3.8a3 3 0 0 0 4.2 0l7-7" />
      <path d="m18 21 5 5" />
    </svg>
  );
}

function ProveReason({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const beat = Math.max(1, Math.min(step, 15));
  const chrome = beat >= 11
    ? { page: "50", caption: "Najít a ověřit" }
    : beat >= 9
      ? { page: "49", caption: "Konkrétní · dohledatelné · ověřitelné" }
      : beat >= 8
        ? { page: "48", caption: "Důvod k doporučení" }
        : { page: "47", caption: "Slib nestačí" };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-reason-title]");
    const claim = el.querySelector<HTMLElement>("[data-reason-claim]");
    const robot = el.querySelector<HTMLElement>("[data-reason-robot]");
    const ask = el.querySelector<HTMLElement>("[data-reason-ask]");
    const fill = el.querySelector<HTMLElement>("[data-reason-fill]");
    const copy = el.querySelector<HTMLElement>("[data-reason-copy]");
    const prove = el.querySelector<HTMLElement>("[data-reason-prove]");
    const proofsWrap = el.querySelector<HTMLElement>("[data-reason-proofs]");
    const chips = gsap.utils.toArray<HTMLElement>("[data-proof]", el);
    const claimTyped = el.querySelector<HTMLElement>("[data-reason-claim-typed]");
    const claimCaret = el.querySelector<HTMLElement>("[data-reason-claim-caret]");
    const claimTag = el.querySelector<HTMLElement>("[data-reason-claim-tag]");
    const askLabel = el.querySelector<HTMLElement>("[data-reason-ask-label]");
    const askTyped = el.querySelector<HTMLElement>("[data-reason-ask-typed]");
    const askCaret = el.querySelector<HTMLElement>("[data-reason-ask-caret]");
    const askTag = el.querySelector<HTMLElement>("[data-reason-ask-tag]");
    const titleOld = el.querySelector<HTMLElement>("[data-title-old]");
    const titleNew = el.querySelector<HTMLElement>("[data-title-new]");
    const findCards = gsap.utils.toArray<HTMLElement>("[data-find-card]", el);
    const findLabels = gsap.utils.toArray<HTMLElement>("[data-find-label]", el);
    const findRoutes = gsap.utils.toArray<SVGPathElement>("[data-find-route]", el);
    const findCheck = el.querySelector<HTMLElement>("[data-find-check]");
    const findExit = el.querySelector<SVGPathElement>("[data-find-exit]");
    const findResult = el.querySelector<HTMLElement>("[data-find-result]");
    if (!ask || !fill || !copy || !prove || !robot) return;

    const pinAsk = (box: typeof ASK_BOX) => {
      gsap.set(ask, { ...box, right: "auto", x: 0, y: 0, zIndex: 5 });
    };
    const pinRobot = (box: typeof ROBOT_IDLE) => {
      gsap.set(robot, { ...box, x: 0, y: 0 });
    };
    const connectRoutes = () => {
      if (!findCheck) return;
      const local = (node: HTMLElement) => {
        const rootBox = el.getBoundingClientRect();
        const box = node.getBoundingClientRect();
        const k = 1920 / rootBox.width;
        return {
          left: (box.left - rootBox.left) * k,
          right: (box.right - rootBox.left) * k,
          midY: (box.top + box.height / 2 - rootBox.top) * k,
        };
      };
      const check = local(findCheck);
      const joinX = check.left + 12;
      const joinY = check.midY;
      findCards.forEach((card, index) => {
        const path = el.querySelector<SVGPathElement>(`[data-find-route="${index}"]`);
        if (!path) return;
        const cardBox = local(card);
        const x0 = cardBox.right - 1;
        const y0 = cardBox.midY;
        if (index === 1) {
          path.setAttribute("d", `M${x0} ${y0} H${joinX}`);
        } else {
          const midX = x0 + Math.max(110, (joinX - x0) * 0.46);
          path.setAttribute("d", `M${x0} ${y0} C${midX} ${y0} ${midX} ${joinY} ${joinX} ${joinY}`);
        }
      });
      if (findExit && findResult) {
        const result = local(findResult);
        findExit.setAttribute("d", `M${check.right - 8} ${joinY} H${result.left}`);
      }
    };
    const pinRoutes = (drawn: boolean, exitDrawn = drawn) => {
      connectRoutes();
      findRoutes.forEach((node) => {
        const len = node.getTotalLength();
        gsap.set(node, { strokeDasharray: len, strokeDashoffset: drawn ? 0 : len, opacity: 1 });
      });
      if (findExit) {
        const len = findExit.getTotalLength();
        gsap.set(findExit, { strokeDasharray: len, strokeDashoffset: exitDrawn ? 0 : len, opacity: 1 });
      }
    };
    const apply = (to: number) => {
      const isHero = to >= 8 && to <= 10;
      const offstage = to >= 11;
      pinAsk(offstage ? ASK_EXIT : isHero || to >= 8 ? HERO_BOX : ASK_BOX);
      pinRobot(offstage ? ROBOT_EXIT : to >= 8 ? ROBOT_HERO : ROBOT_IDLE);
      gsap.set(title, { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(titleOld, { autoAlpha: to < 10 ? 1 : 0, y: 0 });
      gsap.set(titleNew, { autoAlpha: to >= 10 ? 1 : 0, y: 0 });
      gsap.set(claim, { autoAlpha: to >= 1 && to <= 7 ? 1 : 0, x: 0, y: 0 });
      gsap.set(claimTag, { autoAlpha: to >= 3 && to <= 7 ? 1 : 0, y: 0 });
      gsap.set(robot, { autoAlpha: to >= 4 && to <= 10 ? 1 : 0, x: 0, y: 0 });
      gsap.set(ask, { autoAlpha: to >= 4 && to <= 10 ? 1 : 0, x: 0, y: 0 });
      gsap.set(fill, { opacity: isHero ? 1 : 0 });
      gsap.set(copy, { autoAlpha: 1, y: 0, paddingTop: isHero ? 86 : 0 });
      gsap.set(askLabel, { autoAlpha: to >= 5 && to <= 7 ? 1 : 0 });
      gsap.set(askTag, { autoAlpha: to === 7 ? 1 : 0, y: 0 });
      gsap.set(prove, { autoAlpha: isHero ? 1 : 0, scale: 1 });
      gsap.set(proofsWrap, { autoAlpha: to >= 9 && to <= 10 ? 1 : 0 });
      gsap.set(chips, { autoAlpha: to >= 9 && to <= 10 ? 1 : 0, y: 0 });
      gsap.set(findCards, { autoAlpha: to >= 12 ? 1 : 0, y: 0 });
      gsap.set(findLabels, { autoAlpha: to >= 13 ? 1 : 0, y: 0 });
      pinRoutes(to >= 14, to >= 15);
      gsap.set(findCheck, { autoAlpha: to >= 14 ? 1 : 0, scale: 1 });
      gsap.set(findResult, { autoAlpha: to >= 15 ? 1 : 0, y: 0 });
      if (claimTyped) claimTyped.textContent = to >= 2 ? CLAIM_QUOTE : "";
      if (askTyped) askTyped.textContent = to >= 6 ? ASK_QUOTE : "";
      gsap.set([claimCaret, askCaret], { opacity: 0, autoAlpha: 0 });
    };

    const from = prev.current;
    prev.current = beat;

    if (reduced) {
      apply(beat);
      return;
    }

    if (from === beat) {
      apply(beat);
      return;
    }

    if (from === null) {
      if (beat !== 1) {
        apply(beat);
        return;
      }
      pinAsk(ASK_BOX);
      pinRobot(ROBOT_IDLE);
      gsap.set(title, { autoAlpha: 0, y: 18, x: 0 });
      gsap.set(claim, { autoAlpha: 0, x: 0, y: 10 });
      gsap.set(robot, { autoAlpha: 0, y: 24, x: 0 });
      gsap.set(ask, { autoAlpha: 0, x: 0, y: 0 });
      gsap.set(fill, { opacity: 0 });
      gsap.set(copy, { autoAlpha: 1, y: 0, paddingTop: 0 });
      gsap.set(prove, { autoAlpha: 0, scale: 0.92 });
      gsap.set(proofsWrap, { autoAlpha: 0 });
      gsap.set(chips, { autoAlpha: 0, y: 16 });
      gsap.set([claimTag, askTag, askLabel], { autoAlpha: 0, y: 10 });
      gsap.set([claimCaret, askCaret], { opacity: 0, autoAlpha: 0 });
      gsap.set(titleOld, { autoAlpha: 1, y: 0 });
      gsap.set(titleNew, { autoAlpha: 0, y: 10 });
      gsap.set(findCards, { autoAlpha: 0, y: 22 });
      gsap.set(findLabels, { autoAlpha: 0, y: 8 });
      gsap.set(findCheck, { autoAlpha: 0, scale: 0.9 });
      gsap.set(findResult, { autoAlpha: 0, y: 16 });
      pinRoutes(false);
      if (claimTyped) claimTyped.textContent = "";
      if (askTyped) askTyped.textContent = "";
      const intro = gsap.timeline();
      intro.to(title, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0);
      intro.to(claim, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.28);
      return () => {
        intro.kill();
      };
    }

    const tl = gsap.timeline();
    if (Math.abs(beat - from) !== 1) {
      apply(beat);
      return () => {
        tl.kill();
      };
    }

    apply(from);

    if (from === 1 && beat === 2) {
      typeOn(tl, claimTyped, claimCaret, CLAIM_QUOTE, 0, 1.35);
    } else if (from === 2 && beat === 1) {
      gsap.set(claimCaret, { opacity: 0, autoAlpha: 0 });
      if (claimTyped) claimTyped.textContent = "";
    } else if (from === 2 && beat === 3) {
      if (claimTyped) claimTyped.textContent = CLAIM_QUOTE;
      gsap.set(claimCaret, { opacity: 0, autoAlpha: 0 });
      tl.to(claimTag, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0);
    } else if (from === 3 && beat === 2) {
      tl.to(claimTag, { autoAlpha: 0, y: 10, duration: 0.24, ease: EASE.exit }, 0);
    } else if (from === 3 && beat === 4) {
      pinRobot(ROBOT_IDLE);
      gsap.set(robot, { autoAlpha: 0, y: 24, x: 0 });
      tl.to(robot, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power3.out" }, 0);
    } else if (from === 4 && beat === 3) {
      tl.to(robot, { autoAlpha: 0, y: 16, duration: 0.28, ease: EASE.exit }, 0);
    } else if (from === 4 && beat === 5) {
      pinAsk(ASK_BOX);
      gsap.set(ask, { autoAlpha: 0, y: 10, x: 0 });
      gsap.set(askLabel, { autoAlpha: 1 });
      gsap.set(askTag, { autoAlpha: 0, y: 10 });
      if (askTyped) askTyped.textContent = "";
      tl.to(ask, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0);
    } else if (from === 5 && beat === 4) {
      tl.to(ask, { autoAlpha: 0, y: 10, duration: 0.28, ease: EASE.exit }, 0);
      if (askTyped) tl.add(() => { askTyped.textContent = ""; });
    } else if (from === 5 && beat === 6) {
      typeOn(tl, askTyped, askCaret, ASK_QUOTE, 0, 1.28);
    } else if (from === 6 && beat === 5) {
      gsap.set(askCaret, { opacity: 0, autoAlpha: 0 });
      if (askTyped) askTyped.textContent = "";
    } else if (from === 6 && beat === 7) {
      if (askTyped) askTyped.textContent = ASK_QUOTE;
      gsap.set(askCaret, { opacity: 0, autoAlpha: 0 });
      tl.to(askTag, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0);
    } else if (from === 7 && beat === 6) {
      tl.to(askTag, { autoAlpha: 0, y: 10, duration: 0.24, ease: EASE.exit }, 0);
    } else if (from === 7 && beat === 8) {
      pinAsk(ASK_BOX);
      pinRobot(ROBOT_IDLE);
      gsap.set(ask, { autoAlpha: 1 });
      gsap.set(robot, { autoAlpha: 1 });
      tl.to(ask, { ...HERO_BOX, duration: 0.84, ease: "power2.inOut" }, 0);
      tl.to(robot, { ...ROBOT_HERO, duration: 0.84, ease: "power2.inOut" }, 0);
      tl.to(fill, { opacity: 1, duration: 0.5, ease: EASE.move }, 0.08);
      tl.to(claim, { autoAlpha: 0, x: -28, duration: 0.36, ease: EASE.exit }, 0);
      tl.to(askLabel, { autoAlpha: 0, duration: 0.24, ease: EASE.exit }, 0.12);
      tl.to(askTag, { autoAlpha: 0, y: -8, duration: 0.24, ease: EASE.exit }, 0.12);
      tl.to(copy, { paddingTop: 86, duration: 0.5, ease: EASE.move }, 0.16);
      tl.fromTo(prove, { autoAlpha: 0, scale: 0.92 }, {
        autoAlpha: 1, scale: 1, duration: 0.46, ease: EASE.enter, transformOrigin: "0% 50%",
      }, 0.38);
    } else if (from === 8 && beat === 7) {
      tl.to(prove, { autoAlpha: 0, scale: 0.94, duration: 0.24, ease: EASE.exit }, 0);
      tl.to(chips, { autoAlpha: 0, y: 12, duration: 0.2, ease: EASE.exit }, 0);
      tl.to(proofsWrap, { autoAlpha: 0, duration: 0.2, ease: EASE.exit }, 0);
      tl.to(fill, { opacity: 0, duration: 0.4, ease: EASE.move }, 0.08);
      tl.to(ask, { ...ASK_BOX, duration: 0.72, ease: "power2.inOut" }, 0.04);
      tl.to(robot, { ...ROBOT_IDLE, duration: 0.72, ease: "power2.inOut" }, 0.04);
      tl.to(copy, { paddingTop: 0, duration: 0.4, ease: EASE.move }, 0.12);
      tl.to([askLabel, askTag], { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE.enter }, 0.36);
      tl.to(claim, { autoAlpha: 1, x: 0, y: 0, duration: 0.4, ease: EASE.enter }, 0.32);
    } else if (from === 8 && beat === 9) {
      tl.to(proofsWrap, { autoAlpha: 1, duration: 0.2 }, 0);
      tl.to(chips, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08, ease: EASE.enter }, 0.06);
    } else if (from === 9 && beat === 8) {
      tl.to(chips, { autoAlpha: 0, y: 16, duration: 0.24, ease: EASE.exit }, 0);
      tl.to(proofsWrap, { autoAlpha: 0, duration: 0.2, ease: EASE.exit }, 0);
    } else if (from === 9 && beat === 10) {
      tl.to(titleOld, { autoAlpha: 0, y: -12, duration: 0.32, ease: EASE.exit }, 0);
      tl.fromTo(titleNew, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.44, ease: EASE.enter }, 0.16);
    } else if (from === 10 && beat === 9) {
      tl.to(titleNew, { autoAlpha: 0, y: 10, duration: 0.24, ease: EASE.exit }, 0);
      tl.fromTo(titleOld, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.12);
    } else if (from === 10 && beat === 11) {
      pinAsk(HERO_BOX);
      pinRobot(ROBOT_HERO);
      gsap.set([ask, robot], { autoAlpha: 1 });
      tl.to(ask, { ...ASK_EXIT, duration: 0.82, ease: "power2.in" }, 0);
      tl.to(robot, { ...ROBOT_EXIT, duration: 0.82, ease: "power2.in" }, 0.06);
      tl.to([ask, robot], { autoAlpha: 0, duration: 0.18, ease: EASE.exit }, 0.68);
    } else if (from === 11 && beat === 10) {
      gsap.set(ask, { ...ASK_EXIT, autoAlpha: 1 });
      gsap.set(robot, { ...ROBOT_EXIT, autoAlpha: 1 });
      gsap.set(fill, { opacity: 1 });
      gsap.set(prove, { autoAlpha: 1, scale: 1 });
      gsap.set(copy, { paddingTop: 86 });
      gsap.set([proofsWrap, chips], { autoAlpha: 1, y: 0 });
      tl.to(ask, { ...HERO_BOX, duration: 0.72, ease: "power2.out" }, 0);
      tl.to(robot, { ...ROBOT_HERO, duration: 0.72, ease: "power2.out" }, 0);
    } else if (from === 11 && beat === 12) {
      gsap.set(findCards, { autoAlpha: 0, y: 22 });
      tl.to(findCards, { autoAlpha: 1, y: 0, duration: 0.46, stagger: 0.12, ease: EASE.enter }, 0);
    } else if (from === 12 && beat === 11) {
      tl.to(findCards, { autoAlpha: 0, y: 16, duration: 0.24, ease: EASE.exit }, 0);
    } else if (from === 12 && beat === 13) {
      gsap.set(findLabels, { autoAlpha: 0, y: 8 });
      tl.to(findLabels, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.04, ease: EASE.enter }, 0);
    } else if (from === 13 && beat === 12) {
      tl.to(findLabels, { autoAlpha: 0, y: 8, duration: 0.2, ease: EASE.exit }, 0);
    } else if (from === 13 && beat === 14) {
      pinRoutes(false);
      gsap.set(findCheck, { autoAlpha: 0, scale: 0.88 });
      tl.to(findRoutes, { strokeDashoffset: 0, duration: 0.72, stagger: 0.1, ease: EASE.move }, 0);
      tl.to(findCheck, { autoAlpha: 1, scale: 1, duration: 0.42, ease: EASE.enter }, 0.48);
    } else if (from === 14 && beat === 13) {
      tl.to(findCheck, { autoAlpha: 0, scale: 0.92, duration: 0.22, ease: EASE.exit }, 0);
      findRoutes.forEach((node) => {
        tl.to(node, { strokeDashoffset: node.getTotalLength(), duration: 0.28, ease: EASE.exit }, 0);
      });
    } else if (from === 14 && beat === 15) {
      if (findExit) {
        const len = findExit.getTotalLength();
        gsap.set(findExit, { strokeDasharray: len, strokeDashoffset: len });
      }
      gsap.set(findResult, { autoAlpha: 0, y: 18 });
      if (findExit) tl.to(findExit, { strokeDashoffset: 0, duration: 0.4, ease: EASE.move }, 0);
      tl.to(findResult, { autoAlpha: 1, y: 0, duration: 0.46, ease: EASE.enter }, 0.16);
    } else if (from === 15 && beat === 14) {
      tl.to(findResult, { autoAlpha: 0, y: 12, duration: 0.24, ease: EASE.exit }, 0);
      if (findExit) tl.to(findExit, { strokeDashoffset: findExit.getTotalLength(), duration: 0.24, ease: EASE.exit }, 0);
    } else {
      apply(beat);
    }

    return () => {
      tl.kill();
    };
  }, [beat, reduced]);

  const hero = beat >= 8 && beat <= 11;
  const proofs = beat >= 9 && beat <= 11;
  return (
    <div ref={root} className={`scene is-prove-reason${hero ? " is-hero" : ""}${proofs ? " is-proofs" : ""}${beat >= 10 ? " is-swap" : ""}${beat >= 11 ? " is-find" : ""}${beat >= 14 ? " is-find-check" : ""}${beat >= 15 ? " is-find-result" : ""}`}>
      <SlideChrome
        kicker="PROČ VĚŘIT / DŮVOD"
        page={`${chrome.page} / 75`}
        caption={chrome.caption}
        captionDot
      />
      <h2 data-reason-title className="prove-reason-title">
        <span data-title-keep>AI musí </span>
        <span className="prove-reason-swap">
          <span data-title-old>mít důvod vás doporučit</span>
          <span data-title-new>
            vaše důvody <em data-title-mark className="prove-reason-mark">najít a ověřit</em>
          </span>
        </span>
      </h2>
      <div data-reason-claim className="prove-reason-card is-claim">
        <div className="label">Značka říká</div>
        <p className="prove-reason-quote">
          <span data-reason-claim-typed />
          <span data-reason-claim-caret className="caret is-scripted" aria-hidden="true" />
        </p>
        <div data-reason-claim-tag className="prove-reason-tag">Neověřitelné.</div>
      </div>
      <img
        data-reason-robot
        data-motion-role="reason-robot"
        className="prove-reason-robot"
        src={asset("ai-reason-robot.webp")}
        alt=""
      />
      <div data-reason-ask className="prove-reason-card is-ask">
        <div data-reason-fill className="prove-reason-fill" />
        <div data-reason-copy className="prove-reason-copy">
          <div data-reason-prove className="prove-reason-prove">PROVE IT.</div>
          <div data-reason-ask-label className="label">AI se ptá</div>
          <p className="prove-reason-quote">
            <span data-reason-ask-typed />
            <span data-reason-ask-caret className="caret is-scripted" aria-hidden="true" />
          </p>
          <div data-reason-ask-tag className="prove-reason-tag is-ask">Potřebuje důkaz.</div>
          <div data-reason-proofs className="prove-reason-proofs">
            {REASON_PROOFS.map((proof, index) => (
              <div key={proof.id} data-proof={index} className="prove-reason-chip">
                <div className="prove-reason-chip-icon">
                  <ReasonIcon name={proof.icon} />
                </div>
                <div>
                  <div className="prove-reason-chip-title">{proof.title}</div>
                  <div className="prove-reason-chip-s">{proof.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="prove-find-cards">
        {FIND_PILLARS.map((pillar) => (
          <div key={pillar.id} data-find-card className="prove-find-card">
            <div className="prove-find-card-icon">
              <FindIcon name={pillar.icon} />
            </div>
            <div className="prove-find-card-title">{pillar.title}</div>
            <div className="prove-find-labels">
              {pillar.labels.map((label) => (
                <span key={label} data-find-label className="prove-find-label">{label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <svg className="prove-find-svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <path data-find-route="0" d="M620 341H990" fill="none" stroke="currentColor" strokeWidth="4" />
        <path data-find-route="1" d="M620 545H990" fill="none" stroke="currentColor" strokeWidth="4" />
        <path data-find-route="2" d="M620 749H990" fill="none" stroke="currentColor" strokeWidth="4" />
        <path data-find-exit d="M1188 544H1216" fill="none" stroke="currentColor" strokeWidth="4" />
      </svg>
      <div data-find-check className="prove-find-check">
        <svg viewBox="0 0 208 208" aria-hidden="true">
          <circle cx="104" cy="104" r="104" fill="var(--text-deep)" />
          <circle cx="104" cy="104" r="68" fill="none" stroke="var(--lime)" strokeWidth="4" />
          <path d="m78 104 22 22 44-50" fill="none" stroke="var(--lime)" strokeWidth="12" />
        </svg>
      </div>
      <div data-find-result className="prove-find-result">
        <div className="label">AI najde</div>
        <div className="prove-find-result-title">důvod vás doporučit</div>
      </div>
    </div>
  );
}

export function Prove({ step, reduced, sceneId }: SceneProps) {
  if (step === 0) {
    return <Brand step={0} reduced={reduced} sceneId={sceneId} />;
  }
  return <ProveReason step={step} reduced={reduced} sceneId={sceneId} />;
}

export function Findability({ step, reduced }: SceneProps) {
  const items = ["KONZISTENCE", "ANSWER-FIRST", "DŮVĚRYHODNOST"];
  return (
    <div className="scene">
      <Chrome page={step === 0 ? "49" : "50"} caption={step === 0 ? "AI musí důvod najít" : "Značka v odpovědi i zkušenosti"} />
      <div className="safe" style={{ display: "grid", placeItems: "center" }}>
        <div style={{ position: "absolute", left: 0, display: "grid", gap: 26 }}>
          {items.map((item, index) => (
            <div key={item} style={{ width: 430, padding: "24px 30px", background: index === 1 ? "var(--lime)" : "var(--paper)", border: "2px solid var(--line)", fontSize: 25, fontWeight: 800, letterSpacing: ".06em" }}>{item}</div>
          ))}
        </div>
        <svg width="520" height="620" viewBox="0 0 520 620" aria-hidden="true" style={{ marginLeft: 160 }}>
          <path d="M0 110h110c90 0 80 200 174 200M0 310h284M0 510h110c90 0 80-200 174-200" fill="none" stroke="var(--text-deep)" strokeWidth="4" />
          <circle cx="300" cy="310" r="112" fill="var(--text-deep)" />
          <circle cx="300" cy="310" r="72" fill="none" stroke="var(--lime)" strokeWidth="4" strokeDasharray={step === 0 ? "12 12" : "0"} style={{ transition: MOTION(reduced) }} />
          <path d="m272 310 20 20 42-48" fill="none" stroke="var(--lime)" strokeWidth="12" />
          <path d="M412 310h108" stroke="var(--text-deep)" strokeWidth="4" />
        </svg>
        <div style={{ position: "absolute", right: 0, width: 470, minHeight: 270, padding: "42px 46px", background: step === 0 ? "var(--paper)" : "var(--text-deep)", color: step === 0 ? "var(--text-deep)" : "var(--paper)", border: "2px solid var(--line)" }}>
          <div className="label" style={{ color: step === 0 ? "var(--muted)" : "var(--lime)", marginBottom: 22 }}>{step === 0 ? "AI najde" : "AI reprezentuje"}</div>
          <div style={{ fontSize: 47, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-.04em" }}>
            {step === 0 ? "DŮVOD DOPORUČIT" : "ZNAČKU SPRÁVNĚ"}
          </div>
          {step === 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 34 }}>
              <span style={{ width: 34, height: 3, background: "var(--signal)" }} />
              <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: ".1em" }}>NE TRIK NA ALGORITMUS</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BrandExp({ step, reduced }: SceneProps) {
  return (
    <div className="scene">
      <div className="safe" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="label">{step === 0 ? "Fintech" : "Média"}</div>
        <HeroText size={96} reduced={reduced}>
          {step === 0 ? "Cleo" : "New York Times"}
        </HeroText>
        <div className="thought" style={{ marginTop: 28, maxWidth: "30ch" }}>
          {step === 0
            ? "Tone of voice jako diferenciátor. Komici a content designéři učí model osobnost, humor a hranice."
            : "Videa jako AI-resistant obsah. Tvář reportéra polidšťuje obsah a buduje důvěru."}
        </div>
      </div>
    </div>
  );
}

const XP_BLOCKS = [
  { id: "produkt", title: "Produkt", sub: "Je naše značka v tom, co nabízíme.", icon: "box" },
  { id: "people", title: "Chování lidí", sub: "Je naše značka v tom, jak se chováme.", icon: "people" },
  { id: "soul", title: "AI Soul & Identity", sub: "Je naše značka v tom, jak AI jedná.", icon: "spark" },
  { id: "digital", title: "Digitální design", sub: "Je naše značka v tom, jak vypadá rozhraní.", icon: "layout" },
] as const;

function XpIcon({ name }: { name: (typeof XP_BLOCKS)[number]["icon"] }) {
  const props = {
    width: 30,
    height: 30,
    viewBox: "0 0 36 36",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2.15,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "box") {
    return (
      <svg {...props}>
        <path d="M6 11.5 18 6l12 5.5v13L18 30 6 24.5v-13Z" />
        <path d="M18 6v13.5M6 11.5 18 17l12-5.5" />
      </svg>
    );
  }
  if (name === "people") {
    return (
      <svg {...props}>
        <circle cx="13" cy="13" r="4" />
        <circle cx="24" cy="14" r="3.2" />
        <path d="M6 26.5c.8-4 3.6-6.2 7-6.2s6.2 2.2 7 6.2" />
        <path d="M20.5 24.5c.7-2.6 2.6-4.2 5-4.2 2.2 0 3.9 1.2 4.6 3.4" />
      </svg>
    );
  }
  if (name === "spark") {
    return (
      <svg {...props}>
        <circle cx="18" cy="18" r="7.5" />
        <path d="M18 5.5v4.2M18 26.3v4.2M5.5 18h4.2M26.3 18h4.2" />
        <path d="m10.4 10.4 2.9 2.9M22.7 22.7l2.9 2.9M25.6 10.4l-2.9 2.9M13.3 22.7l-2.9 2.9" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <rect x="6" y="8" width="24" height="20" rx="3" />
      <path d="M6 14h24" />
      <path d="M12 20h8M12 24h5" />
    </svg>
  );
}

function PrinciplesSystem({ step, reduced }: Pick<SceneProps, "step" | "reduced">) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const beat = Math.max(0, Math.min(step, 5));

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-xp-title]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-xp-card]", el);
    const hub = el.querySelector<HTMLElement>("[data-xp-hub]");
    const routes = gsap.utils.toArray<SVGPathElement>("[data-xp-route]", el);
    const dots = gsap.utils.toArray<SVGCircleElement>("[data-xp-dot]", el);
    const ring = el.querySelector<SVGCircleElement>("[data-xp-ring]");
    if (!title || !hub) return;

    const local = (node: HTMLElement) => {
      const rootBox = el.getBoundingClientRect();
      const box = node.getBoundingClientRect();
      const k = 1920 / rootBox.width;
      return {
        left: (box.left - rootBox.left) * k,
        right: (box.right - rootBox.left) * k,
        midX: (box.left + box.width / 2 - rootBox.left) * k,
        midY: (box.top + box.height / 2 - rootBox.top) * k,
        top: (box.top - rootBox.top) * k,
        bottom: (box.bottom - rootBox.top) * k,
      };
    };
    const connect = () => {
      const hubBox = local(hub);
      cards.forEach((card, index) => {
        const path = el.querySelector<SVGPathElement>(`[data-xp-route="${index}"]`);
        const dot = el.querySelector<SVGCircleElement>(`[data-xp-dot="${index}"]`);
        if (!path) return;
        const cardBox = local(card);
        const fromLeft = index === 0 || index === 1;
        const x0 = fromLeft ? hubBox.left + 10 : hubBox.right - 10;
        const y0 = hubBox.midY;
        const x1 = fromLeft ? cardBox.right + 2 : cardBox.left - 2;
        const y1 = cardBox.midY;
        const midX = x0 + (x1 - x0) * 0.42;
        path.setAttribute("d", `M${x0} ${y0} C${midX} ${y0} ${midX} ${y1} ${x1} ${y1}`);
        if (dot) {
          dot.setAttribute("cx", String(x1));
          dot.setAttribute("cy", String(y1));
        }
      });
    };
    const pinRoutes = (drawn: boolean) => {
      connect();
      routes.forEach((node) => {
        const len = node.getTotalLength();
        gsap.set(node, { strokeDasharray: len, strokeDashoffset: drawn ? 0 : len });
      });
      gsap.set(dots, { autoAlpha: drawn ? 1 : 0, scale: drawn ? 1 : 0.4, transformOrigin: "50% 50%" });
      if (ring) {
        const len = 2 * Math.PI * Number(ring.getAttribute("r") || 132);
        gsap.set(ring, { strokeDasharray: len, strokeDashoffset: drawn ? 0 : len });
      }
    };
    const apply = (to: number) => {
      gsap.set(title, { autoAlpha: 1, y: 0 });
      cards.forEach((card, index) => {
        gsap.set(card, { autoAlpha: to >= index + 1 ? 1 : 0, y: 0 });
      });
      gsap.set(hub, { autoAlpha: to >= 5 ? 1 : 0, scale: 1, transformOrigin: "50% 50%" });
      pinRoutes(to >= 5);
    };

    const from = prev.current;
    prev.current = beat;

    if (reduced) {
      apply(beat);
      return;
    }
    if (from === beat) {
      apply(beat);
      return;
    }
    if (from === null) {
      if (beat !== 0) {
        apply(beat);
        return;
      }
      gsap.set(title, { autoAlpha: 0, y: 16 });
      gsap.set(cards, { autoAlpha: 0, y: 22 });
      gsap.set(hub, { autoAlpha: 0, scale: 0.72, transformOrigin: "50% 50%" });
      pinRoutes(false);
      const intro = gsap.timeline();
      intro.to(title, { autoAlpha: 1, y: 0, duration: 0.46, ease: EASE.enter }, 0);
      return () => {
        intro.kill();
      };
    }

    const tl = gsap.timeline();
    if (Math.abs(beat - from) !== 1) {
      apply(beat);
      return () => {
        tl.kill();
      };
    }
    apply(from);

    if (from < 5 && beat < 5 && beat === from + 1) {
      const card = cards[beat - 1];
      if (card) {
        gsap.set(card, { autoAlpha: 0, y: 22 });
        tl.to(card, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0);
      }
    } else if (from < 5 && beat === from - 1) {
      const card = cards[from - 1];
      if (card) tl.to(card, { autoAlpha: 0, y: 14, duration: 0.24, ease: EASE.exit }, 0);
    } else if (from === 4 && beat === 5) {
      pinRoutes(false);
      gsap.set(hub, { autoAlpha: 0, scale: 0.72, transformOrigin: "50% 50%" });
      tl.to(hub, { autoAlpha: 1, scale: 1, duration: 0.52, ease: "power3.out" }, 0);
      if (ring) tl.to(ring, { strokeDashoffset: 0, duration: 0.68, ease: EASE.move }, 0.08);
      tl.to(routes, { strokeDashoffset: 0, duration: 0.72, stagger: 0.09, ease: EASE.move }, 0.22);
      tl.to(dots, { autoAlpha: 1, scale: 1, duration: 0.28, stagger: 0.09, ease: EASE.enter }, 0.62);
    } else if (from === 5 && beat === 4) {
      tl.to(dots, { autoAlpha: 0, scale: 0.4, duration: 0.18, ease: EASE.exit }, 0);
      routes.forEach((node) => {
        tl.to(node, { strokeDashoffset: node.getTotalLength(), duration: 0.28, ease: EASE.exit }, 0);
      });
      if (ring) tl.to(ring, { strokeDashoffset: 2 * Math.PI * 132, duration: 0.24, ease: EASE.exit }, 0);
      tl.to(hub, { autoAlpha: 0, scale: 0.86, duration: 0.28, ease: EASE.exit }, 0.06);
    } else {
      apply(beat);
    }

    return () => {
      tl.kill();
    };
  }, [beat, reduced]);

  return (
    <div ref={root} className={`scene is-xp${beat >= 5 ? " is-linked" : ""}`}>
      <SlideChrome
        kicker="PROČ VĚŘIT / PRINCIPY"
        page="51 / 75"
        caption="Značka v celém systému"
        captionDot
      />
      <h2 data-xp-title className="xp-title">
        Dodat značku do zážitku vám pomohou{" "}
        <em className="xp-mark">Experience principy</em>
      </h2>
      <svg className="xp-svg" viewBox="0 0 1920 1080" aria-hidden="true">
        {XP_BLOCKS.map((block, index) => (
          <path
            key={block.id}
            data-xp-route={index}
            d="M960 540H960"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        ))}
        {XP_BLOCKS.map((block, index) => (
          <circle key={`${block.id}-dot`} data-xp-dot={index} cx="960" cy="540" r="8" fill="var(--lime)" />
        ))}
      </svg>
      {XP_BLOCKS.map((block) => (
        <div key={block.id} data-xp-card={block.id} className={`xp-card is-${block.id}`}>
          <div className="xp-card-icon">
            <XpIcon name={block.icon} />
          </div>
          <div className="xp-card-copy">
            <div className="xp-card-title">{block.title}</div>
            <div className="xp-card-sub">{block.sub}</div>
          </div>
        </div>
      ))}
      <div data-xp-hub className="xp-hub">
        <svg className="xp-hub-ring" viewBox="0 0 280 280" aria-hidden="true">
          <circle data-xp-ring cx="140" cy="140" r="132" fill="none" stroke="var(--lime)" strokeWidth="6" />
        </svg>
        <div className="xp-hub-copy">
          Experience<br />principy
        </div>
      </div>
    </div>
  );
}

export function Principles({ step, reduced }: SceneProps) {
  return <PrinciplesSystem step={step} reduced={reduced} />;
}

const SCHWARTZ_QUOTE = [
  "„Lidé", "jsou", "sami", "o", "sobě", "složité", "a", "těžko", "pochopitelní,",
  "ale", "problém", "je,", "že", "umělá", "inteligence", "dokáže", "lidské",
  "předsudky", "šířit", "mnohem", "rychleji", "a", "ve", "větším", "měřítku.“",
] as const;

function speakOn(tl: gsap.core.Timeline, words: HTMLElement[], at: number) {
  let t = at;
  for (const word of words) {
    const raw = (word.textContent ?? "").trim();
    const core = raw.replace(/[„“.,]/g, "");
    const dur = core.length <= 3 ? 0.055 : Math.min(0.13, 0.07 + core.length * 0.007);
    tl.fromTo(
      word,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.22, ease: EASE.enter },
      t,
    );
    t += dur;
    if (raw.endsWith(",")) t += 0.22;
  }
}

export function Bias({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const beat = Math.max(0, Math.min(step, 2));
  const portrait = {
    position: "absolute" as const,
    right: 0,
    top: 0,
    height: "100%",
    width: 860,
    objectFit: "contain" as const,
    pointerEvents: "none" as const,
  };

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-schwartz-title]");
    const claim = el.querySelector<HTMLElement>("[data-schwartz-claim]");
    const copy = el.querySelector<HTMLElement>("[data-schwartz-copy]");
    const quote = el.querySelector<HTMLElement>("[data-schwartz-quote]");
    const cite = el.querySelector<HTMLElement>("[data-schwartz-cite]");
    const words = gsap.utils.toArray<HTMLElement>("[data-quote-word]", quote);
    const sharp = el.querySelector<HTMLElement>("[data-hero-visual]");
    const soft = el.querySelector<HTMLElement>("[data-vision-soft]");
    if (!title || !claim || !quote || !copy || !sharp || !soft) return;

    const pose = (quoted: boolean) => ({
      x: quoted ? -440 : 0,
      transformOrigin: quoted ? "50% 100%" : "100% 100%",
    });

    const apply = (to: number) => {
      const quoted = to >= 2;
      gsap.set(title, { autoAlpha: 1, y: 0 });
      gsap.set(claim, { autoAlpha: to >= 1 ? 1 : 0, y: 0 });
      gsap.set(copy, { autoAlpha: 1, y: 0 });
      gsap.set(quote, { autoAlpha: quoted ? 1 : 0 });
      gsap.set(words, { autoAlpha: quoted ? 1 : 0, y: 0 });
      if (cite) gsap.set(cite, { autoAlpha: quoted ? 1 : 0, y: 0 });
      gsap.set(sharp, { autoAlpha: 1, scale: 1, filter: "blur(0px)", ...pose(quoted) });
      gsap.set(soft, { autoAlpha: 0.22, scale: 1.1, filter: "blur(22px)", ...pose(quoted) });
    };

    const from = prev.current;
    prev.current = beat;

    if (reduced || from === beat || (from === null && beat !== 0) || (from !== null && Math.abs(beat - from) !== 1)) {
      apply(beat);
      return;
    }

    if (from === null) {
      gsap.set(title, { autoAlpha: 0, y: 16 });
      gsap.set(claim, { autoAlpha: 0, y: 12 });
      gsap.set(quote, { autoAlpha: 0, y: 12 });
      gsap.set([sharp, soft], { transformOrigin: "100% 100%" });
      gsap.set(soft, { filter: "blur(8px)", autoAlpha: 0.5, scale: 1.03 });
      gsap.set(sharp, { filter: "blur(14px)", autoAlpha: 0.35, scale: 1.05 });
      const intro = gsap.timeline();
      intro.to(title, { autoAlpha: 1, y: 0, duration: 0.46, ease: EASE.enter }, 0);
      intro.to(soft, { filter: "blur(22px)", autoAlpha: 0.2, scale: 1.1, duration: 0.9, ease: EASE.move }, 0);
      intro.to(sharp, { filter: "blur(0px)", autoAlpha: 1, scale: 1, duration: 0.9, ease: EASE.enter }, 0);
      return () => {
        intro.kill();
      };
    }

    const tl = gsap.timeline();
    apply(from);
    if (from === 0 && beat === 1) {
      gsap.set(claim, { autoAlpha: 0, y: 14 });
      tl.to(claim, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0);
    } else if (from === 1 && beat === 0) {
      tl.to(claim, { autoAlpha: 0, y: 10, duration: 0.22, ease: EASE.exit }, 0);
    } else if (from === 1 && beat === 2) {
      gsap.set(quote, { autoAlpha: 1 });
      gsap.set(words, { autoAlpha: 0, y: 6 });
      if (cite) gsap.set(cite, { autoAlpha: 0, y: 6 });
      tl.to([sharp, soft], { ...pose(true), duration: T.camera, ease: EASE.move }, 0);
      speakOn(tl, words, 0.58);
      if (cite) tl.to(cite, { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE.enter }, 3.3);
    } else if (from === 2 && beat === 1) {
      tl.to(quote, { autoAlpha: 0, duration: 0.22, ease: EASE.exit }, 0);
      tl.to([sharp, soft], { ...pose(false), duration: 0.55, ease: EASE.move }, 0);
    } else {
      apply(beat);
    }
    return () => {
      tl.kill();
    };
  }, [beat, reduced]);

  return (
    <div ref={root} className={`scene is-schwartz${beat >= 2 ? " is-quote" : ""}`}>
      <SlideChrome
        kicker="PROČ VĚŘIT / DŮVĚRA"
        page="52 / 75"
        caption="AI násobí naši historii"
        captionDot
      />
      <img data-vision-soft data-motion-role="schwartz-soft" src={asset("schwartz.webp")} alt="" className="cutout vision-soft" style={portrait} />
      <img data-hero-visual data-motion-role="schwartz-photo" src={asset("schwartz.webp")} alt="" className="cutout vision-sharp" style={portrait} />
      <div data-schwartz-copy className="safe schwartz-copy">
        <div className="label">Reva Schwartz · NIST</div>
        <h2 data-schwartz-title className="schwartz-title">
          Naše chyby dostávají větší sílu a ničí důvěru
        </h2>
        <p data-schwartz-claim className="schwartz-claim">
          Nebezpečí AI spočívá v tom, že je{" "}
          <em className="schwartz-mark">dokonalým studentem</em> naší vlastní nedokonalé historie.
        </p>
      </div>
      <blockquote data-schwartz-quote className="schwartz-quote">
        {SCHWARTZ_QUOTE.map((word, index) => (
          <span key={`${word}-${index}`} data-quote-word>
            {word}{index < SCHWARTZ_QUOTE.length - 1 ? " " : ""}
          </span>
        ))}
        <cite data-schwartz-cite className="schwartz-quote-cite">Reva Schwartz · NIST</cite>
      </blockquote>
    </div>
  );
}

const TRUST = [
  { n: "1", t: "Spolehlivost", q: "Mohu se na AI spolehnout?" },
  { n: "2", t: "Kontrola", q: "Mám nad AI kontrolu?" },
  { n: "3", t: "Náprava", q: "Co když se něco pokazí?" },
] as const;

export function Trust({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const beat = Math.max(0, Math.min(step, 17));
  const zoomed = beat >= 7;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-trust-card]", el);
    const labels = gsap.utils.toArray<HTMLElement>("[data-trust-label]", el);
    const questions = gsap.utils.toArray<HTMLElement>("[data-trust-q]", el);
    const hero = el.querySelector<HTMLElement>("[data-trust-hero]");
    const heroLine = el.querySelector<HTMLElement>("[data-trust-hero-line]");
    const heroTyped = el.querySelector<HTMLElement>("[data-trust-hero-typed]");
    const heroCaret = el.querySelector<HTMLElement>("[data-trust-hero-caret]");
    const layout = el.querySelector<HTMLElement>("[data-trust-layout]");
    const stage = el.querySelector<HTMLElement>("[data-hitl-stage]");
    const card = el.querySelector<HTMLElement>("[data-trust-card='kontrola']");
    const cycle = el.querySelector<HTMLElement>("[data-hitl-cycle]");
    const lead = el.querySelector<HTMLElement>("[data-hitl-lead]");
    const leadTyped = el.querySelector<HTMLElement>("[data-hitl-lead-typed]");
    const leadCaret = el.querySelector<HTMLElement>("[data-hitl-lead-caret]");
    const leadSub = el.querySelector<HTMLElement>("[data-hitl-lead-sub]");
    const sub = el.querySelector<HTMLElement>("[data-hitl-sub]");
    const word = el.querySelector<HTMLElement>("[data-kontrola-word]");
    const hitlTitle = el.querySelector<HTMLElement>("[data-hitl-title]");
    const cardLabel = labels[1];
    const scene = el.getBoundingClientRect();
    const viewScale = scene.width / 1920;

    const clearHero = () => {
      if (hero) gsap.set(hero, { autoAlpha: 0 });
      if (heroLine) gsap.set(heroLine, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      if (heroTyped) heroTyped.textContent = "";
      if (heroCaret) gsap.set(heroCaret, { autoAlpha: 0, opacity: 0 });
    };
    const land = (index: number) => {
      gsap.set(cards[index], { autoAlpha: 1, y: 0 });
      gsap.set(questions[index], { autoAlpha: 1, x: 0, y: 0, scale: 1, zIndex: 1 });
      gsap.set(labels[index], { autoAlpha: 1, y: 0 });
    };
    const hideQ = (index: number) => {
      gsap.set(cards[index], { autoAlpha: 0, y: 22 });
      gsap.set(questions[index], { autoAlpha: 0, x: 0, y: 0, scale: 1, zIndex: 1 });
      gsap.set(labels[index], { autoAlpha: 0, y: 10 });
    };
    const HITL = 7;
    const LAST_CARD = 6;
    const LEAD_COPY = "HITL princip";
    const landedCount = (b: number) => Math.floor(Math.min(b, LAST_CARD) / 2);
    const typingIndex = (b: number) => (b < HITL && b % 2 === 1 ? (b - 1) / 2 : -1);

    const showHero = (text: string) => {
      if (hero) gsap.set(hero, { autoAlpha: 1 });
      if (heroLine) gsap.set(heroLine, { autoAlpha: 1, x: 0, y: 0, scale: 1, transformOrigin: "50% 50%" });
      if (heroTyped) heroTyped.textContent = text;
      if (heroCaret) gsap.set(heroCaret, { autoAlpha: 0, opacity: 0 });
    };
    const applyPose = (to: number) => {
      const landed = landedCount(to);
      TRUST.forEach((_, index) => {
        if (index < landed) land(index);
        else hideQ(index);
      });
      const typing = typingIndex(to);
      if (typing >= 0) showHero(TRUST[typing].q);
      else clearHero();
    };
    const panelDest = { left: 80, top: 90, width: 1760, height: 900 };
    const localRect = (node: HTMLElement) => {
      const r = node.getBoundingClientRect();
      return {
        left: (r.left - scene.left) / viewScale,
        top: (r.top - scene.top) / viewScale,
        width: r.width / viewScale,
        height: r.height / viewScale,
      };
    };
    const wordFromCard = () => {
      if (!cardLabel) return { left: 0, top: 0, fontSize: "40px", letterSpacing: "-0.045em", color: "#03383d" };
      const r = localRect(cardLabel);
      return { left: r.left, top: r.top, fontSize: "40px", letterSpacing: "-0.045em", color: "#03383d" };
    };
    const wordToTitle = () => {
      if (!hitlTitle) return { left: 144, top: 138, fontSize: "42px", letterSpacing: "-0.04em", color: "#c3d552" };
      const r = localRect(hitlTitle);
      return { left: r.left, top: r.top, fontSize: "42px", letterSpacing: "-0.04em", color: "#c3d552" };
    };
    const pinWord = (full: boolean) => {
      if (!word) return;
      if (!full) {
        gsap.set(word, { autoAlpha: 0 });
        return;
      }
      gsap.set(word, { autoAlpha: 1, transformOrigin: "0% 0%", ...wordToTitle() });
      if (cardLabel) gsap.set(cardLabel, { autoAlpha: 0 });
    };
    const putPanel = (full: boolean) => {
      if (!stage) return;
      const pose = full || !card ? panelDest : localRect(card);
      gsap.set(stage, { autoAlpha: full ? 1 : 0, ...pose });
    };
    const settleLead = (on: boolean) => {
      if (lead) gsap.set(lead, { autoAlpha: on ? 1 : 0 });
      if (leadTyped) leadTyped.textContent = on ? LEAD_COPY : "";
      if (leadCaret) gsap.set(leadCaret, { autoAlpha: 0, opacity: 0 });
      if (leadSub) gsap.set(leadSub, { autoAlpha: on ? 1 : 0, y: 0 });
    };
    const applyHitl = (to: number) => {
      if (layout) gsap.set(layout, { autoAlpha: to >= HITL ? 0 : 1 });
      putPanel(to >= HITL);
      pinWord(to >= HITL);
      settleLead(to >= HITL);
      if (sub) gsap.set(sub, { autoAlpha: to >= HITL ? 1 : 0, y: 0 });
      if (cycle) gsap.set(cycle, { autoAlpha: to >= HITL ? 1 : 0 });
    };
    const typeIn = (index: number) => {
      const text = TRUST[index].q;
      const typeDur = Math.min(1.42, 0.58 + text.length * 0.034);
      hideQ(index);
      if (hero) gsap.set(hero, { autoAlpha: 1 });
      if (heroLine) gsap.set(heroLine, { autoAlpha: 1, x: 0, y: 0, scale: 1, transformOrigin: "50% 50%" });
      if (heroTyped) heroTyped.textContent = "";
      const tl = gsap.timeline();
      typeOn(tl, heroTyped, heroCaret, text, 0, typeDur);
      return tl;
    };
    const flyToCard = (index: number) => {
      const text = TRUST[index].q;
      hideQ(index);
      showHero(text);
      const move = { x: 0, y: 0, scale: 1 };
      const tl = gsap.timeline();
      tl.to(cards[index], { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0);
      tl.call(() => {
        if (!heroLine) return;
        const dest = questions[index].getBoundingClientRect();
        const fromBox = heroLine.getBoundingClientRect();
        move.x = (dest.left + dest.width / 2 - (fromBox.left + fromBox.width / 2)) / viewScale;
        move.y = (dest.top + dest.height / 2 - (fromBox.top + fromBox.height / 2)) / viewScale;
        const fromFs = parseFloat(getComputedStyle(heroLine).fontSize);
        const toFs = parseFloat(getComputedStyle(questions[index]).fontSize);
        move.scale = fromFs ? toFs / fromFs : 0.36;
      }, undefined, 0.08);
      tl.to(heroLine, {
        duration: T.camera,
        ease: EASE.move,
        x: () => move.x,
        y: () => move.y,
        scale: () => move.scale,
      }, 0.1);
      tl.set(questions[index], { autoAlpha: 1 });
      tl.set(hero, { autoAlpha: 0 });
      tl.set(heroLine, { x: 0, y: 0, scale: 1 });
      tl.add(() => {
        if (heroTyped) heroTyped.textContent = "";
      });
      tl.to(labels[index], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter });
      return tl;
    };

    const from = prev.current;
    prev.current = beat;

    if (reduced || from === beat || (from === null && beat !== 0) || (from !== null && Math.abs(beat - from) !== 1)) {
      applyPose(beat);
      applyHitl(beat);
      return;
    }

    if (from === null) {
      applyPose(0);
      applyHitl(0);
      return;
    }

    if (from < HITL && beat < HITL) {
      applyHitl(0);
      applyPose(from);
      const typing = typingIndex(beat);
      if (beat === from + 1 && typing >= 0) {
        const tl = typeIn(typing);
        return () => { tl.kill(); };
      }
      if (beat === from + 1 && beat % 2 === 0 && beat >= 2) {
        const tl = flyToCard(beat / 2 - 1);
        return () => { tl.kill(); };
      }
      if (beat === from - 1 && typingIndex(from) >= 0) {
        const tl = gsap.timeline();
        if (hero) tl.to(hero, { autoAlpha: 0, duration: 0.22, ease: EASE.exit }, 0);
        tl.add(() => {
          if (heroTyped) heroTyped.textContent = "";
        });
        return () => { tl.kill(); };
      }
      if (beat === from - 1 && from % 2 === 0 && from >= 2) {
        const index = from / 2 - 1;
        const tl = gsap.timeline();
        tl.to(cards[index], { autoAlpha: 0, y: 16, duration: 0.24, ease: EASE.exit }, 0);
        tl.to(questions[index], { autoAlpha: 0, duration: 0.2, ease: EASE.exit }, 0);
        tl.to(labels[index], { autoAlpha: 0, y: 8, duration: 0.2, ease: EASE.exit }, 0);
        tl.add(() => showHero(TRUST[index].q), 0.08);
        return () => { tl.kill(); };
      }
      applyPose(beat);
      return;
    }

    if (!stage || !layout || !card) {
      applyHitl(beat);
      return;
    }

    const tl = gsap.timeline();
    if (from === LAST_CARD && beat === HITL) {
      applyPose(LAST_CARD);
      gsap.set(layout, { autoAlpha: 1 });
      const origin = localRect(card);
      const fromWord = wordFromCard();
      gsap.set(stage, { autoAlpha: 1, ...panelDest });
      const toWord = wordToTitle();
      gsap.set(stage, { autoAlpha: 1, ...origin });
      if (lead) gsap.set(lead, { autoAlpha: 0 });
      if (leadTyped) leadTyped.textContent = "";
      if (leadCaret) gsap.set(leadCaret, { autoAlpha: 0, opacity: 0 });
      if (leadSub) gsap.set(leadSub, { autoAlpha: 0, y: 10 });
      if (sub) gsap.set(sub, { autoAlpha: 0, y: 10 });
      if (cycle) gsap.set(cycle, { autoAlpha: 0 });
      if (word) {
        gsap.set(word, { autoAlpha: 1, transformOrigin: "0% 0%", ...fromWord });
        if (cardLabel) gsap.set(cardLabel, { autoAlpha: 0 });
      }
      tl.to(layout, { autoAlpha: 0, duration: 0.32, ease: EASE.exit }, 0);
      tl.to(stage, { ...panelDest, duration: T.cameraVia, ease: EASE.move }, 0);
      if (word) tl.to(word, { ...toWord, duration: T.cameraVia, ease: EASE.move }, 0);
      if (sub) tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.42);
      if (cycle) tl.to(cycle, { autoAlpha: 1, duration: 0.4, ease: EASE.enter }, 0.48);
      if (lead) tl.set(lead, { autoAlpha: 1 }, 0.46);
      typeOn(tl, leadTyped, leadCaret, LEAD_COPY, 0.5, 0.78);
      if (leadSub) tl.to(leadSub, { autoAlpha: 1, y: 0, duration: 0.34, ease: EASE.enter }, 1.22);
      return () => { tl.kill(); };
    }
    if (from === HITL && beat === LAST_CARD) {
      applyPose(LAST_CARD);
      gsap.set(layout, { autoAlpha: 0 });
      gsap.set(stage, { autoAlpha: 1, ...panelDest });
      const toWord = wordToTitle();
      const origin = localRect(card);
      const fromWord = wordFromCard();
      if (word) gsap.set(word, { autoAlpha: 1, transformOrigin: "0% 0%", ...toWord });
      if (cardLabel) gsap.set(cardLabel, { autoAlpha: 0 });
      if (sub) tl.to(sub, { autoAlpha: 0, y: 8, duration: 0.18, ease: EASE.exit }, 0);
      if (lead) tl.to(lead, { autoAlpha: 0, duration: 0.18, ease: EASE.exit }, 0);
      if (cycle) tl.to(cycle, { autoAlpha: 0, duration: 0.18, ease: EASE.exit }, 0);
      tl.to(stage, { ...origin, duration: T.camera, ease: EASE.move }, 0);
      if (word) tl.to(word, { ...fromWord, duration: T.camera, ease: EASE.move }, 0);
      tl.to(layout, { autoAlpha: 1, duration: 0.3, ease: EASE.enter }, 0.18);
      tl.set(cardLabel, { autoAlpha: 1 });
      tl.set(word, { autoAlpha: 0 });
      tl.set(stage, { autoAlpha: 0 });
      return () => { tl.kill(); };
    }

    applyHitl(beat);
    return () => { tl.kill(); };
  }, [beat, reduced]);

  return (
    <div ref={root} className={`scene is-trust${zoomed ? " is-hitl" : ""}`}>
      <SlideChrome
        kicker="PROČ VĚŘIT / DŮVĚRA"
        page={zoomed ? "54 / 75" : "53 / 75"}
        caption={zoomed ? "Kontrola v praxi" : "Tři podmínky důvěry"}
        captionDot
      />
      <div data-trust-layout className="safe trust-layout">
        <div data-trust-title className="trust-title">
          Tři podmínky, které musí fungovat,
          <br />
          aby lidé AI věřili
        </div>
        <div className="trust-grid">
          {TRUST.map((item) => (
            <div
              key={item.n}
              data-trust-card={item.t === "Kontrola" ? "kontrola" : item.n}
              className="trust-card"
            >
              <div data-trust-num className="trust-num">{item.n}</div>
              <div data-trust-label={item.t === "Kontrola" ? "kontrola" : item.n} className="trust-label">{item.t}</div>
              <div data-trust-q className="trust-q">{item.q}</div>
            </div>
          ))}
        </div>
      </div>
      <div data-trust-hero className="trust-hero">
        <div data-trust-hero-line className="trust-hero-line">
          <span data-trust-hero-typed />
          <span data-trust-hero-caret className="caret is-scripted" aria-hidden="true" />
        </div>
      </div>
      <div data-kontrola-word className="trust-word">Kontrola</div>
      <div data-hitl-stage className="hitl-stage">
        <div data-hitl-title className="hitl-title">Kontrola</div>
        <p data-hitl-sub className="hitl-sub">
          AI může pracovat autonomně.
          <br />
          Člověk ale musí mít možnost zasáhnout.
        </p>
        <div data-hitl-lead className="hitl-lead">
          <div className="hitl-lead-title">
            <span data-hitl-lead-typed />
            <span data-hitl-lead-caret className="caret is-scripted" aria-hidden="true" />
          </div>
          <div data-hitl-lead-sub className="hitl-lead-sub">human in the loop</div>
        </div>
        <HitlCycle active={zoomed} reduced={reduced} />
      </div>
    </div>
  );
}

export function Hitl({ step, reduced }: SceneProps) {
  const nodes = [
    { t: "CÍL", sub: "směr" },
    { t: "AI PRACUJE", sub: "rychlost" },
    { t: step === 0 ? "VÝSTUP" : "KONTROLNÍ BOD", sub: step === 0 ? "návrh" : "člověk" },
  ];
  return (
    <div className="scene" style={{ background: "var(--bg)" }}>
      <Chrome page={step === 0 ? "55" : "56"} caption={step === 0 ? "AI může udělat většinu práce" : "Odpovědnost nemizí"} dark={step === 1} />
      <div className="safe" style={{ display: "grid", alignContent: "center", color: "var(--text-deep)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 92px 1fr 92px 1fr", alignItems: "center" }}>
          {nodes.map((node, index) => (
            <div key={node.t} style={{ display: "contents" }}>
              <div data-hitl={index} style={{ height: 300, padding: "42px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: `3px solid ${step === 1 && index === 2 ? "var(--lime)" : step === 1 ? "rgba(0,88,96,.25)" : "var(--text-deep)"}`, background: step === 1 && index === 2 ? "var(--lime)" : index === 1 ? (step === 1 ? "rgba(0,88,96,.08)" : "var(--paper)") : "transparent", color: step === 1 && index === 2 ? "var(--text-deep)" : undefined, transition: MOTION(reduced) }}>
                <div className="label" style={{ color: step === 1 && index === 2 ? "var(--text-deep)" : step === 1 ? "rgba(0,88,96,.5)" : undefined }}>0{index + 1} · {node.sub}</div>
                <div style={{ fontSize: index === 2 && step === 1 ? 42 : 50, fontWeight: 800, lineHeight: 1, letterSpacing: "-.04em" }}>{node.t}</div>
              </div>
              {index < nodes.length - 1 && <Arrow dark={step === 1} />}
            </div>
          ))}
        </div>
        {step === 1 && (
          <div data-hitl-actions style={{ justifySelf: "end", width: 572, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 28 }}>
            {["POKRAČOVAT", "UPRAVIT"].map((action) => <div key={action} style={{ border: "2px solid rgba(0,88,96,.25)", padding: "18px 24px", fontSize: 18, fontWeight: 800, letterSpacing: ".1em", textAlign: "center" }}>{action}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}
