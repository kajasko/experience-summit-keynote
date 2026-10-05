import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE } from "../../engine/motion";

/**
 * Closing slide — stage speakers as bottom-aligned cutouts with overlaid copy.
 * Order follows the Experience Summit 2026 main-stage program (excl. workshops).
 * Photos: experiencesummit.cz official headshots, background removed.
 */
const SPEAKERS = [
  {
    id: "jakub",
    n: "01",
    name: "Jakub Petřina",
    role: "Head of Brand Strategy",
    org: "PPF",
    topic: "Od rychlých člunů po zaoceánské tankery",
    time: "9:45–10:15",
    photo: "speakers/jakub-cut.webp",
  },
  {
    id: "dejan",
    n: "02",
    name: "Dejan Krstic",
    role: "Group Product Manager",
    org: "ex-Spotify",
    topic: "Od softwaru ke kontextu — produktový cyklus v éře AI",
    time: "10:15–10:45",
    photo: "speakers/dejan-cut.webp",
  },
  {
    id: "michaela",
    n: "03",
    name: "Michaela Edgerley Stovicek",
    role: "Global Head of Preschool Audience",
    org: "the LEGO Group",
    topic: "„Jen to nejlepší je dost dobré“ v éře umělé inteligence",
    time: "11:15–12:00",
    photo: "speakers/michaela-cut.webp",
  },
  {
    id: "krystof",
    n: "04",
    name: "Vladimír Kryštof Maliňák",
    role: "Produktový designér",
    org: "the LEGO Group",
    topic: "„Jen to nejlepší je dost dobré“ v éře umělé inteligence",
    time: "11:15–12:00",
    photo: "speakers/krystof-cut.webp",
  },
  {
    id: "milos",
    n: "05",
    name: "Miloš Nejezchleb",
    role: "Chief People Care & MKT Officer",
    org: "Home Credit CZ/SK",
    topic: "Anatomie úspěšného týmu — vztahy a kultura řídí výsledky",
    time: "12:00–12:30",
    photo: "speakers/milos-cut.webp",
  },
] as const;

/** Wide enough for Kryštof’s arms + LEGO at full cutout aspect. */
const CARD_W = 860;
const GAP = 36;
const STRIDE = CARD_W + GAP;
const LOOP_DURATION = 48; // slightly slower with 5 speakers

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
      <p data-sp-sub className="sp-sub">
        Experience Summit 2026 · pět hlasů ze stage
      </p>

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
