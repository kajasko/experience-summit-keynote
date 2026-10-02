import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../deck/types";
import { EASE } from "../engine/motion";
import { SlideChrome } from "../components/SlideChrome";
import { FourQuestionCards, FourQuestionsIntro, QUESTION_OPEN } from "./FourQuestions";

const MAPS: Record<string, {
  from: number;
  to: number;
  kicker: string;
  page: string;
  caption: string;
  eyebrow: string;
  sub: string;
}> = {
  "co-map": {
    from: 0, to: 1,
    kicker: "CO? · ČTYŘI OTÁZKY",
    page: "31 / 75",
    caption: "Od KDO k CO",
    eyebrow: "Posun 02 / 04",
    sub: "Teď CO? Od personalizace k adaptaci.",
  },
  "verit-map": {
    from: 1, to: 2,
    kicker: "PROČ VĚŘIT? · ČTYŘI OTÁZKY",
    page: "42 / 75",
    caption: "Od CO k PROČ VĚŘIT",
    eyebrow: "Posun 03 / 04",
    sub: "Teď PROČ VĚŘIT? Od pozornosti k důvěře.",
  },
  "jak-map": {
    from: 2, to: 3,
    kicker: "JAK? · ČTYŘI OTÁZKY",
    page: "57 / 75",
    caption: "Od PROČ VĚŘIT k JAK",
    eyebrow: "Posun 04 / 04",
    sub: "Teď JAK? Od kanálů k orchestraci.",
  },
};

export function CoMap({ reduced, sceneId }: SceneProps) {
  const cfg = MAPS[sceneId];
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !cfg) return;
    const copy = el.querySelector<HTMLElement>("[data-challenge-title-a]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-question-card]", el);
    const prev = cfg.from;
    const next = cfg.to;

    const mark = (active: number) => {
      cards.forEach((card, i) => {
        const on = i === active;
        card.classList.toggle("is-on", on);
        card.querySelector(".glass-chip")?.classList.toggle("is-on", on);
        const line = card.querySelector<HTMLElement>(".challenge-card-line");
        if (line) gsap.set(line, { scaleX: on ? 1 : 0.16, transformOrigin: "left center" });
      });
    };

    const settle = () => {
      gsap.set([copy, ...cards], { autoAlpha: 1, y: 0, x: 0, scale: 1 });
      cards.forEach((card, i) => gsap.set(card, { ...QUESTION_OPEN[i], autoAlpha: i === next ? 1 : 0.42 }));
      mark(next);
    };

    if (reduced) {
      settle();
      return;
    }

    cards.forEach((card, i) => gsap.set(card, { ...QUESTION_OPEN[i], autoAlpha: 0 }));
    gsap.set(copy, { autoAlpha: 0, y: 14 });
    mark(prev);

    const prevLine = cards[prev]?.querySelector<HTMLElement>(".challenge-card-line");
    const nextLine = cards[next]?.querySelector<HTMLElement>(".challenge-card-line");
    const tl = gsap.timeline();
    tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0);
    cards.forEach((card, i) => {
      tl.to(card, { autoAlpha: i === prev ? 1 : 0.42, duration: 0.36, ease: EASE.enter }, 0.12 + i * 0.04);
    });
    tl.add(() => mark(next), 0.78);
    tl.to(cards[prev], { autoAlpha: 0.42, duration: 0.4, ease: EASE.move }, 0.78);
    tl.to(cards[next], { autoAlpha: 1, duration: 0.4, ease: EASE.move }, 0.78);
    if (prevLine) tl.to(prevLine, { scaleX: 0.16, duration: 0.32, ease: EASE.move }, 0.78);
    if (nextLine) tl.fromTo(nextLine, { scaleX: 0.16 }, { scaleX: 1, duration: 0.4, ease: EASE.move }, 0.82);

    return () => {
      tl.kill();
      settle();
    };
  }, [reduced, cfg]);

  if (!cfg) return null;

  return (
    <div ref={root} className="scene is-challenges challenge-pair is-co-map">
      <SlideChrome kicker={cfg.kicker} page={cfg.page} caption={cfg.caption} captionDot />
      <div className="challenge-stage">
        <FourQuestionsIntro eyebrow={cfg.eyebrow} sub={cfg.sub} />
        <FourQuestionCards
          positions={QUESTION_OPEN}
          active={cfg.from}
          coreTo={cfg.to}
          revealed
        />
      </div>
    </div>
  );
}
