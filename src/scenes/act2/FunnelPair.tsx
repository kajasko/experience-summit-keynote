import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";

type Box = { x: number; y: number; w: number; h: number; r: number; br: number };

const LINEAR: Box[] = [
  { x: 348, y: 56, w: 292, h: 78, r: 0, br: 22 },
  { x: 348, y: 158, w: 292, h: 78, r: 0, br: 22 },
  { x: 348, y: 260, w: 292, h: 78, r: 0, br: 22 },
  { x: 348, y: 362, w: 292, h: 78, r: 0, br: 22 },
  { x: 348, y: 464, w: 292, h: 78, r: 0, br: 22 },
];

const SCATTER: Box[] = [
  { x: 36, y: 28, w: 300, h: 118, r: -7, br: 28 },
  { x: 568, y: 48, w: 300, h: 118, r: 6, br: 28 },
  { x: 628, y: 248, w: 300, h: 118, r: 8, br: 28 },
  { x: 72, y: 292, w: 300, h: 118, r: -4, br: 28 },
  { x: 318, y: 428, w: 320, h: 128, r: 0, br: 28 },
];

const NEEDS = [
  { id: "objevit", label: "Objevit", a: "search", b: "search" },
  { id: "porovnat", label: "Porovnat", a: "scales", b: "scales" },
  { id: "ujistit", label: "Ujistit", a: "shield", b: "shield" },
  { id: "vybrat", label: "Vybrat", a: "cart", b: "calendar" },
  { id: "zaplatit", label: "Zaplatit", a: "card", b: "cart" },
] as const;

const RINGS = Array.from({ length: 10 }, (_, i) => {
  const t = i / 9;
  return { cy: 58 + t * 540, rx: 400 - t * 255, ry: 24 + t * 9 };
});

function Glyph({ name }: { name: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      {name === "search" && (
        <>
          <circle cx="11" cy="11" r="6.2" {...p} />
          <path d="m16 16 4 4" {...p} />
        </>
      )}
      {name === "scales" && (
        <>
          <path d="M12 3v18M8 21h8" {...p} />
          <path d="M4 7h16" {...p} />
          <path d="M5 7 3 13h5L5 7Z" {...p} />
          <path d="m19 7 2 6h-5l3-6Z" {...p} />
        </>
      )}
      {name === "shield" && (
        <>
          <path d="M12 3 5 6.2v6c0 4.2 2.8 7 7 8.6 4.2-1.6 7-4.4 7-8.6v-6L12 3Z" {...p} />
          <path d="m8.8 12 2.2 2.2 4.2-4.4" {...p} />
        </>
      )}
      {name === "cart" && (
        <>
          <path d="M4 5h2l1.6 9.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L21 8H7" {...p} />
          <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="18" cy="20" r="1.3" fill="currentColor" stroke="none" />
        </>
      )}
      {name === "card" && (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2" {...p} />
          <path d="M3 10h18" {...p} />
        </>
      )}
      {name === "calendar" && (
        <>
          <rect x="4" y="5" width="16" height="15" rx="2" {...p} />
          <path d="M8 3v4M16 3v4M4 10h16" {...p} />
        </>
      )}
    </svg>
  );
}

export function FunnelPair({ step, reduced }: { step: number; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const scatter = step === 1;

  useLayoutEffect(() => {
    const last = prev.current;
    prev.current = step;
    const el = root.current;
    if (!el) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-funnel-card]", el);
    const ghost = el.querySelector<HTMLElement>("[data-funnel-ghost]");
    const rails = el.querySelector<HTMLElement>("[data-funnel-rails]");
    const net = el.querySelector<HTMLElement>("[data-funnel-net]");
    const extra = el.querySelector<HTMLElement>("[data-funnel-extra]");
    const titleA = el.querySelector<HTMLElement>("[data-title-a]");
    const titleB = el.querySelector<HTMLElement>("[data-title-b]");
    const subA = el.querySelector<HTMLElement>("[data-sub-a]");
    const subB = el.querySelector<HTMLElement>("[data-sub-b]");
    const layout = step === 0 ? LINEAR : SCATTER;
    const morph = !reduced && last !== null && Math.abs(last - step) === 1;
    const box = (p: Box) => ({ left: p.x, top: p.y, width: p.w, height: p.h, rotation: p.r, borderRadius: p.br, transformOrigin: "50% 50%" });
    const faces = (now: boolean) => {
      cards.forEach((card) => {
        const iconA = card.querySelector<HTMLElement>("[data-icon-a]");
        const iconB = card.querySelector<HTMLElement>("[data-icon-b]");
        gsap.set(iconA, { autoAlpha: now ? 0 : 1 });
        gsap.set(iconB, { autoAlpha: now ? 1 : 0 });
      });
    };

    if (!morph) {
      cards.forEach((card, i) => gsap.set(card, box(layout[i])));
      if (ghost) gsap.set(ghost, { autoAlpha: step === 0 ? 0.9 : 0.38, y: step === 0 ? 0 : -28 });
      if (rails) gsap.set(rails, { autoAlpha: step === 0 ? 1 : 0 });
      if (net) gsap.set(net, { autoAlpha: step === 1 ? 1 : 0 });
      if (extra) gsap.set(extra, { autoAlpha: step === 1 ? 1 : 0, y: 0 });
      if (titleA) gsap.set(titleA, { autoAlpha: step === 0 ? 1 : 0, y: 0 });
      if (titleB) gsap.set(titleB, { autoAlpha: step === 1 ? 1 : 0, y: 0 });
      if (subA) gsap.set(subA, { autoAlpha: step === 0 ? 1 : 0, y: 0 });
      if (subB) gsap.set(subB, { autoAlpha: step === 1 ? 1 : 0, y: 0 });
      faces(step === 1);
      return;
    }

    const tl = gsap.timeline();
    cards.forEach((card, i) => {
      tl.to(card, { ...box(layout[i]), duration: T.camera, ease: EASE.move }, 0);
    });
    if (ghost) tl.to(ghost, { autoAlpha: step === 0 ? 0.9 : 0.38, y: step === 0 ? 0 : -28, duration: T.camera, ease: EASE.move }, 0);
    if (rails) tl.to(rails, { autoAlpha: step === 0 ? 1 : 0, duration: 0.28, ease: EASE.move }, 0.08);
    if (net) tl.to(net, { autoAlpha: step === 1 ? 1 : 0, duration: 0.42, ease: EASE.move }, step === 1 ? 0.22 : 0);
    if (extra) tl.to(extra, { autoAlpha: step === 1 ? 1 : 0, y: step === 1 ? 0 : 8, duration: 0.32, ease: EASE.move }, 0.12);
    if (titleA) tl.to(titleA, { autoAlpha: step === 0 ? 1 : 0, y: step === 0 ? 0 : -10, duration: 0.28, ease: EASE.move }, 0);
    if (titleB) tl.to(titleB, { autoAlpha: step === 1 ? 1 : 0, y: step === 1 ? 0 : 10, duration: 0.32, ease: EASE.enter }, 0.12);
    if (subA) tl.to(subA, { autoAlpha: step === 0 ? 1 : 0, y: step === 0 ? 0 : -6, duration: 0.24, ease: EASE.move }, 0.04);
    if (subB) tl.to(subB, { autoAlpha: step === 1 ? 1 : 0, y: step === 1 ? 0 : 6, duration: 0.28, ease: EASE.enter }, 0.16);
    cards.forEach((card) => {
      const iconA = card.querySelector<HTMLElement>("[data-icon-a]");
      const iconB = card.querySelector<HTMLElement>("[data-icon-b]");
      if (iconA) tl.to(iconA, { autoAlpha: step === 1 ? 0 : 1, duration: 0.22, ease: EASE.move }, 0.18);
      if (iconB) tl.to(iconB, { autoAlpha: step === 1 ? 1 : 0, duration: 0.22, ease: EASE.move }, 0.22);
    });
    return () => { tl.kill(); };
  }, [step, reduced]);

  return (
    <div ref={root} className={`funnel-pair${scatter ? " is-scatter" : ""}`}>
      <div className="funnel-copy">
        <div className="funnel-rule" />
        <div className="funnel-copy-stack">
          <div data-title-a className="funnel-title">
            Obrazovka jako jednotka
            <br />
            designu přestává fungovat.
          </div>
          <div data-title-b className="funnel-title is-b">
            Jednotkou designu
            <br />
            se stává potřeba.
          </div>
        </div>
        <div className="funnel-sub">
          <span data-sub-a>Funnel mizí. Potřeby zůstávají.</span>
          <span data-sub-b>Stejné potřeby nemusí přijít ve stejném pořadí.</span>
          <div data-funnel-extra className="funnel-extra">Zkušenost se skládá podle situace.</div>
        </div>
      </div>

      <div className="funnel-stage">
        <svg className="funnel-ghost" data-funnel-ghost viewBox="0 0 980 700" aria-hidden="true">
          {RINGS.map((ring) => (
            <ellipse key={ring.cy} cx="494" cy={ring.cy} rx={ring.rx} ry={ring.ry} />
          ))}
        </svg>

        <svg className="funnel-rails" data-funnel-rails viewBox="0 0 980 700" aria-hidden="true">
          {[146, 248, 350, 452].map((y) => (
            <circle key={y} cx="494" cy={y} r="6" />
          ))}
        </svg>

        <svg className="funnel-net" data-funnel-net viewBox="0 0 980 700" aria-hidden="true">
          <path d="M186 87 C 300 150, 380 155, 430 150 S 600 88, 718 107" />
          <path d="M430 150 C 330 230, 250 310, 222 351" />
          <path d="M222 351 C 310 410, 400 470, 478 492" />
          <path d="M478 492 C 640 440, 750 360, 778 307" />
          <path d="M718 107 C 770 180, 790 250, 778 307" />
          <circle cx="430" cy="150" r="6" />
          <circle cx="330" cy="250" r="6" />
          <circle cx="400" cy="430" r="6" />
          <circle cx="740" cy="170" r="6" />
          <circle cx="700" cy="360" r="6" />
        </svg>

        {NEEDS.map((need, i) => (
          <article
            key={need.id}
            data-funnel-card={need.id}
            className={`funnel-card${i === 4 ? " is-pay" : ""}`}
            style={{ left: LINEAR[i].x, top: LINEAR[i].y, width: LINEAR[i].w, height: LINEAR[i].h, borderRadius: LINEAR[i].br }}
          >
            <span className="funnel-ico">
              <span data-icon-a><Glyph name={need.a} /></span>
              <span data-icon-b><Glyph name={need.b} /></span>
            </span>
            <span className="funnel-meta">
              <strong>{need.label}</strong>
              <em />
            </span>
          </article>
        ))}
      </div>
    </div>
  );
}
