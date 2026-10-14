import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type JSX } from "react";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { useAwards } from "../../awards/AwardsContext";
import type { AwardCategory, AwardsData } from "../../awards/types";

type DataProps = SceneProps & { data: AwardsData };

function Locked() {
  return (
    <div className="scene">
      <SlideChrome kicker="CX Awards" page="00 / 00" caption="Zamčeno" captionDot mark={false} />
      <div className="awards-locked">
        <div>
          <div className="awards-locked-title">Kapitola je zamčená</div>
          <div className="awards-locked-sub">Vraťte se na slide s heslem a odemkněte ji.</div>
        </div>
      </div>
    </div>
  );
}

function withData(Scene: (props: DataProps) => JSX.Element) {
  return function Guarded(props: SceneProps) {
    const { data } = useAwards();
    if (!data) return <Locked />;
    return <Scene {...props} data={data} />;
  };
}

/** Password gate — first slide of the Awards chapter. */
export function AwardsGate({ reduced }: SceneProps) {
  const { ready, encrypted, unlock } = useAwards();
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState(ready ? "Kapitola je odemčená pro tuto relaci." : "");
  const [kind, setKind] = useState<"ok" | "err" | "">(ready ? "ok" : "");
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ready && !reduced) input.current?.focus();
  }, [ready, reduced]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || ready) return;
    setBusy(true);
    setMsg("");
    setKind("");
    const result = await unlock(value);
    setBusy(false);
    if (result === "ok") {
      setKind("ok");
      setMsg("Odemčeno. Pokračujte šipkou vpřed.");
      setValue("");
      input.current?.blur();
      return;
    }
    setKind("err");
    if (result === "missing") {
      setMsg(encrypted ? "Dešifrování selhalo." : "Šifrovaná data nejsou připravená.");
      return;
    }
    setMsg("Špatné heslo.");
  };

  return (
    <div className="scene is-awards-dark is-cinematic">
      <SlideChrome caption="Experience Summit 2026 · CX Awards" mark={false} />
      <div className="safe awards-gate">
        <div className="awards-kicker">Clientology Institute CX</div>
        <h1 className="awards-title">CX Awards 2026</h1>
        <div className="awards-rule" />
        <div className="awards-sub">Představení a vyhlášení. Pro odemčení kapitoly zadejte heslo.</div>
        <form className="awards-gate-form" onSubmit={onSubmit} onClick={(e) => e.stopPropagation()}>
          <input
            ref={input}
            className="awards-gate-input"
            type="password"
            name="awards-password"
            autoComplete="off"
            spellCheck={false}
            placeholder={ready ? "Odemčeno" : "Heslo"}
            value={value}
            disabled={ready || busy}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className="awards-gate-btn" type="submit" disabled={ready || busy || !value}>
            {ready ? "Odemčeno" : busy ? "…" : "Odemknout"}
          </button>
        </form>
        <div className={`awards-gate-msg${kind === "err" ? " is-err" : kind === "ok" ? " is-ok" : ""}`}>{msg}</div>
      </div>
    </div>
  );
}


/* ───────────── v2: storytelling build ─────────────
   Motion vocabulary (transform/opacity only):
   · .aw-in   — entrance fade-up on mount, delay via --d
   · .aw-step — click-driven, visible when .is-on
   · .aw-rise — word rises out of a mask
   Back-nav (reduced) renders the final state with no motion (see awards.css). */

const ICONS: Record<string, string> = { impact: "experience-impact", pulse: "employee-pulse", changemakers: "cx-changemakers" };
function CatIcon({ id, className = "" }: { id: string; className?: string }) {
  return (
    <span className={`aw-icon ${className}`} aria-hidden="true">
      <img src={`${import.meta.env.BASE_URL}awards-icons/${ICONS[id]}.png`} alt="" draggable={false} />
    </span>
  );
}

const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
const on = (b: boolean) => (b ? " is-on" : "");

function Bleed({ spot = false }: { spot?: boolean }) {
  return (
    <div className="aw-bleed" aria-hidden="true">
      <div className="aw-amb">
        <div className="aw-cg aw-cg-tr"><span className="aw-t-red aw-ph-a" /><span className="aw-t-teal aw-ph-b" /></div>
        <div className="aw-cg aw-cg-bl"><span className="aw-t-teal aw-ph-a" /><span className="aw-t-red aw-ph-b" /></div>
      </div>
      {spot && <div className="aw-beams"><i /><i /><i /></div>}
    </div>
  );
}

function Trophy({ className = "" }: { className?: string }) {
  return (
    <svg className={`aw-trophy ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M20 8h24v14a12 12 0 0 1-24 0V8Z" />
      <path d="M20 12h-8v4a10 10 0 0 0 9 10M44 12h8v4a10 10 0 0 1-9 10" fill="none" />
      <path d="M32 34v10M24 54h16M26 54l2-10h8l2 10" fill="none" />
    </svg>
  );
}

function People({ className = "" }: { className?: string }) {
  return (
    <svg className={`aw-trophy ${className}`} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="20" r="8" />
      <circle cx="14" cy="26" r="6" />
      <circle cx="50" cy="26" r="6" />
      <path d="M18 54c0-9 6-16 14-16s14 7 14 16M2 52c0-7 5-12 12-12 3 0 5 1 7 2M62 52c0-7-5-12-12-12-3 0-5 1-7 2" fill="none" />
    </svg>
  );
}

const darkScene = (reduced: boolean, extra = "") => `scene is-awards-dark aw-scene${reduced ? " is-reduced" : ""}${extra}`;

export const AwardsOpen = withData(function AwardsOpen({ data, reduced }: DataProps) {
  return (
    <div className={darkScene(reduced, " aw-open")}>
      <Bleed spot />
      <div className="aw-year aw-in" style={d(0.1)} aria-hidden="true">2026</div>
      <SlideChrome caption={`${data.summit} · ${data.date}`} mark={false} />
      <div className="aw-open-copy">
        <div className="awards-kicker aw-in" style={d(0.35)}>{data.organizer} uděluje</div>
        <h1 className="aw-open-title">
          <span className="aw-mask"><span className="aw-rise" style={d(0.55)}>CX</span></span>{" "}
          <span className="aw-mask"><span className="aw-rise" style={d(0.7)}>Awards</span></span>
          <span className="aw-mask"><span className="aw-rise aw-lime" style={d(0.85)}>.</span></span>
        </h1>
        <div className="aw-rule aw-draw" style={d(1.15)} />
        <div className="aw-open-sub aw-in" style={d(1.35)}>Představení a vyhlášení výsledků</div>
      </div>
    </div>
  );
});

export const AwardsWhat = withData(function AwardsWhat({ data, reduced }: DataProps) {
  const beats = [
    "Zákaznická zkušenost se nedá vyhlásit.",
    "Musí se postavit — projekt po projektu.",
    "CX Awards oceňují týmy, které to dokázaly.",
  ];
  return (
    <div className={darkScene(reduced)}>
      <Bleed />
      <SlideChrome caption="Co jsou CX Awards" mark={false} />
      <div className="aw-story">
        <div className="awards-kicker aw-in" style={d(0.1)}>Co jsou CX Awards</div>
        {beats.map((b, i) => (
          <div key={b} className={`aw-beat aw-in${i === beats.length - 1 ? " is-last" : ""}`} style={d(0.4 + i * 0.9)}>
            {b}
          </div>
        ))}
        <div className="aw-story-foot aw-in" style={d(0.4 + beats.length * 0.9)}>
          <span className="aw-pill">{data.organizer}</span>
          <span className="aw-pill">{data.summit}</span>
          <span className="aw-pill">Nezávislá porota</span>
        </div>
      </div>
    </div>
  );
});

export const AwardsCategories = withData(function AwardsCategories({ data, step, reduced }: DataProps) {
  const s = step;
  const max = Math.max(...data.criteria.map((c) => c.weight));
  const n = data.categories.length;
  const juryCats = data.categories.filter((c) => c.decidedBy !== "public").map((c) => c.short ?? c.name);
  return (
    <div className={darkScene(reduced, " aw-cats3")}>
      <Bleed />
      <SlideChrome caption="Tři kategorie" mark={false} />
      <div className="aw-head">
        <div className="awards-kicker aw-in" style={d(0.05)}>Kategorie</div>
        <h2 className="aw-h2 aw-in" style={d(0.15)}>Tři kategorie, jeden cíl.</h2>
      </div>
      <div className="aw-cats">
        {data.categories.map((c, i) => (
          <article key={c.id} className={`aw-glass aw-cat aw-step${on(s >= i)}${c.decidedBy === "public" ? " is-public" : ""}`}>
            <CatIcon id={c.id} className="is-card" />
            <div className="aw-cat-n">{String(i + 1).padStart(2, "0")}</div>
            <div className="aw-cat-name">{c.name}</div>
            <div className="aw-cat-count"><b>{c.count}</b> {c.count < 5 ? "nominace" : "nominací"}</div>
            <div className="aw-cat-who">{c.decidedBy === "public" ? "Rozhodují účastníci summitu" : "Rozhoduje odborná porota"}</div>
          </article>
        ))}
      </div>
      <div className={`aw-crit aw-step${on(s >= n)}`}>
        <div className="aw-crit-label">Porota hodnotí · {juryCats.join(" a ")}</div>
        {data.criteria.map((c, i) => (
          <div key={c.id} className="aw-crit-row" style={d(i * 0.12)}>
            <span className="aw-crit-name">{c.label}</span>
            <span className="aw-crit-track"><span className="aw-crit-bar" style={{ ...d(0.15 + i * 0.12), width: `${(c.weight / max) * 100}%` }} /></span>
            <span className="aw-crit-w">{c.weight} %</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/** Equal-visual-area logo sizing: w·h ≈ A, capped to the box. */
function logoBox(data: AwardsData, company: string, A: number, maxW: number, maxH: number): CSSProperties {
  const r = data.logoRatio?.[company] ?? 3;
  let w = Math.sqrt(A * r), h = w / r;
  if (w > maxW) { w = maxW; h = w / r; }
  if (h > maxH) { h = maxH; w = h * r; }
  return { width: `${Math.round(w)}px`, height: `${Math.round(h)}px`, maxWidth: "none", maxHeight: "none", objectFit: "contain" };
}

function LogoChip({ data, company, className = "" }: { data: AwardsData; company: string; className?: string }) {
  const src = data.logos?.[company];
  const big = className.includes("is-lg");
  return <span className={`aw-chip ${className}`}>{src ? <img src={src} alt={company} style={logoBox(data, company, big ? 7000 : 6000, big ? 250 : 200, big ? 70 : 50)} /> : <em>{company}</em>}</span>;
}

/** Nominations per category — glass cards dealt in one by one (transform/opacity). */
function Nominees({ data, categoryId, reduced, index }: { data: AwardsData; categoryId: AwardCategory["id"]; reduced: boolean; index: number }) {
  const cat = data.categories.find((c) => c.id === categoryId)!;
  const people = cat.decidedBy === "public";
  const size = people ? "is-people" : cat.projects.length > 8 ? "is-many" : "is-few";
  return (
    <div className={darkScene(reduced, ` aw-noms ${size}`)}>
      <Bleed spot={people} />
      <SlideChrome caption={`Nominace · ${cat.short ?? cat.name}`} mark={false} />
      <div className="aw-head">
        <div className="awards-kicker aw-in" style={d(0.05)}>Kategorie {String(index).padStart(2, "0")} · {cat.count} {cat.count < 5 ? "nominace" : "nominací"}</div>
        <h2 className="aw-h2 aw-in" style={d(0.15)}>{cat.name}</h2>
        <CatIcon id={cat.id} className="is-head aw-in" />
      </div>
      <div className="aw-nom-grid">
        {cat.projects.map((p, i) => (
          <article key={p.company + p.project} className="aw-glass aw-nom" style={{ ...d((people ? 0.6 : 0.4) + i * (people ? 0.35 : 0.08)) } as CSSProperties}>
            {people && data.people?.[p.person ?? ""] ? <span className="aw-nom-photo"><img src={data.people[p.person!]} alt={p.person} /></span> : null}
            <LogoChip data={data} company={p.company} className={size === "is-many" ? "" : "is-lg"} />
            {p.person ? <div className="aw-nom-person">{p.person}</div> : null}
            <div className="aw-nom-title">{p.project}</div>
          </article>
        ))}
      </div>
    </div>
  );
}

export const AwardsNomImpact = withData(function AwardsNomImpact({ data, reduced }: DataProps) {
  return <Nominees data={data} categoryId="impact" reduced={reduced} index={1} />;
});
export const AwardsNomPulse = withData(function AwardsNomPulse({ data, reduced }: DataProps) {
  return <Nominees data={data} categoryId="pulse" reduced={reduced} index={2} />;
});
export const AwardsNomChange = withData(function AwardsNomChange({ data, reduced }: DataProps) {
  return <Nominees data={data} categoryId="changemakers" reduced={reduced} index={3} />;
});

function hash(i: number, n: number) {
  return (((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1;
}

export const AwardsEntrants = withData(function AwardsEntrants({ data, reduced }: DataProps) {
  const companies = Array.from(new Set(data.categories.flatMap((c) => c.projects.map((p) => p.company))))
    .sort((a, b) => a.localeCompare(b, "cs"));
  const total = data.categories.reduce((n, c) => n + c.count, 0);
  return (
    <div className={darkScene(reduced, " is-light")}>
      <Bleed />
      <SlideChrome caption="Kdo je nominován" mark={false} />
      <div className="aw-head">
        <div className="awards-kicker aw-in" style={d(0.05)}>Nominace · tři kategorie</div>
        <h2 className="aw-h2">
          <span className="aw-in aw-big" style={d(0.2)}>{total}</span> <span className="aw-in" style={d(0.35)}>nominací</span>{" "}
          <span className="aw-in aw-dim" style={d(0.5)}>·</span>{" "}
          <span className="aw-in aw-big" style={d(0.6)}>{companies.length}</span> <span className="aw-in" style={d(0.75)}>firem</span>
        </h2>
      </div>
      <div className="aw-wall">
        {companies.map((name, i) => (
          <span
            key={name}
            className="aw-brick"
            style={{
              ...d(0.9 + i * 0.07),
              "--x": `${(hash(i, 1) - 0.5) * 520}px`,
              "--y": `${(hash(i, 2) - 0.2) * 360}px`,
              "--r": `${(hash(i, 3) - 0.5) * 24}deg`,
            } as CSSProperties}
          >
            {data.logos?.[name] ? <img src={data.logos[name]} alt={name} style={logoBox(data, name, 6400, 180, 76)} /> : <em>{name}</em>}
          </span>
        ))}
      </div>
    </div>
  );
});

export const AwardsPrizes = withData(function AwardsPrizes({ reduced }: DataProps) {
  return (
    <div className={darkScene(reduced)}>
      <Bleed spot />
      <SlideChrome caption="Kdo rozhoduje" mark={false} />
      <div className="aw-head is-center">
        <div className="awards-kicker aw-in" style={d(0.05)}>Kdo rozhoduje</div>
        <h2 className="aw-h2 aw-in" style={d(0.15)}>Dvě ceny. Dva pohledy.</h2>
      </div>
      <div className="aw-pillars">
        <div className="aw-pillar aw-glass is-jury" style={d(0.45)}>
          <Trophy />
          <div className="aw-pillar-label">Odborníci</div>
          <div className="aw-pillar-name">Hlas poroty</div>
          <div className="aw-pillar-sub">Experience Impact a Employee Pulse</div>
        </div>
        <div className="aw-pillar aw-glass is-public" style={d(0.75)}>
          <People />
          <div className="aw-pillar-label">Publikum</div>
          <div className="aw-pillar-name">Hlas lidu</div>
          <div className="aw-pillar-sub">CX Changemakers\u2019 Award · hlasování účastníků</div>
        </div>
      </div>
    </div>
  );
});

function Reveal({ data, categoryId, step, reduced }: { data: AwardsData; categoryId: AwardCategory["id"]; step: number; reduced: boolean }) {
  const cat = data.categories.find((c) => c.id === categoryId)!;
  // 0 = suspense · 1 = 3rd · 2 = 2nd · 3 = 1st (burst) · 4 = Hlas lidu (placeholder)
  const s = Math.min(Math.max(step, 0), 4);
  const byRank = (r: number) => cat.jury.find((j) => j.rank === r)!;
  return (
    <div className={darkScene(reduced, ` aw-reveal${s >= 3 ? " is-won" : ""}`)}>
      <Bleed spot />
      <SlideChrome mark={false} />
      <div className="aw-head is-center">
        <div className="awards-kicker aw-in" style={d(0.05)}>Hlas poroty</div>
        <h2 className="aw-h2 aw-in" style={d(0.15)}>{cat.name}</h2>
      </div>
      <div className={`aw-suspense${s >= 1 ? " is-off" : ""}`}>
        <span className="aw-in" style={d(0.5)}>A cenu poroty získává</span>
        <span className="aw-dots" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className="aw-burst" aria-hidden="true"><i className="aw-rays" /><i className="aw-ring" /></div>
      <div className="aw-podium">
        {[2, 1, 3].map((rank) => {
          const p = byRank(rank);
          const visible = s >= 4 - rank;
          return (
            <div key={rank} className={`aw-slot is-${rank}${on(visible)}`}>
              <article className="aw-glass aw-winner">
                <div className="aw-winner-rank">{rank}. místo</div>
                <div className="aw-winner-co">{data.logos?.[p.company] ? <span className="aw-winner-logo"><img src={data.logos[p.company]} alt="" style={logoBox(data, p.company, 6800, 220, 64)} /></span> : null}{p.company}</div>
                <div className="aw-winner-pr">{p.project}</div>
              </article>
              <div className="aw-ped"><span>{rank}</span></div>
            </div>
          );
        })}
      </div>
      <div className={`aw-public aw-step${on(s >= 4)}`}>
        <People className="is-sm" />
        <span className="aw-public-label">Hlas lidu</span>
        <span className="aw-public-ph">doplníme</span>
      </div>
    </div>
  );
}

export const AwardsImpact = withData(function AwardsImpact({ step, data, reduced }: DataProps) {
  return <Reveal data={data} categoryId="impact" step={step} reduced={reduced} />;
});

export const AwardsPulse = withData(function AwardsPulse({ step, data, reduced }: DataProps) {
  return <Reveal data={data} categoryId="pulse" step={step} reduced={reduced} />;
});

/** Changemakers — decided by summit attendees: finalists, then winner placeholder. */
export const AwardsChange = withData(function AwardsChange({ step, data, reduced }: DataProps) {
  const cat = data.categories.find((c) => c.id === "changemakers")!;
  const s = Math.min(Math.max(step, 0), 1);
  return (
    <div className={darkScene(reduced, " aw-reveal aw-change")}>
      <Bleed spot />
      <SlideChrome mark={false} />
      <div className="aw-head is-center">
        <div className="awards-kicker aw-in" style={d(0.05)}>Hlas lidu · rozhodli účastníci summitu</div>
        <h2 className="aw-h2 aw-in" style={d(0.15)}>{cat.name}</h2>
      </div>
      <div className="aw-change-row">
        {cat.projects.map((p, i) => (
          <article key={p.project} className={`aw-glass aw-change-card aw-in${s >= 1 ? " is-dim" : ""}`} style={d(0.45 + i * 0.25)}>
            {data.people?.[p.person ?? ""] ? <span className="aw-nom-photo"><img src={data.people[p.person!]} alt="" /></span> : null}
            <LogoChip data={data} company={p.company} className="is-lg" />
            <div className="aw-nom-person">{p.person}</div>
          </article>
        ))}
      </div>
      <div className={`aw-suspense aw-change-sus${s >= 1 ? " is-off" : ""}`}>
        <span className="aw-in" style={d(1)}>Cenu získává</span>
        <span className="aw-dots" aria-hidden="true"><i /><i /><i /></span>
      </div>
      <div className={`aw-public aw-step aw-change-win${on(s >= 1)}`}>
        <People className="is-sm" />
        <span className="aw-public-label">Vítěz</span>
        <span className="aw-public-ph">doplníme</span>
      </div>
    </div>
  );
});
