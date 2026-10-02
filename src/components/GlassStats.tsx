import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { EASE } from "../engine/motion";
import { SlideChrome } from "./SlideChrome";

export type GlassStatDef = {
  id: string;
  value: number;
  unit: string;
  unitClass?: string;
  cap: string;
  extra?: ReactNode;
};

export type GlassStatsChrome = {
  kicker: string;
  page: string;
  caption: string;
};

export function GlassStats({
  step,
  reduced,
  chrome,
  title,
  stats,
  sceneClass = "is-actors",
  layout = "three",
}: {
  step: number;
  reduced: boolean;
  chrome: GlassStatsChrome;
  title: string[][];
  stats: [GlassStatDef, GlassStatDef, GlassStatDef];
  sceneClass?: string;
  layout?: "two" | "three";
}) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const [sa, sb, sc] = stats;

  useLayoutEffect(() => {
    const last = prev.current;
    prev.current = step;
    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-actor-word]", root.current);
      const a = root.current?.querySelector<HTMLElement>(`[data-glass="${sa.id}"]`);
      const b = root.current?.querySelector<HTMLElement>(`[data-glass="${sb.id}"]`);
      const c = root.current?.querySelector<HTMLElement>(`[data-glass="${sc.id}"]`);
      const nA = root.current?.querySelector<HTMLElement>(`[data-count="${sa.id}"]`);
      const nB = root.current?.querySelector<HTMLElement>(`[data-count="${sb.id}"]`);
      const nC = root.current?.querySelector<HTMLElement>(`[data-count="${sc.id}"]`);
      const unitA = root.current?.querySelector<HTMLElement>(`[data-glass-unit="${sa.id}"]`);
      const unitB = root.current?.querySelector<HTMLElement>(`[data-glass-unit="${sb.id}"]`);
      const unitC = root.current?.querySelector<HTMLElement>(`[data-glass-unit="${sc.id}"]`);
      const capA = root.current?.querySelector<HTMLElement>(`[data-glass-cap="${sa.id}"]`);
      const capB = root.current?.querySelector<HTMLElement>(`[data-glass-cap="${sb.id}"]`);
      const capC = root.current?.querySelector<HTMLElement>(`[data-glass-cap="${sc.id}"]`);
      if (!a || !b || !c || !nA || !nB || !nC || !unitA || !unitB || !unitC || !capA || !capB || !capC) return;

      const y = { yPercent: -50 as const };
      const featured = { left: "50%", xPercent: -50, ...y, scale: 1, width: 640, autoAlpha: 1 };
      const seed = { left: "50%", xPercent: -50, ...y, scale: 0.42, width: 640, autoAlpha: 0 };
      const dockA1 = layout === "two"
        ? { left: "5%", xPercent: 0, ...y, scale: 1, width: 680, autoAlpha: 1 }
        : { left: "0%", xPercent: 0, ...y, scale: 1, width: 500, autoAlpha: 1 };
      const featB1 = layout === "two"
        ? { left: "95%", xPercent: -100, ...y, scale: 1, width: 680, autoAlpha: 1 }
        : { left: "54%", xPercent: -42, ...y, scale: 1, width: 640, autoAlpha: 1 };
      const dockA2 = { left: "0%", xPercent: 0, ...y, scale: 1, width: 548, autoAlpha: 1 };
      const dockB2 = { left: "50%", xPercent: -50, ...y, scale: 1, width: 548, autoAlpha: 1 };
      const featC2 = { left: "100%", xPercent: -100, ...y, scale: 1, width: 548, autoAlpha: 1 };

      const countTo = (el: HTMLElement, to: number, duration: number) => {
        const obj = { n: 0 };
        el.textContent = "0";
        return gsap.to(obj, {
          n: to,
          duration,
          ease: "power2.out",
          snap: { n: 1 },
          onUpdate() {
            el.textContent = String(Math.round(obj.n));
          },
        });
      };

      const finals = () => {
        nA.textContent = String(sa.value);
        nB.textContent = String(sb.value);
        nC.textContent = String(sc.value);
      };

      const settle = (local: number) => {
        gsap.set(words, { autoAlpha: 1, y: 0 });
        finals();
        if (local === 0) {
          gsap.set(a, featured);
          gsap.set([b, c], seed);
          gsap.set([unitA, capA], { autoAlpha: 1 });
          gsap.set([unitB, capB, unitC, capC], { autoAlpha: 0 });
          return;
        }
        if (local === 1) {
          gsap.set(a, dockA1);
          gsap.set(b, featB1);
          gsap.set(c, seed);
          gsap.set([unitA, capA, unitB, capB], { autoAlpha: 1 });
          gsap.set([unitC, capC], { autoAlpha: 0 });
          return;
        }
        gsap.set(a, dockA2);
        gsap.set(b, dockB2);
        gsap.set(c, featC2);
        gsap.set([unitA, capA, unitB, capB, unitC, capC], { autoAlpha: 1 });
      };

      if (reduced) {
        settle(step);
        return;
      }

      if (step === 0) {
        if (last === 1 || last === 2) {
          settle(0);
          return;
        }
        gsap.set(words, { autoAlpha: 0, y: 16 });
        gsap.set(a, seed);
        gsap.set([b, c], seed);
        gsap.set([unitA, capA, unitB, capB, unitC, capC], { autoAlpha: 0 });
        nA.textContent = "0";
        nB.textContent = "0";
        nC.textContent = "0";
        const tl = gsap.timeline();
        tl.to(words, { autoAlpha: 1, y: 0, duration: 0.36, stagger: 0.08, ease: EASE.enter }, 0);
        tl.to(a, { ...featured, duration: 0.58, ease: "power3.out" }, 1.05);
        tl.add(countTo(nA, sa.value, 0.72), 1.45);
        tl.to([unitA, capA], { autoAlpha: 1, duration: 0.4, ease: EASE.enter }, 1.55);
        return;
      }

      if (step === 1) {
        if (last !== 0) {
          settle(1);
          return;
        }
        gsap.set(words, { autoAlpha: 1, y: 0 });
        gsap.set(a, featured);
        gsap.set(b, seed);
        gsap.set(c, seed);
        nA.textContent = String(sa.value);
        nB.textContent = "0";
        nC.textContent = "0";
        gsap.set([unitA, capA], { autoAlpha: 1 });
        gsap.set([unitB, capB, unitC, capC], { autoAlpha: 0 });
        const tl = gsap.timeline();
        tl.to(a, { ...dockA1, duration: 0.72, ease: EASE.move }, 0);
        tl.fromTo(b, seed, { ...featB1, duration: 0.62, ease: "power3.out" }, 0.22);
        tl.add(countTo(nB, sb.value, 0.64), 0.68);
        tl.to([unitB, capB], { autoAlpha: 1, duration: 0.4, ease: EASE.enter }, 0.78);
        return;
      }

      if (last !== 1) {
        settle(2);
        return;
      }

      gsap.set(words, { autoAlpha: 1, y: 0 });
      gsap.set(a, dockA1);
      gsap.set(b, featB1);
      gsap.set(c, seed);
      nA.textContent = String(sa.value);
      nB.textContent = String(sb.value);
      nC.textContent = "0";
      gsap.set([unitA, capA, unitB, capB], { autoAlpha: 1 });
      gsap.set([unitC, capC], { autoAlpha: 0 });
      const tl = gsap.timeline();
      tl.to(a, { ...dockA2, duration: 0.72, ease: EASE.move }, 0);
      tl.to(b, { ...dockB2, duration: 0.72, ease: EASE.move }, 0);
      tl.fromTo(c, seed, { ...featC2, duration: 0.62, ease: "power3.out" }, 0.22);
      tl.add(countTo(nC, sc.value, 0.48), 0.68);
      tl.to([unitC, capC], { autoAlpha: 1, duration: 0.4, ease: EASE.enter }, 0.78);
    }, root);
    return () => ctx.revert();
  }, [step, reduced, layout, sa.id, sb.id, sc.id, sa.value, sb.value, sc.value]);

  return (
    <div ref={root} className={`scene ${sceneClass}`}>
      <SlideChrome {...chrome} captionDot />
      <div className="safe actors-layout">
        <div className="actors-title">
          {title.map((line) => (
            <div key={line.join(" ")} className="actors-line">
              {line.map((word, i) => (
                <span key={`${word}-${i}`} data-actor-word className="actors-word">
                  {i > 0 ? "\u00a0" : ""}
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="actors-blocks">
          {stats.map((stat) => (
            <div key={stat.id} data-glass={stat.id} className="glass-stat">
              <div className="glass-stat-num">
                <span data-count={stat.id}>{stat.value}</span>
                <span data-glass-unit={stat.id} className={`glass-stat-unit${stat.unitClass ? ` ${stat.unitClass}` : ""}`}>
                  {stat.unit}
                </span>
              </div>
              <div data-glass-cap={stat.id} className="glass-stat-cap">
                {stat.cap}
                {stat.extra}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
