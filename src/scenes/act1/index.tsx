import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { EASE, MOTION as T } from "../../engine/motion";
import { HeroText } from "../../components/HeroText";
import { SlideChrome } from "../../components/SlideChrome";
import { GlassStats } from "../../components/GlassStats";
import { asset } from "../../engine/assets";

const CHROME = {
  trend1: [
    { kicker: "KDO / Noví aktéři", page: "20 / 75", caption: "Kdo experience používá a tvoří" },
    { kicker: "KDO / Noví aktéři", page: "20 / 75", caption: "Kdo experience používá a tvoří" },
    { kicker: "KDO / Noví aktéři", page: "20 / 75", caption: "Kdo experience používá a tvoří" },
  ],
  uxax: [
    { kicker: "KDO / Dva uživatelé", page: "22 / 75", caption: "Jedna služba" },
    { kicker: "KDO / Dva uživatelé", page: "22 / 75", caption: "Jedna služba" },
    { kicker: "KDO / Dva uživatelé", page: "22 / 75", caption: "Jedna služba" },
  ],
  understanding: [
    { kicker: "KDO / Cesta k výsledku", page: "26 / 75", caption: "Potřeba vede k výsledku" },
    { kicker: "KDO / Potřeba", page: "25 / 75", caption: "Jedny přivádějí. Druhé drží." },
  ],
  modes: [
    { kicker: "KDO / Módy hodnoty", page: "27 / 75", caption: "Pochopit" },
    { kicker: "KDO / Módy hodnoty", page: "27 / 75", caption: "Tvořit" },
    { kicker: "KDO / Módy hodnoty", page: "27 / 75", caption: "Rozhodnout" },
    { kicker: "KDO / Módy hodnoty", page: "27 / 75", caption: "Konat" },
    { kicker: "KDO / Módy hodnoty", page: "27 / 75", caption: "Čtyři módy vedle sebe" },
  ],
  examples: [{ kicker: "KDO / Need-first design", page: "29 / 75", caption: "Začněte potřebou." }],
  prd: [
    { kicker: "KDO / Design contract", page: "30 / 75", caption: "Než začneme navrhovat" },
  ],
} as const;

const chromeFor = <K extends keyof typeof CHROME>(scene: K, step: number) =>
  CHROME[scene][Math.min(step, CHROME[scene].length - 1)];

const ACTOR_LINES = [
  ["AI", "mění,", "kdo", "experience"],
  ["vytváří,", "kdo", "pomáhá", "s", "výběrem"],
  ["a", "kdo", "vykonává."],
];

const ACTOR_STATS = [
  { id: "91", value: 91, unit: "%", cap: "používání AI při designu" },
  { id: "50", value: 50, unit: "%", cap: "používá AI-powered search" },
  { id: "13", value: 1, unit: "ze 3", unitClass: "is-phrase", cap: "interakcí s aplikacemi" },
] as const;

export function Trend1({ step, reduced }: SceneProps) {
  return (
    <GlassStats
      step={step}
      reduced={reduced}
      chrome={chromeFor("trend1", step)}
      title={ACTOR_LINES}
      stats={[ACTOR_STATS[0], ACTOR_STATS[1], ACTOR_STATS[2]]}
    />
  );
}

const UXAX_WORDS = ["Jedna", "služba.", "Dva", "uživatelé."];

export function UxAx({ step, reduced }: SceneProps) {
  const chrome = chromeFor("uxax", step);
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);

  useLayoutEffect(() => {
    const last = prev.current;
    prev.current = step;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-uxax-word]", root.current);
      const left = root.current?.querySelector<HTMLElement>('[data-uxax-card="left"]');
      const right = root.current?.querySelector<HTMLElement>('[data-uxax-card="right"]');
      if (!left || !right) return;

      const hidden = { y: 64, autoAlpha: 0, filter: "blur(12px)" };
      const shown = { y: 0, autoAlpha: 1, filter: "blur(0px)" };

      const settle = (local: number) => {
        gsap.set(words, { autoAlpha: 1, y: 0 });
        gsap.set([left, right], local >= 1 ? shown : hidden);
      };

      if (reduced) {
        settle(step);
        return;
      }

      if (step === 0) {
        if (last === 1 || last === 2) {
          gsap.set(words, { autoAlpha: 1, y: 0 });
          gsap.to([left, right], { ...hidden, duration: 0.36, ease: EASE.exit });
          return;
        }
        gsap.set(words, { autoAlpha: 0, y: 16 });
        gsap.set([left, right], hidden);
        gsap.to(words, { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.1, ease: EASE.enter });
        return;
      }

      if (last === 0) {
        gsap.set(words, { autoAlpha: 1, y: 0 });
        gsap.set([left, right], hidden);
        gsap.to([left, right], { ...shown, duration: 1.12, ease: "power1.inOut" });
        return;
      }

      settle(1);
    }, root);
    return () => ctx.revert();
  }, [step, reduced]);

  return (
    <div ref={root} className="scene is-uxax">
      <SlideChrome {...chrome} caption={undefined} captionDot={false} mark={false} />
      <div className="safe uxax-layout">
        <div className="uxax-title">
          {UXAX_WORDS.map((word, i) => (
            <span key={word} data-uxax-word className="actors-word">
              {i > 0 ? "\u00a0" : ""}
              {word}
            </span>
          ))}
        </div>
        <div className="uxax-row">
          <div data-uxax-card="left" className="uxax-card has-art">
            <div className="uxax-copy">
              <div className="uxax-kicker">člověk</div>
              <div className="uxax-mega">UX</div>
            </div>
            <img data-art className="uxax-art is-human" src={asset("ux-ax.png")} alt="" />
            <div className="uxax-pills">
              {["UI", "UX", "konverzace"].map((x) => (
                <span key={x} className="uxax-pill">{x}</span>
              ))}
            </div>
          </div>
          <div data-uxax-card="right" className="uxax-card has-art">
            <div className="uxax-copy">
              <div className="uxax-kicker">AGENT</div>
              <div className="uxax-mega">AX</div>
            </div>
            <img data-art className="uxax-art is-agent" src={asset("ux-ax.png")} alt="" />
            <div className="uxax-pills">
              {["data", "api", "MCP"].map((x) => (
                <span key={x} className="uxax-pill">{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NEED_FLOW = [
  { id: "need", label: "Need" },
  { id: "context", label: "Context" },
  { id: "intent", label: "Intent" },
  { id: "action", label: "Action" },
  { id: "outcome", label: "Outcome" },
] as const;

function NeedIcon({ id }: { id: (typeof NEED_FLOW)[number]["id"] }) {
  const common = {
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2.1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
      {id === "need" && (
        <>
          <circle cx="21" cy="14" r="6.5" {...common} />
          <path d="M9 33c2.2-7.2 6.8-10.5 12-10.5S30.8 25.8 33 33" {...common} />
        </>
      )}
      {id === "context" && (
        <>
          <path d="M14 7h10l7 7v20a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3Z" {...common} />
          <path d="M24 7v8h8M16 22h10M16 28h7" {...common} />
        </>
      )}
      {id === "intent" && (
        <>
          <path d="M21 6a9 9 0 0 0-5.4 16.2V27h10.8v-4.8A9 9 0 0 0 21 6Z" {...common} />
          <path d="M17.5 31.5h7M19 35h4" {...common} />
        </>
      )}
      {id === "action" && (
        <path d="M13 9 31 21.5l-8.4 1.7 3.6 9.2-4.2 1.6L18.4 25 13 31Z" {...common} />
      )}
      {id === "outcome" && (
        <path d="M11 30V21M21 30V12M31 30V18M8 30h26" {...common} />
      )}
    </svg>
  );
}

const NEED_PANELS = [
  { id: "buyer", who: "Buyer / Chooser", verb: "Přivádějí", img: "need-buyer.png", shot: "is-buyer" },
  { id: "user", who: "User Needs", verb: "Drží", img: "need-user.png", shot: "is-user" },
] as const;

const NEED_RECT = { left: 64, top: 96, width: 1792, height: 888, borderRadius: 44 } as const;

const WORD_CIRCLE = { fontSize: 13, letterSpacing: "0.16em", color: "#005860", y: 0 } as const;
const WORD_RECT = { fontSize: 58, letterSpacing: "-0.055em", color: "#03383d", y: 0 } as const;

function stageBox(node: HTMLElement, scene: HTMLElement) {
  const frame = scene.getBoundingClientRect();
  const scale = 1920 / Math.max(frame.width, 1);
  const rect = node.getBoundingClientRect();
  return {
    left: (rect.left - frame.left) * scale,
    top: (rect.top - frame.top) * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  };
}

function UnderstandingPair({
  step,
  chrome,
  reduced,
}: {
  step: number;
  chrome: { kicker: string; page: string; caption: string };
  reduced: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const open = step === 1;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const last = prev.current;
    const eyebrow = el.querySelector<HTMLElement>("[data-understand-eyebrow]");
    const titleA = el.querySelector<HTMLElement>("[data-understand-title-a]");
    const titleB = el.querySelector<HTMLElement>("[data-understand-title-b]");
    const insight = el.querySelector<HTMLElement>("[data-understand-insight]");
    const person = el.querySelector<HTMLElement>("[data-understand-person]");
    const cardHead = el.querySelector<HTMLElement>("[data-understand-card-head]");
    const clovek = el.querySelector<HTMLElement>("[data-clovek-core]");
    const copy = el.querySelector<HTMLElement>("[data-understand-copy]");
    const ghost = el.querySelector<HTMLElement>("[data-need-ghost]");
    const shell = el.querySelector<HTMLElement>("[data-need-shell]");
    const word = el.querySelector<HTMLElement>("[data-need-word]");
    const hint = el.querySelector<HTMLElement>("[data-need-hint]");
    const context = el.querySelector<HTMLElement>("[data-need-context]");
    const story = el.querySelector<HTMLElement>("[data-need-story]");
    const panels = gsap.utils.toArray<HTMLElement>("[data-need-panel]", el);
    const verbs = gsap.utils.toArray<HTMLElement>("[data-need-verb]", el);
    const whos = gsap.utils.toArray<HTMLElement>("[data-need-who]", el);
    if (!shell || !ghost || !word) return;

    const circle = () => {
      const box = stageBox(ghost, el);
      return { ...box, borderRadius: box.width / 2 };
    };
    const putShell = (toRect: boolean, tween?: boolean, at = 0, tl?: gsap.core.Timeline) => {
      const pose = toRect ? { ...NEED_RECT } : circle();
      const vars = {
        ...pose,
        borderWidth: toRect ? 0 : 3,
        backgroundColor: toRect ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.88)",
        boxShadow: toRect
          ? "0 28px 80px rgba(3,56,61,0.14), inset 0 1px 0 rgba(255,255,255,0.8)"
          : "0 18px 44px rgba(3,56,61,0.08)",
      };
      if (tween && tl) tl.to(shell, { ...vars, duration: T.cameraVia, ease: EASE.move }, at);
      else gsap.set(shell, vars);
    };
    const putWord = (toRect: boolean, tween?: boolean, at = 0, tl?: gsap.core.Timeline) => {
      const vars = toRect ? WORD_RECT : WORD_CIRCLE;
      if (tween && tl) tl.to(word, { ...vars, duration: T.cameraVia, ease: EASE.move }, at);
      else gsap.set(word, vars);
    };
    const hideStory = (visible: boolean) => {
      gsap.set(story, { autoAlpha: visible ? 1 : 0 });
      gsap.set(panels, {
        autoAlpha: visible ? 1 : 0,
        clipPath: visible ? "inset(0% 0% 0% 0% round 28px)" : "inset(100% 0% 0% 0% round 28px)",
      });
      gsap.set(verbs, { autoAlpha: visible ? 1 : 0, y: 0 });
      gsap.set(whos, { autoAlpha: visible ? 1 : 0, y: 0 });
    };
    const settle = (local: number) => {
      const pair = local === 1;
      gsap.set([eyebrow, titleA, titleB, insight, cardHead, person, copy, clovek], {
        autoAlpha: pair ? 0 : 1, y: 0, scale: 1,
      });
      gsap.set(shell, { autoAlpha: 1, scale: 1, x: 0, y: 0, transformOrigin: "50% 50%" });
      putShell(pair);
      putWord(pair);
      gsap.set(hint, { autoAlpha: pair ? 0 : 1, y: 0 });
      gsap.set(context, { autoAlpha: pair ? 0 : 1, scale: 1 });
      hideStory(pair);
    };

    if (reduced) {
      prev.current = step;
      settle(step);
      return;
    }

    if (step === 0 && last !== 1) {
      gsap.set([eyebrow, titleA, titleB, insight], { autoAlpha: 0, y: 18 });
      gsap.set(cardHead, { autoAlpha: 0, y: -10 });
      gsap.set(person, { autoAlpha: 1, scale: 1 });
      gsap.set([copy, clovek], { autoAlpha: 1, y: 0 });
      putShell(false);
      putWord(false);
      gsap.set(person, { autoAlpha: 0, scale: 0.9 });
      gsap.set(shell, { autoAlpha: 0, scale: 0.72, transformOrigin: "50% 50%" });
      gsap.set(hint, { autoAlpha: 0, y: 8 });
      gsap.set(context, { autoAlpha: 0, scale: 0.45 });
      hideStory(false);
      const tl = gsap.timeline();
      tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.enter }, 0.08);
      tl.to(titleA, { autoAlpha: 1, y: 0, duration: 0.44, ease: EASE.enter }, 0.22);
      tl.to(titleB, { autoAlpha: 1, y: 0, duration: 0.48, ease: EASE.enter }, 0.5);
      tl.to(cardHead, { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE.enter }, 0.38);
      tl.to(person, { autoAlpha: 1, scale: 1, duration: 0.52, ease: "back.out(1.35)" }, 0.62);
      tl.to(shell, { autoAlpha: 1, scale: 1, duration: 0.48, ease: "back.out(1.5)" }, 1.02);
      tl.to(hint, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE.enter }, 1.12);
      tl.to(context, { autoAlpha: 1, scale: 1, duration: 0.46, ease: "back.out(1.9)" }, 1.42);
      tl.to(context, { scale: 1.07, duration: 0.17, yoyo: true, repeat: 1, ease: EASE.move }, 1.88);
      tl.to(insight, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 1.86);
      prev.current = step;
      return () => { tl.kill(); };
    }

    const forward = step === 1;
    const morph = last !== null && last !== step;
    if (!morph) {
      prev.current = step;
      settle(step);
      return;
    }

    const tl = gsap.timeline();
    if (forward) {
      putShell(false);
      putWord(false);
      gsap.set(shell, { autoAlpha: 1, scale: 1, transformOrigin: "50% 50%" });
      hideStory(false);
      tl.to([copy, eyebrow, titleA, titleB, insight], { autoAlpha: 0, y: -16, duration: 0.32, ease: EASE.exit }, 0);
      tl.to([cardHead, person], { autoAlpha: 0, duration: 0.34, ease: EASE.exit }, 0.04);
      tl.to(clovek, { autoAlpha: 0, duration: 0.4, ease: EASE.exit }, 0.08);
      tl.to(hint, { autoAlpha: 0, y: -8, duration: 0.22, ease: EASE.exit }, 0);
      tl.to(context, { autoAlpha: 0, scale: 0.2, duration: 0.34, ease: EASE.exit }, 0.02);
      putShell(true, true, 0.06, tl);
      putWord(true, true, 0.06, tl);
      panels.forEach((panel, i) => {
        tl.fromTo(panel, {
          autoAlpha: 1,
          clipPath: "inset(100% 0% 0% 0% round 28px)",
        }, {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          duration: 0.62,
          ease: EASE.move,
        }, 0.78 + i * 0.16);
      });
      tl.set(story, { autoAlpha: 1 }, 0.76);
      whos.forEach((who, i) => {
        tl.fromTo(who, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 1.02 + i * 0.14);
      });
      verbs.forEach((verb, i) => {
        tl.fromTo(verb, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE.enter }, 1.18 + i * 0.12);
      });
    } else {
      gsap.set([copy, clovek, eyebrow, titleA, titleB, insight, cardHead, person], { autoAlpha: 0, y: 0, scale: 1 });
      putShell(true);
      putWord(true);
      gsap.set(shell, { autoAlpha: 1, scale: 1 });
      tl.to(verbs, { autoAlpha: 0, y: 12, duration: 0.2, ease: EASE.exit, stagger: 0.04 }, 0);
      tl.to(whos, { autoAlpha: 0, duration: 0.18, ease: EASE.exit }, 0);
      tl.to(panels, { clipPath: "inset(100% 0% 0% 0% round 28px)", duration: 0.32, ease: EASE.move, stagger: 0.05 }, 0.04);
      tl.set(story, { autoAlpha: 0 });
      putShell(false, true, 0.22, tl);
      putWord(false, true, 0.22, tl);
      tl.to(clovek, { autoAlpha: 1, duration: 0.36, ease: EASE.enter }, 0.42);
      tl.to([cardHead, person], { autoAlpha: 1, scale: 1, duration: 0.34, ease: EASE.enter }, 0.48);
      tl.to(hint, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE.enter }, 0.7);
      tl.to(context, { autoAlpha: 1, scale: 1, duration: 0.36, ease: "back.out(1.4)" }, 0.74);
      tl.to([copy, eyebrow, titleA, titleB], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.52);
      tl.to(insight, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.enter }, 0.68);
    }
    prev.current = step;
    return () => { tl.kill(); };
  }, [step, reduced, open]);

  return (
    <div ref={root} className={`scene is-understand${open ? " is-need-open" : ""}`}>
      <SlideChrome {...chrome} captionDot />
      <div className="safe understand-layout">
        <div data-understand-copy className="understand-copy">
          <div data-understand-eyebrow className="understand-eyebrow">Nejdřív porozumění</div>
          <div className="understand-title">
            <span data-understand-title-a>Kvalita AI nezačíná u modelu.</span>
            <strong data-understand-title-b>Začíná u člověka.</strong>
          </div>
          <div data-understand-insight className="understand-insight">
            Potřeba říká <strong>co</strong>.<br />
            Kontext říká <strong>co právě teď</strong>.
          </div>
        </div>
        <div data-clovek-core="" className="uxax-card understand-card">
          <div data-understand-card-head className="understand-card-head">
            <span>Člověk</span>
            <em>AI potřebuje pochopit</em>
          </div>
          <div className="understand-rings">
            <div data-understand-person className="understand-person">
              <span className="understand-layer-label">Člověk</span>
              <div data-need-ghost className="understand-ring is-need is-ghost" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <div data-need-shell className="need-shell">
        <div data-need-word className="need-word">Potřeba</div>
        <div data-need-hint className="need-hint">Co chce vyřešit</div>
        <div data-need-context className="need-context">
          <span>Kontext</span>
          <small>Co se děje právě teď</small>
        </div>
        <div data-need-story className="need-story">
          {NEED_PANELS.map((panel) => (
            <div key={panel.id} data-need-panel className="need-panel">
              <img data-art src={asset(panel.img)} alt="" className={panel.shot} />
              <div className="need-panel-copy">
                <div data-need-who className="need-who">{panel.who}</div>
                <div data-need-verb className="need-verb">{panel.verb}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Understanding({ step, reduced }: SceneProps) {
  const chrome = chromeFor("understanding", step);
  if (step === 0) {
    return (
    <div className="scene is-need-path">
      <SlideChrome {...chrome} captionDot mark={false} />
      <svg className="need-path-wave" viewBox="0 0 1920 240" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 118 C 420 188 780 52 1180 128 C 1480 180 1720 150 1920 96 L 1920 240 L 0 240 Z" fill="rgba(255,255,255,.42)" />
      </svg>
      <div className="need-path-copy">
        <div data-hero-title className="need-path-title">
          Potřeba vede k výsledku.
        </div>
        <div className="need-path-flow">
          {NEED_FLOW.map((stepItem, i) => (
            <div key={stepItem.id} className="need-path-item" data-need-step={i}>
              <div className="need-path-node">
                <NeedIcon id={stepItem.id} />
              </div>
              <div className="need-path-label">{stepItem.label}</div>
              {i < NEED_FLOW.length - 1 ? <span className="need-path-arrow" aria-hidden="true">→</span> : null}
            </div>
          ))}
        </div>
      </div>
      <div data-need-split className="need-persona">
        <div className="need-persona-card">
          <div className="need-persona-head">
            <span className="need-persona-mark">C</span>
            <span>Personas</span>
          </div>
          <div className="need-persona-hero">
            <img data-art src={`${asset("persona-need.png")}?v=2`} alt="" />
            <div className="need-persona-tags">
              <span className="is-lilac">Persona</span>
              <span className="is-teal">✦ Strategic</span>
              <span className="is-mint">Active Customer</span>
            </div>
          </div>
          <p className="need-persona-quote">„Život je nejkrásnější tehdy, když nespěcháš.“</p>
          <div className="need-persona-list">
            <div /><div /><div />
          </div>
        </div>
      </div>
    </div>
  );
  }
  return <UnderstandingPair step={1} chrome={chrome} reduced={reduced} />;
}

export function BuyerUser({ step, reduced }: SceneProps) {
  return (
    <div className="scene">
      <div className="safe" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", height: "100%" }}>
        <div style={{ opacity: step === 1 ? 0.25 : 1 }}>
          <div className="label">Buyer / chooser</div>
          <HeroText size={72} reduced={reduced}>přivádějí</HeroText>
        </div>
        <div style={{ opacity: step === 0 ? 0.2 : 1 }}>
          <div className="label">User needs</div>
          <HeroText size={72} reduced={reduced}>udržují</HeroText>
        </div>
      </div>
    </div>
  );
}

export function Needs({ step, reduced }: SceneProps) {
  const copy =
    step === 0 ? (
      <>
        AI není zkratka
        <br />
        přes rozbitý proces.
      </>
    ) : step === 1 ? (
      <>
        Potřeba + kontext
        <br />
        jsou základ.
      </>
    ) : (
      <>
        Taxonomie potřeb
        <br />
        umožňuje adaptaci.
      </>
    );
  return (
    <div className="scene">
      <div className="safe" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <HeroText size={72} reduced={reduced}>
          {copy}
        </HeroText>
      </div>
    </div>
  );
}

const MODES = [
  { name: "Pochopit", help: "Pomáhá nám", desc: "Najít vzorce a význam." },
  { name: "Tvořit", help: "Pomáhá nám", desc: "Navrhnout nový obsah." },
  { name: "Rozhodnout se", help: "Pomáhá nám", desc: "Vybrat další krok." },
  { name: "To vyřešit za nás", help: "Dokáže", desc: "Provést akci za člověka." },
] as const;

const MODE_BASE = [
  { left: 0, top: 150, width: 410, height: 340 },
  { left: 450, top: 150, width: 410, height: 340 },
  { left: 900, top: 150, width: 410, height: 340 },
  { left: 1350, top: 150, width: 410, height: 340 },
] as const;

const ORLOJ = [
  { left: 620, top: 68, scale: 1.22, blur: 0, opacity: 1, z: 5, rotateY: 0 },
  { left: 1240, top: 168, scale: 0.68, blur: 9, opacity: 0.48, z: 3, rotateY: -32 },
  { left: 690, top: 236, scale: 0.46, blur: 16, opacity: 0.22, z: 1, rotateY: 0 },
  { left: 70, top: 168, scale: 0.68, blur: 9, opacity: 0.48, z: 2, rotateY: 32 },
] as const;

const orlojSlot = (index: number, turn: number) => ORLOJ[(index - turn + 4) % 4];

const poseOrloj = (cards: HTMLElement[], turn: number, duration = 0) => {
  cards.forEach((card, i) => {
    const p = orlojSlot(i, turn);
    const vars = {
      left: p.left,
      top: p.top,
      width: 410,
      height: 340,
      x: 0,
      y: 0,
      scale: p.scale,
      autoAlpha: p.opacity,
      filter: `blur(${p.blur}px)`,
      rotationY: p.rotateY,
      zIndex: p.z,
      transformOrigin: "center center",
      transformPerspective: 1400,
    };
    if (!duration) gsap.set(card, vars);
    else gsap.to(card, { ...vars, duration, ease: EASE.move, overwrite: "auto" });
  });
};

export function Modes({ step, reduced }: SceneProps) {
  const chrome = chromeFor("modes", step);
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const aligned = step >= 4;
  const turn = Math.min(step, 3);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const last = prev.current;
    const cards = gsap.utils.toArray<HTMLElement>("[data-mode-card]", el);
    const titleA = el.querySelector<HTMLElement>("[data-modes-title-a]");
    const titlePunch = el.querySelector<HTMLElement>("[data-modes-title-a] strong");
    const track = el.querySelector<HTMLElement>("[data-modes-track]");
    const clearWheel = () => {
      cards.forEach((card) => {
        gsap.set(card, { filter: "blur(0px)", rotationY: 0, zIndex: 2, scale: 1, autoAlpha: 1, x: 0, y: 0 });
      });
    };
    const settle = (local: number) => {
      const row = local >= 4;
      gsap.set(titleA, { autoAlpha: 1, y: 0 });
      gsap.set(titlePunch, { autoAlpha: 1, y: 0 });
      gsap.set(track, { autoAlpha: row ? 1 : 0, scaleX: row ? 1 : 0 });
      cards.forEach((card) => {
        gsap.set(card.querySelector("[data-mode-num]"), { autoAlpha: 1, y: 0 });
        gsap.set(card.querySelector("[data-mode-name]"), { autoAlpha: 1, y: 0 });
        gsap.set(card.querySelector("[data-mode-desc]"), { autoAlpha: 1, y: 0 });
      });
      if (row) {
        clearWheel();
        cards.forEach((card, i) => gsap.set(card, { ...MODE_BASE[i] }));
      } else {
        poseOrloj(cards, Math.min(local, 3));
      }
    };

    if (reduced) {
      prev.current = step;
      settle(step);
      return;
    }

    if (last === null && step !== 0) {
      prev.current = step;
      settle(step);
      return;
    }

    if (step === 0 && last === null) {
      gsap.set(titleA, { autoAlpha: 0, y: 16 });
      gsap.set(titlePunch, { autoAlpha: 0, y: 12 });
      gsap.set(track, { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" });
      cards.forEach((card) => {
        gsap.set(card.querySelector("[data-mode-num]"), { autoAlpha: 1, y: 0 });
        gsap.set(card.querySelector("[data-mode-name]"), { autoAlpha: 1, y: 0 });
        gsap.set(card.querySelector("[data-mode-desc]"), { autoAlpha: 1, y: 0 });
      });
      poseOrloj(cards, 0);
      cards.forEach((card, i) => {
        gsap.set(card, { autoAlpha: 0, y: 28 });
        gsap.set(card, { zIndex: orlojSlot(i, 0).z });
      });
      const tl = gsap.timeline();
      tl.to(titleA, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0);
      tl.to(titlePunch, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.2);
      cards.forEach((card, i) => {
        tl.to(card, {
          autoAlpha: orlojSlot(i, 0).opacity,
          y: 0,
          duration: 0.55,
          ease: EASE.enter,
        }, 0.38 + i * 0.08);
      });
      prev.current = step;
      return () => { tl.kill(); };
    }

    if (step === 0 && last === 0) {
      settle(0);
      return;
    }

    const fromRow = last !== null && last >= 4;
    const toRow = step >= 4;
    const tl = gsap.timeline();

    if (!toRow && !fromRow) {
      gsap.set([titleA, titlePunch], { autoAlpha: 1, y: 0 });
      poseOrloj(cards, turn, 0.82);
      gsap.set(track, { autoAlpha: 0 });
      prev.current = step;
      return;
    }

    if (toRow) {
      cards.forEach((card, i) => {
        const at = 0.08 + i * 0.08;
        tl.to(card, {
          ...MODE_BASE[i],
          scale: 1,
          autoAlpha: 1,
          filter: "blur(0px)",
          rotationY: 0,
          zIndex: 2,
          duration: 0.7,
          ease: EASE.move,
        }, at);
      });
      tl.to(track, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: EASE.move, transformOrigin: "left center" }, 0.45);
    } else {
      tl.to(track, { autoAlpha: 0, scaleX: 0.45, duration: 0.28, ease: EASE.move }, 0);
      cards.forEach((card, i) => {
        const p = orlojSlot(i, turn);
        tl.to(card, {
          left: p.left,
          top: p.top,
          width: 410,
          height: 340,
          scale: p.scale,
          autoAlpha: p.opacity,
          filter: `blur(${p.blur}px)`,
          rotationY: p.rotateY,
          zIndex: p.z,
          duration: 0.66,
          ease: EASE.move,
        }, 0.08 + (3 - i) * 0.07);
      });
    }
    prev.current = step;
    return () => { tl.kill(); };
  }, [step, reduced, aligned, turn]);

  return (
    <div ref={root} className={`scene is-modes${aligned ? " is-aligned" : " is-orloj"}`}>
      <SlideChrome {...chrome} captionDot />
      <div className="safe modes-layout">
        <div className="modes-title-stack">
          <div data-modes-title-a className="modes-title">
            4 use-casy, kde AI<br /><strong>skutečně přináší hodnotu</strong>
          </div>
        </div>
        <div className="modes-stage">
          {MODES.map((mode, i) => (
            <article
              key={mode.name}
              data-mode-card={i}
              className="mode-card"
              style={MODE_BASE[i]}
            >
              <div className="mode-card-top">
                <span data-mode-num>0{i + 1}</span>
              </div>
              <div className="mode-card-copy">
                <div data-mode-help className="mode-help">{mode.help}</div>
                <h3 data-mode-name>{mode.name}</h3>
                <p data-mode-desc>{mode.desc}</p>
              </div>
            </article>
          ))}
          <div data-modes-track className="modes-track">
            <span>Od porozumění</span><i>→</i><span>k provedené akci</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const CASES = [
  { id: "cleo", brand: "cleo", line: "Osobní AI kouč pro vaše finance.", img: "case-cleo.png" },
  { id: "octopus", brand: "octopus", line: "Chytřejší energie pro skutečný život.", img: "case-octopus.png" },
  { id: "lemonade", brand: "Lemonade", line: "Pojištění, které řeší za vás.", img: "case-lemonade.png" },
] as const;

export function Examples({ step, reduced }: SceneProps) {
  const chrome = chromeFor("examples", step);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-examples-title]");
    const sub = el.querySelector<HTMLElement>("[data-examples-sub]");
    const panels = gsap.utils.toArray<HTMLElement>("[data-example-panel]", el);
    const beds = gsap.utils.toArray<HTMLElement>("[data-example-bed]", el);
    if (reduced) {
      gsap.set([title, sub, panels], { autoAlpha: 1, y: 0, x: 0 });
      gsap.set(beds, { clipPath: "inset(0 0% 0 0)" });
      return;
    }
    gsap.set(title, { autoAlpha: 0, y: 18 });
    gsap.set(sub, { autoAlpha: 0, y: 12 });
    gsap.set(panels, { autoAlpha: 1 });
    gsap.set(beds, { clipPath: "inset(0 100% 0 0)" });
    const tl = gsap.timeline();
    tl.to(title, { autoAlpha: 1, y: 0, duration: 0.44, ease: EASE.enter }, 0.06);
    tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.22);
    beds.forEach((bed, i) => {
      tl.to(bed, { clipPath: "inset(0 0% 0 0)", duration: 0.72, ease: EASE.move }, 0.34 + i * 0.14);
    });
    return () => {
      tl.kill();
      gsap.set([title, sub, panels], { autoAlpha: 1, y: 0 });
      gsap.set(beds, { clipPath: "inset(0 0% 0 0)" });
    };
  }, [reduced, step]);

  return (
    <div ref={root} className="scene is-examples">
      <SlideChrome {...chrome} captionDot />
      <div className="examples-copy">
        <div data-examples-title className="examples-title">
          Začněte
          <br />
          <strong>potřebou.</strong>
        </div>
        <div data-examples-sub className="examples-sub">A vznikají úplně jiné produkty.</div>
      </div>
      <div className="examples-stage">
        {CASES.map((c) => (
          <article key={c.id} data-example-panel className={`example-panel is-${c.id}`}>
            <div data-example-bed className="example-bed">
              {c.img ? <img data-art src={`${asset(c.img)}?v=5`} alt="" /> : null}
              <div className="example-ghost" aria-hidden="true">
                <span /><span /><span />
              </div>
            </div>
            <div className="example-meta">
              <div className="example-brand">{c.brand}</div>
              <p>{c.line}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function Prd({ reduced }: SceneProps) {
  return <PrdIntro chrome={chromeFor("prd", 0)} reduced={reduced} />;
}

const PRD_BEATS = [
  "Sdílené porozumění.",
  "Než vznikne řešení.",
  "Jedna strana.",
] as const;

function PrdIntro({
  chrome,
  reduced,
}: {
  chrome: { kicker: string; page: string; caption: string };
  reduced: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-prd-title]");
    const sub = el.querySelector<HTMLElement>("[data-prd-sub]");
    const beats = gsap.utils.toArray<HTMLElement>("[data-prd-beat]", el);
    const art = el.querySelector<HTMLElement>("[data-prd-art]");
    if (!title || !sub || !art) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([title, sub, beats, art], { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0 });
        return;
      }

      gsap.set(title, { autoAlpha: 0, y: 18 });
      gsap.set(sub, { autoAlpha: 0, y: 14 });
      gsap.set(beats, { autoAlpha: 0, y: 16 });
      gsap.set(art, { autoAlpha: 0, x: 64, y: 12, scale: 0.94, rotate: 6 });

      const tl = gsap.timeline();
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.48, ease: EASE.enter }, 0);
      tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.22);
      tl.to(beats, { autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.16, ease: EASE.enter }, 0.48);
      tl.to(art, { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 0.72, ease: EASE.move }, 0.92);
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="scene is-prd">
      <SlideChrome {...chrome} captionDot />
      <div className="prd-intro">
        <div className="prd-copy">
          <div data-prd-title className="prd-title">
            Vibe coding bez PRDu
            <br />
            je na prd
          </div>
          <div data-prd-sub className="prd-sub">
            Než začneme navrhovat, musíme vědět, co řešíme.
          </div>
          <ol className="prd-beats">
            {PRD_BEATS.map((beat, i) => (
              <li key={beat} data-prd-beat>
                <span>0{i + 1}</span>
                {beat}
              </li>
            ))}
          </ol>
        </div>
        <div data-prd-art className="prd-art">
          <img data-art src={asset("prd-notebook.png")} alt="" />
        </div>
      </div>
    </div>
  );
}
