import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { EASE } from "../../engine/motion";
import { SlideChrome } from "../../components/SlideChrome";

const LINES = [
  "Poprvé se přizpůsobuje\nstroj nám.",
  "A lidé si na to\nrychle zvykají.",
  "AI už je součástí\nkaždodenního života.",
];

const LIVE = { fontSize: 68, color: "#03383d", autoAlpha: 1, height: "auto" as const, y: 0 };
const WAIT = { fontSize: 40, color: "#627779", autoAlpha: 0.42, height: "auto" as const, y: 0 };
const HIDE = { fontSize: 40, color: "#627779", autoAlpha: 0, height: 0, marginTop: 0, y: 8 };
const PAGE = ["07 / 75", "08 / 75", "09 / 75"] as const;

function face(local: number) {
  if (local <= 0) {
    return [
      { ...LIVE, marginTop: 0 },
      { ...WAIT, marginTop: 22 },
      HIDE,
    ] as const;
  }
  if (local === 1) {
    return [
      { ...WAIT, marginTop: 0 },
      { ...LIVE, marginTop: 18 },
      { ...WAIT, marginTop: 22 },
    ] as const;
  }
  return [
    { ...WAIT, marginTop: 0 },
    { ...WAIT, marginTop: 18 },
    { ...LIVE, marginTop: 22 },
  ] as const;
}

export function Intent({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const local = Math.min(Math.max(step, 0), 2);

  useLayoutEffect(() => {
    const last = prev.current;
    prev.current = local;
    const ctx = gsap.context(() => {
      const lines = [0, 1, 2].map((i) => root.current?.querySelector<HTMLElement>(`[data-intent-line="${i}"]`)).filter(Boolean) as HTMLElement[];
      if (lines.length < 3) return;
      const next = face(local);
      const morph = !reduced && last !== null && Math.abs(last - local) === 1;
      const intro = !reduced && last === null && local === 0;

      if (!morph && !intro) {
        lines.forEach((line, i) => gsap.set(line, next[i]));
        return;
      }

      if (intro) {
        gsap.set(lines[0], { ...LIVE, autoAlpha: 0, y: 16, marginTop: 0 });
        gsap.set(lines[1], { ...WAIT, autoAlpha: 0, y: 10, marginTop: 22 });
        gsap.set(lines[2], HIDE);
        const tl = gsap.timeline();
        tl.to(lines[0], { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.enter }, 0);
        tl.to(lines[1], { autoAlpha: 0.42, y: 0, duration: 0.5, ease: EASE.enter }, 0.18);
        return;
      }

      const from = face(last ?? 0);
      lines.forEach((line, i) => gsap.set(line, from[i]));
      const tl = gsap.timeline();
      const forward = local > (last ?? 0);
      lines.forEach((line, i) => {
        const delay = forward ? i * 0.08 : (2 - i) * 0.08;
        tl.to(line, { ...next[i], duration: 0.72, ease: "power3.inOut" }, delay);
      });
    }, root);
    return () => ctx.revert();
  }, [local, reduced]);

  return (
    <div ref={root} className="scene">
      <SlideChrome kicker="07 Záměr" page={PAGE[local]} caption="Od zvědavosti k praxi" captionDot />
      <div className="safe karaoke">
        {LINES.map((line, i) => (
          <div key={line} data-intent-line={i} className="karaoke-line">
            {line.split("\n").map((row) => (
              <span key={row} className="karaoke-row">{row}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
