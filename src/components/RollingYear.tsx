import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const DIGITS = "0123456789";

/** Fast through the reel, then settle. History waits this long before the cutout. */
export const ROLL = {
  duration: 1.24,
  stagger: 0.06,
  ease: "power4.out",
} as const;

export function rollSettle(chars = 4) {
  return ROLL.duration + Math.max(0, chars - 1) * ROLL.stagger;
}

function fillStrip(strip: HTMLElement, chars: string[]) {
  strip.replaceChildren(
    ...chars.map((ch) => {
      const span = document.createElement("span");
      span.className = "display-gradient";
      span.textContent = ch;
      return span;
    }),
  );
}

function reel(from: string, to: string, dir: number): string[] {
  if (from === to) return [to];
  const step = dir < 0 ? -1 : 1;
  const seq = [from];
  const fromDigit = DIGITS.indexOf(from);
  const toDigit = DIGITS.indexOf(to);
  if (fromDigit >= 0 && toDigit >= 0) {
    let i = fromDigit;
    const distance = ((step === 1 ? toDigit - fromDigit : fromDigit - toDigit) + 10) % 10;
    const turns = 10 + (distance === 0 ? 10 : distance);
    for (let n = 0; n < turns; n += 1) {
      i = (i + step + 10) % 10;
      seq.push(DIGITS[i]);
    }
    if (seq[seq.length - 1] !== to) seq.push(to);
    return seq;
  }
  let i = fromDigit >= 0 ? fromDigit : 0;
  for (let n = 0; n < 10; n += 1) {
    i = (i + step + 10) % 10;
    seq.push(DIGITS[i]);
  }
  seq.push(to);
  return seq;
}

export function RollingYear({
  value,
  size = 168,
  reduced = false,
  adjacent = false,
  dir = 1,
}: {
  value: string;
  size?: number;
  reduced?: boolean;
  adjacent?: boolean;
  dir?: number;
}) {
  const el = useRef<HTMLDivElement>(null);
  const prev = useRef<string | null>(null);

  useLayoutEffect(() => {
    const root = el.current;
    if (!root) return;
    const from = prev.current;
    prev.current = value;
    const play = !reduced && (adjacent || from === null);
    const source = from ?? "0".repeat(value.length);
    const slots = [...root.querySelectorAll<HTMLElement>("[data-slot]")];

    const ctx = gsap.context(() => {
      slots.forEach((slot, index) => {
        const strip = slot.querySelector<HTMLElement>(".roll-strip");
        if (!strip) return;
        const next = value[index] ?? "";
        const start = source[index] ?? (/\d/.test(next) ? "0" : next);
        if (!play || start === next) {
          fillStrip(strip, [next]);
          gsap.set(strip, { yPercent: 0 });
          return;
        }
        const seq = reel(start, next, dir);
        fillStrip(strip, seq);
        gsap.set(strip, { yPercent: 0 });
        gsap.to(strip, {
          yPercent: -((seq.length - 1) / seq.length) * 100,
          duration: ROLL.duration,
          delay: index * ROLL.stagger,
          ease: ROLL.ease,
          overwrite: "auto",
          onComplete: () => {
            fillStrip(strip, [next]);
            gsap.set(strip, { yPercent: 0 });
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      slots.forEach((slot, index) => {
        const strip = slot.querySelector<HTMLElement>(".roll-strip");
        if (!strip) return;
        fillStrip(strip, [value[index] ?? ""]);
        gsap.set(strip, { yPercent: 0 });
      });
    };
  }, [value, adjacent, reduced, dir]);

  return (
    <div
      ref={el}
      className="year-hero roll-year"
      data-year={value}
      aria-label={value}
      style={{ fontSize: size }}
    >
      {Array.from(value).map((ch, index) => (
        <span key={index} className="roll-slot" data-slot aria-hidden="true">
          <span className="roll-strip">
            <span className="display-gradient">{ch}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
