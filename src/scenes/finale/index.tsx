import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { HeroText } from "../../components/HeroText";
import { SlideChrome } from "../../components/SlideChrome";
import { EASE, MOTION as T } from "../../engine/motion";
import { SpeakersEnd } from "./SpeakersEnd";

const SKILL_COLUMNS = [
  {
    id: "tech",
    title: "Technologická gramotnost",
    rows: [
      ["AI & big data", 87],
      ["Kyberbezpečnost", 70],
      ["Technologická gramotnost", 68],
    ],
  },
  {
    id: "human",
    title: "Lidskost a komplexní myšlení",
    rows: [
      ["Kreativní myšlení", 66],
      ["Odolnost a flexibilita", 66],
      ["Empatie", 46],
    ],
  },
  {
    id: "routine",
    title: "Rutina a mechanická exekuce",
    rows: [
      ["Programování", 27],
      ["Čtení, psaní a matematika", -4],
      ["Manuální zručnost a přesnost", -24],
    ],
  },
] as const;

export function Skills({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const previous = useRef<number | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const was = previous.current;
    previous.current = step;
    const animate = !reduced && was !== null && Math.abs(was - step) === 1;
    const title = el.querySelector<HTMLElement>("[data-skills-title]");
    const main = el.querySelector<HTMLElement>("[data-skills-main]");
    const sub = el.querySelector<HTMLElement>("[data-skills-sub]");
    const eyebrow = el.querySelector<HTMLElement>("[data-skills-eyebrow]");
    const grid = el.querySelector<HTMLElement>("[data-skills-grid]");
    const columns = [...el.querySelectorAll<HTMLElement>("[data-skill-column]")];
    const active = Math.max(0, Math.min(SKILL_COLUMNS.length - 1, step - 1));

    const writeValue = (node: HTMLElement, value: number) => {
      node.textContent = value >= 0 ? `+${value}` : `↓ −${Math.abs(value)}`;
    };
    const barOrigin = (value: number) => (value < 0 ? "right center" : "left center");

    const compactTitle = () => {
      gsap.set(title, { left: 90, right: 90, top: 70, width: "auto", textAlign: "center" });
      gsap.set(main, { fontSize: 50 });
      gsap.set(sub, { fontSize: 32, marginTop: 7 });
      gsap.set(eyebrow, { autoAlpha: 1 });
    };
    const cardTarget = (index: number, activeIndex: number) => {
      const relative = (index - activeIndex + columns.length) % columns.length;
      if (relative === 0) return { x: 0, scale: 1, rotationY: 0, filter: "blur(0px) saturate(1)", autoAlpha: 1, zIndex: 3 };
      if (relative === 1) return { x: 555, scale: 0.78, rotationY: -8, filter: "blur(9px) saturate(.72)", autoAlpha: 0.44, zIndex: 1 };
      return { x: -555, scale: 0.78, rotationY: 8, filter: "blur(9px) saturate(.72)", autoAlpha: 0.44, zIndex: 1 };
    };
    const setRows = (column: HTMLElement, visible: boolean) => {
      [...column.querySelectorAll<HTMLElement>("[data-skill-row]")].forEach((row) => {
        const bar = row.querySelector<HTMLElement>("[data-skill-bar]");
        const value = row.querySelector<HTMLElement>("[data-skill-value]");
        const raw = Number(value?.dataset.skillValue ?? 0);
        gsap.set(row, { autoAlpha: visible ? 1 : 0, y: 0 });
        if (bar) gsap.set(bar, { scaleX: visible ? 1 : 0, transformOrigin: barOrigin(raw) });
        if (value) visible ? writeValue(value, raw) : value.textContent = "·";
      });
    };

    const tl = gsap.timeline();
    if (!animate) {
      if (step === 0) {
        gsap.set(title, { left: 90, right: 90, top: 314, width: "auto", textAlign: "center" });
        gsap.set(main, { fontSize: 86 });
        gsap.set(sub, { fontSize: 50, marginTop: 18 });
        gsap.set([eyebrow, grid], { autoAlpha: 0 });
        columns.forEach((column) => gsap.set(column, { autoAlpha: 0 }));
      } else {
        compactTitle();
        gsap.set(grid, { autoAlpha: 1 });
        columns.forEach((column, index) => {
          gsap.set(column, { ...cardTarget(index, active), xPercent: -50, yPercent: -50 });
          setRows(column, index <= active);
        });
      };
      return () => { tl.kill(); };
    }

    if (step === 0) {
      tl.to([grid, eyebrow], { autoAlpha: 0, duration: T.exit, ease: EASE.exit }, 0)
        .to(title, { top: 314, duration: T.cameraVia, ease: EASE.move }, 0)
        .to(main, { fontSize: 86, duration: T.cameraVia, ease: EASE.move }, 0)
        .to(sub, { fontSize: 50, marginTop: 18, duration: T.cameraVia, ease: EASE.move }, 0);
      return () => { tl.kill(); };
    }

    if (was === 0) {
      gsap.set(title, { textAlign: "center" });
      gsap.set(eyebrow, { autoAlpha: 0 });
      gsap.set(grid, { autoAlpha: 1 });
      tl.to(title, { top: 70, duration: T.cameraVia, ease: EASE.move }, 0)
        .to(main, { fontSize: 50, duration: T.cameraVia, ease: EASE.move }, 0)
        .to(sub, { fontSize: 32, marginTop: 7, duration: T.cameraVia, ease: EASE.move }, 0)
        .to(eyebrow, { autoAlpha: 1, duration: 0.4, ease: EASE.enter }, 0.36);
      columns.forEach((column, index) => {
        const target = cardTarget(index, active);
        gsap.set(column, { ...target, xPercent: -50, yPercent: -50, autoAlpha: 0, scale: target.scale * 0.9 });
        tl.to(column, { ...target, duration: 0.82, ease: EASE.enter }, index === active ? 0.34 : 0.58 + index * 0.08);
        setRows(column, false);
      });
    } else {
      compactTitle();
      gsap.set(grid, { autoAlpha: 1 });
      columns.forEach((column, index) => {
        tl.to(column, { ...cardTarget(index, active), duration: 1.05, ease: EASE.move }, 0);
        setRows(column, index < active);
      });
    }

    const activeColumn = columns[active];
    if (activeColumn) {
      const rows = [...activeColumn.querySelectorAll<HTMLElement>("[data-skill-row]")];
      rows.forEach((row, rowIndex) => {
        const value = row.querySelector<HTMLElement>("[data-skill-value]");
        const raw = Number(value?.dataset.skillValue ?? 0);
        const bar = row.querySelector<HTMLElement>("[data-skill-bar]");
        const counter = { n: 0 };
        const at = (was === 0 ? 0.92 : 0.78) + rowIndex * 1.02;
        gsap.set(row, { autoAlpha: 0, y: 18 });
        if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: barOrigin(raw) });
        if (value) value.textContent = "·";
        tl.to(row, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, at);
        if (bar) tl.to(bar, { scaleX: 1, duration: 0.76, ease: EASE.move }, at + 0.16);
        if (value) {
          tl.to(counter, {
            n: raw,
            duration: 0.76,
            ease: EASE.move,
            onUpdate: () => writeValue(value, Math.round(counter.n)),
          }, at + 0.16);
        }
      });
    }

    return () => { tl.kill(); };
  }, [step, reduced]);

  return (
    <div ref={root} className="scene skills-stage">
      <SlideChrome kicker="FINÁLE / KOMPETENCE BUDOUCNOSTI" page="69 / 75" caption="Kompetence na vzestupu" rail="2025 → 2030" />
      <div data-skills-title className="skills-story-title">
        <div data-skills-eyebrow className="skills-story-eyebrow">SKILLS ON THE RISE · 2025–2030 · WORLD ECONOMIC FORUM</div>
        <div data-skills-main className="skills-story-main">Hodnota se přesouvá.</div>
        <div data-skills-sub className="skills-story-sub">Proto potřebujeme rozvíjet kompetence budoucnosti.</div>
      </div>
      <div data-skills-grid className="skills-columns">
        {SKILL_COLUMNS.map((column) => (
          <section key={column.id} data-skill-column={column.id} className={`skills-column is-${column.id}`}>
            <div className="skills-column-head">
              <h3>{column.title}</h3>
            </div>
            <div className="skills-column-rows">
              {column.rows.map(([name, value]) => (
                <div key={name} data-skill-row className={value < 0 ? "skills-row is-negative" : "skills-row"}>
                  <div className="skills-row-name">{name}</div>
                  <div className="skills-track">
                    <span data-skill-bar className={value < 0 ? "is-negative" : ""} style={{ width: `${Math.max(18, Math.abs(value))}%` }} />
                  </div>
                  <div data-skill-value={value} className={value < 0 ? "skills-value is-negative" : "skills-value"}>·</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function HeroEnd({ step, reduced }: SceneProps) {
  const moved = step === 1;
  return (
    <div className="scene">
      <SlideChrome kicker="FINÁLE / HUMAN VALUE" page={moved ? "72 / 75" : "71 / 75"} caption={moved ? "Od exekuce k úsudku" : "Dlouhá pauza"} rail="ČLOVĚK" />
      <div className="safe" style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
        {!moved ? (
          <div>
            <div style={{ width: 76, height: 5, background: "var(--lime)", margin: "0 auto 54px" }} />
            <HeroText size={100} reduced={reduced} align="center">
              AI nesnižuje
              <br />hodnotu člověka.
            </HeroText>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <HeroText size={118} reduced={reduced} align="center">Přesouvá ji.</HeroText>
            <div data-value-direction style={{ margin: "62px auto 0", width: 1050, display: "grid", gridTemplateColumns: "1fr 180px 1fr", alignItems: "center" }}>
              <div className="label" style={{ fontSize: 26 }}>OD EXEKUCE</div>
              <svg width="180" height="40" viewBox="0 0 180 40" aria-hidden="true">
                <path d="M0 20 H160" stroke="var(--lime)" strokeWidth="4" />
                <path d="M145 5 L164 20 L145 35" fill="none" stroke="var(--lime)" strokeWidth="4" />
              </svg>
              <div className="label" style={{ fontSize: 26, color: "var(--text-deep)" }}>K ÚSUDKU</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ROLES = [
  { t: "AI EXPERIENCE DESIGNER", s: "Jak spolu komunikuje člověk a AI." },
  { t: "HUMAN + AI WORKFLOW DESIGNER", s: "Kdo co dělá — člověk vs. AI." },
  { t: "EXPERIENCE ORCHESTRATOR", s: "Jak to celé funguje napříč firmou." },
];

export function Roles({ step, reduced }: SceneProps) {
  void step;
  void reduced;
  return (
    <div className="scene">
      <SlideChrome kicker="FINÁLE / NOVÉ ROLE" page="73 / 75" caption="Tři role. Jeden systém." captionDot rail="INTERAKCE × PRÁCE × SYSTÉM" />
      <div className="safe" style={{ display: "grid", gridTemplateRows: "auto 1fr", alignItems: "center", paddingTop: 80 }}>
        <div>
          <div className="label">NOVÁ DISCIPLÍNA</div>
          <div className="heading" style={{ fontSize: 64, marginTop: 12 }}>Designovat celek.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "stretch", gap: 2, marginTop: 48 }}>
          {ROLES.map((role, i) => (
            <div key={role.t} style={{ minHeight: 340, padding: "42px 38px", background: i === 1 ? "var(--teal)" : i === 2 ? "var(--lime)" : "var(--text-deep)", color: i === 2 ? "var(--text-deep)" : "var(--paper)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: ".16em", opacity: 0.65 }}>0{i + 1}</div>
              <div style={{ fontSize: 36, lineHeight: 1.08, fontWeight: 750, letterSpacing: "-.04em", marginTop: 74, maxWidth: "15ch" }}>{role.t}</div>
              <div style={{ height: 3, width: 54, background: i === 2 ? "var(--text-deep)" : "var(--lime)", marginTop: "auto", marginBottom: 20 }} />
              <div style={{ fontSize: 21, lineHeight: 1.35, fontWeight: 600, opacity: 0.8 }}>{role.s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Leadership({ step, reduced }: SceneProps) {
  const items = [
    { t: "ZMĚNA", s: "Lídr transformace" },
    { t: "PLATFORMA", s: "Technologický a datový stratég" },
    { t: "HODNOTA", s: "Orchestrátor hodnoty a adopce" },
  ];
  void step;
  return (
    <div className="scene">
      <SlideChrome kicker="FINÁLE / LEADERSHIP" page="74 / 75" caption="Gartner, AI Leader Personas, 05/08/2026" rail="BEZPEČNĚ · VE VELKÉM · S DOPADEM" />
      <div className="safe" style={{ display: "grid", gridTemplateColumns: ".82fr 1.18fr", gap: 100, alignItems: "center" }}>
        <div>
          <div className="label">AI NEPOTŘEBUJE</div>
          <HeroText size={72} reduced={reduced}>jednoho<br />superhrdinu.</HeroText>
          <div className="thought" style={{ fontSize: 27, marginTop: 34 }}>Potřebuje leadership<br /><span className="em">jako systém.</span></div>
        </div>
        <div style={{ position: "relative", height: 680 }}>
          <svg width="900" height="680" viewBox="0 0 900 680" aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
            <path d="M450 150 L230 520 H670 Z" fill="rgba(255,255,255,.2)" stroke="var(--line)" strokeWidth="2" />
            <circle cx="450" cy="150" r="118" fill="var(--text-deep)" />
            <circle cx="230" cy="520" r="118" fill="var(--teal)" />
            <circle cx="670" cy="520" r="118" fill="var(--lime)" />
            <circle cx="450" cy="390" r="46" fill="var(--bg)" stroke="var(--lime)" strokeWidth="3" />
            <text x="450" y="396" textAnchor="middle" fill="var(--text-deep)" fontSize="16" fontWeight="800" letterSpacing="2" fontFamily="var(--font)">AI</text>
          </svg>
          {items.map((item, i) => {
            const positions = [
              { left: 320, top: 112, color: "var(--paper)" },
              { left: 100, top: 482, color: "var(--paper)" },
              { left: 540, top: 482, color: "var(--text-deep)" },
            ];
            const pos = positions[i];
            return (
              <div key={item.t} style={{ position: "absolute", left: pos.left, top: pos.top, width: 260, textAlign: "center", color: pos.color }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: ".06em" }}>{item.t}</div>
                <div style={{ fontSize: 14, lineHeight: 1.3, fontWeight: 600, marginTop: 10, opacity: 0.72 }}>{item.s}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Closing slide — speakers (VideoEnd kept as the registry name). */
export { SpeakersEnd };

export function VideoEnd(props: SceneProps) {
  return <SpeakersEnd {...props} />;
}

