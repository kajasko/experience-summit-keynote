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
      <figure className="intro-photo">
        <img data-hero-visual src={asset("andrea-nuttall.webp")} alt="Andrea Nuttall" />
      </figure>
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
      <div className="hold-ring" aria-hidden="true" />
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
