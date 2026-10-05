import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE } from "../../engine/motion";

/**
 * Closing slide — four stage speakers as bottom-aligned cutouts with
 * overlaid name/role/topic (Musk / Altman / Schwartz treatment).
 * Photos: Experience Summit official headshots (…_78 / …_77), bg removed.
 */
const SPEAKERS = [
  {
    id: "michaela",
    n: "01",
    name: "Michaela Edgerley Stovicek",
    role: "Global Head of Preschool Audience",
    org: "the LEGO Group",
    topic: "Design pro zákazníky, kteří nemohou říct, co chtějí",
    photo: "speakers/michaela-cut.webp",
  },
  {
    id: "krystof",
    n: "02",
    name: "Vladimír Kryštof Maliňák",
    role: "Designer",
    org: "the LEGO Group",
    topic: "Kreativita, empatie a značka, která vyrůstá s dětmi",
    photo: "speakers/krystof-cut.webp",
  },
  {
    id: "dejan",
    n: "03",
    name: "Dejan Krstic",
    role: "Group Product Manager",
    org: "ex-Spotify",
    topic: "Kontext nad kódem — produktový úsudek v éře AI",
    photo: "speakers/dejan-cut.webp",
  },
  {
    id: "jakub",
    n: "04",
    name: "Jakub Petřina",
    role: "Head of Brand Strategy",
    org: "PPF",
    topic: "Značka stavěná detailem — škálovat CX napříč trhy",
    photo: "speakers/jakub-cut.webp",
  },
] as const;

/** Wide enough for Kryštof’s arms + LEGO at full cutout aspect. */
const CARD_W = 860;
const GAP = 36;
const STRIDE = CARD_W + GAP;
const LOOP_DURATION = 42;

export function SpeakersEnd({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-sp-title]");
    const sub = el.querySelector<HTMLElement>("[data-sp-sub]");
    const track = el.querySelector<HTMLElement>("[data-sp-track]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-sp-card]", el);

    if (reduced || !track) {
      gsap.set([title, sub, ...cards], { autoAlpha: 1, y: 0 });
      cards.forEach((card, i) => {
        if (i >= SPEAKERS.length) gsap.set(card, { display: "none" });
      });
      gsap.set(track, { x: (1920 - (STRIDE * SPEAKERS.length - GAP)) / 2 });
      el.classList.add("is-sp-static");
      return;
    }

    gsap.set(title, { autoAlpha: 0, y: 20 });
    gsap.set(sub, { autoAlpha: 0, y: 12 });
    gsap.set(cards, { autoAlpha: 1 });

    const intro = gsap.timeline();
    intro.to(title, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, 0.05);
    intro.to(sub, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.22);

    const loopW = STRIDE * SPEAKERS.length;
    const base = 80;
    gsap.set(track, { x: base });
    const loop = gsap.to(track, {
      x: `-=${loopW}`,
      duration: LOOP_DURATION,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const n = parseFloat(x);
          const d = ((n - base) % -loopW + -loopW) % -loopW;
          return base + d;
        }),
      },
    });

    return () => {
      intro.kill();
      loop.kill();
    };
  }, [reduced]);

  const strip = [...SPEAKERS, ...SPEAKERS];

  return (
    <div ref={root} className="scene sp-stage">
      <SlideChrome kicker="ZÁVĚR / EXPERIENCE SUMMIT" page="67 / 67" />
      <h2 data-sp-title className="sp-title">
        Dnes vás čekají lidé, kteří experience
        <br />
        posouvají <em className="sp-mark">v praxi</em>.
      </h2>
      <p data-sp-sub className="sp-sub">Experience Summit 2026 · čtyři hlasy ze stage</p>

      <div className="sp-rail">
        <div data-sp-track className="sp-track">
          {strip.map((speaker, index) => (
            <article
              key={`${speaker.id}-${index}`}
              data-sp-card
              className="sp-card"
              style={{ width: CARD_W }}
            >
              <img
                data-art
                className="sp-photo cutout"
                src={asset(speaker.photo)}
                alt=""
              />
              <span className="sp-n">{speaker.n}</span>
              <div className="sp-copy">
                <div className="sp-name">{speaker.name}</div>
                <div className="sp-role">
                  {speaker.role}
                  <span className="sp-org"> · {speaker.org}</span>
                </div>
                <div className="sp-topic">{speaker.topic}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
