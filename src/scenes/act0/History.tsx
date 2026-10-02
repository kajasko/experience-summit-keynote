import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { EASE, MOTION } from "../../engine/motion";
import { useAdjacentStep } from "../../engine/useAdjacentStep";
import { SlideChrome } from "../../components/SlideChrome";
import { RollingYear, rollSettle } from "../../components/RollingYear";
import { Cursor } from "../../components/Cursor";
import { asset } from "../../engine/assets";

const HELLO = "Hello! How can I help you today?";

const ERAS = [
  {
    year: "1945",
    rest: ["1964", "1973", "Dnes"],
    title: ["Data", "předáváme stroji."],
    sub: "Připravíme vstup a čekáme na výsledek.",
    caption: "Od děrovných karet",
    rail: "Data  Vstup  Výsledek",
    page: "02 / 75",
    kicker: "02 Evoluce",
    img: asset("punch.png"),
    imgStyle: { width: 1120, right: 72, bottom: 78 },
  },
  {
    year: "1964",
    rest: ["1973", "Dnes"],
    title: ["Mluvíme", "jazykem", "počítače."],
    sub: "Učíme se jeho příkazy, syntaxi a pravidla.",
    caption: "K příkazům",
    rail: "Příkazy  Syntaxe  Pravidla",
    page: "03 / 75",
    kicker: "03 Evoluce",
    img: asset("terminal.png"),
    imgStyle: { width: 880, right: 40, top: 200 },
  },
  {
    year: "1973",
    rest: ["Dnes"],
    title: ["Už", "nemusíme", "znát jazyk."],
    sub: "Grafické rozhraní převádí příkazy do objektů a akcí.",
    caption: "K lidem",
    rail: "Objekty  Akce  Intuice",
    page: "04 / 75",
    kicker: "04 Evoluce",
    img: asset("gui.png"),
    imgStyle: { width: 900, right: 20, top: 190 },
  },
  {
    year: "Dnes",
    rest: [],
    title: ["Říkáme, čeho", "chceme", "dosáhnout."],
    sub: "Rozhraní ustupuje záměru.",
    caption: "K záměru",
    rail: "Záměr  Jazyk  Výsledek",
    page: "06 / 75",
    kicker: "05 Evoluce",
    img: asset("intent-laptop.png"),
    imgStyle: { width: 980, right: 24, top: 198 },
  },
];

const YEARS = ERAS.map((e) => e.year);

function sceneXY(node: HTMLElement, scene: HTMLElement) {
  const a = node.getBoundingClientRect();
  const b = scene.getBoundingClientRect();
  const k = b.width ? 1920 / b.width : 1;
  return { x: (a.left - b.left) * k, y: (a.top - b.top) * k };
}

export function History({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const dirRef = useRef(1);
  const prevStep = useRef(step);
  const adjacent = useAdjacentStep(step);
  const isHello = step === 3;
  const isDnes = step === 4;
  const eraIndex = step >= 3 ? 3 : step;
  const era = ERAS[eraIndex];
  dirRef.current = step >= prevStep.current ? 1 : -1;

  useLayoutEffect(() => {
    const fromStep = prevStep.current;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline();
      const scene = root.current;
      const isEntry = fromStep === step && step === 0;
      const instant = reduced || (!adjacent && !isEntry);
      const railAt = Math.min(step, 3);
      const start = instant ? railAt : isEntry ? 0 : Math.min(fromStep, 3);
      gsap.set(q("[data-time-fill]"), { scaleX: start / 3 });
      gsap.set(q("[data-time-head]"), { x: start * 144 });
      if (instant) {
        gsap.set(q("[data-time-fill]"), { scaleX: railAt / 3 });
        gsap.set(q("[data-time-head]"), { x: railAt * 144 });
      } else {
        tl.to(q("[data-time-fill]"), { scaleX: railAt / 3, duration: isEntry ? 0.95 : 0.85, ease: "power3.out" }, isEntry ? 0.18 : 0);
        tl.to(q("[data-time-head]"), { x: railAt * 144, duration: isEntry ? 0.95 : 0.85, ease: "power3.out" }, isEntry ? 0.18 : 0);
      }

      gsap.set(q("[data-copy], [data-art]"), { autoAlpha: 0, x: 0, y: 0 });
      const typed = q("[data-hello-text]")[0] as HTMLElement | undefined;
      const caret = q("[data-hello] .caret")[0] as HTMLElement | undefined;
      const dnes = q("[data-dnes]")[0] as HTMLElement | undefined;
      const yearBlock = q("[data-year-block]")[0] as HTMLElement | undefined;
      const hello = q("[data-hello]")[0] as HTMLElement | undefined;
      const fromHello = fromStep === 3 && isDnes;
      const fromDnes = fromStep === 4 && isHello;
      const showDnes = isHello || isDnes;

      if (isEntry && !instant) {
        tl.fromTo(q(".chrome-kicker, .chrome-page"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: EASE.enter }, 0);
        tl.fromTo(q(".chrome-caption, .chrome-rail, .chrome-mark"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: EASE.enter }, 0.72);
        tl.fromTo(q(".history-track"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: EASE.enter }, 0.22);
        gsap.set(q("[data-rest]"), { autoAlpha: 0, x: 18 });
        tl.to(q("[data-rest]"), { autoAlpha: 1, x: 0, duration: 0.5, ease: EASE.enter }, 0.68);
      } else gsap.set(q("[data-rest]"), { autoAlpha: 1, x: 0 });

      if (yearBlock) {
        if (isHello) gsap.set(yearBlock, { autoAlpha: 0 });
        else if (!instant && (fromHello || fromDnes)) {
          gsap.set(yearBlock, { autoAlpha: fromHello ? 0 : 1 });
          tl.to(yearBlock, { autoAlpha: fromHello ? 1 : 0, duration: 0.9, ease: "power3.inOut" }, 0);
        } else gsap.set(yearBlock, { autoAlpha: 1 });
      }

      if (hello) {
        if (isHello) gsap.set(hello, { autoAlpha: 1 });
        else if (!instant && fromHello) {
          gsap.set(hello, { autoAlpha: 1 });
          tl.to(hello, { autoAlpha: 0, duration: MOTION.enter, ease: EASE.exit }, 0);
        } else gsap.set(hello, { autoAlpha: 0 });
      }

      if (dnes && scene) {
        const slot = q(isHello ? '[data-dnes-slot="hello"]' : '[data-dnes-slot="year"]')[0] as HTMLElement | undefined;
        gsap.set(dnes, { transformOrigin: "0 0" });
        if (!showDnes || !slot) {
          if (!instant && fromStep === 3) tl.to(dnes, { autoAlpha: 0, duration: MOTION.exit }, 0);
          else gsap.set(dnes, { autoAlpha: 0 });
        } else {
          const to = sceneXY(slot, scene);
          if (!instant && (fromHello || fromDnes)) {
            const fromSlot = q(fromHello ? '[data-dnes-slot="hello"]' : '[data-dnes-slot="year"]')[0] as HTMLElement;
            const from = sceneXY(fromSlot, scene);
            gsap.set(dnes, { autoAlpha: 1, x: from.x, y: from.y });
            tl.to(dnes, { x: to.x, y: to.y, duration: 0.9, ease: "power3.inOut" }, 0);
          } else if (!instant && isHello && fromStep === 2) {
            gsap.set(dnes, { autoAlpha: 0, x: to.x, y: to.y });
            tl.to(dnes, { autoAlpha: 1, duration: MOTION.enter, ease: EASE.enter }, 0);
          } else gsap.set(dnes, { autoAlpha: 1, x: to.x, y: to.y });
        }
      }

      if (typed) typed.textContent = isHello && instant ? HELLO : isHello ? "" : HELLO;
      caret?.classList.toggle("is-scripted", Boolean(isHello && !instant));
      if (caret && !(isHello && !instant)) gsap.set(caret, { opacity: 1 });

      if (isHello) {
        if (!instant && typed && caret) {
          const cursor = { n: 0 };
          const blink = 0.28;
          const afterDnes = MOTION.enter + 0.08;
          gsap.set(caret, { opacity: 0 });
          tl.set(caret, { opacity: 1 }, afterDnes);
          tl.set(caret, { opacity: 0 }, afterDnes + blink);
          tl.set(caret, { opacity: 1 }, afterDnes + blink * 2);
          tl.set(caret, { opacity: 0 }, afterDnes + blink * 3);
          tl.set(caret, { opacity: 1 }, afterDnes + blink * 4);
          tl.to(cursor, {
            n: HELLO.length,
            duration: 1.65,
            ease: "none",
            onUpdate: () => {
              typed.textContent = HELLO.slice(0, Math.round(cursor.n));
            },
            onComplete: () => caret.classList.remove("is-scripted"),
          }, afterDnes + blink * 4 + 0.08);
        }
        prevStep.current = step;
        return;
      }

      const copy = q(`[data-era="${eraIndex}"] [data-copy]`);
      const art = q(`[data-era="${eraIndex}"] [data-art]`);
      if (instant) gsap.set([...copy, ...art], { autoAlpha: 1, y: 0, x: 0 });
      else {
        const afterYear = step < 3
          ? rollSettle(era.year.length) + 0.08
          : fromHello
            ? 0.98
            : MOTION.reveal + 0.18;
        tl.fromTo(
          art,
          isEntry ? { autoAlpha: 0, y: 42, x: 24 } : { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, x: 0, duration: isEntry ? 0.64 : MOTION.enter, ease: EASE.enter },
          afterYear,
        );
        tl.fromTo(
          copy,
          { autoAlpha: 0, y: MOTION.y },
          { autoAlpha: 1, y: 0, duration: MOTION.enter, ease: EASE.enter },
          afterYear + (isEntry ? 0.28 : 0.22),
        );
      }
    }, root);
    prevStep.current = step;
    return () => ctx.revert();
  }, [step, reduced, adjacent, isHello, isDnes, eraIndex]);

  return (
    <div ref={root} className="scene">
      <SlideChrome
        kicker={isHello ? "05 Kurzor" : era.kicker}
        page={isHello ? "05 / 75" : era.page}
        caption={isHello ? "Od kurzoru k záměru" : era.caption}
        rail={isHello ? undefined : era.rail}
      />

      <div data-year-block className="abs" style={{ left: 80, top: 138, zIndex: 4, overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28, overflow: "visible" }}>
          <div style={{ display: step < 3 ? "block" : "none" }}>
            <RollingYear value={step < 3 ? era.year : "1973"} reduced={reduced} adjacent={!reduced && step < 3 && (adjacent || step === 0)} dir={dirRef.current} />
          </div>
          <div data-dnes-slot="year" className="year-hero display-gradient" style={{ visibility: "hidden", display: step >= 3 ? "inline-block" : "none" }}>
            Dnes
          </div>
          <div data-rest className="year-rest" style={{ paddingBottom: 18 }}>
            {era.rest.map((y) => (
              <span key={y} style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <span style={{ opacity: 0.45 }}>—</span>
                {y}
              </span>
            ))}
          </div>
        </div>
        <div className="history-track" aria-hidden="true">
          <span className="history-track-base" />
          <span data-time-fill className="history-track-fill" />
          {YEARS.map((y, i) => (
            <span key={y} className="history-track-stop" style={{ left: i * 144, background: i <= eraIndex ? "var(--lime-deep)" : "var(--line)" }} />
          ))}
          <span data-time-head className="history-track-head" />
        </div>
      </div>

      <div data-dnes data-hello-year className="year-hero display-gradient">
        Dnes
      </div>

      <div data-hello className="safe" style={{ display: "grid", placeItems: "center", opacity: 0, zIndex: 5 }}>
        <div style={{ textAlign: "center" }}>
          <div data-dnes-slot="hello" className="year-hero display-gradient" style={{ visibility: "hidden", display: "inline-block" }}>
            Dnes
          </div>
          <div
            style={{
              marginTop: 36,
              fontSize: 44,
              fontWeight: 650,
              letterSpacing: "-.03em",
              color: "var(--text-deep)",
              minHeight: "1.2em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              whiteSpace: "nowrap",
            }}
          >
            <span data-hello-text />
            <Cursor />
          </div>
        </div>
      </div>

      {ERAS.map((e, i) => (
        <div key={e.year} data-era={i} className="abs" style={{ inset: 0, pointerEvents: "none" }}>
          <div data-copy className="abs" style={{ left: 80, top: 400, right: 900, opacity: 0 }}>
            <div className="era-title">
              {e.title.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
            <div className="era-sub" style={{ marginTop: 28 }}>
              {e.sub}
            </div>
          </div>
          <div data-art className="abs" style={{ inset: 0, opacity: 0, transformOrigin: "72% 55%" }}>
            <img className="cutout abs" src={e.img} alt="" style={e.imgStyle} />
          </div>
        </div>
      ))}
    </div>
  );
}
