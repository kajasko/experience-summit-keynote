import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE, shouldAnimate } from "../../engine/motion";
import { useAdjacentStep } from "../../engine/useAdjacentStep";

/**
 * Click-driven speaker sequence.
 * Each portrait is a single persistent <img> that FLIPs from hero → dock
 * (no soft-layer halo, no hide/remount during the fly).
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

function stageBox(el: HTMLElement, stage: DOMRect, sx: number) {
  const r = el.getBoundingClientRect();
  return {
    left: (r.left - stage.left) / sx,
    top: (r.top - stage.top) / sx,
    width: r.width / sx,
    height: r.height / sx,
  };
}

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

    const stage = el.getBoundingClientRect();
    const sx = stage.width / 1920 || 1;
    const heroSlot = el.querySelector<HTMLElement>("[data-sp-hero-slot]");
    const finale = el.querySelector<HTMLElement>("[data-sp-finale]");
    const copy = el.querySelector<HTMLElement>("[data-sp-copy]");
    const chips = gsap.utils.toArray<HTMLElement>("[data-sp-chip]", el);
    const portraits = SPEAKERS.map(
      (s) => el.querySelector<HTMLElement>(`[data-sp-portrait="${s.id}"]`)!,
    );

    const from = prevStep.current;
    prevStep.current = step;

    const heroBox = heroSlot
      ? stageBox(heroSlot, stage, sx)
      : { left: 1100, top: 200, width: 760, height: 860 };

    const chipBox = (i: number) => {
      const slot = chips[i]?.querySelector<HTMLElement>("[data-sp-chip-slot]");
      return slot ? stageBox(slot, stage, sx) : { left: 80 + i * 360, top: 100, width: 88, height: 110 };
    };

    const place = (img: HTMLElement, box: { left: number; top: number; width: number; height: number }, visible: boolean) => {
      gsap.set(img, {
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: visible ? 1 : 0,
        zIndex: visible ? 12 : 1,
      });
    };

    const settle = () => {
      portraits.forEach((img, i) => {
        if (i < parked) {
          place(img, chipBox(i), true);
          gsap.set(img, { zIndex: 8 });
        } else if (i === featIdx) {
          place(img, heroBox, true);
          gsap.set(img, { zIndex: 12 });
        } else {
          place(img, { ...heroBox, left: heroBox.left + 120 }, false);
        }
      });
      chips.forEach((chip, i) => {
        gsap.set(chip, { autoAlpha: i < parked ? 1 : 0, y: 0 });
      });
      if (copy) gsap.set(copy, { autoAlpha: featured ? 1 : 0, x: 0, y: 0 });
      if (finale) {
        gsap.set(finale, { autoAlpha: step >= SPEAKERS.length ? 1 : 0, y: 0 });
      }
    };

    // Reduced / deep-link
    if (reduced || (from === null && step !== 0) || (!animate && from !== null)) {
      settle();
      return;
    }

    // First enter — Petřina slides in from the right (same element)
    if (from === null && step === 0) {
      chips.forEach((chip) => gsap.set(chip, { autoAlpha: 0 }));
      portraits.forEach((img, i) => {
        if (i === 0) {
          place(img, heroBox, true);
          gsap.set(img, { x: 80, autoAlpha: 0 });
        } else {
          place(img, heroBox, false);
        }
      });
      if (copy) gsap.set(copy, { autoAlpha: 0, x: -24, y: 8 });
      if (finale) gsap.set(finale, { autoAlpha: 0 });
      const intro = gsap.timeline();
      intro.to(portraits[0], { x: 0, autoAlpha: 1, duration: 1.2, ease: EASE.enter }, 0.1);
      if (copy) intro.to(copy, { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: EASE.enter }, 0.28);
      return () => intro.kill();
    }

    if (from === null || !animate) {
      settle();
      return;
    }

    const prev = from;
    const advancing = step > prev;
    if (!advancing) {
      settle();
      return;
    }

    const tl = gsap.timeline();

    // Keep already-parked portraits/chips settled
    portraits.forEach((img, i) => {
      if (i < prev) {
        place(img, chipBox(i), true);
        gsap.set(img, { zIndex: 8 });
      }
      if (i > prev && i !== featIdx) {
        place(img, heroBox, false);
      }
    });
    chips.forEach((chip, i) => {
      gsap.set(chip, { autoAlpha: i < prev ? 1 : 0, y: 0 });
    });

    // Park outgoing: SAME portrait element flies hero → chip (never fades)
    if (prev < SPEAKERS.length) {
      const outgoing = portraits[prev];
      const target = chipBox(prev);
      const chip = chips[prev];
      // Ensure starting at hero (React may have remounted copy, but portrait is persistent)
      place(outgoing, heroBox, true);
      gsap.set(outgoing, { zIndex: 20, autoAlpha: 1 });
      // Chip chrome fades in under the arriving portrait (portrait itself stays opaque)
      if (chip) gsap.set(chip, { autoAlpha: 0, y: 4 });

      tl.to(
        outgoing,
        {
          left: target.left,
          top: target.top,
          width: target.width,
          height: target.height,
          duration: 1.55,
          ease: "sine.inOut",
          zIndex: 8,
        },
        0,
      );
      if (chip) {
        tl.to(chip, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.enter }, 1.05);
      }
    }

    // Outgoing copy leaves gently
    // (copy already swapped to next speaker by React — fade the new copy in after fly)
    if (copy) {
      if (featured) {
        gsap.set(copy, { autoAlpha: 0, x: -20, y: 8 });
        tl.to(copy, { autoAlpha: 1, x: 0, y: 0, duration: 0.95, ease: EASE.enter }, 1.2);
      } else {
        gsap.set(copy, { autoAlpha: 0 });
      }
    }

    // Next featured portrait: continuous slide from the right into hero (no blink)
    if (featIdx >= 0) {
      const incoming = portraits[featIdx];
      place(incoming, heroBox, true);
      gsap.set(incoming, { x: 72, autoAlpha: 1, zIndex: 12 });
      tl.fromTo(
        incoming,
        { x: 72 },
        { x: 0, duration: 1.25, ease: EASE.enter },
        1.15,
      );
    }

    if (finale) {
      if (step >= SPEAKERS.length) {
        gsap.set(finale, { autoAlpha: 0, y: 12 });
        tl.to(finale, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE.enter }, 1.35);
      } else {
        gsap.set(finale, { autoAlpha: 0 });
      }
    }

    return () => {
      tl.kill();
    };
  }, [step, reduced, animate, parked, featured, featIdx]);

  return (
    <div ref={root} className="scene sp-stage">
      <SlideChrome kicker="ZÁVĚR / EXPERIENCE SUMMIT" page="67 / 67" />

      <div className="sp-dock">
        {SPEAKERS.map((s) => (
          <article key={s.id} data-sp-chip={s.id} className="sp-chip">
            <div data-sp-chip-slot className="sp-chip-slot" />
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

      {/* Persistent portraits — never remounted between steps */}
      {SPEAKERS.map((s) => (
        <img
          key={s.id}
          data-sp-portrait={s.id}
          data-art
          className="sp-portrait cutout"
          src={asset(s.photo)}
          alt=""
        />
      ))}

      <div data-sp-finale className="sp-finale">
        <div className="sp-finale-kicker">EXPERIENCE SUMMIT 2026</div>
        <div className="sp-finale-title">
          Pět hlasů, které dnes posouvají experience <em>v praxi</em>.
        </div>
      </div>

      <div data-sp-hero-slot className="sp-hero-slot" aria-hidden="true" />

      <div className="sp-feature">
        {featured && (
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
        )}
      </div>
    </div>
  );
}
