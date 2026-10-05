import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { EASE } from "../../engine/motion";

/**
 * Closing slide: speakers of Experience Summit 2026.
 * Source: Clientology public program posts (LinkedIn, Aug–Sep 2026) —
 * not stored in deck.ts. Topics shortened for the slide.
 */
const SPEAKERS = [
  {
    name: "Michaela Edgerley Stovicek",
    role: "Global Head of Preschool Audience",
    org: "the LEGO Group",
    topic: "Design pro zákazníky, kteří nemohou říct, co chtějí",
    tag: "STAGE",
  },
  {
    name: "Vladimír Kryštof Maliňák",
    role: "Designer",
    org: "the LEGO Group",
    topic: "Kreativita, empatie a značka, která vyrůstá s dětmi",
    tag: "STAGE",
  },
  {
    name: "Dejan Krstic",
    role: "Group Product Manager",
    org: "ex-Spotify",
    topic: "Kontext nad kódem — produktový úsudek v éře AI",
    tag: "STAGE",
  },
  {
    name: "Jakub Petřina",
    role: "Head of Brand Strategy",
    org: "PPF",
    topic: "Značka stavěná detailem — škálovat CX napříč trhy",
    tag: "STAGE",
  },
  {
    name: "Kateřina Stehlíková",
    role: "Masterclass",
    org: "E.ON",
    topic: "Od skryté potřeby k funkční propozici",
    tag: "MASTERCLASS",
  },
  {
    name: "Zuzana Mezerová",
    role: "Masterclass",
    org: "Komerční banka",
    topic: "Persony, které rozhýbají byznys",
    tag: "MASTERCLASS",
  },
] as const;

export function SpeakersEnd({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-sp-title]");
    const sub = el.querySelector<HTMLElement>("[data-sp-sub]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-sp-card]", el);
    const foot = el.querySelector<HTMLElement>("[data-sp-foot]");
    if (reduced) {
      gsap.set([title, sub, foot, ...cards], { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }
    gsap.set(title, { autoAlpha: 0, y: 22 });
    gsap.set(sub, { autoAlpha: 0, y: 14 });
    gsap.set(cards, { autoAlpha: 0, y: 28, scale: 0.96 });
    gsap.set(foot, { autoAlpha: 0, y: 12 });
    const tl = gsap.timeline();
    tl.to(title, { autoAlpha: 1, y: 0, duration: 0.55, ease: EASE.enter }, 0.08);
    tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, 0.28);
    tl.to(cards, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: "power3.out" }, 0.42);
    tl.to(foot, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 1.05);
    return () => {
      tl.kill();
    };
  }, [reduced]);

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
      <p data-sp-sub className="sp-sub">Experience Summit 2026 · Experience Design v éře AI</p>
      <div className="sp-grid">
        {SPEAKERS.map((speaker, index) => (
          <article key={speaker.name} data-sp-card className={`sp-card${index >= 4 ? " is-master" : ""}`}>
            <div className="sp-card-top">
              <span className="sp-tag">{speaker.tag}</span>
              <span className="sp-n">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="sp-name">{speaker.name}</div>
            <div className="sp-role">
              {speaker.role} · {speaker.org}
            </div>
            <div className="sp-topic">{speaker.topic}</div>
          </article>
        ))}
      </div>
      <div data-sp-foot className="sp-foot">
        <span className="sp-foot-dot" />
        Stage · Masterclassy · CX Awards · Networking
      </div>
    </div>
  );
}
