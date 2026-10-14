import { useEffect, useRef, useState, type FormEvent, type JSX } from "react";
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

export const AwardsOpen = withData(function AwardsOpen({ data }: DataProps) {
  return (
    <div className="scene is-awards-dark is-cinematic">
      <SlideChrome caption={`${data.summit} · ${data.date}`} mark={false} />
      <div className="safe" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="awards-kicker">{data.organizer}</div>
        <h1 className="awards-title">CX Awards<br />2026</h1>
        <div className="awards-rule" />
        <div className="awards-sub">Představení a vyhlášení výsledků</div>
      </div>
    </div>
  );
});

export const AwardsWhat = withData(function AwardsWhat({ data }: DataProps) {
  return (
    <div className="scene">
      <SlideChrome kicker="CX Awards" page="00 / 00" caption="Co jsou CX Awards" captionDot />
      <div className="awards-copy">
        <div className="awards-kicker">{data.organizer}</div>
        <div className="awards-title" style={{ maxWidth: "18ch" }}>Ocenění zkušeností, které opravdu fungují.</div>
        <div className="awards-sub" style={{ maxWidth: "36ch" }}>
          CX Awards pořádá {data.organizer} v rámci {data.summit}. Porota hodnotí projekty podle čtyř vážených kritérií.
        </div>
      </div>
    </div>
  );
});

export const AwardsCategories = withData(function AwardsCategories({ data }: DataProps) {
  return (
    <div className="scene">
      <SlideChrome kicker="CX Awards" page="00 / 00" caption="Dvě kategorie · čtyři kritéria" captionDot />
      <div className="awards-copy" style={{ top: 130 }}>
        <div className="awards-kicker">Kategorie a kritéria</div>
      </div>
      <div className="awards-grid is-2" style={{ top: 190, bottom: "auto" }}>
        {data.categories.map((c, i) => (
          <article key={c.id} className="awards-card">
            <div className="awards-card-n">{String(i + 1).padStart(2, "0")}</div>
            <div className="awards-card-title">{c.name}</div>
            <div className="awards-card-sub">{c.count} projektů</div>
          </article>
        ))}
      </div>
      <div className="awards-grid is-4">
        {data.criteria.map((c) => (
          <article key={c.id} className="awards-card">
            <div className="awards-card-weight">{c.weight}<small>%</small></div>
            <div className="awards-card-sub" style={{ marginTop: 10 }}>{c.label}</div>
          </article>
        ))}
      </div>
    </div>
  );
});

export const AwardsEntrants = withData(function AwardsEntrants({ data }: DataProps) {
  const companies = Array.from(new Set(data.categories.flatMap((c) => c.projects.map((p) => p.company))))
    .sort((a, b) => a.localeCompare(b, "cs"));
  const total = data.categories.reduce((n, c) => n + c.count, 0);
  const [a, b] = data.categories;
  return (
    <div className="scene">
      <SlideChrome kicker="CX Awards" page="00 / 00" caption="Kdo se přihlásil" captionDot />
      <div className="awards-copy" style={{ top: 140 }}>
        <div className="awards-kicker">Přihlášené projekty</div>
        <div className="awards-title" style={{ fontSize: 72, maxWidth: "none" }}>{total} projektů · {companies.length} firem</div>
        <div className="awards-sub" style={{ maxWidth: "44ch", fontSize: 26 }}>
          {a.count} v {a.name.replace("The ", "")}, {b.count} v {b.name.replace("The ", "")}.
        </div>
      </div>
      <div className="awards-logos" aria-label="Firmy">
        {companies.map((name) => (
          <span key={name} className="awards-logo">{name}</span>
        ))}
      </div>
    </div>
  );
});

export const AwardsPrizes = withData(function AwardsPrizes({ data }: DataProps) {
  return (
    <div className="scene is-awards-dark is-cinematic">
      <SlideChrome caption="Dvě ceny v každé kategorii" mark={false} />
      <div className="safe" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="awards-kicker">V každé kategorii</div>
        <h1 className="awards-title" style={{ fontSize: 76, maxWidth: "16ch" }}>Hlas poroty &amp; Hlas lidu</h1>
        <div className="awards-prize-row">
          {data.prizes.map((p, i) => (
            <div key={p} className="awards-prize">
              <div className="awards-prize-label">{i === 0 ? "Porota" : "Publikum"}</div>
              <div className="awards-prize-name">{p}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

function Reveal({ data, categoryId, step }: { data: AwardsData; categoryId: AwardCategory["id"]; step: number }) {
  const cat = data.categories.find((c) => c.id === categoryId)!;
  // 0 = stage set · 1 = 3rd · 2 = 2nd · 3 = 1st · 4 = Hlas lidu (placeholder)
  const show = Math.min(Math.max(step, 0), 4);
  const byRank = (r: number) => cat.jury.find((j) => j.rank === r)!;
  return (
    <div className="scene">
      <SlideChrome kicker="CX Awards" page="00 / 00" caption={`${cat.name} · vyhlášení`} captionDot />
      <div className="awards-copy" style={{ top: 120 }}>
        <div className="awards-kicker">Hlas poroty</div>
        <div className="awards-title" style={{ fontSize: 56, maxWidth: "none" }}>{cat.name}</div>
      </div>
      <div className="awards-reveal" style={{ top: 200, bottom: 190 }}>
        <div className="awards-podium">
          {[2, 1, 3].map((rank) => {
            const place = byRank(rank);
            const visible = show >= 4 - rank;
            return (
              <article key={rank} className={`awards-place is-${rank}${visible ? " is-on" : ""}`}>
                <div className="awards-place-rank">{rank}. místo</div>
                <div className="awards-place-company">{place.company}</div>
                <div className="awards-place-project">{place.project}</div>
              </article>
            );
          })}
        </div>
      </div>
      <div className={`awards-public${show >= 4 ? " is-on" : ""}`}>
        <div className="awards-public-label">Hlas lidu</div>
        <div className="awards-public-name"><span className="awards-public-ph">doplníme</span></div>
      </div>
    </div>
  );
}

export const AwardsImpact = withData(function AwardsImpact({ step, data }: DataProps) {
  return <Reveal data={data} categoryId="impact" step={step} />;
});

export const AwardsPulse = withData(function AwardsPulse({ step, data }: DataProps) {
  return <Reveal data={data} categoryId="pulse" step={step} />;
});
