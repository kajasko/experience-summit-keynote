import type { SceneProps } from "../deck/types";
import { SlideChrome } from "../components/SlideChrome";
import { asset } from "../engine/assets";

const COPY: Record<string, { n: string; t: string; s: string; rail: string; long?: boolean }> = {
  kdo: {
    n: "01",
    t: "KDO?",
    s: "Od UX designu k designu pro lidi i AI",
    rail: "Lidé / AI / Experience",
  },
  co: {
    n: "02",
    t: "CO?",
    s: "Od jedné varianty k adaptaci podle situace",
    rail: "Situace / Adaptace / Výsledek",
  },
  verit: {
    n: "03",
    t: "PROČ\nVĚŘIT?",
    s: "Od pozornosti k důvěře",
    rail: "Důvěra / Důkaz / Kontrola",
    long: true,
  },
  jak: {
    n: "04",
    t: "JAK?",
    s: "Od kanálů k orchestraci",
    rail: "Kanály / Orchestrace / Výsledek",
  },
};

export function Chapter({ step: _step, reduced, sceneId }: SceneProps) {
  void _step;
  const c = COPY[sceneId];
  if (!c) return null;

  return (
    <div className="scene is-dark is-cinematic">
      <img
        data-hero-visual
        src={asset("portal.png")}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
      />
      <SlideChrome caption="Experience Summit 2026" rail={c.rail} mark={false} />
      <div className="safe chapter-hero">
        <div data-chapter-number className="chapter-hero-n">{c.n}</div>
        <div
          data-hero-text
          className={`chapter-hero-t${c.long ? " is-long" : ""}${reduced ? "" : " is-sheen"}`}
        >
          {c.t.split("\n").map((line) => (
            <span key={line} className="chapter-hero-row">{line}</span>
          ))}
        </div>
        <div className="chapter-hero-s">{c.s}</div>
        <div data-chapter-active="true" className="chapter-hero-line" />
      </div>
    </div>
  );
}
