import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";

/** Slide 01 · Představení: Andrea Nuttall, zakladatelka Clientology. */
export function SpeakerIntro(_props: SceneProps) {
  return (
    <div className="scene is-intro">
      <SlideChrome page="01 / 01" caption="Experience Summit 2026" captionDot />
      <div className="intro-copy">
        <h1 className="intro-name">
          Andrea
          <br />
          Nuttall
        </h1>
        <div className="intro-rule" aria-hidden="true" />
        <div className="intro-role">
          Zakladatelka a CEO <strong>Clientology</strong>
        </div>
        <div className="intro-tags">
          <span>CX vize</span>
          <span>Experience Strategist</span>
          <span>Change Maker</span>
        </div>
      </div>
      <img data-hero-visual className="cutout intro-cut" src={asset("andrea-nuttall-cut.webp")} alt="Andrea Nuttall" />
    </div>
  );
}

const MASTERCLASSES = [
  {
    id: "persony",
    title: "Persony v akci",
    sub: "Jak proměnit potřeby zákazníků v růst",
    leads: ["Daniel Koutný · Clientology", "Zuzana Mezerová · Komerční banka"],
  },
  {
    id: "prototyp",
    title: "Od zákaznické potřeby k PRD a živému prototypu",
    sub: "Umělá inteligence a prototypování za 60 minut",
    leads: ["Jakub Šťastný · Clientology", "Dejan Krstic · Spotify"],
  },
  {
    id: "cvp",
    title: "Od marketingového slibu k reálnému zážitku",
    sub: "CVP v praxi",
    leads: ["Libor Hykeš · Clientology", "Kateřina Stehlíková"],
  },
] as const;

/** Final slide · moderátor a lektoři masterclass. */
export function Hosts(_props: SceneProps) {
  return (
    <div className="scene is-hosts">
      <SlideChrome kicker="01 Odpoledne" page="01 / 01" caption="14:00 – 16:30 · Masterclassy" captionDot />
      <div className="hosts-head">
        <h2 className="hosts-title">Kdo vás provede dál</h2>
      </div>
      <div className="hosts-grid">
        {MASTERCLASSES.map((m, i) => (
          <article key={m.id} className="hosts-card">
            <span className="hosts-card-n">{String(i + 1).padStart(2, "0")}</span>
            <div className="hosts-card-label">Masterclass</div>
            <div className="hosts-card-title">{m.title}</div>
            <div className="hosts-card-sub">{m.sub}</div>
            <ul className="hosts-card-leads">
              {m.leads.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Hold slide shown before the keynote starts. */
export function HoldSlide(_props: SceneProps) {
  return (
    <div className="scene is-dark is-cinematic is-hold">
      <div className="hold-logo" aria-hidden="true">
        <svg viewBox="0 0 54.015 54.015" aria-hidden="true">
            <path className="hold-cut" fillRule="nonzero" d="M 48.8789 42.8305 C 52.1072 38.4252 54.015 32.9915 54.015 27.1113 C 54.015 21.2311 52.1075 15.7968 48.8789 11.3921 L 39.9826 20.2883 C 41.0844 22.3168 41.7101 24.6406 41.7101 27.1113 C 41.7101 29.5814 41.0842 31.9058 39.9826 33.9343 L 48.8789 42.8305 Z" />
            <path className="hold-ring-path" fillRule="nonzero" d="M 27.3911 0.4875 C 12.6872 0.4875 0.7673 12.4074 0.7673 27.1113 C 0.7673 41.8152 12.6872 53.7352 27.3911 53.7352 C 33.2713 53.7352 38.7056 51.8274 43.1104 48.5991 L 34.2141 39.7028 C 32.1856 40.8043 29.8618 41.4299 27.3911 41.4299 C 19.4833 41.4299 13.0725 35.0191 13.0725 27.1113 C 13.0725 19.2032 19.4833 12.7924 27.3911 12.7924 C 29.8615 12.7924 32.1856 13.4183 34.2141 14.5198 L 43.1104 5.6233 C 38.705 2.3952 33.2713 0.4875 27.3911 0.4875 Z" />
          </svg>
      </div>
      <SlideChrome caption="20. října 2026 · Spojka Karlín" mark={false} />
      <div className="hold-copy">
        <div className="hold-kicker">Clientology</div>
        <h1 className="hold-title">Experience<br />Summit 2026</h1>
        <div className="hold-rule" aria-hidden="true" />
        <div className="hold-sub">Experience Design v době AI</div>
        <div className="hold-wait">Začínáme za chvíli</div>
      </div>
    </div>
  );
}
