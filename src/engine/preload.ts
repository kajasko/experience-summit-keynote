import { scenes } from "../deck/deck";
import { asset } from "./assets";
import { SCENE_IMAGES } from "./sceneImages";

const AHEAD = 3;
const warmed = new Set<string>();
const keep: HTMLImageElement[] = [];

/** Preload images for the given scene, the previous one and the next few scenes. */
export function preloadAround(sceneId: string) {
  if (typeof window === "undefined") return;
  const at = scenes.findIndex((scene) => scene.id === sceneId);
  if (at < 0) return;
  const ids = scenes.slice(Math.max(0, at - 1), at + 1 + AHEAD).map((scene) => scene.id);
  for (const id of ids) {
    for (const file of SCENE_IMAGES[id] ?? []) {
      if (warmed.has(file)) continue;
      warmed.add(file);
      const image = new Image();
      image.decoding = "async";
      image.src = asset(file);
      void image.decode().catch(() => {});
      keep.push(image);
    }
  }
}
