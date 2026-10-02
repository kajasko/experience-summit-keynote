import type { FlatStep } from "../deck/types";

/** Fade through black only where the two slides share no object. */
export function isColorDip(from: FlatStep, to: FlatStep) {
  return (
    (from.sceneId === "opening" && to.sceneId === "history") ||
    (from.sceneId === "history" && to.sceneId === "opening")
  );
}

/** Magic Move: dark chip on the next question grows into the chapter. */
export function isChapterZoom(from: FlatStep, to: FlatStep) {
  return (
    (from.id === "c1" && to.id === "k1") ||
    (from.id === "cm1" && to.id === "co1") ||
    (from.id === "vm1" && to.id === "ve1") ||
    (from.id === "jm1" && to.id === "ja1")
  );
}

export function isKdoCoreExpand(from: FlatStep, to: FlatStep) {
  return isChapterZoom(from, to);
}

/** Magic Move: zoom into the left člověk card, then the quality line. */
export function isClovekMove(_from: FlatStep, _to: FlatStep) {
  return false;
}
