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

const GAP_STATS = [
  { id: "low", value: 5, cap: "vytváří díky AI významnou hodnotu ve velkém měřítku.", tag: "Hodnota ve velkém" },
  { id: "none", value: 60, cap: "organizací uvádí, že AI přinesla jen malý nebo žádný přínos.", tag: "Malý nebo žádný přínos" },
] as const;

export function ValueGap({ step, reduced }: SceneProps) {
  void step;
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-vg-card]", el);
      const nums = gsap.utils.toArray<HTMLElement>("[data-vg-num]", el);
      const caps = gsap.utils.toArray<HTMLElement>("[data-vg-cap]", el);
      const frame = el.querySelector<HTMLElement>("[data-vg-frame]");
      const source = el.querySelector<HTMLElement>("[data-vg-source]");
      const grids = cards.map((card) => gsap.utils.toArray<HTMLElement>("[data-vg-dot].is-on", card));
      const settle = () => {
        nums.forEach((n, i) => { n.textContent = String(GAP_STATS[i].value); });
      };
      settle();
      if (reduced) return;
      gsap.set(cards, { autoAlpha: 0, y: 26 });
      gsap.set(caps, { autoAlpha: 0, y: 8 });
      gsap.set(grids.flat(), { scale: 0.2, autoAlpha: 0.15 });
      gsap.set(frame, { autoAlpha: 0, x: 60, rotate: 4 });
      gsap.set(source, { autoAlpha: 0 });
      nums.forEach((n) => { n.textContent = "0"; });
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(cards, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.14, ease: EASE.enter }, 0.25);
      // 60 % first: almost everyone uses AI, most see little value…
      const order = [1, 0];
      order.forEach((ci, k) => {
        const t = 0.8 + k * 1.15;
        const dots = grids[ci];
        const counter = { v: 0 };
        tl.to(dots, { scale: 1, autoAlpha: 1, duration: 0.22, stagger: { each: ci === 1 ? 0.012 : 0.14 }, ease: "back.out(2)" }, t);
        tl.to(counter, { v: GAP_STATS[ci].value, duration: ci === 1 ? 0.8 : 0.7, ease: "power2.out", onUpdate: () => { nums[ci].textContent = String(Math.round(counter.v)); } }, t);
        tl.to(caps[ci], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, t + 0.4);
      });
      // …the source report lands as evidence.
      tl.to(frame, { autoAlpha: 1, x: 0, rotate: 2, duration: 0.7, ease: EASE.move }, 2.9);
      tl.to(source, { autoAlpha: 1, duration: 0.4 }, 3.3);
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="scene is-value-gap vg2">
      <SlideChrome kicker="11 Hodnota" page="11 / 75" caption="Od aktivity k dopadu" captionDot mark={false} />
      <div className="vg2-copy">
        <div data-hero-title className="vg2-title">
          AI používá skoro každý.
          <br />
          Hodnotu vytváří jen málokdo<span className="vg2-dot">.</span>
        </div>
      </div>
      <div className="vg2-stats">
        {GAP_STATS.map((stat) => (
          <section key={stat.id} data-vg-card className={`vg2-card is-${stat.id}`}>
            <div className="vg2-tag">{stat.tag}</div>
            <div className="vg2-num"><span data-vg-num>{stat.value}</span><small> %</small></div>
            <div className="vg2-grid" aria-hidden="true">
              {Array.from({ length: 100 }, (_, i) => (
                <i key={i} data-vg-dot className={i < stat.value ? "is-on" : undefined} />
              ))}
            </div>
            <p data-vg-cap className="vg2-cap">{stat.cap}</p>
          </section>
        ))}
      </div>
      <div data-hero-visual className="vg2-cover">
        <figure data-vg-frame className="vg2-frame">
          <img src={asset("bcg-cover.jpg")} alt="BCG The Widening AI Value Gap" />
        </figure>
        <div data-vg-source className="vg2-source">Zdroj: BCG, The Widening AI Value Gap, 09/2025</div>
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
