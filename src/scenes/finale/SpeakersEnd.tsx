import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE } from "../../engine/motion";

/**
 * Closing slide — four stage speakers in a continuous right→left carousel.
 * Photos: official Experience Summit headshots from experiencesummit.cz
 * (Clientology). Topics from the same public program.
 */
const SPEAKERS = [
  {
    id: "michaela",
    n: "01",
    name: "Michaela Edgerley Stovicek",
    role: "Global Head of Preschool Audience",
    org: "the LEGO Group",
    topic: "Design pro zákazníky, kteří nemohou říct, co chtějí",
    photo: "speakers/michaela-port.webp",
  },
  {
    id: "krystof",
    n: "02",
    name: "Vladimír Kryštof Maliňák",
    role: "Designer",
    org: "the LEGO Group",
    topic: "Kreativita, empatie a značka, která vyrůstá s dětmi",
    photo: "speakers/krystof-port.webp",
  },
  {
    id: "dejan",
    n: "03",
    name: "Dejan Krstic",
    role: "Group Product Manager",
    org: "ex-Spotify",
    topic: "Kontext nad kódem — produktový úsudek v éře AI",
    photo: "speakers/dejan-port.webp",
  },
  {
    id: "jakub",
    n: "04",
    name: "Jakub Petřina",
    role: "Head of Brand Strategy",
    org: "PPF",
    topic: "Značka stavěná detailem — škálovat CX napříč trhy",
    photo: "speakers/jakub-port.webp",
  },
] as const;

const CARD_W = 760;
const GAP = 36;
const STRIDE = CARD_W + GAP;

export function SpeakersEnd({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-sp-title]");
    const sub = el.querySelector<HTMLElement>("[data-sp-sub]");
    const track = el.querySelector<HTMLElement>("[data-sp-track]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-sp-card]", el);
    const foot = el.querySelector<HTMLElement>("[data-sp-foot]");

    if (reduced || !track) {
      gsap.set([title, sub, foot, ...cards], { autoAlpha: 1, y: 0 });
      // Static: show the first four cards only, centered as a row.
      cards.forEach((card, i) => {
        if (i >= SPEAKERS.length) gsap.set(card, { display: "none" });
      });
      gsap.set(track, { x: (1920 - (STRIDE * SPEAKERS.length - GAP)) / 2 });
      el.classList.add("is-sp-static");
      return;
    }

    gsap.set(title, { autoAlpha: 0, y: 20 });
    gsap.set(sub, { autoAlpha: 0, y: 12 });
    gsap.set(foot, { autoAlpha: 0, y: 10 });
    gsap.set(cards, { autoAlpha: 1 });

    const intro = gsap.timeline();
    intro.to(title, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, 0.05);
    intro.to(sub, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.22);
    intro.to(foot, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.5);

    // Two copies of the four cards → seamless loop of one set width.
    const loopW = STRIDE * SPEAKERS.length;
    gsap.set(track, { x: 120 });
    const loop = gsap.to(track, {
      x: `-=${loopW}`,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const n = parseFloat(x);
          // Keep x in (-loopW + 120, 120]
          const base = 120;
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
      <SlideChrome
        kicker="ZÁVĚR / EXPERIENCE SUMMIT"
        page="67 / 67"
        caption="20. 10. 2026 · Spojka Karlín"
        captionDot
      />
      <h2 data-sp-title className="sp-title">
        Dnes vás čekají lidé, kteří experience
        <br />
        posouvají <em className="sp-mark">v praxi</em>.
      </h2>
      <p data-sp-sub className="sp-sub">Experience Summit 2026 · čtyři hlasy ze stage</p>

      <div className="sp-rail" aria-hidden={false}>
        <div data-sp-track className="sp-track">
          {strip.map((speaker, index) => (
            <article
              key={`${speaker.id}-${index}`}
              data-sp-card
              className="sp-card"
              style={{ width: CARD_W }}
            >
              <div className="sp-photo-wrap">
                <img
                  data-art
                  className="sp-photo"
                  src={asset(speaker.photo)}
                  alt=""
                />
                <span className="sp-n">{speaker.n}</span>
              </div>
              <div className="sp-copy">
                <span className="sp-tag">STAGE</span>
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

      <div data-sp-foot className="sp-foot">
        <span className="sp-foot-dot" />
        Stage · Masterclassy · CX Awards · Networking
      </div>
    </div>
  );
}
