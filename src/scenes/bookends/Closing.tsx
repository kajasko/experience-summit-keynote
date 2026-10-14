import type { SceneProps } from "../../deck/types";
import "../../styles/closing.css";

const CUT = "M 48.8789 42.8305 C 52.1072 38.4252 54.015 32.9915 54.015 27.1113 C 54.015 21.2311 52.1075 15.7968 48.8789 11.3921 L 39.9826 20.2883 C 41.0844 22.3168 41.7101 24.6406 41.7101 27.1113 C 41.7101 29.5814 41.0842 31.9058 39.9826 33.9343 L 48.8789 42.8305 Z";
const RING = "M 27.3911 0.4875 C 12.6872 0.4875 0.7673 12.4074 0.7673 27.1113 C 0.7673 41.8152 12.6872 53.7352 27.3911 53.7352 C 33.2713 53.7352 38.7056 51.8274 43.1104 48.5991 L 34.2141 39.7028 C 32.1856 40.8043 29.8618 41.4299 27.3911 41.4299 C 19.4833 41.4299 13.0725 35.0191 13.0725 27.1113 C 13.0725 19.2032 19.4833 12.7924 27.3911 12.7924 C 29.8615 12.7924 32.1856 13.4183 34.2141 14.5198 L 43.1104 5.6233 C 38.705 2.3952 33.2713 0.4875 27.3911 0.4875 Z";

const WORD = "Děkujeme";
// Deterministic star field so every render (and screenshot) is identical.
const STARS = Array.from({ length: 90 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 3, d: r(4) * 6, t: 4 + r(5) * 6 };
});

/** Closing slide · dark, edge-to-edge for the LED wall. Background bleeds far past the
 *  1920×1080 stage so cover-scaling on any aspect ratio never shows an edge; the copy
 *  stays inside the central band that survives ultra-wide cropping. */
export function Closing({ reduced }: SceneProps) {
  return (
    <div className={`scene closing${reduced ? " is-reduced" : ""}`}>
      <div className="closing-bleed" aria-hidden="true">
        <div className="closing-aurora a1" />
        <div className="closing-aurora a2" />
        <div className="closing-aurora a3" />
        <div className="closing-grid" />
        {STARS.map((s, i) => (
          <i key={i} className="closing-star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s`, animationDuration: `${s.t}s` }} />
        ))}
      </div>
      <div className="closing-rings" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <span key={i} style={{ animationDelay: `${i * 1.6}s` }} />)}
      </div>
      <div className="closing-center">
        <svg className="closing-logo" viewBox="0 0 54.015 54.015" aria-hidden="true">
          <path className="closing-ring" d={RING} />
          <path className="closing-cut" d={CUT} />
        </svg>
        <h1 className="closing-title" aria-label={`${WORD}.`}>
          {[...WORD].map((ch, i) => (
            <span key={i} style={{ animationDelay: `${0.9 + i * 0.07}s` }}>{ch}</span>
          ))}
          <span className="closing-dot" style={{ animationDelay: `${0.9 + WORD.length * 0.07 + 0.15}s` }}>.</span>
        </h1>
        <div className="closing-rule" />
        <div className="closing-sub">Experience Summit 2026 · Experience Design v době AI</div>
      </div>
    </div>
  );
}
