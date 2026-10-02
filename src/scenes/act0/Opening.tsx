import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";

export function Opening({ reduced }: SceneProps) {
  return (
    <div className="scene is-dark is-cinematic">
      <img
        data-hero-visual
        src={asset("portal.webp")}
        alt=""
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
      />
      <SlideChrome caption="Experience Summit 2026" rail="Lidé / Technologie / Větší možnosti" mark={false} />
      <div className="safe" style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 820, paddingBottom: 40 }}>
        <div
          data-hero-title
          data-live={reduced ? undefined : "sheen"}
          className={reduced ? "opening-title" : "opening-title is-sheen"}
        >
          <span className="opening-line">AI</span>
          <span className="opening-line">mění{"\u2004"}</span>
          <span className="opening-world">
            <span className="opening-line">svět</span>
            <span data-title-line className="opening-rule" aria-hidden="true" />
          </span>
        </div>
        <div data-hero-statement style={{ marginTop: 42, fontSize: 36, fontWeight: 600, lineHeight: 1.22, color: "rgba(215,230,231,.88)", maxWidth: "16ch" }}>
          Nová éra zkušenosti
          <br />
          začíná.
        </div>
      </div>
    </div>
  );
}
