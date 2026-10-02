import { scenes, findIndex } from "../deck/deck";
import type { FlatStep, SceneDef } from "../deck/types";
import { asset } from "./assets";

export type DeckMode = "play" | "chapters" | "sorter";

export const CHAPTERS = [
  { n: "00", t: "ÚVOD", s: "AI mění svět", sceneId: "opening", act: 0 },
  { n: "01", t: "KDO?", s: "Kdo experience používá", sceneId: "kdo", act: 1 },
  { n: "02", t: "CO?", s: "Správná zkušenost pro situaci", sceneId: "co", act: 2 },
  { n: "03", t: "PROČ VĚŘIT?", s: "Od pozornosti k důvěře", sceneId: "verit", act: 3 },
  { n: "04", t: "JAK?", s: "Od kanálů k orchestraci", sceneId: "jak", act: 4 },
] as const;

function kliky(n: number) {
  if (n === 1) return "1 klik";
  if (n >= 2 && n <= 4) return `${n} kliky`;
  return `${n} kliků`;
}

const GROUPS = scenes.reduce<{ name: string; items: SceneDef[] }[]>((groups, scene) => {
  const last = groups[groups.length - 1];
  if (!last || last.name !== scene.actName) groups.push({ name: scene.actName, items: [scene] });
  else last.items.push(scene);
  return groups;
}, []);

export function DeckNav({
  mode,
  onMode,
  index,
  total,
  current,
  onJump,
  onPrev,
  onNext,
  onFullscreen,
}: {
  mode: DeckMode;
  onMode: (mode: DeckMode) => void;
  index: number;
  total: number;
  current: FlatStep;
  onJump: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen: () => void;
}) {
  const jumpScene = (sceneId: string) => {
    onJump(findIndex(sceneId, 0));
    onMode("play");
  };

  return (
    <>
      <nav className="deck-dock" aria-label="Ovládání prezentace">
        <div className="deck-dock-modes">
          <button type="button" className={mode === "play" ? "is-on" : ""} onClick={() => onMode("play")}>
            Přehrát
          </button>
          <button type="button" className={mode === "chapters" ? "is-on" : ""} onClick={() => onMode("chapters")}>
            Kapitoly
          </button>
          <button type="button" className={mode === "sorter" ? "is-on" : ""} onClick={() => onMode("sorter")}>
            Kostičky
          </button>
        </div>
        <div className="deck-dock-progress">
          <button type="button" onClick={onPrev} aria-label="Předchozí">‹</button>
          <span>{index + 1} / {total}</span>
          <button type="button" onClick={onNext} aria-label="Další">›</button>
        </div>
        <div className="deck-dock-now">{current.actName} · {current.title}</div>
        <button type="button" className="deck-dock-full" onClick={onFullscreen}>
          Fullscreen
        </button>
      </nav>

      {mode === "chapters" && (
        <div className="deck-overlay">
          <div className="deck-overlay-head">
            <div className="deck-overlay-kicker">Navigace</div>
            <h2>Kapitoly</h2>
            <p>Klikni a skočíš na začátek kapitoly. Esc nebo Přehrát tě vrátí do prezentace.</p>
          </div>
          <div className="deck-chapters">
            {CHAPTERS.map((chapter) => (
              <button
                key={chapter.n}
                type="button"
                className={`deck-chapter${current.act === chapter.act ? " is-on" : ""}`}
                onClick={() => jumpScene(chapter.sceneId)}
              >
                <span className="deck-chapter-n">{chapter.n}</span>
                <span className="deck-chapter-t">{chapter.t}</span>
                <span className="deck-chapter-s">{chapter.s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "sorter" && (
        <div className="deck-overlay is-sorter">
          <div className="deck-overlay-head">
            <div className="deck-overlay-kicker">Řazení snímků</div>
            <h2>Kostičky</h2>
            <p>Každá kostička je jeden snímek. Kliknutím do něj skočíš a můžeš dál přehrávat.</p>
          </div>
          <div className="deck-sorter">
            {GROUPS.map((group) => (
              <section key={group.name} className="deck-sorter-group">
                <h3>{group.name}</h3>
                <div className="deck-sorter-grid">
                  {group.items.map((scene) => {
                    const sceneNo = scenes.findIndex((item) => item.id === scene.id) + 1;
                    const on = current.sceneId === scene.id;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        className={`deck-tile${on ? " is-on" : ""}`}
                        onClick={() => jumpScene(scene.id)}
                      >
                        <span className="deck-tile-stage">
                          <img
                            className="deck-tile-preview"
                            src={asset(`thumbs/${scene.id}.jpg`)}
                            alt=""
                            onError={(e) => { e.currentTarget.style.display = "none"; }}
                          />
                        </span>
                        <span className="deck-tile-meta">
                          <span className="deck-tile-meta-top">
                            <span className="deck-tile-n">{String(sceneNo).padStart(2, "0")}</span>
                            <span>{kliky(scene.steps.length)}</span>
                          </span>
                          <span className="deck-tile-title">{scene.steps[0]?.title}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
