/** Seconds; no repeat, bounce, or automatic argument advancement. */
export const MOTION = {
  enter: 0.48, exit: 0.18, scene: 0.24, number: 0.56,
  camera: 0.72, cameraVia: 0.9, line: 0.62, y: 12,
  orient: 0, reveal: 0.2, meaning: 0.58, settle: 0.82,
  mask: 0.68, emphasis: 0.36, hold: 0.16,
} as const;
export const EASE = { enter: 'power2.out', exit: 'power1.out', move: 'power2.inOut' } as const;
export function shouldAnimate(reduced: boolean, adjacent = true): boolean { return adjacent && !reduced; }
