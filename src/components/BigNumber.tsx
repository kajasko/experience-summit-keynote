import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { dur } from "../engine/usePrefersReducedMotion";
import { EASE, MOTION } from "../engine/motion";

export function BigNumber({
  value,
  suffix = "%",
  reduced = false,
}: {
  value: number;
  suffix?: string;
  reduced?: boolean;
}) {
  const numRef = useRef<HTMLSpanElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const shown = useRef(value);

  useLayoutEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const obj = { v: shown.current };
    const count = gsap.to(obj, {
      v: value,
      duration: dur(reduced, MOTION.number),
      ease: EASE.enter,
      overwrite: "auto",
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v));
      },
      onComplete: () => {
        shown.current = value;
      },
    });
    const fade = wrap.current
      ? gsap.fromTo(wrap.current, { opacity: 0.82 }, { opacity: 1, duration: dur(reduced, MOTION.emphasis), overwrite: "auto" })
      : null;
    return () => {
      count.kill();
      fade?.kill();
      shown.current = value;
      el.textContent = String(value);
    };
  }, [value, reduced]);

  return (
    <div ref={wrap} className="stat" style={{ display: "flex", alignItems: "flex-end", gap: 8, overflow: "visible" }}>
      <span ref={numRef} className="display-gradient">{value}</span>
      <span className="display-gradient" style={{ fontSize: "0.38em", letterSpacing: "-0.04em" }}>{suffix}</span>
    </div>
  );
}
