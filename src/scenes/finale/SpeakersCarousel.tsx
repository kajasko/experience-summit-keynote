import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE } from "../../engine/motion";
import { SUMMIT_SPEAKERS } from "./speakersData";

const CARD_W = 800;
const GAP = 40;
const STRIDE = CARD_W + GAP;
/** Full set of five; slow continuous loop. */
const LOOP_DURATION = 52;

/**
 * Slide 68 — continuous left→right carousel of the five stage speakers.
 * Cutouts flush to the bottom with overlaid name/role/topic; no footer bar.
 */
export function SpeakersCarousel({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-sl-title]");
    const sub = el.querySelector<HTMLElement>("[data-sl-sub]");
    const track = el.querySelector<HTMLElement>("[data-sl-track]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-sl-card]", el);

    if (reduced || !track) {
      gsap.set([title, sub, ...cards], { autoAlpha: 1, y: 0 });
      cards.forEach((card, i) => {
        if (i >= SUMMIT_SPEAKERS.length) gsap.set(card, { display: "none" });
      });
      gsap.set(track, { x: (1920 - (STRIDE * SUMMIT_SPEAKERS.length - GAP)) / 2 });
      el.classList.add("is-sl-static");
      return;
    }

    gsap.set(title, { autoAlpha: 0, y: 16 });
    gsap.set(sub, { autoAlpha: 0, y: 10 });
    gsap.set(cards, { autoAlpha: 1 });

    const intro = gsap.timeline();
    intro.to(title, { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.enter }, 0.06);
    intro.to(sub, { autoAlpha: 1, y: 0, duration: 0.45, ease: EASE.enter }, 0.22);

    const loopW = STRIDE * SUMMIT_SPEAKERS.length;
    // Start with first card partially entering from the LEFT → travel right (LTR).
    const base = -(CARD_W * 0.55);
    gsap.set(track, { x: base });
    const loop = gsap.to(track, {
      x: `+=${loopW}`,
      duration: LOOP_DURATION,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const n = parseFloat(x);
          // Keep x in [base, base + loopW)
          const d = ((n - base) % loopW + loopW) % loopW;
          return base + d;
        }),
      },
    });

    return () => {
      intro.kill();
      loop.kill();
    };
  }, [reduced]);

  const strip = [...SUMMIT_SPEAKERS, ...SUMMIT_SPEAKERS];

  return (
    <div ref={root} className="scene sl-stage">
      <SlideChrome kicker="ZÁVĚR / EXPERIENCE SUMMIT" page="68 / 68" />
      <h2 data-sl-title className="sl-title">
        Dnes vás čekají lidé, kteří experience
        <br />
        posouvají <em className="sl-mark">v praxi</em>.
      </h2>
      <p data-sl-sub className="sl-sub">
        Experience Summit 2026 · pět hlasů ze stage
      </p>

      <div className="sl-rail">
        <div data-sl-track className="sl-track">
          {strip.map((speaker, index) => (
            <article
              key={`${speaker.id}-${index}`}
              data-sl-card
              className="sl-card"
              style={{ width: CARD_W }}
            >
              <img
                data-art
                className="sl-photo cutout"
                src={asset(speaker.photo)}
                alt=""
              />
              <span className="sl-n">{speaker.n}</span>
              <div className="sl-copy">
                <div className="sl-name">{speaker.name}</div>
                <div className="sl-role">
                  {speaker.role}
                  <span className="sl-org"> · {speaker.org}</span>
                </div>
                <div className="sl-topic">{speaker.topic}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
