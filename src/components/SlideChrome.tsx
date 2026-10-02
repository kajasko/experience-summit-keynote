import { slideLabel } from "../deck/deck";
import { useSlideStep } from "../engine/slideContext";

export function SlideChrome({
  kicker,
  page,
  caption,
  rail,
  mark = true,
  captionDot = false,
}: {
  kicker?: string;
  page?: string;
  caption?: string;
  rail?: string;
  mark?: boolean;
  captionDot?: boolean;
}) {
  // Page numbers come from the deck's slide data, never from the hardcoded prop
  // (the prop only says "this layout shows a page counter").
  const current = useSlideStep();
  const pageText = page && current ? slideLabel(current) : page;
  const kickerText = kicker && current
    ? kicker.replace(/^\d{2}(?=\s)/, String(current.slide).padStart(2, "0"))
    : kicker;
  return (
    <>
      {kickerText ? <div className="chrome-kicker">{kickerText}</div> : null}
      {pageText ? <div className="chrome-page">{pageText}</div> : null}
      {caption ? (
        <div className={`chrome-caption${captionDot ? " is-dot" : ""}`}>
          <span className="chrome-line" />
          <span>{caption}</span>
        </div>
      ) : null}
      {rail ? <div className="chrome-rail">{rail}</div> : null}
      {mark ? (
        <div className="chrome-mark" aria-hidden="true">
          <svg viewBox="0 0 54.015 54.015" aria-hidden="true">
            <path className="cut" fillRule="nonzero" d="M 48.8789 42.8305 C 52.1072 38.4252 54.015 32.9915 54.015 27.1113 C 54.015 21.2311 52.1075 15.7968 48.8789 11.3921 L 39.9826 20.2883 C 41.0844 22.3168 41.7101 24.6406 41.7101 27.1113 C 41.7101 29.5814 41.0842 31.9058 39.9826 33.9343 L 48.8789 42.8305 Z" />
            <path className="ring" fillRule="nonzero" d="M 27.3911 0.4875 C 12.6872 0.4875 0.7673 12.4074 0.7673 27.1113 C 0.7673 41.8152 12.6872 53.7352 27.3911 53.7352 C 33.2713 53.7352 38.7056 51.8274 43.1104 48.5991 L 34.2141 39.7028 C 32.1856 40.8043 29.8618 41.4299 27.3911 41.4299 C 19.4833 41.4299 13.0725 35.0191 13.0725 27.1113 C 13.0725 19.2032 19.4833 12.7924 27.3911 12.7924 C 29.8615 12.7924 32.1856 13.4183 34.2141 14.5198 L 43.1104 5.6233 C 38.705 2.3952 33.2713 0.4875 27.3911 0.4875 Z" />
          </svg>
        </div>
      ) : null}
    </>
  );
}
