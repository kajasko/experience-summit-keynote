import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION } from "../engine/motion";
import { dur } from "../engine/usePrefersReducedMotion";

export function IntelligenceLine({
  mode = "bar",
  reduced = false,
  width = 72,
}: {
  mode?: "bar" | "cursor" | "path";
  reduced?: boolean;
  width?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx=gsap.context(() => {
    gsap.set(el, { scaleX: 1, transformOrigin: "left center" });
    if (!reduced) {
      gsap.fromTo(
        el,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: dur(reduced, MOTION.line), ease: EASE.enter },
      );
    }
    },el);
    return () => ctx.revert();
  }, [mode, reduced, width]);
  if (mode === "cursor") return <span className="caret" aria-hidden="true" />;
  return <div ref={ref} className="intel" style={{ width, height: 4 }} />;
}
