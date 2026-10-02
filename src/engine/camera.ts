import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { dur } from "./usePrefersReducedMotion";
import { EASE, MOTION } from "./motion";

export type CamPose = { x: number; y: number; scale: number };

export const STAGE_CX = 960;
export const STAGE_CY = 540;

export function applyCam(el: HTMLElement, p: CamPose): void {
  el.style.transform = `translate(${STAGE_CX - p.x * p.scale}px, ${STAGE_CY - p.y * p.scale}px) scale(${p.scale})`;
  el.style.transformOrigin = "0 0";
}

export function roomPose(left: number, top: number, scale = 1): CamPose {
  return { x: left + STAGE_CX, y: top + STAGE_CY, scale };
}

export function useCamera(
  worldRef: RefObject<HTMLDivElement | null>,
  pose: CamPose,
  opts: {
    reduced: boolean;
    adjacent: boolean;
    via?: CamPose | null;
    duration?: number;
    fromScale?: number;
  },
): void {
  const stored = useRef<CamPose | null>(null);
  const viaKey = opts.via ? `${opts.via.x}:${opts.via.y}:${opts.via.scale}` : "";
  const poseKey = `${pose.x}:${pose.y}:${pose.scale}`;

  useLayoutEffect(() => {
    const el = worldRef.current;
    if (!el) return;

    const duration = dur(opts.reduced, opts.duration ?? (opts.via ? MOTION.cameraVia : MOTION.camera));
    let from = stored.current;
    if (!from && opts.fromScale && opts.fromScale !== pose.scale) {
      from = { ...pose, scale: opts.fromScale };
    }

    if (!from || !opts.adjacent || opts.reduced || duration <= 0.05) {
      applyCam(el, pose);
      stored.current = { ...pose };
      return;
    }

    const proxy = { x: from.x, y: from.y, scale: from.scale };
    const render = () => applyCam(el, proxy);
    render();

    const tl = gsap.timeline({
      onUpdate: render,
      onComplete: () => {
        stored.current = { ...pose };
      },
    });

    if (opts.via) {
      tl.to(proxy, {
        x: opts.via.x,
        y: opts.via.y,
        scale: opts.via.scale,
        duration: duration * 0.38,
        ease: EASE.move,
      });
      tl.to(proxy, {
        x: pose.x,
        y: pose.y,
        scale: pose.scale,
        duration: duration * 0.62,
        ease: EASE.move,
      });
    } else {
      tl.to(proxy, {
        x: pose.x,
        y: pose.y,
        scale: pose.scale,
        duration,
        ease: EASE.move,
      });
    }

    return () => {
      tl.kill();
      stored.current = { x: proxy.x, y: proxy.y, scale: proxy.scale };
    };
  }, [worldRef, poseKey, viaKey, opts.reduced, opts.adjacent, opts.duration, opts.fromScale, pose.x, pose.y, pose.scale, opts.via?.x, opts.via?.y, opts.via?.scale]);
}
