import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { EASE } from "../../engine/motion";
import { useAdjacentStep } from "../../engine/useAdjacentStep";
import { SlideChrome } from "../../components/SlideChrome";
import { GlassStats } from "../../components/GlassStats";
import { asset } from "../../engine/assets";

export function Thesis({ step, reduced: _reduced }: SceneProps) {
  void _reduced;
  return (
    <div className="scene">
      <SlideChrome kicker="06 Adopce" page="11 / 70" caption="Od zvědavosti k praxi" />
      <div className="abs" style={{ left: 80, top: 340, right: 160 }}>
        {step === 0 ? (
          <>
            <div className="hero" style={{ fontSize: 80, maxWidth: "14ch", color: "var(--text-deep)" }}>
              AI už je součástí
              <br />
              každodenního života.
            </div>
            <div className="intel" style={{ width: 120, marginTop: 28 }} />
          </>
        ) : (
          <div className="hero" style={{ fontSize: 80, maxWidth: "16ch", color: "var(--text-deep)" }}>
            AI už je součástí
            <br />
            každodenního života.
          </div>
        )}
      </div>
    </div>
  );
}

const ADOPTION_TITLE = [
  ["AI", "už", "je", "součástí"],
  ["každodenního", "života."],
];

const ADOPTION_STATS = [
  { id: "72", value: 72, unit: "%", cap: "Čechů už AI používá" },
  { id: "38", value: 38, unit: "%", cap: "evropských respondentů používá AI při nákupu" },
  { id: "63", value: 63, unit: "%", cap: "uživatelů AI porovnává produkty a značky" },
] as const;

export function Adoption({ step, reduced }: SceneProps) {
  return (
    <GlassStats
      step={step}
      reduced={reduced}
      chrome={{
        kicker: "10 Adopce",
        page: "10 / 75",
        caption: "CVVM · Eurostat · McKinsey 2026",
      }}
      title={ADOPTION_TITLE}
      stats={[ADOPTION_STATS[0], ADOPTION_STATS[1], ADOPTION_STATS[2]]}
    />
  );
}

export function Normalization({ step }: SceneProps) {
  return (
    <div className="scene">
      <SlideChrome kicker="07 Hodnota" page={step === 0 ? "12 / 70" : "13 / 70"} caption="Od aktivity k dopadu" />
      <div className="abs" style={{ left: 80, top: 320, right: 160 }}>
        <div className="hero" style={{ fontSize: 72, maxWidth: "16ch", color: "var(--text-deep)" }}>
          AI používá skoro každý.
          <br />
          Hodnotu vytváří jen málokdo.
        </div>
      </div>
    </div>
  );
}

export function ValueGap({ step }: SceneProps) {
  void step;
  return (
    <div className="scene is-value-gap">
      <SlideChrome kicker="11 Hodnota" page="11 / 75" caption="Od aktivity k dopadu" captionDot mark={false} />
      <div className="value-gap-copy">
        <div data-hero-title className="value-gap-title">
          AI používá skoro každý.
          <br />
          Hodnotu vytváří jen málokdo.
        </div>
        <div className="value-gap-stats">
          <div>
            <div className="value-gap-num is-low">5 %</div>
            <div className="value-gap-cap">vytváří díky AI významnou hodnotu ve velkém měřítku.</div>
          </div>
          <div className="value-gap-rule" />
          <div>
            <div className="value-gap-num">60 %</div>
            <div className="value-gap-cap">organizací uvádí, že AI přinesla jen malý nebo žádný přínos.</div>
          </div>
        </div>
        <div className="source value-gap-source">BCG The Widening AI Value Gap 09/2025</div>
      </div>
      <div className="value-gap-cover">
        <img
          data-hero-visual
          src={asset("bcg-cover.jpg")}
          alt="BCG The Widening AI Value Gap"
        />
      </div>
    </div>
  );
}

const TWIST_LINES = [
  ["Problém", "je,", "že", "AI"],
  ["jen", "přidáváme", "do"],
  ["světa,", "který", "jsme"],
  ["navrhli", "bez", "ní."],
] as const;

export function Twist({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const adjacent = useAdjacentStep(step);
  const reveal = step >= 1;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const title = root.current?.querySelector<HTMLElement>("[data-hero-title]");
      const more = root.current?.querySelector<HTMLElement>("[data-twist-more]");
      const words = gsap.utils.toArray<HTMLElement>("[data-twist-word]", root.current);
      if (!title || !more) return;
      const instant = reduced || !adjacent;
      const hero = { fontSize: 128, fontWeight: 800, letterSpacing: "-0.055em", marginBottom: 0 };
      const kicker = { fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 28 };

      const asKicker = (on: boolean) => title.classList.toggle("is-kicker", on);

      if (!reveal) {
        asKicker(false);
        gsap.set(title, { ...hero, color: "#03383d" });
        gsap.set(more, { height: 0, marginTop: 0 });
        gsap.set(words, { autoAlpha: 0, y: 10 });
        return;
      }

      if (instant) {
        asKicker(true);
        gsap.set(title, { ...kicker, color: "#03383d" });
        gsap.set(more, { height: "auto" });
        gsap.set(words, { autoAlpha: 1, y: 0 });
        return;
      }

      asKicker(false);
      gsap.set(title, { ...hero, color: "#03383d" });
      gsap.set(more, { height: "auto" });
      gsap.set(words, { autoAlpha: 0, y: 10 });
      const tl = gsap.timeline();
      tl.to(title, { ...kicker, duration: 0.72, ease: "power3.inOut", onUpdate() {
        if (!title.classList.contains("is-kicker") && Number(gsap.getProperty(title, "fontSize")) < 72) asKicker(true);
      } }, 0);
      tl.to(words, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter, stagger: 0.08 }, 0.52);
    }, root);
    return () => ctx.revert();
  }, [step, reduced, adjacent, reveal]);

  return (
    <div ref={root} className="scene">
      <SlideChrome kicker="12 Zásadní poznání" page={step === 0 ? "12 / 75" : "13 / 75"} caption="Od technologie k systému" captionDot mark={false} />
      <img
        data-hero-visual
        src={asset("ai-cutout.webp")}
        alt=""
        className="cutout abs"
        style={{
          height: "100%",
          width: "auto",
          maxWidth: "54%",
          right: 0,
          top: 0,
          bottom: 0,
          objectFit: "contain",
          objectPosition: "right center",
        }}
      />
      <div className="safe twist-copy">
        <div data-hero-title className="twist-title">
          Problém<span data-twist-break> </span><span className="twist-strong">není AI</span><span style={{ color: "var(--lime)" }}>.</span>
        </div>
        <div data-twist-more className="twist-more">
          {TWIST_LINES.map((line, i) => (
            <div key={line.join(" ")} data-twist-line style={{ whiteSpace: "nowrap" }}>
              {line.map((word, wi) => (
                <span
                  key={`${i}-${word}`}
                  data-twist-word
                  className={word === "bez" || word === "ní." ? "is-punch" : undefined}
                  style={{ display: "inline-block" }}
                >
                  {wi > 0 ? "\u00a0" : ""}
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
