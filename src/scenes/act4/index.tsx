import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { GlassStats } from "../../components/GlassStats";
import { BxCxExFinale, ENDING_B } from "./FinaleB";

const ORCH_TITLE = [
  ["Firma", "vidí", "spojení."],
  ["Zákazník", "ne."],
];

const ORCH_STATS = [
  { id: "78", value: 78, unit: "%", cap: "firem věří, že dodává propojenou zkušenost" },
  { id: "25", value: 25, unit: "%", cap: "zákazníků s tím souhlasí" },
] as const;

const CARE_TITLE = [
  ["AI", "rozšiřuje"],
  ["odpovědnosti."],
];

const CARE_STATS = [
  { id: "85", value: 85, unit: "%", cap: "vedoucích péče rozšiřuje odpovědnosti lidí kvůli AI" },
  {
    id: "75",
    value: 75,
    unit: "%",
    cap: "zákazníků odrazuje předávání mezi týmy",
    extra: (
      <div className="handoff-row">
        <span className="handoff-chip">Prodej</span>
        <span className="handoff-x">×</span>
        <span className="handoff-chip is-break">Péče</span>
        <span className="handoff-x">×</span>
        <span className="handoff-chip">Back office</span>
      </div>
    ),
  },
] as const;

const PAD = { id: "pad", value: 0, unit: "%", cap: "" };

export function Orch({ step, reduced }: SceneProps) {
  if (step <= 1) {
    return (
      <GlassStats
        step={step}
        reduced={reduced}
        layout="two"
        chrome={{
          kicker: "JAK? / PERCEPTION GAP",
          page: "59 / 75",
          caption: "SAP Global Engagement Index 2026",
        }}
        title={ORCH_TITLE}
        stats={[ORCH_STATS[0], ORCH_STATS[1], PAD]}
      />
    );
  }
  return (
    <GlassStats
      step={step - 2}
      reduced={reduced}
      layout="two"
      chrome={{
        kicker: "JAK? / ODPOVĚDNOST",
        page: "60 / 75",
        caption: "Gartner, duben 2026",
      }}
      title={CARE_TITLE}
      stats={[CARE_STATS[0], CARE_STATS[1], PAD]}
    />
  );
}

export { Channels, Mortgage } from "./ThenNow";

export function BxCxEx({ step, reduced, sceneId }: SceneProps) {
  // Alternative closing, opt-in only via ?ending=b (the default stays below).
  if (ENDING_B) return <BxCxExFinale step={step} reduced={reduced} sceneId={sceneId} />;
  const parts = [
    { k: "BX", t: "BRAND EXPERIENCE", bg: "var(--text-deep)", fg: "var(--paper)" },
    { k: "CX", t: "CUSTOMER EXPERIENCE", bg: "var(--teal)", fg: "var(--paper)" },
    { k: "EX", t: "EMPLOYEE EXPERIENCE", bg: "var(--lime)", fg: "var(--text-deep)" },
  ];
  if (step === 0) {
    return (
      <div className="scene">
        <SlideChrome kicker="JAK? / EXPERIENCE SYSTÉM" page="67 / 75" caption="Propojení zkušeností" rail="BX × CX × EX" />
        <div className="safe" style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
          <div data-bx-intro style={{ maxWidth: 1280 }}>
            <div className="label">JEDEN EXPERIENCE SYSTÉM</div>
            <div className="heading" style={{ marginTop: 24, fontSize: 78, lineHeight: 1.02, letterSpacing: "-0.055em" }}>
              Spojení <span className="display-gradient">BX, CX a EX</span><br />
              je dnes důležitější než dříve.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scene bx-system-stage">
      <SlideChrome kicker="JAK? / EXPERIENCE SYSTÉM" page="67 / 75" caption="Tři disciplíny. Jedna zkušenost." rail="BX × CX × EX" />
      <div className="bx-system-title">
        Spojení <span className="display-gradient">BX, CX a EX</span> je dnes důležitější než dříve.
      </div>
      <div className="bx-system-flow">
        <div className="bx-system-parts">
          {parts.map((part, i) => (
            <div key={part.k} data-delivery-layer={part.k} className="bx-system-part" style={{ background: part.bg, color: part.fg, animationDelay: `${i * 0.11}s` }}>
              <span className="bx-system-code">{part.k}</span>
              <span className="label" style={{ color: "inherit", opacity: 0.78 }}>{part.t}</span>
            </div>
          ))}
        </div>
        <svg className="bx-system-arrows" viewBox="0 0 340 470" aria-hidden="true">
          <defs>
            <marker id="bx-arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M0 0L10 5L0 10Z" fill="var(--lime)" />
            </marker>
          </defs>
          <path className="bx-magic-line line-a" d="M8 72C120 72 116 235 226 235" />
          <path className="bx-magic-line line-b" d="M8 235H226" />
          <path className="bx-magic-line line-c" d="M8 398C120 398 116 235 226 235" />
          <circle className="bx-magic-hub" cx="226" cy="235" r="17" />
          <path className="bx-magic-line line-out" d="M244 235H326" markerEnd="url(#bx-arrowhead)" />
        </svg>
        <div className="bx-system-outcome">
          <div className="label">ZÁKAZNÍK VIDÍ</div>
          <div className="display-gradient bx-system-one">ONE</div>
          <div className="heading bx-system-experience">EXPERIENCE</div>
          <div className="thought bx-system-thought">To, co firma propojí uvnitř, dokáže doručit ven.</div>
        </div>
      </div>
    </div>
  );
}
