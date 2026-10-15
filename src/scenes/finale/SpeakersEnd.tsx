import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { EASE, shouldAnimate } from "../../engine/motion";
import { useAdjacentStep } from "../../engine/useAdjacentStep";
import { SUMMIT_TALKS as SPEAKERS, SUMMIT_PEOPLE as PEOPLE } from "./speakersData";

/** Click-driven speaker sequence — persistent portraits FLIP hero → dock. */

const DUO_SCALE = 1.4;
const DUO_ANCHOR_X = 1880;
/** Extra push of the duo to the right in the hero view. */
const DUO_SHIFT_X = 170;
/** Dock chip: duo portraits are enlarged inside their slot and clipped to it. */
const DUO_CHIP_H = [94, 104];
const DUO_RATIO = [1247 / 1369, 1510 / 1370];

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
    // One entry per talk; a shared talk (03 · LEGO) has two portraits side by side.
    const groups = SPEAKERS.map((t) =>
      t.people.map((p) => el.querySelector<HTMLElement>(`[data-sp-portrait="${p.id}"]`)!),
    );

    const from = prevStep.current;
    prevStep.current = step;

    const heroSlotBox = heroSlot
      ? stageBox(heroSlot, stage, sx)
      : { left: 1100, top: 200, width: 760, height: 860 };

    type Box = { left: number; top: number; width: number; height: number; clip?: { t: number; r: number; b: number; l: number } };
    const clipOf = (b: Box) => b.clip ? `inset(${b.clip.t}px ${b.clip.r}px ${b.clip.b}px ${b.clip.l}px)` : "inset(0px 0px 0px 0px)";
    const heroBoxes = (i: number): Box[] => {
      const n = SPEAKERS[i].people.length;
      if (n === 1) return [heroSlotBox];
      // Duo: Michaela (k=0) in front, Kryštof (k=1) behind and offset right, same
      // size. Both bottom-flush. The pair is nudged left so his arm clears the corner logo.
      const W = heroSlotBox.width;
      const H = heroSlotBox.height;
      // Her cutout is a tighter crop than his, so she gets a slightly smaller box and he a
      // taller one: on screen their heads read the same size. Both boxes end at the bottom edge.
      const back = { left: heroSlotBox.left + W - W * 0.66 - 170, top: heroSlotBox.top - H * 0.08, width: W * 0.66, height: H * 1.08 };
      const front = { left: back.left - W * 0.36, top: heroSlotBox.top + H * 0.1, width: W * 0.56, height: H * 0.9 };
      // Scale the duo up (bottom-right anchored) so their heads read the same size as Jakub/Dejan.
      const F = DUO_SCALE, ax = DUO_ANCHOR_X, ay = heroSlotBox.top + H;
      const grow = (b: Box): Box => ({ left: ax + (b.left - ax) * F + DUO_SHIFT_X, top: ay + (b.top - ay) * F, width: b.width * F, height: b.height * F });
      return [grow(front), grow(back)];
    };

    const chipBoxes = (i: number): Box[] => {
      const slots = chips[i] ? gsap.utils.toArray<HTMLElement>("[data-sp-chip-slot]", chips[i]) : [];
      const duo = SPEAKERS[i].people.length > 1;
      return SPEAKERS[i].people.map((_, k) => {
        const s = slots[k] ? stageBox(slots[k], stage, sx) : { left: 80 + i * 360 + k * 70, top: 100, width: 88, height: 110 };
        if (!duo) return s;
        // Size each duo portrait so the head matches Jakub/Dejan in their chips; bottom-flush, centred, sides clipped to the slot.
        const h = DUO_CHIP_H[k] ?? s.height;
        const w = h * (DUO_RATIO[k] ?? 1);
        const b = { left: s.left + s.width / 2 - w / 2, top: s.top + s.height - h, width: w, height: h };
        const side = Math.max(0, (w - s.width) / 2 - 8);
        return { ...b, clip: { t: 0, r: side, b: 0, l: side } };
      });
    };

    const place = (img: HTMLElement, box: Box, visible: boolean) => {
      gsap.set(img, {
        clipPath: clipOf(box),
        maxWidth: "none",
        maxHeight: "none",
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

    const each = (i: number, fn: (img: HTMLElement, k: number) => void) => groups[i].forEach(fn);

    const settle = () => {
      groups.forEach((imgs, i) => {
        const hero = heroBoxes(i);
        const dock = chipBoxes(i);
        imgs.forEach((img, k) => {
          if (i < parked) {
            place(img, dock[k], true);
            gsap.set(img, { zIndex: 8 });
          } else if (i === featIdx) {
            place(img, hero[k], true);
            gsap.set(img, { zIndex: 13 - k });
          } else {
            place(img, { ...hero[k], left: hero[k].left + 120 }, false);
          }
        });
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

    // First enter — first talk slides in from the right (same element)
    if (from === null && step === 0) {
      chips.forEach((chip) => gsap.set(chip, { autoAlpha: 0 }));
      groups.forEach((imgs, i) => {
        const hero = heroBoxes(i);
        imgs.forEach((img, k) => {
          place(img, hero[k], i === 0);
          if (i === 0) gsap.set(img, { x: 80, autoAlpha: 0 });
        });
      });
      if (copy) gsap.set(copy, { autoAlpha: 0, x: -24, y: 8 });
      if (finale) gsap.set(finale, { autoAlpha: 0 });
      const intro = gsap.timeline();
      intro.to(groups[0], { x: 0, autoAlpha: 1, duration: 1.2, ease: EASE.enter, stagger: 0.12 }, 0.1);
      if (copy) intro.to(copy, { autoAlpha: 1, x: 0, y: 0, duration: 1.0, ease: EASE.enter }, 0.28);
      return () => intro.kill();
    }

    if (from === null || !animate || step <= from) {
      settle();
      return;
    }

    const prev = from;
    const tl = gsap.timeline();

    // Keep already-parked portraits/chips settled; hide future ones
    groups.forEach((imgs, i) => {
      const dock = chipBoxes(i);
      const hero = heroBoxes(i);
      imgs.forEach((img, k) => {
        if (i < prev) {
          place(img, dock[k], true);
          gsap.set(img, { zIndex: 8 });
        }
        if (i > prev && i !== featIdx) place(img, hero[k], false);
      });
    });
    chips.forEach((chip, i) => {
      gsap.set(chip, { autoAlpha: i < prev ? 1 : 0, y: 0 });
    });

    // Park outgoing: SAME portrait elements fly hero → chip (never fade)
    if (prev < SPEAKERS.length) {
      const hero = heroBoxes(prev);
      const dock = chipBoxes(prev);
      const chip = chips[prev];
      each(prev, (img, k) => {
        place(img, hero[k], true);
        gsap.set(img, { zIndex: 21 - k, autoAlpha: 1 });
        tl.to(img, { left: dock[k].left, top: dock[k].top, width: dock[k].width, height: dock[k].height, clipPath: clipOf(dock[k]), duration: 1.55, ease: "sine.inOut", zIndex: 8 }, k * 0.08);
      });
      if (chip) {
        gsap.set(chip, { autoAlpha: 0, y: 4 });
        tl.to(chip, { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE.enter }, 1.05);
      }
    }

    if (copy) {
      if (featured) {
        gsap.set(copy, { autoAlpha: 0, x: -20, y: 8 });
        tl.to(copy, { autoAlpha: 1, x: 0, y: 0, duration: 0.95, ease: EASE.enter }, 1.2);
      } else {
        gsap.set(copy, { autoAlpha: 0 });
      }
    }

    // Next featured talk: continuous slide from the right into hero (no blink)
    if (featIdx >= 0) {
      const hero = heroBoxes(featIdx);
      each(featIdx, (img, k) => {
        place(img, hero[k], true);
        gsap.set(img, { x: 72, autoAlpha: 1, zIndex: 13 - k });
        tl.fromTo(img, { x: 72 }, { x: 0, duration: 1.25, ease: EASE.enter }, 1.15 + k * 0.12);
      });
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
        {SPEAKERS.map((t) => (
          <article key={t.id} data-sp-chip={t.id} className={`sp-chip${t.people.length > 1 ? " is-pair" : ""}`}>
            <div className="sp-chip-slots">
              {t.people.map((p) => <div key={p.id} data-sp-chip-slot className="sp-chip-slot" />)}
            </div>
            <div className="sp-chip-body">
              <span className="sp-chip-n">{t.n}</span>
              <div className="sp-chip-name">{t.people.length > 1 ? "Michaela & Kryštof" : t.people[0].name}</div>
              <div className="sp-chip-role">
                {t.people[0].org} · {t.time}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Persistent portraits — never remounted between steps */}
      {PEOPLE.map((p) => (
        <img
          key={p.id}
          data-sp-portrait={p.id}
          data-art
          className="sp-portrait cutout"
          src={asset(p.photo)}
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
          <div data-sp-copy className={`sp-feature-copy${featured.people.length > 1 ? " is-pair" : ""}`}>
            <div className="sp-feature-n">{featured.n}</div>
            <div className="sp-feature-time">{featured.time}</div>
            <h2 className="sp-feature-topic">{featured.topic}</h2>
            {featured.people.map((p) => (
              <div key={p.id} className="sp-feature-person">
                <div className="sp-feature-name">{p.name}</div>
                <div className="sp-feature-role">
                  {p.role}
                  <span className="sp-feature-org"> · {p.org}</span>
                </div>
              </div>
            ))}
            <img
              className="sp-feature-logo"
              src={asset(featured.logo.src)}
              alt={featured.logo.alt}
              style={{ height: featured.logo.h }}
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
