import type { ReactNode } from "react";
import { asset } from "../engine/assets";

type EditorialHeroProps = {
  code: string;
  accent?: string;
  /** Optional final art; fallback composition stays until explicitly supplied. */
  imageSrc?: string;
};

const COPY: Record<string, { eyebrow: string; headline: string; statement?: string }> = {
  "HV-01": { eyebrow: "NOVÁ ÉRA ZKUŠENOSTI", headline: "AI mění svět.", statement: "Nemění jen nástroje. Mění pravidla prostředí kolem nás." },
  "HV-07": { eyebrow: "ČESKÁ REPUBLIKA · 2026", headline: "72 %", statement: "AI už není okrajová zkušenost." },
  "HV-10": { eyebrow: "ZÁSADNÍ POZNÁNÍ", headline: "Problém není AI." },
  "HV-11": { eyebrow: "ZÁSADNÍ POZNÁNÍ", headline: "Přidáváme AI do světa navrženého bez ní." },
  "HV-13": { eyebrow: "VIZE 01 · ELON MUSK", headline: "AI dostává tělo.", statement: "Kdo kontroluje, co udělá?" },
  "HV-14": { eyebrow: "VIZE 02 · DARIO AMODEI", headline: "Desetiletí v několika letech.", statement: "Dokážeme se adaptovat dost rychle?" },
  "HV-15": { eyebrow: "VIZE 03 · DEMIS HASSABIS", headline: "AI se stává vědcem.", statement: "Porozumíme tomu, co objeví?" },
  "HV-16": { eyebrow: "VIZE 04 · SAM ALTMAN", headline: "AI jako infrastruktura.", statement: "Kdo nese odpovědnost?" },
  "HV-31": { eyebrow: "OD MOMENTU K CELÉ CESTĚ", headline: "AI vstupuje do celé cesty.", statement: "Od potřeby až k výsledku." },
  "HV-33A": { eyebrow: "PERSONALIZACE", headline: "Personalizace vybírá.", statement: "Z předem připravených variant." },
  "HV-33B": { eyebrow: "ADAPTACE", headline: "Adaptace skládá.", statement: "Podle právě probíhající situace." },
  "HV-33C": { eyebrow: "KONTEXT", headline: "Rozhoduje okamžik.", statement: "Profil nestačí." },
  "HV-40": { eyebrow: "ROZHRANÍ", headline: "Chat není cíl.", statement: "Přirozený vstup musí vést k jasnému výsledku." },
  "HV-44": { eyebrow: "NOVÝ DEFAULT", headline: "Nedůvěra je nový default." },
  "HV-46": { eyebrow: "DŮVĚRA", headline: "Slib nestačí.", statement: "Důvěra potřebuje důkaz." },
  "HV-53": { eyebrow: "BIAS VE VELKÉM MĚŘÍTKU", headline: "Jedna chyba. Tisíce rozhodnutí.", statement: "AI násobí naši historii rychlostí systému." },
  "HV-69": { eyebrow: "HODNOTA ČLOVĚKA", headline: "Hodnota se přesouvá.", statement: "AI přebírá rutinu. Člověk přidává úsudek, kreativitu, kontext a empatii." },
};



function Portrait({ src, accent }: { src: string; accent: string }) {
  return (
    <div style={{ position: "relative", width: 650, height: 790, marginLeft: "auto", overflow: "hidden", borderRadius: 48, border: "1px solid rgba(0,88,96,.12)", background: `radial-gradient(circle at 50% 30%, color-mix(in srgb, ${accent} 24%, transparent), transparent 42%)` }}>
      <div style={{ position: "absolute", left: "50%", top: 94, width: 410, height: 410, transform: "translateX(-50%)", borderRadius: "50%", border: `3px solid ${accent}`, opacity: .72 }} />
      <img src={src} alt="" style={{ position: "absolute", left: "50%", bottom: 0, width: 620, height: 740, objectFit: "contain", objectPosition: "bottom", maxWidth: "none", transform: "translateX(-50%)", filter: "saturate(.72) contrast(1.08)" }} />
    </div>
  );
}

function RouteVisual({ accent }: { accent: string }) {
  return (
    <svg width="900" height="620" viewBox="0 0 900 620" aria-hidden="true">
      <path d="M70 454 C210 454 226 138 410 178 S560 536 744 358 790 118 856 118" fill="none" stroke="var(--line)" strokeWidth="28" strokeLinecap="round" opacity=".58" />
      <path d="M70 454 C210 454 226 138 410 178 S560 536 744 358 790 118 856 118" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" />
      {[[238, 286], [532, 350], [792, 205]].map(([x, y], index) => (
        <g key={index}>
          <circle cx={x} cy={y} r="55" fill="var(--bg)" stroke="var(--teal)" strokeWidth="3" />
          <circle cx={x} cy={y} r="34" fill={accent} opacity=".34" />
          <text x={x} y={y + 8} textAnchor="middle" fill="var(--text-deep)" fontSize="22" fontWeight="800" fontFamily="Montserrat, sans-serif">0{index + 1}</text>
        </g>
      ))}
    </svg>
  );
}

function ModulesVisual({ code, accent }: { code: string; accent: string }) {
  const modules = [
    { w: 330, h: 112, x: 110, y: 92 },
    { w: 270, h: 152, x: 470, y: 72 },
    { w: 390, h: 132, x: 230, y: 260 },
    { w: 250, h: 118, x: 580, y: 330 },
    { w: 320, h: 126, x: 92, y: 468 },
  ];
  return (
    <div style={{ position: "relative", width: 900, height: 680 }}>
      {modules.map((module, index) => {
        const selected = code === "HV-33A" && index === 2;
        const adapted = code === "HV-33B";
        const context = code === "HV-33C";
        const x = adapted ? [110, 470, 110, 530, 110][index] : context ? 250 : module.x;
        const y = adapted ? [72, 72, 260, 260, 468][index] : context ? 92 + index * 104 : module.y;
        return (
          <div key={index} data-module={index} data-module-x={x - module.x} data-module-y={y - module.y} data-module-width={context ? 410 : module.w} data-module-height={context ? 82 : module.h} style={{ position: "absolute", left: module.x, top: module.y, width: module.w, height: module.h, borderRadius: 22, border: `3px solid ${selected || adapted ? accent : "var(--teal)"}`, background: selected ? accent : "rgba(255,255,255,.42)", boxShadow: adapted ? "0 20px 54px rgba(3,56,61,.12)" : undefined }}>
            <span style={{ position: "absolute", left: 22, top: 20, width: 54 + index * 12, height: 6, background: selected ? "var(--text-deep)" : "var(--line)" }} />
            <span style={{ position: "absolute", left: 22, top: 42, right: 22, height: 3, background: context && index === 4 ? "var(--signal)" : "var(--line)", opacity: .72 }} />
          </div>
        );
      })}
      {code === "HV-33C" && <div data-context style={{ position: "absolute", right: 82, top: 226, width: 190, height: 190, borderRadius: "50%", border: `4px solid ${accent}`, display: "grid", placeItems: "center", color: "var(--signal)", fontSize: 82, fontWeight: 800 }}>!</div>}
    </div>
  );
}

function BrokenTrust({ accent }: { accent: string }) {
  return (
    <svg width="650" height="650" viewBox="0 0 650 650" aria-hidden="true">
      <circle cx="325" cy="325" r="230" fill="none" stroke="var(--line)" strokeWidth="74" />
      <path d="M184 141A230 230 0 0 1 533 264" fill="none" stroke="var(--teal)" strokeWidth="74" strokeLinecap="round" />
      <path d="M546 366A230 230 0 0 1 220 530" fill="none" stroke={accent} strokeWidth="74" strokeLinecap="round" />
      <path d="M382 86 305 284l94 70-134 207" fill="none" stroke="var(--lime)" strokeWidth="10" strokeLinejoin="round" />
    </svg>
  );
}

function Billboard({ accent }: { accent: string }) {
  return (
    <div style={{ position: "relative", width: 880, height: 650 }}>
      <div style={{ position: "absolute", left: 90, top: 72, width: 610, height: 330, borderRadius: 32, background: "var(--paper)", border: "4px solid var(--text-deep)", boxShadow: "34px 30px 0 rgba(3,56,61,.1)" }}>
        <div style={{ position: "absolute", left: 48, top: 46, width: 330, height: 28, background: "var(--text-deep)" }} />
        <div style={{ position: "absolute", left: 48, top: 100, width: 470, height: 12, background: "var(--line)" }} />
        <div style={{ position: "absolute", left: 48, top: 136, width: 390, height: 12, background: "var(--line)" }} />
        <div style={{ position: "absolute", right: 44, bottom: 42, width: 72, height: 72, borderRadius: "50%", background: accent }} />
      </div>
      <div style={{ position: "absolute", left: 230, top: 402, width: 24, height: 205, background: "var(--text-deep)" }} />
      <div style={{ position: "absolute", left: 538, top: 402, width: 24, height: 205, background: "var(--text-deep)" }} />
      <div style={{ position: "absolute", left: 180, top: 590, width: 430, height: 20, background: "var(--text-deep)" }} />
      <div style={{ position: "absolute", right: 62, bottom: 38, width: 56, height: 126, borderRadius: "28px 28px 4px 4px", background: "var(--signal)" }} />
    </div>
  );
}

function BiasVisual({ accent }: { accent: string }) {
  return (
    <div style={{ position: "relative", width: 900, height: 660 }}>
      <div data-bias-original style={{ position: "absolute", left: 70, top: 96, width: 330, height: 430, borderRadius: 24, background: "var(--paper)", transform: "rotate(-4deg)", boxShadow: "0 28px 70px rgba(0,0,0,.28)", padding: 42 }}>
        {[0, 1, 2, 3, 4, 5].map((line) => <div key={line} style={{ width: line === 5 ? 150 : "100%", height: 8, background: line === 2 ? accent : "var(--line)", marginBottom: 31 }} />)}
      </div>
      {[0, 1, 2, 3, 4].map((column) => (
        <div key={column} data-bias-copies style={{ position: "absolute", left: 420 + column * 82, top: 142 + column * 48, display: "grid", gap: 16, opacity: 1 - column * .12 }}>
          {[0, 1, 2, 3].map((row) => <span key={row} style={{ width: 210, height: 48, border: "2px solid rgba(0,88,96,.24)", background: row === 2 ? `color-mix(in srgb, ${accent} 28%, transparent)` : "rgba(0,88,96,.05)" }} />)}
        </div>
      ))}
    </div>
  );
}

function ValueShift() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 110px 1.05fr", alignItems: "center", width: 920 }}>
      <div style={{ opacity: .54 }}>
        <div className="label">AI PŘEBÍRÁ</div>
        <div className="heading" style={{ fontSize: 55, marginTop: 24, lineHeight: 1.2 }}>rutinu<br />opakování<br />část analýzy</div>
      </div>
      <div style={{ color: "var(--lime-deep)", fontSize: 72, fontWeight: 400 }}>→</div>
      <div style={{ padding: "48px 44px", background: "var(--text-deep)", color: "var(--paper)" }}>
        <div className="label" style={{ color: "var(--lime)" }}>ČLOVĚK PŘIDÁVÁ</div>
        <div style={{ marginTop: 24, fontSize: 48, lineHeight: 1.12, fontWeight: 750 }}>úsudek<br />kreativitu<br />kontext<br />empatii</div>
      </div>
    </div>
  );
}

function Visual({ code, accent }: { code: string; accent: string }) {
  const portraits: Record<string, string> = {
    "HV-13": asset("musk.webp"),
    "HV-14": asset("amodei.webp"),
    "HV-15": asset("hassabis.webp"),
    "HV-16": asset("altman.webp"),
  };
  if (portraits[code]) return <Portrait src={portraits[code]} accent={accent} />;
  if (code === "HV-01") return <img data-editorial-photo src={asset("crowd.webp")} alt="" style={{width:850,height:790,objectFit:"cover",objectPosition:"center 42%",borderRadius:44}}/>;
  if (code === "HV-07") return <div style={{ position: "relative", width: 900, height: 760, overflow: "hidden", borderRadius: 40 }}><div style={{ position: "absolute", right: 22, top: 54, width: 650, height: 650, borderRadius: "50%", border: `3px solid ${accent}` }} /><img src={asset("people.png")} alt="" style={{ position: "absolute", right: -40, bottom: 0, width: 850, height: 760, objectFit: "cover", objectPosition: "center", filter: "grayscale(.16) saturate(.52) contrast(1.12)", opacity: .82, borderRadius: 40 }} /></div>;
  if (code === "HV-10" || code === "HV-11") return <div style={{ position: "relative", width: 930, height: 780 }}><img src={asset("washer.png")} alt="" style={{ position: "absolute", right: -10, top: 0, width: 930, height: 780, borderRadius: 36, objectFit: "contain", objectPosition: "right center" }} />{code === "HV-11" && <><span data-washer-system style={{ position: "absolute", right: 84, top: 70, width: 620, height: 620, borderRadius: "50%", border: "2px solid rgba(0,88,96,.18)" }} /><span data-washer-system style={{ position: "absolute", right: 20, top: 8, width: 748, height: 748, borderRadius: "50%", border: "2px solid rgba(239,106,91,.18)" }} /></>}</div>;
  if (code === "HV-31") return <RouteVisual accent={accent} />;
  if (code.startsWith("HV-33")) return <ModulesVisual code={code} accent={accent} />;
  if (code === "HV-40") return <div style={{ width: 900, height: 230, borderRadius: 116, background: "var(--paper)", border: "3px solid rgba(0,88,96,.22)", boxShadow: "0 34px 90px rgba(3,56,61,.12)", display: "flex", alignItems: "center", padding: "30px 34px 30px 62px", gap: 30 }}><div style={{ flex: 1, display: "grid", gap: 17 }}>{[.72, .48].map((width) => <span key={width} style={{ width: `${width * 100}%`, height: 13, borderRadius: 8, background: "var(--line)" }} />)}</div><div style={{ width: 168, height: 168, borderRadius: "50%", background: accent, color: "var(--text-deep)", display: "grid", placeItems: "center", fontSize: 66, fontWeight: 800 }}>→</div></div>;
  if (code === "HV-44") return <BrokenTrust accent={accent} />;
  if (code === "HV-46") return <Billboard accent={accent} />;
  if (code === "HV-53") return <BiasVisual accent={accent} />;
  if (code === "HV-69") return <ValueShift />;
  return null;
}

function VisualStage({ dark, accent, children }: { dark: boolean; accent: string; children: ReactNode }) {
  return (
    <div data-hero-visual style={{ position: "relative", height: "100%", display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 70, background: `radial-gradient(circle at 58% 42%, color-mix(in srgb, ${accent} ${dark ? 11 : 7}%, transparent), transparent 48%)` }} />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

export function EditorialHero({ code, accent = "var(--lime)", imageSrc }: EditorialHeroProps) {
  const copy = COPY[code];
  const dark = false;
  const headlineSize = code === "HV-07" ? 230 : copy.headline.length > 42 ? 66 : copy.headline.length > 28 ? 76 : 92;
  return (
    <div data-hero-slot={code} className="safe" style={{ top: 126, bottom: 112, display: "grid", gridTemplateColumns: ".78fr 1.22fr", gap: 66, alignItems: "stretch", color: dark ? "var(--paper)" : "var(--text-deep)" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
        <div style={{ color: dark ? accent : "var(--teal)", fontSize: 16, fontWeight: 800, letterSpacing: ".16em" }}>{copy.eyebrow}</div>
        <div data-hero-title style={{ marginTop: 28, fontSize: headlineSize, textWrap: code === "HV-11" ? "balance" : undefined, fontWeight: 800, letterSpacing: "-.04em", lineHeight: 1.08 }}>{copy.headline}</div>
        {copy.statement && <div data-hero-statement style={{ marginTop: 34, maxWidth: "23ch", color: dark ? "rgba(244,246,241,.68)" : "var(--muted)", fontSize: 26, fontWeight: 600, lineHeight: 1.24 }}>{copy.statement}</div>}
      </div>
      <VisualStage dark={dark} accent={accent}>{imageSrc ? <img data-hero-image src={imageSrc} alt="" style={{ width: "100%", height: 790, objectFit: "cover" }} /> : <Visual code={code} accent={accent} />}</VisualStage>
    </div>
  );
}
