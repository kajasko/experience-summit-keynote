import type { SceneProps } from "../../deck/types";
import { asset } from "../../engine/assets";
import "../../styles/closing.css";

/** Closing slide · deck dark (--dark / --dark-2), edge-to-edge background for the LED wall.
 *  The copy is a compact centred block that fits with margin at 16:9 and ultra-wide.
 *  Motion follows the deck: staggered fade-up (--ease), lime rule drawing in, lime dot. */
export function Closing({ reduced }: SceneProps) {
  return (
    <div className={`scene closing${reduced ? " is-reduced" : ""}`}>
      <div className="closing-bleed" aria-hidden="true" />
      <div className="closing-center">
        <img
          className="closing-logo cl-in"
          style={{ animationDelay: ".15s" }}
          src={asset("logos/experience-summit-white.png")}
          alt="Experience Summit by Clientology"
          draggable={false}
        />
        <h1 className="closing-title cl-in" style={{ animationDelay: ".45s" }}>
          Děkujeme<span className="closing-dot">.</span>
        </h1>
        <div className="closing-rule" />
        <div className="closing-sub cl-in" style={{ animationDelay: "1.15s" }}>Experience Design v době AI · 2026</div>
      </div>
    </div>
  );
}
