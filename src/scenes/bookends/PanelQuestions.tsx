import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";

/** Výzva k otázkám na řečníky pro panelovou diskusi (program: 12:30, experiencesummit.cz). */
export function PanelQuestions({ step = 0, reduced }: SceneProps) {
  return (
    <div className={`scene is-panelq${reduced ? " is-reduced" : ""}`}>
      <SlideChrome kicker="01 Panelová diskuze" page="01 / 01" caption="Dnes 12:30 · Panelová diskuse" captionDot />
      <div className="pq-orb" aria-hidden="true">
        <div className="pq-bubble"><span>?</span></div>
        <div className="pq-bubble is-small"><span>?</span></div>
      </div>
      <div className="pq-copy">
        <div className="pq-kicker pq-in" style={{ ["--d" as string]: "0.05s" }}>Panelová diskuze</div>
        <h2 className="pq-title pq-in" style={{ ["--d" as string]: "0.15s" }}>Máte otázku<br />na řečníky?</h2>
        <p className="pq-sub pq-in" style={{ ["--d" as string]: "0.35s" }}>Pošlete ji během dne, nejlepší zazní v panelové diskuzi.</p>
        <div className={`pq-when pq-step${step >= 1 ? " is-on" : ""}`}>
          <div className="pq-when-time">12:30</div>
          <div className="pq-when-txt">
            <span className="pq-when-label">Dnes po přednáškách</span>
            <span className="pq-when-title">Společná panelová diskuse řečníků a Clientology</span>
          </div>
        </div>
      </div>
    </div>
  );
}
