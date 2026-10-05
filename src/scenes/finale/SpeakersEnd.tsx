import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE, shouldAnimate } from "../../engine/motion";
import { useAdjacentStep } from "../../engine/useAdjacentStep";

/**
 * Click-driven speaker sequence (Experience Summit main stage).
 * step 0–4: featured speaker (large portrait right, talk copy left)
 * click parks them into a top dock chip with a fly/scale wow, then next enters
 * step 5: all five chips lined up
 */
const SPEAKERS = [
  {
    id: "jakub",
    n: "01",
    name: "Jakub Petřina",
    role: "Head of Brand Strategy",
    org: "PPF",
    topic: "Od rychlých člunů po zaoceánské tankery",
    time: "9:45–10:15",
    photo: "speakers/jakub-cut.webp",
  },
  {
    id: "dejan",
    n: "02",
    name: "Dejan Krstic",
    role: "Group Product Manager",
    org: "ex-Spotify",
    topic: "Od softwaru ke kontextu — produktový cyklus v éře AI",
    time: "10:15–10:45",
    photo: "speakers/dejan-cut.webp",
  },
  {
    id: "michaela",
    n: "03",
    name: "Michaela Edgerley Stovicek",
    role: "Global Head of Preschool Audience",
    org: "the LEGO Group",
    topic: "„Jen to nejlepší je dost dobré“ v éře umělé inteligence",
    time: "11:15–12:00",
    photo: "speakers/michaela-cut.webp",
  },
  {
    id: "krystof",
    n: "04",
    name: "Vladimír Kryštof Maliňák",
    role: "Produktový designér",
    org: "the LEGO Group",
    topic: "„Jen to nejlepší je dost dobré“ v éře umělé inteligence",
    time: "11:15–12:00",
    photo: "speakers/krystof-cut.webp",
  },
  {
    id: "milos",
    n: "05",
    name: "Miloš Nejezchleb",
    role: "Chief People Care & MKT Officer",
    org: "Home Credit CZ/SK",
    topic: "Anatomie úspěšného týmu — vztahy a kultura řídí výsledky",
    time: "12:00–12:30",
    photo: "speakers/milos-cut.webp",
  },
] as const;

export function SpeakersEnd({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prevStep = useRef<number | null>(null);
  const adjacent = useAdjacentStep(step);
  const animate = shouldAnimate(reduced, adjacent);

  const parked = Math.min(Math.max(step, 0), SPEAKERS.length);
  const featIdx = step < SPEAKERS.length ? step : -1;
  const featured = featIdx >= 0 ? SPEAKERS[featIdx] : null;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const chips = gsap.utils.toArray<HTMLElement>("[data-sp-chip]", el);
    const feature = el.querySelector<HTMLElement>("[data-sp-feature]");
    const hero = el.querySelector<HTMLElement>("[data-sp-hero]");
    const soft = el.querySelector<HTMLElement>("[data-sp-soft]");
    const copy = el.querySelector<HTMLElement>("[data-sp-copy]");
    const finale = el.querySelector<HTMLElement>("[data-sp-finale]");
    const from = prevStep.current;
    prevStep.current = step;

    const settleChips = () => {
      chips.forEach((chip, i) => {
        gsap.set(chip, { autoAlpha: i < parked ? 1 : 0, scale: 1, y: 0, x: 0 });
      });
    };

    const settleFeature = () => {
      if (featured && feature && hero && soft && copy) {
        gsap.set(feature, { autoAlpha: 1 });
        gsap.set(hero, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: "filter" });
        gsap.set(soft, { autoAlpha: 0.22, x: 0, scale: 1.1, filter: "blur(22px)" });
        gsap.set(copy, { autoAlpha: 1, x: 0, y: 0 });
      } else if (feature) {
        gsap.set(feature, { autoAlpha: 0 });
      }
      if (finale) {
        gsap.set(finale, {
          autoAlpha: step >= SPEAKERS.length ? 1 : 0,
          y: 0,
        });
      }
    };

    // Instant settle (reduced / deep-link)
    if (reduced || (from === null && step !== 0)) {
      settleChips();
      settleFeature();
      return;
    }

    // First paint on step 0 — Petřina enters from the right
    if (from === null && step === 0 && featured && hero && soft && copy && feature) {
      settleChips();
      gsap.set(feature, { autoAlpha: 1 });
      gsap.set(hero, { autoAlpha: 0, x: 72, scale: 0.97, filter: "blur(4px)" });
      gsap.set(soft, { autoAlpha: 0, x: 72, scale: 1.02, filter: "blur(14px)" });
      gsap.set(copy, { autoAlpha: 0, x: -28, y: 10 });
      if (finale) gsap.set(finale, { autoAlpha: 0 });
      const intro = gsap.timeline();
      intro.to(soft, { autoAlpha: 0.22, x: 0, scale: 1.1, filter: "blur(22px)", duration: 1.15, ease: EASE.move }, 0.12);
      intro.to(hero, { autoAlpha: 1, x: 0, scale: 1, filter: "blur(0px)", duration: 1.25, ease: EASE.enter, clearProps: "filter", onComplete: () => { gsap.set(hero, { clearProps: "filter" }); } }, 0.14);
      intro.to(copy, { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: EASE.enter }, 0.28);
      return () => intro.kill();
    }

    if (!animate || from === null) {
      settleChips();
      settleFeature();
      return;
    }

    const prev = from;
    const advancing = step > prev;
    const tl = gsap.timeline({
      onComplete: () => {
        el.querySelectorAll(".sp-fly").forEach((n) => n.remove());
      },
    });

    if (advancing && prev < SPEAKERS.length) {
      const parkIdx = prev;
      const chip = chips[parkIdx];
      const outgoing = SPEAKERS[parkIdx];
      if (chip) {
        // Measure where the featured hero currently is (next speaker may already be painted —
        // use a synthetic ghost from the outgoing asset starting at the hero frame).
        const slot = el.querySelector<HTMLElement>("[data-sp-hero-slot]");
        const heroFrame =
          slot?.getBoundingClientRect() ??
          hero?.getBoundingClientRect() ??
          ({ left: 1100, top: 220, width: 700, height: 860 } as DOMRect);
        const chipRect = chip.getBoundingClientRect();
        const stage = el.getBoundingClientRect();
        const sx = stage.width / 1920 || 1;

        const ghost = document.createElement("img");
        ghost.className = "sp-fly cutout";
        ghost.src = asset(outgoing.photo);
        ghost.alt = "";
        Object.assign(ghost.style, {
          position: "absolute",
          left: `${(heroFrame.left - stage.left) / sx}px`,
          top: `${(heroFrame.top - stage.top) / sx}px`,
          width: `${heroFrame.width / sx}px`,
          height: `${heroFrame.height / sx}px`,
          objectFit: "contain",
          objectPosition: "center bottom",
          zIndex: "24",
          pointerEvents: "none",
          filter: "drop-shadow(0 18px 36px rgba(3,56,61,0.22))",
        });
        el.appendChild(ghost);

        gsap.set(chip, { autoAlpha: 0, scale: 0.98, y: 6 });
        // Hide the newly painted featured briefly while park flies
        if (hero) gsap.set(hero, { autoAlpha: 0 });
        if (soft) gsap.set(soft, { autoAlpha: 0 });
        if (copy) gsap.set(copy, { autoAlpha: 0, x: -16 });

        tl.to(
          ghost,
          {
            left: (chipRect.left - stage.left) / sx + 14,
            top: (chipRect.top - stage.top) / sx + 6,
            width: 92,
            height: 116,
            duration: 1.55,
            ease: "sine.inOut",
            onComplete: () => ghost.remove(),
          },
          0,
        );
        tl.to(
          chip,
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.95, ease: EASE.enter },
          1.2,
        );
      }
    } else {
      settleChips();
    }

    // Ensure already-parked chips stay visible when advancing mid-sequence
    chips.forEach((chip, i) => {
      if (i < parked && !(advancing && i === prev)) {
        gsap.set(chip, { autoAlpha: 1, scale: 1, y: 0 });
      }
      if (i >= parked) gsap.set(chip, { autoAlpha: 0 });
    });

    const enterAt = advancing && prev < SPEAKERS.length ? 1.15 : 0.12;

    if (featured && feature && hero && soft && copy) {
      gsap.set(feature, { autoAlpha: 1 });
      gsap.set(hero, { autoAlpha: 0, x: 64, scale: 0.97, filter: "blur(4px)" });
      gsap.set(soft, { autoAlpha: 0, x: 64, scale: 1.0, filter: "blur(14px)" });
      gsap.set(copy, { autoAlpha: 0, x: -28, y: 10 });

      tl.to(
        soft,
        {
          autoAlpha: 0.22,
          x: 0,
          scale: 1.1,
          filter: "blur(22px)",
          duration: 1.15,
          ease: EASE.move,
        },
        enterAt,
      );
      tl.to(
        hero,
        {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.25,
          ease: EASE.enter,
          onComplete: () => { gsap.set(hero, { clearProps: "filter" }); },
        },
        enterAt + 0.06,
      );
      tl.to(
        copy,
        { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: EASE.enter },
        enterAt + 0.18,
      );
    } else if (feature) {
      tl.set(feature, { autoAlpha: 0 }, enterAt);
    }

    if (finale) {
      if (step >= SPEAKERS.length) {
        gsap.set(finale, { autoAlpha: 0, y: 16 });
        tl.to(finale, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.enter }, 1.05);
      } else {
        gsap.set(finale, { autoAlpha: 0 });
      }
    }

    if (!advancing) {
      tl.kill();
      settleChips();
      settleFeature();
    }

    return () => {
      tl.kill();
      el.querySelectorAll(".sp-fly").forEach((n) => n.remove());
    };
  }, [step, reduced, animate, parked, featured, featIdx]);

  return (
    <div ref={root} className="scene sp-stage">
      <SlideChrome kicker="ZÁVĚR / EXPERIENCE SUMMIT" page="67 / 67" />

      <div className="sp-dock">
        {SPEAKERS.map((s) => (
          <article key={s.id} data-sp-chip={s.id} className="sp-chip">
            <img className="sp-chip-photo cutout" src={asset(s.photo)} alt="" />
            <div className="sp-chip-body">
              <span className="sp-chip-n">{s.n}</span>
              <div className="sp-chip-name">{s.name}</div>
              <div className="sp-chip-role">
                {s.org} · {s.time}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div data-sp-finale className="sp-finale">
        <div className="sp-finale-kicker">EXPERIENCE SUMMIT 2026</div>
        <div className="sp-finale-title">
          Pět hlasů, které dnes posouvají experience <em>v praxi</em>.
        </div>
      </div>

      <div data-sp-hero-slot className="sp-hero-slot" aria-hidden="true" />
      <div data-sp-feature className="sp-feature">
        {featured && (
          <>
            <div data-sp-copy className="sp-feature-copy">
              <div className="sp-feature-n">{featured.n}</div>
              <div className="sp-feature-time">{featured.time}</div>
              <h2 className="sp-feature-topic">{featured.topic}</h2>
              <div className="sp-feature-name">{featured.name}</div>
              <div className="sp-feature-role">
                {featured.role}
                <span className="sp-feature-org"> · {featured.org}</span>
              </div>
            </div>
            <img
              data-sp-soft
              className="sp-hero sp-hero-soft cutout"
              src={asset(featured.photo)}
              alt=""
            />
            <img
              data-sp-hero
              data-art
              className="sp-hero cutout"
              src={asset(featured.photo)}
              alt=""
            />
          </>
        )}
      </div>
    </div>
  );
}
