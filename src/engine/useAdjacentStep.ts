import { useLayoutEffect, useRef } from "react";

/** True only when the speaker advanced or reversed by exactly one step in this scene. */
export function useAdjacentStep(step: number): boolean {
  const prev = useRef<number | null>(null);
  const adjacent = prev.current !== null && Math.abs(prev.current - step) === 1;
  useLayoutEffect(() => {
    prev.current = step;
  }, [step]);
  return adjacent;
}
