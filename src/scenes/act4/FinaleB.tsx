import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { EASE } from "../../engine/motion";

/**
 * Closing for slide 66 (bxcxex) — the default. `?ending=a` shows the previous version.
 * Step 0: three frosted orbs (BX, CX, EX) on one orbit.
 * Step 1: they converge and merge into ONE EXPERIENCE; a single lime shockwave,
 *         the four chapter questions settle around it, the closing line appears.
 */
export const ENDING_A =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("ending") === "a";

const CENTER = { x: 960, y: 640 };
const CORE = { x: 960, y: 500 };
const ORB = 280;
const ORBS = [
  { k: "EX", t: "Employee experience", angle: -90, tone: "is-lime" },
  { k: "BX", t: "Brand experience", angle: 150, tone: "is-deep" },
  { k: "CX", t: "Customer experience", angle: 30, tone: "is-teal" },
].map((orb) => {
  const r = (orb.angle * Math.PI) / 180;
  return { ...orb, cx: CENTER.x + Math.cos(r) * 205, cy: CENTER.y + Math.sin(r) * 205 };
});
const CHIPS = [
  { t: "KDO?", x: 470, y: 330 },
  { t: "CO?", x: 1450, y: 330 },
  { t: "PROČ VĚŘIT?", x: 440, y: 660 },
  { t: "JAK?", x: 1480, y: 660 },
];
const LINE = "To, co firma propojí uvnitř, dokáže doručit ven.".split(" ");

export function BxCxExFinale({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const beat = step >= 1 ? 1 : 0;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const title = q("[data-fb-title]");
    const orbs = q("[data-fb-orb]");
    const orbit = el.querySelector<SVGCircleElement>("[data-fb-orbit]");
    const core = q("[data-fb-core]");
    const one = q("[data-fb-one]");
    const exp = q("[data-fb-exp]");
    const wave = q("[data-fb-wave]");
    const chips = q("[data-fb-chip]");
    const words = q("[data-fb-word]");
    const glow = q("[data-fb-glow]");
    const len = orbit ? 2 * Math.PI * 205 : 0;
    const toCore = (i: number) => ({ x: CORE.x - ORBS[i].cx, y: CORE.y - ORBS[i].cy });

    const apply = (to: number) => {
      gsap.set(title, { autoAlpha: to === 0 ? 1 : 0, y: 0 });
      orbs.forEach((orb, i) => gsap.set(orb, to === 0
        ? { autoAlpha: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }
        : { autoAlpha: 0, ...toCore(i), scale: 0.3 }));
      if (orbit) gsap.set(orbit, { strokeDasharray: len, strokeDashoffset: 0, autoAlpha: to === 0 ? 1 : 0 });
      gsap.set(core, { autoAlpha: to === 1 ? 1 : 0, scale: 1 });
      gsap.set([one, exp], { autoAlpha: 1, y: 0, letterSpacing: "" });
      gsap.set(wave, { autoAlpha: 0, scale: 1 });
      gsap.set(glow, { autoAlpha: to === 1 ? 1 : 0.45, scale: 1 });
      gsap.set(chips, { autoAlpha: to === 1 ? 1 : 0, x: 0, y: 0, scale: 1 });
      gsap.set(words, { autoAlpha: to === 1 ? 1 : 0, y: 0, filter: "blur(0px)" });
    };

    const from = prev.current;
    prev.current = beat;
    if (reduced || from === beat) {
      apply(beat);
      return;
    }
    const tl = gsap.timeline();
    if (from === null && beat === 0) {
      apply(0);
      gsap.set(title, { autoAlpha: 0, y: 24 });
      gsap.set(orbs, { autoAlpha: 0, scale: 0.6, filter: "blur(16px)" });
      if (orbit) gsap.set(orbit, { strokeDashoffset: len });
      gsap.set(glow, { autoAlpha: 0 });
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.6, ease: EASE.enter }, 0.05);
      tl.to(glow, { autoAlpha: 0.45, duration: 1.2, ease: EASE.enter }, 0);
      if (orbit) tl.to(orbit, { strokeDashoffset: 0, duration: 1.3, ease: EASE.move }, 0.25);
      tl.to(orbs, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.16, ease: "back.out(1.4)" }, 0.45);
    } else if (from !== null && from === 0 && beat === 1) {
      apply(0);
      gsap.set(core, { autoAlpha: 0, scale: 0.55 });
      gsap.set(one, { letterSpacing: "0.4em" });
      gsap.set(exp, { autoAlpha: 0, y: 18, letterSpacing: "0.9em" });
      gsap.set(wave, { autoAlpha: 0, scale: 0.4 });
      gsap.set(chips, { autoAlpha: 0, scale: 0.8 });
      chips.forEach((chip, i) => gsap.set(chip, { x: (CHIPS[i].x - CORE.x) * 0.5, y: (CHIPS[i].y - CORE.y) * 0.6 }));
      gsap.set(words, { autoAlpha: 0, y: 16, filter: "blur(8px)" });
      tl.to(title, { autoAlpha: 0, y: -24, duration: 0.42, ease: EASE.exit }, 0);
      if (orbit) tl.to(orbit, { strokeDashoffset: -len, autoAlpha: 0, duration: 0.9, ease: EASE.move }, 0);
      // gather: the three orbs swirl inwards and fuse
      orbs.forEach((orb, i) => {
        tl.to(orb, { ...toCore(i), scale: 0.62, duration: 0.95, ease: "power3.inOut" }, 0.1 + i * 0.05);
      });
      tl.to(orbs, { autoAlpha: 0, scale: 0.3, duration: 0.3, ease: EASE.exit }, 1.05);
      tl.to(glow, { autoAlpha: 1, scale: 1.08, duration: 0.6, ease: EASE.enter }, 0.95);
      tl.to(glow, { scale: 1, duration: 0.8, ease: EASE.move }, 1.55);
      tl.to(wave, { autoAlpha: 0.9, scale: 1, duration: 0.12, ease: "none" }, 1.08);
      tl.to(wave, { autoAlpha: 0, scale: 5.2, duration: 1.4, ease: "power2.out" }, 1.2);
      tl.to(core, { autoAlpha: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" }, 1.08);
      tl.to(one, { letterSpacing: "-0.06em", duration: 1.1, ease: "power3.out" }, 1.08);
      tl.to(exp, { autoAlpha: 1, y: 0, letterSpacing: "0.32em", duration: 0.9, ease: "power3.out" }, 1.45);
      tl.to(chips, { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 1.7);
      tl.to(words, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, stagger: 0.09, ease: EASE.enter }, 2.3);
    } else if (from === 1 && beat === 0) {
      apply(1);
      tl.to([core, chips, words], { autoAlpha: 0, duration: 0.3, ease: EASE.exit }, 0);
      tl.add(() => apply(0), 0.32);
      tl.fromTo(orbs, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.06, ease: EASE.enter }, 0.34);
      tl.fromTo(title, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.34);
    } else {
      apply(beat);
    }
    return () => {
      tl.kill();
    };
  }, [beat, reduced]);

  return (
    <div ref={root} className={`scene fb-stage${beat ? " is-one" : ""}`}>
      <SlideChrome
        kicker="JAK? / EXPERIENCE SYSTÉM"
        page="66 / 67"
        caption={beat ? "Tři disciplíny. Jedna zkušenost." : "Propojení zkušeností"}
        rail="BX × CX × EX"
      />
      {/* anchor for the default bx0 motion cue; the variant runs its own timeline */}
      <span data-bx-intro className="fb-cue-anchor" aria-hidden="true" />
      <div data-fb-glow className="fb-glow" aria-hidden="true" />
      <div data-fb-title className="fb-title heading">
        Spojení <span className="fb-mark">BX, CX a EX</span>
        <br />
        je dnes důležitější než dříve.
      </div>
      <svg className="fb-svg" viewBox="0 0 1920 1080" aria-hidden="true">
        <circle data-fb-orbit cx={CENTER.x} cy={CENTER.y} r="205" fill="none" stroke="var(--lime)" strokeWidth="3" strokeOpacity="0.9" />
      </svg>
      {ORBS.map((orb) => (
        <div
          key={orb.k}
          data-fb-orb={orb.k}
          className={`fb-orb ${orb.tone}`}
          style={{ left: orb.cx - ORB / 2, top: orb.cy - ORB / 2, width: ORB, height: ORB }}
        >
          <span className="fb-orb-k">{orb.k}</span>
          <span className="fb-orb-t">{orb.t}</span>
        </div>
      ))}
      <div data-fb-wave className="fb-wave" style={{ left: CORE.x - 160, top: CORE.y - 160 }} aria-hidden="true" />
      <div data-fb-core className="fb-core" style={{ left: CORE.x - 460, top: CORE.y - 190 }}>
        <div className="label fb-core-cap">Zákazník vidí</div>
        <div data-fb-one className="fb-one">ONE</div>
        <div data-fb-exp className="fb-exp">EXPERIENCE</div>
      </div>
      {CHIPS.map((chip) => (
        <div key={chip.t} data-fb-chip className="fb-chip" style={{ left: chip.x, top: chip.y }}>
          <span>{chip.t}</span>
        </div>
      ))}
      <div className="fb-line">
        {LINE.map((word, i) => (
          <span key={`${word}-${i}`} data-fb-word className="fb-word">{word}</span>
        ))}
      </div>
    </div>
  );
}
